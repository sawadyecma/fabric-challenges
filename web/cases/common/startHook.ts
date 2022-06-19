import { backArrow } from "./backArrow";

export function startHook() {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("app is not found");
  }

  backArrow(app);

  return app;
}
