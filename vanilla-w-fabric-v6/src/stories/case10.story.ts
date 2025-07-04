import { Canvas, Rect } from "fabric";

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
    left: 100,
    top: 80,
    width: 120,
    height: 80,
    fill: "#e3f2fd",
    stroke: "#1976d2",
    strokeWidth: 4,
    rx: 8,
    ry: 8,
  });
  canvas.add(rect);

  // stroke色変更UI
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = "#1976d2";
  colorInput.style.margin = "16px 8px 0 0";

  colorInput.oninput = (e) => {
    rect.set("stroke", colorInput.value);
    canvas.requestRenderAll();
  };

  // stroke幅変更UI
  const widthInput = document.createElement("input");
  widthInput.type = "range";
  widthInput.min = "1";
  widthInput.max = "20";
  widthInput.value = "4";
  widthInput.style.verticalAlign = "middle";
  widthInput.oninput = () => {
    rect.set("strokeWidth", parseInt(widthInput.value, 10));
    const acitveObj = canvas.getActiveObject();
    canvas.discardActiveObject();

    if (acitveObj) {
      canvas.setActiveObject(acitveObj); // アクティブにしたい場合
    }
    canvas.requestRenderAll();
  };

  const label = document.createElement("label");
  label.textContent = "stroke: ";
  label.appendChild(colorInput);
  label.appendChild(document.createTextNode(" 幅: "));
  label.appendChild(widthInput);
  container.appendChild(label);
}
