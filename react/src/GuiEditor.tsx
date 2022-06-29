import { MutableRefObject, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { GuiEditorCanvas } from "./modules/fabric/GuiEditorCanvas";
import { composeImgEle } from "./modules/img/imgEle";
import { CanvasZoomControl } from "./components/CanvasZoomControl";

export const GuiEditor = () => {
  const guiEditorRef = useRef<GuiEditorCanvas | undefined>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const { clientWidth, clientHeight } = canvasRef.current;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "grey",
      width: clientWidth,
      height: clientHeight,
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

    return () => {
      guiEditor.getFabricCanvas().dispose();
    };
  }, []);

  return (
    <>
      <canvas
        style={{ width: "100%", height: "100%" }}
        ref={canvasRef}
      ></canvas>
      <CanvasZoomControl zoomCanvasRef={guiEditorRef} />
    </>
  );
};
