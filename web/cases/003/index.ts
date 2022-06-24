import { startHook } from "../common/startHook";
import { fabric } from "fabric";

const { canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl);

const redRect = new fabric.Rect({
  top: 100,
  left: 100,
  width: 20,
  height: 20,
  fill: "red",
});
canvas.add(redRect);

console.log(redRect.getBoundingRect());
console.log(redRect.left);

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

console.log(blueRect.getBoundingRect()); // boundingRectはoriginXを加味する
console.log(blueRect.left); // leftはoriginXを加味しない

blueRect.set("top", blueRect.top! + 100);
blueRect.set("left", blueRect.left! + 100);

blueRect.setCoords();
canvas.renderAll();

console.log(blueRect.getBoundingRect()); // boundingRectはoriginXを加味する
console.log(blueRect.left); // leftはoriginXを加味しない

canvas.centerObject(blueRect);
console.log(blueRect.left); // centerObjectした後、leftはoriginXを加味する

export {};
