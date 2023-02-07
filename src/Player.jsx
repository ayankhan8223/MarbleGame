import { useRef, useEffect, useState } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import useGame from "./store/useGame";
import * as THREE from "three";

function Player() {
  const body = useRef();
  // const handleClick = useGame((state) => state.handleClick);
  const handleForward = useGame((state) => state.forward);
  const handleBackward = useGame((state) => state.backward);
  const handleRightward = useGame((state) => state.rightward);
  const handleLeftward = useGame((state) => state.leftward);
  const handleJump = useGame((state) => state.jump);

  const [subscribeKeys, getKey] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  // phases
  const start = useGame((state) => {
    return state.start;
  });
  const end = useGame((state) => {
    return state.end;
  });
  const blocksCount = useGame((state) => {
    return state.blocksCount;
  });
  const reStart = useGame((state) => {
    return state.restart;
  });

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    const unSubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") {
          reset();
        }
      }
    );

    const unSubscribeJump = subscribeKeys(
      (state) => {
        const jump = state.jump;
        return jump;
      },
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unSubscribeAny = subscribeKeys(() => {
      start();
    });
    return () => {
      unSubscribeJump();
      unSubscribeAny();
      unSubscribeReset();
    };
  }, []);
  if (handleJump) {
    jump();
  }

  useFrame((state, delta) => {
    var { forward, backward, leftward, rightward, jump } = getKey();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };
    const impulseStength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward || handleForward) {
      impulse.z -= impulseStength;
      torque.x -= torqueStrength;
    }

    if (rightward || handleRightward) {
      impulse.x += impulseStength;
      torque.z -= torqueStrength;
    }

    if (backward || handleBackward) {
      impulse.z += impulseStength;
      torque.x += torqueStrength;
    }

    if (leftward || handleLeftward) {
      impulse.x -= impulseStength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    // camera
    const bodyPosition = body.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }
    if (bodyPosition.y < -4) {
      reStart();
    }
  });

  return (
    <>
      <RigidBody
        colliders="ball"
        position={[0, 1, 0]}
        restitution={0.2}
        friction={1}
        ref={body}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Player;
