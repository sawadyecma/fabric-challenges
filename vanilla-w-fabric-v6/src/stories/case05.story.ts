import * as fabric from "fabric";

export function render(container: HTMLElement) {
  const canvasDom = document.createElement("canvas");
  container.appendChild(canvasDom);

  // Canvasの初期化
  const canvas = new fabric.Canvas(canvasDom, {
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
  });

  // 消しゴム用のレイヤーを作成
  const eraserCanvas = document.createElement("canvas");
  eraserCanvas.width = 800;
  eraserCanvas.height = 600;
  const eraserCtx = eraserCanvas.getContext("2d");
  if (!eraserCtx) return;
  container.appendChild(eraserCanvas);

  // 消しゴムの設定
  const eraserSize = 20;
  let isErasing = false;

  // 鉛筆ブラシの設定
  const pencilBrush = new fabric.PencilBrush(canvas);
  pencilBrush.color = "#000000";
  pencilBrush.width = 2;

  // 描画モードの管理
  let isEraserMode = false;

  // ツールボタンの作成
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginBottom = "10px";

  const pencilButton = document.createElement("button");
  pencilButton.textContent = "鉛筆";
  pencilButton.style.marginRight = "10px";
  pencilButton.onclick = () => {
    isEraserMode = false;
    canvas.freeDrawingBrush = pencilBrush;
    canvas.isDrawingMode = true;
  };

  const eraserButton = document.createElement("button");
  eraserButton.textContent = "消しゴム";
  eraserButton.onclick = () => {
    isEraserMode = true;
    canvas.isDrawingMode = false;
  };

  buttonContainer.appendChild(pencilButton);
  buttonContainer.appendChild(eraserButton);
  container.appendChild(buttonContainer);

  // 消しゴム機能の実装
  canvas.on("mouse:down", (options) => {
    if (isEraserMode) {
      isErasing = true;
      const pointer = canvas.getPointer(options.e);
      eraserCtx.beginPath();
      eraserCtx.arc(pointer.x, pointer.y, eraserSize / 2, 0, Math.PI * 2);
      eraserCtx.fill();
      applyEraser();
    }
  });

  canvas.on("mouse:move", (options) => {
    if (isEraserMode && isErasing) {
      const pointer = canvas.getPointer(options.e);
      eraserCtx.beginPath();
      eraserCtx.arc(pointer.x, pointer.y, eraserSize / 2, 0, Math.PI * 2);
      eraserCtx.fill();
      applyEraser();
    }
  });

  canvas.on("mouse:up", () => {
    isErasing = false;
  });

  // 消しゴムの適用
  function applyEraser() {
    const ctx = canvas.getContext();
    if (!ctx) return;

    // 現在のCanvasの内容を一時的に保存
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // 現在のCanvasの内容をコピー
    tempCtx.drawImage(canvasDom, 0, 0);

    // 消しゴムレイヤーを適用
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(eraserCanvas, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    // 元の内容を復元
    ctx.drawImage(tempCanvas, 0, 0);
  }

  // 初期状態で鉛筆モードを有効化
  canvas.freeDrawingBrush = pencilBrush;
  canvas.isDrawingMode = true;
}

export function docs() {
  return `
# 鉛筆と消しゴム機能付きCanvas

このデモでは、fabric.jsを使用して以下の機能を実装しています：

- 鉛筆ブラシによる自由描画
- 消しゴム機能（globalCompositeOperationを使用した透過合成）

## 使い方

1. 「鉛筆」ボタンをクリックして描画モードに切り替え
2. 「消しゴム」ボタンをクリックして消しゴムモードに切り替え
3. 消しゴムモードでは、ドラッグして描画した部分を消去

## 技術的な実装

- fabric.PencilBrushを使用して鉛筆ブラシを実装
- 消しゴム機能は、別のCanvasレイヤーとglobalCompositeOperationのdestination-outを使用して実装
- モード切り替えは、isDrawingModeとカスタムフラグで管理
  `;
}
