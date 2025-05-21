import { Canvas, PencilBrush, Point } from "fabric";
import { Logger } from "../utils/logger";

// Convert linear slider value (0-100) to exponential value (0.1-500)
const linearToExponential = (value: number): number => {
  const min = 0.1;
  const max = 50;
  // より緩やかな指数関数を使用
  const scale = (max - min) / (Math.exp(2) - 1);
  return min + scale * (Math.exp(value / 50) - 1);
};

// PencilBrushの状態を管理するstore
class PencilBrushStore {
  private _color: string = "#000000";
  private _width: number = 2;
  private _decimate: number = 0.4;
  private _brush: PencilBrush | null = null;

  get color() {
    return this._color;
  }

  get width() {
    return this._width;
  }

  get decimate() {
    return this._decimate;
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

  setDecimate(decimate: number) {
    this._decimate = decimate;
    if (this._brush) {
      this._brush.decimate = decimate;
    }
  }

  private applySettings() {
    if (this._brush) {
      this._brush.color = this._color;
      this._brush.width = this._width;
      this._brush.decimate = this._decimate;
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

  // Initialize Fabric.js canvas
  const fabricCanvas = new Canvas(canvasElement, {
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
    isDrawingMode: true,
    selection: false,
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
      // 描画中の線を削除
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

  // Add color picker
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = brushStore.color;
  colorPicker.style.marginBottom = "10px";

  colorPicker.onfocus = () => {
    fabricCanvas.isDrawingMode = false;
  };

  colorPicker.onblur = () => {
    fabricCanvas.isDrawingMode = true;
  };

  colorPicker.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    brushStore.setColor(target.value);
    fabricCanvas.isDrawingMode = true;
  };

  container.appendChild(colorPicker);

  // Add color buttons
  const colorButtonsContainer = document.createElement("div");
  colorButtonsContainer.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  `;

  const colors = [
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00" },
    { name: "Blue", value: "#0000ff" },
  ];

  // Add loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 8px;
    display: none;
    z-index: 1000;
  `;
  loadingIndicator.innerHTML = `
    <div style="
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  container.appendChild(loadingIndicator);

  colors.forEach((color) => {
    const button = document.createElement("button");
    button.textContent = color.name;
    button.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: ${color.value};
      color: white;
      cursor: pointer;
    `;

    button.onpointerdown = (e) => {
      e.preventDefault();
      Logger.info("Color button clicked");

      // Show loading indicator
      loadingIndicator.style.display = "block";

      // Simulate 300ms delay
      setTimeout(() => {
        brushStore.setColor(color.value);
        colorPicker.value = color.value;
        fabricCanvas.isDrawingMode = true;
        Logger.info(
          `Canvas state after color change - isDrawingMode: ${fabricCanvas.isDrawingMode}`
        );

        // Hide loading indicator
        loadingIndicator.style.display = "none";
      }, 300);
    };

    colorButtonsContainer.appendChild(button);
  });

  container.appendChild(colorButtonsContainer);

  // Add brush size control
  const sizeControl = document.createElement("input");
  sizeControl.type = "range";
  sizeControl.min = "1";
  sizeControl.max = "20";
  sizeControl.value = brushStore.width.toString();
  sizeControl.style.marginBottom = "10px";
  sizeControl.style.width = "100%";
  sizeControl.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    brushStore.setWidth(parseInt(target.value));
  };
  container.appendChild(sizeControl);

  // Add decimate control
  const decimateContainer = document.createElement("div");
  decimateContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  `;

  const decimateLabel = document.createElement("label");
  decimateLabel.textContent = "Decimate:";
  decimateLabel.style.minWidth = "80px";

  const decimateValue = document.createElement("span");
  decimateValue.textContent = brushStore.decimate.toString();
  decimateValue.style.minWidth = "60px";
  decimateValue.style.textAlign = "right";

  const decimateControl = document.createElement("input");
  decimateControl.type = "range";
  decimateControl.min = "0";
  decimateControl.max = "100";
  decimateControl.value = brushStore.decimate.toString();
  decimateControl.style.flex = "1";
  decimateControl.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const linearValue = parseInt(target.value);
    const exponentialValue = linearToExponential(linearValue);
    brushStore.setDecimate(exponentialValue);
    decimateValue.textContent = exponentialValue.toFixed(1);
  };

  decimateContainer.appendChild(decimateLabel);
  decimateContainer.appendChild(decimateControl);
  decimateContainer.appendChild(decimateValue);
  container.appendChild(decimateContainer);

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
    <h3>カラーピッカー付きペン</h3>
    <p>Fabric.jsのPencilBrushを使用した描画ツールです。</p>
    
    <h4>機能</h4>
    <ul>
      <li>自由な描画</li>
      <li>カラーピッカーによる色の選択</li>
      <li>ブラシサイズの調整（1-20px）</li>
      <li>Decimate値の調整（0.1-500）</li>
      <li>キャンバスクリア機能</li>
    </ul>

    <h4>使い方</h4>
    <ol>
      <li>カラーピッカーで色を選択</li>
      <li>スライダーでブラシの太さを調整</li>
      <li>Decimateスライダーで描画の滑らかさを調整（指数関数的な変化）</li>
      <li>キャンバス上で描画</li>
      <li>必要に応じて「Clear Canvas」でリセット</li>
    </ol>

    <h4>技術的な特徴</h4>
    <ul>
      <li>PencilBrushによる滑らかな描画</li>
      <li>カラーピッカーフォーカス時の描画制御</li>
      <li>指数関数的なDecimate値の制御（0.1-1の範囲で細かい制御が可能）</li>
      <li>レスポンシブなUI</li>
    </ul>
  `;
}

const isMultiTouch = (e: TouchEvent) => {
  return e.touches.length > 1;
};
