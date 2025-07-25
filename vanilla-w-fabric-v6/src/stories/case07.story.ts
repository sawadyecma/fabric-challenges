import { Canvas, PencilBrush, Point, IText, Textbox } from "fabric";
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

let currentTool: "pencil" | "text" | undefined = undefined;

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
      // fabricCanvas.isDrawingMode = true;
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
        // Logger.info("limitedScale: " + limitedScale);

        // Convert screen coordinates to canvas coordinates using absolutePointer
        const point = new Point(
          (touch1.clientX + touch2.clientX) / 2,
          (touch1.clientY + touch2.clientY) / 2
        );

        // Logger.info("point: " + point.toString());
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

  let basicLogging = false;

  if (basicLogging) {
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
  }

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
    textButton.style.backgroundColor = "#ffffff";
    currentTool = "pencil";
  };

  const textButton = document.createElement("button");
  textButton.textContent = "テキスト";
  textButton.style.cssText = `
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;
  `;
  textButton.onclick = () => {
    fabricCanvas.isDrawingMode = false;
    penButton.style.backgroundColor = "#ffffff";
    textButton.style.backgroundColor = "#e0e0e0";
    Logger.info("textButton clicked");
    currentTool = "text";
  };

  toolButtonsContainer.appendChild(penButton);
  toolButtonsContainer.appendChild(textButton);
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

  const textInput = document.createElement("textarea");
  textInput.style.cssText = `
    position: absolute;
    opacity: 0;
    z-index: -9999;
  `;
  container.appendChild(textInput);

  // Add text input functionality
  fabricCanvas.on("mouse:down", (options) => {
    if (!fabricCanvas.isDrawingMode && currentTool === "text") {
      const pointer = fabricCanvas.getViewportPoint(options.e);
      // Textbox or IText ?
      const text = new Textbox("テキストを入力", {
        left: pointer.x,
        top: pointer.y,
        fontFamily: "Arial",
        fontSize: 20,
        fill: "#000000",
        editable: true,
      });

      fabricCanvas.on("text:editing:entered", (opt) => {
        const textbox = opt.target;
        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);

        // canvas上の座標に表示
        const rect = fabricCanvas.getElement().getBoundingClientRect();
        textarea.style.position = "absolute";
        textarea.style.left = `${rect.left + textbox.left}px`;
        textarea.style.top = `${rect.top + textbox.top}px`;
        textarea.style.font = "16px sans-serif";
        textarea.style.zIndex = "10000";
        textarea.style.opacity = "0";
        textarea.style.width = "100px";
        textarea.style.height = "20px";

        textarea.focus();

        // on blur -> remove textarea, update fabric text
      });

      // 入力イベントのハンドリング
      textInput.addEventListener("input", (e) => {
        const target = e.target as HTMLTextAreaElement;
        text.set("text", target.value);
        fabricCanvas.requestRenderAll();
      });

      // 入力完了時の処理
      textInput.addEventListener("blur", () => {
        text.exitEditing();
        fabricCanvas.requestRenderAll();
      });

      textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          textInput.blur();
        }
      });

      fabricCanvas.add(text);
      text.enterEditing();
      fabricCanvas.setActiveObject(text);

      currentTool = undefined;
      fabricCanvas.isDrawingMode = false;
    }
  });

  fabricCanvas.renderAll();
  Logger.info("Canvas initialized with pencil brush drawing tool");

  function setupKeyboardDetection(
    onShow: (activeEle: HTMLTextAreaElement | null) => void,
    onHide: () => void
  ) {
    let lastViewportHeight =
      window.visualViewport?.height ?? window.innerHeight;
    let activeElementIsInput = false;

    let activeEle: HTMLTextAreaElement | null = null;

    // 入力要素にフォーカスが当たったかを追跡
    document.addEventListener("focusin", () => {
      const active = document.activeElement;
      activeElementIsInput =
        (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) ||
        activeElementIsInput;
      if (activeElementIsInput) {
        Logger.info("focusin");
        activeEle = active as HTMLTextAreaElement | null;
      }
    });

    document.addEventListener("focusout", () => {
      Logger.info("focusout");
      activeElementIsInput = false;
      activeEle = null;
    });

    window.visualViewport?.addEventListener("resize", () => {
      const currentHeight = window.visualViewport?.height ?? window.innerHeight;
      const diff = lastViewportHeight - currentHeight;

      if (activeElementIsInput && diff > 150) {
        onShow(activeEle);
      } else if (!activeElementIsInput && diff < -150) {
        onHide();
      }

      lastViewportHeight = currentHeight;
    });
  }

  // 使用例
  setupKeyboardDetection(
    (activeEle) => {
      const rect = activeEle?.getBoundingClientRect();
      if (rect && window.visualViewport) {
        // テキストエリアの中心Y座標
        const textareaCenterY = rect.top + rect.height / 2;
        // ビューポートの中央Y座標
        const viewportCenterY = window.visualViewport.height / 2;
        // スクロール量を計算
        const scrollY = window.scrollY + textareaCenterY - viewportCenterY;
        window.scrollTo({
          top: scrollY,
          behavior: "smooth",
        });
      }
      Logger.warn("🔼 キーボード表示");
    },
    () => Logger.warn("🔽 キーボード非表示")
  );
}

export function docs() {
  return `
# case07: Fabric.js キャンバスのマルチタッチ・テキスト入力・キーボード対応

- Fabric.jsのCanvas上でペン描画・テキスト入力ができます。
- ペン/テキスト切り替えボタン、キャンバスクリアボタン付き。
- 2本指でピンチズーム・パン操作が可能です。
- テキスト入力時、キーボードが表示されたらテキストエリアが画面中央に来るよう自動スクロールします。
- iOS/Androidのソフトウェアキーボード表示/非表示も検知し、ログ表示します。
- ログは画面上部に常時表示され、トグルで非表示にもできます。

## 主な実装ポイント
- Fabric.jsの\`freeDrawingBrush\`をカスタマイズし、色・太さを管理
- マルチタッチでズーム・パンを実装（2点間距離・中心座標の変化で判定）
- テキスト入力時はhiddenTextareaの位置を検知し、キーボード表示時に中央へスクロール
- \`visualViewport\`のリサイズイベントでキーボード表示/非表示を検知
- Loggerで各種イベントを可視化

\`src/stories/case07.story.ts\` を参照してください。
\`src/utils/logger.ts\` でログUIを制御しています。
`;
}

const isMultiTouch = (e: TouchEvent) => {
  return e.touches.length > 1;
};
