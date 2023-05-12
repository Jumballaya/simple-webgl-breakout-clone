#version 300 es

precision mediump float;

out vec4 outColor;

in vec4 v_position;

float sdf_circle(vec2 p, float r) {
    return length(p) - r;
}

void main() {
    vec3 color = vec3(1.0, 1.0, 1.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);

    float circle = 1.0 + sdf_circle(v_position.xy, 1.0);
    color = mix(blue, color, step(1.0, circle));
    outColor = vec4(color, 1.0 - step(1.0, circle));
}
