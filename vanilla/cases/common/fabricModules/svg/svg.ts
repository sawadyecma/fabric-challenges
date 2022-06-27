import { fabric } from "fabric";

export async function composeSvg(svgUrl: string = "/icons/checkbox/off.svg") {
  return new Promise<fabric.Object>((resolve) => {
    fabric.loadSVGFromURL(svgUrl, (objects, option) => {
      resolve(fabric.util.groupSVGElements(objects, option));
    });
  });
}
