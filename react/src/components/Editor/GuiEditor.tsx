import { Box, Button, CheckBox } from "grommet";
import { useEffect, useRef } from "react";
import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { CanvasZoomControl } from "../CanvasZoomControl";
import { setAssets } from "./setAsset";

export const GuiEditor = () => {
  const guiEditorRef = useRef<GuiEditorCanvas>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onViewClick = (editale: boolean) => {
    if (!guiEditorRef.current) {
      return;
    }

    guiEditorRef.current.changeMode(editale);
  };

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
      <Box direction="row" align="center" gap="small">
        <CheckBox
          label="Editable"
          toggle
          onClick={(e) => onViewClick(e.currentTarget.checked)}
        />
      </Box>
    </>
  );
};
