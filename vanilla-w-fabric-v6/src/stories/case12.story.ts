import * as fabric from "fabric";
import { Canvas } from "fabric";

export function render(container: HTMLElement) {
  // Canvas要素
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 400;
  canvasEl.height = 300;
  canvasEl.style.border = "1px solid #ccc";
  container.appendChild(canvasEl);

  // fabric.Canvas初期化
  const canvas = new Canvas(canvasEl, {
    width: 800,
    height: 600,
    backgroundColor: "#fff",
  });

  // Group作成
  const group = new WritableRect();
  canvas.add(group);

  // stroke色変更UI
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = "#1976d2";
  colorInput.style.margin = "16px 8px 0 0";
  colorInput.oninput = () => {
    group.strokeColor = colorInput.value;
    // Groupの再計算は不要
    canvas.requestRenderAll();
  };

  // stroke幅変更UI
  const widthInput = document.createElement("input");
  widthInput.type = "range";
  widthInput.min = "1";
  widthInput.max = "64";
  widthInput.value = "4";
  widthInput.style.verticalAlign = "middle";
  widthInput.oninput = () => {
    group.setStrokeWidth(parseInt(widthInput.value, 10));
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

class WritableRect extends fabric.Group {
  private shape: fabric.Rect;
  private text: fabric.Textbox;
  constructor() {
    const shape = new fabric.Rect({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      fill: "red",
      stroke: "#1976d2",
      strokeWidth: 20,
      // rx: 8,
      // ry: 8,
      strokeUniform: true,
      // strokeWidth: 0,
    });
    const text = new fabric.Textbox("あいうえお", {
      // strokeWidth: 4,
      stroke: "yellow",
      fontSize: 18,
      fontFamily: "meiryo",
      // selectable: false,
      // evented: false,
      left: 0,
      top: 0,
    });

    console.log("WritableRect constructor called");
    super([], {
      // objectCaching: false,
      // strokeUniform: true,
      // includeDefaultValues: false,
    });
    this.add(shape);
    this.add(text);
    this.shape = shape;
    this.text = text;

    this.on("modified", () => {
      console.log("WritableRect modified");
      {
        const br = this.getBoundingRect();
        console.log("BoundingRect:", br);
      }
      this.triggerLayout();

      this.text.set({
        left: this.shape.left,
        top: this.shape.top,
      });

      console.log({
        shape: {
          left: this.shape.left,
          top: this.shape.top,
        },
      });

      console.log({
        text: {
          left: this.text.left,
          top: this.text.top,
        },
      });

      this.text.setCoords();
      this.setCoords();
      this.canvas?.requestRenderAll();

      {
        const br = this.getBoundingRect();
        console.log("BoundingRect:", br);
      }
      this.triggerLayout();

      console.log("WritableRect modified - text position updated");
    });
  }

  set strokeColor(v: string) {
    this.shape.set("stroke", v);
  }

  setStrokeWidth(v: number) {
    this.shape.strokeWidth = v;

    // Groupの境界を再計算するためremove/add
    this.remove(this.shape);
    this.add(this.shape);

    // Groupの座標を更新
    this.setCoords();

    this.bringObjectToFront(this.text);
  }
}
export function docs() {
  return "uniformStrokeを持つGroupの例。スケールすると余白が生まれてしまうのは、fabric.js固有の挙動。";
}
