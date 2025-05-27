import { Canvas, PencilBrush, Point } from "fabric";
import { Logger } from "../utils/logger";

// PencilBrushの状態を管理するstore
class PencilBrushStore {
  private _color: string = "#000000";
  private _width: number = 2;
  private _brush: PencilBrush | null = null;

  get color() {
    return this._color;
  }

  get width() {
    return this._width;
  }

  get brush() {
    return this._brush;
  }

  setBrush(brush: PencilBrush) {
    this._brush = brush;
    this.applySettings();
  }

  setColor(color: string) {
    this._color = color;
    if (this._brush) {
      this._brush.color = color;
    }
  }

  setWidth(width: number) {
    this._width = width;
    if (this._brush) {
      this._brush.width = width;
    }
  }

  private applySettings() {
    if (this._brush) {
      this._brush.color = this._color;
      this._brush.width = this._width;
    }
  }

  createNewBrush(canvas: Canvas): PencilBrush {
    const brush = new PencilBrush(canvas);
    this._brush = brush;
    this.applySettings();
    return brush;
  }
}

export function render(container: HTMLElement) {
  // Create canvas element
  const canvasElement = document.createElement("canvas");
  canvasElement.width = 400;
  canvasElement.height = 400;
  canvasElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  canvasElement.style.borderRadius = "4px";
  canvasElement.style.touchAction = "none";
  container.appendChild(canvasElement);

  const fabricCanvas = new Canvas(canvasElement, {
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
    isDrawingMode: true,
    selection: false,
    enableRetinaScaling: false,
  });

  // Create PencilBrush store
  const brushStore = new PencilBrushStore();
  const pencilBrush = brushStore.createNewBrush(fabricCanvas);
  fabricCanvas.freeDrawingBrush = pencilBrush;

  // Multi-touch variables
  let initialDistance = 0;
  let initialZoom = 1;
  let lastTouchX = 0;
  let lastTouchY = 0;
  const ZOOM_THRESHOLD = 0.15; // ズーム検出の閾値（15%の変化）
  const GESTURE_DETECTION_TIME = 300; // ジェスチャー判定時間（ミリ秒）
  let gestureStartTime = 0;
  let isZooming = false;
  let initialTouchPoints: { x: number; y: number }[] = [];
  let isMultiTouchActive = false;

  // Add multi-touch event handlers
  fabricCanvas.upperCanvasEl.addEventListener("touchstart", (e: TouchEvent) => {
    if (isMultiTouch(e)) {
      fabricCanvas.isDrawingMode = false;
      isMultiTouchActive = true;

      // 描画途中の線を削除するためにcontextTopをクリア
      fabricCanvas.clearContext(fabricCanvas.contextTop);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // 初期状態の記録
      gestureStartTime = Date.now();
      isZooming = false;
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
    } else {
      fabricCanvas.isDrawingMode = true;
    }
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchmove", (e: TouchEvent) => {
    if (isMultiTouch(e) || isMultiTouchActive) {
      fabricCanvas.isDrawingMode = false;
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

        // ズーム判定
        if (zoomChange > ZOOM_THRESHOLD) {
          isZooming = true;
        }
      }

      // パン処理（常に実行）
      const currentX = (touch1.clientX + touch2.clientX) / 2;
      const currentY = (touch1.clientY + touch2.clientY) / 2;

      const deltaX = currentX - lastTouchX;
      const deltaY = currentY - lastTouchY;

      // ズーム処理（ズーム判定が確定している場合のみ）
      if (isZooming) {
        const scale = distanceRatio * initialZoom;
        const limitedScale = Math.min(Math.max(scale, 1), 10);
        Logger.info("limitedScale: " + limitedScale);

        // Convert screen coordinates to canvas coordinates using absolutePointer
        const point = new Point(
          (touch1.clientX + touch2.clientX) / 2,
          (touch1.clientY + touch2.clientY) / 2
        );

        Logger.info("point: " + point.toString());
        fabricCanvas.zoomToPoint(point, limitedScale);
      }

      // ビューポートを移動
      const vpt = fabricCanvas.viewportTransform;
      if (vpt) {
        vpt[4] += deltaX;
        vpt[5] += deltaY;
      }

      lastTouchX = currentX;
      lastTouchY = currentY;

      fabricCanvas.requestRenderAll();
    }
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchend", (e) => {
    isZooming = false;

    const isMultiTouchEnd = (e: TouchEvent) => {
      return e.touches.length === 1;
    };

    const isSingleTouchEnd = (e: TouchEvent) => {
      return e.touches.length === 0;
    };

    if (isMultiTouchActive) {
      if (isSingleTouchEnd(e)) {
        isMultiTouchActive = false;
        // PencilBrushを新しいインスタンスに置き換え
        const newBrush = brushStore.createNewBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush = newBrush;
        fabricCanvas.requestRenderAll();
        // touchendでの点の描画を防ぐためにsetTimeoutを使用
        setTimeout(() => {
          fabricCanvas.isDrawingMode = true;
        }, 100);
      }
    }
  });

  fabricCanvas.on("before:path:created", (e) => {
    Logger.info("before:path:created");
  });
  fabricCanvas.on("path:created", (e) => {
    Logger.info("path:created");
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchstart", (_e) => {
    Logger.info("touchstart, length: " + _e.touches.length);
  });

  fabricCanvas.upperCanvasEl.addEventListener("touchmove", (_e) => {
    Logger.info("touchmove, length: " + _e.touches.length);
  });
  fabricCanvas.upperCanvasEl.addEventListener("touchend", (_e) => {
    Logger.info("touchend, length: " + _e.touches.length);
  });

  // Add tool buttons container
  const toolButtonsContainer = document.createElement("div");
  toolButtonsContainer.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  `;

  const penButton = document.createElement("button");
  penButton.textContent = "ペン";
  penButton.style.cssText = `
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #e0e0e0;
    cursor: pointer;
  `;
  penButton.onclick = () => {
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = brushStore.createNewBrush(fabricCanvas);
    penButton.style.backgroundColor = "#e0e0e0";
  };

  toolButtonsContainer.appendChild(penButton);
  container.appendChild(toolButtonsContainer);

  // Add clear button
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear Canvas";
  clearButton.style.marginBottom = "10px";
  clearButton.onclick = () => {
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
  };
  container.appendChild(clearButton);

  // Add additional event listeners for debugging
  canvasElement.addEventListener(
    "touchstart",
    (e) => {
      Logger.info("Native touchstart event on canvas element");
    },
    { passive: false }
  );

  canvasElement.addEventListener("mousedown", (e) => {
    Logger.info("Native mousedown event on canvas element");
  });

  fabricCanvas.renderAll();
  Logger.info("Canvas initialized with pencil brush drawing tool");
}

export function docs() {
  return `
 
  `;
}

const isMultiTouch = (e: TouchEvent) => {
  return e.touches.length > 1;
};
