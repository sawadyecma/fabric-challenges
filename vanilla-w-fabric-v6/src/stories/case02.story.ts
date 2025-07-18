import { Canvas, Path } from "fabric";
import { Logger } from "../utils/logger";

export function render(container: HTMLElement) {
  // Create canvas element
  const canvasElement = document.createElement("canvas");
  canvasElement.width = 400;
  canvasElement.height = 400;
  canvasElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  canvasElement.style.borderRadius = "4px";
  container.appendChild(canvasElement);

  // Initialize Fabric.js canvas
  const fabricCanvas = new Canvas(canvasElement, {
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
    isDrawingMode: false,
    selection: false,
    interactive: false,
  });

  fabricCanvas.renderAll();

  // 描画状態の管理
  let isDrawing = false;
  let paths: Path[] = [];
  let lastPoint: { x: number; y: number; pressure: number } | null = null;

  // 筆圧に基づいて線の太さを計算
  const getStrokeWidth = (pressure: number) => {
    return 2 + pressure * 8; // 2-10pxの範囲
  };

  // 2点間のパスを作成
  const createPathSegment = (
    start: { x: number; y: number; pressure: number },
    end: { x: number; y: number; pressure: number }
  ) => {
    // 制御点を計算して滑らかな曲線を作成
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const controlX = start.x + dx * 0.1;
    const controlY = start.y + dy * 0.1;

    // 二次ベジェ曲線のパスデータを作成
    const pathData = `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
    const avgPressure = (start.pressure + end.pressure) / 2;

    return new Path(pathData, {
      stroke: "#000000",
      strokeWidth: getStrokeWidth(avgPressure),
      fill: "",
      selectable: false,
      evented: false,
      strokeLineCap: "round",
      strokeLineJoin: "round",
    });
  };

  // PointerEventを使用して筆圧を取得
  fabricCanvas.upperCanvasEl.addEventListener(
    "pointerdown",
    (e: PointerEvent) => {
      isDrawing = true;
      const pointer = fabricCanvas.getPointer(e);
      lastPoint = {
        x: pointer.x,
        y: pointer.y,
        pressure: e.pressure,
      };
      Logger.info(`Started drawing with pressure: ${e.pressure.toFixed(2)}`);
    }
  );

  fabricCanvas.upperCanvasEl.addEventListener(
    "pointermove",
    (e: PointerEvent) => {
      if (!isDrawing || !lastPoint) return;

      const pointer = fabricCanvas.getPointer(e);
      const currentPoint = {
        x: pointer.x,
        y: pointer.y,
        pressure: e.pressure,
      };

      // 2点間のパスを作成して追加
      const path = createPathSegment(lastPoint, currentPoint);
      paths.push(path);
      fabricCanvas.add(path);
      fabricCanvas.renderAll();

      lastPoint = currentPoint;

      Logger.info(
        `Drawing with pressure: ${e.pressure.toFixed(
          2
        )}, Width: ${getStrokeWidth(e.pressure).toFixed(2)}`
      );
    }
  );

  fabricCanvas.upperCanvasEl.addEventListener("pointerup", () => {
    isDrawing = false;
    lastPoint = null;
    Logger.info("Finished drawing");
  });

  Logger.info("Canvas initialized with smooth pressure-sensitive drawing");
}

export function docs() {
  return `
    <h3>筆圧感知ペン</h3>
    <p>Fabric.jsを使用した筆圧感知機能付きの描画ツールです。</p>
    
    <h4>機能</h4>
    <ul>
      <li>筆圧に応じた線の太さの変化</li>
      <li>滑らかな曲線の描画</li>
      <li>ベジェ曲線による自然な描画</li>
    </ul>

    <h4>使い方</h4>
    <ol>
      <li>キャンバス上で描画を開始</li>
      <li>筆圧を変化させながら描画</li>
      <li>線の太さが筆圧に応じて変化</li>
    </ol>

    <h4>技術的な特徴</h4>
    <ul>
      <li>PointerEventによる筆圧検出</li>
      <li>二次ベジェ曲線による滑らかな描画</li>
      <li>動的な線の太さ制御</li>
    </ul>
  `;
}
