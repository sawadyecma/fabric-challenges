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

// Function to load and render a story
const loadStory = async (path: string, loader: () => Promise<any>) => {
  containerEl.innerHTML = "";
  const mod = await loader();
  mod.render(containerEl);
  titleEl.textContent = `Story: ${path}`;

  // Update URL without reloading the page
  const url = new URL(window.location.href);
  url.searchParams.set("story", path);
  window.history.pushState({}, "", url);
};

// Function to get story number from URL
const getStoryNumberFromUrl = () => {
  const url = new URL(window.location.href);
  const storyParam = url.searchParams.get("story");
  if (storyParam) {
    const match = storyParam.match(/case(\d+)\.story\.ts$/);
    return match ? parseInt(match[1], 10) : null;
  }
  return null;
};

// Process entries sequentially to maintain order
(async () => {
  for (const { path, loader } of sortedEntries) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = path;
    li.appendChild(a);
    li.onclick = () => loadStory(path, loader);
    listEl.appendChild(li);
  }

  // Load initial story
  const storyNumber = getStoryNumberFromUrl();
  if (storyNumber !== null) {
    // Find and load the specified story
    const story = sortedEntries.find((entry) => entry.num === storyNumber);
    if (story) {
      await loadStory(story.path, story.loader);
    }
  } else if (sortedEntries.length > 0) {
    // Load the first story if no story is specified
    const firstStory = sortedEntries[0];
    await loadStory(firstStory.path, firstStory.loader);
  }
})();
