import { fabric } from "fabric";

export class GuiEditorCanvas {
  private bgImg: fabric.Image = new fabric.Image("", {
    selectable: false,
  });

  private assets: fabric.Object[] = [];

  private rate: number = 1;

  constructor(private fabricCanvas: fabric.Canvas) {
    this.fabricCanvas.add(this.bgImg);

    this.fabricCanvas.renderAll();
  }

  async setBgImg(imgEle: HTMLImageElement) {
    this.bgImg.setElement(imgEle, {
      crossOrigin: "anonymous",
    });
    this.bgImg.scale(0.9);

    this.fabricCanvas.centerObject(this.bgImg);
    this.fabricCanvas.sendToBack(this.bgImg);
  }

  get bgImgBoundingRect() {
    return this.bgImg.getBoundingRect();
  }

  add(obj: fabric.Object) {
    this.fabricCanvas.add(obj);
    this.assets.push(obj);
  }

  zoom(rate: number) {
    const targets = [this.bgImg, ...this.assets];
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
}
