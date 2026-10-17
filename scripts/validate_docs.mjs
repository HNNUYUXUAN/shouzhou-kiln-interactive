import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const check = (ok, message) => { if (!ok) errors.push(message) }
const read = p => fs.readFileSync(path.join(root, p), 'utf8')
const json = p => JSON.parse(read(p))
const walk = dir => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(e => {
  if (e.name.startsWith('.') || ['node_modules', 'dist', 'work'].includes(e.name)) return []
  const p = path.posix.join(dir, e.name)
  if (e.isSymbolicLink()) { errors.push(`Unsupported symlink: ${p}`); return [] }
  return e.isDirectory() ? walk(p) : [p]
})
const slug = s => s.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '').replace(/ /g, '-')
const headingIds = text => {
  const ids = new Set(); const counts = new Map()
  for (const [, heading] of text.replace(/```[^]*?```/g, '').matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const base = slug(heading), n = counts.get(base) ?? 0
    ids.add(base + (n ? `-${n}` : '')); counts.set(base, n + 1)
  }
  return ids
}
let links = 0
for (const file of walk('').filter(p => p.endsWith('.md'))) {
  const text = read(file)
  for (const [, block] of text.matchAll(/```json\s*\n([^]*?)```/g)) {
    try { JSON.parse(block) } catch (e) { errors.push(`${file}: invalid JSON example: ${e.message}`) }
  }
  const prose = text.replace(/```[^]*?```/g, '')
  for (const [, target] of prose.matchAll(/!?\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
    if (/^[a-z][a-z\d+.-]*:/i.test(target)) continue
    const [name, rawFragment] = target.split('#')
    const resolved = name ? path.resolve(root, path.dirname(file), decodeURIComponent(name)) : path.join(root, file)
    const relative = path.relative(root, resolved)
    if (relative.startsWith('..') || path.isAbsolute(relative)) { errors.push(`${file}: outside repository: ${target}`); continue }
    if (!fs.existsSync(resolved)) { errors.push(`${file}: missing link ${target}`); continue }
    if (rawFragment && resolved.endsWith('.md')) check(headingIds(fs.readFileSync(resolved, 'utf8')).has(decodeURIComponent(rawFragment)), `${file}: missing heading ${target}`)
    links++
  }
}
const catalog = json('docs/catalog.json')
check(catalog.count === catalog.records.length, 'Catalog count mismatch')
check(new Set(catalog.records.map(r => r.archiveId)).size === catalog.count, 'Duplicate catalog IDs')
for (const r of catalog.records) for (const p of Object.values(r.files).filter(Boolean)) check(fs.existsSync(path.join(root, p)), `${r.archiveId}: missing file ${p}`)
check(read('llm.txt') === read('llms.txt'), 'llm.txt alias differs')
const metadata = json('codemeta.json')
const pkg = json('package.json')
check(metadata.url === pkg.homepage, 'CodeMeta homepage mismatch')
check(metadata.codeRepository === pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''), 'CodeMeta repository mismatch')
check(metadata.author?.[0]?.name === '缪雨轩', 'CodeMeta author mismatch')
const citation = read('CITATION.cff')
for (const value of [metadata.url, metadata.codeRepository, 'family-names: "缪"', 'given-names: "雨轩"', 'license: MIT']) check(citation.includes(value), `Citation missing ${value}`)
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
else console.log(`Documentation verified: ${links} local links, ${catalog.count} catalog records, citation metadata and JSON examples.`)
