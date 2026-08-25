import * as THREE from "three";
import { type ReactNode, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Canvas, useFrame, type CanvasProps } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { CuboidCollider, BallCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { easing } from "maath";
import type { GLTF } from "three-stdlib";
import { experienceState } from "@/experience/state";
import "./LusionHero.css";

const cModel = "/experience/models/c-transformed.glb";
const accents = ["#1e4f68", "#3b7475", "#879f9e", "#e7eee9"];
const shuffle = (accent = 0) => [
  { color: "#444", roughness: 0.1 },
  { color: "#444", roughness: 0.75 },
  { color: "#444", roughness: 0.75 },
  { color: "white", roughness: 0.1 },
  { color: "white", roughness: 0.75 },
  { color: "white", roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
];

type GLTFResult = GLTF & { nodes: { connector: THREE.Mesh }; materials: { base: THREE.MeshStandardMaterial } };
type CoachingVariant = "dialogue" | "focus" | "progression";
type ConnectorProps = { position?: [number, number, number]; children?: ReactNode; vec?: THREE.Vector3; scale?: number; r?: (range: number) => number; accent?: boolean; color?: string; roughness?: number; variant?: CoachingVariant };

function Model({ children, color = "white", roughness = 0, ...props }: { children?: ReactNode; color?: string; roughness?: number }) {
  const ref = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(null!);
  const { nodes, materials } = useGLTF(cModel) as unknown as GLTFResult;
  useFrame((_, delta) => {
    if (ref.current) easing.dampC(ref.current.material.color, color, 0.2, delta);
  });
  return (
    <mesh ref={ref} castShadow receiveShadow scale={10} geometry={nodes.connector.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.base.map} />
      {children}
    </mesh>
  );
}

function CoachingModel({ variant, color = "white", roughness = 0.1 }: { variant: CoachingVariant; color?: string; roughness?: number }) {
  const ref = useRef<THREE.Group>(null!);
  const { materials } = useGLTF(cModel) as unknown as GLTFResult;
  useFrame((_, delta) => {
    ref.current?.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        easing.dampC(child.material.color, color, 0.2, delta);
      }
    });
  });

  const materialProps = { color, metalness: 0.2, roughness, map: materials.base.map };
  if (variant === "dialogue") {
    return (
      <group ref={ref}>
        <RoundedBox args={[0.48, 1.78, 0.48]} radius={0.12} smoothness={4} rotation={[0, 0, -0.46]} position={[-0.28, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>
        <RoundedBox args={[0.48, 1.78, 0.48]} radius={0.12} smoothness={4} rotation={[0, 0, 0.46]} position={[0.28, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>
      </group>
    );
  }

  if (variant === "focus") {
    return (
      <group ref={ref} rotation={[0.16, 0, 0]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[0.62, 0.16, 18, 48]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.28, 20, 14]} />
          <meshStandardMaterial {...materialProps} roughness={Math.min(0.32, roughness + 0.12)} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={ref} rotation={[0, 0, -0.1]}>
      <RoundedBox args={[0.56, 0.72, 0.56]} radius={0.1} smoothness={4} position={[-0.34, -0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
      <RoundedBox args={[0.56, 1.02, 0.56]} radius={0.1} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
      <RoundedBox args={[0.56, 1.34, 0.56]} radius={0.1} smoothness={4} position={[0.34, 0.72, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
    </group>
  );
}

function Connector({ position, children, vec = new THREE.Vector3(), r = THREE.MathUtils.randFloatSpread, accent, variant, ...props }: ConnectorProps) {
  const api = useRef<RapierRigidBody>(null!);
  const pos = useMemo<[number, number, number]>(() => position || [r(10), r(10), r(10)], []);
  useFrame(() => {
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2), false);
  });
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children || (variant ? <CoachingModel variant={variant} {...props} /> : <Model {...props} />)}
      {accent && <pointLight intensity={4 * Math.PI} decay={0} distance={2.5} color={props.color} />}
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }: { vec?: THREE.Vector3 }) {
  const ref = useRef<RapierRigidBody>(null!);
  useFrame(({ viewport }) => {
    const { smoothNdcX, smoothNdcY } = experienceState.pointer;
    ref.current?.setNextKinematicTranslation(vec.set((smoothNdcX * viewport.width) / 2, (smoothNdcY * viewport.height) / 2, 0));
  });
  return <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}><BallCollider args={[1]} /></RigidBody>;
}

function Scene({ renderScale, ...props }: CanvasProps & { renderScale: number }) {
  const [accent, cycleAccent] = useReducer((state: number) => (state + 1) % accents.length, 0);
  const connectors = useMemo(() => shuffle(accent), [accent]);
  return (
    <Canvas
      onClick={cycleAccent}
      shadows
      dpr={[1, (experienceState.quality === "high" ? 1.5 : experienceState.quality === "medium" ? 1.25 : 1.1) * renderScale]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      {...props}
    >
      <color attach="background" args={["#141622"]} />
      <ambientLight intensity={0.4 * Math.PI} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={Math.PI} decay={0} castShadow />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((properties, index) => <Connector key={index} variant={index === 0 ? "dialogue" : index === 1 ? "focus" : index === 2 ? "progression" : undefined} {...properties} />)}
        <Connector position={[10, 10, 5]}>
          <Model>
            <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={experienceState.quality === "high" ? 8 : 4} resolution={experienceState.quality === "high" ? 512 : 384} />
          </Model>
        </Connector>
      </Physics>
      <EffectComposer multisampling={experienceState.quality === "high" && renderScale > 0.9 ? 4 : 0}><N8AO distanceFalloff={1} aoRadius={1} intensity={4} /></EffectComposer>
      <Environment resolution={experienceState.quality === "high" ? 256 : 128}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  );
}

export default function LusionHero() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [renderScale, setRenderScale] = useState(experienceState.renderScale);

  useEffect(() => {
    const onRenderScale = (event: Event) => setRenderScale((event as CustomEvent<{ scale: number }>).detail.scale);
    window.addEventListener("kingshill:render-scale", onRenderScale);
    return () => window.removeEventListener("kingshill:render-scale", onRenderScale);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return <div ref={rootRef} className="kh-lusion-hero__scene" role="img" aria-label="Interactive Kingshill connector field"><Scene frameloop={visible ? "always" : "never"} renderScale={renderScale} /></div>;
}

useGLTF.preload(cModel);
