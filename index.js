let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const directions = {
  RIGHT:"right",
  LEFT:"left",
  UP:"up",
  DOWN:"down",
}

let gridSize = 10;
let snake;
let direction = directions.RIGHT;
let food = {};
let score = 0;
let lastDirection;

const axes = {
  X:"x",
  Y:"y",
}


function createFood() {
  food.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
  food.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
}

function createSnake(){
  snake = [{},{}];
  snake[0].x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
  snake[0].y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
 const axis = Math.random() > 0.5 ? axes.X : axes.Y;
  if(axis === axes.X){
      snake[1].x = snake[0].x - 10;
      snake[1].y = snake[0].y;
      direction = directions.RIGHT;
  }
  else{
    snake[1].y = snake[0].y - 10;
    snake[1].x = snake[0].x;
    direction = directions.DOWN;
  }
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
  const { RIGHT, LEFT , UP, DOWN } = directions;
  if (direction === RIGHT && lastDirection === LEFT ||
  direction === LEFT && lastDirection === RIGHT || direction === UP && lastDirection === DOWN || direction === DOWN && lastDirection === UP ) {
   snake.reverse();
   lastDirection = null;
  }

  let head = {x: snake[0].x, y: snake[0].y};
  if (direction === RIGHT) head.x += gridSize;
  else if (direction === LEFT) head.x -= gridSize;
  else if (direction === UP) head.y -= gridSize;
  else if (direction === DOWN) head.y += gridSize; 
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    createFood();
    updateScore(++score);
  } 
  else if(head.x === -10 || head.x === 400 || head.y === -10 || head.y === 400){
    isPlaying = false;
    clearInterval(interval);
    initalPostition();
    setButtonPlaying();
  }
  else {
    snake.pop()
  }

}


function updateScore(newScore){
  const scoreElement = document.querySelector(".score");
  scoreElement.innerHTML = `YOUR SCORE: ${newScore}`;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clearCanvas();
  moveSnake();
  drawSnake();
  drawFood();
}


const changeDirection = ()=>{
  addEventListener("keydown",(e)=>{
    const { key } = e;
    lastDirection = direction;
    switch(key){
      case "ArrowDown":
        direction = "down";
        break;
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
    }
    changeArrowFocusedOnScreen(direction);

  })
}

function changeArrowFocusedOnScreen(direction){
  const currentArrowFocused = document.querySelector('.current__direction');
  const newCurrentFocusedArrow = document.querySelector(`.direction__${direction}`);
  currentArrowFocused.classList.remove("current__direction");
  newCurrentFocusedArrow.classList.add("current__direction");
}

changeDirection();

let interval;
let isPlaying = false;
let currentLevel = "EASY";

const speed = {
  EASY:300,
  NORMAL:200,
  HARD:100
}


const buttonStart = document.querySelector(".button__start");
buttonStart.addEventListener("click", () =>{
  isPlaying = !isPlaying;
  if(isPlaying){
    interval = setInterval(draw,speed[currentLevel])
  }
  else{
    clearInterval(interval);
  }
  setButtonPlaying()
})

const setButtonPlaying =()=>{
  buttonStart.innerHTML = isPlaying ? "<i class='bx bx-pause' ></i>":"<i class='bx bx-play'></i>";
}

const buttonsLevel = [...document.querySelectorAll(".level")];

buttonsLevel.forEach(level =>{
  level.addEventListener("click",(e)=>{
    currentLevel = e.target.name;
    initalPostition();
    isPlaying = false;
    setButtonPlaying();
    clearInterval(interval)
  })
})

function initalPostition(){
     clearCanvas();
     createFood();
     createSnake()
     drawSnake();
     drawFood();
     changeArrowFocusedOnScreen(direction);
     updateScore(score = 0)
}

initalPostition()
