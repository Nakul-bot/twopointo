/* eslint-disable no-new */
import KeenSlider from 'keen-slider'

import Component from '@/classes/Component'

export default class extends Component {
  constructor () {
    console.log('constructor')
    super({
      element: '',
      elements: {

      }
    })

    this.createSlider()
    this.createThumbnail()
  }

  ThumbnailPlugin (main) {
    return (slider) => {
      function removeActive () {
        slider.slides.forEach((slide) => {
          slide.classList.remove('active')
        })
      }

      function addActive (idx) {
        slider.slides[idx].classList.add('active')
      }

      function addClickEvents () {
        slider.slides.forEach((slide, idx) => {
          slide.addEventListener('click', () => {
            main.moveToIdx(idx)
          })
        })
      }

      slider.on('created', () => {
        addActive(slider.track.details.rel)
        addClickEvents()
        main.on('animationStarted', (main) => {
          removeActive()
          const next = main.animator.targetIdx || 0
          addActive(main.track.absToRel(next))
          slider.moveToIdx(next)
        })
      })
    }
  }

  createSlider () {
    this.sliderComponent = new KeenSlider(
      '#my-keen-slider', {
        loop: true
      },
      [
        (slider) => {
          let timeout
          let mouseOver = false

          function clearNextTimeout () {
            clearTimeout(timeout)
          }

          function nextTimeout () {
            clearTimeout(timeout)
            if (mouseOver) return
            timeout = setTimeout(() => {
              slider.next()
            }, 2000)
          }
          slider.on('created', () => {
            slider.container.addEventListener('mouseover', () => {
              mouseOver = true
              clearNextTimeout()
            })
            slider.container.addEventListener('mouseout', () => {
              mouseOver = false
              nextTimeout()
            })
            nextTimeout()
          })
          slider.on('dragStarted', clearNextTimeout)
          slider.on('animationEnded', nextTimeout)
          slider.on('updated', nextTimeout)
        }
      ]
    )
  }

  createThumbnail () {
    this.thumbnail = new KeenSlider(
      '#thumbnails', {
        initial: 0,
        slides: {
          perView: 4,
          spacing: 10
        }
      },
      [this.ThumbnailPlugin(this.sliderComponent)]
    )
  }
}
