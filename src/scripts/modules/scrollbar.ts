import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars'

const scrollbars: WeakMap<HTMLElement, OverlayScrollbars> = new WeakMap()

function createOverlayScrollbars(target: HTMLElement, options?: PartialOptions) {
  const theme = target.dataset.scrollbarTheme === 'light' ? 'os-theme-light' : 'os-theme-dark'
  const scrollbar = OverlayScrollbars(target, { scrollbars: { autoHide: 'scroll', theme }, overflow: { x: 'hidden' }, ...options })
  scrollbars.set(target, scrollbar)
  return scrollbar
}

function getScrollbar(target: HTMLElement) {
  return scrollbars.get(target)
}

createOverlayScrollbars(document.body)

export { createOverlayScrollbars, getScrollbar }
