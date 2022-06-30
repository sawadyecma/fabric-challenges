import { fabric } from "fabric";
import { onlyScaleControl } from "../constant";
import { composeImgEle } from "../imgUtil";
import { Asset, AssetType } from "./type";
import { uuidv4 } from "./util";

const checkboxOffImageEle = await composeImgEle("/icons/checkbox/off.svg");
const checkboxOnImageEle = await composeImgEle("/icons/checkbox/on.svg");

type Cood = {
  x: number;
  y: number;
  len: number;
};

export class Checkbox extends fabric.Image implements Asset {
  private checked: boolean = false;
  private mouseDownPointer: fabric.Point | undefined;
  private _placementId: string;

  get kind(): AssetType {
    return "checkbox";
  }

  get placementId(): string {
    return this._placementId;
  }

  constructor(checked: boolean, cood: Cood, private renderCallback: Function) {
    const targetEle = checked ? checkboxOnImageEle : checkboxOffImageEle;

    super(targetEle, {
      left: cood.x,
      top: cood.y,
      // TODO to constant
      hoverCursor: "pointer",
    });
    this.setControlsVisibility(onlyScaleControl);

    this._placementId = uuidv4();

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
