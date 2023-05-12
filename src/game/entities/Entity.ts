import { Quad } from "../../core/Quad";
import { Program } from "../../gl/Program";
import { m4 } from "../../math/m4";
import { Mat4, Vec3 } from "../../math/types/math.types";
import { AABB } from "../types/aabb.type";

export class Entity {
    position: Vec3 = [64, 768 - 64, 1];
    size: Vec3 = [93, 16, 1];

    constructor(public program: Program, public quad: Quad) {
        program.createUniform('u_transform', this.modelMatrix);
    }
    
    get modelMatrix(): Mat4 {
        const translate = this.position;
        const scale = this.size;
        let modelMatrix = m4.identity();
        modelMatrix = m4.translate(modelMatrix, [translate[0] + scale[0] / 2, translate[1], 0]);
        modelMatrix = m4.scale(modelMatrix, scale.map(n => n / 2) as Vec3);
        return modelMatrix;
    }

    public getBoundingBox(): AABB {
        return {
            x: this.position[0],
            y: this.position[1],
            w: this.size[0],
            h: this.size[1],
        }
    }

    public bind() {
        this.program.bind();
    } 
}

