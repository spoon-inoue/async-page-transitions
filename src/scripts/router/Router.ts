import { Loader, type Content } from './Loader'
import pathbrowserify from 'path-browserify'

export class Router extends Loader {
  transition?: (currentContent: Content, nextContent: Content) => void
  afterLeave?: (content: Content) => void

  private isTransitioning = false
  private currentPath: string

  constructor(...namespaces: string[]) {
    super(...namespaces)

    this.currentPath = '/' + location.pathname.replace(import.meta.env.BASE_URL, '')
    this.load(this.currentPath, { init: true })
    this.init()
  }

  private init() {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual'
    }

    document.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLElement)) return

      const link = e.target.closest('a')

      // Ignore clicks that aren't on links, or on external links
      if (!link || !link.href.startsWith(location.origin)) return

      e.preventDefault()

      if (this.isTransitioning) return

      const path = new URL(link.href).pathname
      this.navigate(path)
    })

    window.addEventListener('popstate', () => {
      if (!this.isTransitioning) {
        const path = '/' + location.pathname.replace(import.meta.env.BASE_URL, '')
        this.performTransition(path)
      }
    })
  }

  prefetch() {
    document.addEventListener('mouseover', (e) => {
      if (!(e.target instanceof HTMLElement)) return

      const link = e.target.closest('a')

      if (!link || !link.href.startsWith(location.origin)) return

      const path = new URL(link.href).pathname
      this.load(path)
    })
  }

  private async navigate(path: string) {
    // ガード
    if (this.isTransitioning || location.pathname === path) return

    // ページをリロードせずにURLを更新
    history.pushState({}, '', pathbrowserify.join(import.meta.env.BASE_URL, path))

    await this.performTransition(path)
  }

  private async performTransition(path: string) {
    if (this.isTransitioning) return
    this.isTransitioning = true

    try {
      if (this.currentPath === path) return

      // load next element
      await this.load(path)
      const currentContent = this.getLoadedContent(this.currentPath)!
      const nextContent = this.getLoadedContent(path)!

      // append next element
      const transitionWrapper = document.querySelector<HTMLElement>('[data-transition="wrapper"]')!
      transitionWrapper.appendChild(nextContent.element)

      // set page title
      if (nextContent.title) {
        document.querySelector<HTMLTitleElement>('title')!.innerText = nextContent.title
      }

      // transition
      await this.transition?.(currentContent, nextContent)

      // remove current element
      transitionWrapper.removeChild(currentContent.element)

      await this.afterLeave?.(nextContent)

      this.currentPath = path
    } finally {
      this.isTransitioning = false
    }
  }
}
