import * as fabric from "fabric";
import { Group, Circle, classRegistry, type Abortable } from "fabric";

export class Snowman extends Group {
  static type = "snowman";
  private circle1: Circle;
  private circle2: Circle;
  private circle3: Circle;

  constructor(
    // 定義としてはあるが使わない
    objects: fabric.FabricObject[] = [],
    options: Partial<fabric.GroupProps> = {}
  ) {
    const radius = 25;

    const circle1 = new Circle({
      left: 0,
      top: 0,
      radius,
      fill: "red",
    });

    const circle2 = new Circle({
      left: 0,
      top: radius * 2,
      radius,
      fill: "blue",
    });

    const circle3 = new Circle({
      left: 0,
      top: radius * 4,
      radius,
      fill: "yellow",
    });

    console.log("Snowman constructor called");

    const _objects = objects.length > 0 ? objects : [circle1, circle2, circle3];

    super(_objects, {
      ...options,
    });

    this.circle1 = _objects[0] as Circle;
    this.circle2 = _objects[1] as Circle;
    this.circle3 = _objects[2] as Circle;

    this.on("scaling", this.onResize);
    this.on("mousedown", this.onMouseDown);
  }

  onResize(e: fabric.BasicTransformEvent<fabric.TPointerEvent>): void {
    console.log("onResize");
  }

  onMouseDown(
    e: fabric.TPointerEventInfo<fabric.TPointerEvent> &
      fabric.TPointerEventInfo<fabric.TPointerEvent> & {
        alreadySelected: boolean;
      }
  ): void {
    console.log("onMouseDown");
    const color1 = this.circle1.fill;
    const color2 = this.circle2.fill;
    const color3 = this.circle3.fill;

    this.circle2.set("fill", color3);
    this.circle3.set("fill", color1);
    this.circle1.set("fill", color2);

    this.canvas?.requestRenderAll();
  }

  static fromObject = async (
    object: any,
    abortable?: Abortable
  ): Promise<Snowman> => {
    console.log("fromObject", object);

    // Group.fromObjectを実行しているが、内部的にnew this()でコンストラトしているので実質SnowmaのfromObjectと変わりない
    const _snowman = (await super.fromObject(object, abortable)) as Snowman;

    console.log(_snowman.layoutManager);

    return _snowman;
  };
}

classRegistry.setClass(Snowman, Snowman.type);
