import { Vec3 } from "./types/math.types";

function sub(a: Vec3, b: Vec3): Vec3 {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
    ]
}

function add(a: Vec3, b: Vec3): Vec3 {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
    ]
}

function mulScalar(a: Vec3, s: number): Vec3 {
    return [
        a[0] * s,
        a[1] * s,
        a[2] * s,
    ]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}

function normalize(v: Vec3): Vec3 {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}


export const v3 = {
    add,

    sub,

    mulScalar,

    cross,
    normalize,
};
