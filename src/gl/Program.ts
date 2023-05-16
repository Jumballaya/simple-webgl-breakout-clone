import { Mat4, Vec4 } from "../math/types/math.types";

type UniformType = 'mat4' | 'vec4' | 'float';
type UniformValue = Mat4 | Vec4 | number;

export class Program {
    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;
    private program: WebGLProgram;

    private uniforms: Map<string, { pointer: WebGLUniformLocation; type: UniformType; data: UniformValue; }> = new Map();

    constructor(
        private vertText: string,
        private fragText: string,
        private gl: WebGL2RenderingContext,
    ) {
        this.vertexShader = this.createShader(gl.VERTEX_SHADER, this.vertText); 
        this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, this.fragText);
        this.program = this.compile();
    }

    public bind() {
        this.gl.useProgram(this.program);
    }

    public createUniform(loc: string, type: UniformType, data: UniformValue): void {
        this.bind();
        const found = this.uniforms.get(loc);
        if (found) {
            found.data = data;
            if (found.type === 'mat4' && data instanceof Array) {
                this.gl.uniformMatrix4fv(found.pointer, false, new Float32Array(data));
            }
            if (found.type === 'vec4' && data instanceof Array) {
                this.gl.uniform4f(found.pointer, data[0], data[1], data[2], data[3]);
            }
            if (type === 'float' && typeof data === 'number') {
                this.gl.uniform1f(found.pointer, data);
            }
            return;
        }
        const pointer = this.gl.getUniformLocation(this.program, loc);
        if (!pointer) throw new Error(`Could not get uniform location for "${loc}"`);
        if (type === 'mat4' && data instanceof Array) {
            this.uniforms.set(loc, { pointer, type, data });
            this.gl.uniformMatrix4fv(pointer, false, new Float32Array(data));
        }
        if (type === 'vec4' && data instanceof Array) {
            this.uniforms.set(loc, { pointer, type, data });
            this.gl.uniform4f(pointer, data[0], data[1], data[2], data[3]);
        }
        if (type === 'float' && typeof data === 'number') {
            this.uniforms.set(loc, { pointer, type, data });
            this.gl.uniform1f(pointer, data);
        }
    }

    public updateUniform(loc: string, type: UniformType, data: UniformValue): void {
        this.bind();
        const found = this.uniforms.get(loc);
        if (!found) return this.createUniform(loc, type, data);
        found.data = data;
        if (type === 'mat4' && data instanceof Array) {
            this.gl.uniformMatrix4fv(found.pointer, false, new Float32Array(data));
        }
        if (type === 'vec4' && data instanceof Array) {
            this.gl.uniform4f(found.pointer, data[0], data[1], data[2], data[3]);
        }
        if (type === 'float' && typeof data === 'number') {
            this.gl.uniform1f(found.pointer, data);
        }
    }

    private compile() {
        const gl = this.gl;
        if (!this.vertexShader) {
            this.vertexShader = this.createShader(gl.VERTEX_SHADER, this.vertText); 
        }
        if (!this.fragmentShader) {
            this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, this.fragText);
        }

        const program = gl.createProgram();
        if (!program) throw new Error('Error creating webgl program');
        gl.attachShader(program, this.vertexShader);
        gl.attachShader(program, this.fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
        }

        return program;
    }

    private createShader(type: number, text: string) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) throw new Error(`Error creating shader from program`);
        gl.shaderSource(shader, text);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    
}
