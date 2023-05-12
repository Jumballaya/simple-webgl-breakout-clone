#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_uvs;

uniform mat4 u_transform;

out vec4 v_position;
out vec2 v_uvs;


void main() {
    gl_Position = u_transform * a_position;

    v_position = a_position;
    v_uvs = a_uvs;
}
