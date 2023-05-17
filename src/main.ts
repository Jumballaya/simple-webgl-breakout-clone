import { Game } from './game/Game';
import './style.css'

const game = new Game();
game.run();

const messageState = {
    start: `<div>
        Press Enter to Start<br/>
        <span style="color: #e11e1f;">'A'</span>
        and <span style="color: #e11e1f;">'D'</span>
        to Move<br />Escape to Pause
    </div>`,
    running: '<div>Press Enter to Resume</div>',
    nextBall: '<div>You got it this Time!<br />Press <span style="color: #e11e1f;">Enter</span> to try again</div>',
    won: '<div>You Won!</div>',
    lost: '<div>You Lost!</div>',
};

let running = true;
const showOverlay = (state: keyof typeof messageState) => {
    $overlay.hidden = false;
    $overlay.innerHTML = messageState[state] || '';
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

game.addEventListener('lost-ball', () => {
    game.pause();
    showOverlay('nextBall');
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
