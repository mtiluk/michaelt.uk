/*
 * Adapted from ditherwave (https://github.com/sahilsaini5/ditherwave).
 *
 * MIT License
 *
 * Copyright (c) 2026 sahilsaini5
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

type DitheredWavesOptions = {
  waveColor: string;
  baseColor: string;
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  colorNum: number;
  pixelRatio: number;
  animate: boolean;
  fps: number;
};

export type DitheredWavesHandle = {
  setOptions: (next: Partial<DitheredWavesOptions>) => void;
  destroy: () => void;
};

const VERTEX = `#version 300 es
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_frag;

uniform vec2  u_res;
uniform float u_time;
uniform float u_waveSpeed;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform vec3  u_waveColor;
uniform vec3  u_baseColor;
uniform float u_colorNum;

vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 4; i++) {
    v += amp * abs(cnoise(p));
    p *= u_waveFrequency;
    amp *= u_waveAmplitude;
  }
  return v;
}

float pattern(vec2 p){
  vec2 q = p - u_time * u_waveSpeed;
  return fbm(p + fbm(q));
}

const float BAYER[64] = float[64](
   0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0, 16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0, 19.0/64.0, 47.0/64.0, 31.0/64.0,
   8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0, 59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0, 24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0, 27.0/64.0, 39.0/64.0, 23.0/64.0,
   2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0, 49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0, 18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0, 17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0, 58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0, 57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0, 26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0, 25.0/64.0, 37.0/64.0, 21.0/64.0
);

void main(){
  vec2 cell = floor(v_uv * u_res);
  vec2 p = cell / u_res - 0.5;
  p.x *= u_res.x / u_res.y;

  float f = clamp(pattern(p), 0.0, 1.0);
  vec3 col = mix(u_baseColor, u_waveColor, f);

  int bx = int(mod(cell.x, 8.0));
  int by = int(mod(cell.y, 8.0));
  float threshold = (BAYER[by * 8 + bx] - 0.5) * 0.5;
  float levels = u_colorNum - 1.0;
  vec3 c = clamp(col + threshold / levels - 0.15, 0.0, 1.0);
  o_frag = vec4(floor(c * levels + 0.5) / levels, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader alloc failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader compile: ${log}`);
  }
  return shader;
}

function toRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (h.length !== 6) return [0, 0, 0];
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

type Renderer = {
  canvas: HTMLCanvasElement;
  setUniforms: (opts: DitheredWavesOptions) => void;
  setSize: (width: number, height: number) => void;
  draw: (time: number) => void;
  destroy: () => void;
};

function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL2 not supported");

  const program = gl.createProgram();
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program link: ${log}`);
  }

  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    res: uniform("u_res"),
    time: uniform("u_time"),
    waveSpeed: uniform("u_waveSpeed"),
    waveFrequency: uniform("u_waveFrequency"),
    waveAmplitude: uniform("u_waveAmplitude"),
    waveColor: uniform("u_waveColor"),
    baseColor: uniform("u_baseColor"),
    colorNum: uniform("u_colorNum"),
  };

  return {
    canvas,
    setUniforms(opts) {
      gl.uniform1f(u.waveSpeed, opts.waveSpeed);
      gl.uniform1f(u.waveFrequency, opts.waveFrequency);
      gl.uniform1f(u.waveAmplitude, opts.waveAmplitude);
      gl.uniform3f(u.waveColor, ...toRgb(opts.waveColor));
      gl.uniform3f(u.baseColor, ...toRgb(opts.baseColor));
      gl.uniform1f(u.colorNum, Math.max(2, Math.min(8, opts.colorNum)));
    },
    setSize(width, height) {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.res, width, height);
    },
    draw(time) {
      gl.uniform1f(u.time, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

function bufferSize(canvas: HTMLCanvasElement, pixelRatio: number): [number, number] {
  return [
    Math.max(1, Math.floor(canvas.clientWidth * pixelRatio)),
    Math.max(1, Math.floor(canvas.clientHeight * pixelRatio)),
  ];
}

export function createDitheredWaves(
  canvas: HTMLCanvasElement,
  initial: DitheredWavesOptions,
): DitheredWavesHandle {
  let opts = { ...initial };
  const renderer = createRenderer(canvas);

  const start = performance.now();
  const draw = (now: number) => renderer.draw(opts.animate ? (now - start) / 1000 : 0);

  let size = bufferSize(canvas, opts.pixelRatio);
  const resize = () => {
    size = bufferSize(canvas, opts.pixelRatio);
    renderer.setSize(...size);
    draw(performance.now());
  };

  let frame = 0;
  let last = -Infinity;
  let visible = true;
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (now - last < 1000 / opts.fps - 1) return;
    last = now;
    draw(now);
  };
  const sync = () => {
    const run = opts.animate && visible;
    if (run && !frame) {
      frame = requestAnimationFrame(tick);
    } else if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    sync();
  });
  intersectionObserver.observe(canvas);

  renderer.setUniforms(opts);
  renderer.setSize(...size);
  sync();

  return {
    setOptions(next) {
      const previousRatio = opts.pixelRatio;
      opts = { ...opts, ...next };
      renderer.setUniforms(opts);
      if (opts.pixelRatio !== previousRatio) resize();
      sync();
      if (!frame) draw(performance.now());
    },
    destroy() {
      cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.destroy();
    },
  };
}

let shared: Renderer | null = null;
let sharedUsers = 0;

export function createDitheredWavesStill(
  canvas: HTMLCanvasElement,
  initial: DitheredWavesOptions,
): DitheredWavesHandle {
  let opts = { ...initial };
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas not supported");

  shared ??= createRenderer(document.createElement("canvas"));
  const renderer = shared;
  sharedUsers++;

  let elapsed = 0;
  let resumedAt = 0;
  let frame = 0;
  let last = -Infinity;
  const time = (now: number) =>
    (frame ? elapsed + Math.max(0, now - resumedAt) : elapsed) / 1000;

  const render = (now = performance.now()) => {
    const [width, height] = bufferSize(canvas, opts.pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    renderer.setUniforms(opts);
    renderer.setSize(width, height);
    renderer.draw(time(now));
    ctx.drawImage(renderer.canvas, 0, 0);
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (now - last < 1000 / opts.fps - 1) return;
    last = now;
    render(now);
  };
  const sync = () => {
    if (opts.animate && !frame) {
      resumedAt = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (!opts.animate && frame) {
      elapsed += Math.max(0, performance.now() - resumedAt);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const resizeObserver = new ResizeObserver(() => render());
  resizeObserver.observe(canvas);
  render();
  sync();

  return {
    setOptions(next) {
      opts = { ...opts, ...next };
      sync();
      if (!frame) render();
    },
    destroy() {
      cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      if (--sharedUsers === 0) {
        renderer.destroy();
        shared = null;
      }
    },
  };
}
