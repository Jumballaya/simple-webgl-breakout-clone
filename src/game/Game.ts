import playerFragmentText from '../shaders/paddle/fragment.glsl?raw';
import playerVertexText from '../shaders/paddle/vertex.glsl?raw';

import ballFragmentText from '../shaders/ball/fragment.glsl?raw';
import ballVertexText from '../shaders/ball/vertex.glsl?raw';

import brickFragmentText from '../shaders/brick/fragment.glsl?raw';
import brickVertexText from '../shaders/brick/vertex.glsl?raw';

import { Renderer } from '../core/Renderer';
import { Program } from '../gl/Program';
import { Paddle } from './entities/Paddle';
import { Quad } from '../core/Quad';
import { Inputs } from './Inputs';
import { Ball } from './entities/Ball';
import { m4 } from './../math/m4';
import { Camera } from '../core/Camera';
import { AABB } from './types/aabb.type';
import { BrickMaker } from './BrickMaker';


export class Game {
    width = 1024;
    height = 768;
    inputs = new Inputs();
    renderer: Renderer;
    camera: Camera;
    container: HTMLElement;
    running = true;

    brickMaker: BrickMaker;
    player: Paddle;
    ball: Ball;

    ballCount = 3;

    deadZone: AABB;

    time = 0;
    lastTime = Date.now();


    constructor() {
        this.renderer = new Renderer(this.width, this.height);
        this.camera = new Camera();
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.renderer.attachTo(this.container);

        this.player = this.createPlayer();
        this.ball = this.createBall();

        const brickCols = 8;
        const brickRows = 4;
        const brickWidth = this.width / brickCols;
        const brickHeight = 32;

        this.deadZone = {
            w: this.width,
            h: this.height - this.player.position[1] + 10,
            x: 0,
            y: this.player.position[1] + 10,
        };

        this.brickMaker = this.createBrickMaker();
        for (let row = 0; row < brickRows; row++) {
            const y = row * brickHeight;
            for (let col = 0; col < brickCols; col++) {
                const x = col * brickWidth;
                this.brickMaker.createBrick(x, y, brickWidth, brickHeight);
            }
        }
    }

    run() {
        if (this.running) {
            this.step();
            requestAnimationFrame(this.run.bind(this));
        }
    }

    step() {
        const curTime = Date.now();
        const dt = (curTime - this.lastTime);
        this.time += dt / 1000;
        this.lastTime = curTime;
        

        const player = this.player;
        const ball = this.ball;
        player.update(this.inputs, this.width);
        ball.update(this.width, this.height);
        this.handlePlayerBallCollision();
        this.handleBallBrickCollision();
        this.handleBallDeadZoneCollision();

        this.renderStep();

        if (this.brickMaker.brickCount() === 0) {
            console.log('YOU WON!!!');
            this.running = false;
        }

        if (this.ballCount === 0) {
            console.log('You lost!!!');
            this.running = false;
        }
    }

    

    private renderStep() {
        const drawCalls = this.brickMaker.generateDrawCalls(
            this.renderer.context.TRIANGLES,
            this.renderer.projectionMatrix,
            this.time,
        );

        for (const dc of drawCalls) {
            this.renderer.queueRender(dc);
        }

        this.renderer.queueRender({
            type: this.renderer.context.TRIANGLES,
            count: 6,
            call: () => {
                const player = this.player;
                const projectionMatrix = this.renderer.projectionMatrix;
                const modelMatrix = player.modelMatrix;
                const mvp = m4.multiply(projectionMatrix, modelMatrix);
                player.program.updateUniform('u_transform', 'mat4', mvp);
            }
        });

        this.renderer.queueRender({
            type: this.renderer.context.TRIANGLES,
            count: 6,
            call: () => {
                const ball = this.ball;
                const gl = this.renderer.context;
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                const projectionMatrix = this.renderer.projectionMatrix;
                const modelMatrix = ball.modelMatrix;
                const mvp = m4.multiply(projectionMatrix, modelMatrix);
                ball.program.updateUniform('u_transform', 'mat4', mvp);
            }
        });

        this.renderer.render();
    }

    private handlePlayerBallCollision() {
        const player = this.player;
        const ball = this.ball;

        if (this.collided(player.getBoundingBox(), ball.getBoundingBox())) {
            ball.reflect();
        }
    }

    private handleBallBrickCollision() {
        const ball = this.ball;
        if (this.brickMaker.checkCollisions(ball.getBoundingBox())) {
            ball.reflect();
        }
    }

    private handleBallDeadZoneCollision() {
        const ball = this.ball;
        if (this.collided(ball.getBoundingBox(), this.deadZone)) {
            this.ballCount--;
            this.ball.position[0] = this.width / 2;
            this.ball.position[1] = this.height / 2;
        }
    }

    private createPlayer(): Paddle {
        const gl = this.renderer.context;
        const quad = new Quad(gl);
        const program = new Program(playerVertexText, playerFragmentText, gl);
        const player = new Paddle(program, quad);
        player.position[0] = this.width / 2;
        return player;
    }
    
    private createBall(): Ball {
        const gl = this.renderer.context;
        const quad = new Quad(gl);
        const program = new Program(ballVertexText, ballFragmentText, gl);
        program.bind();
        const ball = new Ball(program, quad);
        ball.position[0] = this.width / 2;
        ball.position[1] = this.height / 2;
        return ball;
    }

    private createBrickMaker(): BrickMaker {
        const gl = this.renderer.context;
        const quad = new Quad(gl);
        const program = new Program(brickVertexText, brickFragmentText, gl);
        const brickMaker = new BrickMaker(program, quad);
        return brickMaker;
    }

    private collided(a: AABB, b: AABB): boolean {
        return a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.h + a.y > b.y;
    }
}

