import {
  MODULE_ID,
  PACK_ID,
  FEATURE_FLAG,
  TRIGGER_FLAG,
  DAMAGE_SETS,
  ADAPTATION_CONFIG,
  ADAPTATION_TYPES
} from "./constants.js";

const ENGLISH_DAMAGE_TYPE_LABELS = Object.freeze({
  acid: "Acid",
  bludgeoning: "Bludgeoning",
  cold: "Cold",
  fire: "Fire",
  force: "Force",
  lightning: "Lightning",
  necrotic: "Necrotic",
  piercing: "Piercing",
  poison: "Poison",
  psychic: "Psychic",
  radiant: "Radiant",
  slashing: "Slashing",
  thunder: "Thunder"
});

const ENGLISH_SET_TEXT = Object.freeze({
  elemental: {
    name: "Elemental",
    description: "The creature adapts to elemental force: caustic acid, biting cold, searing fire, crackling lightning, and concussive thunder."
  },

  magical: {
    name: "Magical",
    description: "The creature adapts to supernatural harm born of raw force, necrotic decay, psychic pressure, or radiant power."
  },

  profane: {
    name: "Profane",
    description: "The creature adapts to bodily violence from bludgeoning, piercing, and slashing harm. This follows the dnd5e damage types and does not reliably distinguish magical from nonmagical weapons."
  },

  nonProfane: {
    name: "Non-Profane",
    description: "The creature adapts to damage that is not simple bodily violence: acid, cold, fire, force, lightning, necrotic, poison, psychic, radiant, and thunder."
  },

  all: {
    name: "All Damage",
    description: "The creature adapts to any registered dnd5e damage type as long as the damage truly pierces its defenses."
  },

  acid: {
    name: "Acid",
    description: "The creature adapts to acid damage once it truly pierces its defenses."
  },

  bludgeoning: {
    name: "Bludgeoning",
    description: "The creature adapts to bludgeoning damage once it truly pierces its defenses."
  },

  cold: {
    name: "Cold",
    description: "The creature adapts to cold damage once it truly pierces its defenses."
  },

  fire: {
    name: "Fire",
    description: "The creature adapts to fire damage once it truly pierces its defenses."
  },

  force: {
    name: "Force",
    description: "The creature adapts to force damage once it truly pierces its defenses."
  },

  lightning: {
    name: "Lightning",
    description: "The creature adapts to lightning damage once it truly pierces its defenses."
  },

  necrotic: {
    name: "Necrotic",
    description: "The creature adapts to necrotic damage once it truly pierces its defenses."
  },

  piercing: {
    name: "Piercing",
    description: "The creature adapts to piercing damage once it truly pierces its defenses."
  },

  poison: {
    name: "Poison",
    description: "The creature adapts to poison damage once it truly pierces its defenses."
  },

  psychic: {
    name: "Psychic",
    description: "The creature adapts to psychic damage once it truly pierces its defenses."
  },

  radiant: {
    name: "Radiant",
    description: "The creature adapts to radiant damage once it truly pierces its defenses."
  },

  slashing: {
    name: "Slashing",
    description: "The creature adapts to slashing damage once it truly pierces its defenses."
  },

  thunder: {
    name: "Thunder",
    description: "The creature adapts to thunder damage once it truly pierces its defenses."
  }
});

const ENGLISH_ADAPTATION_TEXT = Object.freeze({
  [ADAPTATION_TYPES.RESISTANCE]: {
    prefix: "Adaptive Resistance",
    rules: "After a hit, the creature remembers the damage type if the damage truly pierced its defenses. It then gains limited resistance to that exact damage type. If another matching damage type harms it later, the new adaptation replaces the old one. If resistance or immunity already softened or stopped the damage, the adaptation does not change."
  },

  [ADAPTATION_TYPES.IMMUNITY]: {
    prefix: "Adaptive Immunity",
    rules: "After a hit, the creature remembers the damage type if the damage truly pierced its defenses. It then gains limited immunity to that exact damage type. If another matching damage type harms it later, the new adaptation replaces the old one. If resistance or immunity already softened or stopped the damage, the adaptation does not change."
  }
});

function getEnglishDamageTypeLabel(type) {
  return ENGLISH_DAMAGE_TYPE_LABELS[type] ?? type;
}

function featureName(set, adaptationType) {
  const text = ENGLISH_ADAPTATION_TEXT[adaptationType]
    ?? ENGLISH_ADAPTATION_TEXT[ADAPTATION_TYPES.RESISTANCE];

  const setText = ENGLISH_SET_TEXT[set.id];

  return `${text.prefix}: ${setText?.name ?? set.id}`;
}

function featureDescription(set, adaptationType) {
  const text = ENGLISH_ADAPTATION_TEXT[adaptationType]
    ?? ENGLISH_ADAPTATION_TEXT[ADAPTATION_TYPES.RESISTANCE];

  const setText = ENGLISH_SET_TEXT[set.id];
  const damageTypes = set.damageTypes.map(getEnglishDamageTypeLabel).join(", ");

  return `<p>${setText?.description ?? "The creature adapts to the selected damage type once it truly pierces its defenses."}</p>
<p><strong>Reacts to:</strong> ${damageTypes}</p>
<p>${text.rules}</p>`;
}

function featureSourceId(setId, adaptationType) {
  return `${MODULE_ID}.${adaptationType}.${setId}`;
}

/**
 * Erstellt den passiven Marker-Effekt, nach dem die Laufzeitlogik sucht.
 *
 * Der Effect verändert selbst keine Werte. Er markiert nur eine aktuell
 * wirksame Quelle für adaptive Resistenz oder Immunität.
 *
 * Da transfer=true gesetzt ist, kann derselbe Effect auch später an
 * Ausrüstung oder attuned Items verwendet werden.
 */
export function buildTriggerEffectData(
  set,
  adaptationType = ADAPTATION_TYPES.RESISTANCE
) {
  const config = ADAPTATION_CONFIG[adaptationType]
    ?? ADAPTATION_CONFIG[ADAPTATION_TYPES.RESISTANCE];

  return {
    name: featureName(set, config.id),
    img: config.icon,
    disabled: false,
    transfer: true,
    changes: [],
    flags: {
      [MODULE_ID]: {
        [TRIGGER_FLAG]: {
          enabled: true,
          adaptationType: config.id,
          setId: set.id,
          damageTypes: [...set.damageTypes]
        }
      }
    }
  };
}

/**
 * Erstellt ein neues Kompendium-Feature einschließlich seines Marker-Effects.
 */
export function buildFeatureItemData(
  set,
  adaptationType = ADAPTATION_TYPES.RESISTANCE
) {
  const config = ADAPTATION_CONFIG[adaptationType]
    ?? ADAPTATION_CONFIG[ADAPTATION_TYPES.RESISTANCE];

  return {
    name: featureName(set, config.id),
    type: "feat",
    img: config.icon,

    system: {
      description: {
        value: featureDescription(set, config.id),
        chat: ""
      },

      source: {
        book: "Adaptive Damage Resistance",
        page: "",
        custom: ""
      },

      activation: {
        type: "special",
        cost: null,
        condition: ""
      },

      uses: {
        spent: 0,
        max: "",
        recovery: []
      },

      type: {
        value: "monster",
        subtype: ""
      }
    },

    effects: [
      buildTriggerEffectData(set, config.id)
    ],

    flags: {
      [MODULE_ID]: {
        [FEATURE_FLAG]: {
          enabled: true,
          adaptationType: config.id,
          setId: set.id,
          damageTypes: [...set.damageTypes]
        }
      },

      core: {
        sourceId: `Item.${featureSourceId(set.id, config.id)}`
      }
    }
  };
}

function getItemFeatureFlag(item) {
  return item?.getFlag?.(MODULE_ID, FEATURE_FLAG)
    ?? foundry.utils.getProperty(item, `flags.${MODULE_ID}.${FEATURE_FLAG}`);
}

function getTriggerFlag(effect) {
  return effect?.getFlag?.(MODULE_ID, TRIGGER_FLAG)
    ?? foundry.utils.getProperty(effect, `flags.${MODULE_ID}.${TRIGGER_FLAG}`);
}

export function getFeatureKey(entry) {
  const flag = getItemFeatureFlag(entry);

  if (!flag?.setId) return null;

  return `${flag.adaptationType ?? ADAPTATION_TYPES.RESISTANCE}.${flag.setId}`;
}

/**
 * Ergänzt bei einem bereits existierenden Feature-Item den neuen Marker-Effect,
 * falls das Item aus Version 1.0.0 stammt und diesen noch nicht besitzt.
 *
 * Name, Beschreibung und sonstige manuelle Änderungen des Items bleiben erhalten.
 */
export async function ensureTriggerEffectOnFeatureItem(item) {
  const feature = getItemFeatureFlag(item);
  const adaptationType = feature?.adaptationType ?? ADAPTATION_TYPES.RESISTANCE;
  const set = DAMAGE_SETS[feature?.setId];

  if (!feature?.enabled || !set || !ADAPTATION_CONFIG[adaptationType]) {
    return false;
  }

  const hasTrigger = Array.from(item.effects ?? []).some(effect => {
    const trigger = getTriggerFlag(effect);

    return trigger?.enabled === true
      && trigger.setId === set.id
      && (trigger.adaptationType ?? ADAPTATION_TYPES.RESISTANCE) === adaptationType;
  });

  if (hasTrigger) return false;

  await item.createEmbeddedDocuments("ActiveEffect", [
    buildTriggerEffectData(set, adaptationType)
  ]);

  return true;
}

async function getOrCreatePack() {
  const pack = game.packs.get(PACK_ID);

  if (!pack) {
    console.error(`${MODULE_ID} | Compendium ${PACK_ID} was not found.`);
    return null;
  }

  return pack;
}

async function unlockPack(pack) {
  if (!pack.locked) return false;

  await pack.configure({ locked: false });
  return true;
}

async function restorePackLock(pack, wasLocked) {
  if (!wasLocked) return;

  await pack.configure({ locked: true });
}

/**
 * Erzeugt fehlende Features und ergänzt bestehende v1.0.0-Features um den
 * ActiveEffect-Marker für die neue Architektur.
 */
export async function seedFeatureCompendium() {
  if (!game.user?.isGM) return;

  const pack = await getOrCreatePack();
  if (!pack) return;

  const wasLocked = await unlockPack(pack);

  try {
    const index = await pack.getIndex({
      fields: [
        `flags.${MODULE_ID}.${FEATURE_FLAG}.setId`,
        `flags.${MODULE_ID}.${FEATURE_FLAG}.adaptationType`
      ]
    });

    for (const adaptationType of Object.values(ADAPTATION_TYPES)) {
      for (const set of Object.values(DAMAGE_SETS)) {
        const featureKey = `${adaptationType}.${set.id}`;

        const existingEntry = index.find(
          entry => getFeatureKey(entry) === featureKey
        );

        if (existingEntry) {
          const existingItem = await pack.getDocument(existingEntry._id);

          await ensureTriggerEffectOnFeatureItem(existingItem);
          continue;
        }

        await Item.create(
          buildFeatureItemData(set, adaptationType),
          { pack: PACK_ID }
        );
      }
    }
  } catch (error) {
    console.error(
      `${MODULE_ID} | Failed to seed or upgrade the feature compendium.`,
      error
    );

    ui.notifications?.error(
      game.i18n.localize("ADR.Notifications.SeedFailed")
    );
  } finally {
    await restorePackLock(pack, wasLocked);
  }
}