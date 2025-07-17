import { useRef } from "react";
import * as fabric from "fabric";
import { useEffectOnce } from "./hooks/useEffectOnce";

function App() {
  const canvasEleRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffectOnce(() => {
    console.log("effect triggered");

    const canvas = canvasEleRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    fabricCanvasRef.current = new fabric.Canvas(canvas, {
      width: 800,
      height: 600,
      backgroundColor: "#fff",
      enablePointerEvents: true,
      selection: true,
    });

    fabricCanvasRef.current.add(
      new fabric.Rect({
        left: 100,
        top: 80,
        width: 120,
        height: 80,
        selectable: true,
      })
    );
    return () => {
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
      console.log("canvas disposed");
    };
  });

  return (
    <canvas
      ref={canvasEleRef}
      width={800}
      height={600}
      style={{ border: "1px solid black" }}
    />
  );
}

export default App;
