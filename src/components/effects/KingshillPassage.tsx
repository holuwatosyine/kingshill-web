import { Canvas, createPortal, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, useFBO, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import { experienceState } from "@/experience/state";
const AboutImage = "/IMG-20250827-WA0019.webp";
import CommunityImage from "@/assets/img-20250827-wa0023.jpg";
import LeadersImage from "@/assets/img-20250827-wa0020-1.jpg";
import "./KingshillPassage.css";

const LENS_MODEL = "/material-lab/lens-transformed.glb";

type LensGLTF = GLTF & { nodes: { Cylinder: THREE.Mesh } };

type PassageKeyframe = {
  progress: number;
  x: number;
  y: number;
  scale: number;
  rotationX: number;
  rotationY: number;
};

const keyframes: PassageKeyframe[] = [
  { progress: 0, x: -2.0, y: 0.1, scale: 0.68, rotationX: Math.PI / 2, rotationY: -0.08 },
  { progress: 0.34, x: 1.55, y: -0.3, scale: 0.92, rotationX: Math.PI / 2 + 0.12, rotationY: 0.18 },
  { progress: 0.66, x: -1.35, y: 0.24, scale: 1.04, rotationX: Math.PI / 2 - 0.08, rotationY: -0.22 },
  { progress: 1, x: 1.25, y: -0.18, scale: 0.76, rotationX: Math.PI / 2 + 0.05, rotationY: 0.16 },
];

const imageVertex = `
  uniform float shift;
  varying vec2 vUv;
  void main() {
    vec3 pos = position;
    pos.y += sin(uv.x * 3.14159265) * shift * 0.045;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const imageFragment = `
  uniform sampler2D map;
  uniform float shift;
  uniform float zoom;
  uniform float opacity;
  uniform vec3 tint;
  varying vec2 vUv;
  void main() {
    float angle = 1.55;
    vec2 p = (vUv - vec2(0.5)) * (1.0 - zoom) + vec2(0.5);
    vec2 rgbShift = shift * 0.018 * vec2(cos(angle), sin(angle));
    vec4 red = texture2D(map, p + rgbShift);
    vec4 green = texture2D(map, p);
    vec4 blue = texture2D(map, p - rgbShift);
    vec3 color = vec3(red.r, green.g, blue.b) * tint;
    gl_FragColor = vec4(color, green.a * opacity);
  }
`;

function makeImageMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    vertexShader: imageVertex,
    fragmentShader: imageFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: texture },
      shift: { value: 0 },
      zoom: { value: 0 },
      opacity: { value: 0 },
      tint: { value: new THREE.Color("#ffffff") },
    },
  });
}

function lerpKeyframe(progress: number) {
  const nextIndex = Math.min(keyframes.length - 1, Math.ceil(progress * (keyframes.length - 1)));
  const previous = keyframes[Math.max(0, nextIndex - 1)];
  const next = keyframes[nextIndex];
  const range = Math.max(0.0001, next.progress - previous.progress);
  const local = THREE.MathUtils.smoothstep((progress - previous.progress) / range, 0, 1);
  return {
    x: THREE.MathUtils.lerp(previous.x, next.x, local),
    y: THREE.MathUtils.lerp(previous.y, next.y, local),
    scale: THREE.MathUtils.lerp(previous.scale, next.scale, local),
    rotationX: THREE.MathUtils.lerp(previous.rotationX, next.rotationX, local),
    rotationY: THREE.MathUtils.lerp(previous.rotationY, next.rotationY, local),
  };
}

function avoidReadableCopy(focus: ReturnType<typeof lerpKeyframe>, lensViewport: { width: number; height: number }, worldScale: number, camera: THREE.Camera) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const projected = new THREE.Vector3(focus.x * worldScale, focus.y * worldScale, 4.5).project(camera);
  const desired = {
    x: (projected.x * 0.5 + 0.5) * viewportWidth,
    y: (-projected.y * 0.5 + 0.5) * viewportHeight,
  };
  const projectedRadius = new THREE.Vector3(focus.x * worldScale + focus.scale * worldScale * 0.48, focus.y * worldScale, 4.5).project(camera);
  const lensRadius = Math.max(24, Math.abs(projectedRadius.x - projected.x) * viewportWidth * 0.8);
  const copyRects = Array.from(document.querySelectorAll<HTMLElement>("#contact .kh2-testimonial blockquote, #contact .kh2-testimonial footer, #contact .kh2-stats"))
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.bottom > -24 && rect.top < viewportHeight + 24 && rect.width > 0 && rect.height > 0);
  if (!copyRects.length) return focus;

  const candidates = [
    desired,
    { x: desired.x, y: desired.y - lensRadius * 2.5 },
    { x: desired.x, y: desired.y + lensRadius * 2.5 },
    { x: desired.x - lensRadius * 2.8, y: desired.y },
    { x: desired.x + lensRadius * 2.8, y: desired.y },
    ...[0.18, 0.5, 0.82].flatMap((x) => [0.14, 0.3, 0.5, 0.7, 0.86].map((y) => ({ x: viewportWidth * x, y: viewportHeight * y }))),
  ].map((candidate) => ({
    x: THREE.MathUtils.clamp(candidate.x, lensRadius + 10, viewportWidth - lensRadius - 10),
    y: THREE.MathUtils.clamp(candidate.y, lensRadius + 10, viewportHeight - lensRadius - 10),
  }));

  const score = (candidate: { x: number; y: number }) => {
    const overlap = copyRects.reduce((total, rect) => {
      const width = Math.max(0, Math.min(candidate.x + lensRadius, rect.right + 14) - Math.max(candidate.x - lensRadius, rect.left - 14));
      const height = Math.max(0, Math.min(candidate.y + lensRadius, rect.bottom + 14) - Math.max(candidate.y - lensRadius, rect.top - 14));
      return total + width * height;
    }, 0);
    const distance = Math.hypot(candidate.x - desired.x, candidate.y - desired.y);
    return overlap * 100 + distance;
  };
  const safe = candidates.reduce((best, candidate) => score(candidate) < score(best) ? candidate : best);
  const blocked = score(safe) > lensRadius * lensRadius * 0.12;
  return {
    ...focus,
    blocked,
    x: new THREE.Vector3((safe.x / viewportWidth) * 2 - 1, 0, projected.z).unproject(camera).x / Math.max(0.001, worldScale),
    y: new THREE.Vector3(0, 1 - (safe.y / viewportHeight) * 2, projected.z).unproject(camera).y / Math.max(0.001, worldScale),
  };
}

function PassageWorld() {
  const lensRef = useRef<THREE.Mesh>(null);
  const lensMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const focusGroup = useRef<THREE.Group>(null);
  const buffer = useFBO({ samples: experienceState.quality === "high" ? 4 : 2, depthBuffer: true });
  const textures = useLoader(THREE.TextureLoader, [AboutImage, CommunityImage, LeadersImage]);
  const materials = useMemo(() => textures.map(makeImageMaterial), [textures]);
  const { nodes } = useGLTF(LENS_MODEL) as unknown as LensGLTF;
  const { camera, gl } = useThree();
  const [portalScene] = useState(() => new THREE.Scene());
  const portalCamera = useMemo(() => camera.clone(), [camera]);
  const currentProgress = useRef(0);
  const currentVelocity = useRef(0);
  const lensTargetColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const about = document.querySelector<HTMLElement>("#perspective");
    const training = document.querySelector<HTMLElement>("#programmes");
    const proof = document.querySelector<HTMLElement>("#contact .kh2-proof");
    if (!about || !training || !proof) return;

    const scroll = experienceState.scroll.current || window.scrollY;
    const aboutStart = about.getBoundingClientRect().top + scroll;
    const trainingRect = training.getBoundingClientRect();
    const proofStart = proof.getBoundingClientRect().top + scroll;
    const proofEnd = proof.getBoundingClientRect().bottom + scroll;
    const start = aboutStart - window.innerHeight * 0.25;
    const end = proofEnd - window.innerHeight * 0.62;
    const targetProgress = THREE.MathUtils.clamp((scroll - start) / Math.max(1, end - start), 0, 1);
    const active = scroll >= start - window.innerHeight * 0.2 && scroll <= end + window.innerHeight * 0.55;
    const passageVisible = active;
    gl.domElement.style.opacity = passageVisible ? "1" : "0";
    gl.domElement.style.visibility = passageVisible ? "visible" : "hidden";
    gl.domElement.style.display = passageVisible ? "block" : "none";
    currentProgress.current = THREE.MathUtils.damp(currentProgress.current, targetProgress, 5, delta);
    currentVelocity.current = THREE.MathUtils.damp(
      currentVelocity.current,
      Math.min(1, Math.abs(experienceState.scroll.velocity) / 180 + experienceState.chapter.energy * 0.12),
      9,
      delta,
    );

    const lensViewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 4.5]);
    const worldScale = lensViewport.width / 11;
    const focus = avoidReadableCopy(lerpKeyframe(currentProgress.current), lensViewport, worldScale, state.camera);
    const pointerX = experienceState.pointer.smoothNdcX * lensViewport.width * 0.08;
    const pointerY = experienceState.pointer.smoothNdcY * lensViewport.height * 0.08;

    if (focusGroup.current) {
      focusGroup.current.visible = active && !focus.blocked;
      focusGroup.current.position.x = THREE.MathUtils.damp(focusGroup.current.position.x, focus.x * worldScale + pointerX, 5, delta);
      focusGroup.current.position.y = THREE.MathUtils.damp(focusGroup.current.position.y, focus.y * worldScale + pointerY, 5, delta);
      focusGroup.current.scale.setScalar(THREE.MathUtils.damp(focusGroup.current.scale.x, focus.scale * worldScale * (1 + experienceState.chapter.energy * 0.06), 5, delta));
      focusGroup.current.rotation.x = THREE.MathUtils.damp(focusGroup.current.rotation.x, focus.rotationX - experienceState.pointer.smoothNdcY * 0.14, 4, delta);
      focusGroup.current.rotation.y = THREE.MathUtils.damp(focusGroup.current.rotation.y, focus.rotationY + experienceState.pointer.smoothNdcX * 0.24, 4, delta);
    }

    const aboutWeight = 1 - THREE.MathUtils.smoothstep(currentProgress.current, 0.05, 0.32);
    const trainingWeight = THREE.MathUtils.smoothstep(currentProgress.current, 0.18, 0.55) * (1 - THREE.MathUtils.smoothstep(currentProgress.current, 0.55, 0.82));
    const alumniWeight = THREE.MathUtils.smoothstep(currentProgress.current, 0.68, 0.98);
    const weights = [aboutWeight, trainingWeight, alumniWeight];
    materials.forEach((material, index) => {
      material.uniforms.opacity.value = THREE.MathUtils.damp(material.uniforms.opacity.value, active ? weights[index] : 0, 5, delta);
      material.uniforms.shift.value = THREE.MathUtils.damp(material.uniforms.shift.value, experienceState.scroll.velocity / 120 + experienceState.pointer.smoothDeltaX * 2.5 + experienceState.chapter.energy * 0.08, 8, delta);
      material.uniforms.zoom.value = THREE.MathUtils.damp(material.uniforms.zoom.value, currentVelocity.current * 0.18 + experienceState.chapter.energy * 0.04, 8, delta);
      const tint = index === 1 ? "#e8f8f1" : index === 2 ? "#edf0e7" : "#ffffff";
      material.uniforms.tint.value.lerp(new THREE.Color(tint), 1 - Math.pow(0.001, delta));
    });

    const trainingMix = THREE.MathUtils.smoothstep(currentProgress.current, 0.22, 0.52);
    const alumniMix = THREE.MathUtils.smoothstep(currentProgress.current, 0.66, 0.96);
    lensTargetColor.set("#f1faf5").lerp(new THREE.Color("#bde7dc"), trainingMix).lerp(new THREE.Color("#e5eee9"), alumniMix);
    if (lensMaterialRef.current) lensMaterialRef.current.color.lerp(lensTargetColor, 1 - Math.pow(0.001, delta * 1.6));

    portalCamera.position.copy(camera.position);
    portalCamera.quaternion.copy(camera.quaternion);
    portalCamera.zoom = camera.zoom;
    portalCamera.updateProjectionMatrix();
    gl.setRenderTarget(buffer);
    gl.setClearColor("#f0f0f0", 1);
    gl.clear(true, true, true);
    gl.render(portalScene, portalCamera);
    gl.setRenderTarget(null);
    gl.setClearColor("#000000", 0);

  });

  return (
    <>
      {createPortal(
        <group>
          <mesh position={[0, 0, 0]} scale={[12, 7, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <primitive object={materials[0]} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.02]} scale={[12, 7, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <primitive object={materials[1]} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.04]} scale={[12, 7, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <primitive object={materials[2]} attach="material" />
          </mesh>
        </group>,
        portalScene,
      )}
      <group ref={focusGroup}>
        <mesh ref={lensRef} geometry={nodes.Cylinder.geometry} position={[0, 0, 4.5]} rotation-x={Math.PI / 2} castShadow>
          <MeshTransmissionMaterial
            ref={lensMaterialRef}
            buffer={buffer.texture}
            ior={1.2}
            thickness={1.5}
            anisotropy={0.1}
            chromaticAberration={0.018}
            roughness={0.075}
            transmission={1}
            backside
            samples={experienceState.quality === "high" ? 10 : experienceState.quality === "medium" ? 6 : 4}
            resolution={experienceState.quality === "high" ? 768 : experienceState.quality === "medium" ? 512 : 384}
            color="#f1fff8"
          />
        </mesh>
      </group>
    </>
  );
}

export default function KingshillPassage() {
  const [renderScale, setRenderScale] = useState(experienceState.renderScale);
  useEffect(() => {
    const onRenderScale = (event: Event) => setRenderScale((event as CustomEvent<{ scale: number }>).detail.scale);
    window.addEventListener("kingshill:render-scale", onRenderScale);
    return () => window.removeEventListener("kingshill:render-scale", onRenderScale);
  }, []);

  return (
    <div className="kh-passage-layer" aria-hidden="true">
      <Canvas
        dpr={[1, (experienceState.quality === "high" ? 1.5 : experienceState.quality === "medium" ? 1.25 : 1.1) * renderScale]}
        camera={{ position: [0, 0, 8], fov: 30 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} color="#edf3ec" />
        <directionalLight position={[-3, 5, 5]} intensity={1.8} color="#f8f8ef" />
        <directionalLight position={[4, 1, -2]} intensity={0.72} color="#b9d9d1" />
        <Environment resolution={experienceState.quality === "high" ? 256 : 128} environmentIntensity={0.68}>
          <Lightformer form="rect" intensity={2.4} position={[0, 4, -4]} scale={[6, 2, 1]} color="#f8f8ef" />
          <Lightformer form="rect" intensity={1.15} position={[-4, 1, -1]} rotation-y={Math.PI / 2} scale={[3, 5, 1]} color="#d4e8e3" />
          <Lightformer form="rect" intensity={0.72} position={[4, -1, 2]} rotation-y={-Math.PI / 2} scale={[2, 4, 1]} color="#a7cfc6" />
        </Environment>
        <PassageWorld />
      </Canvas>
    </div>
  );
}

useGLTF.preload(LENS_MODEL);
