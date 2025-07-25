import { Canvas, Textbox, Rect, Group, Circle } from "fabric";
import { Snowman } from "../lib/snowman";

export function render(container: HTMLElement) {
  // Canvas要素
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 400;
  canvasEl.height = 300;
  canvasEl.style.border = "1px solid #ccc";
  container.appendChild(canvasEl);

  // fabric.Canvas初期化
  const canvas = new Canvas(canvasEl, {
    width: 300,
    height: 200,
    backgroundColor: "#fff",
  });

  const addTextAndRect = () => {
    const text = new Textbox("Hello, Fabric!", {
      left: 100,
      top: 100,
      fill: "red",
    });
    canvas.add(text);

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "blue",
    });
    canvas.add(rect);
  };

  // addTextAndRect();

  const addSampleGroup = () => {
    const group = new Group();

    group.add(
      new Rect({
        left: 50,
        top: 50,
        width: 50,
        height: 50,
        fill: "green",
      })
    );
    group.add(
      new Circle({
        left: 50,
        top: 100,
        radius: 25,
        fill: "red",
      })
    );

    canvas.add(group);
  };

  // addSampleGroup();

  const snowman = new Snowman([], {
    left: 0,
    top: 0,
  });

  canvas.add(snowman);

  const jsonArea = document.createElement("textarea");
  jsonArea.style.width = "100%";
  jsonArea.style.height = "200px";
  container.appendChild(jsonArea);

  const jsonButton = document.createElement("button");
  jsonButton.textContent = "JSON出力";
  jsonButton.onclick = () => {
    jsonArea.value = JSON.stringify(canvas.toJSON(), null, 2);
  };

  const restoreButton = document.createElement("button");
  restoreButton.textContent = "JSON復元";
  restoreButton.onclick = () => {
    const json = JSON.parse(jsonArea.value);
    canvas.loadFromJSON(json);
    canvas.requestRenderAll();
  };

  container.appendChild(jsonButton);
  container.appendChild(restoreButton);
}

export function docs() {
  return `
    JSONの出力、復元に関するサンプル
  `;
}
