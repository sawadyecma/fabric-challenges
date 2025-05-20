import { Canvas, PencilBrush } from "fabric";
import { Logger } from "../utils/logger";

// Convert linear slider value (0-100) to exponential value (0.1-500)
const linearToExponential = (value: number): number => {
  const min = 0.1;
  const max = 50;
  // より緩やかな指数関数を使用
  const scale = (max - min) / (Math.exp(2) - 1);
  return min + scale * (Math.exp(value / 50) - 1);
};

// Convert exponential value (0.1-500) to linear slider value (0-100)
const exponentialToLinear = (value: number): number => {
  const min = 0.1;
  const max = 50;
  // より緩やかな指数関数を使用
  const scale = (max - min) / (Math.exp(2) - 1);
  return 50 * Math.log((value - min) / scale + 1);
};

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

  // Create and configure pencil brush
  const pencilBrush = new PencilBrush(fabricCanvas);
  pencilBrush.color = "#000000";
  pencilBrush.width = 2;
  pencilBrush.decimate = 0.4;
  fabricCanvas.freeDrawingBrush = pencilBrush;

  // Add touchstart event logging
  fabricCanvas.on("mouse:down", (e) => {
    Logger.info(
      `Touch/Mouse down event - isDrawingMode: ${fabricCanvas.isDrawingMode}`
    );
  });

  // Add color picker
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = "#000000";
  colorPicker.style.marginBottom = "10px";

  // Track color picker focus state
  let isColorPickerFocused = false;

  colorPicker.onfocus = () => {
    isColorPickerFocused = true;
    fabricCanvas.isDrawingMode = false;
  };

  colorPicker.onblur = () => {
    isColorPickerFocused = false;
    fabricCanvas.isDrawingMode = true;
  };

  colorPicker.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    pencilBrush.color = target.value;
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

    button.ontouchstart = (e) => {
      // button.onclick = (e) => {
      e.preventDefault();
      Logger.info("Color button clicked");
      pencilBrush.color = color.value;
      colorPicker.value = color.value;
      setTimeout(() => {
        fabricCanvas.isDrawingMode = true;
      }, 100);
      Logger.info(
        `Canvas state after color change - isDrawingMode: ${fabricCanvas.isDrawingMode}`
      );
    };

    colorButtonsContainer.appendChild(button);
  });

  container.appendChild(colorButtonsContainer);

  // Add brush size control
  const sizeControl = document.createElement("input");
  sizeControl.type = "range";
  sizeControl.min = "1";
  sizeControl.max = "20";
  sizeControl.value = "2";
  sizeControl.style.marginBottom = "10px";
  sizeControl.style.width = "100%";
  sizeControl.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    pencilBrush.width = parseInt(target.value);
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
  decimateValue.textContent = "200";
  decimateValue.style.minWidth = "60px";
  decimateValue.style.textAlign = "right";

  const decimateControl = document.createElement("input");
  decimateControl.type = "range";
  decimateControl.min = "0";
  decimateControl.max = "100";
  decimateControl.value = exponentialToLinear(200).toString();
  decimateControl.style.flex = "1";
  decimateControl.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const linearValue = parseInt(target.value);
    const exponentialValue = linearToExponential(linearValue);
    pencilBrush.decimate = exponentialValue;
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
