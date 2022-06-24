export function prepareToSvgArea(app: HTMLElement) {
  const svgArea = document.createElement("div");
  svgArea.style.marginLeft = "8px";
  app.after(svgArea);

  const a = document.createElement("a");
  a.innerText = "back";
  a.href = "./";
  a.style.visibility = "hidden";
  svgArea.appendChild(a);
  const div = document.createElement("div");
  svgArea.appendChild(div);
  return div;
}
