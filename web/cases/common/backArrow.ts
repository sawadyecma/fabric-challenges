export const backArrow = (app: HTMLElement) => {
  const a = document.createElement("a");
  a.href = "/";
  a.innerText = "back";
  app.appendChild(a);
};
