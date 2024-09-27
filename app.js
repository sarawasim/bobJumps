document.addEventListener("DOMContentLoaded", function () {
  const bob = document.querySelector(".bob")
  const grid = document.querySelector(".grid")
  const alert = document.getElementById("alert")
  const scoreDisplay = document.getElementById("score")
  let gravity = 0.9
  let isJumping = false
  let isGameOver = false
  let position = 0 // Initial position for Bob
  let score = 0

  const endGameMessages = [
    "You are a terrible programmer, sorry :(",
    "AI will most likely take your job, sorry :(",
    "You should probably find a new career, sorry :(",
    "You are not very good at this, sorry :(",
  ]

  // Control jump logic
  function control(e) {
    if (
      (e.code === "ArrowUp" || e.code === "Space") &&
      !isJumping &&
      !isGameOver
    ) {
      jump()
    }
  }

  // Jump logic
  function jump() {
    isJumping = true
    let count = 0
    let timerId = setInterval(function () {
      // Move down
      if (count === 15) {
        clearInterval(timerId)
        let downTimerId = setInterval(function () {
          if (count === 0) {
            clearInterval(downTimerId)
            isJumping = false
          }
          position -= 5
          count--
          position *= gravity
          bob.style.bottom = position + "px"
        }, 20)
      }
      // Move up
      position += 30
      count++
      position *= gravity
      bob.style.bottom = position + "px"
    }, 20)
  }

  // Generate obstacles
  function generateObstacles() {
    if (isGameOver) return

    let randomTime = Math.random() * 4000
    let obstaclePosition = 1000
    const obstacle = document.createElement("div")
    obstacle.classList.add("obstacle")
    grid.appendChild(obstacle)
    obstacle.style.left = obstaclePosition + "px"

    let timerId = setInterval(function () {
      // Check for collision
      if (obstaclePosition > 0 && obstaclePosition < 60 && position < 60) {
        clearInterval(timerId)
        endGame()
      }

      obstaclePosition -= 10
      obstacle.style.left = obstaclePosition + "px"

      // Remove obstacle if off-screen
      if (obstaclePosition <= -60) {
        clearInterval(timerId)
        grid.removeChild(obstacle)
        score++
        scoreDisplay.innerHTML = "Score: " + score
      }
    }, 20)

    setTimeout(generateObstacles, randomTime)
  }

  // End game
  function endGame() {
    alert.innerHTML = "You are a terrible programmer, sorry :("
    alert.style.display = "block"
    isGameOver = true

    // Remove obstacles but not Bob
    const obstacles = document.querySelectorAll(".obstacle")
    obstacles.forEach((obstacle) => grid.removeChild(obstacle))

    // Option to restart
    setTimeout(function () {
      alert.innerHTML = "Press Space to Restart"
      document.addEventListener("keyup", restartGame)
    }, 2000)
  }

  // Restart game
  function restartGame(e) {
    if (e.code === "Space") {
      document.removeEventListener("keyup", restartGame)
      score = 0
      scoreDisplay.innerHTML = "Score: " + score
      resetGame()
    }
  }

  // Reset game state
  function resetGame() {
    alert.style.display = "none"
    isGameOver = false
    generateObstacles()
  }

  // Initial start prompt
  alert.innerHTML = "Press Space to Start"
  alert.style.display = "block"
  scoreDisplay.innerHTML = "Score: " + score

  // Start game on space press
  document.addEventListener("keyup", function startGame(e) {
    if (e.code === "Space") {
      alert.style.display = "none"
      document.removeEventListener("keyup", startGame)
      generateObstacles()
      document.addEventListener("keyup", control)
    }
  })
})
