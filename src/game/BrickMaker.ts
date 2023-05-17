import { Quad } from "../core/Quad";
import { DrawCall, DrawType } from "../core/types/renderer.types";
import { Program } from "../gl/Program";
import { m4 } from "../math/m4";
import { Mat4, Vec4 } from "../math/types/math.types";
import { Brick } from "./entities/Brick";
import { AABB } from "./types/aabb.type";


const levels: Array<Vec4> = [
    [0.92, 0.2, 0.46, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.05, 0.7, 0.32, 1.0],
    [0.24, 0.9, 0.3, 1.0],
    [0.86, 0.0, 0.14, 1.0],
    [0.6, 0.2, 0.9, 1.0],
    [0.86, 0.72, 0.3, 1.0],
    [0.0, 0.0, 0.0, 1.0],
];

export class BrickMaker {

    private bricks: Array<Brick> = [];

    constructor(public program: Program, public quad: Quad) {
        program.createUniform('u_color', 'vec4', [0.07, 0.55, 0.22, 1.0]);
        // program.createUniform('u_time', 'float', 0);
    }

    public createBrick(x: number, y: number, w: number, h: number): void {
        const brick = new Brick([x + 1, y + h / 2, 1]);
        brick.size = [w - 2, h - 2, 1];
        brick.lifeLevel = 1;
        this.bricks.push(brick);
    }

    public brickCount(): number {
        return this.bricks.length;
    }

    public hitsLeft(): number {
        let sum = 0;
        for (let i = 0; i < this.bricks.length; i++) {
            sum += this.bricks[i].lifeLevel;
        }
        return sum;
    }

    public generateDrawCalls(
        type: DrawType,
        projectionMatrx: Mat4,
    ): Array<DrawCall> {
        const calls: Array<DrawCall> = [];
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];
            calls.push({
                type,
                count: this.quad.vertexCount,
                call: () => {
                    // this.program.updateUniform('u_time', 'float', time);
                    this.program.updateUniform('u_transform', 'mat4', m4.multiply(projectionMatrx, brick.modelMatrix))
                    this.program.updateUniform('u_color', 'vec4', levels[brick.lifeLevel]);
                }
            });
        }
        return calls;
    }

    public checkCollisions(aabb: AABB): boolean {
        let collided = false;
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];
            const brickBox = { x: brick.position[0], y: brick.position[1], w: brick.size[0], h: brick.size[1] };
            if (this.collided(aabb, brickBox)) {
                collided = true;
                brick.lifeLevel--;
                if (brick.lifeLevel === -1) {
                    this.bricks = this.bricks.slice(0, i).concat(this.bricks.slice(i+1));
                }
            }
        }
        return collided;
    }

    private collided(a: AABB, b: AABB): boolean {
        return a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.h + a.y > b.y;
    }
}
