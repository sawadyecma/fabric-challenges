import { startHook } from "../common/startHook";
import { fabric } from "fabric";
import { prepareToSvgArea } from "../common/prepareToSvgArea";
import { Checkbox } from "../common/fabricModules/img/checkbox";
import { Menu } from "../common/fabricModules/grp/menu";

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

const checkboxOff1 = new Checkbox(false, undefined, (checked: boolean) => {
  checkboxOff1.setChecked(checked);
  canvas.renderAll();
});

checkboxOff1.set({ left: 200, top: 200 });
canvas.add(checkboxOff1);

const checkboxOn = new Checkbox(true, undefined, (checked: boolean) => {
  checkboxOn.setChecked(checked);
  canvas.renderAll();
});
checkboxOn.set({ left: 200, top: 40 });
canvas.add(checkboxOn);

const menus = [
  "メニューあいうえ1",
  "メニューさしすせ2",
  "メニュー3",
  "メニュー4",
];
const menu = new Menu("メニュー1", { left: 100, top: 100 }, () => {
  const mTxt = menus[Math.floor(Math.random() * menus.length)];
  menu.setText(mTxt);

  canvas.renderAll();
});

canvas.add(menu);

const menu2 = new Menu("メニュー2", undefined, () => {
  const mTxt = menus[Math.floor(Math.random() * menus.length)];
  menu2.setText(mTxt);

  canvas.renderAll();
});

canvas.add(menu2);

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
