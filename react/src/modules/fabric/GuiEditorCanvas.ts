import { fabric } from "fabric";
import { Asset, AssetType } from "./assets/type";
import { FABRIC_EVENT } from "./constant";

export class GuiEditorCanvas {
  private fabricCanvas: fabric.Canvas;

  private bgImg: fabric.Image;

  private assets: Asset[] = [];

  private rate: number = 1;

  private groupForViewer?: fabric.Group;

  private editable: boolean = true;

  private mouseDownPointer?: fabric.Point;

  private stagingObj?: Asset;

  constructor(
    canvasEle: HTMLCanvasElement,
    style: { width: number; height: number },
    private onChange: (data: fabric.Object[]) => void,
    private onMouseUpCallback: () => void
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
    this.fabricCanvas.on(FABRIC_EVENT.MouseDown, this.onMouseDown.bind(this));
    this.fabricCanvas.on(FABRIC_EVENT.MouseUp, this.onMouseUp.bind(this));
  }

  onObjectModified(e: fabric.IEvent<Event>) {
    this.onChange([this.bgImg, ...this.assets]);
  }

  onMouseDown(e: fabric.IEvent) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent) {
    if (!this.editable) return;
    if (!this.mouseDownPointer?.eq(e.absolutePointer!)) {
      return;
    }

    if (!this.stagingObj) {
      return;
    }

    this.stagingObj.set({ left: e.pointer?.x, top: e.pointer?.y });

    this.fabricCanvas.add(this.stagingObj);
    this.assets.push(this.stagingObj);
    this.fabricCanvas.renderAll();
    this.onMouseUpCallback();

    this.stagingObj = undefined;
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

  add(asset: Asset) {
    this.fabricCanvas.add(asset);
    this.assets.push(asset);
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

  setStagingObj(stagingObj?: Asset) {
    this.stagingObj = stagingObj;
  }

  getObjectByKindAndId(kind: AssetType, placementId: string) {
    return this.assets.find(
      (asset) => asset.kind === kind && asset.placementId === placementId
    );
  }
}
