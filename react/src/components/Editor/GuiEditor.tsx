import { MutableRefObject, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { composeImgEle } from "../../modules/img/imgEle";
import { CanvasZoomControl } from "../CanvasZoomControl";
import { Checkbox } from "../../modules/fabric/assets/CheckBox";
import { setAssets } from "./setAsset";

export const GuiEditor = () => {
  const guiEditorRef = useRef<GuiEditorCanvas>();
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
      await setAssets(guiEditor);
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
