
// Настройка «холста»
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
// Получаем ширину и высоту элемента canvas
let width = canvas.width;
let height = canvas.height;
// Вычисляем ширину и высоту в ячейках
let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;
// Устанавливаем счет 0
let score = 0;
// Рисуем рамку
let drawBorder = () => {
    ctx.fillStyle = "DarkSlateGrey";

    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};
// Выводим счет игры в левом верхнем углу
let drawScore = () => {
    ctx.font = "20px bold";
    ctx.fillStyle = "DarkRed";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("SCORE: " + score, blockSize, blockSize);
};
// Отменяем действие setInterval и печатаем сообщение «Конец игры»
let gameOver = () => {
    clearInterval(intervalId);
    ctx.font = "30px bold";
    ctx.fillStyle = "DarkRed";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", width / 2, height / 2);
};
// Рисуем окружность 
let circle = (x, y, radius, fillCircle) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};
// Задаем конструктор Block (ячейка)
let Block = function (col, row) {
    this.col = col;
    this.row = row;
};
// Рисуем квадрат в позиции ячейки
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};
// Рисуем круг в позиции ячейки
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;

    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};
// Проверяем, находится ли эта ячейка в той же позиции, что и ячейка
// otherBlock
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};
// Задаем конструктор Snake (змейка)
let Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = "right";
    this.nextDirection = "right";
};
// Рисуем квадратик для каждого сегмента тела змейки
Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[0].drawSquare("white");



        this.segments[i].drawSquare("DarkRed");
    }
};
// Создаем новую голову и добавляем ее к началу змейки,
// чтобы передвинуть змейку в текущем направлении
Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;
    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};
// Проверяем, не столкнулась ли змейка со стеной или собственным
// телом
Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);
    let wallCollision = leftCollision || topCollision ||
        rightCollision || bottomCollision;
    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};
// Задаем следующее направление движения змейки на основе нажатой
// клавиши
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};
// Задаем конструктор Apple (яблоко)
let Apple = function () {
    this.position = new Block(10, 10);
};

// Рисуем кружок в позиции яблока
Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};
// Перемещаем яблоко в случайную позицию
Apple.prototype.move = function () {

    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);


};
// Создаем объект-змейку и объект-яблоко
let snake = new Snake();
let apple = new Apple();
// Запускаем функцию анимации через setInterval
let intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);
// Преобразуем коды клавиш в направления
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",


};
// Задаем обработчик события keydown (клавиши-стрелки)
$("body").keydown((event) => {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});

function moveUp() {
    let newDirection = directions[38];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }

}
function moveDown() {
    let newDirection = directions[40];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }

}
function moveRight() {
    let newDirection = directions[39];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }

}
function moveLeft() {
    let newDirection = directions[37];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }

}


