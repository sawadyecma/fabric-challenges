import { fabric } from "fabric";
import { composeImgEle } from "./imgEle";

const checkboxOffImageEle = await composeImgEle("/icons/checkbox/off.svg");
const checkboxOnImageEle = await composeImgEle("/icons/checkbox/on.svg");

export class Checkbox extends fabric.Image {
  private checked: boolean = false;
  private mouseDownPointer: fabric.Point | undefined;

  constructor(
    checked: boolean,
    options?: fabric.IImageOptions,
    private onChecked?: (checked: boolean) => void
  ) {
    const targetEle = checked ? checkboxOnImageEle : checkboxOffImageEle;

    super(targetEle, options);

    this.checked = checked;

    this.on("mousedown", this.onMouseDown);
    this.on("mouseup", this.onMouseUp);
  }

  getChecked() {
    return this.checked;
  }

  setChecked(checked: boolean) {
    const targetEle = checked ? checkboxOnImageEle : checkboxOffImageEle;

    this.setElement(targetEle);
    this.checked = checked;
    return;
  }

  onMouseDown(e: fabric.IEvent) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent) {
    if (this.mouseDownPointer?.eq(e.absolutePointer!)) {
      this.onChecked && this.onChecked(!this.checked);
    }
  }
}
