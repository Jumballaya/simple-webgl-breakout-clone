import { Game } from './game/Game';
import './style.css'

const game = new Game();
game.run();

const messageState = {
    start: `Press Enter to Start\n'A' and 'D' to Move\nEscape to Pause`,
    running: 'Press Enter to Resume',
    won: 'You Won!',
    lost: 'You Lost!',
};

let running = true;
const showOverlay = (state: keyof typeof messageState) => {
    $overlay.hidden = false;
    $overlay.innerText = messageState[state] || '';
}

game.addEventListener('lose', () => {
    showOverlay('lost');
    running = false;
})

game.addEventListener('win', () => {
    showOverlay('won');
    running = false;
})

game.addEventListener('pause', () => {
    showOverlay('running');
})

game.addEventListener('start', () => {
    $overlay.hidden = true;
});

const $overlay = document.createElement('div');
$overlay.classList.add('overlay');
showOverlay('start');
document.body.appendChild($overlay);

document.body.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !$overlay.hidden && running) {
        game.start();
    }
    if (e.key === 'Escape' && $overlay.hidden) {
        game.pause();
    }
});
