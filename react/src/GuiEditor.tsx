import { useEffect, useRef } from "react";
import { fabric } from "fabric";

export const GuiEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "grey",
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
    });
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      fill: "red",
    });
    fabricCanvas.add(rect);
    fabricCanvas.renderAll();
  }, []);

  return (
    <canvas style={{ width: "100%", height: "100%" }} ref={canvasRef}></canvas>
  );
};
