import { Canvas, Rect, Point, Pattern } from "fabric";
import { Logger } from "../utils/logger";

export function render(container: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  canvas.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  canvas.style.borderRadius = "4px";

  container.appendChild(canvas);

  // fabric.jsのキャンバスを初期化
  const fabricCanvas = new Canvas(canvas);
  Logger.info("Canvas initialized");

  // 方眼パターンを作成
  const gridSize = 20; // 方眼のサイズ
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = gridSize;
  patternCanvas.height = gridSize;
  const ctx = patternCanvas.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(gridSize, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, gridSize);
    ctx.stroke();
  }

  const gridPattern = new Pattern({
    source: patternCanvas,
    repeat: "repeat",
  });

  // 背景に方眼パターンを設定
  fabricCanvas.backgroundColor = gridPattern;
  fabricCanvas.renderAll();
  Logger.info("Grid pattern set as background");

  let initialDistance = 0;
  let initialZoom = 1;

  fabricCanvas.upperCanvasEl.addEventListener("touchstart", (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // 2点間の距離を計算
      initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      // 現在のズーム値を保存
      initialZoom = fabricCanvas.getZoom();
    }
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchmove", (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // 現在の2点間の距離を計算
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      // ズームスケールを計算
      const scale = (currentDistance / initialDistance) * initialZoom;

      // ズームの制限を設定（0.1から5倍の範囲）
      const limitedScale = Math.min(Math.max(scale, 0.1), 5);

      // キャンバスの中心を基準にズーム
      fabricCanvas.zoomToPoint(
        new Point(fabricCanvas.width / 2, fabricCanvas.height / 2),
        limitedScale
      );

      fabricCanvas.requestRenderAll();
    }
  });

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
}

export function docs() {
  return `
    <h3>方眼紙とズーム機能付きキャンバス</h3>
    <p>Fabric.jsを使用した基本的なキャンバス実装です。</p>
    
    <h4>機能</h4>
    <ul>
      <li>方眼紙パターンの背景</li>
      <li>ピンチズーム機能（タッチデバイス）</li>
      <li>基本的な図形（四角形）の配置</li>
      <li>マウスイベントのログ出力</li>
    </ul>

    <h4>使い方</h4>
    <ol>
      <li>キャンバス上でマウスをクリックしてイベントを確認</li>
      <li>タッチデバイスでピンチ操作してズーム</li>
      <li>配置された四角形をクリックしてイベントを確認</li>
    </ol>

    <h4>技術的な特徴</h4>
    <ul>
      <li>Patternを使用した背景パターン</li>
      <li>タッチイベントによるズーム制御</li>
      <li>イベントハンドリングとログ出力</li>
    </ul>
  `;
}
