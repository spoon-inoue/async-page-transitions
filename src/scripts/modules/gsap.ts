import gsap from 'gsap'
import Tempus from 'tempus'

// Remove GSAP's internal RAF
gsap.ticker.remove(gsap.updateRoot)

// Add to Tempus
Tempus.add((time) => {
  gsap.updateRoot(time / 1000)
})

export default gsap
