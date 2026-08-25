import { useEffect, useRef } from "react";
import * as THREE from "three";
import { experienceState } from "@/experience/state";

const vertexShader = `
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uTime;
  uniform float uAssemble;
  uniform float uEnergy;
  uniform float uScroll;
  uniform float uDpr;
  uniform vec2 uPointer;
  varying float vSeed;
  void main(){
    vec3 p=mix(aScatter,position,uAssemble);
    float distanceToPointer=distance(p.xy,uPointer);
    vec2 direction=normalize(p.xy-uPointer+vec2(.0001));
    float pressure=exp(-distanceToPointer*4.8)*uEnergy;
    p.xy+=direction*pressure*.13;
    p.z+=sin(uTime*.44+aSeed*25.0)*.018*uAssemble;
    p.x+=sin(uTime*.24+aSeed*10.0)*uScroll*.018;
    p.y+=cos(uTime*.2+aSeed*7.0)*uScroll*.012;
    gl_Position=vec4(p,1.0);
    gl_PointSize=(1.8+uEnergy*2.2+uScroll*1.4+sin(aSeed*17.0+uTime*.44)*.18)*uDpr;
    vSeed=aSeed;
  }
`;

const fragmentShader = `
  varying float vSeed;
  void main(){
    vec2 point=gl_PointCoord-.5;
    float radius=length(point);
    if(radius>.5) discard;
    float soft=1.0-smoothstep(.12,.5,radius);
    vec3 mineral=vec3(.56,1.0,.91);
    vec3 ivory=vec3(1.0,.998,.94);
    vec3 colour=mix(mineral,ivory,smoothstep(.08,.88,vSeed));
    gl_FragColor=vec4(colour,soft);
  }
`;

const createGeometry = () => {
  const source = document.createElement("canvas");
  source.width = 1600;
  source.height = 440;
  const context = source.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Unable to create Footer closing text source.");
  context.clearRect(0, 0, source.width, source.height);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = '700 188px "Syne", Arial, sans-serif';
  context.fillText("SEE FURTHER.", source.width / 2, 158);
  context.font = '700 150px "Syne", Arial, sans-serif';
  context.fillText("LEAD WITH PURPOSE.", source.width / 2, 318);
  const pixels = context.getImageData(0, 0, source.width, source.height).data;
  const positions: number[] = [];
  const scatter: number[] = [];
  const seeds: number[] = [];
  const step = experienceState.quality === "high" ? 4 : experienceState.quality === "medium" ? 5 : 7;
  for (let y = 0; y < source.height; y += step) {
    for (let x = 0; x < source.width; x += step) {
      if (pixels[(y * source.width + x) * 4 + 3] < 80) continue;
      const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      positions.push((x / source.width - .5) * 1.94, -(y / source.height - .5) * 1.3, 0);
      scatter.push((seed - .5) * 2.8, ((seed * 17.17) % 1 - .5) * 2.2, ((seed * 43.7) % 1 - .5) * 1.1);
      seeds.push(seed);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aScatter", new THREE.Float32BufferAttribute(scatter, 3));
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return geometry;
};

const FooterClosingText = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let frame = 0;
    let visible = true;
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    const start = async () => {
      await document.fonts.ready;
      if (disposed) return;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      geometry = createGeometry();
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uAssemble: { value: experienceState.reducedMotion ? 1 : 0 }, uEnergy: { value: 0 }, uScroll: { value: 0 }, uDpr: { value: 1 }, uPointer: { value: new THREE.Vector2(2, 2) } },
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);
      const resize = () => {
        if (!renderer || !material) return;
        const width = Math.max(1, canvas.clientWidth);
        const height = Math.max(1, canvas.clientHeight);
        const qualityCap = experienceState.quality === "high" ? 1.5 : 1.2;
        const dpr = Math.min(window.devicePixelRatio || 1, qualityCap * experienceState.renderScale);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        material.uniforms.uDpr.value = dpr;
      };
      const started = performance.now();
      const draw = () => {
        frame = 0;
        if (disposed || !renderer || !material || !visible) return;
        const pointer = experienceState.pointer;
        const rect = canvas.getBoundingClientRect();
        const x = ((pointer.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        const y = -(((pointer.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
        const inside = x > -1.2 && x < 1.2 && y > -1.2 && y < 1.2;
        material.uniforms.uPointer.value.set(inside ? x : 2, inside ? y : 2);
        const chapterEnergy = experienceState.chapter.name === "EPILOGUE" ? experienceState.chapter.energy : experienceState.chapter.energy * 0.45;
        material.uniforms.uEnergy.value += ((inside ? Math.min(1, pointer.smoothSpeed * 1.8 + (pointer.pressed ? .8 : 0) + chapterEnergy * 0.35) : chapterEnergy * 0.12) - material.uniforms.uEnergy.value) * .12;
        const scrollEnergy = Math.min(1, Math.abs(experienceState.scroll.velocity) / 150 + chapterEnergy * 0.16);
        material.uniforms.uScroll.value += (scrollEnergy - material.uniforms.uScroll.value) * .14;
        const assembled = material.uniforms.uAssemble.value as number;
        material.uniforms.uAssemble.value = assembled + (1 - assembled) * .045;
        material.uniforms.uTime.value = (performance.now() - started) / 1000;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) frame = requestAnimationFrame(draw);
      }, { threshold: .01 });
      observer.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("kingshill:render-scale", resize);
      resize();
      frame = requestAnimationFrame(draw);
      const cleanup = () => { observer.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("kingshill:render-scale", resize); };
      (canvas as HTMLCanvasElement & { __khCleanup?: () => void }).__khCleanup = cleanup;
    };
    void start();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      (canvas as HTMLCanvasElement & { __khCleanup?: () => void }).__khCleanup?.();
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
    };
  }, []);
  return <canvas ref={ref} className="kh-footer-closing-text" aria-label="See further. Lead with purpose." role="img" />;
};

export default FooterClosingText;
