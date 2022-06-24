import { startHook } from "../common/startHook";
import { fabric } from "fabric";

const { canvasEl } = startHook();

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

const svg = canvas.toSVG();
const ele = document.getElementById("svg");
if (ele) {
  const a = document.createElement("a");
  a.innerText = "back";
  a.href = "./";
  ele.appendChild(a);
  const div = document.createElement("div");
  div.style.border = "solid 1px red";
  div.innerHTML = svg ?? "";
  ele.appendChild(div);
}

export {};
