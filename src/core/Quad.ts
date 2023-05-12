
export class Quad {
    private buffer: WebGLBuffer;
    public vertexCount = 6;
    public vertices = [
        -1, -1, 0, 1,
         1,  1, 1, 0,
        -1,  1, 0, 0,

        -1, -1, 0, 1,
         1, -1, 1, 1,
         1,  1, 1, 0,
    ];

    constructor(gl: WebGL2RenderingContext) {
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Could not create buffer for quad');
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
        gl.enableVertexAttribArray(0);
        this.buffer = buffer;
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
}
