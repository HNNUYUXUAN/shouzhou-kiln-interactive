// 文物导航每次按钮滚动的像素距离。
export const RAIL_SCROLL_STEP = 320

export function isCeramicFieldVisible(ceramic, field) {
  return !ceramic?.hiddenFields?.includes(field)
}
