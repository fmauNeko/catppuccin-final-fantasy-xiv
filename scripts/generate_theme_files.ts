import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const filenameRegex = /^catppuccin-(?<flavor>[^-]+)-(?<accent>[^-]+)-(?<plugin>[^-]+)-?(?<variant>[^.]+)?\.json$/;

const filesToProcess = await readdir(join(import.meta.dir, "..", "json"), { recursive: true, withFileTypes: true });

for (const file of filesToProcess.filter((file) => file.isFile())) {
  const filenameMatch = file.name.match(filenameRegex);

  const content = await readFile(join(file.parentPath, file.name), { encoding: "utf8" });
  const minifiedContent = JSON.stringify(JSON.parse(content));

  const b64Content = Buffer.from(minifiedContent).toString("base64");

  const destinationPath = join(import.meta.dir, "..", "themes", filenameMatch.groups.flavor, filenameMatch.groups.accent);

  await mkdir(destinationPath, { recursive: true });
  await writeFile(join(destinationPath, file.name.replace(".json", ".txt")), b64Content);
}
