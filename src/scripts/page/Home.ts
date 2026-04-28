import { About } from '@components/home/About'
import { Page } from './Page'

export class Home extends Page {
  constructor(message: string) {
    super(message)
  }

  define() {
    About.Define()
  }
}
