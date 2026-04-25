export type Data = { slug: string; kv: string; title: string; code: string; url: string }

export const datas: Data[] = [
  {
    slug: 'example4',
    kv: 'assets/nest/[slug]/example4/kv.webp',
    title: 'Gyroid Field',
    url: 'https://twigl.app/?ol=true&ss=-OhjZ0ymuaAJUPbnTHjK',
    code: `
// original: https://www.shadertoy.com/view/cttyzf
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

#define T time

out vec4 O;

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(0.1, 0.2, 0.3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

vec3 rot(vec3 p, vec3 n) {
  return n * dot(p, n) + cross(n, p);
}

float map(vec3 p) {
  p = rot(p, normalize(cos(T * 0.2 + vec3(1, 2, 3))));
  p.z -= T * 5.;
  return dot(cos(p), sin(p.yzx * 1.2));
}

void main(){
  vec3 ro = vec3(0, 1.5, 5);
  vec3 rd = normalize((gl_FragCoord.xyz * 2. - resolution.xyy) * vec3(1,1,2));
  
  for(float i = hash(rd).x + 10., t; i++ < 1e2;) {
    vec3 p = ro + rd * t;
    float d = map(p) * 0.4;
    d = max(abs(d), 0.01);
    t += d;
    O += tanh(t * t * .5) * (cos(vec4(1, 2, 3, 0) + p.z * 2.) + 1.2) / i / t / d;
  }
  O = tanh(O * O / 2e3);  
}
    `,
  },
  {
    slug: 'example5',
    kv: 'assets/nest/[slug]/example5/kv.png',
    title: 'Quad Tree Outline',
    url: 'https://twigl.app/?ol=true&ss=-OOSroZ1voT0IoQ9a07P',
    code: `
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
out vec4 outColor;

const float DETAIL = 7.0;

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(.1, .2, .3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

void main(){
  vec2 r=resolution, p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  vec2 uv = gl_FragCoord.xy / r;
  vec2 asp = vec2(r.x / r.y, 1);
  uv = (uv - 0.5) * asp + 0.5;
  
  vec2 quv = uv, fuv, iuv;
  float i;
  
  float t = tanh(fract(time * 0.2) * 2.0);
  float it = floor(time * 0.2);
  
  for (; i < DETAIL; i++) {
    fuv = fract(quv);
    iuv = floor(quv);
    if (hash(vec3(iuv, it)).x < t * 0.3) break;
    quv *= 2.0;
  }
  if (i == DETAIL) i--;
  
  vec2 px = (1.0 / r) * asp;
  vec2 auv = abs(fuv * 2.0 - 1.0);
  vec2 th = 1.0 - px * pow(2.0, i);
  float line = min(step(th.x, auv.x) + step(th.y, auv.y), 1.0);
  
  outColor.rgb += line * 0.3;
}
    `,
  },
]
