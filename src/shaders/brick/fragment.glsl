#version 300 es

precision mediump float;

out vec4 outColor;
uniform vec4 u_color;

in vec2 v_uvs;

void main() {
    float d = dot(v_uvs, vec2(0.0, 1.0)) + 0.3;
    outColor = vec4(u_color.rgb * d, 1.0);
}
