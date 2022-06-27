function main() {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const caseCount = 100;
  for (let i = 1; i < caseCount; i++) {
    const a = document.createElement("a");

    const link = `/cases/${String(i).padStart(3, "0")}/`;
    a.href = link;
    a.innerText = link;
    a.style.display = "block";

    app.appendChild(a);
  }
}

main();

export {};
