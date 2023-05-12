import { m4 } from "../../math/m4";
import { Mat4, Vec3, Vec4 } from "../../math/types/math.types";


export class Brick {
    position: Vec3 = [0, 0, 1];
    size: Vec3 = [1, 1, 1];
    velocity: number = 10;
    color: Vec4 = [0.0, 1.0, 0.0, 1.0];
    lifeLevel = 3;

    constructor(position: Vec3) {
        this.position = position;
    } 

    get modelMatrix(): Mat4 {
        const translate = this.position;
        const scale = this.size;
        let modelMatrix = m4.identity();
        modelMatrix = m4.translate(modelMatrix, [translate[0] + scale[0] / 2, translate[1], 0]);
        modelMatrix = m4.scale(modelMatrix, scale.map(n => n / 2) as Vec3);
        return modelMatrix;
    }
}
