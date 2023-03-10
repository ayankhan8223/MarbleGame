import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const allClicks = {
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  jump: false,
};

export default create(
  subscribeWithSelector((set) => {
    return {
      ...allClicks,
      blocksCount: 30,
      phase: "ready",
      startTime: 0,
      blockSeed: 0,
      endTime: 0,
      forward: false,
      handleForward: (key) => set({ forward: key }),
      handleBackward: (key) => set({ backward: key }),
      handleLeftward: (key) => set({ leftward: key }),
      handleRightward: (key) => set({ rightward: key }),
      handleJump: (key) => set({ jump: key }),
      start: () => {
        set((state) => {
          if (state.phase === "ready")
            return { phase: "playing", startTime: Date.now() };

          return {};
        });
      },

      restart: () => {
        set((state) => {
          if (state.phase === "playing" || state.phase === "ended")
            return { phase: "ready", blockSeed: Math.random() };
          return {};
        });
      },

      end: () => {
        set((state) => {
          if (state.phase === "playing")
            return { phase: "ended", endTime: Date.now() };
          return {};
        });
      },
    };
  })
);
