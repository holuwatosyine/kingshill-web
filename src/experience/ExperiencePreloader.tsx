import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { experienceState, type ExperienceReadyKey } from "@/experience/state";

const loaderVertex = `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}
`;

const loaderFragment = `
#define PI 3.14159265359
uniform float uAspect;
uniform float uProgress;
uniform float uExit;
varying vec2 vUv;
vec2 rotate2d(vec2 p,float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c)*p;}
float lineSegment(vec2 p,vec2 a,vec2 b,float w){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);float d=length(pa-ba*h);return 1.0-smoothstep(w,w+max(fwidth(d),.0015),d);}
float mark(vec2 p){float w=.025;float k=lineSegment(p,vec2(-.49,-.2),vec2(-.49,.2),w)+lineSegment(p,vec2(-.49,0.),vec2(-.27,.2),w)+lineSegment(p,vec2(-.49,0.),vec2(-.25,-.2),w);vec2 cp=p-vec2(-.015,0.);float c=1.0-smoothstep(w,w+max(fwidth(abs(length(cp)-.2)),.002),abs(length(cp)-.2));c*=1.0-step(.035,cp.x)*(1.0-smoothstep(.095,.14,abs(cp.y)));float a=lineSegment(p,vec2(.2,-.2),vec2(.38,.2),w)+lineSegment(p,vec2(.38,.2),vec2(.56,-.2),w)+lineSegment(p,vec2(.27,-.04),vec2(.49,-.04),w);return clamp(k+c+a,0.0,1.0);}
void main(){vec2 p=vUv*2.0-1.0;p.x*=uAspect;float transform=smoothstep(.38,1.0,uExit);p/=mix(1.0,6.6,transform);p=rotate2d(p,mix(0.0,PI/16.0,transform));p.y+=mix(0.0,.1,transform);float track=(1.0-step(p.x,-.3))*(1.0-step(.3,p.x))*(1.0-step(p.y,-.05))*(1.0-step(.05,p.y));float fill=track*(1.0-step(-.3+.6*uProgress,p.x));float logo=mark(p*3.8);float loading=1.0-step(.999,uProgress);float shape=track*loading+logo*(1.0-loading);vec3 navy=vec3(.012,.045,.12);vec3 gold=vec3(.82,.69,.25);vec3 paper=vec3(.96,.93,.82);vec3 trackColor=vec3(.08,.16,.30)*track*loading;vec3 fillColor=gold*fill*loading;vec3 logoColor=mix(gold,paper,uExit)*logo*(1.0-loading);float alpha=1.0-smoothstep(.76,1.0,uExit);gl_FragColor=vec4(mix(navy,trackColor+fillColor+logoColor,clamp(shape,0.0,1.0)),alpha);}
`;

const assets = [
  { url: "/experience/cloud.png", bytes: 420_000 },
  { url: "/experience/waternormals.jpg", bytes: 1_100_000 },
  { url: "/experience/models/c-transformed.glb", bytes: 310_000 },
  { url: "/experience/audio/kingshill-atmosphere.mp3", bytes: 3_000_000 },
  { url: "/experience/fonts/GeistVF.woff2", bytes: 190_000 },
  { url: "/experience/fonts/GeistMonoVF.woff2", bytes: 180_000 },
  { url: "/IMG-20250827-WA0019.webp", bytes: 320_000 },
  { url: "/IMG-20250821-WA0003.webp", bytes: 320_000 },
  { url: "/IMG-20250827-WA0020.webp", bytes: 320_000 },
  { url: "/IMG-20250827-WA0021.webp", bytes: 320_000 },
  { url: "/kingshill-course-feature.jpg", bytes: 420_000 },
  { url: "/IMG-20250827-WA0022.webp", bytes: 320_000 },
];

const ExperiencePreloader = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    document.documentElement.classList.add("kh-is-loading");

    let disposed = false;
    let raf = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let current = 0;
    let target = 0.02;
    let exit = 0;
    let last = performance.now();
    const loadedByAsset = new Map<string, number>();
    const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);

    const updateAssetProgress = (url: string, value: number) => {
      loadedByAsset.set(url, value);
      const loaded = Array.from(loadedByAsset.values()).reduce((sum, bytes) => sum + bytes, 0);
      target = Math.max(target, Math.min(0.82, (loaded / totalBytes) * 0.82));
    };

    const loadAsset = async ({ url, bytes }: (typeof assets)[number]) => {
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Unable to preload ${url}`);
      const total = Number(response.headers.get("content-length")) || bytes;
      if (!response.body) {
        await response.arrayBuffer();
        updateAssetProgress(url, bytes);
        return;
      }
      const reader = response.body.getReader();
      let loaded = 0;
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        loaded += result.value.byteLength;
        updateAssetProgress(url, Math.min(bytes, (loaded / Math.max(1, total)) * bytes));
      }
      updateAssetProgress(url, bytes);
    };

    const waitForRuntime = (keys: ExperienceReadyKey[]) => new Promise<void>((resolve) => {
      const complete = () => keys.every((key) => experienceState.isReady(key));
      if (complete()) return resolve();
      const unsubscribe = experienceState.subscribeReady(() => {
        if (!complete()) return;
        unsubscribe();
        resolve();
      });
      window.setTimeout(() => {
        unsubscribe();
        resolve();
      }, 12_000);
    });

    const preload = async () => {
      await Promise.allSettled(assets.map(loadAsset));
      experienceState.markReady("assets");
      target = Math.max(target, 0.86);
      await Promise.allSettled([
        document.fonts?.ready ?? Promise.resolve(),
        waitForRuntime(["cloud", "water", "fluid"]),
        import("@/components/effects/LusionConnectors"),
      ]);
      target = 1;
    };

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.ShaderMaterial({
        vertexShader: loaderVertex,
        fragmentShader: loaderFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: { uAspect: { value: 1 }, uProgress: { value: 0 }, uExit: { value: 0 } },
      });
      scene.add(new THREE.Mesh(geometry, material));
      const resize = () => {
        renderer?.setSize(window.innerWidth, window.innerHeight, false);
        if (material) material.uniforms.uAspect.value = window.innerWidth / Math.max(1, window.innerHeight);
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });

      const frame = (now: number) => {
        if (disposed || !renderer || !material) return;
        const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;
        current += (target - current) * (1 - Math.exp(-dt * 8));
        if (target >= 1 && current > 0.998) current = 1;
        if (current >= 1) exit = Math.min(1, exit + dt * 0.72);
        material.uniforms.uProgress.value = current;
        material.uniforms.uExit.value = exit;
        if (counterRef.current) counterRef.current.textContent = Math.round(current * 100).toString().padStart(3, "0");
        overlay.style.setProperty("--loader-exit", String(exit));
        renderer.render(scene, camera);
        if (exit >= 1) {
          document.documentElement.classList.remove("kh-is-loading");
          document.body.classList.add("kh-experience-ready");
          window.removeEventListener("resize", resize);
          renderer.dispose();
          geometry?.dispose();
          material?.dispose();
          setMounted(false);
          return;
        }
        raf = window.requestAnimationFrame(frame);
      };
      raf = window.requestAnimationFrame(frame);
    } catch (error) {
      console.error("Kingshill preloader shader failed", error);
      target = 1;
    }

    void preload();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      renderer?.dispose();
      geometry?.dispose();
      material?.dispose();
      document.documentElement.classList.remove("kh-is-loading");
    };
  }, []);

  if (!mounted) return null;

  const toggleSound = () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio("/experience/audio/kingshill-atmosphere.mp3");
      audio.loop = true;
      audio.volume = 0.14;
      audioRef.current = audio;
    }
    if (soundEnabled) audio.pause();
    else void audio.play().catch(() => undefined);
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div ref={overlayRef} className="kh-loader" role="status" aria-live="polite" aria-label="Loading the Kingshill experience">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="kh-loader__brand"><strong>Kingshill</strong><span>School of Discovery</span></div>
      <div className="kh-loader__status"><span>Loading</span><i /></div>
      <span ref={counterRef} className="kh-loader__counter">000</span>
      <button type="button" className="kh-loader__sound" onClick={toggleSound} aria-pressed={soundEnabled}>
        <span aria-hidden="true"><i /><i /><i /></span><b>Sound {soundEnabled ? "on" : "off"}</b>
      </button>
    </div>
  );
};

export default ExperiencePreloader;
