let lines = 9;
let columns = 9;
let numberOfBombs = 10;
let revealedCells = 0;
let gameActive = true;

function gameLevel(difficultyLevel) {
    let id = difficultyLevel;
    if (id === "easy") {
        lines = 9;
        columns = 9;
        numberOfBombs = 10;
    } else if (id === "hard") {
        lines = 18;
        columns = 18;
        numberOfBombs = 20;
    }
    document.getElementById("easy").disabled = true;
    document.getElementById("hard").disabled = true;
    createPlayGround(lines, columns);
}

function createPlayGround(lines, columns) {
    let gameField = document.getElementById("gameField");
    for (let i = 0; i < lines; ++i) {
        let line = gameField.insertRow(i);
        for (let j = 0; j < columns; ++j) {
            let cell = line.insertCell(j);
            let currentCell = gameField.rows[i].cells[j];
            currentCell.classList.add("uncovered");
            currentCell.addEventListener('contextmenu', function(e){
                e.preventDefault();
                if (gameActive) {
                    plantFlags(gameField, i, j);
                }
            })
            currentCell.addEventListener('click', function(e){
                if (gameActive) {
                    revealCells(gameField, i, j);
                }
            })
        }
    }
    plantBombs(gameField);
    nearbyBombs(gameField);
}

function plantFlags(gameField, i, j) {
    let currentCell = gameField.rows[i].cells[j];
    if (!currentCell.classList.contains('markedMine')) {
        currentCell.classList.add('markedMine');
        currentCell.innerHTML = '🚩';
    } else {
        currentCell.innerHTML = "";
        currentCell.classList.remove('markedMine');
    }
}

function plantBombs(gameField) {
    let mines = numberOfBombs;
    while (mines > 0) {
        let rowIndexOfBomb = Math.floor(Math.random() * lines);
        let columnIndexOfBomb = Math.floor(Math.random() * columns);
        if (!gameField.rows[rowIndexOfBomb].cells[columnIndexOfBomb].classList.contains("mine")) {
            gameField.rows[rowIndexOfBomb].cells[columnIndexOfBomb].classList.add("mine");
            --mines;
        } 
    }
}

function nearbyBombs(gameField) {
    for(let i = 0; i < lines; ++i) {
        for(let j = 0; j < columns; ++j) {
            if(!gameField.rows[i].cells[j].classList.contains("mine")) {
                let bombCount = 0;
                for (let x = i - 1; x <= i + 1; ++x) {
                    for (let y = j - 1; y <= j + 1; ++y) {
                        if ((x >= 0) && (x < lines) && (y >= 0) && (y < columns) && (gameField.rows[x].cells[y].classList.contains("mine"))) {
                            ++bombCount;
                        }
                    }
                }
                if (bombCount > 0) {
                    gameField.rows[i].cells[j].count = bombCount;
                    gameField.rows[i].cells[j].classList.replace("uncovered", "countCell");
                }
            }
        }
    }      
}

function revealCells(gameField, i, j) {
    let cell = gameField.rows[i].cells[j];
    if (cell.classList.contains('mine')) {
        showAllBombs(gameField);
        document.getElementById("winnerMessage").innerHTML = "GAME OVER!";
    } else if (cell.classList.contains('uncovered')){
        showNearbyEmptyCells(gameField, i, j);
        isGameOver();
    } else if (cell.classList.contains('countCell')) {
        cell.innerHTML = cell.count;
        cell.style.backgroundColor = "lightgreen";
        cell.classList.add("alreadyCounted");
        ++revealedCells;
        isGameOver();
    }
}

function showAllBombs(gameField) {
    for (let i = 0; i < lines; ++i) {
        for (let j = 0; j < columns; ++j) {
            if (gameField.rows[i].cells[j].classList.contains('mine')) {
                gameField.rows[i].cells[j].innerHTML ='💣';
                gameField.rows[i].cells[j].style.backgroundColor = "red";
            }
        }
    }
    gameActive = false;
}

function showNearbyEmptyCells(gameField, i, j) {
    for (let x = i - 1; x <= i + 1; ++ x) {
        for (let y = j - 1; y <= j + 1; ++y) {
            if (x >= 0 && x < lines && y >= 0 && y < columns && !gameField.rows[x].cells[y].classList.contains("mine")) {
                if (gameField.rows[x].cells[y].count != 0  && gameField.rows[x].cells[y].count != null) {
                    gameField.rows[x].cells[y].innerHTML = gameField.rows[x].cells[y].count;
                    gameField.rows[x].cells[y].style.backgroundColor = "lightgreen";              
                } else {
                    gameField.rows[x].cells[y].style.backgroundColor ="white";
                }

                if (!gameField.rows[x].cells[y].classList.contains("alreadyCounted")) {
                    ++revealedCells;
                    gameField.rows[x].cells[y].classList.add("alreadyCounted");
                }
            }
        }
    }
}

function isGameOver() {
    if (revealedCells === ((lines * columns) - numberOfBombs)) {
        document.getElementById("winnerMessage").innerHTML = "Congratulations, You WON! ";
        gameActive = false;
    }
}





