import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { experienceState } from "@/experience/state";

type LiquidButtonProps = {
  children: ReactNode;
  to: string;
  className?: string;
  ariaLabel?: string;
};

const vertex = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const fragment = `
precision highp float;varying vec2 v;uniform vec2 pointer;uniform float time;uniform float energy;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){vec2 uv=v;float d=distance(uv,pointer);float ripple=sin(d*36.-time*4.8)*exp(-d*8.)*(.08+energy*.12);float flow=noise(vec2(uv.x*4.-time*.14,uv.y*5.+time*.1));vec3 navy=vec3(.025,.105,.13),gold=vec3(.82,.69,.31),foam=vec3(.84,.94,.91);float field=smoothstep(.08,.92,uv.x+flow*.32+ripple);vec3 c=mix(navy,gold,field);c=mix(c,foam,smoothstep(.72,1.,flow+ripple*2.)*.48);float edge=smoothstep(.02,.08,uv.y)*smoothstep(.02,.08,1.-uv.y);gl_FragColor=vec4(c,edge);}`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export const LiquidButton = ({ children, to, className = "", ariaLabel }: LiquidButtonProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
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
    const position = gl.getAttribLocation(program, "p");
    const pointer = gl.getUniformLocation(program, "pointer");
    const time = gl.getUniformLocation(program, "time");
    const energy = gl.getUniformLocation(program, "energy");
    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    let visible = true;
    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.01 });
    observer.observe(canvas);
    const started = performance.now();
    const draw = (now: number) => {
      if (visible) {
        const rect = canvas.getBoundingClientRect();
        const localX = (experienceState.pointer.clientX - rect.left) / Math.max(1, rect.width);
        const localY = 1 - (experienceState.pointer.clientY - rect.top) / Math.max(1, rect.height);
        gl.uniform2f(pointer, localX, localY);
        gl.uniform1f(time, (now - started) / 1000);
        gl.uniform1f(energy, experienceState.pointer.smoothSpeed + (experienceState.pointer.pressed ? 1 : 0));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(draw);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <Link to={to} aria-label={ariaLabel} className={`kh-liquid-button ${className}`} data-cursor="liquid">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="kh-liquid-button__label">{children}</span>
    </Link>
  );
};

export default LiquidButton;
