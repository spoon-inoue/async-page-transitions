import pathbrowserify from 'path-browserify'

export type Content = { path: string; element: HTMLElement; namespace: string; title?: string }

type Cash = {
  [key in string]: Content[]
}

export abstract class Loader {
  private readonly cash: Cash = {}

  constructor(...namespaces: string[]) {
    Object.assign(this.cash, ...namespaces.map((namespace) => ({ [namespace]: [] })))
  }

  protected async load(path: string, params?: { reload?: boolean; init?: boolean }) {
    try {
      const reload = params?.reload ?? false
      const init = params?.init ?? false
      const content = this.getLoadedContent(path)

      if (!content && init) {
        // 初期ページ
        const title = document.querySelector<HTMLTitleElement>('title')?.innerText
        const element = document.querySelector<HTMLElement>('[data-transition="container"]')!
        const namespace = element.dataset.namespace!
        this.cash[namespace].push({ path, element, namespace, title })
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
        const namespace = element.dataset.namespace!

        if (content) {
          content.element = element
          content.title = title
        } else {
          this.cash[namespace].push({ path, element, namespace, title })
        }
      }
    } catch {
      console.error('Failed to load the page.', path)
    }
  }

  getLoadedContent(path: string) {
    for (const [_, value] of Object.entries(this.cash)) {
      const v = value.find((v) => v.path === path)
      if (v) return v
    }
  }
}
