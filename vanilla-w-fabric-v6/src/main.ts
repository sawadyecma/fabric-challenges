const storyModules = import.meta.glob("./stories/*.story.ts");

const listEl = document.getElementById("story-list")!;
const containerEl = document.getElementById("story-container")!;
const titleEl = document.querySelector("main h1")!;

import "./styles/main.css";

Object.entries(storyModules).forEach(async ([path, loader]) => {
  const mod: any = await loader();
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = path;
  li.appendChild(a);
  li.onclick = () => {
    containerEl.innerHTML = "";
    mod.render(containerEl);
    titleEl.textContent = `Story: ${path}`;
  };
  listEl.appendChild(li);
});
