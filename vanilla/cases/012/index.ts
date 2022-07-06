import { startHook } from "../common/startHook";
import { GuiEditorCanvas } from "./GuiEditorCanvas";
import { composeImgEle } from "../common/fabricModules/img/imgEle";
import { addZoomControl } from "../common/fabricModules/hook-components/zoomControl";
import { addToSvgControl } from "../common/fabricModules/hook-components/toSvg";
import { fabric } from "fabric";

const { app, canvasEl } = startHook();

const guiEditor = new GuiEditorCanvas(canvasEl);

const imgEle = await composeImgEle(
  "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
);
guiEditor.setBgImg(imgEle as HTMLImageElement);

const rect = new fabric.Rect({
  left: 100,
  top: 100,
  width: 100,
  height: 200,
  fill: "red",
});
guiEditor.add(rect);

const cat = await composeImgEle("/cat.png");
const transparentImage = new fabric.Image(cat, {
  left: 100,
  top: 100,
  width: 1000,
  height: 1000,
  selectable: false,
  evented: false,
});
guiEditor.add(transparentImage);

addZoomControl(app, guiEditor);
addToSvgControl(app, guiEditor.getFabricCanvas());
export {};
