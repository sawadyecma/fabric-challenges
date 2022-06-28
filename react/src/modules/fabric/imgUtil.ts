import { fabric } from "fabric";

export async function composeImgEle(url: string) {
  return (await loadImageFromUrl(url)).getElement();
}

export async function loadImageFromUrl(url: string) {
  return new Promise<fabric.Image>((resolve) => {
    fabric.Image.fromURL(url, function (img) {
      resolve(img);
    });
  });
}
