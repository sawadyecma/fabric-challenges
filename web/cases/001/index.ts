import { startHook } from "../common/startHook";
import { fabric } from "fabric";

const { canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl);

const rect = new fabric.Rect({
  top: 100,
  left: 100,
  width: 60,
  height: 70,
  fill: "red",
});
canvas.add(rect);

canvas.add(
  new fabric.Rect({
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderColor: "black",
    hasBorders: true,
    fill: "blue",
  })
);

canvas.add(
  new fabric.Line([300, 300, 600, 310], { backgroundColor: "yellow" })
);

export {};
