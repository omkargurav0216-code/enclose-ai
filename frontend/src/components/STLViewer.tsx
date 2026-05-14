import { Canvas, useLoader } from "@react-three/fiber";

import {
  OrbitControls,
  Center
} from "@react-three/drei";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

// import * as THREE from "three";

interface STLViewerProps {
  stlUrl: string;
}


function STLModel({
  stlUrl
}: STLViewerProps) {

  const geometry = useLoader(
    STLLoader,
    stlUrl
  );

  return (
    <Center>

      <mesh geometry={geometry}>

        <meshStandardMaterial
          color="#3b82f6"
        />

      </mesh>

    </Center>
  );
}


const STLViewer = ({
  stlUrl
}: STLViewerProps) => {

  return (

    <div
  className="
    w-full
    h-[600px]
    bg-[#0b1120]
  "
>

      <Canvas
        camera={{
          position: [100, 100, 100],
          fov: 50
        }}
      >

        <ambientLight intensity={0.8} />

        <directionalLight
          position={[50, 50, 50]}
          intensity={1}
        />

        <STLModel stlUrl={stlUrl} />

        <OrbitControls />

      </Canvas>

    </div>
  );
};

export default STLViewer;