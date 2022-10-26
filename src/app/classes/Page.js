import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import Component from '@/classes/Component'
import Detection from '@/classes/Detection'

import Paragraph from '@/components/Paragraph'
import Section from '@/components/Section'

import { getBoundingClientRect } from '@/utils/dom'
import { lerp } from '@/utils/math'

export default class Page extends Component {
  constructor () {
    super({
      classes: {
        menuActive: 'menu--active'
      },
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        menu: '.menu',
        headerArrow: '.header__arrow',
        headerArrowDash: '.header__arrow__dash',
        headerArrowTriangle: '.header__arrow__triangle',
        paragraphs: '.about h2, .about p, .project p',
        sections: '[data-section]'
      }
    })

    this.transform = Prefix('transform')

    this.scroll = {
      current: 0,
      easing: 0.1,
      percent: 0,
      position: 0,
      speed: 1.2,
      target: 0
    }

    this.create()
  }

  create () {
    super.create()

    this.createObserver()
    this.createParagraphs()
    this.createScrolling()

    this.timeline = GSAP.timeline({
      delay: 2.5
    })

    this.timeline.fromTo(this.elements.headerArrow, {
      y: '-20rem'
    }, {
      duration: 2,
      ease: 'expo.inOut',
      y: 0
    }, 0)

    this.timeline.fromTo(this.elements.headerArrowDash, {
      scaleY: 0
    }, {
      duration: 1,
      ease: 'expo.in',
      onComplete: _ => {
        GSAP.to(this.elements.headerArrowDash, {
          duration: 1,
          ease: 'expo.out',
          scaleY: 1
        })
      },
      scaleY: 2
    }, 0)

    this.timeline.fromTo(this.elements.headerArrowTriangle, {
      scale: 0,
      y: '2rem'
    }, {
      duration: 1,
      ease: 'expo.out',
      scale: 1,
      transformOrigin: '0 100%',
      y: 0
    }, 1)
  }

  createObserver () {
    this.observer = new window.ResizeObserver(entries => {
      for (const _ of entries) { // eslint-disable-line
        this.onResize()
      }
    })

    this.observer.observe(this.elements.wrapper)
  }

  createParagraphs () {
    this.paragraphs = this.elements.paragraphs.map((element, index) => {
      return new Paragraph({
        element,
        index
      })
    })
  }

  createScrolling () {
    this.sections = this.elements.sections.map((element, index) => {
      return new Section({
        element,
        index,
        parent: this
      })
    })
  }

  /**
   * Events.
   */
  onResize (event) {
    this.scroll = {
      current: 0,
      easing: 0.1,
      percent: 0,
      position: 0,
      speed: 1.2,
      target: 0
    }

    this.elements.wrapper.style[this.transform] = 'translate3d(0, 0, 0)'

    this.bounds = getBoundingClientRect(this.elements.wrapper)

    this.sections.forEach(section => {
      section.onResize(this.bounds.height)
    })
  }

  onKeyDown ({ key }) {
    if (key === 'ArrowUp') {
      this.scroll.target += 200
    } else if (key === 'ArrowDown') {
      this.scroll.target -= 200
    }
  }

  onMouseDown (event) {
    if (!Detection.isMobile()) return

    this.isDown = true

    this.scroll.position = this.scroll.current
  }

  onMouseMove (event) {
    if (!Detection.isMobile()) return
    if (!this.isDown) return

    const { mouse } = event

    if (mouse.distance.y > 30 || mouse.distance.y < -30) {
      this.scroll.target = this.scroll.position - (mouse.distance.y * 2)
    }
  }

  onMouseUp (event) {
    if (!Detection.isMobile()) return

    this.isDown = false
  }

  onWheel (event) {
    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY * this.scroll.speed

    this.scroll.target -= speed
  }

  /**
   * Animation.
   */
  show () {
    this.paragraphs.forEach(paragraph => {
      paragraph.createObserver()
    })
  }

  /**
   * Loop.
   */
  update () {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.easing)

    if (this.scroll.current < this.scroll.last) {
      this.scroll.direction = 'down'
    } else {
      this.scroll.direction = 'up'
    }

    this.elements.wrapper.style[this.transform] = `translate3d(0, ${this.scroll.current}px, 0)`

    this.scroll.last = this.scroll.current

    if (this.scroll.current !== 0) {
      this.elements.menu.classList.add(this.classes.menuActive)
    }

    this.sections.forEach(section => section.update?.())
  }

  /**
   * Events.
   */
  addEventListeners () {
    window.addEventListener('mousewheel', this.onWheel, { passive: true })
    window.addEventListener('wheel', this.onWheel, { passive: true })

    window.addEventListener('keydown', this.onKeyDown)
  }
}
