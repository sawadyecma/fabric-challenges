import { fabric } from "fabric";

export class GuiEditorCanvas {
  private bgImg: fabric.Image;

  private assets: fabric.Object[] = [];

  private rate: number = 1;

  constructor(private fabricCanvas: fabric.Canvas) {
    this.bgImg = new fabric.Image("", {
      selectable: false,
      hasControls: false,
      hoverCursor: "grab",
      moveCursor: "grabbing",
    });

    this.fabricCanvas.add(this.bgImg);

    this.fabricCanvas.renderAll();
  }

  setBgImg(imgEle: HTMLImageElement) {
    this.bgImg.setElement(imgEle, {
      crossOrigin: "anonymous",
    });

    this.fabricCanvas.centerObject(this.bgImg);
    this.fabricCanvas.sendToBack(this.bgImg);
    this.zoom(0.8);
  }

  get bgImgBoundingRect() {
    return this.bgImg.getBoundingRect();
  }

  add(obj: fabric.Object) {
    this.fabricCanvas.add(obj);
    this.assets.push(obj);
  }

  zoom(rate: number) {
    this.fabricCanvas.discardActiveObject();

    const targets = [...this.assets, this.bgImg];
    const group = new fabric.Group(targets, {
      originX: "center",
      originY: "center",
      centeredScaling: true,
    });
    group.scale(rate / this.rate);
    group.destroy();

    this.rate = rate;

    this.fabricCanvas.renderAll();
  }

  getFabricCanvas() {
    return this.fabricCanvas;
  }
}
