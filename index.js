let currPlayer = 'X';
let GameStatus = '';
const boxes = document.querySelectorAll('.box');

const gameMessage = document.querySelector('#gameMessage');
const winSound = new Audio('win-sound1.wav'); 


const winningLine = document.createElement('div');
winningLine.id = 'winning-line';
winningLine.style.position = 'absolute'; 
winningLine.style.height = '4px'; 
winningLine.style.backgroundColor = '#45a049'; 
winningLine.style.display = 'none'; 
document.body.appendChild(winningLine); 

const selectBox = (element) => {
    if (element.target.innerText === '' && currPlayer== 'X') {
        element.target.innerText = currPlayer;
        gameMessage.innerText = '';
        if (!checkWinner()) { 
            switchPlayer();
            if (currPlayer === 'O') { 
                aiMove(); 
            }
        }
    } else {
        alert('Already filled');
    }
}

const switchPlayer = () => {
    currPlayer = currPlayer === 'X' ? 'O' : 'X';
    document.querySelector('#player').innerText = `${currPlayer}'s`;
}


const checkWinner = () => {
    const winningCombinations = [
        ['box1', 'box2', 'box3'],
        ['box4', 'box5', 'box6'],
        ['box7', 'box8', 'box9'],
        ['box1', 'box4', 'box7'],
        ['box2', 'box5', 'box8'],
        ['box3', 'box6', 'box9'],
        ['box1', 'box5', 'box9'],
        ['box3', 'box5', 'box7']
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination.map(id => document.querySelector(`#${id}`).innerText);
        if (a !== '' && a === b && a === c) {
            GameStatus = `${a} is the champion!`;
            winSound.play(); 
            displayMessage(GameStatus); 
            drawWinningLine(combination); 
            setTimeout(() => resetGame(), 2000);
            return true; 
        }
    }


    if (Array.from(boxes).every(box => box.innerText !== '')) {
        displayMessage("It's a tie!");
        winSound.play();
        setTimeout(() => resetGame(), 2000); 
        return true; 
    }

    return false; 
}

const displayMessage = (message) => {
    gameMessage.innerText = message; 
    gameMessage.style.color = '#2777b8'; 
    gameMessage.style.backgroundColor = 'whitesmoke'; 
    gameMessage.style.padding = '20px'; 
    gameMessage.style.borderRadius = '10px'; 
    gameMessage.style.fontSize = '2rem'; 
    gameMessage.style.textAlign = 'center'; 
    gameMessage.style.display = 'block'; 
}


const drawWinningLine = (combination) => {
    const firstBox = document.querySelector(`#${combination[0]}`).getBoundingClientRect();
    const lastBox = document.querySelector(`#${combination[2]}`).getBoundingClientRect();

    const x1 = firstBox.left + firstBox.width / 2;
    const y1 = firstBox.top + firstBox.height / 2;
    const x2 = lastBox.left + lastBox.width / 2;
    const y2 = lastBox.top + lastBox.height / 2;

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `rotate(${angle}rad)`;
    winningLine.style.display = 'block';


    if (combination[0] === combination[1] && combination[1] === combination[2]) {
        winningLine.style.top = `${firstBox.top + firstBox.height / 2 - 2}px`; 
        winningLine.style.left = `${firstBox.left}px`;
    } else if (combination[0] === combination[3] && combination[3] === combination[6]) { 
        winningLine.style.top = `${firstBox.top}px`;
        winningLine.style.left = `${firstBox.left + firstBox.width / 2 - 2}px`; 
    } else if (combination[0] === combination[4] && combination[4] === combination[8]) { 
        winningLine.style.top = `${firstBox.top}px`;
        winningLine.style.left = `${firstBox.left}px`;
        winningLine.style.transform = `rotate(45deg)`; 
    } else if (combination[2] === combination[4] && combination[4] === combination[6]) { 
        winningLine.style.top = `${firstBox.top}px`;
        winningLine.style.left = `${lastBox.left}px`;
        winningLine.style.transform = `rotate(-45deg)`; 
    }

   
    const midPointX = (x1 + x2) / 2;
    const midPointY = (y1 + y2) / 2;

    winningLine.style.top = `${midPointY - 2}px`; 
    winningLine.style.left = `${midPointX - length / 2}px`;
}
const resetGame = () => {
    boxes.forEach(box => {
        box.innerText = '';
    });
    currPlayer = 'X';
    document.querySelector('#player').innerText = `${currPlayer}'s`; 
    gameMessage.innerText = ''; 
    gameMessage.style.display = 'none'; 
    winningLine.style.display = 'none';
}

const aiMove = () => {
    const winningCombinations = getWinningCombinations();

    
    for (const combination of winningCombinations) {
        if (canWin(combination, 'O')) {
            makeMove(combination.find(id => document.querySelector(`#${id}`).innerText === ''), 'O');
            return;
        }
    }

   
    for (const combination of winningCombinations) {
        if (canWin(combination, 'X')) {
            makeMove(combination.find(id => document.querySelector(`#${id}`).innerText === ''), 'O');
            return;
        }
    }

    const centerBox = 'box5';
    if (document.querySelector(`#${centerBox}`).innerText === '') {
        makeMove(centerBox, 'O');
        return;
    }

    
    const cornerBoxes = ['box1', 'box3', 'box7', 'box9'];
    const availableCorners = cornerBoxes.filter(corner => document.querySelector(`#${corner}`).innerText === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeMove(randomCorner, 'O');
        return;
    }

    
    const emptyBoxes = Array.from(boxes).filter(box => box.innerText === '');
    if (emptyBoxes.length > 0) {
        const randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        makeMove(randomBox.id, 'O');
    }
};


const makeMove = (boxId, player) => {
    const box = document.querySelector(`#${boxId}`);
    box.innerText = player;
    if (!checkWinner()) {
        switchPlayer();
    }
};


const canWin = (combination, player) => {
    const marks = combination.map(id => document.querySelector(`#${id}`).innerText);
    return marks.filter(mark => mark === player).length === 2 && marks.filter(mark => mark === '').length === 1;
};


const getWinningCombinations = () => {
    return [
        ['box1', 'box2', 'box3'],
        ['box4', 'box5', 'box6'],
        ['box7', 'box8', 'box9'],
        ['box1', 'box4', 'box7'],
        ['box2', 'box5', 'box8'],
        ['box3', 'box6', 'box9'],
        ['box1', 'box5', 'box9'],
        ['box3', 'box5', 'box7']
    ];
};

boxes.forEach(box => {
    box.addEventListener('click', selectBox);
});

const reset = document.querySelector('#reset');
reset.addEventListener('click', resetGame);  
