import WORDS from "./database.js"

window.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false })
document.addEventListener("keydown", handleKeydown)
document.addEventListener("click", handleClick)
const addZero = (number) => (number > 9 ? number : "0" + number)

const winContainer = document.querySelector(".win-container")

const players = ["player1", "player2"]
const repeatedWords = []
const names = []

let turn = 1
let currentWord = ""
let timer
let answer
let keyboard
let gameOver = false
let start = false

function getActives() {
 if (start) answer = document.querySelector(`.${players[turn]} > .text-field`)
 else answer = document.querySelector(".name")
 console.log(turn)
 keyboard = document.querySelector(`.${players[turn]} > .keyboard`)

 changeCoverPosition()
}
getActives()

function changeCoverPosition() {
 const COVER = document.querySelector(".cover")
 if (!gameOver) players[turn] === "player2" ? (COVER.style.top = "0") : (COVER.style.top = "50%")
 else {
  COVER.style.top = "0"
  COVER.style.height = "100%"
 }
}

function handleClick(e) {
 if (!document.fullscreenElement && e.key !== "Alt") document.documentElement.requestFullscreen()
 if (e.target.textContent.match(/^[a-z]$/)) addLetter(e.target.textContent)
 else if (e.target.classList.contains("del")) removeLetter()
 else if (e.target.classList.contains("ent")) check()
}

function handleKeydown(e) {
 if (gameOver) return
 if (e.key.match(/^[a-z]$/)) addLetter(e.key)
 else if (e.key === "Backspace") removeLetter()
 else if (e.key === "Enter") check()
}

function addLetter(letter) {
 if (answer.textContent.length > 15) return
 answer.textContent += letter
 const ACTIVE_KEY = document.querySelector(".active-key")
 if (ACTIVE_KEY) ACTIVE_KEY.classList.remove("active-key")
 console.log(keyboard)
 keyboard.querySelectorAll(".key").forEach((key) => {
  if (letter === key.innerHTML) key.classList.add("active-key")
 })
}

function removeLetter() {
 if (answer.textContent.length === 1) return
 answer.textContent = answer.textContent.slice(0, -1)
}

function check() {
 if (answer.textContent.length === 0) return
 if (!start) {
  if (!names.includes(answer.textContent)) {
   names.push(answer.textContent)
   document.querySelector(".name-container").style.transform = "translate(-50%, -50%) rotate(180deg)"

   turn = 0

   if (names.length === 2) {
    start = true
    turn++
    document.querySelector(".name-container").style.display = "none"
   }
  }

  getActives()
  answer.textContent = ""
  return
 }
 if (!WORDS.includes(answer.textContent.toLowerCase()) || repeatedWords.includes(answer.textContent))
  answer.style.borderColor = "orangered"
 else {
  restartTimer()
  repeatedWords.push(answer.textContent)
  currentWord = answer.textContent
  answer.textContent = ""
  answer.style.borderColor = "var(--border-color)"
  turn++
  if (!players[turn]) turn = 0
  getActives()
  answer.textContent = currentWord[currentWord.length - 1]
 }
}

function restartTimer() {
 let counter = 10
 if (timer) clearInterval(timer)
 timer = setInterval(() => {
  document.querySelectorAll(".timer").forEach((timer) => (timer.textContent = addZero(counter)))
  counter--
  if (counter === -1) {
   clearInterval(timer)
   announceTheWinner()
  }
 }, 1000)
}

function announceTheWinner() {
 gameOver = true
 changeCoverPosition()
 winContainer.style.display = "flex"
 document.querySelector(".winner").textContent = names[turn]
 document.querySelector(".retry").onclick = () => location.reload()
 rotate()
}

function rotate() {
 setTimeout(() => {
  winContainer.style.transform = "translate(-50%, -50%) rotate(180deg)"
  setTimeout(() => {
   winContainer.style.transform = "translate(-50%, -50%) rotate(0deg)"
   rotate()
  }, 3000)
 }, 3000)
}
