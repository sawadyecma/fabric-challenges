import { prepareToSvgArea } from "../../prepareToSvgArea";

export function addToSvgControl(
  app: HTMLElement,
  canvas: { toSVG: () => string }
) {
  const svgArea = prepareToSvgArea(app);

  const toSvgButton = document.createElement("button");
  toSvgButton.innerText = "toSvg";
  toSvgButton.addEventListener("click", onToSvgButtonClick);
  app.appendChild(toSvgButton);

  function onToSvgButtonClick() {
    const svg = canvas.toSVG() ?? "";
    svgArea.innerHTML = svg;
  }
}
