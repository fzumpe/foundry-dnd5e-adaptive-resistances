import {
  MODULE_ID
} from "./constants.js";

import {
  actorAlreadyProtected,
  actorVulnerableTo,
  getAdaptiveTriggerEffects,
  getCandidatesForActor,
  getDominantDamageCandidate,
  isActiveGM,
  isAdaptiveTriggerApplied
} from "./utils.js";

import {
  createAdaptiveEffect,
  removeOldAdaptiveEffects,
  removeOrphanedAdaptiveEffects
} from "./effects.js";

function storeDamageSelection(options, data) {
  options[MODULE_ID] = data;
}

function actorFromParentDocument(document) {
  if (!document) return null;

  if (document.documentName === "Actor") {
    return document;
  }

  if (
    document.documentName === "Item"
    && document.parent?.documentName === "Actor"
  ) {
    return document.parent;
  }

  return null;
}

function queueOrphanCleanup(actor) {
  if (!actor || !isActiveGM()) return;

  queueMicrotask(() => removeOrphanedAdaptiveEffects(actor));
}

/**
 * Vor der Schadensberechnung wird ausschließlich ermittelt,
 * welcher adaptive Schutz nach dem Treffer entstehen dürfte.
 *
 * Der neue Schutz wird hier bewusst noch nicht gesetzt, damit er den
 * auslösenden Treffer nicht bereits selbst reduziert.
 */
Hooks.on("dnd5e.preCalculateDamage", (actor, damages, options = {}) => {
  if (!isActiveGM()) return;
  if (!getAdaptiveTriggerEffects(actor).length) return;

  const candidates = getCandidatesForActor(actor, damages);

  if (!candidates.length) return;

  const alreadyProtected = candidates.some(
    candidate => actorAlreadyProtected(actor, candidate.type)
  );

  if (alreadyProtected) {
    storeDamageSelection(options, {
      skip: true,
      reason: "damage-already-reduced-or-prevented"
    });

    return;
  }

  const vulnerable = candidates.some(
    candidate => actorVulnerableTo(actor, candidate.type)
  );

  if (vulnerable) {
    storeDamageSelection(options, {
      skip: true,
      reason: "damage-has-vulnerability"
    });

    return;
  }

  const candidate = getDominantDamageCandidate(candidates);

  if (
    !candidate?.type
    || !candidate?.adaptationType
    || !candidate?.sourceEffectUuid
  ) {
    return;
  }

  storeDamageSelection(options, {
    skip: false,
    damageType: candidate.type,
    adaptationType: candidate.adaptationType,
    sourceEffectUuid: candidate.sourceEffectUuid
  });
});

/**
 * Erst nachdem dnd5e tatsächlichen Schaden angewendet hat, wird die neue
 * Resistenz oder Immunität erzeugt.
 */
Hooks.on("dnd5e.applyDamage", async (actor, amount, options = {}) => {
  if (!isActiveGM()) return;

  const data = options[MODULE_ID];

  if (!data || data.skip) return;

  if (
    !data.damageType
    || !data.adaptationType
    || !data.sourceEffectUuid
  ) {
    return;
  }

  // Kein tatsächlich angewendeter Schaden: keine Anpassung.
  if (typeof amount !== "number" || amount <= 0) {
    return;
  }

  // Die Quelle muss beim Anwenden des Schadens noch aktiv sein.
  if (!isAdaptiveTriggerApplied(actor, data.sourceEffectUuid)) {
    return;
  }

  await removeOldAdaptiveEffects(actor);

  await createAdaptiveEffect(
    actor,
    data.damageType,
    data.adaptationType,
    data.sourceEffectUuid
  );

  console.debug(
    `${MODULE_ID} | ${actor.name} gains adaptive ${data.adaptationType} against ${data.damageType}.`
  );
});

/**
 * Wird ein Gegenstand abgelegt, seine Einstimmung aufgehoben oder ein
 * Marker-Effect deaktiviert beziehungsweise entfernt, muss eine daraus
 * entstandene adaptive Schutzwirkung ebenfalls verschwinden.
 */
Hooks.on("updateItem", item => {
  queueOrphanCleanup(actorFromParentDocument(item.parent));
});

Hooks.on("deleteItem", item => {
  queueOrphanCleanup(actorFromParentDocument(item.parent));
});

Hooks.on("createActiveEffect", effect => {
  queueOrphanCleanup(actorFromParentDocument(effect.parent));
});

Hooks.on("updateActiveEffect", effect => {
  queueOrphanCleanup(actorFromParentDocument(effect.parent));
});

Hooks.on("deleteActiveEffect", effect => {
  queueOrphanCleanup(actorFromParentDocument(effect.parent));
});