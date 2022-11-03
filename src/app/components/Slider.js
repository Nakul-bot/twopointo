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
              // slider.next()
            }, 2000)
          }
          slider.on('created', () => {
            window.nextSlide = () => {
              if (slider.track.details.abs === 6) slider.moveToIdx(0)
              else slider.next()

              for (let slideIndex = 1; slideIndex <= 7; slideIndex += 1) {
                const slide = slider.container.getElementsByClassName(`number-slide${slideIndex}`)[0]
                const video = slide.children[0]
                video.currentTime = 0
              }
            }

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
          slider.on('dragEnded', () => {
            console.log('update')
            const slideIndex = (slider.track.details.abs % slider.track.details.length) + 1
            const slide = slider.container.getElementsByClassName(`number-slide${slideIndex}`)[0]
            const video = slide.children[0]
            video.currentTime = 0
            video.play()
            console.log(slide)
          })
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
