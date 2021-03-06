import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { prepareToSvgArea } from "../common/prepareToSvgArea";
import { composeSvg } from "../common/fabricModules/svg/svg";
import { Checkbox } from "../common/fabricModules/svg/checkbox";

const { app, canvasEl } = startHook();

const canvas = new fabric.Canvas(canvasEl, { backgroundColor: "grey" });

const redRect = new fabric.Rect({
  top: 100,
  left: 100,
  width: 20,
  height: 20,
  fill: "red",
});
canvas.add(redRect);

const blueRect = new fabric.Rect({
  top: 200,
  left: 200,
  width: 20,
  height: 20,
  borderColor: "black",
  hasBorders: true,
  fill: "blue",
  originX: "center",
  originY: "center",
});
canvas.add(blueRect);

const checkboxOff = await composeSvg();
checkboxOff.set({ left: 200, top: 0 });

canvas.add(checkboxOff);

const checkboxOff1 = new Checkbox(false);
checkboxOff1.set({ left: 200, top: 10 });
checkboxOff1.scaleToHeight(100);
checkboxOff1.scaleToWidth(200);
canvas.add(checkboxOff1);

const checkboxOn = new Checkbox(true);
checkboxOn.set({ left: 200, top: 40, scaleX: 2, scaleY: 3 });
canvas.add(checkboxOn);

const svgArea = prepareToSvgArea(app);

const toSvgButton = document.createElement("button");
toSvgButton.innerText = "toSvg";
toSvgButton.addEventListener("click", onToSvgButtonClick);
app.appendChild(toSvgButton);

function onToSvgButtonClick() {
  const svg = canvas.toSVG() ?? "";
  svgArea.innerHTML = svg;
}

const toggleCheckButton = document.createElement("button");
toggleCheckButton.innerText = "toggleCheckbox";
toggleCheckButton.addEventListener("click", onToggleCheckButtonClick);
app.appendChild(toggleCheckButton);

async function onToggleCheckButtonClick() {
  const cur = checkboxOn.getChecked();
  console.log(cur);
  await checkboxOn.setChecked(!cur);
  canvas.renderAll();
}

export {};
