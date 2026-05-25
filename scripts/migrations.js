import {
  MODULE_ID,
  FEATURE_FLAG
} from "./constants.js";

import {
  ensureTriggerEffectOnFeatureItem
} from "./features.js";

/**
 * Ergänzt bei Feature-Items, die bereits in Version 1.0.0 auf Welt-Actoren
 * gezogen wurden, den neuen transferierenden ActiveEffect-Marker.
 *
 * Das bisherige Item-Flag wird nicht entfernt. Es bleibt als Identifikator
 * für Migrationen und Kompendium-Abgleich erhalten.
 */
export async function migrateWorldActorFeatureItems() {
  if (!game.user?.isGM) return;

  let upgraded = 0;

  for (const actor of game.actors ?? []) {
    for (const item of actor.items ?? []) {
      const legacyFeature = item.getFlag(MODULE_ID, FEATURE_FLAG);

      if (!legacyFeature?.enabled) continue;

      if (await ensureTriggerEffectOnFeatureItem(item)) {
        upgraded += 1;
      }
    }
  }

  if (upgraded > 0) {
    console.info(
      `${MODULE_ID} | Added ActiveEffect triggers to ${upgraded} existing actor feature item(s).`
    );
  }
}