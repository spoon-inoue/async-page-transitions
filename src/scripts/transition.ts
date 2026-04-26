import gsap from './modules/gsap'
import { media } from './modules/media'

export function defaultTransition(current: HTMLElement, next: HTMLElement) {
  const scrollY = window.scrollY
  window.scrollTo({ top: 0 })

  current.classList.add('transition')

  const tl = gsap.timeline()
  tl.set(current, { '--offset-y': `${scrollY}px` })
  tl.fromTo(current, { scale: 1, '--transparent': '100%' }, { scale: media.isPc ? 0.9 : 0.85, '--transparent': '50%', duration: 0.8, ease: 'power2.inOut' })
  tl.fromTo(current, { y: -scrollY }, { y: -scrollY - window.innerHeight * 0.5, duration: 1, ease: 'power1.inOut' }, 0)
  tl.fromTo(next, { y: window.innerHeight }, { y: 0, duration: 0.8, ease: 'power1.inOut' }, 0)
  return tl
}
