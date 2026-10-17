import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
const query = process.argv.slice(2).join(' ').trim().toLocaleLowerCase()
if (!query) {
  console.error('Usage: npm run catalog:search -- <archive ID or keywords>')
  process.exitCode = 1
} else {
  const catalog = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../docs/catalog.json', import.meta.url)), 'utf8'))
  const words = query.split(/\s+/)
  console.log(JSON.stringify(catalog.records.filter(r => {
    const text = [r.archiveId, r.runtimeId, r.nameZh, r.nameEn, r.dynasty, r.period, ...r.tags].join(' ').toLocaleLowerCase()
    return words.every(word => text.includes(word))
  }), null, 2))
}
