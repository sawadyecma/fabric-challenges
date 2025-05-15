import { Canvas, Rect } from "fabric";
import { Logger } from "../utils/logger";

export function render(container: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;

  container.appendChild(canvas);

  // fabric.jsのキャンバスを初期化
  const fabricCanvas = new Canvas(canvas);
  Logger.info("Canvas initialized");

  // 四角形を作成
  const rect = new Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    fill: "red",
    angle: 0,
  });

  rect.on("mousedown", () => {
    Logger.info("rect mousedown");
  });

  // キャンバスに四角形を追加
  fabricCanvas.add(rect);
  Logger.info("Rectangle added to canvas");

  // イベントのテスト
  fabricCanvas.on("mouse:down", (opt) => {
    Logger.info("mouse:down fired");
    Logger.info(`x: ${opt.pointer.x}, y: ${opt.pointer.y}`);
  });

  fabricCanvas.on("mouse:up", (opt) => {
    Logger.info("mouse:up fired");
    Logger.info(`x: ${opt.pointer.x}, y: ${opt.pointer.y}`);
  });

  fabricCanvas.on("mouse:move", (opt) => {
    Logger.info("mouse:move fired");
    Logger.info(`x: ${opt.pointer.x}, y: ${opt.pointer.y}`);
  });
}
