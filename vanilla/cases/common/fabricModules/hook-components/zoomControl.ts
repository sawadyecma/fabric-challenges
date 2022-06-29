let zoom = 1;

export function addZoomControl(
  app: HTMLElement,
  guiEditor: { zoom: (rate: number) => void }
) {
  const zoomDownButton = document.createElement("button");
  zoomDownButton.innerText = "zoomDown";
  zoomDownButton.addEventListener("click", onZoomDownButtonClick);
  app.appendChild(zoomDownButton);

  function onZoomDownButtonClick() {
    zoom -= 0.1;
    // canvas.setZoom(zoom);
    guiEditor.zoom(zoom);
    // canvas.zoomToPoint(new fabric.Point(100, 100), zoom);
  }

  const zoomUpButton = document.createElement("button");
  zoomUpButton.innerText = "zoomUp";
  zoomUpButton.addEventListener("click", onZoomUpButtonClick);
  app.appendChild(zoomUpButton);

  function onZoomUpButtonClick() {
    zoom += 0.1;
    // canvas.setZoom(zoom);
    guiEditor.zoom(zoom);

    // canvas.zoomToPoint(new fabric.Point(100, 100), zoom);
  }
}
