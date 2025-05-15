import { Canvas, Rect } from "fabric";

export function render(container: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;

  container.appendChild(canvas);

  // fabric.jsのキャンバスを初期化
  const fabricCanvas = new Canvas(canvas);

  // 四角形を作成
  const rect = new Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    fill: "red",
    angle: 0,
  });

  // キャンバスに四角形を追加
  fabricCanvas.add(rect);
}
