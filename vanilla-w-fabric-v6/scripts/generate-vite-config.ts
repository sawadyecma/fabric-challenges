import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storiesDir = path.join(__dirname, "../src/stories");

// storiesディレクトリから.story.tsファイルを検出
const storyFiles = fs
  .readdirSync(storiesDir)
  .filter((file) => file.endsWith(".story.ts"))
  .map((file) => ({
    name: file.replace(".story.ts", ""),
    path: `./src/stories/${file}`,
  }));

// 入力設定を生成
const storyInputs = Object.fromEntries(
  storyFiles.map((story) => [story.name, story.path])
);

// storyInputsの設定ファイルを生成
const configTemplate = `// This file is auto-generated. Do not edit manually.
export const storyInputs = ${JSON.stringify(storyInputs, null, 2)} as const;
`;

// 設定ファイルを生成
fs.writeFileSync(
  path.join(__dirname, "../src/story-inputs.ts"),
  configTemplate
);
