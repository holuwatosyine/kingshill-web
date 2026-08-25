import { Canvas, useFrame, useLoader, useThree, type ThreeElements } from "@react-three/fiber";
import {
  AccumulativeShadows,
  CameraControls,
  Caustics,
  Center,
  ContactShadows,
  CubeCamera,
  Environment,
  Lightformer,
  MeshDistortMaterial,
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
  RandomizedLight,
  useCubeTexture,
  useTexture,
  Text3D,
  useGLTF,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Link } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import type { FontData, GLTF } from "three-stdlib";
import fontGlyphs from "./Inter_Medium_Regular.json";
import heroBackdrop from "../assets/graduates-hero.png";
import aboutBackdrop from "../assets/corporate-training.png";
import trainingBackdrop from "../assets/youth-program.png";
import "./materialLab.css";

type PresetKey = "clear" | "frosted" | "resin" | "diamond" | "bubbles";
type ShapeKey = "mineral" | "lens" | "keystone";
type BackgroundKey = "ink" | "paper";
type LabMode = "reference" | "morph" | "world";

const FLOWER_MODEL = "/material-lab/flower-transformed.glb";
const SHOE_MODEL = "/material-lab/nike-air-zoom-pegasus-36.glb";
const DIAMOND_MODEL = "/material-lab/dflat.glb";
const LENS_MODEL = "/material-lab/lens-transformed.glb";
const AERO_HDR = "/material-lab/aerodynamics_workshop_1k.hdr";
const BLUE_STUDIO_HDR = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_photo_studio_1k.hdr";

const PRESETS: Record<PresetKey, { label: string; source: string; description: string; props: Record<string, number | string | boolean> }> = {
  clear: {
    label: "Glass flower",
    source: "glass-flower / original GLB",
    description: "The original transformed flower geometry with the demo’s layered transmission, iridescence, studio HDR, and post stack.",
    props: { transmission: 1, thickness: 0.2, roughness: 0.08, ior: 1.45, chromaticAberration: 0.015, anisotropicBlur: 0.06, distortion: 0, distortionScale: 0.1, temporalDistortion: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.5 },
  },
  frosted: {
    label: "Frosted Nike",
    source: "frosted-glass / original GLB",
    description: "The original Nike Air Zoom Pegasus model, city environment, floating motion, transmission disc, and contact-shadow floor.",
    props: { transmission: 1, thickness: 0.1, roughness: 0.4, ior: 1.45, chromaticAberration: 0, anisotropicBlur: 0.1, distortion: 0, distortionScale: 0.2, temporalDistortion: 0, clearcoat: 0.18, clearcoatRoughness: 0.2, envMapIntensity: 0.7 },
  },
  resin: {
    label: "Inter resin",
    source: "inter-epoxy-resin / original font",
    description: "The original Inter text construction with bevels, HDR-backed transmission, internal distortion, and the demo’s controlled shadow context.",
    props: { transmission: 1, thickness: 0.3, roughness: 0.04, ior: 1.5, chromaticAberration: 0.025, anisotropicBlur: 0.06, distortion: 0.5, distortionScale: 0.1, temporalDistortion: 0.025, clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 0.85 },
  },
  diamond: {
    label: "D-flat diamond",
    source: "diamond-refraction / original GLB",
    description: "The original d-flat diamond with high-IOR MeshRefractionMaterial, cube-camera capture, caustics, and accumulative shadows.",
    props: { transmission: 1, thickness: 1, roughness: 0.02, ior: 2.75, chromaticAberration: 0.01, anisotropicBlur: 0, distortion: 0.1, distortionScale: 0.1, temporalDistortion: 0, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1 },
  },
  bubbles: {
    label: "Bubbles / cursor study",
    source: "bubbles / original cube map + bump",
    description: "The pmndrs bubbles material is a cursor-responsive, metal-distorted icosahedron system driven by a shared cube map and bump texture. This is a motion/material study, not a proposed homepage artifact.",
    props: { transmission: 0, thickness: 0, roughness: 0.1, ior: 1.45, chromaticAberration: 0, anisotropicBlur: 0, distortion: 0.4, distortionScale: 0.1, temporalDistortion: 0, clearcoat: 1, clearcoatRoughness: 1, envMapIntensity: 3 },
  },
};

const SHAPES: Record<ShapeKey, { label: string; detail: string }> = {
  mineral: { label: "Mineral core", detail: "tall faceted body" },
  lens: { label: "Architectural lens", detail: "clear capsule" },
  keystone: { label: "Training keystone", detail: "wide faceted body" },
};

const BACKGROUNDS: Record<BackgroundKey, { label: string; color: string; text: string }> = {
  ink: { label: "Ink", color: "#061426", text: "#eef3ec" },
  paper: { label: "Paper", color: "#edf0ea", text: "#061426" },
};

const DEMOS: Array<{ key: PresetKey; label: string; shape: ShapeKey }> = [
  { key: "clear", label: "glass-flower", shape: "mineral" },
  { key: "frosted", label: "frosted-glass", shape: "lens" },
  { key: "resin", label: "inter-epoxy-resin", shape: "keystone" },
  { key: "diamond", label: "diamond-refraction", shape: "mineral" },
  { key: "bubbles", label: "bubbles / cursor", shape: "lens" },
];

type FlowerGLTF = GLTF & { nodes: { petals: THREE.Mesh; Sphere: THREE.Mesh; Sphere001: THREE.Mesh } };
type ShoeGLTF = GLTF & { nodes: { defaultMaterial: THREE.Mesh }; materials: { NikeShoe: THREE.MeshStandardMaterial } };
type DiamondGLTF = GLTF & { nodes: { Diamond_1_0: THREE.Mesh } };
type LensGLTF = GLTF & { nodes: { Cylinder: THREE.Mesh } };

function MorphingArtifact({ progress, showInner, rotationPaused }: { progress: number; showInner: boolean; rotationPaused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const base = new THREE.SphereGeometry(1.18, 64, 48);
    const position = base.attributes.position;
    const lens = position.clone();
    const keystone = position.clone();
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      const width = 1 - 0.24 * Math.pow(Math.abs(y) / 1.18, 1.6);
      lens.setXYZ(i, x * width * 0.84, y * 1.48, z * width * 0.84);
      const pinch = 1 - 0.2 * Math.pow(Math.abs(y) / 1.18, 1.8);
      keystone.setXYZ(i, x * 1.42 * pinch, y * 0.74, z * 0.94 * pinch);
    }
    base.morphAttributes.position = [lens, keystone];
    base.morphTargetsRelative = false;
    return base;
  }, []);
  const color = useMemo(() => {
    const next = new THREE.Color("#eef3ec");
    if (progress < 0.5) next.lerp(new THREE.Color("#a9d4d0"), progress * 2);
    else next.lerpColors(new THREE.Color("#a9d4d0"), new THREE.Color("#2f8290"), (progress - 0.5) * 2);
    return next.getStyle();
  }, [progress]);
  const transmission = progress < 0.5 ? THREE.MathUtils.lerp(0.96, 0.9, progress * 2) : THREE.MathUtils.lerp(0.9, 0.78, (progress - 0.5) * 2);
  const roughness = progress < 0.5 ? THREE.MathUtils.lerp(0.08, 0.2, progress * 2) : THREE.MathUtils.lerp(0.2, 0.16, (progress - 0.5) * 2);
  const thickness = progress < 0.5 ? THREE.MathUtils.lerp(0.14, 0.2, progress * 2) : THREE.MathUtils.lerp(0.2, 0.38, (progress - 0.5) * 2);

  useFrame((_, delta) => {
    if (!group.current || rotationPaused) return;
    group.current.rotation.y += delta * 0.15;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.08, 3, delta);
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <mesh geometry={geometry} morphTargetInfluences={[Math.min(1, progress * 2), Math.max(0, (progress - 0.5) * 2)]} castShadow receiveShadow>
        <MeshTransmissionMaterial backside samples={8} resolution={512} color={color} transmission={transmission} thickness={thickness} roughness={roughness} ior={1.45} chromaticAberration={0.012} anisotropicBlur={0.06} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={0.55} distortion={0.02} distortionScale={0.08} temporalDistortion={0.006} />
      </mesh>
      {showInner && <mesh scale={progress < 0.5 ? 0.58 : 0.5} castShadow><icosahedronGeometry args={[0.72, 3]} /><meshPhysicalMaterial color={progress < 0.5 ? "#092440" : "#0d454b"} roughness={0.18} metalness={0.34} clearcoat={1} clearcoatRoughness={0.1} /></mesh>}
    </group>
  );
}

function GlassFlowerReference({ rotationPaused }: { rotationPaused: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { nodes } = useGLTF(FLOWER_MODEL) as unknown as FlowerGLTF;
  useFrame((_, delta) => {
    if (!rotationPaused && ref.current) ref.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={ref} position={[0, -0.25, 0]} scale={1.05}>
      <mesh geometry={nodes.petals.geometry} castShadow receiveShadow>
        <MeshTransmissionMaterial backside backsideThickness={1} samples={16} thickness={0.2} anisotropicBlur={0.1} iridescence={1} iridescenceIOR={1} iridescenceThicknessRange={[0, 1400]} clearcoat={1} envMapIntensity={0.5} />
        <mesh geometry={nodes.Sphere.geometry}>
          <MeshTransmissionMaterial samples={6} resolution={512} thickness={-1} anisotropy={0.25} />
        </mesh>
      </mesh>
      <mesh geometry={nodes.Sphere001.geometry}>
        <meshStandardMaterial toneMapped={false} emissive="hotpink" color="red" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function FrostedShoeReference({ rotationPaused }: { rotationPaused: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(SHOE_MODEL) as unknown as ShoeGLTF;
  useFrame((state) => {
    if (rotationPaused || !ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 3) / 4, 0.15 + Math.sin(t / 2) / 8);
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7;
  });
  return (
    <group ref={ref}>
      <mesh receiveShadow castShadow geometry={nodes.defaultMaterial.geometry} material={materials.NikeShoe} rotation={[0.3, Math.PI / 1.6, 0]} scale={1.15} />
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.84, 64]} />
        <MeshTransmissionMaterial samples={8} resolution={512} anisotropicBlur={0.1} thickness={0.1} roughness={0.4} toneMapped />
      </mesh>
    </group>
  );
}

function InterResinReference({ rotationPaused }: { rotationPaused: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const hdr = useLoader(RGBELoader, AERO_HDR);
  useFrame((_, delta) => {
    if (!rotationPaused && ref.current) ref.current.rotation.y += delta * 0.08;
  });
  return (
    <group ref={ref} position={[0, -0.3, 0]} rotation={[0, 0.05, 0]}>
      <Center scale={[0.8, 1, 1]} front top>
        <Text3D font={fontGlyphs as unknown as FontData} scale={3.1} letterSpacing={-0.03} height={0.25} bevelEnabled bevelSize={0.01} bevelSegments={10} curveSegments={96} bevelThickness={0.01}>
          Inter
          <MeshTransmissionMaterial backside backsideThickness={0.3} samples={16} resolution={512} transmission={1} clearcoat={1} thickness={0.3} chromaticAberration={0.025} anisotropy={0.3} roughness={0} distortion={0.5} distortionScale={0.1} temporalDistortion={0} ior={1.5} background={hdr} />
        </Text3D>
      </Center>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]} receiveShadow>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#aab4b0" roughness={0.78} metalness={0.04} />
      </mesh>
    </group>
  );
}

function DiamondReference({ rotationPaused }: { rotationPaused: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF(DIAMOND_MODEL) as unknown as DiamondGLTF;
  const hdr = useLoader(RGBELoader, AERO_HDR);
  useFrame((_, delta) => {
    if (!rotationPaused && ref.current) ref.current.rotation.y += delta * 0.09;
  });
  return (
    <CubeCamera resolution={256} frames={1} envMap={hdr}>
      {(texture) => (
        <Caustics causticsOnly={false} backside={false} color="#d8f1ed" position={[0, -0.58, 0]} lightSource={[5, 5, -10]} worldRadius={0.1} ior={1.8} intensity={0.1}>
          <mesh ref={ref} castShadow receiveShadow geometry={nodes.Diamond_1_0.geometry} rotation={[0, 0, 0.715]} position={[0, 0.2, 0]} scale={1.32}>
            <MeshRefractionMaterial envMap={texture} bounces={3} ior={2.75} fresnel={1} aberrationStrength={0.01} toneMapped={false} />
          </mesh>
        </Caustics>
      )}
    </CubeCamera>
  );
}

const BUBBLE_POSITIONS: Array<[number, number, number]> = [
  [-2.1, 1.35, -1.6],
  [-2.6, 0.25, -0.8],
  [-1.9, -1.25, -1.2],
  [2.25, -0.7, -1.2],
  [2.45, 0.95, -1.9],
  [1.45, 1.8, -2.3],
  [1.9, -1.7, -2.1],
  [-0.1, 2.15, -2.6],
];

function BubblesReference({ rotationPaused }: { rotationPaused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const main = useRef<THREE.Mesh>(null);
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bumpMap = useTexture("/material-lab/bubbles/bump.jpg");
  const envMap = useCubeTexture(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"], { path: "/material-lab/bubbles/cube/" });
  const [material, setMaterial] = useState<THREE.Material | null>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -state.pointer.x * Math.PI / 6, 2.75, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, state.pointer.y * Math.PI / 12, 2.75, delta);
    }
    if (main.current && !rotationPaused) {
      main.current.rotation.z += delta * 0.55;
      main.current.rotation.y = THREE.MathUtils.damp(main.current.rotation.y, state.pointer.x * Math.PI, 2.75, delta);
      main.current.rotation.x = THREE.MathUtils.damp(main.current.rotation.x, state.pointer.y * Math.PI, 2.75, delta);
    }
    if (!rotationPaused) {
      sphereRefs.current.forEach((mesh, index) => {
        if (!mesh) return;
        const t = state.clock.elapsedTime * (0.13 + index * 0.012) + index * 1.7;
        mesh.position.y += delta * 0.055;
        if (mesh.position.y > 2.8) mesh.position.y = -2.8;
        mesh.rotation.x += delta * 0.7;
        mesh.rotation.y += delta * 0.8;
        mesh.rotation.z += delta * 0.25;
        mesh.scale.setScalar(0.18 + (Math.cos(t) + 1) * 0.055);
      });
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <MeshDistortMaterial ref={setMaterial} envMap={envMap} envMapIntensity={3} bumpMap={bumpMap} color="#d9e8e4" roughness={0.1} metalness={1} bumpScale={0.1} clearcoat={1} clearcoatRoughness={1} radius={1} distort={0.4} />
      {material && <>
        <mesh ref={main} material={material} castShadow receiveShadow>
          <icosahedronGeometry args={[1.08, 12]} />
        </mesh>
        {BUBBLE_POSITIONS.map((position, index) => <mesh key={index} ref={(mesh) => { sphereRefs.current[index] = mesh; }} material={material} position={position} scale={0.28} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 4]} />
        </mesh>)}
      </>}
    </group>
  );
}

function StatefulWorld({ progress, showInner, rotationPaused }: { progress: number; showInner: boolean; rotationPaused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const lensGroup = useRef<THREE.Group>(null);
  const diamondGroup = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const fillLight = useRef<THREE.DirectionalLight>(null);
  const ground = useRef<THREE.Mesh>(null);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const { nodes: lensNodes } = useGLTF(LENS_MODEL) as unknown as LensGLTF;
  const { nodes: diamondNodes } = useGLTF(DIAMOND_MODEL) as unknown as DiamondGLTF;
  const [heroTexture, aboutTexture, trainingTexture] = useTexture([heroBackdrop, aboutBackdrop, trainingBackdrop]);
  const geometry = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1.18, 2);
    const position = base.attributes.position;
    const lens = position.clone();
    const keystone = position.clone();
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      const width = 1 - 0.24 * Math.pow(Math.abs(y) / 1.18, 1.6);
      lens.setXYZ(i, x * width * 0.84, y * 1.48, z * width * 0.84);
      const pinch = 1 - 0.2 * Math.pow(Math.abs(y) / 1.18, 1.8);
      keystone.setXYZ(i, x * 1.42 * pinch, y * 0.74, z * 0.94 * pinch);
    }
    base.morphAttributes.position = [lens, keystone];
    base.morphTargetsRelative = false;
    return base;
  }, []);
  const first = Math.min(1, progress * 2);
  const second = Math.max(0, (progress - 0.5) * 2);
  const objectColor = useMemo(() => {
    if (progress < 0.5) return new THREE.Color("#eef3ec").lerp(new THREE.Color("#a9d4d0"), first).getStyle();
    return new THREE.Color("#a9d4d0").lerp(new THREE.Color("#55a7ad"), second).getStyle();
  }, [first, progress, second]);
  const floorColor = useMemo(() => new THREE.Color("#d7e4df").lerp(new THREE.Color("#286975"), progress).getStyle(), [progress]);
  const bgColor = useMemo(() => {
    if (progress < 0.5) return new THREE.Color("#061426").lerp(new THREE.Color("#edf0ea"), first).getStyle();
    return new THREE.Color("#edf0ea").lerp(new THREE.Color("#071c2b"), second).getStyle();
  }, [first, progress, second]);

  useFrame((state, delta) => {
    const targetY = -state.pointer.x * 0.28;
    const targetX = state.pointer.y * 0.16;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3.8, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3.8, delta);
      group.current.scale.setScalar(THREE.MathUtils.lerp(1.04, progress < 0.5 ? 0.92 : 1.12, progress));
      if (!rotationPaused) group.current.rotation.z += delta * THREE.MathUtils.lerp(0.06, 0.12, progress);
    }
    [lensGroup.current, diamondGroup.current].forEach((node) => {
      if (node) {
        node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetY * 0.72, 3.4, delta);
        node.rotation.x = THREE.MathUtils.damp(node.rotation.x, targetX * 0.72, 3.4, delta);
        if (!rotationPaused) node.rotation.z += delta * 0.05;
      }
    });
    if (keyLight.current) {
      keyLight.current.intensity = THREE.MathUtils.lerp(3.5, progress < 0.5 ? 2.4 : 3.8, progress);
      keyLight.current.color.lerpColors(new THREE.Color("#f5f7f1"), new THREE.Color("#d8f0ea"), progress);
    }
    if (fillLight.current) {
      fillLight.current.intensity = THREE.MathUtils.lerp(1.2, 2.25, progress);
      fillLight.current.color.lerpColors(new THREE.Color("#1c7180"), new THREE.Color("#071d36"), progress);
    }
    if (ground.current && ground.current.material instanceof THREE.MeshStandardMaterial) {
      ground.current.material.color.set(floorColor);
      ground.current.material.roughness = THREE.MathUtils.lerp(0.68, 0.42, progress);
    }
    scene.background = new THREE.Color(bgColor);
    if (scene.fog) scene.fog.color.set(bgColor);
    camera.position.lerp(new THREE.Vector3(0.18 * progress, 0.08 * progress, THREE.MathUtils.lerp(4.65, 4.15, progress)), 1 - Math.pow(0.001, delta));
    camera.lookAt(0, progress < 0.5 ? 0.08 : -0.02, 0);
  });

  const transmission = THREE.MathUtils.lerp(0.96, 0.86, progress);
  const roughness = progress < 0.5 ? THREE.MathUtils.lerp(0.1, 0.25, first) : THREE.MathUtils.lerp(0.25, 0.17, second);
  const thickness = THREE.MathUtils.lerp(0.16, 0.34, progress);
  const coreOpacity = 1 - THREE.MathUtils.smoothstep(progress, 0.18, 0.42);
  const lensOpacity = THREE.MathUtils.smoothstep(progress, 0.26, 0.46) * (1 - THREE.MathUtils.smoothstep(progress, 0.55, 0.74));
  const diamondOpacity = THREE.MathUtils.smoothstep(progress, 0.62, 0.84);
  const heroBackdropOpacity = 1 - THREE.MathUtils.smoothstep(progress, 0.16, 0.42);
  const aboutBackdropOpacity = THREE.MathUtils.smoothstep(progress, 0.28, 0.48) * (1 - THREE.MathUtils.smoothstep(progress, 0.55, 0.74));
  const trainingBackdropOpacity = THREE.MathUtils.smoothstep(progress, 0.64, 0.86);

  return (
    <>
      <group position={[0, 0.6, -4.2]} scale={[1.15, 1.15, 1]}>
        <mesh>
          <planeGeometry args={[10, 6.2]} />
          <meshBasicMaterial map={heroTexture} transparent opacity={heroBackdropOpacity * 0.34} toneMapped={false} />
        </mesh>
        <mesh>
          <planeGeometry args={[10, 6.2]} />
          <meshBasicMaterial map={aboutTexture} transparent opacity={aboutBackdropOpacity * 0.34} toneMapped={false} />
        </mesh>
        <mesh>
          <planeGeometry args={[10, 6.2]} />
          <meshBasicMaterial map={trainingTexture} transparent opacity={trainingBackdropOpacity * 0.34} toneMapped={false} />
        </mesh>
      </group>
      <group ref={group} position={[0, 0.06, 0]}>
        <mesh geometry={geometry} morphTargetInfluences={[first, second]} castShadow receiveShadow>
          <MeshTransmissionMaterial transparent opacity={coreOpacity} backside samples={10} resolution={512} color={objectColor} transmission={transmission} thickness={thickness} roughness={roughness} ior={1.46} chromaticAberration={0.006} anisotropicBlur={0.08} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={0.7} distortion={0.015} distortionScale={0.06} temporalDistortion={0.003} />
        </mesh>
        {showInner && <mesh scale={progress < 0.5 ? 0.56 : 0.48} castShadow><icosahedronGeometry args={[0.72, 3]} /><meshPhysicalMaterial color={progress < 0.5 ? "#092440" : "#0d454b"} roughness={0.2} metalness={0.3} clearcoat={1} clearcoatRoughness={0.12} /></mesh>}
      </group>
      <group ref={lensGroup} position={[0, -0.08, 0]} scale={0.62}>
        <mesh geometry={lensNodes.Cylinder.geometry} rotation-x={Math.PI / 2} castShadow receiveShadow>
          <MeshTransmissionMaterial transparent opacity={lensOpacity} backside samples={10} resolution={512} color="#b9dcd7" transmission={0.98} thickness={1.2} roughness={0.2} ior={1.2} chromaticAberration={0.008} anisotropicBlur={0.1} clearcoat={1} envMapIntensity={0.7} />
        </mesh>
      </group>
      <group ref={diamondGroup} position={[0, 0.08, 0]} scale={1.12}>
        <mesh geometry={diamondNodes.Diamond_1_0.geometry} rotation={[0, 0, 0.715]} castShadow receiveShadow>
          <MeshTransmissionMaterial transparent opacity={diamondOpacity} backside samples={8} resolution={512} color="#78c4c4" transmission={0.98} thickness={0.62} roughness={0.14} ior={1.62} chromaticAberration={0.008} clearcoat={1} envMapIntensity={0.7} />
        </mesh>
      </group>
      <mesh ref={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={floorColor} roughness={0.62} metalness={0.03} />
      </mesh>
      <directionalLight ref={keyLight} position={[-3, 4.5, 4]} intensity={3.5} color="#f5f7f1" castShadow />
      <directionalLight ref={fillLight} position={[3, 0.6, -2]} intensity={1.2} color="#1c7180" />
      <pointLight position={[0, 1.7, 3]} intensity={1.4} distance={7} color="#f4f7f0" />
    </>
  );
}

function ReferenceArtifact({ preset, rotationPaused }: { preset: PresetKey; rotationPaused: boolean }) {
  if (preset === "clear") return <GlassFlowerReference rotationPaused={rotationPaused} />;
  if (preset === "frosted") return <FrostedShoeReference rotationPaused={rotationPaused} />;
  if (preset === "resin") return <InterResinReference rotationPaused={rotationPaused} />;
  if (preset === "diamond") return <DiamondReference rotationPaused={rotationPaused} />;
  return <BubblesReference rotationPaused={rotationPaused} />;
}

function DemoEnvironment({ preset, lightLevel }: { preset: PresetKey; lightLevel: number }) {
  if (preset === "bubbles") return null;
  if (preset === "frosted") {
    return <Environment preset="city" background blur={1} environmentIntensity={0.9 * lightLevel} />;
  }
  return (
    <Environment files={preset === "clear" ? BLUE_STUDIO_HDR : AERO_HDR} resolution={512} background={false} environmentIntensity={lightLevel}>
      <group rotation={[0, 0, 1]}>
        <Lightformer form="circle" intensity={preset === "clear" ? 10 : 5} position={[0, 10, -10]} scale={20} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        <Lightformer intensity={0.12 * lightLevel} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[50, 10, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        <Lightformer intensity={0.12 * lightLevel} position={[10, 1, 0]} rotation-y={-Math.PI / 2} scale={[50, 10, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        <Lightformer color="white" intensity={0.2 * lightLevel} position={[0, 1, 0]} scale={[10, 100, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </group>
    </Environment>
  );
}

function LabScene({ mode, preset, morphProgress, worldProgress, background, lightLevel, showInner, rotationPaused }: { mode: LabMode; preset: PresetKey; morphProgress: number; worldProgress: number; background: BackgroundKey; lightLevel: number; showInner: boolean; rotationPaused: boolean }) {
  const surface = BACKGROUNDS[background];
  return (
    <Canvas camera={{ position: [0, 0.1, 4.5], fov: 34 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={[surface.color]} />
      <fog attach="fog" args={[surface.color, 5, 11]} />
      {mode !== "world" && <ambientLight intensity={0.42 * lightLevel} color="#d7e6e3" />}
      {mode !== "world" && <directionalLight position={[-3, 4, 4]} intensity={3.2 * lightLevel} color="#f4f7f0" castShadow />}
      {mode !== "world" && <directionalLight position={[3, 0.5, -2]} intensity={1.8 * lightLevel} color="#1a6070" />}
      {mode !== "world" && <pointLight position={[0, 1.5, 3]} intensity={1.4 * lightLevel} distance={7} color="#f4f7f0" />}
      {mode === "reference" ? <DemoEnvironment preset={preset} lightLevel={lightLevel} /> : mode === "morph" ? <Environment files={AERO_HDR} resolution={512} background={false} environmentIntensity={0.85 * lightLevel} /> : <Environment files={AERO_HDR} resolution={512} background={false} environmentIntensity={0.8 * lightLevel} />}
      {mode === "world" ? <StatefulWorld progress={worldProgress} showInner={showInner} rotationPaused={rotationPaused} /> : mode === "morph" ? <MorphingArtifact progress={morphProgress} showInner={showInner} rotationPaused={rotationPaused} /> : <ReferenceArtifact preset={preset} rotationPaused={rotationPaused} />}
      {mode === "world" ? <ContactShadows position={[0, -1.31, 0]} scale={7} opacity={0.35 + worldProgress * 0.3} blur={1.5} far={3.2} /> : mode === "reference" && preset === "frosted" ? <ContactShadows position={[0, -1.2, 0]} opacity={0.85} scale={7} blur={2} far={1.4} /> : <ContactShadows position={[0, -1.42, 0]} scale={6} opacity={background === "paper" ? 0.26 : 0.55} blur={2.1} far={3.5} />}
      {mode === "reference" && preset === "diamond" && <AccumulativeShadows temporal frames={60} color="#6b837e" colorBlend={1.5} opacity={0.8} scale={7} position={[0, -0.58, 0]}><RandomizedLight amount={4} radius={5} ambient={0.45} position={[5, 5, -10]} /></AccumulativeShadows>}
      {mode !== "world" && <CameraControls makeDefault minDistance={2.8} maxDistance={7} dollyToCursor={false} />}
      {mode === "world" && <CameraControls makeDefault minDistance={2.8} maxDistance={7} dollyToCursor={false} />}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.15} intensity={mode === "reference" && preset === "clear" ? 0.55 : background === "paper" ? 0.16 : 0.32} radius={0.24} />
        <Vignette eskil={false} offset={0.24} darkness={background === "paper" ? 0.16 : 0.45} />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(FLOWER_MODEL);
useGLTF.preload(SHOE_MODEL);
useGLTF.preload(DIAMOND_MODEL);
useGLTF.preload(LENS_MODEL);

export default function MaterialLab() {
  const [mode, setMode] = useState<LabMode>("world");
  const [preset, setPreset] = useState<PresetKey>("clear");
  const [background, setBackground] = useState<BackgroundKey>("ink");
  const [morphProgress, setMorphProgress] = useState(0);
  const [worldProgress, setWorldProgress] = useState(0.5);
  const [lightLevel, setLightLevel] = useState(1);
  const [showInner, setShowInner] = useState(false);
  const [rotationPaused, setRotationPaused] = useState(false);
  const active = PRESETS[preset];
  const surface = BACKGROUNDS[background];

  return (
    <main className="material-lab" style={{ "--lab-surface": surface.color, "--lab-text": surface.text } as React.CSSProperties}>
      <header className="material-lab__header">
        <div><p className="material-lab__eyebrow">KINGS HILL / MATERIAL LAB</p><h1>One world. Three states.</h1><p className="material-lab__intro">Start with the complete Hero–About–Training scene. The object, environment, light, floor, image context, and cursor response move together—not as a blue card beside a different background.</p></div>
        <Link className="material-lab__back" to="/">Back to Kingshill <span aria-hidden="true">↗</span></Link>
      </header>

      <div className="material-lab__modebar" role="tablist" aria-label="Material lab mode"><button type="button" className={mode === "reference" ? "is-active" : ""} onClick={() => setMode("reference")}>01 / Original demo references</button><button type="button" className={mode === "morph" ? "is-active" : ""} onClick={() => setMode("morph")}>02 / Kingshill morph study</button><button type="button" className={mode === "world" ? "is-active" : ""} onClick={() => setMode("world")}>03 / Full state world</button></div>

      <div className="material-lab__workspace">
        <section className="material-lab__stage" aria-label="Material preview">
          <div className="material-lab__stage-meta"><span>{mode === "reference" ? `REFERENCE / ${active.source}` : mode === "morph" ? "MORPH TIMELINE / ONE OBJECT" : "FULL STATE WORLD / THREE SECTION STATES"}</span><span>{mode === "reference" ? active.label : `${Math.round((mode === "world" ? worldProgress : morphProgress) * 100)}%`}</span></div>
          <div className="material-lab__canvas"><LabScene mode={mode} preset={preset} morphProgress={morphProgress} worldProgress={worldProgress} background={background} lightLevel={lightLevel} showInner={showInner} rotationPaused={rotationPaused} /></div>
          <div className="material-lab__stage-footer"><span>{mode === "reference" ? "ORIGINAL MODEL / MATERIAL + LIGHT + ENVIRONMENT + POST" : mode === "morph" ? "MINERAL CORE → ARCHITECTURAL LENS → TRAINING KEYSTONE" : "HERO INK → ABOUT PAPER / TEAL → TRAINING INK"}</span><span>DRAG TO INSPECT · SCROLL TO DOLLY</span></div>
        </section>

        <aside className="material-lab__controls" aria-label="Material lab controls">
          {mode === "reference" ? <div className="material-lab__control-block"><p className="material-lab__label">01 / Original demo family</p><div className="material-lab__choice-list">{DEMOS.map((demo, index) => <button key={demo.key} type="button" className={preset === demo.key ? "is-active" : ""} onClick={() => setPreset(demo.key)}><span>0{index + 1}</span><strong>{demo.label}</strong><em>{PRESETS[demo.key].label} / {SHAPES[demo.shape].detail}</em></button>)}</div></div> : mode === "morph" ? <div className="material-lab__control-block"><p className="material-lab__label">01 / Morph position</p><label className="material-lab__range"><span>Core</span><input aria-label="Morph position" type="range" min="0" max="1" step="0.001" value={morphProgress} onChange={(event) => setMorphProgress(Number(event.target.value))} /><output>{morphProgress < 0.5 ? "LENS" : "KEYSTONE"}</output></label><div className="material-lab__timeline"><span>Mineral core</span><span>Architectural lens</span><span>Training keystone</span></div></div> : <div className="material-lab__control-block"><p className="material-lab__label">01 / Full scene state</p><label className="material-lab__range"><span>Hero</span><input aria-label="Full scene state" type="range" min="0" max="1" step="0.001" value={worldProgress} onChange={(event) => setWorldProgress(Number(event.target.value))} /><output>{worldProgress < 0.33 ? "HERO" : worldProgress < 0.67 ? "ABOUT" : "TRAINING"}</output></label><div className="material-lab__timeline"><span>Hero / ink</span><span>About / paper</span><span>Training / ink</span></div></div>}

          <div className="material-lab__control-block"><p className="material-lab__label">02 / Controlled surface</p><div className="material-lab__segmented">{(Object.keys(BACKGROUNDS) as BackgroundKey[]).map((key) => <button key={key} type="button" className={background === key ? "is-active" : ""} onClick={() => setBackground(key)}>{BACKGROUNDS[key].label}</button>)}</div><label className="material-lab__range"><span>Light level</span><input aria-label="Light level" type="range" min="0.65" max="1.35" step="0.01" value={lightLevel} onChange={(event) => setLightLevel(Number(event.target.value))} /><output>{lightLevel.toFixed(2)}</output></label></div>

          <div className="material-lab__control-block material-lab__control-block--small"><p className="material-lab__label">03 / Inspection</p><label className="material-lab__toggle"><input type="checkbox" checked={showInner} onChange={(event) => setShowInner(event.target.checked)} /><span />Show internal volume (morph study)</label><label className="material-lab__toggle"><input type="checkbox" checked={rotationPaused} onChange={(event) => setRotationPaused(event.target.checked)} /><span />Pause rotation</label></div>

          <div className="material-lab__notes"><p className="material-lab__label">Current study</p><h2>{mode === "reference" ? active.label : mode === "morph" ? "A real morph, not three cards" : "One world / three states"}</h2><p>{mode === "reference" ? active.description : mode === "morph" ? "Drag the timeline. The same geometry carries morph targets, then changes its transmission, roughness, thickness, color, and internal volume as it moves from Hero to About to Training." : "Drag one timeline. The same artifact, ground, camera, light rig, background, shadow behavior, and cursor response transition together from Hero to About to Training."}</p><p className="material-lab__warning">Reference mode uses the original local pmndrs model or font asset for each selected family. The bubbles entry is a cursor/material study. The Full state world is the complete-scene test and is still isolated from the homepage.</p></div>
        </aside>
      </div>
    </main>
  );
}
