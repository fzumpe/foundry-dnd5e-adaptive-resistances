import {
  MODULE_ID,
  EFFECT_FLAG,
  ADAPTATION_CONFIG,
  ADAPTATION_TYPES,
  PROFANE_DAMAGE_TYPES,
  PROFANE_BYPASSES
} from "./constants.js";

import {
  getAdaptiveTriggerEffects,
  getDamageTypeLabel
} from "./utils.js";

/**
 * Entfernt sämtliche dynamisch erzeugten adaptiven Schutzwirkungen.
 * Eine neu ausgelöste Anpassung ersetzt damit immer die vorherige.
 */
export async function removeOldAdaptiveEffects(actor) {
  const oldEffects = actor.effects.filter(
    effect => effect.getFlag(MODULE_ID, EFFECT_FLAG)
  );

  if (!oldEffects.length) return;

  await actor.deleteEmbeddedDocuments(
    "ActiveEffect",
    oldEffects.map(effect => effect.id)
  );
}

/**
 * Entfernt adaptive Schutzwirkungen, deren auslösende Quelle nicht mehr
 * auf dem Actor angewendet wird.
 *
 * Beispiel:
 * Ein getragenes Amulett verleiht adaptive Feuerresistenz. Wird das Amulett
 * abgelegt, verschwindet sein Marker-Effect aus actor.appliedEffects und die
 * zuvor erzeugte Feuerresistenz wird ebenfalls entfernt.
 */
export async function removeOrphanedAdaptiveEffects(actor) {
  if (!actor) return;

  const appliedSourceUuids = new Set(
    getAdaptiveTriggerEffects(actor).map(effect => effect.uuid)
  );

  const orphanedEffects = actor.effects.filter(effect => {
    const data = effect.getFlag(MODULE_ID, EFFECT_FLAG);

    return data?.sourceEffectUuid
      && !appliedSourceUuids.has(data.sourceEffectUuid);
  });

  if (!orphanedEffects.length) return;

  await actor.deleteEmbeddedDocuments(
    "ActiveEffect",
    orphanedEffects.map(effect => effect.id)
  );
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

/**
 * Erzeugt die konkrete adaptive Resistenz oder Immunität auf dem Actor.
 */
export async function createAdaptiveEffect(
  actor,
  damageType,
  adaptationType = ADAPTATION_TYPES.RESISTANCE,
  sourceEffectUuid = null
) {
  const config = ADAPTATION_CONFIG[adaptationType]
    ?? ADAPTATION_CONFIG[ADAPTATION_TYPES.RESISTANCE];

  const label = getDamageTypeLabel(damageType);

  await actor.createEmbeddedDocuments("ActiveEffect", [
    {
      name: game.i18n.format(config.effectNameKey, { type: label }),
      img: config.icon,
      disabled: false,
      transfer: false,

      flags: {
        [MODULE_ID]: {
          [EFFECT_FLAG]: {
            adaptationType: config.id,
            damageType,
            sourceEffectUuid
          }
        }
      },

      changes: getAdaptiveChanges(config, damageType)
    }
  ]);
}

export async function createAdaptiveResistanceEffect(
  actor,
  damageType,
  sourceEffectUuid = null
) {
  return createAdaptiveEffect(
    actor,
    damageType,
    ADAPTATION_TYPES.RESISTANCE,
    sourceEffectUuid
  );
}