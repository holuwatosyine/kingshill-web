import React, { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import { WaterMesh } from "three/addons/objects/WaterMesh.js";
import { SkyMesh } from "three/addons/objects/SkyMesh.js";
import {
  color,
  exp,
  length,
  mix,
  positionLocal,
  sin,
  smoothstep,
  time,
  uniform,
  vec3,
} from "three/tsl";
import waterNormalsUrl from "@/assets/waternormals.jpg";
import { experienceState } from "@/experience/state";

export const ClarityWaterScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.dataset.failed = "true";
      experienceState.markReady("water");
      return;
    }

    let disposed = false;
    let renderer: THREE.WebGPURenderer | null = null;
    let pointerDirty = true;
    let sceneVisible = true;
    let documentVisible = !document.hidden;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f3f1);
    scene.fog = new THREE.FogExp2(0xc8dfe0, 0.0038);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1200);
    camera.position.set(2.5, 6.45, 30);
    const cameraLook = new THREE.Vector3(0, 0.08, -38);

    const sky = new SkyMesh();
    sky.scale.setScalar(900);
    sky.turbidity.value = 4.4;
    sky.rayleigh.value = 0.92;
    sky.mieCoefficient.value = 0.0045;
    sky.mieDirectionalG.value = 0.76;
    sky.cloudCoverage.value = 0.28;
    sky.cloudDensity.value = 0.19;
    sky.cloudScale.value = 0.00032;
    sky.cloudSpeed.value = 0.000055;

    const sun = new THREE.Vector3();
    sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(69), THREE.MathUtils.degToRad(218));
    sky.sunPosition.value.copy(sun);
    scene.add(sky);

    const normalTexture = new THREE.TextureLoader().load(waterNormalsUrl);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.anisotropy = 8;

    const waterGeometry = new THREE.PlaneGeometry(420, 420, 280, 280);
    const water = new WaterMesh(waterGeometry, {
      waterNormals: normalTexture,
      sunDirection: sun.clone().normalize(),
      sunColor: 0xfff1c2,
      waterColor: 0x73b7bc,
      distortionScale: 2.25,
      size: 2.35,
      alpha: 0.93,
      resolutionScale: 0.72,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    scene.add(water);

    const cursorPointNode = uniform(new THREE.Vector2(0, -18));
    const cursorEnergyNode = uniform(0.0);
    const waterMaterial = water.material as THREE.NodeMaterial;
    const localPoint = positionLocal.xy;
    const cursorDistance = length(localPoint.sub(cursorPointNode));
    const calmField = smoothstep(14.0, 0.0, cursorDistance).mul(cursorEnergyNode);
    const wakeFalloff = exp(cursorDistance.mul(-0.105));
    const wake = sin(cursorDistance.mul(1.72).sub(time.mul(6.4)))
      .mul(wakeFalloff)
      .mul(cursorEnergyNode)
      .mul(0.88);
    const wakeEcho = sin(cursorDistance.mul(2.55).sub(time.mul(8.2)))
      .mul(exp(cursorDistance.mul(-0.17)))
      .mul(cursorEnergyNode)
      .mul(0.36);
    const pointerLift = smoothstep(5.4, 0.0, cursorDistance).mul(cursorEnergyNode).mul(0.24);
    const longSwell = sin(positionLocal.x.mul(0.052).add(time.mul(0.48))).mul(0.13);
    const crossingSwell = sin(positionLocal.y.mul(0.038).sub(time.mul(0.31))).mul(0.1);
    const fineSwell = sin(positionLocal.x.add(positionLocal.y.mul(0.7)).mul(0.12).add(time.mul(0.78))).mul(0.045);
    const ambientWater = longSwell.add(crossingSwell).add(fineSwell);
    const displacement = ambientWater
      .mul(calmField.mul(-0.72).add(1))
      .add(wake)
      .add(wakeEcho)
      .add(pointerLift);
    waterMaterial.positionNode = positionLocal.add(vec3(0, 0, displacement));

    const glowMaterial = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      opacity: 0.23,
      blending: THREE.AdditiveBlending,
    });
    const glowPulse = sin(time.mul(0.38)).mul(0.5).add(0.5);
    glowMaterial.colorNode = mix(color(0x6ca9ad), color(0xd6bd69), glowPulse.mul(0.52));
    const glowGeometry = new THREE.CircleGeometry(24, 128);
    const subsurfaceGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    subsurfaceGlow.rotation.x = -Math.PI / 2;
    subsurfaceGlow.scale.set(1.8, 0.62, 1);
    subsurfaceGlow.position.set(23, -0.34, -42);
    scene.add(subsurfaceGlow);

    const horizonMaterial = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    horizonMaterial.colorNode = mix(color(0xaed2d4), color(0xffebae), sin(time.mul(0.16)).mul(0.5).add(0.5).mul(0.36));
    const horizonGeometry = new THREE.PlaneGeometry(95, 2.4, 1, 1);
    const horizonLight = new THREE.Mesh(horizonGeometry, horizonMaterial);
    horizonLight.position.set(28, 1.25, -94);
    scene.add(horizonLight);

    const causticRings = Array.from({ length: 3 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: index === 1 ? 0xd5f0ed : 0xffedac,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.82, 1.08, 128), material);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.055 + index * 0.006, -18);
      scene.add(ring);
      return ring;
    });

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0.18, -0.08);
    const pointerTarget = new THREE.Vector2(0, -18);
    const pointerWorldTarget = new THREE.Vector3(0, 0.055, -18);
    const pointerWorld = pointerWorldTarget.clone();
    const localHit = new THREE.Vector3();
    const forcedDirection = new THREE.Vector3();
    const forcedHit = new THREE.Vector3();
    let pointerVelocity = 0;
    let scrollProgress = 0;
    const onScroll = () => {
      const rect = canvas.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(-rect.top / Math.max(window.innerHeight, 1), 0, 1);
    };

    const resize = () => {
      if (!renderer) return;
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      camera.aspect = width / height;
      camera.fov = width < 720 ? 50 : 42;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
    };

    const startedAt = performance.now();
    const targetCamera = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    const animate = () => {
      if (!renderer || disposed) return;
      const elapsed = (performance.now() - startedAt) / 1000;

      const sharedPointer = experienceState.pointer;
      if (Math.abs(pointerNdc.x - sharedPointer.smoothNdcX) > 0.0001 || Math.abs(pointerNdc.y - sharedPointer.smoothNdcY) > 0.0001) {
        pointerNdc.set(sharedPointer.smoothNdcX, sharedPointer.smoothNdcY);
        pointerVelocity = Math.max(pointerVelocity, sharedPointer.smoothSpeed + (sharedPointer.pressed ? 0.55 : 0));
        pointerDirty = true;
      }

      if (pointerDirty) {
        raycaster.setFromCamera(pointerNdc, camera);
        const hit = raycaster.intersectObject(water, false)[0];
        if (hit) {
          pointerWorldTarget.copy(hit.point);
          pointerWorldTarget.y = 0.055;
          localHit.copy(hit.point);
          water.worldToLocal(localHit);
          pointerTarget.set(localHit.x, localHit.y);
        } else {
          forcedDirection.copy(raycaster.ray.direction);
          forcedDirection.y = Math.min(forcedDirection.y, -0.045);
          forcedDirection.normalize();
          const distanceToWater = (0 - raycaster.ray.origin.y) / forcedDirection.y;
          forcedHit.copy(raycaster.ray.origin).addScaledVector(forcedDirection, Math.max(0, distanceToWater));
          forcedHit.x = THREE.MathUtils.clamp(forcedHit.x, -88, 88);
          forcedHit.z = THREE.MathUtils.clamp(forcedHit.z, -96, 36);
          pointerWorldTarget.copy(forcedHit);
          pointerWorldTarget.y = 0.055;
          localHit.copy(forcedHit);
          water.worldToLocal(localHit);
          pointerTarget.set(localHit.x, localHit.y);
        }
        pointerDirty = false;
      }

      cursorPointNode.value.lerp(pointerTarget, 0.075);
      cursorEnergyNode.value += ((pointerVelocity * 2.05) - cursorEnergyNode.value) * 0.075;
      pointerVelocity *= 0.982;
      pointerWorld.lerp(pointerWorldTarget, 0.09);
      causticRings.forEach((ring, index) => {
        const phase = (elapsed * 0.58 + index / causticRings.length) % 1;
        const scale = 1.1 + phase * 6.4;
        ring.position.x = pointerWorld.x;
        ring.position.z = pointerWorld.z;
        ring.scale.setScalar(scale);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * Math.min(0.42, cursorEnergyNode.value * 0.2);
      });

      targetCamera.set(
        2.5 + (pointerNdc.x * 0.52) + Math.sin(elapsed * 0.09) * 0.28,
        6.45 + pointerNdc.y * 0.19 - scrollProgress * 1.1,
        30 - scrollProgress * 5.5 + Math.sin(elapsed * 0.055) * 0.5,
      );
      targetLook.set(
        pointerNdc.x * 1.4,
        0.08 + pointerNdc.y * 0.14,
        -38 - scrollProgress * 20,
      );
      camera.position.lerp(targetCamera, 0.025);
      cameraLook.lerp(targetLook, 0.026);
      camera.lookAt(cameraLook);
      renderer.render(scene, camera);
    };

    const syncAnimationLoop = () => {
      renderer?.setAnimationLoop(sceneVisible && documentVisible ? animate : null);
    };

    const visibilityObserver = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          sceneVisible = entry.isIntersecting;
          syncAnimationLoop();
        }, { threshold: 0.01 });

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      syncAnimationLoop();
    };

    const init = async () => {
      try {
        renderer = new THREE.WebGPURenderer({
          canvas,
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        await renderer.init();
        if (disposed) return;
        resize();
        await renderer.compileAsync(scene, camera);
        syncAnimationLoop();
        canvas.dataset.ready = "true";
        experienceState.markReady("water");
        document.documentElement.dataset.khRenderer = renderer.backend?.isWebGPUBackend ? "webgpu" : "webgl2";
      } catch (error) {
        console.error("Kingshill clarity scene failed", error);
        canvas.dataset.failed = "true";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    visibilityObserver?.observe(canvas);
    onScroll();
    void init();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      visibilityObserver?.disconnect();
      renderer?.setAnimationLoop(null);
      waterGeometry.dispose();
      glowGeometry.dispose();
      horizonGeometry.dispose();
      causticRings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      normalTexture.dispose();
      water.material.dispose();
      glowMaterial.dispose();
      horizonMaterial.dispose();
      sky.geometry.dispose();
      sky.material.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="kh-clarity-scene" aria-hidden="true">
      <div className="kh-clarity-scene__fallback" />
      <canvas ref={canvasRef} className="kh-clarity-scene__canvas" />
    </div>
  );
};

export default ClarityWaterScene;
