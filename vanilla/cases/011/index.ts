import { startHook } from "../common/startHook";
import { GuiEditorCanvas } from "./GuiEditorCanvas";
import { composeImgEle } from "../common/fabricModules/img/imgEle";
import { Menu } from "../common/fabricModules/grp/menu";

const { app, canvasEl } = startHook();

const guiEditor = new GuiEditorCanvas(canvasEl, onObjectMovingCallback);

const imgEle = await composeImgEle(
  "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
);
guiEditor.setBgImg(imgEle as HTMLImageElement);

const menu1 = new Menu("メニュー", { left: 100, top: 100 }, onMenuOpen);

guiEditor.add(menu1);

const selector = document.createElement("div");
["メニュー1", "メニュー2", "メニュー3"].forEach((m) => {
  const input = document.createElement("input");
  input.type = "radio";
  input.name = "menu";
  input.value = m;
  input.addEventListener("change", onMenuClick);
  const label = document.createElement("label");
  label.innerText = m;
  label.setAttribute("for", m);
  const div = document.createElement("div");
  div.appendChild(input);
  div.appendChild(label);
  selector.appendChild(div);
  selector.style.display = "none";
});
app.append(selector);

let opened = false;

function onMenuClick(e: any) {
  console.log("menuClick");
  menu1.setText(e.target.value);
  guiEditor.renderAll();
  opened = false;
  selector.style.display = "none";
}

function onMenuOpen(cood: { x: number; y: number }) {
  opened = !opened;
  console.log("onMenuOpen");
  selector.style.display = opened ? "block" : "none";
  selector.style.position = "absolute";

  const { left, top } = canvasEl.getClientRects()[0];

  const x = left + cood.x;
  const y = top + cood.y;

  selector.style.left = `${x}px`;
  selector.style.top = `${y}px`;
}

function onObjectMovingCallback() {
  selector.style.display = "none";
  opened = false;
}
//
//
//
{
  let zoom = 1;

  const zoomDownButton = document.createElement("button");
  zoomDownButton.innerText = "zoomDown";
  zoomDownButton.addEventListener("click", onZoomDownButtonClick);
  app.appendChild(zoomDownButton);

  function onZoomDownButtonClick() {
    zoom -= 0.1;
    // canvas.setZoom(zoom);
    guiEditor.zoom(zoom);
    // canvas.zoomToPoint(new fabric.Point(100, 100), zoom);
  }

  const zoomUpButton = document.createElement("button");
  zoomUpButton.innerText = "zoomUp";
  zoomUpButton.addEventListener("click", onZoomUpButtonClick);
  app.appendChild(zoomUpButton);

  function onZoomUpButtonClick() {
    zoom += 0.1;
    // canvas.setZoom(zoom);
    guiEditor.zoom(zoom);

    // canvas.zoomToPoint(new fabric.Point(100, 100), zoom);
  }
}
export {};
