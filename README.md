
# Adaptive Damage Resistance
Adaptive Damage Resistance is a small module for Foundry VTT and the Dungeons & Dragons 5e system.

It adds features that allow creatures to adapt to the damage they suffer. After a creature is hit and actually takes damage, it can gain a temporary resistance or immunity against that damage type. When it is later damaged by another matching damage type, the previous adaptation is replaced.

<video src="adaptive-resistances.webm" controls width="720"></video>

## Inhaltsverzeichnis

- [What the module does](#what-the-module-does)
- [Included feature groups](#included-feature-groups)
- [How to use](#how-to-use)
- [Important behavior](#important-behavior)
- [Examples](#examples)
- [Installation](#installation)
- [Compatibility](#compatibility)
- [Repository](#repository)

## What the module does
The module adds a compendium with ready-to-use features. You can drag these features onto any actor that should gain adaptive protection.

There are two kinds of adaptive protection:

- **Adaptive Resistance**
- **Adaptive Immunity**

Each kind is available for different groups of damage types.

## Included feature groups

### Elemental
The creature adapts to elemental damage types such as fire, cold, acid, lightning, and thunder.

### Magical
The creature adapts to more supernatural damage types such as force, necrotic, psychic, and radiant damage.

### Profane
The creature adapts to physical weapon damage types such as bludgeoning, piercing, and slashing.
This does not check whether a weapon is magical or non-magical. It only reacts to the damage type itself.

### Single damage types
The module also includes one feature for each individual damage type. These can be used when a creature should only adapt to one specific kind of damage.

## How to use
1. Enable the module in your world.
2. Open the compendium **Adaptive Damage Resistance Features**.
3. Drag one of the adaptive features onto an actor.
4. Use the normal dnd5e damage workflow during combat.

When the actor takes valid damage, the matching resistance or immunity is added automatically.

## Important behavior
The adaptation only happens when damage is actually dealt.

It does not trigger if:

- no damage is applied,
- the damage is reduced to 0,
- the creature was already resistant or immune to that damage type,
- the damage type does not match the feature on the actor.

The new resistance or immunity is applied after the triggering hit. It does not protect against the same hit that caused it.

## Examples
A creature has **Adaptive Resistance: Elemental**.

It is hit by fire damage and takes damage.  
It gains resistance to fire damage.

Later, it is hit by cold damage and takes damage.  
The fire resistance is replaced with cold resistance.

A creature has **Adaptive Immunity: Fire**.

It is hit by fire damage and takes damage.  
It gains immunity to fire damage.

If the same creature is later hit by cold damage, nothing changes because the feature only reacts to fire damage.

## Installation
Use the manifest URL from the latest release:

```txt
https://github.com/fzumpe/foundry-dnd5e-adaptive-resistances/releases/latest/download/module.json
```
Or download the ZIP file from the release page and install it manually into your Foundry VTT modules folder.

## Compatibility
This module is intended for:

Foundry VTT 14
dnd5e 5.3.3

## Repository
https://github.com/fzumpe/foundry-dnd5e-adaptive-resistances
