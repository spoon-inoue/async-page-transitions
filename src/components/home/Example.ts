export const code = `
// https://twigl.app/?ol=true&ss=-OlAr_KNoB_6vcEaPiDA
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float frame;
uniform sampler2D backbuffer;
out vec4 O;

// https://conwaylife.com/wiki/101
const int[216] ip = int[](
0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,
0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,
0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,
1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,
1,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,1,
0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,
0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,
1,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,1,
1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,
0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,
0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,
0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0
);
const float row = 12.;

const float col = float(ip.length()) / row;

void main(){
	vec2 uv = gl_FragCoord.xy / resolution;
	float aspect = resolution.x / resolution.y;
		
	float grid = max(row, col) + 10.;
	vec2 field;
	if (1. < aspect) field = grid * vec2(aspect, 1);
	else             field = grid * vec2(1, 1. / aspect);
	field = floor(field);
	
	if (frame == 1.) {
		// initial position
		vec2 iuv = floor(vec2(uv.x, 1. - uv.y) * field);
		vec2 center = floor((field - vec2(col, row)) / 2.);
		vec2 p = vec2(mod(iuv.x, field.x), iuv.y) - center;

		if (0. <= p.y && p.y < row && 0. <= p.x && p.x < col) {
			int id = int(p.x + p.y * col);
			O.a = float(ip[id]);
		}
		return;
		
	} else if (mod(frame, 5.) != 0.) {
		// delay
		O = texture(backbuffer, uv);
		return;
	}

	// life game
	vec2 px = 1. / field;
	vec2 cuv = (floor(uv * field) + 0.5) / field;

	float alive;
	for(int y = -1; y <= 1; y++) {
		for(int x = -1; x <= 1; x++) {
			if (x == 0 && y == 0) continue;
			alive += texture(backbuffer, cuv + px * vec2(x, y)).a;
		} 
	}

	float cell = texture(backbuffer, cuv).a;
	if (cell == 0.) {
		if (alive == 3.) cell = 1.;
	} else {
		if (alive == 2. || alive == 3.) cell = 1.;
		else if (alive <= 1.) cell = 0.;
		else if (4. <= alive) cell = 0.;
	}

	vec2 fuv = fract(uv * field);
	vec2 auv = abs(fuv * 2. - 1.);
	float size = 0.7;
	float rect = step(size - 1. / field.x, auv.x)
						+ step(size - 1. / field.y, auv.y);
	rect = 1. - min(rect, 1.);

	vec3 bCol = texture(backbuffer, uv).rgb;
	vec3 col = mix(bCol, vec3(rect) * cell, 0.7);

	O = vec4(col, cell);
}
`
