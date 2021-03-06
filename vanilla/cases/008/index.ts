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

const seal2 = new Seal(
  { x: 300, y: 100, len: 100 },
  undefined,
  undefined,
  () => {
    seal2.press(pressedSealImageEle);
  },
  () => {
    canvas.renderAll();
  }
);

canvas.add(seal2);

const svgArea = prepareToSvgArea(app);

const toSvgButton = document.createElement("button");
toSvgButton.innerText = "toSvg";
toSvgButton.addEventListener("click", onToSvgButtonClick);
app.appendChild(toSvgButton);

function onToSvgButtonClick() {
  const svg = canvas.toSVG() ?? "";
  svgArea.innerHTML = svg;
  const cood = seal.exportCood();
  console.log(cood);
}

const toggleEditableButton = document.createElement("button");
toggleEditableButton.innerText = "toggleEditable";
toggleEditableButton.addEventListener("click", onToggleEditableButtonClick);
app.appendChild(toggleEditableButton);

let editable = true;

function onToggleEditableButtonClick() {
  editable = !editable;
  (canvas.getObjects() as Seal[]).forEach((obj) => {
    obj.setEditable(editable);
  });
}

export {};
