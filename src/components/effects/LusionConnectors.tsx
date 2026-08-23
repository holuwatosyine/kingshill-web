import { Suspense, useEffect, useMemo, useReducer, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { easing } from "maath";
import { experienceState } from "@/experience/state";

const modelUrl = "/experience/models/c-transformed.glb";
const accents = ["#4060ff", "#20ffa0", "#ff4060", "#ffcc00"];
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

type ConnectorProps = {
  position?: [number, number, number];
  children?: React.ReactNode;
  color?: string;
  roughness?: number;
  accent?: boolean;
};

const Model = ({ children, color = "white", roughness = 0 }: ConnectorProps) => {
  const ref = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(null);
  const gltf = useGLTF(modelUrl) as unknown as {
    nodes: { connector: THREE.Mesh };
    materials: { base: THREE.MeshStandardMaterial };
  };
  useFrame((_, delta) => {
    if (ref.current) easing.dampC(ref.current.material.color, color, 0.2, delta);
  });
  return (
    <mesh ref={ref} castShadow receiveShadow scale={10} geometry={gltf.nodes.connector.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={gltf.materials.base.map} />
      {children}
    </mesh>
  );
};

const Connector = ({ position, children, accent, ...props }: ConnectorProps) => {
  const body = useRef<RapierRigidBody>(null);
  const vector = useMemo(() => new THREE.Vector3(), []);
  const randomPosition = useMemo<[number, number, number]>(() => position ?? [THREE.MathUtils.randFloatSpread(10), THREE.MathUtils.randFloatSpread(10), THREE.MathUtils.randFloatSpread(10)], [position]);
  useFrame((_, delta) => {
    delta = Math.min(0.1, delta);
    const rigidBody = body.current;
    if (!rigidBody) return;
    const translation = rigidBody.translation();
    rigidBody.applyImpulse(vector.set(translation.x, translation.y, translation.z).negate().multiplyScalar(0.2 * delta * 60), true);
  });
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={randomPosition} ref={body} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ?? <Model {...props} />}
      {accent && <pointLight intensity={4 * Math.PI} decay={0} distance={2.5} color={props.color} />}
    </RigidBody>
  );
};

const Pointer = () => {
  const body = useRef<RapierRigidBody>(null);
  const vector = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ pointer, viewport }) => {
    body.current?.setNextKinematicTranslation(vector.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0));
  });
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={body}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
};

const LusionConnectors = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(true);
  const [accent, cycleAccent] = useReducer((state: number) => (state + 1) % accents.length, 0);
  const connectors = useMemo(() => shuffle(accent), [accent]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let inView = true;
    const sync = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.01 });
    document.addEventListener("visibilitychange", sync);
    observer.observe(root);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return (
    <div
      ref={rootRef}
      className="kh-lusion-connectors"
      role="application"
      tabIndex={0}
      aria-label="Interactive Kingshill connector field"
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        cycleAccent();
      }}
    >
      <Canvas
        onClick={cycleAccent}
        frameloop={active && !experienceState.reducedMotion ? "always" : "demand"}
        shadows
        dpr={[1, experienceState.quality === "high" ? 1.5 : experienceState.quality === "medium" ? 1.3 : 1.12]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      >
        <color attach="background" args={["#141622"]} />
        <ambientLight intensity={0.4 * Math.PI} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={Math.PI} decay={0} castShadow />
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            <Pointer />
            {connectors.map((properties, index) => <Connector key={index} {...properties} />)}
            <Connector position={[10, 10, 5]}>
              <Model>
                <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
              </Model>
            </Connector>
          </Physics>
          <EffectComposer disableNormalPass multisampling={8}>
            <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
          </EffectComposer>
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 3, 0, 1]}>
              <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
              <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
              <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
              <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
            </group>
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(modelUrl);

export default LusionConnectors;
