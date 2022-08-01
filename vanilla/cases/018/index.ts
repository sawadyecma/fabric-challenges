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

[...Array(100)].forEach((_, index) => {
  const fText = new fabric.Text(`fontSize:${index + 1}`, {
    left: 0,
    top: index * 20,
    fontSize: index + 1,
  });
  guiEditor.add(fText);
});

addZoomControl(app, guiEditor);
addToSvgControl(app, guiEditor.getFabricCanvas());
export {};
