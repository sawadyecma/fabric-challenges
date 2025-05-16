export class Logger {
  private static logContainer: HTMLElement | null = null;
  private static isVisible: boolean = true;
  private static readonly STORAGE_KEY = "logger-visible";

  private static initializeLogContainer() {
    if (!this.logContainer) {
      // Load visibility state from localStorage
      const storedVisibility = localStorage.getItem(this.STORAGE_KEY);
      this.isVisible =
        storedVisibility === null ? true : storedVisibility === "true";

      this.logContainer = document.createElement("div");
      this.logContainer.id = "log-container";
      this.logContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px;
        font-family: monospace;
        overflow-y: auto;
        z-index: 9999;
        transition: transform 0.3s ease;
        transform: translateY(${this.isVisible ? "0" : "100%"});
      `;

      // Add toggle button
      const toggleButton = document.createElement("button");
      toggleButton.textContent = this.isVisible ? "▼ Hide Logs" : "▲ Show Logs";
      toggleButton.style.cssText = `
        position: fixed;
        bottom: 210px;
        right: 10px;
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        z-index: 9999;
      `;
      toggleButton.onclick = () => this.toggleVisibility();
      document.body.appendChild(toggleButton);

      document.body.appendChild(this.logContainer);
    }
  }

  private static toggleVisibility() {
    this.isVisible = !this.isVisible;
    if (this.logContainer) {
      this.logContainer.style.transform = `translateY(${
        this.isVisible ? "0" : "100%"
      })`;
      const toggleButton = document.querySelector("button");
      if (toggleButton) {
        toggleButton.textContent = this.isVisible
          ? "▼ Hide Logs"
          : "▲ Show Logs";
      }
    }
    // Save state to localStorage
    localStorage.setItem(this.STORAGE_KEY, this.isVisible.toString());
  }

  private static createLogEntry(
    message: string,
    type: "log" | "error" | "warn" | "info" = "log"
  ) {
    const entry = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString();
    const color =
      type === "error"
        ? "#ff6b6b"
        : type === "warn"
        ? "#ffd93d"
        : type === "info"
        ? "#4dabf7"
        : "#fff";

    entry.style.cssText = `
      margin: 2px 0;
      color: ${color};
    `;
    entry.textContent = `[${timestamp}] ${message}`;
    return entry;
  }

  static log(message: string) {
    this.initializeLogContainer();
    if (this.logContainer) {
      this.logContainer.appendChild(this.createLogEntry(message, "log"));
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
  }

  static error(message: string) {
    this.initializeLogContainer();
    if (this.logContainer) {
      this.logContainer.appendChild(this.createLogEntry(message, "error"));
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
  }

  static warn(message: string) {
    this.initializeLogContainer();
    if (this.logContainer) {
      this.logContainer.appendChild(this.createLogEntry(message, "warn"));
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
  }

  static info(message: string) {
    this.initializeLogContainer();
    if (this.logContainer) {
      this.logContainer.appendChild(this.createLogEntry(message, "info"));
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
  }

  static clear() {
    if (this.logContainer) {
      this.logContainer.innerHTML = "";
    }
  }
}
