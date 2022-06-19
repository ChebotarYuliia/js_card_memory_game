const selectors = {
    boardContainer: document.querySelector('.memory-game__container'),
    board: document.querySelector('.memory-game__board'),
    card: document.querySelector('.memory-game__card'),
    moves: document.querySelector('.memory-game__moves'),
    timer: document.querySelector('.memory-game__timer'),
    start: document.querySelector('.memory-game__start'),
    win: document.querySelector('.memory-game__win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

function createItemsArray(itemsNumber) {
    let result = [];
    for (let i = 1; i < itemsNumber + 1; i++) {
        result.push(i);
    };
    return result;
};

function shaffleItems(array) {
    const clonedArray = [...array];

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomI = Math.floor(Math.random() * (i + 1));
        const current = clonedArray[i];
        clonedArray[i] = clonedArray[randomI];
        clonedArray[randomI] = current;
    }

    return clonedArray;
};

function generateGame() {
    const dimensions = selectors.board.dataset.dimension; // 4

    if (dimensions % 2 !== 0) {
        throw new Error('Board dimension must be an even number!');
    };

    const items = createItemsArray((dimensions * dimensions) / 2);
    const shuffledItems = shaffleItems([...items, ...items]);

    const cards = `
        ${shuffledItems.map(item => `
            <div class="memory-game__card" style="width: ${Math.floor(90 / dimensions)}%; height: ${Math.floor(90 / dimensions)}%" data-item="${item}">
                <div class="memory-game__card-front"><img class="memory-game__img" src="./assets/images/smiley-${item}.png" alt="smiley" srcset=""></div>
                <div class="memory-game__card-back"></div>
            </div>
            `
    ).join('')}
    `;

    selectors.board.innerHTML = cards;

};

function startGame() {
    state.gameStarted = true;
    selectors.start.classList.add('memory-game__start-disabled');

    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.moves.innerHTML = `${state.totalFlips} moves`;
        selectors.timer.innerHTML = `${state.totalTime} sec`;
    }, 1000)
};

function restartGame() {
    state.gameStarted = false;
    state.totalFlips = 0;
    state.totalTime = 0;
    state.loop = null;

    selectors.start.classList.remove('memory-game__start-disabled');
    selectors.boardContainer.classList.remove('memory-game__container-flipped');

    selectors.moves.innerHTML = `${state.totalFlips} moves`;
    selectors.timer.innerHTML = `${state.totalTime} sec`;

    generateGame();

}

function flipCardsBack() {
    selectors.board.querySelectorAll('.memory-game__card:not(.memory-game__card-matched)').forEach(card => {
        card.classList.remove('memory-game__card-flipped');
    });

    state.flippedCards = 0;
};

function flipCard(card) {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    };

    if (state.flippedCards <= 2) {
        card.classList.add('memory-game__card-flipped');
    };

    if (state.flippedCards == 2) {
        let flippedCards = selectors.board.querySelectorAll('.memory-game__card-flipped:not(.memory-game__card-matched)');

        if (flippedCards[0].dataset.item == flippedCards[1].dataset.item) {
            flippedCards[0].classList.add('memory-game__card-matched');
            flippedCards[1].classList.add('memory-game__card-matched');
        }

        setTimeout(() => {
            flipCardsBack();
        }, 1000)
    };

    if (!selectors.board.querySelectorAll('.memory-game__card:not(.memory-game__card-flipped)').length) {
        setTimeout(() => {
            state.gameStarted = false;
            selectors.boardContainer.classList.add('memory-game__container-flipped');
            selectors.win.innerHTML = `
                <div class="memory-game__text">
                    <p>You won!</p>
                    <p>with <span class="memory-game__text-highlighted">${state.totalFlips}</span> moves</p>
                    <p>under <span class="memory-game__text-highlighted">${state.totalTime}</span> seconds</p>
                </div>
                <button class="memory-game__restart">Restart</button>
                `
            clearInterval(state.loop);
        }, 1000);
    }
};

document.addEventListener('click', e => {
    const target = e.target;
    const parent = target.parentElement;

    if (target.className.includes('memory-game__card') && !parent.className.includes('memory-game__card-flipped')) {
        flipCard(parent);
    };

    if (target == selectors.start && !selectors.start.classList.contains('memory-game__start-disabled')) {
        startGame();
    };

    if (target.classList.contains('memory-game__restart')) {
        restartGame();
    };
});

generateGame();