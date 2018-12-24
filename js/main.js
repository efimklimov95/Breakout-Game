let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let startBtn = document.getElementById('start');
// Ball
//let x = canvas.width / 2;
let ballInitialDirection = Math.floor(Math.random() * 2);
ballInitialDirection = (ballInitialDirection === 0) ? -1 : 1;
let ballRadius = 10;
let x = Math.floor(Math.random() * (canvas.width - 2 * ballRadius));
let y = canvas.height - 30;
let dx = 3 * ballInitialDirection;
let dy = -3;

// Paddle
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleDx = 5;

// Paddle movement keys
let rightPressed;
let leftPressed;

// Game Score and Lives
let score = 0;
let lives = 3;

// Bricks
let brickRowCount = 6;
let brickColumnCount = 8;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 60;
let brickOffsetLeft = 30;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// KeyHandlers for Paddle movements
function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// function mouseMoveHandler(e) {
//   let relativeX = e.clientX - canvas.offsetLeft;
//   if(relativeX > 0 && relativeX < canvas.width) {
//       paddleX = relativeX - paddleWidth/2;
//   }
// }

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

// Collision detection between ball and bricks
function collisionDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
      for(let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if(b.status == 1 && x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;
            if(score == brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            }
          }
      }
  }
}

// Drawing Stuff
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
      for(let r = 0; r < brickRowCount; r++) {
        let b = bricks[c][r];
        if (b.status == 1) {
          b.x = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          b.y = (r * (brickHeight + brickPadding)) + brickOffsetTop;
          ctx.beginPath();
          ctx.rect(b.x, b.y, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
  }
}

// Main drawing function where magic happens
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
  drawLives();
  collisionDetection();
  
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (
    x + dx >= paddleX &&
    x + dx <= paddleX + paddleWidth &&
    y + dy > canvas.height - paddleHeight - ballRadius &&
    (x < paddleX || x > paddleX + paddleWidth) 
  ) {
    dx = -dx;
  }

  if (
    y + dy < ballRadius ||
    (
      y + dy > canvas.height - paddleHeight - ballRadius &&
      x + dx > paddleX &&
      x + dx < paddleX + paddleWidth &&
      y <= canvas.height - paddleHeight - ballRadius
    )
  ) {
    dy = -dy;
  } else if (y + dy > canvas.height) {
    lives--;
    if (!lives) {
        alert("GAME OVER");
        document.location.reload();
    } else {
        x = Math.floor(Math.random() * (canvas.width - 2 * ballRadius));
        y = canvas.height - 30;
        ballInitialDirection = Math.floor(Math.random() * 2);
        ballInitialDirection = (ballInitialDirection === 0) ? -1 : 1;
        dx = 3 * ballInitialDirection;
        dy = -3;
        paddleX = (canvas.width-paddleWidth) / 2;
    }
  }

  if (rightPressed && (paddleX + paddleWidth) < canvas.width) {
    paddleX += paddleDx;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleDx;
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

//draw();
drawPaddle();
drawBricks();
drawScore();
drawLives();
drawBall();

// Wait for button press to start the game
function waitForButtonPress() {
  document.removeEventListener('keydown', waitForButtonPress);
  draw();
}
document.addEventListener('keydown', waitForButtonPress);