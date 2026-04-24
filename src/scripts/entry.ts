import { CodeArea } from '@components/common/CodeArea'
import { Header } from '@components/common/Header'
import './modules/gsap'
import lenis from './modules/lenis'
import { getScrollbar } from './modules/scrollbar'
import * as P from './pages/_'
import { Router } from './router'
import { defaultTransition } from './transition'

Header.Define()
CodeArea.Define()

const router = new Router({
  '/': new P.Home('home', 'index.html'),
  '/example1': new P.Example1('example1', 'example1.html'),
  '/example2': new P.Example2('example2', 'example2.html'),
  '/nest/example3': new P.NestExample3('nest-example3', 'nest/example3.html'),
})

router.prefetch()

router.transition = async (current, next) => {
  lenis.stop()
  await defaultTransition(current.element, next.element)
  lenis.start()
}

router.afterLeave = () => {
  getScrollbar(document.body)?.update(true)
}
