import { fabric } from "fabric";
import { composeImgEle } from "./imgEle";

const emptySealImageEle = await composeImgEle("/icons/seal/empty.svg");

type Cood = {
  x: number;
  y: number;
  len: number;
};

export class Seal extends fabric.Image {
  private mouseDownPointer: fabric.Point | undefined;

  constructor(
    cood: Cood,
    private pressedImgEle?: HTMLImageElement,
    options?: fabric.IImageOptions,
    private onPress?: () => void,
    private renderCallback?: Function
  ) {
    super(pressedImgEle ?? emptySealImageEle, {
      left: cood.x,
      top: cood.y,
      ...options,
    });
    this.scaleToHeight(cood.len);

    this.on("mousedown", this.onMouseDown);
    this.on("mouseup", this.onMouseUp);
  }

  onMouseDown(e: fabric.IEvent) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent) {
    if (this.pressedImgEle) {
      return;
    }

    if (this.mouseDownPointer?.eq(e.absolutePointer!)) {
      this.onPress && this.onPress();
      this.renderCallback && this.renderCallback();
    }
  }

  press(pressedImgEle: HTMLImageElement) {
    const oldWidth = this.getBoundingRect().width;
    this.pressedImgEle = pressedImgEle;
    this.setElement(pressedImgEle);

    this.renderCallback && this.renderCallback();

    this.scaleToWidth(oldWidth);
  }

  exportCood() {
    const rect = this.getBoundingRect();
    return rect;
  }
}
