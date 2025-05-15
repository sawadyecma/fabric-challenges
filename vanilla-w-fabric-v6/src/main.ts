const storyModules = import.meta.glob("./stories/*.story.ts");

const listEl = document.getElementById("story-list")!;
const containerEl = document.getElementById("story-container")!;
const titleEl = document.querySelector("main h1")!;

import "./styles/main.css";

// Sort stories by case number
const sortedEntries = Object.entries(storyModules)
  .map(([path, loader]) => {
    const match = path.match(/case(\d+)\.story\.ts$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return { path, loader, num };
  })
  .sort((a, b) => a.num - b.num);

// Process entries sequentially to maintain order
(async () => {
  for (const { path, loader } of sortedEntries) {
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
  }
})();
