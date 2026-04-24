import Lenis from 'lenis'
import Tempus from 'tempus'

const lenis = new Lenis({
  duration: 0.8,
  lerp: 0.13,
})

Tempus.add(lenis.raf)

export default lenis
