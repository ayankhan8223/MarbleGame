import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text, Float } from "@react-three/drei";
THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// floor material
// const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
// const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
// const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
// const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

const floor1Material = new THREE.MeshStandardMaterial({
  color: "#111111",
  metalness: 0,
  roughness: 0,
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "#222222",
  metalness: 0,
  roughness: 0,
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "#ff0000",
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "#887777",
  metalness: 0,
  roughness: 0,
});

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <>
      <group position={position}>
        <Float rotationIntensity={0.25}>
          <Text
            font="./bebas-neue-v9-latin-regular.woff"
            scale={0.5}
            maxWidth={0.25}
            lineHeight={0.75}
            textAlign="right"
            position={[0.75, 1, 0]}
            rotation-y={-0.25}
          >
            <meshBasicMaterial toneMapped={false} />
            Marble Race
          </Text>
        </Float>
        <mesh
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          position={[0, 0.2, 0]}
          receiveShadow
          material={floor1Material}
        />
      </group>
    </>
  );
}
export function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF("./hamburger.glb");
  const burger = useRef();

  useFrame((state, delta) => {
    burger.current.rotation.y += delta;
  });

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <>
      <group position={position}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={1}
          position={[0, 2.3, 0]}
        >
          FINISH
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          position={[0, 0.3, 0]}
          receiveShadow
          material={floor1Material}
        />
        <RigidBody
          position={[0, 0.55, 0]}
          type="fixed"
          colliders="hull"
          restitution={0.2}
          friction={0}
        >
          <primitive object={hamburger.scene} scale={0.2} ref={burger} />
        </RigidBody>
      </group>
    </>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  // refernece to obs1
  const obstacle1 = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  // animate
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle1.current.setNextKinematicRotation(rotation);
  });
  return (
    <>
      <group position={position}>
        {/* floor2 */}
        <mesh
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          position={[0, 0.2, 0]}
          receiveShadow
          material={floor2Material}
        />
        {/* obstacle */}
        <RigidBody
          type="kinematicPosition"
          position={[0, 0.45, 0]}
          restitution={0.2}
          friction={0}
          ref={obstacle1}
        >
          {/* restitution means bouncyness */}
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[3.5, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    </>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  // refernece to obs1
  const obstacle1 = useRef();
  const [timeOffset] = useState(
    () => (Math.random() + 0.2) * (Math.random() * Math.PI * 2)
  );

  // animate
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time * timeOffset) + 1.5;
    obstacle1.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
  return (
    <>
      <group position={position}>
        {/* floor2 */}
        <mesh
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          position={[0, 0.2, 0]}
          receiveShadow
          material={floor2Material}
        />
        {/* obstacle */}
        <RigidBody
          type="kinematicPosition"
          position={[0, 0.4, 0]}
          restitution={0.2}
          friction={0}
          ref={obstacle1}
        >
          {/* restitution means bouncyness */}
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[3.5, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    </>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  // refernece to obs1
  const obstacle1 = useRef();
  const [timeOffset] = useState(
    () => (Math.random() + 0.2) * (Math.random() * Math.PI * 2)
  );

  // animate
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time * timeOffset) * 1.25;
    obstacle1.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 1,
      z: position[2],
    });
  });
  return (
    <>
      <group position={position}>
        {/* floor2 */}
        <mesh
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          position={[0, 0.2, 0]}
          receiveShadow
          material={floor2Material}
        />
        {/* obstacle */}
        <RigidBody
          type="kinematicPosition"
          position={[0, 0.4, 0]}
          restitution={0.2}
          friction={0}
          ref={obstacle1}
        >
          {/* restitution means bouncyness */}
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[1.5, 1.5, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    </>
  );
}
function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          position={[2.15, 1.5, -(length * 2) + 2]}
          scale={[0.3, 2.5, 4 * length]}
          castShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          position={[-2.15, 1.5, -(length * 2) + 2]}
          scale={[0.3, 2.5, 4 * length]}
          receiveShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          position={[0, 1.5, -(length * 4) + 2]}
          scale={[4, 2.5, 0.3]}
          receiveShadow
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, 0.2, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export function Level({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
}
