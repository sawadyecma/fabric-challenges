import { Canvas, Textbox } from "fabric";

export function render(container: HTMLElement) {
  // Canvas要素
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 400;
  canvasEl.height = 300;
  canvasEl.style.border = "1px solid #ccc";
  container.appendChild(canvasEl);

  // fabric.Canvas初期化
  const canvas = new Canvas(canvasEl, {
    width: 800,
    height: 600,
    backgroundColor: "#fff",
  });

  const text = new Textbox("あいうえお", {
    left: 100,
    top: 80,
  });

  canvas.add(text);

  const boldButton = document.createElement("button");
  boldButton.textContent = "太字";
  boldButton.onmousedown = () => {
    text.set("fontWeight", text.fontWeight === "bold" ? "normal" : "bold");
    canvas.discardActiveObject(); // アクティブオブジェクトを解除
    // canvas.requestRenderAll();
    focusText();
  };
  container.appendChild(boldButton);

  const focusText = () => {
    canvas.wrapperEl.focus();
    setTimeout(() => {
      canvas.setActiveObject(text);
      text.enterEditing(); // 編集モードに入る
      canvas.requestRenderAll();
    }, 10);
  };
  const focusButton = document.createElement("button");
  focusButton.textContent = "フォーカス";
  focusButton.onclick = () => {
    focusText();
  };

  container.appendChild(focusButton);
}

export function docs() {
  return "text入力に関するサンプル\n";
}
