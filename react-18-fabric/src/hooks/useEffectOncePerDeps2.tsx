import { useEffect, useRef } from "react";

type CleanUpFunction = () => void;
type EffectFunction = () => void | CleanUpFunction;

/**
 * ReactのStrictModeにも対応した useEffectOncePerDeps。
 * depsごとに一度だけ effect を実行。
 */
export const useEffectOncePerDeps2 = (
  effect: EffectFunction,
  deps: unknown[]
) => {
  const hasRunMap = useRef<Map<string, boolean>>(new Map());

  const key = JSON.stringify(deps);
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasRunMap.current.has(key)) return;

    const cleanup = effect();

    // 実際に effect が「成功」したあとに hasRunMap に登録
    timeoutIdRef.current = window.setTimeout(() => {
      hasRunMap.current.set(key, true);
    }, 0);

    return () => {
      if (typeof cleanup === "function") cleanup();

      // StrictMode下で1回目のeffectが cleanup されたとき、
      // hasRunMapが登録される前なら登録をキャンセル
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
