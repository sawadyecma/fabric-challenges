import { startHook } from "../common/startHook";
import { GuiEditorCanvas } from "./GuiEditorCanvas";
import { composeImgEle } from "../common/fabricModules/img/imgEle";
import { addZoomControl } from "../common/fabricModules/hook-components/zoomControl";
import { addToSvgControl } from "../common/fabricModules/hook-components/toSvg";
import { fabric } from "fabric";
import { calcInscribeRatio } from "../common/inscribe";

const { app, canvasEl } = startHook();

const guiEditor = new GuiEditorCanvas(canvasEl);

const imgEle = await composeImgEle(
  "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
);
guiEditor.setBgImg(imgEle as HTMLImageElement);

const rectStyle = {
  height: 400,
  width: 100,
};

const frameRect = new fabric.Rect({
  ...rectStyle,
  fill: "yellow",
});

const catImgEle = await composeImgEle("/cat.png");
const rect = new fabric.Image(catImgEle, {
  originX: "left",
  originY: "top",
  fill: "#FF00FF",
  stroke: "red",
  width: catImgEle.width,
  height: catImgEle.height,
});

const ratio = calcInscribeRatio(rectStyle, {
  width: rect.width!,
  height: rect.height!,
});

rect.scale(ratio);

const baseImgSize = {
  width: rect.getScaledWidth(),
  height: rect.getScaledHeight(),
};

console.log(rect.scaleX, rect.scaleY);

const imgDefaultScale = {
  scaleX: rect.scaleX!,
  scaleY: rect.scaleY!,
};

const group = new fabric.Group([frameRect, rect], {
  ...rectStyle,
});

rect.set({
  left: frameRect.left! + frameRect.width! / 2 - rect.getScaledWidth() / 2,
  top: frameRect.top! + frameRect.height! / 2 - rect.getScaledHeight() / 2,
});

const defaultGroupSize = {
  width: group.getScaledWidth(),
  height: group.getScaledHeight(),
};

group.on("scaling", () => {
  const scaleX = group.getScaledWidth() / defaultGroupSize.width;
  const scaleY = group.getScaledHeight() / defaultGroupSize.height;

  const ratio = calcInscribeRatio(
    {
      width: group.getScaledWidth(),
      height: group.getScaledHeight(),
    },
    {
      width: baseImgSize.width!,
      height: baseImgSize.height!,
    }
  );

  rect.set({
    scaleX: (1 / scaleX) * imgDefaultScale.scaleX * ratio,
    scaleY: (1 / scaleY) * imgDefaultScale.scaleY * ratio,
  });

  rect.set("left", -rect.getScaledWidth() / 2);
  rect.set("top", -rect.getScaledHeight() / 2);
});

guiEditor.add(group);

addZoomControl(app, guiEditor);
addToSvgControl(app, guiEditor.getFabricCanvas());
export {};
