import * as fabric from "fabric";

export function render(container: HTMLElement) {
  const canvasDom = document.createElement("canvas");
  container.appendChild(canvasDom);

  // モード切り替えボタンの作成
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginBottom = "10px";
  container.appendChild(buttonContainer);

  const drawButton = document.createElement("button");
  drawButton.textContent = "描画モード";
  drawButton.style.marginRight = "10px";
  buttonContainer.appendChild(drawButton);

  const eraserButton = document.createElement("button");
  eraserButton.textContent = "消しゴムモード";
  buttonContainer.appendChild(eraserButton);

  // Canvasの初期化
  const fabricCanvas = new fabric.Canvas(canvasDom, {
    width: 400,
    height: 1000,
    backgroundColor: "grey",
    isDrawingMode: true,
    selection: false,
  });

  fabricCanvas.renderAll();

  // 描画モードの設定
  const pencilBrush = new fabric.PencilBrush(fabricCanvas);
  const eraserBrush = new fabric.PencilBrush(fabricCanvas);
  eraserBrush.color = "rgba(255, 255, 255, 1)";
  eraserBrush.width = 20;

  fabricCanvas.freeDrawingBrush = pencilBrush;

  // 描画モードボタンのクリックイベント
  drawButton.addEventListener("click", () => {
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = pencilBrush;
    drawButton.style.backgroundColor = "#e0e0e0";
    eraserButton.style.backgroundColor = "";
  });

  // 消しゴムモードボタンのクリックイベント
  eraserButton.addEventListener("click", () => {
    fabricCanvas.isDrawingMode = true;
    // fabricCanvas.freeDrawingBrush = eraserBrush;
    fabricCanvas.freeDrawingBrush = new HighlightingEraserBrush(fabricCanvas);
    eraserButton.style.backgroundColor = "#e0e0e0";
    drawButton.style.backgroundColor = "";
  });

  // 初期状態では描画モードを選択
  drawButton.style.backgroundColor = "#e0e0e0";
}

export function docs() {
  return `
  # 描画と交差検出ツール

  このデモでは、Fabric.jsを使用して描画と交差検出機能を実装しています。

  ## 機能
  - 描画モード：通常の描画が可能
  - 消しゴムモード：描画したオブジェクトを消去可能
  - 交差検出：描画したオブジェクトが他のオブジェクトと交差すると、交差したオブジェクトが自動的に削除されます
  - ハイライト機能：消しゴムモードで描画中に交差しているオブジェクトが半透明で表示されます

  ## 使い方
  1. 描画モードボタンをクリックして描画
  2. 描画したオブジェクトが他のオブジェクトと交差すると、交差したオブジェクトが自動的に削除されます
  3. 消しゴムモードボタンをクリックして手動で消去することも可能（描画終了時に交差したオブジェクトが削除されます）
  4. 消しゴムモードで描画中は、交差しているオブジェクトが半透明で表示されます
  `;
}

class HighlightingEraserBrush extends fabric.PencilBrush {
  highlighted = new Set<fabric.Object>();

  constructor(canvas: fabric.Canvas) {
    super(canvas);
    this.width = 20;
    this.color = "rgba(255, 255, 255, 1)";
  }

  onMouseDown(pointer: fabric.Point, options: any) {
    super.onMouseDown(pointer, options);
    this.highlighted.clear();
  }

  onMouseMove(pointer: fabric.Point, options: any) {
    super.onMouseMove(pointer, options);

    // _points から仮の Path を作成（ここでアクセス可能）
    const pathData = this._points
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
      .join(" ");

    const tempPath = new fabric.Path(pathData, {
      stroke: "transparent",
      fill: "",
      strokeWidth: this.width,
      selectable: false,
      evented: false,
    });

    const currentHighlights = new Set<fabric.Object>();

    const objs = this.canvas.getObjects();

    objs.forEach((obj) => {
      // Logger.log(obj.type);
      if (obj === tempPath) return;
      if (obj.type !== "path") return;
      if (intersectsWithPath(tempPath, obj as fabric.Path)) {
        currentHighlights.add(obj);
        if (!this.highlighted.has(obj)) {
          obj.set("opacity", 0.4);
        }
      }
    });

    this.highlighted.forEach((obj) => {
      if (!currentHighlights.has(obj)) {
        obj.set("opacity", 1.0);
      }
    });

    this.highlighted = currentHighlights;
    this.canvas.requestRenderAll();
  }

  onMouseUp(options: fabric.TEvent) {
    const result = super.onMouseUp(options);
    this.highlighted.forEach((obj) => {
      this.canvas.remove(obj);
      // obj.set("opacity", 1.0);
    });
    this.highlighted.clear();
    this.canvas.requestRenderAll();
    return result;
  }

  _finalizeAndAddPath(): void {
    this.canvas.clearContext(this.canvas.contextTop);
  }
}

function intersectsWithPath(pathA: fabric.Path, pathB: fabric.Path): boolean {
  const pointsA = pathToPoints(pathA);
  const pointsB = pathToPoints(pathB);

  for (let i = 0; i < pointsA.length - 1; i++) {
    for (let j = 0; j < pointsB.length - 1; j++) {
      if (
        linesIntersect(pointsA[i], pointsA[i + 1], pointsB[j], pointsB[j + 1])
      ) {
        return true;
      }
    }
  }

  return false;
}

function pathToPoints(path: fabric.Path): fabric.Point[] {
  const points: fabric.Point[] = [];
  const cmds = path.path;
  let x = 0,
    y = 0;

  for (const [cmd, ...args] of cmds) {
    switch (cmd) {
      case "M":
      case "L":
        x = args[0]!;
        y = args[1]!;
        points.push(new fabric.Point(x, y));
        break;
      case "Q":
      case "C":
        // 曲線は簡略化。必要なら bezier分割が必要。
        x = args[args.length - 2]!;
        y = args[args.length - 1];
        points.push(new fabric.Point(x, y));
        break;
      default:
        break;
    }
  }

  return points;
}

function linesIntersect(
  p1: fabric.Point,
  p2: fabric.Point,
  q1: fabric.Point,
  q2: fabric.Point
): boolean {
  function ccw(a: fabric.Point, b: fabric.Point, c: fabric.Point) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  }

  return (
    ccw(p1, q1, q2) !== ccw(p2, q1, q2) && ccw(p1, p2, q1) !== ccw(p1, p2, q2)
  );
}
