import { fabric } from "fabric";
import { FABRIC_EVENT } from "./constant";

export class GuiEditorCanvas {
  private fabricCanvas: fabric.Canvas;

  private bgImg: fabric.Image;

  private assets: fabric.Object[] = [];

  private rate: number = 1;

  private groupForViewer?: fabric.Group;

  private editable: boolean = true;

  constructor(
    canvasEle: HTMLCanvasElement,
    style: { width: number; height: number },
    private onChange: (data: fabric.Object[]) => void
  ) {
    this.fabricCanvas = new fabric.Canvas(canvasEle, {
      backgroundColor: "grey",
      width: style.width,
      height: style.height,
      selection: false, // diasble group selection
      hoverCursor: "grabbing",
    });

    this.bgImg = new fabric.Image("", {
      selectable: false,
      hasControls: false,
    });

    this.fabricCanvas.add(this.bgImg);

    this.fabricCanvas.renderAll();
    this.fabricCanvas.on(
      FABRIC_EVENT.ObjectModified,
      this.onObjectModified.bind(this)
    );
  }

  onObjectModified(e: fabric.IEvent<Event>) {
    this.onChange([this.bgImg, ...this.assets]);
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

    const targets: fabric.Object[] = this.editable
      ? [...this.assets, this.bgImg]
      : [this.groupForViewer!];

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

  commitObjectAdd() {
    this.changeMode(false);
  }

  changeMode(editable: boolean) {
    if (this.editable === editable) return;
    this.editable = editable;

    if (!editable) {
      this.fabricCanvas.discardActiveObject();

      this.groupForViewer = new fabric.Group([this.bgImg, ...this.assets], {
        hasControls: false,
      });
      this.fabricCanvas.add(this.groupForViewer);
      this.fabricCanvas.renderAll();
      return;
    }

    if (!this.groupForViewer) {
      return;
    }
    this.fabricCanvas.remove(this.groupForViewer);
    this.groupForViewer.ungroupOnCanvas();
  }
}
