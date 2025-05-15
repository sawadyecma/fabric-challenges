export class Logger {
  private static logContainer: HTMLElement | null = null;

  private static initializeLogContainer() {
    if (!this.logContainer) {
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
      `;
      document.body.appendChild(this.logContainer);
    }
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
