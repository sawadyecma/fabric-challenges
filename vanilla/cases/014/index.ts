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

const width = 200;
const height = 200;

const frame = { width, height };
const rect = new fabric.Rect({
  width,
  height,
  fill: "yellow",
});

const circle = new fabric.Circle({
  fill: "#FF00FF",
  stroke: "red",
  radius: 100,
  opacity: 1,
});
console.log(circle.width!);
console.log(circle.height!);

const ratio = calcInscribeRatio(frame, {
  width: circle.width!,
  height: circle.height!,
});

circle.set({ height: circle.height! * ratio, width: circle.width! * ratio });

const group = new fabric.Group([rect, circle], {
  width,
  height,
});

guiEditor.getFabricCanvas().on("object:scaling", (obj) => {
  const group = obj.target! as fabric.Group;
  const circle = group.getObjects()[1];
  console.log("circle", circle.width!, circle.height!);
  console.log("group", group.getScaledWidth(), group.getScaledHeight());

  const scaleX = circle.width! / group.getScaledWidth();
  const scaleY = circle.height! / group.getScaledHeight();

  console.log(`scaleX: ${scaleX}, scaleY: ${scaleY}`);

  circle.set({ scaleX, scaleY });
});

guiEditor.add(group);

addZoomControl(app, guiEditor);
addToSvgControl(app, guiEditor.getFabricCanvas());
export {};
