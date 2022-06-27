import { fabric } from "fabric";

export async function composeImgEle(url: string = "/icons/checkbox/off.svg") {
  return (await loadImageFromUrl(url)).getElement();

  /** 
  const imgEle = await new Promise<HTMLImageElement>((reslove) => {
    const imgEle = document.createElement("image") as HTMLImageElement;
    imgEle.src = url;
    imgEle.onload = () => {
      reslove(imgEle);
    };
  });

  return imgEle;
  */
}

export async function loadImageFromUrl(
  url: string = "/icons/checkbox/off.svg"
) {
  return new Promise<fabric.Image>((resolve) => {
    fabric.Image.fromURL(url, function (img) {
      // scale image down, and flip it, before adding it onto canvas
      // oImg.scale(0.5).set("flipX", true);
      resolve(img);
    });
  });
}
