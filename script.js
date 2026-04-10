const score = document.querySelector('.score');
const startScreen = document.querySelector('.start-screen');
const gameArea = document.querySelector('.game-area');

let player = { speed: 6, score: 0, start: false, x: 0, y: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
const carColors = ['blue-car', 'yellow-car', 'purple-car'];

/* --- CONTROLS LOGIC --- */

// Keyboard (Computer)
document.addEventListener('keydown', (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Touch Buttons (Mobile/Mouse)
const setupBtn = (id, keyName) => {
    const btn = document.getElementById(id);
    const press = (e) => { e.preventDefault(); keys[keyName] = true; };
    const release = () => { keys[keyName] = false; };
    
    btn.addEventListener('touchstart', press);
    btn.addEventListener('touchend', release);
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
};

setupBtn('up', 'ArrowUp'); setupBtn('down', 'ArrowDown');
setupBtn('left', 'ArrowLeft'); setupBtn('right', 'ArrowRight');

/* --- GAME FUNCTIONS --- */

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || 
             (aRect.right < bRect.left) || (aRect.left > bRect.right));
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(item => {
        if (item.y >= 900) item.y -= 950;
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = `<h2>CRASHED!</h2><p>Score: ${player.score}</p><p style="margin-top:10px">Tap to Restart</p>`;
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    let road = gameArea.getBoundingClientRect();
    enemies.forEach(item => {
        if (isCollide(car, item)) endGame();
        if (item.y >= 900) {
            item.y = -400;
            item.style.left = Math.floor(Math.random() * (road.width - 55)) + "px";
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function gamePlay() {
    if (player.start) {
        let car = document.querySelector('.car');
        let road = gameArea.getBoundingClientRect();

        moveLines();
        moveEnemy(car);

        if (keys.ArrowUp && player.y > (road.top + 50)) player.y -= player.speed;
        if (keys.ArrowDown && player.y < (road.bottom - 180)) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < (road.width - 55)) player.x += player.speed;

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        player.score++;
        score.innerText = "Score: " + player.score;
        window.requestAnimationFrame(gamePlay);
    }
}

function start() {
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    player.speed = 6;

    // 6-Lane Markers Logic
    let roadWidth = gameArea.offsetWidth;
    let laneMarkers = [0.16, 0.33, 0.5, 0.66, 0.83];

    laneMarkers.forEach(pos => {
        for (let x = 0; x < 5; x++) {
            let roadLine = document.createElement('div');
            roadLine.setAttribute('class', 'lines');
            roadLine.y = (x * 180);
            roadLine.style.top = roadLine.y + "px";
            roadLine.style.left = (pos * roadWidth) + "px";
            gameArea.appendChild(roadLine);
        }
    });

    // Player Car Initialization
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    player.x = (roadWidth / 2) - 25; // Perfect Center
    player.y = gameArea.offsetHeight - 180;
    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    // Enemies
    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemy ' + carColors[x % 3]);
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * (roadWidth - 55)) + "px";
        gameArea.appendChild(enemyCar);
    }

    window.requestAnimationFrame(gamePlay);
}

startScreen.addEventListener('click', start);