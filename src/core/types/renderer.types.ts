
export type DrawType = 
    | typeof WebGL2RenderingContext.TRIANGLES
    | typeof WebGL2RenderingContext.LINES
    | typeof WebGL2RenderingContext.POINTS;

export type DrawCall = {
    type: DrawType;
    count: number;
    call: () => void;
}
