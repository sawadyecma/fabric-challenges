import { Canvas, PencilBrush } from "fabric";
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
    isDrawingMode: true,
    selection: false,
  });

  // Create and configure pencil brush
  const pencilBrush = new PencilBrush(fabricCanvas);
  pencilBrush.color = "#000000";
  pencilBrush.width = 2;
  fabricCanvas.freeDrawingBrush = pencilBrush;

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
  };

  container.appendChild(colorPicker);

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

  fabricCanvas.renderAll();
  Logger.info("Canvas initialized with pencil brush drawing tool");
}
