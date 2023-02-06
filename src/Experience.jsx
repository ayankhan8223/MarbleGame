import { Level, BlockAxe, BlockSpinner, BlockLimbo } from "./Level.jsx";
import Lights from "./Lights.jsx";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player.jsx";
import useGame from "./store/useGame.js";
import Effects from "./Effects.jsx";

export default function Experience() {
  const blocksCount = useGame((state) => {
    return state.blocksCount;
  });
  const blockSeed = useGame((state) => {
    return state.blockSeed;
  });
  return (
    <>
      {/* <color args={["#bdedfc"]} attach="background" /> */}
      <color args={["#252731"]} attach="background" />

      <Physics>
        <Lights />
        <Level count={blocksCount} seed={blockSeed} />
        <Player />
      </Physics>

      {/* <Effects /> */}
    </>
  );
}
