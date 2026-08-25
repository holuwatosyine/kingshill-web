import { useEffect, useRef } from "react";
import * as THREE from "three";
import { experienceState } from "@/experience/state";

const vertexShader = `
  varying vec2 vUv;
  void main(){
    vUv=uv;
    gl_Position=vec4(position.xy,0.0,1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uScroll;

  vec3 palette(float index){
    if(index<0.5) return vec3(0.0005,0.0008,0.0012);
    if(index<1.5) return vec3(0.002,0.004,0.006);
    if(index<2.5) return vec3(0.004,0.009,0.010);
    return vec3(0.006,0.012,0.012);
  }

  void main(){
    vec2 p=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;
    vec2 uv=vUv;
    float cycle=4.6;
    float position=mod(uTime,cycle*4.0)/cycle;
    float index=floor(position);
    float local=fract(position);
    float blend=smoothstep(.72,1.0,local);
    vec3 from=palette(index);
    vec3 to=palette(mod(index+1.0,4.0));
    vec3 col=mix(from,to,blend);

    vec2 pointer=(uPointer-.5)*vec2(uResolution.x/uResolution.y,1.0);
    float drift=uTime*.055 + uScroll*.38;
    p.x += sin(uTime*.11 + p.y*2.2) * uScroll*.018;
    p.y += cos(uTime*.13 + p.x*1.7) * uScroll*.012;
    float wave=sin(p.x*2.6+drift)+cos(p.y*2.0-drift*.8);
    vec2 flow=vec2(sin(p.y*1.7+drift),cos(p.x*1.35-drift))*0.08;
    float bloom=exp(-length(p+flow-vec2(sin(drift)*.28,cos(drift*.72)*.2))*2.8);
    float touch=exp(-length(p-pointer)*3.2);
    float edge=smoothstep(1.2,.05,length(p+vec2(.0,.08)));

    col+=bloom*vec3(.035,.075,.07)*(.12+.05*sin(uTime*.45));
    col+=touch*vec3(.05,.08,.08)*(.045 + uScroll*.04);
    col+=vec3(.008,.016,.018)*wave*(.028 + uScroll*.03);
    col*=1.015+edge*.08;
    col+=smoothstep(.68,1.0,local)*vec3(.025,.035,.035)*.035;
    gl_FragColor=vec4(col,1.0);
  }
`;

const TrainingShaderBackground = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
    const updatePixelRatio = () => renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5 * experienceState.renderScale));
    updatePixelRatio();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x02050a, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2() },
        uPointer: { value: new THREE.Vector2(.5, .5) },
        uTime: { value: 0 },
        uScroll: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
    const started = performance.now();
    let frame = 0;
    let visible = true;
    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
    };
    const draw = () => {
      frame = 0;
      if (!visible) return;
      const pointer = experienceState.pointer;
      material.uniforms.uTime.value = (performance.now() - started) / 1000;
      const scrollEnergy = Math.min(1, Math.abs(experienceState.scroll.velocity) / 150 + experienceState.chapter.energy * 0.18);
      material.uniforms.uScroll.value += (scrollEnergy - material.uniforms.uScroll.value) * .12;
      material.uniforms.uPointer.value.set(pointer.clientX / Math.max(1, window.innerWidth), 1 - pointer.clientY / Math.max(1, window.innerHeight));
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !frame) frame = requestAnimationFrame(draw); }, { threshold: .01 });
    observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("kingshill:render-scale", updatePixelRatio);
    window.addEventListener("kingshill:render-scale", resize);
    resize();
    frame = requestAnimationFrame(draw);
    return () => {
      visible = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("kingshill:render-scale", updatePixelRatio);
      window.removeEventListener("kingshill:render-scale", resize);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="kh-training-shader" aria-hidden="true"><canvas ref={ref} className="kh-training-shader__canvas" /></div>;
};

export default TrainingShaderBackground;
