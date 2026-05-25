export const MODULE_ID = "adaptive-damage-resistance";
export const PACK_NAME = "adaptive-features";
export const PACK_ID = `${MODULE_ID}.${PACK_NAME}`;

/**
 * Dieses Flag bleibt auf den Feature-Items erhalten.
 * Es dient weiterhin zur Identifikation beim Erzeugen und Migrieren
 * der Kompendium- und Actor-Items.
 *
 * Für die Laufzeitlogik wird es ab Version 1.1.0 nicht mehr verwendet.
 */
export const FEATURE_FLAG = "adaptiveResistanceFeature";

/**
 * Dieses Flag liegt auf einem Active Effect.
 * Nur tatsächlich angewendete Active Effects mit diesem Flag aktivieren
 * die adaptive Resistenz- oder Immunitätslogik.
 */
export const TRIGGER_FLAG = "adaptiveResistanceTrigger";

/**
 * Dieses Flag markiert den dynamisch auf dem Actor erzeugten Effekt,
 * der die konkrete Resistenz oder Immunität gewährt.
 */
export const EFFECT_FLAG = "adaptiveResistanceEffect";

export const PROFANE_DAMAGE_TYPES = Object.freeze([
  "bludgeoning",
  "piercing",
  "slashing"
]);

export const PROFANE_BYPASSES = Object.freeze([
  "ada",
  "mgc",
  "sil"
]);

export const ADAPTATION_TYPES = Object.freeze({
  RESISTANCE: "resistance",
  IMMUNITY: "immunity"
});

export const ADAPTATION_CONFIG = Object.freeze({
  [ADAPTATION_TYPES.RESISTANCE]: {
    id: ADAPTATION_TYPES.RESISTANCE,
    priority: 10,
    traitKey: "system.traits.dr.value",
    effectNameKey: "ADR.Effects.AdaptiveResistance.Name",
    rulesTextKey: "ADR.Features.RulesText.Resistance",
    itemNamePrefixKey: "ADR.Features.Prefix.Resistance",
    icon: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp"
  },

  [ADAPTATION_TYPES.IMMUNITY]: {
    id: ADAPTATION_TYPES.IMMUNITY,
    priority: 20,
    traitKey: "system.traits.di.value",
    effectNameKey: "ADR.Effects.AdaptiveImmunity.Name",
    rulesTextKey: "ADR.Features.RulesText.Immunity",
    itemNamePrefixKey: "ADR.Features.Prefix.Immunity",
    icon: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp"
  }
});

export const DAMAGE_TYPES = Object.freeze({
  ACID: "acid",
  BLUDGEONING: "bludgeoning",
  COLD: "cold",
  FIRE: "fire",
  FORCE: "force",
  LIGHTNING: "lightning",
  NECROTIC: "necrotic",
  PIERCING: "piercing",
  POISON: "poison",
  PSYCHIC: "psychic",
  RADIANT: "radiant",
  SLASHING: "slashing",
  THUNDER: "thunder"
});

export const DAMAGE_SETS = Object.freeze({
  elemental: {
    id: "elemental",
    nameKey: "ADR.Features.Set.Elemental.Name",
    descriptionKey: "ADR.Features.Set.Elemental.Description",
    damageTypes: [
      "acid",
      "cold",
      "fire",
      "lightning",
      "thunder"
    ]
  },

  magical: {
    id: "magical",
    nameKey: "ADR.Features.Set.Magical.Name",
    descriptionKey: "ADR.Features.Set.Magical.Description",
    damageTypes: [
      "force",
      "necrotic",
      "psychic",
      "radiant"
    ]
  },

  profane: {
    id: "profane",
    nameKey: "ADR.Features.Set.Profane.Name",
    descriptionKey: "ADR.Features.Set.Profane.Description",
    damageTypes: [
      "bludgeoning",
      "piercing",
      "slashing"
    ]
  },

  nonProfane: {
    id: "nonProfane",
    nameKey: "ADR.Features.Set.NonProfane.Name",
    descriptionKey: "ADR.Features.Set.NonProfane.Description",
    damageTypes: [
      "acid",
      "cold",
      "fire",
      "force",
      "lightning",
      "necrotic",
      "poison",
      "psychic",
      "radiant",
      "thunder"
    ]
  },

  all: {
    id: "all",
    nameKey: "ADR.Features.Set.All.Name",
    descriptionKey: "ADR.Features.Set.All.Description",
    damageTypes: [
      "acid",
      "bludgeoning",
      "cold",
      "fire",
      "force",
      "lightning",
      "necrotic",
      "piercing",
      "poison",
      "psychic",
      "radiant",
      "slashing",
      "thunder"
    ]
  },

  acid: {
    id: "acid",
    nameKey: "ADR.Features.Set.Single.acid.Name",
    descriptionKey: "ADR.Features.Set.Single.acid.Description",
    damageTypes: ["acid"]
  },

  bludgeoning: {
    id: "bludgeoning",
    nameKey: "ADR.Features.Set.Single.bludgeoning.Name",
    descriptionKey: "ADR.Features.Set.Single.bludgeoning.Description",
    damageTypes: ["bludgeoning"]
  },

  cold: {
    id: "cold",
    nameKey: "ADR.Features.Set.Single.cold.Name",
    descriptionKey: "ADR.Features.Set.Single.cold.Description",
    damageTypes: ["cold"]
  },

  fire: {
    id: "fire",
    nameKey: "ADR.Features.Set.Single.fire.Name",
    descriptionKey: "ADR.Features.Set.Single.fire.Description",
    damageTypes: ["fire"]
  },

  force: {
    id: "force",
    nameKey: "ADR.Features.Set.Single.force.Name",
    descriptionKey: "ADR.Features.Set.Single.force.Description",
    damageTypes: ["force"]
  },

  lightning: {
    id: "lightning",
    nameKey: "ADR.Features.Set.Single.lightning.Name",
    descriptionKey: "ADR.Features.Set.Single.lightning.Description",
    damageTypes: ["lightning"]
  },

  necrotic: {
    id: "necrotic",
    nameKey: "ADR.Features.Set.Single.necrotic.Name",
    descriptionKey: "ADR.Features.Set.Single.necrotic.Description",
    damageTypes: ["necrotic"]
  },

  piercing: {
    id: "piercing",
    nameKey: "ADR.Features.Set.Single.piercing.Name",
    descriptionKey: "ADR.Features.Set.Single.piercing.Description",
    damageTypes: ["piercing"]
  },

  poison: {
    id: "poison",
    nameKey: "ADR.Features.Set.Single.poison.Name",
    descriptionKey: "ADR.Features.Set.Single.poison.Description",
    damageTypes: ["poison"]
  },

  psychic: {
    id: "psychic",
    nameKey: "ADR.Features.Set.Single.psychic.Name",
    descriptionKey: "ADR.Features.Set.Single.psychic.Description",
    damageTypes: ["psychic"]
  },

  radiant: {
    id: "radiant",
    nameKey: "ADR.Features.Set.Single.radiant.Name",
    descriptionKey: "ADR.Features.Set.Single.radiant.Description",
    damageTypes: ["radiant"]
  },

  slashing: {
    id: "slashing",
    nameKey: "ADR.Features.Set.Single.slashing.Name",
    descriptionKey: "ADR.Features.Set.Single.slashing.Description",
    damageTypes: ["slashing"]
  },

  thunder: {
    id: "thunder",
    nameKey: "ADR.Features.Set.Single.thunder.Name",
    descriptionKey: "ADR.Features.Set.Single.thunder.Description",
    damageTypes: ["thunder"]
  }
});

// Backwards compatible export for older module-internal imports or local overrides.
export const RESISTANCE_SETS = DAMAGE_SETS;