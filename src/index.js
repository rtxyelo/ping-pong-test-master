const gameState = {
  redSqure: {
    x: 100,
    y: 700,
    width: 400,
    height: 50,
  },
  pointer: {
    x: 650,
    y: 600,
  },
  ball: {
    ballX: 200,
    ballY: 200,
    ballRadX: 20,
    ballRadY: 20,
    vBallX: 5,
    vBallY: 5,
  },
  bonus:{
    x: 10,
    y: 10,
    vX: 0,
    vY: 3,
    isBonusReal: false,
  },
}

let interval;
let context;
let score = 0;

const canvas = document.getElementById("cnvs")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//TODO: subscribe on window resize

function random(min, max){
  return Math.floor(Math.random()*(max - min) + min)
}

function run() {
  canvas.addEventListener('mousemove', onMouseMove, false)

  function onMouseMove(e) {
    gameState.pointer.x = e.pageX
    //gameState.pointer.y = e.pageY
  }
  interval = setInterval(gameLoop, 1000 / 60)
  setInterval(()=>{gameState.ball.vBallY *= 1.1; gameState.ball.vBallX *= 1.1}, 30000)
  setInterval(()=>{score += 1}, 1000)
  setInterval(()=>{if(!gameState.bonus.isBonusReal){gameState.bonus.x = random(0, canvas.width); gameState.bonus.y = random(0, canvas.height/2);gameState.bonus.isBonusReal = true;}}, 5000)

}

function gameLoop() {
  draw()
  update()
}

function draw() {
  context = canvas.getContext('2d')

  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  // draw redSqure
  const {x, y, width, height} = gameState.redSqure

  context.beginPath()
  context.rect(x - width/ 2, y - height/2, width, height)
  context.fillStyle = "#FF0000"
  context.fill()
  context.closePath()

  // draw ball
  const {ballX, ballY, ballRadX, ballRadY} = gameState.ball

  context.beginPath()
  context.fillStyle = "#00FFFF"
  context.ellipse(ballX, ballY, ballRadX, ballRadY, 0,0,Math.PI*2)
  context.fill()
  context.closePath()

  // draw pointer
  const pointer = gameState.pointer
  context.fillStyle = "#00FF00"
  context.fillRect(pointer.x-5,pointer.y-5,10,10)

  context.fillStyle = "#000000"
  context.font = "50px Arial"
  context.fillText(score,40,40);

  if(gameState.bonus.isBonusReal)
    context.fillText("+",gameState.bonus.x, gameState.bonus.y)
}

function update() {
  if(gameState.ball.ballY + gameState.ball.ballRadX/2> window.innerHeight){
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = "#000000"
    context.font = "50px Arial"
    context.fillText("Game Over",window.innerWidth/2 - 150,window.innerHeight/2);
    context.fillText("Your score: " + score, window.innerWidth/2 - 160,window.innerHeight/2+100)

    clearInterval(interval)
  }


  const vx = (gameState.pointer.x - gameState.redSqure.x) / 10
  const vy = (gameState.pointer.y - gameState.redSqure.y) / 10

  gameState.redSqure.x += vx
  gameState.redSqure.y += vy

  // отражение шарика от границ экрана
  if (gameState.ball.ballX - gameState.ball.ballRadX/2 < 0 || gameState.ball.ballX + gameState.ball.ballRadX/2 > window.innerWidth)
    gameState.ball.vBallX *= -1
  if (gameState.ball.ballY - gameState.ball.ballRadX/2 < 0)
    gameState.ball.vBallY *= -1

  // Коллизия шарика с кубиком
  const colX = Math.max(gameState.redSqure.x-gameState.redSqure.width/2, Math.min(gameState.ball.ballX, gameState.redSqure.x+gameState.redSqure.width/2));
  const colY = Math.max(gameState.redSqure.y-gameState.redSqure.height/2, Math.min(gameState.ball.ballY, gameState.redSqure.y+gameState.redSqure.height/2));

  const dist = Math.sqrt(
      (colX - gameState.ball.ballX) ** 2 +
      (colY - gameState.ball.ballY) ** 2
  );

  if(dist < gameState.ball.ballRadX){
    if(colX > gameState.ball.ballX || colX < gameState.ball.ballX)
      gameState.ball.vBallX *= -1;
    if(colY > gameState.ball.ballY || colY < gameState.ball.ballY)
      gameState.ball.vBallY *= -1;
  }

  gameState.ball.ballX += gameState.ball.vBallX
  gameState.ball.ballY += gameState.ball.vBallY

 if(gameState.bonus.isBonusReal){
   gameState.bonus.x += gameState.bonus.vX;
   gameState.bonus.y += gameState.bonus.vY;
 }

 if(gameState.bonus.y > window.innerHeight){
   gameState.bonus.isBonusReal = false;
 }

  // Коллизия бонуса с кубиком
  const colBonX = Math.max(gameState.redSqure.x-gameState.redSqure.width/2, Math.min(gameState.bonus.x, gameState.redSqure.x+gameState.redSqure.width/2));
  const colBonY = Math.max(gameState.redSqure.y-gameState.redSqure.height/2, Math.min(gameState.bonus.y, gameState.redSqure.y+gameState.redSqure.height/2));

  const distBon = Math.sqrt(
      (colBonX - gameState.bonus.x) ** 2 +
      (colBonY - gameState.bonus.y) ** 2
  );

  if(distBon < 5 && gameState.bonus.isBonusReal){
    gameState.bonus.isBonusReal = false;
    score += 10;
  }

}

run()
