import React, { useEffect, useRef } from "react";

const vertex = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + 17.17;
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.045;
  vec2 wind = vec2(t * 0.75, sin(t * 0.7) * 0.2);
  float cloud = fbm(p * vec2(1.35, 2.0) + wind);
  float veil = smoothstep(0.37, 0.88, cloud) * smoothstep(0.06, 0.75, uv.y);

  float doorway = exp(-pow((uv.x - 0.59) * 10.5, 2.0)) * smoothstep(0.08, 0.78, uv.y);
  float pulse = 0.72 + 0.28 * sin(u_time * 0.21 + uv.y * 4.0);
  float pointerGlow = exp(-length((uv - u_pointer) * vec2(1.25, 1.0)) * 5.6);

  vec3 limestone = vec3(0.92, 0.94, 0.92);
  vec3 royal = vec3(0.02, 0.10, 0.27);
  vec3 gold = vec3(0.78, 0.66, 0.25);
  vec3 colour = mix(royal, limestone, clamp(uv.y + cloud * 0.22, 0.0, 1.0));
  colour = mix(colour, gold, doorway * pulse * 0.42);
  colour += pointerGlow * vec3(0.13, 0.20, 0.31);

  float grain = hash(gl_FragCoord.xy + floor(u_time * 18.0)) - 0.5;
  float alpha = veil * 0.085 + doorway * 0.075 + pointerGlow * 0.025 + abs(grain) * 0.022;
  gl_FragColor = vec4(colour + grain * 0.035, alpha);
}
`;

const makeShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export const ShaderCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = makeShader(gl, gl.VERTEX_SHADER, vertex);
    const fs = makeShader(gl, gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const pointer = gl.getUniformLocation(program, "u_pointer");
    const time = gl.getUniformLocation(program, "u_time");
    const cursor = { x: 0.59, y: 0.48, tx: 0.59, ty: 0.48 };

    const onPoint = (x: number, y: number) => {
      cursor.tx = x / window.innerWidth;
      cursor.ty = 1 - y / window.innerHeight;
    };
    const onPointer = (event: PointerEvent) => onPoint(event.clientX, event.clientY);
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) onPoint(touch.clientX, touch.clientY);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    resize();

    let frame = 0;
    const started = performance.now();
    const draw = (now: number) => {
      cursor.x += (cursor.tx - cursor.x) * 0.035;
      cursor.y += (cursor.ty - cursor.y) * 0.035;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointer, cursor.x, cursor.y);
      gl.uniform1f(time, (now - started) / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={ref} className="kh-hero__shader" aria-hidden="true" />;
};

export default ShaderCanvas;
