import { Box, CheckBox, List, RadioButtonGroup } from "grommet";
import { useEffect, useRef, useState } from "react";
import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { CanvasZoomControl } from "../CanvasZoomControl";
import { setAssets } from "./setAsset";
import { Checkbox as AssetCheckbox } from "../../modules/fabric/assets/CheckBox";
import { Menu as AssetMenu } from "../../modules/fabric/assets/Menu";
import { useGuiEditor } from "./useGuiEditor";
import { Asset } from "../../modules/fabric/assets/type";

type NewAsset = "menu" | "checkbox" | "none";

export const GuiEditor = () => {
  const guiEditorRef = useRef<GuiEditorCanvas>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [newAsset, setNewAsset] = useState<NewAsset>("none");

  const { state, dispatch } = useGuiEditor();

  const callbacks = {
    onMenuOpen: (menu: AssetMenu) => {
      const { left: x, top: y, height, width } = menu.getBoundingRect();
      dispatch({
        type: "menuSelectorOpen",
        menuSelector: {
          current: { placementId: menu.placementId, name: menu.getText() },
          rect: { x, y: y + height, height, width },
        },
      });
    },
    onMenuMoving: (menu: AssetMenu) => {
      const { left: x, top: y, height, width } = menu.getBoundingRect();
      dispatch({
        type: "menuSelectorMove",
        menuselector: { rect: { x, y: y + height, height, width } },
      });
    },
    onMenuDeselect: () => {
      dispatch({ type: "menuSelectorClose" });
    },
  };

  const onViewClick = (editale: boolean) => {
    if (!guiEditorRef.current) {
      return;
    }

    guiEditorRef.current.changeMode(editale);
  };

  const onAssetChange = (asset: NewAsset) => {
    if (!guiEditorRef.current) {
      return;
    }

    if (newAsset === asset) {
      setNewAsset("none");
      guiEditorRef.current.setStagingObj(undefined);
      return;
    }
    setNewAsset(asset);

    if (asset === "checkbox") {
      const checkbox = new AssetCheckbox(false, { x: 0, y: 0, len: 50 }, () => {
        guiEditorRef.current?.getFabricCanvas().renderAll();
      });
      guiEditorRef.current.setStagingObj(checkbox);
    }

    if (asset === "menu") {
      const checkbox = new AssetMenu(
        "メニュー",
        { x: 0, y: 0 },
        callbacks.onMenuOpen,
        callbacks.onMenuMoving,
        callbacks.onMenuDeselect
      );
      guiEditorRef.current.setStagingObj(checkbox);
    }
  };

  const onMenuSelectorItemClick = (event: { item?: string | undefined }) => {
    const obj = guiEditorRef.current?.getObjectByKindAndId(
      "menu",
      state.menuSelector?.current.placementId ?? ""
    );

    const isMenu = (obj?: Asset): obj is AssetMenu => {
      return obj?.kind === "menu";
    };
    if (isMenu(obj)) {
      obj.setText(event.item ?? "");
      guiEditorRef.current?.getFabricCanvas().renderAll();
      dispatch({ type: "menuSelectorClose" });
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

    setAssets(guiEditor, callbacks);

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
          options={["menu", "checkbox"]}
          value={newAsset}
          onClick={(event) => onAssetChange(event.target.value as NewAsset)}
        ></RadioButtonGroup>
      </Box>
      {state.menuSelector && (
        <Box
          style={{
            position: "absolute",
            top:
              state.menuSelector.rect.y +
              (canvasRef.current?.getBoundingClientRect().top ?? 0),
            left:
              state.menuSelector.rect.x +
              (canvasRef.current?.getBoundingClientRect().left ?? 0),
            height: state.menuSelector.rect.height * 3,
            width: state.menuSelector.rect.width,
            overflowX: "auto",
            backgroundColor: "white",
          }}
        >
          <List
            data={[
              "メニューA",
              "メニューB",
              "メニューC",
              "メニューD",
              "メニューE",
            ]}
            onClickItem={onMenuSelectorItemClick}
          ></List>
        </Box>
      )}
    </>
  );
};
