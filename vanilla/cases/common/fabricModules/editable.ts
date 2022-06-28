import { fabric } from "fabric";

export const applyEditable = (obj: fabric.Object, editable: boolean): void => {
  obj.setControlsVisibility({
    bl: editable,
    br: editable,
    mb: editable,
    ml: editable,
    mr: editable,
    mt: editable,
    tl: editable,
    tr: editable,
    mtr: false,
  });
  obj.selectable = editable;
  obj.hasControls = editable;
  obj.hoverCursor = editable ? "move" : "poniter";
};
