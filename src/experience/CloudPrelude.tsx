import { useEffect, useRef } from "react";
import * as THREE from "three";
import { experienceState } from "@/experience/state";

type CloudConfig = {
  seed: number;
  position: [number, number, number];
  bounds: [number, number, number];
  colour: number;
  shadow: number;
  volume: number;
  count: number;
  fade: [number, number];
};

const cameraPoints = [
  new THREE.Vector3(0, 15.5, 29),
  new THREE.Vector3(0.9, 14.1, 22),
  new THREE.Vector3(-1.5, 12, 14),
  new THREE.Vector3(1.2, 9.2, 6),
  new THREE.Vector3(-0.8, 6.5, -2),
  new THREE.Vector3(0, 4.8, -12),
];

const clusters: CloudConfig[] = [
  { seed: 10, position: [-5.2, 15.7, 25], bounds: [11, 6, 5], colour: 0xffffff, shadow: 0x75b7ff, volume: 7.8, count: 46, fade: [0.1, 0.36] },
  { seed: 20, position: [5.3, 13.1, 20], bounds: [11, 5.4, 4.6], colour: 0xf8fcff, shadow: 0x2e79cf, volume: 7.5, count: 46, fade: [0.16, 0.43] },
  { seed: 30, position: [-4.6, 12.1, 13], bounds: [10, 5.5, 4.8], colour: 0xffffff, shadow: 0x8bc4ff, volume: 7.6, count: 48, fade: [0.26, 0.55] },
  { seed: 40, position: [4.8, 9.7, 6], bounds: [10.5, 5.7, 4.8], colour: 0xf5fbff, shadow: 0x2468b5, volume: 8, count: 52, fade: [0.34, 0.64] },
  { seed: 50, position: [-4.1, 7.1, -1], bounds: [10.4, 5.2, 4.5], colour: 0xffffff, shadow: 0x73b1f2, volume: 7.5, count: 48, fade: [0.43, 0.72] },
  { seed: 60, position: [4.2, 5.8, -8], bounds: [10.8, 5.5, 4.8], colour: 0xf7fcff, shadow: 0x1d5fa9, volume: 7.8, count: 54, fade: [0.5, 0.78] },
  { seed: 70, position: [-8.7, 9.2, -29], bounds: [16, 5, 8], colour: 0xf7fafc, shadow: 0x8fa7c2, volume: 8.8, count: 68, fade: [0.61, 0.91] },
  { seed: 80, position: [8.2, 9.8, -37], bounds: [16, 5.4, 9], colour: 0xf7fafc, shadow: 0x405a80, volume: 9.2, count: 74, fade: [0.66, 0.94] },
  { seed: 90, position: [0, 12.4, -45], bounds: [26, 5.8, 11], colour: 0xffffff, shadow: 0x6c86a8, volume: 9.6, count: 86, fade: [0.72, 0.98] },
];

const cloudVertex = `
attribute vec3 aOffset;
attribute vec2 aScale;
attribute vec3 aColor;
attribute float aOpacity;
attribute float aPhase;
attribute vec2 aFade;
uniform float uTime;
uniform float uProgress;
uniform float uEnergy;
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vUv=uv;vColor=aColor;
  float visible=1.0-smoothstep(aFade.x,aFade.y,uProgress);
  float breath=1.0+sin(uTime*(.13+fract(aPhase)*.18)+aPhase)*.045;
  float stretch=1.0+uEnergy*.08*(.35+fract(aPhase*4.17));
  vec3 center=aOffset;
  center.x+=sin(uTime*.10+aPhase)*.18;
  center.y+=cos(uTime*.13+aPhase)*.11;
  vec4 mv=viewMatrix*modelMatrix*vec4(center,1.0);
  mv.xy+=position.xy*aScale*breath*stretch;
  gl_Position=projectionMatrix*mv;
  vAlpha=aOpacity*visible;
}`;

const cloudFragment = `
uniform sampler2D uMap;
uniform float uDissolve;
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec4 tex=texture2D(uMap,vUv);
  float soft=tex.a*smoothstep(.02,.32,tex.r);
  float alpha=soft*vAlpha*(1.0-uDissolve);
  if(alpha<.004) discard;
  gl_FragColor=vec4(vColor,alpha);
}`;

const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    const x = Math.sin(value++) * 10000;
    return x - Math.floor(x);
  };
};

const CloudPrelude = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    let disposed = false;
    let visible = true;
    let documentVisible = !document.hidden;
    let scrollEnergy = 0;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb9d9ff, 24, 112);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 160);
    const curve = new THREE.CatmullRomCurve3(cameraPoints, false, "catmullrom", 0.4);
    const lookPoint = new THREE.Vector3();
    const cameraPoint = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    const texture = new THREE.TextureLoader().load("/experience/cloud.png");
    texture.colorSpace = THREE.SRGBColorSpace;

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uEnergy: { value: 0 },
      uDissolve: { value: 0 },
      uMap: { value: texture },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: cloudVertex,
      fragmentShader: cloudFragment,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
    });
    const meshes: THREE.Mesh[] = [];

    clusters.forEach((config) => {
      const base = new THREE.PlaneGeometry(1, 1);
      const geometry = new THREE.InstancedBufferGeometry();
      geometry.index = base.index;
      geometry.setAttribute("position", base.getAttribute("position"));
      geometry.setAttribute("uv", base.getAttribute("uv"));
      geometry.instanceCount = config.count;
      const offsets = new Float32Array(config.count * 3);
      const scales = new Float32Array(config.count * 2);
      const colors = new Float32Array(config.count * 3);
      const opacity = new Float32Array(config.count);
      const phase = new Float32Array(config.count);
      const fade = new Float32Array(config.count * 2);
      const random = seededRandom(config.seed);
      for (let index = 0; index < config.count; index += 1) {
        const edge = Math.pow(random(), 0.64);
        offsets[index * 3] = (random() * 2 - 1) * config.bounds[0] * 0.52 * edge;
        offsets[index * 3 + 1] = (random() * 2 - 1) * config.bounds[1] * 0.52 * edge;
        offsets[index * 3 + 2] = (random() * 2 - 1) * config.bounds[2] * 0.52 * edge;
        const baseScale = config.volume * (0.2 + random() * 0.25);
        scales[index * 2] = baseScale * (1.3 + random() * 0.26);
        scales[index * 2 + 1] = baseScale;
        const shadowed = index % 4 === 0 || offsets[index * 3 + 1] < -config.bounds[1] * 0.16;
        const colour = new THREE.Color(shadowed ? config.shadow : config.colour);
        colors.set([colour.r, colour.g, colour.b], index * 3);
        opacity[index] = shadowed ? 0.5 : 0.66;
        phase[index] = random() * Math.PI * 2;
        fade[index * 2] = config.fade[0];
        fade[index * 2 + 1] = config.fade[1];
      }
      geometry.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
      geometry.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 2));
      geometry.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
      geometry.setAttribute("aOpacity", new THREE.InstancedBufferAttribute(opacity, 1));
      geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
      geometry.setAttribute("aFade", new THREE.InstancedBufferAttribute(fade, 2));
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...config.position);
      mesh.frustumCulled = false;
      meshes.push(mesh);
      scene.add(mesh);
      base.dispose();
    });

    const sparksGeometry = new THREE.BufferGeometry();
    const sparkRandom = seededRandom(20260821);
    const sparks = new Float32Array(96 * 3);
    for (let index = 0; index < 96; index += 1) {
      sparks[index * 3] = (sparkRandom() * 2 - 1) * 11;
      sparks[index * 3 + 1] = 4 + sparkRandom() * 14;
      sparks[index * 3 + 2] = 31 - sparkRandom() * 48;
    }
    sparksGeometry.setAttribute("position", new THREE.BufferAttribute(sparks, 3));
    const sparksMaterial = new THREE.PointsMaterial({ color: 0xb8d9ca, size: 0.075, sizeAttenuation: true, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending });
    const sparkField = new THREE.Points(sparksGeometry, sparksMaterial);
    scene.add(sparkField);

    const updateScroll = () => {
      // The cloud belongs to the preloader only. Keep this hook for lifecycle
      // compatibility, but never couple the scene to homepage scroll.
    };
    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      camera.aspect = width / height;
      camera.fov = width < 720 ? 47 : 40;
      camera.updateProjectionMatrix();
      const dprCap = experienceState.quality === "high" ? 1.6 : experienceState.quality === "medium" ? 1.35 : 1.15;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap * experienceState.renderScale));
      renderer.setSize(width, height, false);
    };

    const startedAt = performance.now();
    let previousFrame = startedAt;
    let exitProgress = 0;
    const animate = () => {
      if (disposed || !visible || !documentVisible) return;
      const now = performance.now();
      const delta = Math.min(0.05, Math.max(0.001, (now - previousFrame) / 1000));
      const elapsed = (now - startedAt) / 1000;
      previousFrame = now;

      // The preloader owns the full cloud passage. Each captured gesture moves
      // the camera deeper through the cloud path; completion then starts the dissolve.
      const gestureProgress = experienceState.scroll.cloudProgress;
      if (experienceState.entered) {
        exitProgress = Math.min(1, exitProgress + delta * 0.82);
      }
      const progress = experienceState.reducedMotion ? 0.42 : Math.min(0.96, gestureProgress * 0.94 + elapsed * 0.012);
      const pointer = experienceState.pointer;

      curve.getPointAt(Math.min(1, progress), cameraPoint);
      curve.getPointAt(Math.min(1, progress + 0.045), lookPoint);

      cameraTarget.copy(cameraPoint);
      cameraTarget.x += (experienceState.reducedMotion ? 0 : pointer.smoothNdcX) * 0.18;
      cameraTarget.y += (experienceState.reducedMotion ? 0 : pointer.smoothNdcY) * 0.12;
      camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 5.2));

      lookPoint.x += pointer.smoothNdcX * 0.34;
      lookPoint.y += pointer.smoothNdcY * 0.2;
      camera.lookAt(lookPoint);

      uniforms.uTime.value = experienceState.reducedMotion ? 0 : elapsed;
      uniforms.uProgress.value = progress;
      uniforms.uEnergy.value = scrollEnergy + pointer.smoothSpeed * 0.45;
      uniforms.uDissolve.value = exitProgress;

      scene.fog!.color.lerpColors(new THREE.Color(0xb9d9ff), new THREE.Color(0xcadfdf), THREE.MathUtils.smoothstep(progress, 0.68, 1));
      sparksMaterial.opacity = (1 - exitProgress) * 0.45;
      sparkField.rotation.y = elapsed * 0.006;

      scrollEnergy = THREE.MathUtils.damp(scrollEnergy, 0, 3.6, delta);
      renderer.render(scene, camera);

      if (exitProgress >= 1) {
        visible = false;
        root.style.display = "none";
      }
    };
    renderer.setAnimationLoop(animate);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      renderer.setAnimationLoop(visible && documentVisible ? animate : null);
    }, { threshold: 0.01 });
    const onVisibility = () => {
      documentVisible = !document.hidden;
      renderer.setAnimationLoop(visible && documentVisible ? animate : null);
    };
    observer.observe(root);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("kingshill:render-scale", resize);
    document.addEventListener("visibilitychange", onVisibility);
    updateScroll();
    resize();
    renderer.compileAsync(scene, camera).catch(() => undefined).finally(() => experienceState.markReady("cloud"));

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("kingshill:render-scale", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      meshes.forEach((mesh) => mesh.geometry.dispose());
      material.dispose();
      texture.dispose();
      sparksGeometry.dispose();
      sparksMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="kh-cloud-prelude kh-cloud-prelude--fixed" aria-hidden="true">
      <div className="kh-cloud-prelude__sticky">
        <div className="kh-cloud-prelude__sky" />
        <canvas ref={canvasRef} />

        <div className="kh-cloud-prelude__veil" />
      </div>
    </div>
  );
};

export default CloudPrelude;
