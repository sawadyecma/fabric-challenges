export async function composeImgEle(url: string) {
  const imgEle = document.createElement("img");
  imgEle.src = url;

  return new Promise<HTMLImageElement>((resolve, reject) => {
    imgEle.onload = () => {
      resolve(imgEle);
    };
    imgEle.onerror = () => {
      reject("failed to load img at composeImgEle");
    };
  });
}
