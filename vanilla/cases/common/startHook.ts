import { backArrow } from "./backArrow";
import { useCanvasEl } from "./canvasEl";

export function startHook() {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("app is not found");
  }

  backArrow(app);

  const canvasEl = useCanvasEl(app);

  return { app, canvasEl };
}
