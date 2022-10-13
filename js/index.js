//Game constants & variables
let inputDirection = { x: 0, y: 0 }
const snakeFoodSound = new Audio('./mixkit-chewing-something-crunchy-2244.wav')
const snakeGameOver = new Audio('./mixkit-player-losing-or-failing-2042.wav')
const snakeMoveSound = new Audio('./move.wav')
let speed = 5
let score = 0
let pause = false
let lastPaintTime = 0
let snakeArray = [{ x: 13, y: 15 }]
let food = { x: 5, y: 5 }
//Game Functions
function main (ctime) {
  window.requestAnimationFrame(main)
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return
  }
  lastPaintTime = ctime
  gameEngine()
  //console.log(ctime);
}

function isCollide (snakeArray) {
  //if you bump into yourself
  for (let i = 1; i < snakeArray.length; i++) {
    if (
      snakeArray[i].x === snakeArray[0].x &&
      snakeArray[i].y === snakeArray[0].y
    ) {
      return true
    }
  }

  //if you bump into wall
  if (
    snakeArray[0].x >= 18 ||
    snakeArray[0].x <= 0 ||
    snakeArray[0].y >= 18 ||
    snakeArray[0].y <= 0
  ) {
    return true
  }
}

function gameEngine () {
  let highScore = 0
  if (localStorage.getItem('highScore') == null) {
    localStorage.setItem('highScore', score)
  } else {
    highScore = localStorage.getItem('highScore')
  }
  highscore_display.innerHTML = 'HighScore: ' + highScore
  //Part 1: Updating the snake array & food
  if (isCollide(snakeArray)) {
    snakeGameOver.play()
    inputDirection = { x: 0, y: 0 }
    // alert("Press any key to play again!");
    gameOver.style.display = 'block'
    snakeArray = [{ x: 13, y: 15 }]
    score = 0
    score_display.innerHTML = 'Score: 0'
  }
  //If you have eaten food, increment the score and regenerate food
  if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
    snakeFoodSound.play()
    score++
    score_display.innerHTML = 'Score: ' + score
    if (localStorage.getItem('highScore') < score) {
      localStorage.setItem('highScore', score)
    }
    snakeArray.unshift({
      x: snakeArray[0].x + inputDirection.x,
      y: snakeArray[0].y + inputDirection.y
    })
    let a = 2
    let b = 16
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random())
    }
  }

  //Moving the snake
  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] } //can't assign directly, as it would reference and not just copy
  }
    snakeArray[0].x += inputDirection.x
    snakeArray[0].y += inputDirection.y

  //Part 2: Render the snake & food
  //Display the snake
  board.innerHTML = ''
  snakeArray.forEach((element, index) => {
    snakeBody = document.createElement('div')
    snakeBody.style.gridRowStart = element.y
    snakeBody.style.gridColumnStart = element.x
    if (index === 0) {
      snakeBody.classList.add('snake_head')
    } else {
      snakeBody.classList.add('snake_body')
    }
    board.appendChild(snakeBody)
  })
  foodBody = document.createElement('div')
  foodBody.style.gridRowStart = food.y
  foodBody.style.gridColumnStart = food.x
  foodBody.classList.add('snake_food')
  board.appendChild(foodBody)
}

//Main Logic starts here
window.requestAnimationFrame(main)
window.addEventListener('keydown', event => {
  if (event.key == ' ') {
    pause == true ? (pause = false) : (pause = true)
  }
  if (!pause) {
    //inputDirection = { x: 0, y: -1 }; //Start the game at any keyPress
    if (gameOver.style.display == 'block') {
      gameOver.style.display = 'none'
    }
    switch (event.key) {
      case 'ArrowUp':
        snakeMoveSound.play()
        inputDirection.x = 0
        inputDirection.y = -1
        break
      case 'ArrowDown':
        snakeMoveSound.play()
        inputDirection.x = 0
        inputDirection.y = 1
        break
      case 'ArrowLeft':
        snakeMoveSound.play()
        inputDirection.x = -1
        inputDirection.y = 0
        break
      case 'ArrowRight':
        snakeMoveSound.play()
        console.log('ArrowRight')
        inputDirection.x = 1
        inputDirection.y = 0
        break
      default:
        break
    }
  }
})
