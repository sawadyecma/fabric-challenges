import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { prepareToSvgArea } from "../common/prepareToSvgArea";
import { composeSvg } from "../common/fabricModules/svg";

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

const checkboxOff = await composeSvg();
checkboxOff.set({ left: 200, top: 0 });

canvas.add(checkboxOff);

const checkboxOn = await composeSvg("/icons/checkbox/on.svg");
checkboxOn.set({ left: 200, top: 40 });
canvas.add(checkboxOn);

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
