import { Box, CheckBox, RadioButtonGroup } from "grommet";
import { useEffect, useRef, useState } from "react";
import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { CanvasZoomControl } from "../CanvasZoomControl";
import { setAssets } from "./setAsset";
import { fabric } from "fabric";
import { Checkbox as AssetCheckbox } from "../../modules/fabric/assets/CheckBox";

type Asset = "rect" | "checkbox" | "none";

export const GuiEditor = () => {
  const guiEditorRef = useRef<GuiEditorCanvas>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [newAsset, setNewAsset] = useState<Asset>("none");

  const onViewClick = (editale: boolean) => {
    if (!guiEditorRef.current) {
      return;
    }

    guiEditorRef.current.changeMode(editale);
  };

  const onAssetChange = (asset: Asset) => {
    setNewAsset(asset);
    if (!guiEditorRef.current) {
      return;
    }

    if (asset === "checkbox") {
      const checkbox = new AssetCheckbox(false, { x: 0, y: 0, len: 50 }, () => {
        guiEditorRef.current?.getFabricCanvas().renderAll();
      });
      guiEditorRef.current.setStagingObj(checkbox);
    }

    if (asset === "rect") {
      guiEditorRef.current.setStagingObj(
        new fabric.Rect({ width: 100, height: 100 })
      );
    }
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
      },
      () => {
        setNewAsset("none");
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
        style={{ width: "600px", height: "600px" }}
        ref={canvasRef}
      ></canvas>
      <Box direction="row" align="center" gap="small">
        <CanvasZoomControl zoomCanvasRef={guiEditorRef} />
        <CheckBox
          label="Editable"
          toggle
          onClick={(e) => onViewClick(e.currentTarget.checked)}
        />
      </Box>
      <Box>
        <RadioButtonGroup
          name="radio"
          direction="row"
          gap="xsmall"
          options={["rect", "checkbox"]}
          value={newAsset}
          onChange={(event) => onAssetChange(event.target.value as Asset)}
        ></RadioButtonGroup>
      </Box>
    </>
  );
};
