import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const errors = []
const check = (condition, message) => { if (!condition) errors.push(message) }

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`素材目录不接受符号链接：${file}`)
    return entry.isDirectory() ? walk(file) : [path.relative(root, file).split(path.sep).join('/')]
  })
}

try {
  const manifest = readJson('docs/asset-rights.json')
  const runtime = readJson('src/data/shouzhou_ceramics.json')
  const index = new Map(readJson('public/assets/ceramics/archive/index.json').map((r) => [r.archiveId, r]))
  check(manifest.schemaVersion === 2, '不支持的清单版本')
  check(Array.isArray(manifest.records), 'records 必须是数组')
  check(Array.isArray(manifest.sharedFiles), 'sharedFiles 必须是数组')
  if (errors.length) throw new Error(errors.join('\n'))
  const authorizationIds = new Set(manifest.authorizations.map((a) => a.id))
  const sourceIds = new Set(manifest.sources.map((s) => s.id))
  check(authorizationIds.size === manifest.authorizations.length, '重复授权标识')
  check(sourceIds.size === manifest.sources.length, '重复来源标识')
  const validReference = (name) => {
    if (typeof name !== 'string' || !name || path.isAbsolute(name) || name.includes('\\') || name.includes(':') || name.split('/').some(p => !p || p === '..' || p === '.')) return false
    const absolute = path.resolve(root, name)
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return false
    const relative = path.relative(fs.realpathSync(root), fs.realpathSync(absolute))
    return !relative.startsWith('..') && !path.isAbsolute(relative)
  }
  const records = new Map()
  const listedFiles = new Set()
  let pending = 0
  let noncommercial = 0

  const checkFile = (entry) => {
    const name = entry?.path
    if (typeof name !== 'string' || !name || path.isAbsolute(name) || name.includes('\\') || name.includes(':') || name.split('/').some((p) => !p || p === '..' || p === '.')) {
      errors.push('清单包含无效的相对文件路径')
      return
    }
    check(!listedFiles.has(name), `重复文件：${name}`)
    listedFiles.add(name)
    const absolute = path.resolve(root, name)
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      errors.push(`文件不存在：${name}`)
      return
    }
    const relativeReal = path.relative(fs.realpathSync(root), fs.realpathSync(absolute))
    if (relativeReal.startsWith('..') || path.isAbsolute(relativeReal)) {
      errors.push(`文件超出项目目录：${name}`)
      return
    }
    check(/^[a-f0-9]{64}$/.test(entry.sha256 || ''), `SHA-256 格式错误：${name}`)
    const expectedMode = name.endsWith('.json') ? 'utf8-lf' : 'raw-bytes'
    check(entry.hashMode === expectedMode, `哈希模式错误：${name}`)
    const bytes = fs.readFileSync(absolute)
    const content = expectedMode === 'utf8-lf' ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes
    const digest = createHash('sha256').update(content).digest('hex')
    check(digest === entry.sha256, `文件版本与清单不同：${name}`)
  }

  for (const record of manifest.records) {
    check(!records.has(record.archiveId), `重复档案：${record.archiveId}`)
    records.set(record.archiveId, record)
    check(authorizationIds.has(record.authorizationId), `${record.archiveId} 缺少授权记录引用`)
    check(sourceIds.has(record.sourceReference), `${record.archiveId} 缺少来源记录引用`)
    check(typeof record.rightsStatus === 'string' && record.rightsStatus.length > 0, `${record.archiveId} 缺少权利状态`)
    check(['not-confirmed', 'confirmed', 'noncommercial'].includes(record.publicRedistribution), `${record.archiveId} 缺少有效的公开再分发状态`)
    if (record.publicRedistribution === 'not-confirmed') pending++
    if (record.publicRedistribution === 'noncommercial') {
      noncommercial++
      const auth = manifest.authorizations.find((a) => a.id === record.authorizationId)
      check(auth?.publicRedistribution === 'noncommercial' && auth?.commercialUse === 'prohibited'
        && typeof auth?.authorizationSource === 'string' && auth.authorizationSource.trim().length > 0
        && /^\d{4}-\d{2}-\d{2}$/.test(auth?.recordedOn || '')
        && Array.isArray(auth?.uses) && auth.uses.includes('noncommercial-distribution')
        && validReference(auth?.termsReference) && validReference(auth?.termsReferenceEn),
      `${record.archiveId} 缺少非商用条款、来源或用途限制`)
    }
    if (record.publicRedistribution === 'confirmed') {
      const auth = manifest.authorizations.find((a) => a.id === record.authorizationId)
      check(auth?.publicRedistribution === 'confirmed' && validReference(auth?.documentReference),
        `${record.archiveId} 缺少相应授权文件引用`)
    }
    if (!Array.isArray(record.files)) { errors.push(`${record.archiveId} 缺少 files`); continue }
    record.files.forEach(checkFile)
  }
  check(records.size === runtime.length, '清单档案数量与运行数据不同')
  for (const record of runtime) {
    const item = records.get(record.archiveId)
    if (!item) { errors.push(`清单未覆盖 ${record.archiveId}`); continue }
    const sidecar = readJson(`public/assets/ceramics/archive/${record.archiveId}.json`)
    check(item.runtimeId === record.id && item.title === record.name, `${record.archiveId} 名称或运行 ID 不同步`)
    const metadataKeys = ['isAIExtracted', 'imageProcessed', 'imageProcessedBy', 'extractedAt']
    for (const key of metadataKeys) {
      check(item.processingMetadata?.[key] === record[key], `${record.archiveId} 加工元数据 ${key} 不同步`)
    }
    check(Boolean(item.sourceFileName) && item.sourceFileName === index.get(record.archiveId)?.sourceFileName && item.sourceFileName === sidecar.sourceFileName,
      `${record.archiveId} 原文件名与档案不同步`)
    const expected = new Map([
      ['archive-image', `public${record.imageUrl}`],
      ['thumbnail', `public${record.thumbnailUrl}`],
      ['archive-text', `public/assets/ceramics/archive/${record.archiveId}.json`],
    ])
    if (record.processedImageUrl) expected.set('processed-image', `public${record.processedImageUrl}`)
    check(item.files.length === expected.size, `${record.archiveId} 关联文件数量不正确`)
    for (const [role, name] of expected) {
      check(item.files.filter((f) => f.role === role && f.path === name).length === 1, `${record.archiveId} 未正确关联 ${role}`)
    }
  }
  manifest.sharedFiles.forEach(checkFile)
  const visuals = readJson('docs/assets/manifest.json')
  check(visuals.schemaVersion === 1 && validReference(`docs/assets/${visuals.terms}`), '无效的视觉素材条款引用')
  for (const visual of visuals.files) {
    check(['application-screenshot', 'generated-illustration'].includes(visual.kind), '无效的视觉素材类型')
    check(typeof visual.source === 'string' && visual.source.length > 0, '视觉素材缺少来源')
    check(visual.usage === 'noncommercial-learning-and-exchange', '视觉素材用途不匹配')
    checkFile({ ...visual, path: `docs/assets/${visual.path}`, hashMode: 'raw-bytes' })
  }
  const inScope = new Set([
    ...walk(path.join(root, 'public/assets/ceramics')).filter((name) => !name.endsWith('/README.md')),
    ...walk(path.join(root, 'artifacts')).filter((name) => /\.(png|jpe?g|webp|gif|svg|pdf)$/i.test(name)),
    ...walk(path.join(root, 'docs/assets')).filter(name => /\.(png|jpe?g|webp|gif|svg|pdf)$/i.test(name)),
    'src/data/shouzhou_ceramics.json',
  ])
  for (const name of inScope) check(listedFiles.has(name), `未登记素材：${name}`)
  for (const name of listedFiles) check(inScope.has(name), `清单含范围外文件：${name}`)
  if (errors.length) {
    console.error(`素材清单核对失败，共 ${errors.length} 项：\n${errors.map((e) => `- ${e}`).join('\n')}`)
    process.exitCode = 1
  } else {
    console.log(`素材清单核对通过：${records.size} 件文物，${listedFiles.size} 个文件版本一致。`)
    console.log(`非商用分发：${noncommercial} 件；不得商用。`)
    console.log(`公开再分发尚待确认：${pending} 件。`)
  }
} catch (error) {
  console.error(`素材清单无法完成核对：${error.message}`)
  process.exitCode = 1
}
