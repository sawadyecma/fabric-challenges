import { backArrow } from "./backArrow";

export function startHook() {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  backArrow(app);

  return app;
}
