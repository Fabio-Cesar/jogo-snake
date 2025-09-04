// --- Jogo da Cobrinha ---
const gridCount = 9; // Tamanho do nosso tabuleiro do jogo é 9x9
const cellSize = 50; // Tamanho de cada célula do tabuleiro

let snake; // Jogador
let snack; // Lanche
let gameOver = false; // Game Over
let direction = { dx: 1, dy: 0 }; // Direção inicial para a direita
let nextDirection = { dx: 1, dy: 0 }; // Direção a ser aplicada no próximo movimento
let moveInterval = 20; // A cada X frames a cobra anda
let frameCounter = 0; // Contador de frames

function setup() {
    createCanvas(gridCount * cellSize, gridCount * cellSize);
    resetGame();
}

function resetGame() {
    // Cobra começa no centro, tamanho 3
    let startX = Math.floor(gridCount / 2);
    let startY = Math.floor(gridCount / 2);
    snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
    ];

    // Reinicia as outras variáveis para o início do jogo e coloca o primeiro lanche
    placeSnack();
    gameOver = false;
    direction = { dx: 1, dy: 0 };
    nextDirection = { dx: 1, dy: 0 };
    // Desafio A : Aumentando a velocidade!
    // Ajuste essa linha para que a cobra não inicie o jogo em uma velocidade aumentada
    frameCounter = 0;
}

function draw() {
    background(0, 100, 0);
    drawGrid();
    drawSnack();
    drawSnake();

    if (gameOver) {
        fill(255, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text('Game Over! Press R to restart', width / 2, height / 2);
        return;
    }


    frameCounter++;
    if (frameCounter >= moveInterval) {
        frameCounter = 0;
        moveSnakeAuto();
    }
}

// Move a cobra automaticamente na direção atual
function moveSnakeAuto() {
    
    // Desafio A: Aumentando a velocidade!
    // Será necessário fazer algo aqui...
    const snakeLength = snake.length;
    const newMoveInterval = moveInterval - (snakeLength + 3 / 2);
    if (newMoveInterval < 10) {
        moveInterval = 10;
    } else {
        moveInterval = newMoveInterval;
    }

    direction = { ...nextDirection };
    let snakeHead = { ...snake[0] };
    snakeHead.x += direction.dx;
    snakeHead.y += direction.dy;

    // Verifica colisão com a parede
    if (
        snakeHead.x < 0 || snakeHead.x >= gridCount || snakeHead.y < 0 || snakeHead.y >= gridCount
    ) {
        gameOver = true;
        return;
    }

    // Verifica se pegou o lanche
    const didSnakeEat = (snakeHead.x === snack.x && snakeHead.y === snack.y);

    // Desafio B: Juro que não comi minha cauda!
    // Permita que a cobra siga a sua cauda somente se ela não comeu um lanche
    const snakeBodyLength = didSnakeEat ? snake.length : snake.length - 1;
    for (let i = 0; i < snakeBodyLength; i++) {
        if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y) {
            gameOver = true;
            return;
        }
    }

    if (didSnakeEat) {
        snake.unshift(snakeHead);
        placeSnack();
    } else {
        snake.unshift(snakeHead);
        snake.pop();
    }
}

function drawGrid() {
    stroke(60);
    for (let i = 0; i <= gridCount; i++) {
        line(i * cellSize, 0, i * cellSize, height);
        line(0, i * cellSize, width, i * cellSize);
    }
}

function drawSnake() {
    noStroke();
    for (let i = 0; i < snake.length; i++) {
        if (i % 3 === 0) {
            fill(0, 0, 0)
        } else if (i % 3 === 1) {
            fill(255, 0, 0)
        } else if (i % 3 === 2) {
            fill(255)
        }

        rect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);

        if (i === 0) {
            // Olho
            fill(255);
            // Olho sempre no "topo" da cabeça
            // Desafio C: O olho não vai na nuca!
            // Ajuste o olho para acompanhar a direção da cobra
            ellipse(
                snake[i].x * cellSize + cellSize / 2,
                snake[i].y * cellSize + cellSize / 2 - cellSize * 0.18,
                cellSize * 0.15,
                cellSize * 0.15
            );
        }
    }
}

function drawSnack() {
    fill(255, 0, 100);
    noStroke();
    ellipse(
        snack.x * cellSize + cellSize / 2,
        snack.y * cellSize + cellSize / 2,
        cellSize * 0.7,
        cellSize * 0.7
    );
}

function placeSnack() {
    let empty = [];
    for (let x = 0; x < gridCount; x++) {
        for (let y = 0; y < gridCount; y++) {
            let onSnake = snake.some(seg => seg.x === x && seg.y === y);
            if (!onSnake) empty.push({ x, y });
        }
    }
    if (empty.length === 0) {
        gameOver = true;
        // Desafio D: Ei, eu ganhei o jogo!
        // Transforme esse caso em um caso de jogo vencido ao invés de jogo perdido
        return;
    }
    snack = random(empty);
}

function keyPressed() {
    if (gameOver) {
        if (key === 'r' || key === 'R') {
            resetGame();
        }
        return;
    }

    let dx = direction.dx, dy = direction.dy;
    if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
        dx = 0; dy = -1;
    } else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
        dx = 0; dy = 1;
    } else if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
        dx = -1; dy = 0;
    } else if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
        dx = 1; dy = 0;
    } else {
        return;
    }
    // Impede reversão direta
    if (dx !== -direction.dx || dy !== -direction.dy) {
        nextDirection = { dx, dy };
    }
}
