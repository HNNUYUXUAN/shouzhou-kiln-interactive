import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className = '',
  style = {},
  loading = 'eager',
  decoding = 'async',
  onLoad,
  onError: onErrorProp,
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [reloadKey, setReloadKey] = useState(0)
  // ref 始终保存当前尝试的地址，使错误回退不依赖异步状态。
  const currentSrcRef = useRef(src)
  const imgRef = useRef(null)

  // 外部地址变化时重置完整的加载状态。
  useEffect(() => {
    currentSrcRef.current = src
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  // 缓存命中可能早于事件监听，因此主动检查 complete 补齐加载状态。
  useEffect(() => {
    const el = imgRef.current
    if (!el || !isLoading) {
      return
    }
    if (el.complete) {
      if (el.naturalWidth > 0) {
        setIsLoading(false)
        setHasError(false)
      } else {
        handleError()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const handleLoad = (event) => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.(event)
  }

  const handleError = (event) => {
    setIsLoading(false)
    const attemptedSrc = currentSrcRef.current
    if (attemptedSrc !== fallbackSrc && fallbackSrc) {
      currentSrcRef.current = fallbackSrc
      setCurrentSrc(fallbackSrc)
      setIsLoading(true)
      setHasError(false)
    } else {
      setHasError(true)
    }
    onErrorProp?.(event)
  }

  const handleRetry = (event) => {
    event.stopPropagation()
    currentSrcRef.current = src
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
    setReloadKey((value) => value + 1)
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center" aria-live="polite">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full border-4 border-bronze-700/30 border-t-bronze-400 animate-spin" />
            <p className="text-xs text-bronze-500">加载中...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bronze-900/10 rounded-lg">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <svg className="h-12 w-12 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-bronze-500">图片加载失败</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-1 min-h-[44px] rounded-full border border-bronze-600/40 bg-black/25 px-4 py-2 text-xs text-bronze-200"
            >
              重试加载
            </button>
          </div>
        </div>
      )}

      <img
        key={reloadKey}
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading || hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        decoding={decoding}
        draggable={false}
      />
    </div>
  )
}

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.oneOf(['eager', 'lazy']),
  decoding: PropTypes.oneOf(['sync', 'async', 'auto']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
}
