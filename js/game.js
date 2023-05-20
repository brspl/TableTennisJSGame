let canvas;
let canvasContext;
const FRAMES_PER_SECOND = 60;
const WINNING_SCORE = 15;
let winScreen = false;

//test
let ball = {
    x: 50,
    y: 50,
    speedX: 10,
    speedY: 5
};

const PADDLE_HEIGHT = 100;
const PADDLE_THICK = 10;

let player = {
    paddle: window.innerHeight / 2 - (PADDLE_HEIGHT / 2),
    height: PADDLE_HEIGHT,
    score: 0
};

let computer = {
    paddle: window.innerHeight / 2 - (PADDLE_HEIGHT / 2),
    height: PADDLE_HEIGHT,
    score: 0
};

function playerPosition(evt)
{
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick()
{
    if(winScreen)
    {
        player.score = 0;
        computer.score = 0;
        winScreen = false;
    }
}

window.onload = function ()
{
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", windowResize);

    setInterval(game, 1000 / FRAMES_PER_SECOND);

    canvas.addEventListener("mousedown", handleMouseClick);
    canvas.addEventListener("mousemove",
        function (evt)
        {
            let mousePos = playerPosition(evt);
            player.paddle = mousePos.y - (PADDLE_HEIGHT / 2);
        })

}

function windowResize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawRect(leftX, topY, width, height, drawColor)
{
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function drawTable()
{
    drawRect(0, 0, canvas.width, canvas.height, "#0047AB");
    for(let i = 20; i < canvas.height; i += 30)
        drawRect(canvas.width / 2 - 3, i, 6, 10, "#A0A0A0");
    //Lekkie wytlumaczenie, aby cos wysrodkowac trzeba podzielic przez 2. canvas.width / 2 od tego miejsca sa rysowane prostokaty, warto, aby byly one o parzystej wielosci i nastepnie odjac polowe. wtedy idealnie na srodku bedzie wysrodokowany pasek
}

function drawBall()
{
    canvasContext.fillStyle = "white"
    canvasContext.beginPath();
    canvasContext.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
    canvasContext.fill();

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if(ball.x > canvas.width)
    {
        if(ball.y > computer.paddle && ball.y < computer.paddle + PADDLE_HEIGHT)
        {
            ball.speedX = -ball.speedX;
            ball.speedY = (ball.y - (computer.paddle + PADDLE_HEIGHT / 2)) * 0.3;
        }
        else
        {
            player.score++;
            ballReset();
        }
    }
    if(ball.x < 0)
    {
        if(ball.y > player.paddle && ball.y < player.paddle + PADDLE_HEIGHT)
        {
            ball.speedX = -ball.speedX;
            ball.speedY = (ball.y - (player.paddle + PADDLE_HEIGHT / 2)) * 0.3;
        }
        else
        {
            computer.score++;
            ballReset();
        }
    }

    if(ball.y > canvas.height)
        ball.speedY = -ball.speedY;
    if(ball.y < 0)
        ball.speedY = -ball.speedY;
}

function drawPlayer()
{
    drawRect(0, player.paddle, PADDLE_THICK, PADDLE_HEIGHT, "#D70040");
}

function drawComputer()
{
    drawRect(canvas.width - PADDLE_THICK, computer.paddle, PADDLE_THICK, PADDLE_HEIGHT, "#D70040");
}

function drawText(text, leftX, topY, color)
{
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, leftX, topY);
}

function movementComputer()
{
    let center = computer.paddle + (PADDLE_HEIGHT / 3);
    if(center < ball.y - (PADDLE_HEIGHT / 2))
    {
        computer.paddle += 6;
    }
    else if(center > ball.y + (PADDLE_HEIGHT / 3))
    {
        computer.paddle -= 6;
    }
}

function ballReset()
{
    if(player.score >= WINNING_SCORE || computer.score >= WINNING_SCORE)
    {
        winScreen = true;
    }
    ball.speedY = 5;
    ball.speedX = -ball.speedX;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
}

function game()
{
    //test
    drawTable();

    if(winScreen)
    {
        drawText("click to continue", canvas.width / 2, canvas.height / 2, "white");
        return;
    }

    drawBall();
    drawPlayer();
    drawComputer();

    movementComputer();

    drawText(player.score, canvas.width * 0.3, canvas.height * 0.3, "white")
    drawText(computer.score, canvas.width * 0.6, canvas.height * 0.3, "white")
}
