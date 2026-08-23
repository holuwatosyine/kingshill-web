import { useEffect, useRef } from "react";
import * as THREE from "three";
import { experienceState } from "@/experience/state";

const fragment = `
varying vec2 vUv;uniform float uTime;uniform float uProgress;uniform vec2 uPointer;
void main(){vec2 uv=vUv-.5;uv.x*=1.8;vec2 p=uPointer*.12;float phase=floor(uProgress*5.);float morph=fract(uProgress*5.);float radial=length(uv-p);float wave=sin(atan(uv.y,uv.x)*mix(2.,8.,morph)+uTime*.34+radial*17.);float ring=1.-smoothstep(.008,.03,abs(radial-mix(.08,.34,morph)-wave*.012));float filament=1.-smoothstep(.006,.018,abs(uv.y-sin(uv.x*mix(3.,12.,morph)+uTime*.55)*mix(.12,.025,morph)));vec3 blue=vec3(.10,.42,.48),gold=vec3(.78,.66,.28);vec3 colour=mix(blue,gold,smoothstep(.1,.95,uProgress));float alpha=(mix(ring,filament,smoothstep(.28,.72,morph)))*.24;alpha*=smoothstep(.48,.05,radial);gl_FragColor=vec4(colour,alpha);}`;

export const MorphingSignal = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || experienceState.reducedMotion) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setClearColor(0, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const material = new THREE.ShaderMaterial({ vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}", fragmentShader: fragment, transparent: true, depthTest: false, uniforms: { uTime: { value: 0 }, uProgress: { value: 0 }, uPointer: { value: new THREE.Vector2() } } });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const resize = () => { renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25)); renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); };
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
    const startedAt = performance.now();
    const frame = () => {
      material.uniforms.uTime.value = (performance.now() - startedAt) / 1000;
      material.uniforms.uProgress.value += (experienceState.scroll.progress - material.uniforms.uProgress.value) * 0.035;
      material.uniforms.uPointer.value.set(experienceState.pointer.smoothNdcX, experienceState.pointer.smoothNdcY);
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(frame);
    return () => { renderer.setAnimationLoop(null); ro.disconnect(); material.dispose(); geometry.dispose(); renderer.dispose(); };
  }, []);
  return <canvas ref={ref} className="kh-morph-signal" aria-hidden="true" />;
};

export default MorphingSignal;
