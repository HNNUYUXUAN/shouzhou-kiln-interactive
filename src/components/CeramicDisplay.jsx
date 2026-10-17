import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { Eye, Sparkles, ZoomIn, X } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'
import { isCeramicFieldVisible } from '../constants'

function ModeToggle({ viewMode, onChange }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-bronze-700/40 bg-black/35 p-1 backdrop-blur-md">
      <button
        type="button"
        onClick={() => onChange('asset')}
        aria-pressed={viewMode === 'asset'}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm transition active:scale-[0.96] ${
          viewMode === 'asset'
            ? 'bg-linear-to-r/srgb from-celadon-600 to-celadon-400 text-[#07100c] shadow-[0_0_24px_rgba(90,173,129,0.45)]'
            : 'text-bronze-300 hover:text-bronze-100'
        }`}
      >
        <Sparkles size={16} />
        数字资产
      </button>
      <button
        type="button"
        onClick={() => onChange('archive')}
        aria-pressed={viewMode === 'archive'}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm transition active:scale-[0.96] ${
          viewMode === 'archive'
            ? 'bg-bronze-500 text-[#1a120c] shadow-[0_0_24px_rgba(168,133,86,0.35)]'
            : 'text-bronze-300 hover:text-bronze-100'
        }`}
      >
        <Eye size={16} />
        档案视图
      </button>
    </div>
  )
}

// 舞台切换由组件重挂载和 CSS 过渡完成，不保留过期的展品节点。
function AssetStage({ ceramic, viewMode }) {
  // 图片地址直接从当前展品派生，避免额外状态产生同步延迟。
  const [useFallback, setUseFallback] = useState(false)
  const assetSrc = useFallback ? ceramic.imageUrl : (ceramic.processedImageUrl || ceramic.imageUrl)

  return (
    <div
      key="asset-stage"
      className="relative h-full w-full overflow-hidden rounded-[28px] border border-celadon-500/20 bg-[radial-gradient(circle_at_top,rgba(41,61,50,0.95)_0%,rgba(16,20,18,0.98)_58%,rgba(9,10,10,1)_100%)]"
    >
      {/* 氛围光效 */}
      <div className="glow-breathe absolute h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(90,173,129,0.38)_0%,rgba(90,173,129,0.06)_42%,transparent_70%)] blur-3xl" />
      {/* 主图始终限制在舞台边界内。 */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="hero-float relative h-full w-full">
          {/* 展品或视图变化时重新挂载图片状态。 */}
          <ImageWithFallback
            key={ceramic.id + viewMode}
            src={assetSrc}
            fallbackSrc={ceramic.imageUrl}
            alt={`${ceramic.name} 数字资产图`}
            className="h-full w-full object-contain drop-shadow-[0_32px_60px_rgba(0,0,0,0.6)]"
            style={{ filter: 'contrast(1.06) brightness(1.02) saturate(1.04)' }}
            onError={() => {
              if (!useFallback && ceramic.processedImageUrl) {
                setUseFallback(true)
              }
            }}
          />
        </div>
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-celadon-400/30 bg-celadon-500/15 px-3 py-1 text-xs tracking-[0.2em] text-celadon-100">
        DIGITAL HERO
      </div>
      {ceramic.imageProcessedBy && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs text-celadon-100">
          {ceramic.imageProcessedBy}
        </div>
      )}
    </div>
  )
}

AssetStage.propTypes = {
  ceramic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    processedImageUrl: PropTypes.string,
    imageProcessedBy: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.string.isRequired,
}

function ArchiveStage({ ceramic, viewMode, onOpenFullscreen }) {
  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenFullscreen()
    }
  }

  return (
    <div
      key="archive-stage"
      onClick={onOpenFullscreen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`全屏查阅${ceramic.name}档案扫描件`}
      className="relative h-full w-full cursor-pointer overflow-hidden rounded-[28px] border border-bronze-500/35 bg-[linear-gradient(160deg,#f2ead9_0%,#e4d7bf_52%,#d7c6a9_100%)] shadow-[inset_0_2px_20px_rgba(61,45,26,0.16),0_18px_60px_rgba(0,0,0,0.25)] transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300"
    >
      {/* 纸张纹理 */}
      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.9%22/%3E%3C/svg%3E")',
        }}
      />
      {/* 档案图始终限制在舞台边界内。 */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* 展品或视图变化时重新挂载图片状态。 */}
        <ImageWithFallback
          key={ceramic.id + viewMode}
          src={ceramic.imageUrl}
          alt={`${ceramic.name} 档案扫描件`}
          className="h-full w-full object-contain drop-shadow-[0_30px_40px_rgba(61,45,26,0.2)]"
          style={{
            filter: 'contrast(1.02) brightness(0.98)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* 全屏查阅入口 */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity hover:bg-black/30">
        <div className="zoom-hint-pulse flex items-center gap-2 rounded-full border border-bronze-300/40 bg-bronze-900/60 px-5 py-2.5 backdrop-blur-md">
          <ZoomIn size={20} className="text-bronze-200" />
          <span className="text-sm font-medium text-bronze-100 tracking-wide">
            点击全屏查阅文献
          </span>
        </div>
      </div>

      <div className="absolute right-4 top-4 rounded-full border border-black/15 bg-black/55 px-3 py-1 text-xs tracking-[0.2em] text-bronze-100">
        ARCHIVE SCAN
      </div>
    </div>
  )
}

ArchiveStage.propTypes = {
  ceramic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  viewMode: PropTypes.string.isRequired,
  onOpenFullscreen: PropTypes.func.isRequired,
}

export default function CeramicDisplay({ ceramic, viewMode, onViewModeChange }) {
  const hasProcessedAsset = Boolean(ceramic.processedImageUrl)
  const activeMode = hasProcessedAsset ? viewMode : 'archive'
  const [isFullscreenArchive, setIsFullscreenArchive] = useState(false)
  const fullscreenCloseRef = useRef(null)

  // 舞台不保存退场快照，当前展品和视图直接决定渲染内容。

  // 全屏阅读时锁定背景滚动，并在关闭后恢复焦点。
  useEffect(() => {
    if (isFullscreenArchive) {
      const originalOverflow = document.body.style.overflow
      const previouslyFocused = document.activeElement
      document.body.style.overflow = 'hidden'
      fullscreenCloseRef.current?.focus()
      return () => {
        document.body.style.overflow = originalOverflow
        if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
          previouslyFocused.focus()
        }
      }
    }
  }, [isFullscreenArchive])

  // 全屏阅读器遵循统一的 Escape 退出约定。
  useEffect(() => {
    if (!isFullscreenArchive) return

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        setIsFullscreenArchive(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [isFullscreenArchive])

  return (
    <>
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(232,220,200,0.7) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        {/* 展品主图与摘要 */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:gap-8 xl:gap-12">
          {/* 展品舞台 */}
          <div className="relative flex-1 min-h-0 min-w-0">
            {/* key 保证切换后只保留当前展品的舞台状态。 */}
            <div key={`stage-${activeMode}-${ceramic.id}`} className="relative z-10 h-full w-full">
              {activeMode === 'asset' ? (
                <AssetStage ceramic={ceramic} viewMode={activeMode} />
              ) : (
                <ArchiveStage
                  ceramic={ceramic}
                  viewMode={activeMode}
                  onOpenFullscreen={() => setIsFullscreenArchive(true)}
                />
              )}
            </div>
          </div>

          {/* 展品摘要 */}
          <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto lg:w-[32%] lg:flex-none xl:gap-5">
            {/* 视图切换 */}
            <div className="flex justify-end">
              {hasProcessedAsset ? (
                <ModeToggle viewMode={activeMode} onChange={onViewModeChange} />
              ) : (
                <div className="rounded-full border border-bronze-600/30 bg-black/30 px-4 py-2 text-sm text-bronze-300">
                  当前条目仅提供档案扫描件
                </div>
              )}
            </div>

            {/* 文物名称与说明 */}
            <div className="flex flex-col justify-start">
              <h2 className="text-2xl font-semibold text-bronze-50 sm:text-3xl lg:text-4xl lg:leading-tight">
                {ceramic.name}
              </h2>

              {ceramic.nameEn && (
                <p className="mt-3 text-sm uppercase tracking-[0.25em] text-bronze-400 sm:text-base">
                  {ceramic.nameEn}
                </p>
              )}

              {isCeramicFieldVisible(ceramic, 'description') && ceramic.description && (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-bronze-300 sm:text-base sm:leading-6 whitespace-pre-wrap">
                  {ceramic.description}
                </p>
              )}
            </div>

            {/* 展签标签 */}
            {isCeramicFieldVisible(ceramic, 'highlightTags') && ceramic.highlightTags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ceramic.highlightTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-bronze-700/40 bg-bronze-900/20 px-3 py-1 text-xs text-bronze-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 全屏档案阅读器通过 Portal 脱离主展台的裁切边界。 */}
      {isFullscreenArchive && createPortal(
        <div
          onClick={() => setIsFullscreenArchive(false)}
          className="overlay-fade fixed inset-0 z-[100] h-[100dvh] w-[100dvw] overflow-y-auto overflow-x-hidden bg-black select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          role="dialog"
          aria-modal="true"
          aria-label={`${ceramic.name}档案全屏视图`}
        >
            {/* 固定关闭按钮 */}
            <button
              ref={fullscreenCloseRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsFullscreenArchive(false)
              }}
              className="fixed right-8 top-8 z-[110] flex min-h-[64px] min-w-[64px] items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-[0.95] select-none"
              aria-label="关闭全屏视图"
            >
              <X size={32} strokeWidth={2} />
            </button>

            {/* 居中的可滚动档案长图 */}
            <div
              className="flex min-h-full w-full items-start justify-center py-16 md:py-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-pop relative select-none">
                <ImageWithFallback
                  key={`fullscreen-${ceramic.id}`}
                  src={ceramic.imageUrl}
                  alt={`${ceramic.name} 档案扫描件 - 全屏检阅`}
                  className="h-auto w-[85vw] max-w-4xl lg:max-w-5xl object-contain drop-shadow-2xl select-none touch-pan-y"
                  style={{
                    filter: 'contrast(1.02) brightness(0.98)',
                  }}
                />
              </div>
            </div>

            {/* 触控滚动提示 */}
            <div className="hint-rise fixed bottom-10 left-1/2 z-[110] pointer-events-none">
              <div className="capsule-bob flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm text-white/90 backdrop-blur-md">
                <span className="text-lg">↕</span>
                <span>触控上下滑动以阅览全卷</span>
              </div>
            </div>
        </div>,
        document.body
      )}
    </>
  )
}

CeramicDisplay.propTypes = {
  ceramic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameEn: PropTypes.string,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    processedImageUrl: PropTypes.string,
    archiveId: PropTypes.string,
    imageProcessedBy: PropTypes.string,
    highlightTags: PropTypes.arrayOf(PropTypes.string),
    hiddenFields: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  viewMode: PropTypes.oneOf(['asset', 'archive']).isRequired,
  onViewModeChange: PropTypes.func.isRequired,
}
