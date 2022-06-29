import { startHook } from "../common/startHook";
import { GuiEditorCanvas } from "./GuiEditorCanvas";
import { composeImgEle } from "../common/fabricModules/img/imgEle";
import { Menu } from "../common/fabricModules/grp/menu";
import { addZoomControl } from "../common/fabricModules/hook-components/zoomControl";
import { addToSvgControl } from "../common/fabricModules/hook-components/toSvg";

const { app, canvasEl } = startHook();

const guiEditor = new GuiEditorCanvas(canvasEl);

const imgEle = await composeImgEle(
  "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
);
guiEditor.setBgImg(imgEle as HTMLImageElement);

const menu1 = new Menu(
  "メニュー",
  { left: 100, top: 100 },
  onMenuOpen,
  onMenuMoving,
  onMenuDeselected
);

guiEditor.add(menu1);

const menu2 = new Menu(
  "メニュー",
  { left: 200, top: 100 },
  onMenuOpen,
  onMenuMoving,
  onMenuDeselected
);

guiEditor.add(menu2);

const selector = document.createElement("div");
[...new Array(10)].forEach((_, i) => {
  const menuName = `メニュー${i + 1}`;
  const input = document.createElement("input");
  input.type = "radio";
  input.name = "menu";
  input.value = menuName;
  input.addEventListener("change", onMenuClick);
  const label = document.createElement("label");
  label.innerText = menuName;
  label.setAttribute("for", menuName);
  const div = document.createElement("div");
  div.appendChild(input);
  div.appendChild(label);
  selector.appendChild(div);
  selector.style.display = "none";
  selector.style.height = "100px";
  selector.style.overflowX = "auto";
});

app.append(selector);

let opened = false;

let targetMenu: Menu | undefined = undefined;

function onMenuClick(e: any) {
  if (!targetMenu) {
    return;
  }
  targetMenu.setText(e.target.value);
  guiEditor.renderAll();
}

function onMenuDeselected() {
  opened = false;
  selector.style.display = "none";
}

function onMenuOpen(self: Menu, cood: { x: number; y: number }) {
  opened = !opened;
  console.log("onMenuOpen");
  selector.style.display = opened ? "block" : "none";
  selector.style.position = "absolute";

  const { left, top } = canvasEl.getClientRects()[0];

  const x = left + cood.x;
  const y = top + cood.y;

  selector.style.left = `${x}px`;
  selector.style.top = `${y}px`;
  targetMenu = self;
}

function onMenuMoving(cood: { x: number; y: number }) {
  const { left, top } = canvasEl.getClientRects()[0];

  const x = left + cood.x;
  const y = top + cood.y;

  selector.style.left = `${x}px`;
  selector.style.top = `${y}px`;
}

addZoomControl(app, guiEditor);
addToSvgControl(app, guiEditor.getFabricCanvas());
export {};
