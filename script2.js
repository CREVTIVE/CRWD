console.clear()
console.log('crowd')

const config = {
  src: '/assets/people.webp',
  rows: 15,
  cols: 7
}

// UTILS

const random = (min, max) => min + Math.random() * (max - min)

// CLASSES

class Peep {
  constructor({ image, rect }) {
    this.image = image
    this.setRect(rect)
    this.x = 0
    this.y = 0
    this.anchorY = 0
    this.scaleX = 1
    this.walk = null
  }
  
  setRect (rect) {
    [,, this.width, this.height] = this.rect = rect
    this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height]
  }
  
  render (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.scaleX, 1)
    ctx.drawImage(...this.drawArgs)
    ctx.restore()
  }
}

const img = document.createElement('img')
img.onload = init
img.src = config.src

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const allPeeps = []
let availablePeeps = []
const crowd = []

const stage = { width: 0, height: 0 }

function init() {  
  createPeeps()
  resize()
  gsap.ticker.add(render)
  window.addEventListener('resize', resize)
}

function createPeeps() {
  const { rows, cols, naturalWidth: width, naturalHeight: height } = Object.assign(img, config)
  const total = rows * cols
  const rectWidth = width / rows
  const rectHeight = height / cols
  
  for (let i = 0; i < total; i++) {
    allPeeps.push(new Peep({
      image: img,
      rect: [ (i % rows) * rectWidth, (i / rows | 0) * rectHeight, rectWidth, rectHeight ]
    }))
  }  
}

function resize() {
  Object.assign(stage, {
    width: canvas.clientWidth,
    height: canvas.clientHeight
  })
  Object.assign(canvas, {
    width: stage.width * devicePixelRatio,
    height: stage.height * devicePixelRatio
  })

  crowd.forEach(({ walk }) => walk.kill())
  
  availablePeeps = [...allPeeps]

  if (stage.width < 768) 
    availablePeeps.length *= 0.6

  while (availablePeeps.length)
    addPeepToCrowd().walk.progress(Math.random())
}

function addPeepToCrowd() {
  const peep = removeFromArray(availablePeeps, random(0, availablePeeps.length))
  const direction = random(0, 1) > 0.5 ? 1 : -1
  const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
  const startY = stage.height - peep.height + offsetY
  let startX
  let endX

  if (direction === 1) {
    startX = -peep.width
    endX = stage.width
    peep.scaleX = 1
  } else {
    startX = stage.width + peep.width
    endX = 0
    peep.scaleX = -1
  }
  
  peep.x = startX
  peep.y = startY
  peep.anchorY = startY

  const tl = gsap.timeline({ timeScale: random(0.5, 1.5) })
  tl.to(peep, { duration: 10, x: endX, ease: 'none' }, 0)
   .to(peep, { duration: 0.25, repeat: 10 / 0.25, yoyo: true, y: startY - 10 }, 0)
   .eventCallback('onComplete', () => {
    removeItemFromArray(crowd, peep)
    addPeepToCrowd()
  })

  crowd.push(peep)
  peep.walk = tl
  crowd.sort((a, b) => a.anchorY - b.anchorY)
  
  return peep
}

function render() {
  canvas.width = canvas.width
  ctx.save()
  ctx.scale(devicePixelRatio, devicePixelRatio)
  crowd.forEach((peep) => peep.render(ctx))
  ctx.restore()
}
