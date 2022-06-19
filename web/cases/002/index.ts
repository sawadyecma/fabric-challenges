import { fabric } from "fabric";
import { startHook } from "../common/startHook";
import { Shape } from "./shape";

const { canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl);

canvas.add(
  //　男性本人
  new Shape({ gender: "male", kind: "self", len: 100 }, { left: 0, top: 0 }),
  //　男性
  new Shape(
    { gender: "male", kind: undefined, len: 100 },
    { left: 110, top: 0 }
  )
);

export {};
