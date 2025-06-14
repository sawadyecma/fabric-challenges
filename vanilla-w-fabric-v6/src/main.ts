const storyModules = import.meta.glob("./stories/*.story.ts");

const listEl = document.getElementById("story-list")!;
const containerEl = document.getElementById("story-container")!;
const titleEl = document.querySelector("main h1")!;
const sidebarEl = document.querySelector("aside")!;
const toggleButton = document.getElementById("toggle-sidebar")!;
const bodyEl = document.body;

import "./styles/main.css";

// Story interface
interface Story {
  render: (container: HTMLElement) => void;
  docs?: () => string;
}

// Sidebar toggle functionality
const toggleSidebar = () => {
  const isCollapsed = sidebarEl.classList.toggle("collapsed");
  toggleButton.classList.toggle("collapsed");
  bodyEl.classList.toggle("sidebar-collapsed");
  localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
};

// Initialize sidebar state
const initializeSidebar = () => {
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    sidebarEl.classList.add("collapsed");
    toggleButton.classList.add("collapsed");
    bodyEl.classList.add("sidebar-collapsed");
  }
};

toggleButton.addEventListener("click", toggleSidebar);
initializeSidebar();

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
  const story = mod as Story;

  // Create container for story and documentation
  const storyWrapper = document.createElement("div");
  storyWrapper.style.cssText = `
    display: flex;
    gap: 20px;
  `;

  // Story container
  const storyContainer = document.createElement("div");
  storyContainer.style.flex = "1";
  story.render(storyContainer);
  storyWrapper.appendChild(storyContainer);

  // Documentation container
  if (story.docs) {
    const docContainer = document.createElement("div");
    docContainer.style.cssText = `
      width: 300px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
      font-size: 14px;
      line-height: 1.6;
    `;
    docContainer.innerHTML = story.docs();
    storyWrapper.appendChild(docContainer);
  }

  containerEl.appendChild(storyWrapper);
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
