import { CodeArea } from '@components/common/CodeArea'
import { Header } from '@components/common/Header'
import './modules/gsap'
import lenis from './modules/lenis'
import './modules/scrollbar'
import type { Page } from './page/Page'
import * as P from './page/_'
import { router } from './router/Router'
import { defaultTransition } from './transition'

Header.Define()
CodeArea.Define()

const page: { [namespace in string]: Page } = {
  home: new P.Home('top page'),
  example1: new P.Example1('example1 page'),
  example2: new P.Example2('example2 page'),
  'nest-example3': new P.Example3('nest page'),
  'dynamic-generated-page': new P.DynamicGeneratedPage('dynamic generated page'),
}

const namespace = document.querySelector<HTMLElement>('[data-transition="container"]')?.dataset.namespace
if (namespace && Object.hasOwn(page, namespace)) {
  page[namespace].define()
}

router.prefetch()

router.transitioning = async (current, next) => {
  lenis.stop()
  await defaultTransition(current.element, next.element)
  lenis.start()
}

router.after = (nextContent) => {
  if (Object.hasOwn(page, nextContent.namespace)) {
    const nextPage = page[nextContent.namespace]
    nextPage.log()
    nextPage.define()
  }
}
