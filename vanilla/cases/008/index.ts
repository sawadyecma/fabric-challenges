import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { prepareToSvgArea } from "../common/prepareToSvgArea";
import { Seal } from "../common/fabricModules/img/seal";
import { composeImgEle } from "../common/fabricModules/img/imgEle";

const { app, canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl, { backgroundColor: "grey" });

const pressedSealImageEle = (await composeImgEle(
  "/icons/seal/pressed.png"
)) as HTMLImageElement;

const seal = new Seal(
  { x: 100, y: 100, len: 100 },
  undefined,
  undefined,
  () => {
    seal.press(pressedSealImageEle);
  },
  () => {
    canvas.renderAll();
  }
);

canvas.add(seal);

const svgArea = prepareToSvgArea(app);

const toSvgButton = document.createElement("button");
toSvgButton.innerText = "toSvg";
toSvgButton.addEventListener("click", onToSvgButtonClick);
app.appendChild(toSvgButton);

function onToSvgButtonClick() {
  const svg = canvas.toSVG() ?? "";
  svgArea.innerHTML = svg;
}

export {};
