const turtle = document.getElementById("turtle");
const body = turtle.querySelector(".body");
const head = turtle.querySelector(".head");
const legs = turtle.querySelectorAll(".leg");
const tail = turtle.querySelector(".tail");

let x = 200;
let y = 400;
let baseSpeed = 200;
let speed = baseSpeed;
let trashFallSpeed = 2;
let hearts = 3;
const scoreboard = document.getElementById("scoreboard");
const gameOver = document.getElementById("gameOver");
const timerDisplay = document.getElementById("timer");

let gameStartTime = Date.now();
let gameEnded = false;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function setTurtleColor(color) {
  body.style.backgroundColor = color;
  head.style.backgroundColor = color === "red" ? "#b22222" : "#388E3C";
  tail.style.backgroundColor = color === "red" ? "#b22222" : "#388E3C";
  legs.forEach(leg => {
    leg.style.backgroundColor = color === "red" ? "#b22222" : "#388E3C";
  });
}

function resetTurtleColor() {
  setTurtleColor("#7ed87e");
}

window.addEventListener("keydown", (e) => {
  if (gameEnded) return;
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

function checkCollision(trash) {
  const turtleRect = turtle.getBoundingClientRect();
  const trashRect = trash.getBoundingClientRect();
  return !(
    turtleRect.right < trashRect.left ||
    turtleRect.left > trashRect.right ||
    turtleRect.bottom < trashRect.top ||
    turtleRect.top > trashRect.bottom
  );
}

function createTrash() {
  if (gameEnded) return;
  const trash = document.createElement("div");
  trash.classList.add("trash");
  trash.style.left = Math.random() * (window.innerWidth - 20) + "px";
  trash.style.top = "-30px";
  document.querySelector(".background").appendChild(trash);

  let trashY = -30;
  function fall() {
    if (gameEnded) {
      trash.remove();
      return;
    }

    trashY += trashFallSpeed;
    trash.style.top = trashY + "px";

    if (checkCollision(trash)) {
      setTurtleColor("red");
      setTimeout(resetTurtleColor, 2000);
      trash.remove();
      hearts--;
      updateHearts();
      if (hearts <= 0) endGame();
      return;
    }

    if (trashY < window.innerHeight) {
      requestAnimationFrame(fall);
    } else {
      trash.remove();
    }
  }
  fall();
}

function updateHearts() {
  scoreboard.textContent = "❤️".repeat(hearts);
}

function endGame() {
  gameEnded = true;
  clearInterval(trashInterval);
  clearInterval(speedIncreaseInterval);
  scoreboard.style.display = "none";
  timerDisplay.style.display = "none";
  const secondsSurvived = Math.floor((Date.now() - gameStartTime) / 1000);
  gameOver.textContent = `게임 종료\n거북스딱스 수명: ${secondsSurvived}초\n화면을 클릭하면 다시 시작합니다`;
  gameOver.style.display = "block";
}

function increaseSpeed() {
  if (gameEnded) return;
  speed += 20;
  trashFallSpeed += 0.2;
}

let lastTime = null;
function move(time) {
  if (gameEnded) return;
  if (!lastTime) lastTime = time;
  let delta = (time - lastTime) / 1000;
  lastTime = time;

  let dx = 0, dy = 0;
  if (keys.ArrowUp) dy -= 1;
  if (keys.ArrowDown) dy += 1;
  if (keys.ArrowLeft) dx -= 1;
  if (keys.ArrowRight) dx += 1;

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  x += dx * speed * delta;
  y += dy * speed * delta;
  x = Math.min(window.innerWidth - turtle.clientWidth, Math.max(0, x));
  y = Math.min(window.innerHeight - turtle.clientHeight, Math.max(0, y));
  turtle.style.left = x + "px";
  turtle.style.top = y + "px";

  let secondsPassed = Math.floor((Date.now() - gameStartTime) / 1000);
  timerDisplay.textContent = `거북스딱스 수명: ${secondsPassed}초`;

  requestAnimationFrame(move);
}

function restartGame() {
  x = 200;
  y = 400;
  speed = baseSpeed;
  trashFallSpeed = 2;
  hearts = 3;
  gameEnded = false;
  gameStartTime = Date.now();
  turtle.style.left = x + "px";
  turtle.style.top = y + "px";
  updateHearts();
  scoreboard.style.display = "block";
  timerDisplay.style.display = "block";
  gameOver.style.display = "none";
  resetTurtleColor();
  document.querySelectorAll(".trash").forEach(el => el.remove());
  trashInterval = setInterval(createTrash, 1000);
  speedIncreaseInterval = setInterval(increaseSpeed, 7000);
  requestAnimationFrame(move);
}

document.addEventListener("click", () => {
  if (gameEnded) restartGame();
});

updateHearts();
let trashInterval = setInterval(createTrash, 1000);
let speedIncreaseInterval = setInterval(increaseSpeed, 7000);
requestAnimationFrame(move);
