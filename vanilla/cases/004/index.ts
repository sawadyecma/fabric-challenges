import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { prepareToSvgArea } from "../common/prepareToSvgArea";

const { app, canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl, { backgroundColor: "grey" });

const redRect = new fabric.Rect({
  top: 100,
  left: 100,
  width: 20,
  height: 20,
  fill: "red",
});
canvas.add(redRect);

const blueRect = new fabric.Rect({
  top: 200,
  left: 200,
  width: 20,
  height: 20,
  borderColor: "black",
  hasBorders: true,
  fill: "blue",
  originX: "center",
  originY: "center",
});
canvas.add(blueRect);

const svgArea = prepareToSvgArea(app);

const toSvgButton = document.createElement("button");
toSvgButton.innerText = "toSvg";
toSvgButton.addEventListener("click", onToSvgButtonClick);
app.appendChild(toSvgButton);

function onToSvgButtonClick() {
  const svg = canvas.toSVG() ?? "";
  svgArea.innerHTML = svg;
}

export {};
