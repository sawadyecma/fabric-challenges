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
  height: 100,
  width: 200,
};

const frameRect = new fabric.Rect({
  ...rectStyle,
  fill: "yellow",
});

const rect = new fabric.Rect({
  originX: "left",
  originY: "top",
  fill: "#FF00FF",
  stroke: "red",
  ...rectStyle,
  opacity: 1,
});

console.log(rect.width!);
console.log(rect.height!);

const ratio = calcInscribeRatio(rectStyle, {
  width: rect.width!,
  height: rect.height!,
});

rect.set({ width: rect.width! * ratio, height: rect.height! * ratio });

// const squareLen = Math.max(rect.width!, rect.height!);

const group = new fabric.Group([frameRect, rect], {
  ...rectStyle,
});

group.on("scaling", () => {
  console.log("rect", rect.width!, rect.height!);
  console.log("group", group.getScaledWidth(), group.getScaledHeight());

  const scaleX = rect.width! / group.getScaledWidth();
  const scaleY = rect.height! / group.getScaledHeight();

  console.log(`scaleX: ${scaleX}, scaleY: ${scaleY}`);

  const ratio = calcInscribeRatio(
    {
      width: group.getScaledWidth(),
      height: group.getScaledHeight(),
    },
    {
      width: rect.width!,
      height: rect.height!,
    }
  );

  // rect.set({
  //   scaleX,
  //   scaleY,
  // });

  rect.set({
    scaleX: scaleX * ratio,
    scaleY: scaleY * ratio,
  });

  rect.set("left", -rect.getScaledWidth() / 2);
  rect.set("top", -rect.getScaledHeight() / 2);
});

guiEditor.add(group);

addZoomControl(app, guiEditor);
addToSvgControl(app, guiEditor.getFabricCanvas());
export {};
