import { fabric } from "fabric";
import { loadImageFromUrl } from "../img/imgEle";

const dropDown = await loadImageFromUrl("/icons/menu-down.svg");

export class Menu extends fabric.Group {
  private mouseDownPointer: fabric.Point | undefined;

  constructor(text: string, private onMenuOpen: Function = () => {}) {
    const fText = new fabric.IText(text);
    dropDown.set({
      left: fText.left! + fText.width!,
      top: fText.top! + fText.height! / 2 - dropDown.height! / 2,
    });
    super([fText, dropDown]);

    this.on("click", () => {
      console.log("click");
    });
    this.on("selected", () => {
      console.log("selected");
    });

    this.on("mousedown", this.onMouseDown);
    this.on("mouseup", this.onMouseUp);
  }

  onMouseDown(e: fabric.IEvent<Event>) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent<Event>) {
    if (e.absolutePointer?.eq(this.mouseDownPointer!)) {
      console.log("Menu Open");
      this.onMenuOpen();
    }
    this.mouseDownPointer = undefined;
  }
}
