import pathbrowserify from 'path-browserify'

export type Content = { element: HTMLElement; namespace: string; title?: string }

type Cash = { [key in string]: Content }

export abstract class Loader {
  private readonly cash: Cash = {}

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

        this.addCash(path, { element, namespace, title })
      } else if (!content || reload) {
        // 他ページ
        const url = new URL(pathbrowserify.join(import.meta.env.BASE_URL, path), location.origin)
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

        this.addCash(path, { element, namespace, title })
      }
    } catch {
      console.error('Failed to load the page.', path)
    }
  }

  private addCash(path: string, content: Content) {
    if (!Object.hasOwn(this.cash, path)) {
      Object.assign(this.cash, path)
    }
    this.cash[path] = content
  }

  protected getLoadedContent(path: string) {
    if (Object.hasOwn(this.cash, path)) {
      return this.cash[path]
    }
  }
}
