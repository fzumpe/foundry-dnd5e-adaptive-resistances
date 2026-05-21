import { MODULE_ID } from "./constants.js";
import { seedFeatureCompendium } from "./features.js";
import "./hooks.js";

Hooks.once("init", () => {
  console.info(`${MODULE_ID} | Initializing.`);
});

Hooks.once("ready", async () => {
  await seedFeatureCompendium();
});
