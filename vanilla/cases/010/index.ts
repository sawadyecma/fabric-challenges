import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { GuiEditorCanvas } from "./GuiEditorCanvas";
import { composeImgEle } from "../common/fabricModules/img/imgEle";
import { addZoomControl } from "../common/fabricModules/hook-components/zoomControl";

const { app, canvasEl } = startHook();

const guiEditor = new GuiEditorCanvas(
  new fabric.Canvas(canvasEl, { backgroundColor: "grey" })
);

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

guiEditor.add(redRect);
guiEditor.add(blueRect);

const imgEle = await composeImgEle(
  "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
);
guiEditor.setBgImg(imgEle as HTMLImageElement);

addZoomControl(app, guiEditor);
export {};
