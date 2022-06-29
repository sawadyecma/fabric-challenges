import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { composeImgEle } from "../../modules/img/imgEle";
import { fabric } from "fabric";
import { Checkbox } from "../../modules/fabric/assets/CheckBox";
import { FABRIC_EVENT } from "../../modules/fabric/constant";

export async function setAssets(guiEditor: GuiEditorCanvas) {
  const renderCallback = () => {
    guiEditor.getFabricCanvas().renderAll();
    guiEditor
      .getFabricCanvas()
      .fire(FABRIC_EVENT.ObjectModified, { event: "renderCallback" });
  };

  const imgEle = await composeImgEle(
    "https://image.shutterstock.com/image-vector/abstract-image-lighting-flare-set-600w-298506671.jpg"
  );
  guiEditor.setBgImg(imgEle);
  const bgImgRect = guiEditor.bgImgBoundingRect;

  const rect = new fabric.Rect({
    left: bgImgRect.left,
    top: bgImgRect.top,
    width: 50,
    height: 50,
    fill: "blue",
  });
  guiEditor.add(rect);

  {
    const checkbox = new Checkbox(
      false,
      { x: 100, y: 100, len: 50 },
      renderCallback
    );

    guiEditor.add(checkbox);
  }
  {
    const checkbox = new Checkbox(
      true,
      { x: 200, y: 100, len: 50 },
      renderCallback
    );

    guiEditor.add(checkbox);
  }

  guiEditor.getFabricCanvas().renderAll();

  guiEditor.commitObjectAdd();
}
