import { fabric } from "fabric";
import { composeImgEle } from "./imgEle";

const checkboxOffImageEle = await composeImgEle("/icons/checkbox/off.svg");
const checkboxOnImageEle = await composeImgEle("/icons/checkbox/on.svg");

export class Checkbox extends fabric.Image {
  private checked: boolean = false;

  onMousedown(e: fabric.IEvent) {
    console.log(e);
    this.setChecked(!this.getChecked());
  }

  constructor(checked: boolean, options?: fabric.IImageOptions) {
    const targetEle = checked ? checkboxOnImageEle : checkboxOffImageEle;

    super(targetEle, options);

    this.checked = checked;

    this.on("mousedown", this.onMousedown);
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
}
