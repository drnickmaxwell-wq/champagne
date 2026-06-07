"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Box3, Vector3 } from "three";

type Props = {
  glbPath: string;
  fallbackJpegPath: string;
  assetId: string;
};

function GLBModel({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  const box = new Box3().setFromObject(gltf.scene);
  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? 2 / maxDim : 1;

  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      position={[-center.x * scale, -center.y * scale, -center.z * scale]}
    />
  );
}

function TurntableControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<InstanceType<typeof OrbitControls> | null>(null);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 8;
    controlsRef.current = controls;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}

function ModelLoader({ url }: { url: string }) {
  return (
    <Suspense fallback={null}>
      <GLBModel url={url} />
    </Suspense>
  );
}

function FallbackImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-ink, #0b0d0f)",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "var(--radius-md, 8px)" }}
      />
    </div>
  );
}

export function ImplantCrownViewerClient({ glbPath, fallbackJpegPath, assetId }: Props) {
  const [webglFailed, setWebglFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (webglFailed || prefersReducedMotion) {
    return <FallbackImage src={fallbackJpegPath} alt={assetId} />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      onCreated={({ gl }) => {
        if (!gl.capabilities.isWebGL2 && !gl.getContext()) {
          setWebglFailed(true);
        }
      }}
      style={{ width: "100%", height: "100%", background: "#0b0d0f" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />
      <ModelLoader url={glbPath} />
      <TurntableControls />
    </Canvas>
  );
}
