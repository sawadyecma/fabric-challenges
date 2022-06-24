import { startHook } from "../common/startHook";
import { fabric } from "fabric";

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

const toSvgButton = document.createElement("button");
toSvgButton.innerText = "toSvg";
toSvgButton.addEventListener("click", toSvg);

app.appendChild(toSvgButton);

function toSvg() {
  const svg = canvas.toSVG();
  div.innerHTML = svg ?? "";
}

export {};
