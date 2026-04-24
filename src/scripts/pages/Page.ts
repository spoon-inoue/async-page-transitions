import pathbrowserify from 'path-browserify'

type LoadParams = { reload?: boolean; init?: boolean }

export abstract class Page {
  private _element?: HTMLElement
  private _pageTitle?: string

  constructor(
    public readonly namespace: string,
    private readonly filePath: string,
  ) {}

  async load(params?: LoadParams) {
    const reload = params?.reload ?? false
    const init = params?.init ?? false

    if (!this._element && init) {
      // 初期ページ
      this._pageTitle = document.querySelector<HTMLTitleElement>('title')?.innerText
      this._element = document.querySelector<HTMLElement>('[data-transition="container"]')!
    } else if (!this._element || reload) {
      // 他ページ
      const url = new URL(pathbrowserify.join(import.meta.env.BASE_URL, this.filePath), location.origin)

      const html = await fetch(url.pathname)
      const blob = await html.blob()
      const text = await blob.text()

      const temp = document.createElement('div')
      temp.innerHTML = text

      this._pageTitle = temp.querySelector<HTMLTitleElement>('title')?.innerText
      this._element = temp.querySelector<HTMLElement>('[data-transition="container"]')!
    }
  }

  get element() {
    try {
      if (!this._element) throw ''
      return this._element!
    } catch {
      throw new Error('unload page element.')
    }
  }

  get pageTitle() {
    try {
      if (!this._pageTitle) throw ''
      return this._pageTitle!
    } catch {
      throw new Error('unload page title.')
    }
  }
}
