import * as fabric from "fabric";
import { Canvas, Rect, Group, Textbox } from "fabric";

export function render(container: HTMLElement) {
  // Canvas要素
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 400;
  canvasEl.height = 300;
  canvasEl.style.border = "1px solid #ccc";
  container.appendChild(canvasEl);

  // fabric.Canvas初期化
  const canvas = new Canvas(canvasEl, {
    width: 400,
    height: 300,
    backgroundColor: "#fff",
  });

  // Rect作成
  const rect = new Rect({
    left: 0,
    top: 0,
    width: 120,
    height: 80,
    fill: "red",
    stroke: "#1976d2",
    strokeWidth: 4,
    rx: 8,
    ry: 8,
  });

  const text = new Textbox("あいうえお", {
    // strokeWidth: 4,
    stroke: "yellow",
    fontSize: 18,
    fontFamily: "meiryo",
    selectable: false,
    evented: false,
    left: 0,
    top: 0,
  });

  // Group作成
  const group = new Group([rect, text], {
    left: 100,
    top: 80,
  });
  canvas.add(group);

  // stroke色変更UI
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = "#1976d2";
  colorInput.style.margin = "16px 8px 0 0";
  colorInput.oninput = () => {
    rect.set("stroke", colorInput.value);
    // Groupの再計算は不要
    canvas.requestRenderAll();
  };

  // stroke幅変更UI
  const widthInput = document.createElement("input");
  widthInput.type = "range";
  widthInput.min = "1";
  widthInput.max = "32";
  widthInput.value = "4";
  widthInput.style.verticalAlign = "middle";
  widthInput.oninput = () => {
    rect.set("strokeWidth", parseInt(widthInput.value, 10));
    // Groupの境界を再計算するためremove/add
    group.remove(rect);
    group.add(rect);
    group.bringObjectToFront(text);
    // group._calcBounds()の代わりにgroup._updateObjectsCoords()とgroup.setCoords()を呼ぶ
    // if (typeof (group as any)._updateObjectsCoords === "function") {
    //   (group as any)._updateObjectsCoords();
    // }
    // group.setCoords();
    canvas.requestRenderAll();
  };

  const label = document.createElement("label");
  label.textContent = "stroke: ";
  label.appendChild(colorInput);
  label.appendChild(document.createTextNode(" 幅: "));
  label.appendChild(widthInput);
  container.appendChild(label);
}
