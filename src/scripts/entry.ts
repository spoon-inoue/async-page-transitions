import { CodeArea } from '@components/common/CodeArea'
import { Header } from '@components/common/Header'
import './modules/gsap'
import lenis from './modules/lenis'
import { getScrollbar } from './modules/scrollbar'
import { Router } from './router/Router'
import { defaultTransition } from './transition'

Header.Define()
CodeArea.Define()

const router = new Router('home', 'example1', 'example2', 'nest-example3', 'dynamic-generated-page')

router.prefetch()

router.transition = async (current, next) => {
  lenis.stop()
  await defaultTransition(current.element, next.element)
  lenis.start()
}

router.afterLeave = () => {
  getScrollbar(document.body)?.update(true)
}
