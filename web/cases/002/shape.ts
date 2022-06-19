import { fabric } from "fabric";
import { IObjectOptions } from "fabric/fabric-impl";

type Gender = "male" | "female" | undefined;
type Kind = "self" | "dead" | undefined;

interface ShapeAttribute {
  gender: Gender;
  kind: Kind;
  len: number;
}

const innerRate = 0.1;

export class Shape extends fabric.Group {
  constructor(attrs: ShapeAttribute, options?: IObjectOptions) {
    let group: fabric.Object[] = [];

    if (attrs.gender === "male") {
      const male = new fabric.Rect({
        width: attrs.len,
        height: attrs.len,
        fill: undefined,
        strokeWidth: 2,
        stroke: "black",
        hasRotatingPoint: false,
      });
      group.push(male);
      if (attrs.kind === "self") {
        const male2 = new fabric.Rect({
          left: attrs.len * innerRate,
          top: attrs.len * innerRate,
          width: attrs.len - attrs.len * innerRate * 2,
          height: attrs.len - attrs.len * innerRate * 2,
          fill: undefined,
          strokeWidth: 2,
          stroke: "black",
          hasRotatingPoint: false,
        });
        group.push(male2);
      }
    }

    super(group, options);

    this.setControlsVisibility({
      ml: false,
      mr: false,
      mt: false,
      mb: false,
      mtr: false, // rotation point
    });
  }
}
