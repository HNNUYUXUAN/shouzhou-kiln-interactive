import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { BookOpen, ScrollText, Sparkles, X } from 'lucide-react'
import ceramicsData from './data/shouzhou_ceramics.json'
import CeramicDisplay from './components/CeramicDisplay'
import DataPanel from './components/DataPanel'
import ArtifactRail from './components/ArtifactRail'
import { isCeramicFieldVisible } from './constants'

function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return assetPath
  }

  if (/^(https?:|data:|blob:|file:)/.test(assetPath)) {
    return assetPath
  }

  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  return `${normalizedBaseUrl}${normalizedPath}`
}

const resolvedCeramicsData = ceramicsData.map((ceramic) => ({
  ...ceramic,
  imageUrl: resolveAssetUrl(ceramic.imageUrl),
  thumbnailUrl: resolveAssetUrl(ceramic.thumbnailUrl),
  processedImageUrl: resolveAssetUrl(ceramic.processedImageUrl),
}))

function getDefaultViewMode(ceramic) {
  return ceramic?.processedImageUrl ? 'asset' : 'archive'
}

// 默认视图优先使用数字资产图，没有时回退到档案图。
function getPrimaryImage(ceramic) {
  return ceramic?.processedImageUrl || ceramic?.imageUrl
}

// 记录已经预加载的地址，避免重复请求和解码。
const preloadedSources = new Set()

function preloadImage(src) {
  if (!src || preloadedSources.has(src)) {
    return
  }
  preloadedSources.add(src)
  const img = new Image()
  img.src = src
}

function App() {
  const ceramics = useMemo(() => resolvedCeramicsData, [])
  const [selectedId, setSelectedId] = useState(ceramics[0]?.id ?? null)
  const [viewMode, setViewMode] = useState(getDefaultViewMode(ceramics[0]))
  // 资料面板按需打开，避免遮挡默认展陈视图。
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const selectedCeramic = useMemo(
    () => ceramics.find((ceramic) => ceramic.id === selectedId) ?? ceramics[0],
    [selectedId, ceramics]
  )

  // 同步保存选中项，确保键盘连发时每个事件都从最新位置继续导航。
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId

  const handleSelectCeramic = useCallback((ceramic) => {
    // 先更新 ref，再提交 React 状态，避免连续导航丢步。
    selectedIdRef.current = ceramic.id
    setSelectedId(ceramic.id)
    setViewMode(getDefaultViewMode(ceramic))
  }, [])

  const navigateCeramic = useCallback((direction) => {
    const currentIndex = ceramics.findIndex((c) => c.id === selectedIdRef.current)
    let nextIndex

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % ceramics.length
    } else {
      nextIndex = (currentIndex - 1 + ceramics.length) % ceramics.length
    }

    handleSelectCeramic(ceramics[nextIndex])
  }, [ceramics, handleSelectCeramic])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      const hasOpenModal = Boolean(document.querySelector('[aria-modal="true"]'))

      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isEditing || hasOpenModal) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigateCeramic('prev')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigateCeramic('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateCeramic])

  // 只预加载相邻展品的默认图片，兼顾顺序浏览速度和初始资源开销。
  useEffect(() => {
    const currentIndex = ceramics.findIndex((c) => c.id === selectedId)
    if (currentIndex < 0) {
      return
    }
    const prevCeramic = ceramics[(currentIndex - 1 + ceramics.length) % ceramics.length]
    const nextCeramic = ceramics[(currentIndex + 1) % ceramics.length]
    preloadImage(getPrimaryImage(prevCeramic))
    preloadImage(getPrimaryImage(nextCeramic))
  }, [selectedId, ceramics])

  const currentModeLabel = viewMode === 'asset' ? '数字资产主视图' : '档案视图'
  const currentModeIcon = viewMode === 'asset' ? <Sparkles size={14} /> : <ScrollText size={14} />

  const handleOpenDataPanel = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const handleCloseDataPanel = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#110f0d] text-bronze-100 select-none" style={{ touchAction: 'pan-x pan-y' }}>
      {/* 环境背景 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2219_0%,#110f0d_52%,#090807_100%)]" />
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-celadon-700/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-bronze-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(232,220,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,200,0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {/* 顶部信息栏 */}
        <header className="shrink-0 px-4 pb-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-bronze-700/40 bg-black/25 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.35em] text-bronze-500">Shouzhou Kiln Interactive Gallery</p>
                <h1 className="mt-2 text-3xl font-semibold text-bronze-100 sm:text-4xl">寿州窑文物数字展台</h1>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <div className="flex flex-wrap items-center gap-2">
                  {isCeramicFieldVisible(selectedCeramic, 'dynasty') && selectedCeramic.dynasty && (
                    <span className="rounded-full border border-celadon-700/40 bg-celadon-900/30 px-4 py-1.5 text-sm text-celadon-200">
                      {selectedCeramic.dynasty}
                    </span>
                  )}
                  {isCeramicFieldVisible(selectedCeramic, 'period') && selectedCeramic.period && (
                    <span className="rounded-full border border-bronze-700/40 bg-bronze-900/20 px-4 py-1.5 text-sm text-bronze-300">
                      {selectedCeramic.period}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full border border-bronze-600/30 bg-black/30 px-4 py-1.5 text-sm text-bronze-200">
                    {currentModeIcon}
                    {currentModeLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-auto">
                  <div className="rounded-full border border-bronze-700/40 bg-black/20 px-4 py-1.5 text-sm text-bronze-400">
                    馆藏总量 {ceramics.length} 件
                  </div>
                  <button
                    type="button"
                    onClick={isDrawerOpen ? handleCloseDataPanel : handleOpenDataPanel}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-bronze-600/40 bg-bronze-800/20 px-5 py-2 text-sm text-bronze-100 transition active:scale-[0.97] active:opacity-80 hover:border-bronze-400/60 hover:bg-bronze-700/30"
                  >
                    {isDrawerOpen ? <X size={18} /> : <BookOpen size={18} />}
                    {isDrawerOpen ? '关闭资料弹窗' : '查看文物资料'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 主展台 */}
        <main className="flex-1 min-h-0 px-4 pb-4 sm:px-6 lg:px-8">
          <div className="relative h-full min-h-0 overflow-hidden rounded-[32px] border border-bronze-700/30 bg-black/20 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <CeramicDisplay ceramic={selectedCeramic} viewMode={viewMode} onViewModeChange={setViewMode} />
            <DataPanel ceramic={selectedCeramic} viewMode={viewMode} isOpen={isDrawerOpen} onClose={handleCloseDataPanel} />
          </div>
        </main>

        {/* 文物导航 */}
        <div className="shrink-0">
          <ArtifactRail
            ceramics={ceramics}
            selectedId={selectedCeramic.id}
            onSelect={handleSelectCeramic}
          />
        </div>
      </div>
    </div>
  )
}

export default App
