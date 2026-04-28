export class About extends HTMLElement {
  private static readonly NAME = 'home-about'

  static Define() {
    customElements.get(this.NAME) || customElements.define(this.NAME, this)
  }

  static get Element() {
    return document.querySelector<About>(this.NAME)
  }

  connectedCallback() {
    if (!this.isConnected) return

    const target = this.querySelector<HTMLElement>('p')!
    const treeWalker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
    const allTextNodes = []
    let currentNode = treeWalker.nextNode()
    while (currentNode) {
      allTextNodes.push(currentNode)
      currentNode = treeWalker.nextNode()
    }

    const searchTexts = ['Inconsolata', 'monospace', 'monospaced', 'Consolas', 'programmer fonts']

    const ranges: Range[] = []
    for (const searchText of searchTexts) {
      for (const textNode of allTextNodes) {
        ranges.push(...this.getRanges(textNode, searchText))
      }
    }

    const highlight = new Highlight(...ranges.flat())
    CSS.highlights.set('keyword', highlight)
  }

  private getRanges(textNode: Node, searchText: string) {
    const ranges: Range[] = []

    const text = textNode.textContent?.toLowerCase()
    if (!text) return ranges

    const search = searchText.toLowerCase()

    let startPos = 0
    const indices: number[] = []
    while (startPos < text.length) {
      startPos = text.indexOf(search, startPos)
      if (startPos === -1) break
      indices.push(startPos)
      startPos += search.length
    }

    for (const index of indices) {
      const range = new Range()
      range.setStart(textNode, index)
      range.setEnd(textNode, index + search.length)
      ranges.push(range)
    }

    return ranges
  }

  disconnectedCallback() {
    CSS.highlights.clear()
  }
}
