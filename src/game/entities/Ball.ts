import { Quad } from "../../core/Quad";
import { Program } from "../../gl/Program";
import { Entity } from "./Entity";

export class Ball extends Entity {

    velocity = [3, 6];

    constructor(program: Program, quad: Quad) {
        super(program, quad);
        this.size = [12, 12, 1];
        this.position = [0, 0, 1]
    }

    update(width: number, height: number) {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        if (this.position[1] <= 0) {
            this.position[1] = 1;
            this.velocity[1] *= -1;
        }
        if (this.position[0] <= 0) {
            this.position[0] = 1;
            this.velocity[0] *= -1;
        }

        if (this.position[1] >= height - this.size[1] * 2) {
            this.position[1] = height - this.size[1] * 2;
            this.velocity[1] *= -1;
        }
        if (this.position[0] >= width - this.size[0]) {
            this.position[0] = width - this.size[0] * 2;
            this.velocity[0] *= -1;
        }
    }

    reflect() {
        this.velocity[1] *= -1;
    }
}
