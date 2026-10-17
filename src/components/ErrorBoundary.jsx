import React from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('展馆界面渲染失败', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <main className="flex h-screen w-screen items-center justify-center bg-[#110f0d] p-6 text-bronze-100">
        <section className="w-full max-w-lg rounded-[28px] border border-bronze-700/40 bg-black/35 p-8 text-center shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-bronze-500">Display Recovery</p>
          <h1 className="mt-3 text-2xl font-semibold">展馆界面暂时无法显示</h1>
          <p className="mt-3 text-sm leading-6 text-bronze-300">
            展品数据仍然保留。可以先重试界面；如果问题持续，再重新加载本地展馆。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="min-h-[48px] rounded-full border border-celadon-500/40 bg-celadon-700/25 px-5 py-2 text-sm text-celadon-100"
            >
              重试界面
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="min-h-[48px] rounded-full border border-bronze-600/40 bg-bronze-800/25 px-5 py-2 text-sm text-bronze-100"
            >
              重新加载
            </button>
          </div>
        </section>
      </main>
    )
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}
