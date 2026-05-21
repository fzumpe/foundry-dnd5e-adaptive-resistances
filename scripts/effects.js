import {
  MODULE_ID,
  EFFECT_FLAG,
  ADAPTATION_CONFIG,
  ADAPTATION_TYPES,
  PROFANE_DAMAGE_TYPES,
  PROFANE_BYPASSES
} from "./constants.js";
import { getDamageTypeLabel } from "./utils.js";

export async function removeOldAdaptiveEffects(actor) {
  const oldEffects = actor.effects.filter(effect => effect.getFlag(MODULE_ID, EFFECT_FLAG));
  if (!oldEffects.length) return;

  await actor.deleteEmbeddedDocuments("ActiveEffect", oldEffects.map(effect => effect.id));
}

function getAdaptiveChanges(config, damageType) {
  const changes = [
    {
      key: config.traitKey,
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: damageType,
      priority: 20
    }
  ];

  if (PROFANE_DAMAGE_TYPES.includes(damageType)) {
    const bypassKey = config.traitKey.replace(/\.value$/, ".bypasses");

    for (const bypass of PROFANE_BYPASSES) {
      changes.push({
        key: bypassKey,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: bypass,
        priority: 20
      });
    }
  }

  return changes;
}

export async function createAdaptiveEffect(actor, damageType, adaptationType = ADAPTATION_TYPES.RESISTANCE) {
  const config = ADAPTATION_CONFIG[adaptationType] ?? ADAPTATION_CONFIG[ADAPTATION_TYPES.RESISTANCE];
  const label = getDamageTypeLabel(damageType);

  await actor.createEmbeddedDocuments("ActiveEffect", [
    {
      name: game.i18n.format(config.effectNameKey, { type: label }),
      icon: config.icon,
      disabled: false,
      transfer: false,
      flags: {
        [MODULE_ID]: {
          [EFFECT_FLAG]: {
            adaptationType: config.id,
            damageType
          }
        }
      },
      changes: getAdaptiveChanges(config, damageType)
    }
  ]);
}

export async function createAdaptiveResistanceEffect(actor, damageType) {
  return createAdaptiveEffect(actor, damageType, ADAPTATION_TYPES.RESISTANCE);
}
