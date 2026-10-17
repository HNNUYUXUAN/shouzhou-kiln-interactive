import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n')
const json = (p) => JSON.parse(read(p))
const repo = 'https://github.com/HNNUYUXUAN/shouzhou-kiln-interactive'
const blob = `${repo}/blob/main/`
const artifacts = json('src/data/shouzhou_ceramics.json')
const rights = json('docs/asset-rights.json')
const byId = new Map(rights.records.map(r => [r.archiveId, r]))
const files = new Map()
const add = (p, s) => files.set(p, s.trimEnd() + '\n')
const rows = artifacts.map(a => {
  const r = byId.get(a.archiveId)
  if (!r) throw new Error(`Missing material record: ${a.archiveId}`)
  return {
    archiveId: a.archiveId, runtimeId: a.id, nameZh: a.name, nameEn: a.nameEn ?? '',
    dynasty: a.dynasty ?? '', period: a.period ?? '', tags: a.highlightTags ?? [],
    files: { runtime: 'src/data/shouzhou_ceramics.json',
      archiveImage: `public${a.imageUrl}`, processedImage: a.processedImageUrl ? `public${a.processedImageUrl}` : null,
      thumbnail: `public${a.thumbnailUrl}`, archiveRecord: `public/assets/ceramics/archive/${a.archiveId}.json` },
    sourceReference: r.sourceReference, authorizationId: r.authorizationId,
  }
})
add('docs/catalog.json', JSON.stringify({ schemaVersion: 1, project: repo,
  gallery: 'https://shouzhou-kiln-interactive.yuxuan.wiki/',
  materialTerms: ['ASSET_LICENSE.md', 'ASSET_LICENSE.en.md'], count: rows.length, records: rows }, null, 2))
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/[\r\n]/g, ' ')
for (const en of [false, true]) {
  const names = en ? ['Artifact material inventory', '[简体中文](ASSET_INVENTORY.md) · [Material terms](../ASSET_LICENSE.en.md)',
    'ID | Name | Original filename | Printed page | Terms', 'noncommercial'] :
    ['文物素材清单', '[English](ASSET_INVENTORY.en.md) · [素材条款](../ASSET_LICENSE.md)',
      '档案标识 | 名称 | 原文件名 | 印刷页码 | 用途', '非商用']
  let s = `# ${names[0]}\n\n${names[1]}\n\n`
  s += en
    ? `${rows.length} artifacts. Authorization source: School of Art and Design, Huainan Normal University (淮南师范学院美术与设计学院). Source references, file versions and processing metadata are in [asset-rights.json](asset-rights.json).\n\nThe source filename preserves the title 《寿州窑》 and its original numbering. Bibliographic edition and printed page numbers remain unverified; blank cells retain unknown values. Filename suffixes are not printed page references.\n\n`
    : `${rows.length} 件文物。授权来源为淮南师范学院美术与设计学院。来源引用、文件版本和加工元数据见 [asset-rights.json](asset-rights.json)。\n\n原文件名保留《寿州窑》及原始编号。书目版本和印刷页码尚未核实，未知字段留空；文件后缀序号不作为印刷页码。\n\n`
  s += `| ${names[2]} |\n| --- | --- | --- | --- | --- |\n`
  for (const a of rows) {
    const r = byId.get(a.archiveId)
    s += `| [${a.archiveId}](../${a.files.archiveRecord}) | ${cell(en ? a.nameEn : a.nameZh)} | ${cell(r.sourceFileName)} | ${cell(r.printedPage)} | ${cell(r.publicRedistribution === 'noncommercial' ? names[3] : r.publicRedistribution)} |\n`
  }
  add(`docs/ASSET_INVENTORY${en ? '.en' : ''}.md`, s)
}
const pairs = [
  ['README', 'Project overview / 项目首页'], ['docs/USAGE', 'Use the gallery / 使用指南'],
  ['docs/DEVELOPMENT', 'Develop and maintain content / 开发与内容维护'],
  ['docs/AGENT_GUIDE', 'Agent reading and reproduction / Agent 阅读与复现'],
  ['docs/DISCOVERY', 'Discovery and citation / 检索与引用'],
  ['CONTRIBUTING', 'Contribute / 参与贡献'], ['MAINTENANCE', 'Maintenance / 维护'],
  ['ASSET_LICENSE', 'Material terms / 素材条款'],
  ['docs/ASSET_INVENTORY', 'Artifact sources / 文物来源'],
  ['THIRD_PARTY_NOTICES', 'Software notices / 软件声明'],
]
let nav = `# Shouzhou Kiln Interactive Gallery / 寿州窑交互展台\n\n> A React gallery of ${rows.length} artifacts, with archive comparison and fullscreen reading. / 包含 ${rows.length} 件文物、档案对照与全屏阅读的 React 展台。\n\nCode and original engineering text: MIT. Artifact materials and documentation visuals: noncommercial learning, exchange and distribution under their linked terms. / 代码与原创工程文字采用 MIT；文物素材与文档图片按所链接条款用于交流学习与非商用分发。\n\n## Experience\n\n- [Live gallery / 在线展台](https://shouzhou-kiln-interactive.yuxuan.wiki/)\n\n## Guides\n\n`
for (const [base, label] of pairs) for (const [suffix, lang] of [['.md', '中文'], ['.en.md', 'English']]) {
  nav += `- [${label} · ${lang}](${blob}${base}${suffix})\n`
}
nav += `\n## Structured resources\n\n`
for (const [p, label] of [['docs/catalog.json', 'Artifact catalog / 文物目录'], ['docs/asset-rights.json', 'Material manifest / 素材清单'], ['AGENTS.md', 'Repository conventions'], ['AGENTS.zh-CN.md', '仓库开发约定'], ['CITATION.cff', 'Citation'], ['codemeta.json', 'CodeMeta'], ['llms-full.txt', 'Full guides / 完整指南'], ['LICENSE', 'MIT license']]) nav += `- [${label}](${blob}${p})\n`
add('llms.txt', nav); add('llm.txt', nav)

// Resolve source-relative Markdown links for consumers reading the combined text.
function absoluteLinks(text, source) {
  return text.replace(/(!?\[[^\]\n]*\]\()([^\s)]+)(\))/g, (_, left, target, right) => {
    if (/^[a-z][a-z\d+.-]*:/i.test(target)) return left + target + right
    const [name, fragment] = target.split('#')
    const resolved = name ? path.posix.normalize(path.posix.join(path.posix.dirname(source), name)) : source
    return left + blob + resolved + (fragment ? `#${fragment}` : '') + right
  })
}
let full = nav + '\n---\n'
for (const p of [...pairs.flatMap(([p]) => [p + '.md', p + '.en.md']), 'AGENTS.md', 'AGENTS.zh-CN.md', 'docs/assets/README.md']) {
  full += `\nSource: ${blob}${p}\n\n` + absoluteLinks(files.get(p) ?? read(p), p) + '\n\n---\n'
}
add('llms-full.txt', full)
let stale = 0
for (const [p, expected] of files) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(path.join(root, p)) || read(p) !== expected) { console.error(`Out of date: ${p} (run npm run docs:generate)`); stale++ }
  } else fs.writeFileSync(path.join(root, p), expected)
}
if (stale) process.exitCode = 1
else console.log(`${process.argv.includes('--check') ? 'Verified' : 'Generated'} ${files.size} discovery files for ${rows.length} artifacts.`)
