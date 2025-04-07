import "./styles/index.scss"

const openMenu = document.querySelector(".header__burger")
const closeMenu = document.querySelector(".header__cross")
const header = document.querySelector(".header")

const controlPrev: HTMLButtonElement = document.querySelector(".control__prev")!
const controlNext: HTMLButtonElement = document.querySelector(".control__next")!
const track: HTMLElement = document.querySelector(".cards__track")!
const slides = Array.from(track.children) as HTMLElement[]
let slideWidth = slides[0].offsetWidth

let startX: number = 0
let currentX: number = 0
let isDragging: boolean = false
let currentIndex: number = 0

function toggleMenu() {
  header?.classList.toggle("header--open-menu")
}

openMenu?.addEventListener("click", toggleMenu)
closeMenu?.addEventListener("click", toggleMenu)

const startDrag = (clientX: number) => {
  isDragging = true
  startX = clientX
  currentX = -currentIndex * slideWidth
  track.style.transition = "none"
  document.body.style.userSelect = "none"
}

const updateDrag = (clientX: number) => {
  if (!isDragging) return
  const newX = currentX + (clientX - startX)
  const minX = -(slideWidth * (slides.length - 1))
  
  track.style.transition = "transform 0.1s linear"

  if (newX > 0) {
    track.style.transform = `translateX(0px)`
  } else if (newX < minX) {
    track.style.transform = `translateX(${minX}px)`
  } else {
    track.style.transform = `translateX(${newX}px)`
  }

}

const endDrag = () => {
  if (!isDragging) return
  isDragging = false

  const currentTranslate = parseInt(track.style.transform.replace("translateX(", "").replace("px)", "") || "0")
  currentIndex = Math.abs(Math.round(currentTranslate / slideWidth))

  track.style.transition = "transform 0.3s ease-in-out"
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`
  document.body.style.userSelect = ""

  setTimeout(() => {
    track.style.transition = ""
  }, 300)
}

controlPrev.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1
  }
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`
})
controlNext.addEventListener("click", () => {
  if (currentIndex < slides.length - 1) {
    currentIndex += 1
  }
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`
})

track.addEventListener("mousedown", (e: MouseEvent) => {
  startDrag(e.clientX)
  e.preventDefault()
})
document.addEventListener("mousemove", (e: MouseEvent) => {
  if (!isDragging) return
  updateDrag(e.clientX)
})

track.addEventListener(
  "touchstart",
  (e: TouchEvent) => {
    startDrag(e.touches[0].clientX)
    e.preventDefault()
  },
  { passive: false }
)

track.addEventListener(
  "touchmove",
  (e: TouchEvent) => {
    if (!isDragging) return
    updateDrag(e.touches[0].clientX)
    e.preventDefault()
  },
  { passive: false }
)

window.addEventListener("resize", () => {
  slideWidth = slides[0].offsetWidth
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`
})

document.addEventListener("mouseup", endDrag)
track.addEventListener("touchend", endDrag)
