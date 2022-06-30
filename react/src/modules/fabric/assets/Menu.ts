import { fabric } from "fabric";
import { composeImgEle } from "../imgUtil";
import { Asset, AssetType } from "./type";
import { uuidv4 } from "./util";

const loadedDropDownEle = await composeImgEle("/icons/menu-down.svg");

type Coodinate = {
  x: number;
  y: number;
};

export class Menu extends fabric.Group implements Asset {
  private mouseDownPointer: fabric.Point | undefined;

  private fabricText: fabric.IText = new fabric.IText("");
  private dropDown: fabric.Image = new fabric.Image(loadedDropDownEle);
  private _placementId: string;

  get kind(): AssetType {
    return "menu";
  }

  get placementId(): string {
    return this._placementId;
  }

  constructor(
    private text: string,
    cood: Coodinate = { x: 0, y: 0 },
    private onMenuOpen: (self: Menu) => void,
    private onMovingCallback: (self: Menu) => void,
    private onDelelectedCallback: Function
  ) {
    super();

    this._placementId = uuidv4();

    this.fabricText = new fabric.IText(text, { left: cood.x, top: cood.y });
    this.dropDown.set({
      left: this.fabricText.left! + this.fabricText.width!,
      top:
        this.fabricText.top! +
        this.fabricText.height! / 2 -
        this.dropDown.height! / 2,
    });
    this.addWithUpdate(this.fabricText);
    this.addWithUpdate(this.dropDown);

    this.on("mousedown", this.onMouseDown);
    this.on("mouseup", this.onMouseUp);
    this.on("moving", this.onMoving);
    this.on("deselected", this.onDelelected);
  }

  onMouseDown(e: fabric.IEvent<Event>) {
    this.mouseDownPointer = e.absolutePointer;
  }

  onMouseUp(e: fabric.IEvent<Event>) {
    if (e.absolutePointer?.eq(this.mouseDownPointer!)) {
      this.onMenuOpen(this);
    }
    this.mouseDownPointer = undefined;
  }

  onMoving(_: fabric.IEvent<Event>) {
    this.onMovingCallback(this);
  }

  onDelelected() {
    this.onDelelectedCallback();
  }

  getText() {
    return this.text;
  }

  setText(text: string) {
    this.text = text;

    this.fabricText.set("text", text);

    // NOTE: getting object rect directly caases misalignment
    // example: this.fabricText.left!
    const { left, top, width, height } = this.fabricText.getBoundingRect();

    const { height: dropDownHeight } = this.dropDown.getBoundingRect();

    this.dropDown.set({
      left: left + width,
      top: top + height / 2 - dropDownHeight / 2,
    });

    this.updateMembers();
  }

  updateMembers() {
    this.removeWithUpdate(this.fabricText);
    this.removeWithUpdate(this.dropDown);

    this.addWithUpdate(this.fabricText);
    this.addWithUpdate(this.dropDown);
  }
}
