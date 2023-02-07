import React from "react";
import { useKeyboardControls } from "@react-three/drei";
import useGame from "./store/useGame";
import { useRef, useEffect, useState } from "react";
import { addEffect, useFrame } from "@react-three/fiber";

function Interface() {
  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  const time = useRef();
  const forwardFunction = useGame((state) => state.handleForward);
  const backwardFunction = useGame((state) => state.handleBackward);
  const rightwardFunction = useGame((state) => state.handleRightward);
  const leftwardFunction = useGame((state) => state.handleLeftward);
  const jumpFunction = useGame((state) => state.handleJump);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") elapsedTime = Date.now() - state.startTime;
      else if (state.phase === "ended")
        elapsedTime = state.endTime - state.startTime;

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) time.current.textContent = elapsedTime;
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      <div className="time" ref={time}>
        0.00
      </div>
      {phase === "ended" ? (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      ) : null}

      <div className="controls">
        <div className="raw">
          <div
            className={`key ${forward ? "active" : ""}`}
            onMouseDown={() => forwardFunction(true)}
            onMouseUp={() => forwardFunction(false)}
            onPointerDown={() => forwardFunction(true)}
            onPointerUp={() => forwardFunction(false)}
          ></div>
        </div>
        <div className="raw">
          <div
            className={`key ${leftward ? "active" : ""}`}
            onMouseDown={() => leftwardFunction(true)}
            onMouseUp={() => leftwardFunction(false)}
            onPointerDown={() => leftwardFunction(true)}
            onPointerUp={() => leftwardFunction(false)}
          ></div>
          <div
            className={`key ${backward ? "active" : ""}`}
            onMouseDown={() => backwardFunction(true)}
            onMouseUp={() => backwardFunction(false)}
            onPointerDown={() => backwardFunction(true)}
            onPointerUp={() => backwardFunction(false)}
          ></div>
          <div
            className={`key ${rightward ? "active" : ""}`}
            onMouseDown={() => rightwardFunction(true)}
            onMouseUp={() => rightwardFunction(false)}
            onPointerDown={() => rightwardFunction(true)}
            onPointerUp={() => rightwardFunction(false)}
          ></div>
        </div>
        <div className="raw">
          <div
            className={`key large ${jump ? "active" : ""}`}
            onMouseDown={() => jumpFunction(true)}
            onMouseUp={() => jumpFunction(false)}
            onPointerDown={() => jumpFunction(true)}
            onPointerUp={() => jumpFunction(false)}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Interface;
