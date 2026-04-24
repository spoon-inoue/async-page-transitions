import pathbrowserify from 'path-browserify'
import type { Page } from './pages/Page'

type Routes = { [key in string]: Page }

export class Router {
  transition?: (currentPage: Page, nextPage: Page) => void
  afterLeave?: (page: Page) => void

  private currentPage: Page
  private isTransitioning = false

  constructor(private readonly routes: Routes) {
    this.currentPage = this.getInitPage()
    this.init()
  }

  private getInitPage() {
    const path = '/' + location.pathname.replace(import.meta.env.BASE_URL, '')
    const route = this.routes[path]
    route.load({ init: true })
    return route
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

    window.addEventListener('popstate', (e) => {
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
      this.routes[path].load()
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
      const route = this.routes[path]

      if (!route || this.currentPage.namespace === route.namespace) return

      // load next element
      await route.load()
      const currentElement = this.currentPage.element
      const nextElement = route.element

      // append next element
      const transitionWrapper = document.querySelector<HTMLElement>('[data-transition="wrapper"]')!
      transitionWrapper.appendChild(nextElement)

      // set page title
      document.querySelector<HTMLTitleElement>('title')!.innerText = route.pageTitle

      // transition
      await this.transition?.(this.currentPage, route)

      // remove current element
      transitionWrapper.removeChild(currentElement)

      await this.afterLeave?.(route)

      this.currentPage = route
    } finally {
      this.isTransitioning = false
    }
  }
}
