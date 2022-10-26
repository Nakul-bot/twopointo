import GSAP from 'gsap'

import Component from '@/classes/Component'

export default class extends Component {
  constructor ({ element, index, scrolling }) {
    super({
      element
    })

    this.animateOut()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn()
        } else {
          this.animateOut()
        }
      })
    }).observe(this.element)
  }

  /**
   * Animations.
   */
  animateIn () {
    GSAP.to(this.element, {
      autoAlpha: 1,
      duration: 2.5,
      ease: 'linear'
    })
  }

  animateOut () {
    GSAP.killTweensOf(this.element)

    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }
}
