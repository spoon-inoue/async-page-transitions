export class Header extends HTMLElement {
  private static readonly NAME = 'global-header'

  static Define() {
    customElements.get(this.NAME) || customElements.define(this.NAME, this)
  }

  static get Element() {
    return document.querySelector<Header>(this.NAME)
  }

  connectedCallback() {
    if (!this.isConnected) return
  }

  disconnectedCallback() {}
}
