# Fantasy Life Sim — Engine + Content Architecture (v1)

A BitLife-style medieval fantasy life sim, structured so the **engine**
(generic simulation rules) is fully decoupled from the **content**
(fantasy-specific events, classes, items). See
`fantasy-life-sim-design-doc.md` for the game design; this README covers
the code architecture.

## Directory layout

```
src/
  engine/              # game-agnostic simulation rules — no fantasy content lives here
    shared/objects/     # Character, Relationship, ResourcePool — used by 3+ engines
    characterEngine/    # generic character creation from a CharacterTemplate
    eventEngine/         # eligibility filtering + yearly event selection
    ageEngine/            # advances one year, triggers old-age death check
    poolManager/           # action-point pool sizing (basePoolSize, spend)
    diceEngine/             # 2d6-advantage roll
    deathSystem/             # old-age curve + risk-driven death resolution

  content/             # fantasy-specific — swap this whole folder for a different game
    objects/            # templated classes: Item, CharacterClass, DungeonEncounter
    events/               # flavor.yaml (pure data), recurring-*.ts, scripted.ts
    classes.ts, items.ts, characterTemplate.ts
    contentLoader.ts      # parses flavor.yaml, assembles the full EventRegistry

  state/
    gameReducer.ts      # AGE_UP / RESOLVE_OPTION / SKIP_EVENT / RESTART actions

  ui/
    App.tsx             # wires gameReducer to the screen via useReducer
    components/          # StatBar, WaxButton, EventCard, RelationshipPanel
    theme.ts               # design tokens (parchment/wax-seal palette)
```

## The engine/content boundary

The rule we're enforcing: **engine code never imports from `content/`.**
Content imports from engine (an event file imports `GameEvent` from
`eventEngine/objects/`), never the other way. This is what makes
`content/` swappable for a future second game (e.g. the political-satire
prototype) without touching a single file under `engine/`.

One example of this in practice: `Character` needs an `items` array, but
it must not import content's `Item` class directly. Instead
`engine/shared/objects/Character.ts` declares a minimal structural
interface (`InventoryItem { name: string }`); content's `Item` class
satisfies that shape automatically, so `character.addItem(someItem)`
works without the engine ever knowing `Item` exists.

## Objects vs. plain data

Per-directory `objects/` folders hold real classes with behavior, not
just type shapes:

- **`Character`** (`engine/shared/objects/`) — stats, resources,
  relationships, flags; methods like `applyStatChange`, `spendGold`,
  `adjustRelationship`, `die`. Other code calls these methods rather than
  mutating fields directly, so invariants (gold can't go negative, stats
  stay clamped) live in one place.
- **`Item`, `CharacterClass`, `DungeonEncounter`** (`content/objects/`) —
  templated classes: a plain `*Template` interface describes the
  declarative shape a content author writes, and a private constructor +
  `fromTemplate()` static factory spins up instances. `DungeonEncounter`
  exists even though there's no dungeon-crawling system yet, so the next
  dungeon can be built from a template instead of hardcoded prose.
- **`GameEvent` / `EventOption` / `FlavorEvent`** (`engine/eventEngine/objects/`)
  — not classes, since events are pure declarative content (a `resolve()`
  closure plus metadata) rather than objects with internal state to
  encapsulate. `FlavorEvent` is a deliberately separate shape from
  `GameEvent`: a flavor event is a thing that *happens to* the character
  (ages 0–9, no choice), while a `GameEvent` is a decision.

## Content formats: YAML vs. TypeScript

- **`content/events/flavor.yaml`** — pure data. Childhood flavor events
  have no branching, no dice, no player choice — just a narrated line and
  a small declarative effect list (`{ target: "stat", stat: "strength",
  delta: 1 }`). `contentLoader.ts` parses this and turns each entry's
  `effects` list into an `effect: (c: Character) => void` function.
- **`content/events/scripted.ts`, `recurring-*.ts`** — real logic: dice
  rolls, conditional stat checks, options that change based on class or
  inventory (see `monster-encounter` in `scripted.ts`, where a Mage or a
  Warrior holding the Ashen Blade gets different options). This isn't a
  good fit for YAML without inventing a scripting language inside the
  data file, so it stays as TypeScript functions.

## Design decisions this structure encodes

- **Pool scarcity is enforced, not incidental.** `eventEngine.ts` always
  surfaces every eligible scripted/arc event, plus a random draw of
  `RECURRING_DRAWS_PER_POOL` (currently 2) from each recurring pool —
  deliberately more than the typical 2–4 point pool can fully cover.
- **Childhood (ages 0–9) uses `FlavorEvent`, not `GameEvent`.** No
  decisions, just narrated beats with small automatic effects — see the
  design doc's "Childhood" section for the rationale.
- **Death is centralized in `deathSystem.ts`.** Both the old-age curve and
  event-driven risk (`deathChance` on an `EventResult`) resolve through
  the same module, which is what makes the v2 "death legacy" stretch goal
  a single extension point later instead of scattered logic.

## Running it

```
npm install
npm run dev        # Vite dev server
npm run typecheck  # tsc --noEmit
```

Note: dependencies could not be installed or typechecked in the sandbox
this was built in (registry access was blocked there) — review the code
directly, and run `npm install && npm run typecheck` locally to confirm
before treating it as fully verified.

## Known gaps / next steps

- No save/load system yet — `Character` + `PoolSet` + `seenOnce` is the
  entire game state, so persistence is just serializing that.
- `DungeonEncounter` is defined but unused — dungeons are still resolved
  inline in `scripted.ts` prose, same as the original POC.
- No automated tests yet. `diceEngine`, `eventEngine`, and `deathSystem`
  are the modules most worth unit testing first, since they're pure
  functions with no UI dependency.
