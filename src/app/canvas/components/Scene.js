import AutoBind from 'auto-bind'
import { Plane, Transform } from 'ogl'

import Slider from '@/canvas/components/Slider'
import Title from '@/canvas/components/Title'

export default class Scene {
  constructor ({ area, camera, gl, group, mouse, page, renderer, sizes }) {
    AutoBind(this)

    this.area = area
    this.camera = camera
    this.gl = gl
    this.mouse = mouse
    this.page = page
    this.renderer = renderer
    this.scene = group
    this.sizes = sizes
  }

  create () {
    this.createWrapper()
    this.createSliders()
    this.createTitles()
  }

  createWrapper () {
    this.group = new Transform()
    this.group.setParent(this.scene)
  }

  createSliders () {
    this.slidersElements = this.page.element.querySelectorAll('.project')

    const geometry = new Plane(this.gl, {
      heightSegments: 25,
      widthSegments: 60
    })

    if (this.slidersElements?.length) {
      this.sliders = this.slidersElements.map(element => {
        return new Slider({
          area: this.area,
          element,
          geometry,
          gl: this.gl,
          group: this.group,
          sizes: this.sizes
        })
      })
    }
  }

  createTitles () {
    this.titlesElements = this.page.element.querySelectorAll('[data-title]')

    if (this.titlesElements?.length) {
      this.titles = this.titlesElements.map(element => {
        return new Title({
          area: this.area,
          camera: this.camera,
          element,
          gl: this.gl,
          group: this.group,
          renderer: this.renderer,
          sizes: this.sizes
        })
      })
    }
  }

  /**
   * Events.
   */
  onResize (event) {
    this.sliders?.forEach(slider => {
      slider.onResize(event)
    })

    this.titles?.forEach(title => {
      title.onResize(event)
    })
  }

  /**
   * Animation.
   */
  show () {
    this.titles.forEach(title => {
      title.createObserver()
    })
  }

  /**
   * Loop.
   */
  update () {
    this.sliders?.forEach(slider => {
      slider.update({ page: this.page })
    })

    this.titles?.forEach(title => {
      title.update({ page: this.page })
    })

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }
}
