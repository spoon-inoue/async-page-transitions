export const code = `
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
out vec4 O;

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(0.1, 0.2, 0.3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

mat2 rot(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }

void main(){
  vec2 uv = gl_FragCoord.xy / resolution;
  float detail = 50.;
  vec2 asp = vec2(resolution.x / resolution.y, 1);
  vec2 suv = (uv - 0.5) * asp * rot(acos(-1.) * 0.25) + 0.5;
  vec2 iuv = floor(suv * detail);

  float a = float(mod(iuv.x, 2.) == 0.) + float(mod(iuv.y, 2.) == 0.);
  float b = float(mod(iuv.x, 2.) == 1.) + float(mod(iuv.y, 2.) == 1.);
  b *= float(hash(vec3(iuv, 0.1)).x < 0.5);
  O += a * (1. - b);
}
`
