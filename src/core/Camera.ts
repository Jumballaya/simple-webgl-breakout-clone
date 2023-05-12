import { m4 } from "../math/m4";
import { Mat4, Vec3 } from "../math/types/math.types";

export class Camera {
    position: Vec3 = [0, 0, 0];
    size: Vec3 = [1,1,1];

    get viewMatrix(): Mat4 {
        const translate = this.position;
        const scale = this.size;
        let viewMatrix = m4.translate(m4.identity(), translate);
        return m4.scale(viewMatrix, scale);
    }

}

