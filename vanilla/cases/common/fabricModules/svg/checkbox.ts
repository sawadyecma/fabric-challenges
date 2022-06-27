import { fabric } from "fabric";

function getSvg(checked: boolean) {
  const svgUrl = `/icons/checkbox/${checked ? "on" : "off"}.svg`;
  return new Promise<fabric.Group>((resolve) => {
    fabric.loadSVGFromURL(svgUrl, (objects) => {
      console.log(objects);
      resolve(new fabric.Group(objects));
    });
  });
}

const checkboxOff = await getSvg(false);
const checkboxOn = await getSvg(true);

export class Checkbox extends fabric.Group {
  private checked: boolean = false;

  constructor(checked: boolean) {
    super();
    const target = checked ? checkboxOn : checkboxOff;
    target.forEachObject((o) => {
      this.addWithUpdate(o);
    });
    this.checked = checked;
  }

  getChecked() {
    return this.checked;
  }

  async setChecked(checked: boolean) {
    if (this.checked === checked) return;

    const left = this.left!;
    const top = this.top!;
    const width = this.width!;
    const height = this.height!;
    const scaleX = this.scaleX!;
    const scaleY = this.scaleY!;

    const removeObjects = [...this._objects];
    // console.log(removeObjects);
    // removeObjects.forEach((o) => {
    // this.removeWithUpdate(o);
    // return;
    // });
    this.remove(...removeObjects);

    const target = checked ? checkboxOn : checkboxOff;

    target.forEachObject((o) => {
      this.addWithUpdate(o);
    });

    this.set("left", left);
    this.set("top", top);
    this.set("width", width);
    this.set("height", height);
    this.set("scaleX", scaleX);
    this.set("scaleY", scaleY);
    // this.set("hasControls", true);
    // this.set("selectable", true);
    // this.set("hasBorders", true);
    // this.set("dirty", true);

    this.checked = checked;
    return;
  }
}
