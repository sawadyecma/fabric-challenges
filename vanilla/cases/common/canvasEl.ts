export function useCanvasEl(app: HTMLElement): HTMLCanvasElement {
  const canvasEl = document.createElement("canvas");
  app.appendChild(canvasEl);
  canvasEl.height = 600;
  canvasEl.width = 600;
  canvasEl.style.border = "solid 1px grey";
  return canvasEl;
}
