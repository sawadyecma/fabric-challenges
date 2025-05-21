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
  let lastTouchX = 0;
  let lastTouchY = 0;
  let isPanning = false;
  const ZOOM_THRESHOLD = 0.15; // ズーム検出の閾値（15%の変化）
  const GESTURE_DETECTION_TIME = 300; // ジェスチャー判定時間（ミリ秒）
  let gestureStartTime = 0;
  let isZooming = false;
  let initialTouchPoints: { x: number; y: number }[] = [];

  fabricCanvas.upperCanvasEl.addEventListener("touchstart", (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // 初期状態の記録
      gestureStartTime = Date.now();
      isZooming = false;
      isPanning = true;
      initialTouchPoints = [
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY },
      ];

      // 2点間の距離を計算
      initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      // 現在のズーム値を保存
      initialZoom = fabricCanvas.getZoom();

      // パン開始位置を記録
      lastTouchX = (touch1.clientX + touch2.clientX) / 2;
      lastTouchY = (touch1.clientY + touch2.clientY) / 2;
    }
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchmove", (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentTime = Date.now();

      // 現在の2点間の距離を計算
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      // 距離の変化率を計算
      const distanceRatio = currentDistance / initialDistance;
      const zoomChange = Math.abs(distanceRatio - 1);

      // ジェスチャー判定時間内の場合
      if (currentTime - gestureStartTime < GESTURE_DETECTION_TIME) {
        // 指の移動量を計算
        const touch1Movement = Math.hypot(
          touch1.clientX - initialTouchPoints[0].x,
          touch1.clientY - initialTouchPoints[0].y
        );
        const touch2Movement = Math.hypot(
          touch2.clientX - initialTouchPoints[1].x,
          touch2.clientY - initialTouchPoints[1].y
        );

        // 指の移動方向の変化を計算
        const initialVector = {
          x: initialTouchPoints[1].x - initialTouchPoints[0].x,
          y: initialTouchPoints[1].y - initialTouchPoints[0].y,
        };
        const currentVector = {
          x: touch2.clientX - touch1.clientX,
          y: touch2.clientY - touch1.clientY,
        };

        // ベクトルの角度変化を計算
        const angleChange = Math.abs(
          Math.atan2(currentVector.y, currentVector.x) -
            Math.atan2(initialVector.y, initialVector.x)
        );

        // ズーム判定
        if (zoomChange > ZOOM_THRESHOLD && angleChange < Math.PI / 4) {
          isZooming = true;
        }
      }

      // パン処理
      const currentX = (touch1.clientX + touch2.clientX) / 2;
      const currentY = (touch1.clientY + touch2.clientY) / 2;

      const deltaX = currentX - lastTouchX;
      const deltaY = currentY - lastTouchY;

      // ビューポートを移動
      const vpt = fabricCanvas.viewportTransform;
      if (vpt) {
        vpt[4] += deltaX;
        vpt[5] += deltaY;
      }

      lastTouchX = currentX;
      lastTouchY = currentY;

      // ズーム処理（ズーム判定が確定している場合のみ）
      if (isZooming) {
        const scale = distanceRatio * initialZoom;
        const limitedScale = Math.min(Math.max(scale, 0.1), 5);
        fabricCanvas.zoomToPoint(
          new Point(fabricCanvas.width / 2, fabricCanvas.height / 2),
          limitedScale
        );
      }

      fabricCanvas.requestRenderAll();
    }
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchend", () => {
    isPanning = false;
    isZooming = false;
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
