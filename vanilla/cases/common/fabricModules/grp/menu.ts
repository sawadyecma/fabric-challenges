import { fabric } from "fabric";
import { composeImgEle } from "../img/imgEle";

const loadedDropDownEle = await composeImgEle("/icons/menu-down.svg");

export class Menu extends fabric.Group {
  private mouseDownPointer: fabric.Point | undefined;

  private fabricText: fabric.IText = new fabric.IText("");
  private dropDown: fabric.Image = new fabric.Image(loadedDropDownEle);

  constructor(private text: string, private onMenuOpen: Function = () => {}) {
    super();

    this.fabricText = new fabric.IText(text);
    this.dropDown.set({
      left: this.fabricText.left! + this.fabricText.width!,
      top:
        this.fabricText.top! +
        this.fabricText.height! / 2 -
        this.dropDown.height! / 2,
    });
    this.addWithUpdate(this.fabricText);
    this.addWithUpdate(this.dropDown);

    this.on("mousedown", this.onMouseDown);
    this.on("mouseup", this.onMouseUp);
  }

  onMouseDown(e: fabric.IEvent<Event>) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent<Event>) {
    if (e.absolutePointer?.eq(this.mouseDownPointer!)) {
      this.onMenuOpen();
    }
    this.mouseDownPointer = undefined;
  }

  getText() {
    return this.text;
  }

  setText(text: string) {
    this.text = text;

    this.fabricText.set("text", text);

    // NOTE: getting object rect directly caases misalignment
    // example: this.fabricText.left!
    const { left, top, width, height } = this.fabricText.getBoundingRect();

    const { height: dropDownHeight } = this.dropDown.getBoundingRect();

    this.dropDown.set({
      left: left + width,
      top: top + height / 2 - dropDownHeight / 2,
    });

    this.updateMembers();
  }

  updateMembers() {
    this.removeWithUpdate(this.fabricText);
    this.removeWithUpdate(this.dropDown);

    this.addWithUpdate(this.fabricText);
    this.addWithUpdate(this.dropDown);
  }
}
