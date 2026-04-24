export const code = `
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

#define FC gl_FragCoord
#define R resolution
#define T time
#define minmax(x, min, max) ((x) * (max - min) + min)

out vec4 O;

float ease(float x) {
  return x < 0.5 ? 8. * x * x * x * x : 1. - pow(-2. * x + 2., 4.) / 2.;
}

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(0.1, 0.2, 0.3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

vec3 continuousRandomValue() {
  float t = ease(fract(T));
  float id = floor(T);
  vec3 h = hash(vec3(.1, .2, id));
  vec3 prevH = hash(vec3(.1, .2, id - 1.));
  return mix(prevH, h, t);
}

vec3 rot(vec3 p, vec3 n) {
  return n * dot(p, n) + cross(n, p);
}

float gyroid(vec3 p, vec3 crv) {
  float s = crv.z * 5. + .5;
  p *= s;
  return dot(cos(p), sin(p.yzx)) / s + 0.2;
}

float map(vec3 p, vec3 crv) {
  float d = 1e5;
  p = rot(p, normalize(cos(crv.x * 5. + vec3(1, 2, 3))));
  
  float s = length(p) - 1.;
  d = min(d, max(s, gyroid( p, crv)));
  d = min(d, max(s, gyroid(-p, crv)));
  return d;
}

void main(){
  vec3 ro = vec3(0, 0, 5);
  vec3 rd = normalize((FC.xyz * 2. - R.xyy) * vec3(1, 1, 3));

  vec3 crv = continuousRandomValue();

  float t, a;
  for(float i; i++ < 50.;) {
    vec3 p = ro + rd * t;
    float d = map(p, crv) * 0.5;
    d = max(abs(d), 0.01);
    t += d;
    O += (cos(vec4(1, 2, 3, 0) + length(p) * 8.5) + 1.3) / i / d / t;
  }

  O = tanh(O * O / 5e3) + 0.1 / (O * O  + 0.5);
}
`
