import { useEffect, useRef } from "react";
import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { CanvasZoomControl } from "../CanvasZoomControl";
import { setAssets } from "./setAsset";

export const GuiEditor = () => {
  const guiEditorRef = useRef<GuiEditorCanvas>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const { clientWidth, clientHeight } = canvasRef.current;

    guiEditorRef.current = new GuiEditorCanvas(
      canvasRef.current,
      {
        width: clientWidth,
        height: clientHeight,
      },
      (data) => {
        console.log(data);
      }
    );

    const guiEditor = guiEditorRef.current;

    setAssets(guiEditor);

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
