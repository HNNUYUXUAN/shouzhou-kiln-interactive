import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const archiveDirectory = path.join(projectRoot, 'public', 'assets', 'ceramics', 'archive')
const runtimePath = path.join(projectRoot, 'src', 'data', 'shouzhou_ceramics.json')
const indexPath = path.join(archiveDirectory, 'index.json')
const allowedHiddenFields = new Set([
  'dynasty',
  'period',
  'dimensions',
  'excavation',
  'collection',
  'description',
  'highlightTags',
  'technicalFeatures',
  'historicalSignificance',
])

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

const runtimeRecords = readJson(runtimePath)
const indexRecords = readJson(indexPath)
const indexByArchiveId = new Map(indexRecords.map((record) => [record.archiveId, record]))
const errors = []
const ids = new Set()
const archiveIds = new Set()

if (!Array.isArray(runtimeRecords) || runtimeRecords.length === 0) {
  errors.push('运行数据必须是非空数组')
}
if (indexRecords.length !== runtimeRecords.length) {
  errors.push(`索引数量 ${indexRecords.length} 与运行数据数量 ${runtimeRecords.length} 不一致`)
}

for (const record of runtimeRecords) {
  const label = record.archiveId || record.id || 'unknown-record'
  for (const field of ['id', 'archiveId', 'name', 'nameEn', 'assetSlug', 'imageUrl', 'thumbnailUrl']) {
    if (!isNonEmptyString(record[field])) {
      errors.push(`${label}: 缺少必填字段 ${field}`)
    }
  }

  if (ids.has(record.id)) errors.push(`${label}: id 重复 (${record.id})`)
  if (archiveIds.has(record.archiveId)) errors.push(`${label}: archiveId 重复 (${record.archiveId})`)
  ids.add(record.id)
  archiveIds.add(record.archiveId)

  for (const field of record.hiddenFields || []) {
    if (!allowedHiddenFields.has(field)) {
      errors.push(`${label}: 未知 hiddenFields 值 ${field}`)
    }
  }

  for (const field of ['mouthDiameter', 'baseDiameter', 'height']) {
    const value = record.dimensions?.[field]
    if (typeof value === 'number' && value < 0) {
      errors.push(`${label}: dimensions.${field} 不能为负数`)
    }
  }

  for (const field of ['imageUrl', 'thumbnailUrl', 'processedImageUrl']) {
    const assetPath = record[field]
    if (!assetPath) continue
    if (!assetPath.startsWith('/assets/ceramics/') || assetPath.includes('..') || assetPath.includes('\\')) {
      errors.push(`${label}: ${field} 不是安全的站内资源路径`)
      continue
    }
    const absolutePath = path.join(projectRoot, 'public', assetPath.slice(1))
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      errors.push(`${label}: ${field} 指向的文件不存在 (${assetPath})`)
    }
  }

  const sidecarPath = path.join(archiveDirectory, `${record.archiveId}.json`)
  if (!fs.existsSync(sidecarPath)) {
    errors.push(`${label}: 缺少解析件 ${record.archiveId}.json`)
    continue
  }

  const sidecar = readJson(sidecarPath)
  const indexRecord = indexByArchiveId.get(record.archiveId)
  const expectedBaseName = `${record.archiveId}-${record.assetSlug}`
  for (const [sourceName, sourceRecord] of [['解析件', sidecar], ['索引', indexRecord]]) {
    if (!sourceRecord) {
      errors.push(`${label}: ${sourceName}记录不存在`)
      continue
    }
    if (sourceRecord.titleZh !== record.name) errors.push(`${label}: ${sourceName}中文名不同步`)
    if (sourceRecord.titleEn !== record.nameEn) errors.push(`${label}: ${sourceName}英文名不同步`)
    if (sourceRecord.assetSlug !== record.assetSlug) errors.push(`${label}: ${sourceName} assetSlug 不同步`)
    if (sourceRecord.targetBaseName !== expectedBaseName) errors.push(`${label}: ${sourceName} targetBaseName 不同步`)
  }

  if (indexRecord) {
    if (indexRecord.id !== record.id) errors.push(`${label}: 索引 id 不同步`)
    if (indexRecord.imageUrl !== record.imageUrl) errors.push(`${label}: 索引 imageUrl 不同步`)
    if ((indexRecord.processedImageUrl || '') !== (record.processedImageUrl || '')) {
      errors.push(`${label}: 索引 processedImageUrl 不同步`)
    }
  }
}

const sidecarCount = fs.readdirSync(archiveDirectory).filter((name) => /^szk-\d{3}\.json$/.test(name)).length
if (sidecarCount !== runtimeRecords.length) {
  errors.push(`解析件数量 ${sidecarCount} 与运行数据数量 ${runtimeRecords.length} 不一致`)
}

if (errors.length > 0) {
  console.error(`数据验证失败，共 ${errors.length} 项：`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`数据验证通过：${runtimeRecords.length} 条运行数据、索引与解析件一致，资源路径完整。`)
}
