import { GuiEditorCanvas } from "../../modules/fabric/GuiEditorCanvas";
import { composeImgEle } from "../../modules/img/imgEle";
import { fabric } from "fabric";
import { Checkbox } from "../../modules/fabric/assets/CheckBox";
import { FABRIC_EVENT } from "../../modules/fabric/constant";
import { Menu } from "../../modules/fabric/assets/Menu";

export async function setAssets(
  guiEditor: GuiEditorCanvas,
  callbacks: {
    onMenuOpen: InstanceType<typeof Menu>["onMenuOpen"];
    onMenuMoving: InstanceType<typeof Menu>["onMovingCallback"];
    onMenuDeselect: InstanceType<typeof Menu>["onDelelectedCallback"];
  }
) {
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

  {
    const menu = new Menu(
      "メニュー1",
      { x: 100, y: 100 },
      callbacks.onMenuOpen,
      callbacks.onMenuMoving,
      callbacks.onMenuDeselect
    );
    guiEditor.add(menu);
  }

  {
    const menu = new Menu(
      "メニュー2",
      { x: 300, y: 100 },
      callbacks.onMenuOpen,
      callbacks.onMenuMoving,
      callbacks.onMenuDeselect
    );
    guiEditor.add(menu);
  }
  guiEditor.getFabricCanvas().renderAll();

  // guiEditor.commitObjectAdd();
  // guiEditor.chan
}
