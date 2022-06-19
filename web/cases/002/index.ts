import { fabric } from "fabric";
import { startHook } from "../common/startHook";

const { app, canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl);

const male = new fabric.Rect({
  width: 100,
  height: 100,
  fill: undefined,
  strokeWidth: 5,
  stroke: "black",
});

const female = new fabric.Circle({
  width: 100,
  height: 100,
  fill: undefined,
  radius: 50,
  strokeWidth: 5,
  stroke: "black",
});

const persons: fabric.Object[] = [male, female];

persons.forEach((person, i) => {
  person.set({ left: i * 100 });
  canvas.add(person);
});

export {};
