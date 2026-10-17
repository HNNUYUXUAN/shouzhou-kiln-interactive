import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'
import { RAIL_SCROLL_STEP } from '../constants'

// 优先使用专用缩略图，缺失时依次回退到数字资产图和档案图。
function getThumbnail(ceramic) {
  return ceramic.thumbnailUrl || ceramic.processedImageUrl || ceramic.imageUrl
}

export default function ArtifactRail({ ceramics, selectedId, onSelect }) {
  const railRef = useRef(null)
  const itemRefs = useRef(new Map())

  useEffect(() => {
    const activeNode = itemRefs.current.get(selectedId)
    if (activeNode) {
      activeNode.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [selectedId])

  useEffect(() => () => itemRefs.current.clear(), [])

  const scrollRail = (delta) => {
    railRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className="relative z-10 px-4 pb-3 sm:px-6 lg:px-8 lg:pb-4">
      <div className="rounded-[24px] border border-bronze-700/30 bg-black/30 px-3 py-2 shadow-[0_16px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/70">文物导航</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollRail(-RAIL_SCROLL_STEP)}
              aria-label="向左滚动文物导航"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-bronze-600/30 bg-bronze-900/20 p-3 text-bronze-100 transition active:scale-[0.95] active:opacity-80 hover:border-bronze-400/50 hover:bg-bronze-700/20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(RAIL_SCROLL_STEP)}
              aria-label="向右滚动文物导航"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-bronze-600/30 bg-bronze-900/20 p-3 text-bronze-100 transition active:scale-[0.95] active:opacity-80 hover:border-bronze-400/50 hover:bg-bronze-700/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
              event.preventDefault()
              event.currentTarget.scrollLeft += event.deltaY
            }
          }}
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {ceramics.map((ceramic) => {
            const isActive = ceramic.id === selectedId

            return (
              <button
                key={ceramic.id}
                ref={(node) => {
                  if (node) {
                    itemRefs.current.set(ceramic.id, node)
                  } else {
                    itemRefs.current.delete(ceramic.id)
                  }
                }}
                type="button"
                onClick={() => onSelect(ceramic)}
                aria-pressed={isActive}
                className={`group relative flex flex-col shrink-0 overflow-hidden rounded-[18px] border p-1.5 text-left transition active:scale-[0.96] ${
                  isActive
                    ? 'border-celadon-400/50 bg-celadon-900/30 shadow-[0_0_0_1px_rgba(139,203,167,0.2),0_12px_30px_rgba(0,0,0,0.35)]'
                    : 'border-bronze-700/20 bg-bronze-900/15 hover:border-bronze-500/40'
                }`}
                style={{ width: '8.5rem' }}
              >
                <div className="relative overflow-hidden rounded-[14px] border border-white/5 bg-black/20">
                  <ImageWithFallback
                    src={getThumbnail(ceramic)}
                    fallbackSrc={ceramic.imageUrl}
                    alt={ceramic.name}
                    loading="lazy"
                    className="h-16 w-full object-contain p-1.5 transition duration-200 group-hover:scale-[1.05]"
                  />
                </div>

                {/* 固定文本行数，避免导航卡片高度随标题变化。 */}
                <div className="mt-2 flex flex-col items-center justify-center text-center w-full px-1 pb-1">
                  <h4 className="line-clamp-1 text-[11px] font-medium leading-snug text-bronze-50">
                    {ceramic.name}
                  </h4>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight uppercase tracking-[0.12em] text-bronze-400/70">
                    {ceramic.nameEn || ''}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

ArtifactRail.propTypes = {
  ceramics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      nameEn: PropTypes.string,
      archiveId: PropTypes.string,
      assetSlug: PropTypes.string,
      imageUrl: PropTypes.string.isRequired,
      processedImageUrl: PropTypes.string,
      thumbnailUrl: PropTypes.string,
    })
  ).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
}
