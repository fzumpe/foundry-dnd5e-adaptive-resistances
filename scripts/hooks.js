import { MODULE_ID } from "./constants.js";
import {
  actorAlreadyProtected,
  actorVulnerableTo,
  getAdaptiveFeatureItems,
  getCandidatesForActor,
  getDominantDamageCandidate,
  isActiveGM
} from "./utils.js";
import { createAdaptiveEffect, removeOldAdaptiveEffects } from "./effects.js";

function hasAdaptiveFeature(actor) {
  return getAdaptiveFeatureItems(actor).length > 0;
}

function storeDamageSelection(options, data) {
  options[MODULE_ID] = data;
}

Hooks.on("dnd5e.preCalculateDamage", (actor, damages, options = {}) => {
  if (!isActiveGM()) return;
  if (!hasAdaptiveFeature(actor)) return;

  const candidates = getCandidatesForActor(actor, damages);
  if (!candidates.length) return;

  const alreadyProtected = candidates.some(candidate => actorAlreadyProtected(actor, candidate.type));
  if (alreadyProtected) {
    storeDamageSelection(options, {
      skip: true,
      reason: "damage-already-reduced-or-prevented"
    });
    return;
  }

  const vulnerable = candidates.some(candidate => actorVulnerableTo(actor, candidate.type));
  if (vulnerable) {
    storeDamageSelection(options, {
      skip: true,
      reason: "damage-has-vulnerability"
    });
    return;
  }

  const candidate = getDominantDamageCandidate(candidates);
  if (!candidate?.type || !candidate?.adaptationType) return;

  storeDamageSelection(options, {
    skip: false,
    damageType: candidate.type,
    adaptationType: candidate.adaptationType
  });
});

Hooks.on("dnd5e.applyDamage", async (actor, amount, options = {}) => {
  if (!isActiveGM()) return;
  if (!hasAdaptiveFeature(actor)) return;

  const data = options[MODULE_ID];
  if (!data || data.skip) return;
  if (!data.damageType || !data.adaptationType) return;

  // Der Effekt soll nur entstehen, wenn nach Berechnung wirklich Schaden am Actor ankommt.
  if (typeof amount !== "number" || amount <= 0) return;

  await removeOldAdaptiveEffects(actor);
  await createAdaptiveEffect(actor, data.damageType, data.adaptationType);

  console.debug(`${MODULE_ID} | ${actor.name} gains adaptive ${data.adaptationType} against ${data.damageType}.`);
});
