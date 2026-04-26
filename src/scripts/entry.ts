import { CodeArea } from '@components/common/CodeArea'
import { Header } from '@components/common/Header'
import './modules/gsap'
import lenis from './modules/lenis'
import './modules/scrollbar'
import { Router } from './router/Router'
import { defaultTransition } from './transition'
import type { Page } from './page/Page'
import * as P from './page/_'

Header.Define()
CodeArea.Define()

const page: { [namespace in string]: Page } = {
  home: new P.Home('top page'),
  example1: new P.Example1('example1 page'),
  example2: new P.Example2('example2 page'),
  'nest-example3': new P.Example2('nest page'),
  'dynamic-generated-page': new P.DynamicGeneratedPage('dynamic generated page'),
}

const router = new Router()

router.prefetch()

router.transitioning = async (current, next) => {
  lenis.stop()
  await defaultTransition(current.element, next.element)
  lenis.start()
}

router.after = (nextContent) => {
  page[nextContent.namespace]?.log()
}
