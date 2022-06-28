import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { GuiEditorCanvas } from "./modules/fabric/GuiEditorCanvas";
import { composeImgEle } from "./modules/img/imgEle";
import { Slider } from "./Slider";

export const GuiEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiEditorRef = useRef<GuiEditorCanvas>();
  const [zoomRate, setZoomRate] = useState(1);
  const onZoomChange = (value: number) => {
    const rate = value / 10;
    setZoomRate(rate);
    guiEditorRef.current?.zoom(rate);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "grey",
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
    });

    guiEditorRef.current = new GuiEditorCanvas(fabricCanvas);

    const guiEditor = guiEditorRef.current;

    (async () => {
      const imgEle = await composeImgEle(
        "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
      );
      guiEditor.setBgImg(imgEle);
      const bgImgRect = guiEditor.bgImgBoundingRect;

      const rect = new fabric.Rect({
        left: bgImgRect.left,
        top: bgImgRect.top,
        width: 100,
        height: 100,
        fill: "blue",
      });
      guiEditor.add(rect);
    })();
  }, []);

  return (
    <>
      <canvas
        style={{ width: "100%", height: "100%" }}
        ref={canvasRef}
      ></canvas>
      <Slider value={zoomRate * 10} onChange={onZoomChange} />
    </>
  );
};
