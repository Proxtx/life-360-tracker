import { promises as fs } from "fs";

export const syncObj = async (file, interval = 5000, run = { run: true }) => {
  let data = JSON.parse(await readFile(file));
  saveLoop(file, data, interval, run);
  return data;
};

export const saveFile = async (file, data) => {
  await fs.writeFile(file, data);
};

export const readFile = async (file) => {
  try {
    return await fs.readFile(file, "utf-8");
  } catch (e) {
    return "{}";
  }
};

const saveLoop = async (file, obj, interval, run) => {
  while (run.run) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    saveFile(file, JSON.stringify(obj, null, 4));
  }
};
