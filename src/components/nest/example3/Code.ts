export const code = `
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;
out vec4 outColor;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))

float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}

float sdSphere( vec3 p, float s ) {
  return length(p)-s;
}

float sdf(vec3 p) {
  vec3 h = vec3(0, 1, -1) * 2.0;
  float f;
  f =        sdCapsule(p, h.zxx, h.yxx, 0.1);
  f = min(f, sdCapsule(p, h.xzx, h.xyx, 0.1));
  f = min(f, sdCapsule(p, h.xxz, h.xxy, 0.1));
  f = min(f, sdSphere(p, 0.5));
  return f;
}

void main(){
  vec2 r=resolution, suv=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  float timeScale = 1.0;
  vec3 rd = normalize(vec3(suv, -2.0));
  vec3 ro = vec3(0, 0, 2.0 - time * 2.0 * timeScale);
  float d, t, ac;
  
  for (int i; i < 100; i++) {
    vec3 p = ro + t * rd;
    p.xy *= rot(p.z * 0.005 + time * 0.05 * timeScale);
    p = mod(p, 4.0) - 2.0;
    d = sdf(p);
    d = max(abs(d), 0.02);
    ac += exp(-d * 10.0);
    t += d;
    if (1e2 < t) break;
  }
  outColor = sin(ac * vec4(1, 1.8, 2.3, 0) * 0.005);
}
`
