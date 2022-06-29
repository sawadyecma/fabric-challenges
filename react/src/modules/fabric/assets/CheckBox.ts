import { fabric } from "fabric";
import { onlyScaleControl } from "../constant";
import { composeImgEle } from "../imgUtil";

const checkboxOffImageEle = await composeImgEle("/icons/checkbox/off.svg");
const checkboxOnImageEle = await composeImgEle("/icons/checkbox/on.svg");

type Cood = {
  x: number;
  y: number;
  len: number;
};

export class Checkbox extends fabric.Image {
  private checked: boolean = false;
  private mouseDownPointer: fabric.Point | undefined;

  constructor(checked: boolean, cood: Cood, private renderCallback: Function) {
    const targetEle = checked ? checkboxOnImageEle : checkboxOffImageEle;

    super(targetEle, { left: cood.x, top: cood.y });
    this.setControlsVisibility(onlyScaleControl);

    this.checked = checked;

    this.on("mousedown", this.onMouseDown);
    this.on("mouseup", this.onMouseUp);
  }

  setChecked(checked: boolean) {
    const targetEle = checked ? checkboxOnImageEle : checkboxOffImageEle;

    this.setElement(targetEle);
    this.checked = checked;
    this.renderCallback();
    return;
  }

  onMouseDown(e: fabric.IEvent) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent) {
    if (this.mouseDownPointer?.eq(e.absolutePointer!)) {
      this.setChecked(!this.checked);
    }
  }
}
