import {
  MODULE_ID,
  TRIGGER_FLAG,
  DAMAGE_SETS,
  ADAPTATION_TYPES,
  ADAPTATION_CONFIG
} from "./constants.js";

export function isActiveGM() {
  return game.user?.isGM === true;
}

export function localize(key) {
  return game.i18n.localize(key);
}

export function getDamageTypeLabel(type) {
  const configured = CONFIG.DND5E?.damageTypes?.[type];

  if (!configured) return type;

  if (typeof configured === "string") {
    return game.i18n.localize(configured);
  }

  return game.i18n.localize(configured.label ?? type);
}

export function getDamageValue(damage) {
  if (!damage) return 0;

  const candidates = [
    damage.value,
    damage.amount,
    damage.total,
    damage.damage,
    damage.active?.value,
    damage.active?.amount,
    damage.active?.total
  ];

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return 0;
}

export function getDamageType(damage) {
  return damage?.type
    ?? damage?.damageType
    ?? damage?.application?.type
    ?? null;
}

export function toArrayValue(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  if (typeof value === "object") {
    return Object.keys(value).filter(key => value[key]);
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

export function actorResistanceValues(actor) {
  return toArrayValue(actor?.system?.traits?.dr?.value);
}

export function actorImmunityValues(actor) {
  return toArrayValue(actor?.system?.traits?.di?.value);
}

export function actorVulnerabilityValues(actor) {
  return toArrayValue(actor?.system?.traits?.dv?.value);
}

export function actorVulnerableTo(actor, damageType) {
  return actorVulnerabilityValues(actor).includes(damageType);
}

export function actorAlreadyResists(actor, damageType) {
  return actorResistanceValues(actor).includes(damageType);
}

export function actorAlreadyImmune(actor, damageType) {
  return actorImmunityValues(actor).includes(damageType);
}

export function actorAlreadyProtected(actor, damageType) {
  return actorAlreadyResists(actor, damageType)
    || actorAlreadyImmune(actor, damageType);
}

/**
 * Liefert alle aktuell auf den Actor angewendeten Marker-Effects.
 *
 * Hierdurch funktionieren sowohl:
 * - Feature-Items auf dem Actor,
 * - transferierende Effekte von Ausrüstung,
 * - transferierende Effekte von attuned Items,
 * - direkt auf den Actor gesetzte Marker-Effects.
 */
export function getAdaptiveTriggerEffects(actor) {
  if (!actor) return [];

  return Array.from(actor.appliedEffects ?? []).filter(effect => {
    const trigger = effect.getFlag(MODULE_ID, TRIGGER_FLAG);
    const adaptationType =
      trigger?.adaptationType ?? ADAPTATION_TYPES.RESISTANCE;

    return trigger?.enabled === true
      && DAMAGE_SETS[trigger?.setId]
      && ADAPTATION_CONFIG[adaptationType];
  });
}

/**
 * Prüft, ob eine konkrete adaptive Quelle weiterhin auf dem Actor angewendet wird.
 */
export function isAdaptiveTriggerApplied(actor, effectUuid) {
  if (!effectUuid) return false;

  return getAdaptiveTriggerEffects(actor).some(
    effect => effect.uuid === effectUuid
  );
}

/**
 * Bereitet aus den aktuell angewendeten Marker-Effects alle erlaubten
 * Schadenstyp-/Adaptationstyp-Kombinationen auf.
 */
export function getAllowedAdaptationsForActor(actor) {
  const result = [];

  for (const effect of getAdaptiveTriggerEffects(actor)) {
    const trigger = effect.getFlag(MODULE_ID, TRIGGER_FLAG);
    const set = DAMAGE_SETS[trigger.setId];
    const adaptationType =
      trigger.adaptationType ?? ADAPTATION_TYPES.RESISTANCE;

    for (const damageType of set.damageTypes) {
      result.push({
        damageType,
        adaptationType,
        priority: ADAPTATION_CONFIG[adaptationType].priority,
        sourceEffectUuid: effect.uuid
      });
    }
  }

  return result;
}

/**
 * Ermittelt die tatsächlich für den Treffer in Frage kommenden
 * adaptiven Schadensreaktionen.
 */
export function getCandidatesForActor(actor, damages) {
  const allowed = getAllowedAdaptationsForActor(actor);

  if (!allowed.length || !Array.isArray(damages)) {
    return [];
  }

  return damages
    .map(damage => ({
      type: getDamageType(damage),
      value: getDamageValue(damage)
    }))
    .filter(damage => damage.type && damage.value > 0)
    .flatMap(damage => allowed
      .filter(entry => entry.damageType === damage.type)
      .map(entry => ({
        type: damage.type,
        value: damage.value,
        adaptationType: entry.adaptationType,
        priority: entry.priority,
        sourceEffectUuid: entry.sourceEffectUuid
      }))
    );
}

/**
 * Bei mehreren passenden Schadenstypen gewinnt zunächst der höchste Schaden.
 * Bei Gleichstand gewinnt Immunität vor Resistenz über deren höhere Priorität.
 */
export function getDominantDamageCandidate(candidates) {
  if (!candidates?.length) return null;

  return [...candidates].sort((a, b) => {
    const valueDifference = b.value - a.value;

    if (valueDifference !== 0) {
      return valueDifference;
    }

    return b.priority - a.priority;
  })[0];
}

export function getDominantDamageType(candidates) {
  return getDominantDamageCandidate(candidates)?.type ?? null;
}

// Backwards-compatible alias used by older local patches of this module.
export function getElementalCandidatesForActor(actor, damages) {
  return getCandidatesForActor(actor, damages);
}