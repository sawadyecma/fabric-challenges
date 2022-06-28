import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { prepareToSvgArea } from "../common/prepareToSvgArea";

const { app, canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl, { backgroundColor: "grey" });

const redRect = new fabric.Rect({
  left: 0,
  top: 0,
  width: 100,
  height: 100,
  backgroundColor: "red",
  fill: "red",
});

const blueRect = new fabric.Rect({
  left: 100,
  top: 200,
  width: 100,
  height: 100,
  backgroundColor: "blue",
  fill: "blue",
});

canvas.add(redRect, blueRect);

const svgArea = prepareToSvgArea(app);

const toSvgButton = document.createElement("button");
toSvgButton.innerText = "toSvg";
toSvgButton.addEventListener("click", onToSvgButtonClick);
app.appendChild(toSvgButton);

function onToSvgButtonClick() {
  const svg = canvas.toSVG() ?? "";
  svgArea.innerHTML = svg;
}

let zoom = 1;

const zoomDownButton = document.createElement("button");
zoomDownButton.innerText = "zoomDown";
zoomDownButton.addEventListener("click", onZoomDownButtonClick);
app.appendChild(zoomDownButton);

function onZoomDownButtonClick() {
  zoom -= 0.1;
  canvas.setZoom(zoom);
  // canvas.zoomToPoint(new fabric.Point(100, 100), zoom);
}

const zoomUpButton = document.createElement("button");
zoomUpButton.innerText = "zoomUp";
zoomUpButton.addEventListener("click", onZoomUpButtonClick);
app.appendChild(zoomUpButton);

function onZoomUpButtonClick() {
  zoom += 0.1;
  canvas.setZoom(zoom);
  // canvas.zoomToPoint(new fabric.Point(100, 100), zoom);
}

export {};
