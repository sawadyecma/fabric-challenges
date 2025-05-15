export function render(container: HTMLElement) {
  const button = document.createElement("button");
  button.textContent = "Click Me";
  button.onclick = () => alert("Clicked!");
  container.appendChild(button);
}
