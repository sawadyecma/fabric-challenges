import { useEffect, useRef } from "react";

type CleanUpFunction = () => void;
type EffectFunction = () => void | CleanUpFunction;

/**
 *
 * Reactのstrict modeでもdepsに対して一度だけ実行されるuseEffectのラッパー。
 * 初期レンダリングでも1度だけ実行される。
 */
export const useEffectOncePerDeps = (
  effect: EffectFunction,
  deps: unknown[]
) => {
  const hasRunMap = useRef<Map<string, boolean>>(new Map());

  const key = JSON.stringify(deps);

  useEffect(() => {
    if (hasRunMap.current.has(key)) return;
    hasRunMap.current.set(key, true);

    const cleanup = effect();

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
    // effect関数はdepsに依存するため、effectが変わる=depsが変わるため、依存配列には追加しなくてもOK
    // むしろeffectは即時関数であることがほとんどな想定なので、この依存配列に追加すると無限ループになる
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
