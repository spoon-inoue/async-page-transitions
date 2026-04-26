export abstract class Page {
  constructor(private readonly message: string) {}

  log() {
    console.log(`this page is ${this.message}.`)
  }
}
