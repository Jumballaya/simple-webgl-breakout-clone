import { Vec3 } from "../../math/types/math.types";
import { Inputs } from "../Inputs";
import { Entity } from "./Entity";

export class Paddle extends Entity {
    position: Vec3 = [0, 0, 1];
    size: Vec3 = [120, 16, 1];
    velocity: [number, number] = [10, 10];

    public update(inputs: Inputs, width: number) {
        if (inputs.isPressed(['a'])) this.position[0] -= this.velocity[0];
        if (inputs.isPressed(['d'])) this.position[0] += this.velocity[0];
        if (this.position[0] < 0) this.position[0] = 0;
        if (this.position[0] > width - (this.size[0])) this.position[0] = width - (this.size[0]);
    }
}
