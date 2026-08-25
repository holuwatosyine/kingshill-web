import { useEffect, useRef } from "react";
import * as THREE from "three";
import { experienceState } from "@/experience/state";

const vertexShader = `
attribute vec3 aScatter;
attribute float aSeed;
uniform float uTime;
uniform float uAssemble;
uniform float uEnergy;
uniform float uDpr;
uniform vec2 uPointer;
varying float vSeed;
void main(){
  vec3 p=mix(aScatter,position,uAssemble);
  float distanceToPointer=distance(p.xy,uPointer);
  vec2 direction=normalize(p.xy-uPointer+vec2(.0001));
  float pressure=exp(-distanceToPointer*7.5)*uEnergy;
  p.xy+=direction*pressure*.16;
  p.z+=sin(uTime*.46+aSeed*31.0)*.012*uAssemble;
  gl_Position=vec4(p,1.0);
  gl_PointSize=(1.38+uEnergy*1.5+sin(aSeed*18.0+uTime*.46)*.12)*uDpr;
  vSeed=aSeed;
}`;

const fragmentShader = `
varying float vSeed;
void main(){
  vec2 point=gl_PointCoord-.5;
  float radius=length(point);
  if(radius>.5)discard;
  float soft=1.0-smoothstep(.22,.5,radius);
  vec3 mineral=vec3(.78,1.0,.95);
  vec3 ivory=vec3(1.0,.995,.94);
  vec3 colour=mix(mineral,ivory,smoothstep(.18,.82,vSeed));
  gl_FragColor=vec4(colour,soft);
}`;

const createParticleGeometry = (quality: "low" | "medium" | "high") => {
  const source = document.createElement("canvas");
  source.width = 1600;
  source.height = 340;
  const context = source.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Unable to create particle wordmark source canvas.");
  context.clearRect(0, 0, source.width, source.height);
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = '680 252px "Geist KH", Arial, sans-serif';
  context.fillText("KINGS HILL", source.width / 2, source.height / 2 + 18);
  const pixels = context.getImageData(0, 0, source.width, source.height).data;
  const step = quality === "high" ? 5 : quality === "medium" ? 6 : 8;
  const positions: number[] = [];
  const scatter: number[] = [];
  const seeds: number[] = [];

  for (let y = 0; y < source.height; y += step) {
    for (let x = 0; x < source.width; x += step) {
      if (pixels[(y * source.width + x) * 4 + 3] < 96) continue;
      const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      positions.push((x / source.width - 0.5) * 1.88, -(y / source.height - 0.5) * 1.42, 0);
      scatter.push((seed - 0.5) * 3.4, ((seed * 17.17) % 1 - 0.5) * 2.4, ((seed * 43.7) % 1 - 0.5) * 1.2);
      seeds.push(seed);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aScatter", new THREE.Float32BufferAttribute(scatter, 3));
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return geometry;
};

export const FooterWordmarkScene = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let visible = false;
    let documentVisible = !document.hidden;
    let assemble = experienceState.reducedMotion ? 1 : 0;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const resize = () => {
      if (!renderer || !material) return;
      const qualityCap = experienceState.quality === "high" ? 1.6 : 1.2;
      const dpr = Math.min(window.devicePixelRatio || 1, qualityCap * experienceState.renderScale);
      renderer.setPixelRatio(dpr);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      material.uniforms.uDpr.value = dpr;
    };

    const startedAt = performance.now();
    const frame = () => {
      if (!renderer || !material || disposed || !visible || !documentVisible) return;
      const rect = canvas.getBoundingClientRect();
      const localX = ((experienceState.pointer.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const localY = -(((experienceState.pointer.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      const inside = localX > -1.15 && localX < 1.15 && localY > -1.3 && localY < 1.3;
      const chapterEnergy = experienceState.chapter.name === "EPILOGUE" ? experienceState.chapter.energy : experienceState.chapter.energy * 0.35;
      const targetEnergy = inside ? Math.min(1, experienceState.pointer.smoothSpeed * 1.8 + (experienceState.pointer.pressed ? 0.8 : 0) + chapterEnergy * 0.3) : chapterEnergy * 0.1;
      assemble += (1 - assemble) * 0.045;
      material.uniforms.uTime.value = (performance.now() - startedAt) / 1000;
      material.uniforms.uAssemble.value = assemble;
      material.uniforms.uEnergy.value += (targetEnergy - material.uniforms.uEnergy.value) * 0.12;
      material.uniforms.uPointer.value.set(localX, localY);
      renderer.render(scene, camera);
    };

    const syncLoop = () => renderer?.setAnimationLoop(visible && documentVisible ? frame : null);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncLoop(); }, { threshold: 0.01 });
    const onVisibility = () => { documentVisible = !document.hidden; syncLoop(); };

    const init = async () => {
      await document.fonts.ready;
      if (disposed) return;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      geometry = createParticleGeometry(experienceState.quality);
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: assemble },
          uEnergy: { value: 0 },
          uDpr: { value: 1 },
          uPointer: { value: new THREE.Vector2(2, 2) },
        },
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);
      resize();
      observer.observe(canvas);
      syncLoop();
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("kingshill:render-scale", resize);
    document.addEventListener("visibilitychange", onVisibility);
    void init();

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.removeEventListener("kingshill:render-scale", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      renderer?.setAnimationLoop(null);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
    };
  }, []);

  return <canvas ref={ref} className="kh-footer-wordmark" aria-label="Kings Hill particle wordmark" role="img" />;
};

export default FooterWordmarkScene;
