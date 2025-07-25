import { Logger } from "../utils/logger";

export function render(container: HTMLElement) {
  const bg = document.createElement("div");
  bg.style.width = "100%";
  bg.style.height = "100%";
  bg.style.backgroundColor = "white";
  bg.style.position = "relative";
  // bg.style.marginTop = "800px";
  container.appendChild(bg);

  const textWrapper = document.createElement("div");
  textWrapper.style.position = "relative";
  bg.appendChild(textWrapper);

  const text = document.createElement("div");
  text.textContent = "テキスト";
  // bg.appendChild(text);
  textWrapper.appendChild(text);

  const showKeyboardButton = document.createElement("button");
  showKeyboardButton.textContent = "Show Keyboard";
  // showKeyboardButton.style.position = "absolute";
  // showKeyboardButton.style.top = "10px";
  // showKeyboardButton.style.left = "10px";
  textWrapper.appendChild(showKeyboardButton);

  showKeyboardButton.addEventListener("click", () => {
    // textarea.style.cssText = `position: absolute;
    // top: ${top};
    // left: ${left};
    //  z-index: -999;
    // opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ${fontSize};`;

    const hiddenTextarea = document.createElement("textarea");
    // hiddenTextarea.style.position = "absolute";
    // hiddenTextarea.style.top = "0px";
    // // hiddenTextarea.style.left = "10px";
    // hiddenTextarea.style.width = "1px";
    // hiddenTextarea.style.height = "1px";
    // // hiddenTextarea.style.zIndex = "-100";
    // hiddenTextarea.style.zIndex = "-999";
    // // hiddenTextarea.style.opacity = "0.01";
    // hiddenTextarea.style.opacity = "0";
    // hiddenTextarea.style.fontSize = "1px";
    hiddenTextarea.style.cssText = `
    position: absolute;
    opacity: 0;
    z-index: -9999;
    // bottom:0;
    // background-color: red;
    `;

    hiddenTextarea.addEventListener("input", (e) => {
      // @ts-ignore
      Logger.info(e.currentTarget?.value);
      // @ts-ignore
      text.textContent = e.currentTarget?.value || "";
    });
    document.body.appendChild(hiddenTextarea);
    hiddenTextarea.focus();
  });
}

export function docs() {
  return "case08";
}
