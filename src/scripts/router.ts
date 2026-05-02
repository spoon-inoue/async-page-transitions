type Content = { element: HTMLElement; namespace: string; title?: string }
type Routes = { [path in string]: Content }

// =====================================
/** Loader */
// =====================================
abstract class Loader {
  private readonly routes: Routes = {}

  protected async load(path: string, params?: { reload?: boolean; init?: boolean }) {
    try {
      const reload = params?.reload ?? false
      const init = params?.init ?? false
      const content = this.getLoadedContent(path)

      if (!content && init) {
        // 初期ページ
        const title = document.querySelector<HTMLTitleElement>('title')?.innerText
        const element = document.querySelector<HTMLElement>('[data-transition="container"]')!
        const namespace = element.dataset.namespace ?? 'default'

        this.addRoute(path, { element: this.cloneElement(element), namespace, title })
      } else if (!content || reload) {
        // 他ページ
        const url = new URL(this.pathJoin(import.meta.env.BASE_URL, path), location.origin)
        let pathname = url.pathname
        pathname += pathname.endsWith('/') ? 'index.html' : '.html'

        const html = await fetch(pathname)
        const blob = await html.blob()
        const text = await blob.text()

        const temp = document.createElement('div')
        temp.innerHTML = text

        const title = temp.querySelector<HTMLTitleElement>('title')?.innerText
        const element = temp.querySelector<HTMLElement>('[data-transition="container"]')!
        const namespace = element.dataset.namespace ?? 'default'

        this.addRoute(path, { element, namespace, title })
      }
    } catch {
      console.error('Failed to load the page.', path)
    }
  }

  private addRoute(path: string, content: Content) {
    if (!Object.hasOwn(this.routes, path)) {
      Object.assign(this.routes, path)
    }
    this.routes[path] = content
  }

  private cloneElement(element: HTMLElement) {
    return <HTMLElement>(<Node>element.cloneNode(true))
  }

  protected getLoadedContent(path: string, params?: { cloneElement?: boolean }): Content | null {
    if (Object.hasOwn(this.routes, path)) {
      const cloneElement = params?.cloneElement ?? false
      if (cloneElement) {
        const route = this.routes[path]
        return { ...route, element: this.cloneElement(route.element) }
      } else {
        return this.routes[path]
      }
    }
    return null
  }

  protected pathJoin(...paths: string[]) {
    let path = ''
    for (let i = 0; i < paths.length; i++) {
      path += paths[i]
      if (i < paths.length - 1) {
        const hasEndSlash = path.endsWith('/')
        const hasNextStartSlash = paths[i + 1].startsWith('/')
        if (hasEndSlash && hasNextStartSlash) {
          path = path.substring(0, path.length - 1)
        } else if (!hasEndSlash && !hasNextStartSlash) {
          path += '/'
        }
      }
    }
    return path
  }
}

// =====================================
/** Router */
// =====================================
class Router extends Loader {
  before?: (currentContent: Content) => void
  transitioning?: (currentContent: Content, nextContent: Content) => void
  after?: (nextContent: Content) => void

  private isTransitioning = false
  private currentPath: string

  constructor() {
    super()

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
      this.load(path)
    })
  }

  private async navigate(path: string) {
    // ガード
    if (this.isTransitioning || location.pathname === path) return

    // ページをリロードせずにURLを更新
    history.pushState({}, '', this.pathJoin(import.meta.env.BASE_URL, path))

    await this.performTransition(path)
  }

  private async performTransition(path: string) {
    if (this.isTransitioning) return
    this.isTransitioning = true

    try {
      if (this.currentPath === path) return

      let currentContent = this.getLoadedContent(this.currentPath)!
      currentContent = { ...currentContent, element: document.querySelector<HTMLElement>(`[data-namespace=${currentContent.namespace}]`)! }
      await this.before?.(currentContent)

      // load next element
      await this.load(path)
      const nextContent = this.getLoadedContent(path, { cloneElement: true })!

      // append next element
      const transitionWrapper = document.querySelector<HTMLElement>('[data-transition="wrapper"]')!
      transitionWrapper.appendChild(nextContent.element)

      // set page title
      if (nextContent.title) {
        document.querySelector<HTMLTitleElement>('title')!.innerText = nextContent.title
      }

      await this.transitioning?.(currentContent, nextContent)

      // remove current element
      transitionWrapper.removeChild(currentContent.element)

      await this.after?.(nextContent)

      this.currentPath = path
    } finally {
      this.isTransitioning = false
    }
  }
}

export const router = new Router()
