import hljs from 'highlight.js'

export class CodeArea extends HTMLElement {
  private static readonly NAME = 'code-area'

  static Define() {
    customElements.get(this.NAME) || customElements.define(this.NAME, this)
  }

  static get Element() {
    return document.querySelector<CodeArea>(this.NAME)
  }

  connectedCallback() {
    if (!this.isConnected) return

    const codeEl = this.querySelector<HTMLElement>('pre code')!
    codeEl.innerHTML = hljs.highlight(codeEl.innerText.trim().replaceAll('\t', '  '), { language: 'glsl' }).value
  }

  disconnectedCallback() {}
}
