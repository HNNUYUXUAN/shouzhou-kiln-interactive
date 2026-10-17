import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import {
  BookOpen,
  Building2,
  Code2,
  MapPin,
  Ruler,
  ScrollText,
  Sparkles,
  Tag,
  X,
} from 'lucide-react'
import { isCeramicFieldVisible } from '../constants'

function DetailSection({ icon: Icon, title, children, accent = 'bronze' }) {
  const accentClasses =
    accent === 'celadon'
      ? 'border-celadon-600/30 bg-celadon-950/20 shadow-[0_16px_40px_rgba(25,61,45,0.2)]'
      : 'border-bronze-700/35 bg-black/25 shadow-[0_16px_40px_rgba(0,0,0,0.24)]'

  return (
    <section className={`rounded-[24px] border px-4 py-3 backdrop-blur-md ${accentClasses}`}>
      <div className="mb-2.5 flex items-center gap-2 text-sm font-medium text-bronze-100">
        <Icon className="h-4 w-4 text-celadon-300" />
        {title}
      </div>
      {children}
    </section>
  )
}

function hasDisplayValue(value) {
  if (value == null) return false
  if (typeof value !== 'string') return true
  const normalized = value.trim()
  return normalized !== '' && !['不详', '未知', '未记录', '待生成'].includes(normalized)
}

function ValuePair({ label, value, compact = false }) {
  if (!hasDisplayValue(value)) {
    return null
  }

  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 py-1.5 last:border-b-0 last:pb-0 first:pt-0">
      <span className="shrink-0 text-sm text-bronze-500">{label}</span>
      <span
        title={typeof value === 'string' ? value : undefined}
        className={`text-right text-sm text-bronze-100 ${compact ? 'min-w-0 truncate text-xs text-bronze-300' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

// 内容优先缩放到一屏；达到下限后保留滚动，避免文字过小。
const MIN_FIT_ZOOM = 0.55

export default function DataPanel({ ceramic, viewMode, isOpen, onClose }) {
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const scrollRef = useRef(null)
  const gridRef = useRef(null)
  const [fitZoom, setFitZoom] = useState('')
  // 打开时锁定背景滚动、约束焦点，并在关闭后恢复现场。
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          panelRef.current?.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') || []
        ).filter((element) => element instanceof HTMLElement && !element.hidden)
        if (focusableElements.length === 0) {
          event.preventDefault()
          return
        }
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
    window.addEventListener('keydown', handleDialogKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleDialogKeyDown)
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen, onClose])

  // 先按自然高度计算缩放，再校正缩放造成的额外换行。
  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }
    const previousZoom = gridRef.current?.style.zoom ?? ''
    let cancelled = false
    let timer = null

    const setZoom = (value) => {
      const gridEl = gridRef.current
      if (!gridEl) {
        return
      }
      gridEl.style.zoom = value
      setFitZoom(value)
    }

    // 最多校正四次，避免文本换行使内容再次超出容器。
    const scheduleCorrection = (iteration) => {
      if (cancelled || iteration >= 4) {
        return
      }
      timer = setTimeout(() => {
        const scrollEl = scrollRef.current
        const gridEl = gridRef.current
        if (!scrollEl || !gridEl || scrollEl.scrollHeight <= scrollEl.clientHeight + 1) {
          return
        }
        const current = parseFloat(gridEl.style.zoom || '1')
        const next = Math.max(MIN_FIT_ZOOM, current * (scrollEl.clientHeight / scrollEl.scrollHeight) * 0.99)
        setZoom(String(next))
        scheduleCorrection(iteration + 1)
      }, 60)
    }

    // 临时恢复自然尺寸完成测量，再同步写回目标缩放。
    const measureAndApply = () => {
      const scrollEl = scrollRef.current
      const gridEl = gridRef.current
      if (!scrollEl || !gridEl) {
        return
      }
      gridEl.style.zoom = ''
      const available = scrollEl.clientHeight
      const natural = scrollEl.scrollHeight
      if (natural <= available + 1) {
        setZoom('')
        return
      }
      const ratio = Math.max(MIN_FIT_ZOOM, (available / natural) * 0.99)
      setZoom(ratio < 0.995 ? String(ratio) : '')
      scheduleCorrection(0)
    }
    measureAndApply()
    window.addEventListener('resize', measureAndApply)
    return () => {
      cancelled = true
      if (timer) {
        clearTimeout(timer)
      }
      window.removeEventListener('resize', measureAndApply)
      if (gridRef.current) {
        gridRef.current.style.zoom = previousZoom
      }
    }
  }, [isOpen, ceramic.id])

  if (!isOpen) {
    return null
  }

  const showDescription = isCeramicFieldVisible(ceramic, 'description') && Boolean(ceramic.description)
  const showTags = isCeramicFieldVisible(ceramic, 'highlightTags') && ceramic.highlightTags?.length > 0
  const showDimensions =
    isCeramicFieldVisible(ceramic, 'dimensions') &&
    ['mouthDiameter', 'baseDiameter', 'height'].some(
      (field) => typeof ceramic.dimensions?.[field] === 'number' && ceramic.dimensions[field] > 0
    )
  const showExcavation =
    isCeramicFieldVisible(ceramic, 'excavation') &&
    Object.values(ceramic.excavation || {}).some(hasDisplayValue)
  const showCollection =
    isCeramicFieldVisible(ceramic, 'collection') &&
    Object.values(ceramic.collection || {}).some(hasDisplayValue)
  const showTechnicalFeatures =
    isCeramicFieldVisible(ceramic, 'technicalFeatures') && ceramic.technicalFeatures?.length > 0
  const showHistoricalSignificance =
    isCeramicFieldVisible(ceramic, 'historicalSignificance') && Boolean(ceramic.historicalSignificance)
  const usesPillowDimensions = ceramic.name.includes('枕')

  return createPortal(
    <div
      className="overlay-fade fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-2 backdrop-blur-xs sm:p-3"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-panel-title"
    >
      <div
        ref={panelRef}
        className="sheet-pop flex max-h-[97dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-bronze-700/35 bg-[linear-gradient(180deg,rgba(12,11,10,0.97)_0%,rgba(17,15,13,0.95)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-bronze-700/25 px-5 py-3 sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-bronze-500">Curatorial Panel</p>
              <h3 id="data-panel-title" className="mt-1 text-xl font-semibold text-bronze-50">文物档案摘要</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full border border-celadon-600/35 bg-celadon-500/10 px-3 py-1 text-xs text-celadon-200">
                {viewMode === 'asset' ? 'Digital' : 'Archive'}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-bronze-600/30 bg-bronze-900/20 p-2 text-bronze-300 transition active:scale-95 hover:border-bronze-400/50 hover:bg-bronze-700/30 hover:text-bronze-100"
                aria-label="关闭资料弹窗"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 rounded-[20px] border border-bronze-700/30 bg-white/5 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-bronze-500">
                {ceramic.archiveId || ceramic.id}
              </p>
              <h4 className="mt-1 text-lg font-medium text-bronze-100">{ceramic.name}</h4>
              {ceramic.nameEn && <p className="mt-1 text-sm text-bronze-400">{ceramic.nameEn}</p>}
            </div>
            {showTags && (
              <div className="flex flex-wrap gap-2">
                {ceramic.highlightTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-celadon-600/30 bg-celadon-500/10 px-3 py-1 text-xs text-celadon-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 大屏三栏、中屏双栏；仅在内容超高时应用 fitZoom。 */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-7">
          <div
            ref={gridRef}
            className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2 xl:grid-cols-3"
            style={fitZoom ? { zoom: Number(fitZoom) } : undefined}
          >
            <div className="space-y-3">
              {(showDescription || showTags) && (
                <DetailSection icon={Sparkles} title="展签说明" accent="celadon">
                  {showDescription && <p className="text-sm leading-6 text-bronze-200">{ceramic.description}</p>}
                  {showTags && (
                    <div className={`${showDescription ? 'mt-2.5 ' : ''}flex flex-wrap gap-2`}>
                      {ceramic.highlightTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-celadon-600/30 bg-celadon-500/10 px-3 py-1 text-xs text-celadon-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </DetailSection>
              )}

              {showDimensions && <DetailSection icon={Ruler} title="尺寸数据">
                <ValuePair
                  label={usesPillowDimensions ? '枕面长' : '口径'}
                  value={
                    ceramic.dimensions?.mouthDiameter > 0
                      ? `${ceramic.dimensions.mouthDiameter} ${ceramic.dimensions.unit || ''}`
                      : ''
                  }
                />
                <ValuePair
                  label={usesPillowDimensions ? '枕面宽' : '底径'}
                  value={
                    ceramic.dimensions?.baseDiameter > 0
                      ? `${ceramic.dimensions.baseDiameter} ${ceramic.dimensions.unit || ''}`
                      : ''
                  }
                />
                <ValuePair
                  label="高度"
                  value={
                    ceramic.dimensions?.height > 0
                      ? `${ceramic.dimensions.height} ${ceramic.dimensions.unit || ''}`
                      : ''
                  }
                />
              </DetailSection>}

              {showExcavation && <DetailSection icon={MapPin} title="出土与流传">
                <ValuePair label="地点" value={ceramic.excavation?.location} />
                <ValuePair label="方式" value={ceramic.excavation?.method} />
                <ValuePair label="捐赠人" value={ceramic.excavation?.donor} />
                <ValuePair label="时间" value={ceramic.excavation?.date} />
              </DetailSection>}
            </div>

            <div className="space-y-3">
              {showCollection && <DetailSection icon={Building2} title="馆藏信息">
                <ValuePair label="馆藏单位" value={ceramic.collection?.institution} />
                <ValuePair label="状态" value={ceramic.collection?.status} />
              </DetailSection>}

              {showTechnicalFeatures && <DetailSection icon={Code2} title="工艺特征">
                <ul className="space-y-2">
                  {ceramic.technicalFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-5 text-bronze-200">
                      <span className="mt-1 h-2 w-2 rounded-full bg-celadon-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>}
            </div>

            <div className="space-y-3">
              {showHistoricalSignificance && <DetailSection icon={BookOpen} title="史学价值" accent="celadon">
                <p className="text-sm leading-6 text-bronze-200">{ceramic.historicalSignificance}</p>
              </DetailSection>}

              <DetailSection icon={ScrollText} title="资源引用">
                <ValuePair label="原始图" value={ceramic.imageUrl} compact />
                <ValuePair label="数字资产图" value={ceramic.processedImageUrl} compact />
                <ValuePair label="处理链路" value={ceramic.imageProcessedBy} compact />
              </DetailSection>

              <DetailSection icon={Tag} title="系统标识">
                <ValuePair label="App ID" value={ceramic.id} />
                <ValuePair label="Archive ID" value={ceramic.archiveId} />
                <ValuePair label="Name EN" value={ceramic.nameEn} />
              </DetailSection>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

DataPanel.propTypes = {
  ceramic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameEn: PropTypes.string,
    archiveId: PropTypes.string,
    description: PropTypes.string.isRequired,
    highlightTags: PropTypes.arrayOf(PropTypes.string),
    dimensions: PropTypes.shape({
      mouthDiameter: PropTypes.number,
      baseDiameter: PropTypes.number,
      height: PropTypes.number,
      unit: PropTypes.string,
    }),
    excavation: PropTypes.shape({
      location: PropTypes.string,
      method: PropTypes.string,
      donor: PropTypes.string,
      date: PropTypes.string,
    }),
    collection: PropTypes.shape({
      institution: PropTypes.string,
      status: PropTypes.string,
    }),
    technicalFeatures: PropTypes.arrayOf(PropTypes.string),
    glaze: PropTypes.string,
    assetSlug: PropTypes.string,
    historicalSignificance: PropTypes.string,
    imageUrl: PropTypes.string,
    processedImageUrl: PropTypes.string,
    imageProcessedBy: PropTypes.string,
    hiddenFields: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  viewMode: PropTypes.oneOf(['asset', 'archive']).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

ValuePair.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compact: PropTypes.bool,
}
