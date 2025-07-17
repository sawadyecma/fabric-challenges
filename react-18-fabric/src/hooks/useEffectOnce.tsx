import { useEffect, useRef } from "react";
type CleanUpFunction = () => void;
type EffectFunction = () => void | CleanUpFunction;

export const useEffectOnce = (effect: EffectFunction) => {
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const cleanup = effect();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
