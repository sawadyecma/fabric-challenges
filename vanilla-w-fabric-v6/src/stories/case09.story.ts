import { Canvas, PencilBrush, Rect, Circle } from "fabric";
import { Logger } from "../utils/logger";

export function render(container: HTMLElement) {
  // Canvas要素を作成
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 600;
  canvasEl.height = 400;
  canvasEl.style.border = "1px solid #ccc";
  container.appendChild(canvasEl);

  // fabric.Canvasを初期化
  const canvas = new Canvas(canvasEl, {
    width: 600,
    height: 400,
    backgroundColor: "#fff",
    isDrawingMode: true,
  });

  canvas.freeDrawingBrush = new PencilBrush(canvas);

  canvas.renderAll();

  // ボタンの色リセット用関数
  function setActiveButton(activeBtn: HTMLButtonElement) {
    [penBtn, rectBtn, circleBtn].forEach((btn) => {
      btn.style.background = btn === activeBtn ? "#1976d2" : "#e0e0e0";
    });
  }

  // ツール切り替えUI
  const toolBar = document.createElement("div");
  toolBar.style.marginBottom = "8px";
  toolBar.style.display = "flex";
  toolBar.style.gap = "8px";

  // mouse:downハンドラの管理用
  let pendingShapeHandler: ((opt: any) => void) | null = null;

  // 手書きツール
  const penBtn = document.createElement("button");
  penBtn.textContent = "手書き";
  penBtn.onclick = () => {
    canvas.isDrawingMode = true;
    setActiveButton(penBtn);
    // 他ツールのpending handlerを解除
    if (pendingShapeHandler) {
      canvas.off("mouse:down", pendingShapeHandler);
      pendingShapeHandler = null;
    }
  };
  penBtn.style.background = "#e0e0e0";

  // 四角形ツール
  const rectBtn = document.createElement("button");
  rectBtn.textContent = "四角形";
  rectBtn.onclick = () => {
    canvas.isDrawingMode = false;
    setActiveButton(rectBtn);
    // 既存のpending handlerを解除
    if (pendingShapeHandler) {
      canvas.off("mouse:down", pendingShapeHandler);
      pendingShapeHandler = null;
    }
    pendingShapeHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      const rect = new Rect({
        left: pointer.x,
        top: pointer.y,
        width: 80,
        height: 60,
        fill: "rgba(0,150,255,0.3)",
        stroke: "#0096ff",
        strokeWidth: 2,
      });
      canvas.add(rect);
      // 1回で解除
      canvas.off("mouse:down", pendingShapeHandler!);
      pendingShapeHandler = null;
    };
    canvas.on("mouse:down", pendingShapeHandler);
  };

  // 円ツール
  const circleBtn = document.createElement("button");
  circleBtn.textContent = "円";
  circleBtn.onclick = () => {
    canvas.isDrawingMode = false;
    setActiveButton(circleBtn);
    // 既存のpending handlerを解除
    if (pendingShapeHandler) {
      canvas.off("mouse:down", pendingShapeHandler);
      pendingShapeHandler = null;
    }
    pendingShapeHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      const circle = new Circle({
        left: pointer.x - 30,
        top: pointer.y - 30,
        radius: 30,
        fill: "rgba(255,180,0,0.3)",
        stroke: "#ffb400",
        strokeWidth: 2,
      });
      canvas.add(circle);
      // 1回で解除
      canvas.off("mouse:down", pendingShapeHandler!);
      pendingShapeHandler = null;
    };
    canvas.on("mouse:down", pendingShapeHandler);
  };

  const returnBtn = document.createElement("button");
  returnBtn.textContent = "初期位置に戻る";
  returnBtn.onclick = () => {
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0]; // ズームとスクロールをリセット
    canvas.requestRenderAll();
    Logger.log("Canvas reset to initial position");
  };

  toolBar.appendChild(penBtn);
  toolBar.appendChild(rectBtn);
  toolBar.appendChild(circleBtn);
  toolBar.appendChild(returnBtn);
  container.appendChild(toolBar);

  // 初期状態で手書きボタンをアクティブ
  setActiveButton(penBtn);

  // 履歴遷移防止: overscroll-behavior-xとtouch-actionを設定
  canvas.upperCanvasEl.style.overscrollBehaviorX = "contain";
  canvas.upperCanvasEl.style.touchAction = "none";

  canvas.upperCanvasEl.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
  // wheelイベントでズーム・スクロール
  // canvasElではなくcanvas.upperCanvasElにイベントを付与する
  canvas.upperCanvasEl.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      e.stopPropagation(); // 履歴遷移防止
      const SCROLL_RATIO = 2.5; // ←ここでスクロール感度を上げる
      if (e.ctrlKey) {
        // ピンチイン・アウト（ズーム）
        const delta = e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= delta > 0 ? 0.95 : 1.05;
        zoom = Math.max(0.2, Math.min(zoom, 5));
        const pointer = canvas.getPointer(e);
        canvas.zoomToPoint(pointer, zoom);

        Logger.log(`Zoom: ${canvas.getZoom()}`);
      } else {
        // スクロール
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] -= e.deltaX * SCROLL_RATIO;
          vpt[5] -= e.deltaY * SCROLL_RATIO;

          Logger.log(`Scroll: [${vpt[4].toFixed(2)}, ${vpt[5]}]`);
          canvas.requestRenderAll();
        }
      }
    },
    { passive: false }
  );
}
