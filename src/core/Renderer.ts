import { m4 } from "../math/m4";
import { DrawCall } from "./types/renderer.types";


export class Renderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    public screenSize: { width: number; height: number; };

    private drawCalls: Array<DrawCall> = [];

    constructor(width: number, height: number) {
        this.screenSize = { width, height }; 
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        if (!gl) throw new Error('Could not create WebGL2 context');
        canvas.width = this.screenSize.width;
        canvas.height = this.screenSize.height;
        this.canvas = canvas;
        this.gl = gl;
    }

    get context() {
        return this.gl;
    }

    get projectionMatrix() {
        return m4.projection(this.screenSize.width, this.screenSize.height, 1);
    }

    public attachTo(el: HTMLElement) {
        el.appendChild(this.canvas);
    }

    public queueRender(call: DrawCall) {
        this.drawCalls.push(call);
    }

    public render() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(1,1,1,1);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);

        for (let dc of this.drawCalls) {
            dc.call();
            this.gl.drawArrays(dc.type, 0, dc.count);
        }
        this.drawCalls = [];
    }
}
