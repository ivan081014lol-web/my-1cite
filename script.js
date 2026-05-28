// Получаем все элементы
const cells = document.querySelectorAll('.cell');
const but1 = document.querySelector('.but1');
const but2 = document.querySelector('.but2');
const hew = document.querySelector('.hew');

// Переменные игры
let board = ['', '', '', '', '', '', '', '', '']; // Состояние доски
let currentPlayer = 'X'; // X всегда начинает
let gameActive = true;
let playerChoice = null; // 'X' или 'O'

// Победные комбинации
const winPatterns = [
    [0, 1, 2], // Верхний ряд
    [3, 4, 5], // Средний ряд
    [6, 7, 8], // Нижний ряд
    [0, 3, 6], // Левый столбец
    [1, 4, 7], // Центральный столбец
    [2, 5, 8], // Правый столбец
    [0, 4, 8], // Диагональ \
    [2, 4, 6]  // Диагональ /
];

// Кнопка "Крестики" - игрок играет за X
but1.addEventListener('click', () => {
    playerChoice = 'X';
    currentPlayer = 'X';
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];
    updateBoard();
    hew.textContent = 'Крестики-Нолики! Ход X';
    hew.style.color = 'blue';
    enableCells(true);
    
    // Блокируем выбор после выбора
    but1.disabled = true;
    but2.disabled = true;
});

// Кнопка "Нолики" - игрок играет за O
but2.addEventListener('click', () => {
    playerChoice = 'O';
    currentPlayer = 'O';
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];
    updateBoard();
    hew.textContent = 'Крестики-Нолики! Ход O';
    hew.style.color = 'red';
    enableCells(true);
    
    // Блокируем выбор после выбора
    but1.disabled = true;
    but2.disabled = true;
});

// Клик по ячейке
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        
        // Проверяем, можно ли сделать ход
        if (!gameActive || board[index] !== '' || playerChoice === null) {
            return;
        }
        
        // Если игрок выбрал O, но первый ход за X - ждем
        if (playerChoice === 'O' && currentPlayer === 'X') {
            // Компьютер ходит первым
            computerMove();
            return;
        }
        
        // Ход игрока
        makeMove(index, playerChoice);
    });
});

// Функция хода
function makeMove(index, player) {
    if (board[index] !== '' || !gameActive) return;
    
    // Ставим знак
    board[index] = player;
    cells[index].textContent = player;
    cells[index].style.color = player === 'X' ? 'blue' : 'red';
    cells[index].style.fontSize = '60px';
    cells[index].style.fontWeight = 'bold';
    
    // Проверяем победу
    if (checkWin(player)) {
        hew.textContent = `${player === 'X' ? 'Крестики' : 'Нолики'} ПОБЕДИЛИ! 🎉`;
        gameActive = false;
        enableCells(false);
        setTimeout(resetGame, 2000);
        return;
    }
    
    // Проверяем ничью
    if (checkDraw()) {
        hew.textContent = 'НИЧЬЯ! 🤝';
        gameActive = false;
        setTimeout(resetGame, 2000);
        return;
    }
    
    // Меняем игрока
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    hew.textContent = `Ход ${currentPlayer === 'X' ? 'КРЕСТИКОВ' : 'НОЛИКОВ'}`;
    hew.style.color = currentPlayer === 'X' ? 'blue' : 'red';
    
    // Если сейчас ход компьютера
    if (gameActive && currentPlayer !== playerChoice) {
        setTimeout(computerMove, 500);
    }
}

// Ход компьютера
function computerMove() {
    if (!gameActive) return;
    
    // Находим пустую ячейку
    let availableCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableCells.push(i);
        }
    }
    
    if (availableCells.length === 0) return;
    
    // Простая стратегия:
    // 1. Попробуем выиграть
    for (let i of availableCells) {
        board[i] = currentPlayer;
        if (checkWin(currentPlayer)) {
            board[i] = '';
            makeMove(i, currentPlayer);
            return;
        }
        board[i] = '';
    }
    
    // 2. Заблокируем игрока
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (let i of availableCells) {
        board[i] = opponent;
        if (checkWin(opponent)) {
            board[i] = '';
            makeMove(i, currentPlayer);
            return;
        }
        board[i] = '';
    }
    
    // 3. Или случайный ход
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex, currentPlayer);
}

// Проверка победы
function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

// Проверка ничьи
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Обновление доски
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        if (board[index] === 'X') {
            cell.style.color = 'blue';
        } else if (board[index] === 'O') {
            cell.style.color = 'red';
        }
        cell.style.fontSize = '60px';
        cell.style.fontWeight = 'bold';
    });
}

// Включить/выключить ячейки
function enableCells(enable) {
    if (enable) {
        cells.forEach(cell => {
            cell.style.pointerEvents = 'auto';
            cell.style.opacity = '1';
        });
    } else {
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
            cell.style.opacity = '0.7';
        });
    }
}

// Сброс игры
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    playerChoice = null;
    updateBoard();
    hew.textContent = 'Крестики-Нолики!';
    hew.style.color = 'blue';
    enableCells(false);
    but1.disabled = false;
    but2.disabled = false;
    
    // Очищаем ячейки
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

// Добавляем data-index ячейкам (нужно добавить в HTML)
cells.forEach((cell, index) => {
    cell.setAttribute('data-index', index);
});

// Начальное состояние - ячейки отключены до выбора
enableCells(false);