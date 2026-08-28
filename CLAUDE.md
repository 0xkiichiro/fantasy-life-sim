# Fantasy Life Sim — Project Context

## What this is

A BitLife-style life simulator set in a medieval fantasy world (~1400s–1500s, magic and dragons). Character is randomly generated, ages up year by year, makes choices that shape stats, relationships, wealth, and class proficiency, building toward becoming a legendary hero, a veteran adventurer, or something far more ordinary.

This is the first of two planned prototypes. A second, tonally distinct game — a political satire life sim set in Turkey, where Erdoğan remains leader for life via a fictional anti-aging serum, and the player can work within the system or attempt to overthrow him — is planned later, reusing this same engine. Do not build anything for the second game yet; the `content/` directory should stay generic-but-fantasy-only until that's explicitly asked for.

Full game design is in `fantasy-life-sim-design-doc.md` at the repo root — read that for gameplay rules (resource pools, relationship thresholds, dice mechanics, death system, etc.) before making design changes.

## Hard rules for this codebase

These were established deliberately across a long design conversation. Follow them without re-litigating unless the user explicitly asks to change them.

1. **No comments anywhere in the source. This is absolute and has zero exceptions for
   "helpful" explanation.** No `//`, no `/* */`, no `/** */` JSDoc, no section-divider
   comments (`// ---- stats ----`), no trailing end-of-line notes, no YAML `#` comments,
   no CSS `/* */`, no `#` comments in the Python tooling, Dockerfile, or Makefile. This
   applies to code you write from scratch *and* to code you edit — if you touch a file
   that has comments, strip them while you are in there. If something needs explaining,
   it goes in this file, the README, or the design doc. If a line genuinely cannot be
   understood without a comment, that is a signal to rename things or restructure until
   it can be.

   The single permitted exception is **`src/vite-env.d.ts`**, which contains
   `/// <reference types="vite/client" />`. That is a TypeScript triple-slash *directive*
   — compiler instruction syntax that merely looks like a comment. Deleting it is a
   functional change, not a cleanup. Nothing else is exempt.

2. **One object per file.** Every exported class, interface, or type alias representing a distinct entity gets its own file, named after that entity, inside the `objects/` folder of whichever module owns it. Do not bundle related types into one file for convenience (e.g. `ResourcePool` and `PoolSet` are separate files even though they're closely related). This rule applies to type/interface/class definitions only — functions and behavior are not subject to it.

3. **`engine/` never imports from `content/`.** Content imports from engine, never the reverse. If the engine needs to reference something content-shaped (e.g. `Character.items`), define a minimal structural interface in `engine/shared/objects/` instead of importing the content-layer class directly — TypeScript's structural typing means the content class will satisfy it automatically.

4. **YAML for pure data, TypeScript for anything with real logic.** Childhood flavor events (`content/events/flavor.yaml`) have no branching, dice, or player choice, just narrated text and a declarative effects list — that's a legitimate YAML use case. Anything with dice rolls, conditional branching, or options that change based on character state (class, items, stats) stays in TypeScript. Don't invent a scripting language inside a YAML file to route around this.

5. **`Character` and other core entities are real classes with behavior**, not plain data bags. Mutations go through methods (`applyStatChange`, `spendGold`, `adjustRelationship`, `die`, etc.), not direct field access, so invariants (gold can't go negative, stats stay clamped) are enforced in one place.

6. **Templated content objects use the factory pattern.** `Item`, `CharacterClass`, `DungeonEncounter` each have a `*Template` interface (the declarative shape a content author writes) and a class with a private constructor plus a `fromTemplate()` static factory. Follow this pattern for any new recurring, variable content type — don't hardcode instances inline the way the original POC hardcoded "ogre-kin".

## Directory structure

```
src/
  engine/                      game-agnostic simulation rules, no fantasy content
    shared/objects/             Character, Relationship, ResourcePool, PoolSet,
                                CoreStats, ConditionStats, ClassName, InventoryItem
    characterEngine/
      characterEngine.ts         createCharacter(template) — generic
      objects/                    CharacterTemplate, StatRange, RelationshipSeed
    eventEngine/
      eventEngine.ts               eligibility filtering + yearly event selection,
                                  enforces the "events outnumber the pools" rule
      objects/                    GameEvent, EventOption, EventCost, EventResult,
                                  EventCategory, FlavorEvent
    ageEngine/
      ageEngine.ts                 advances one year, triggers old-age death check
      objects/                    AgeStage
    poolManager/
      poolManager.ts               action-point pool sizing (basePoolSize, spend)
    diceEngine/
      diceEngine.ts                 2d6-advantage roll (rollAdvantage)
    deathSystem/
      deathSystem.ts                 old-age curve + risk-driven death resolution,
                                  single extension point for the future legacy system

  content/                      fantasy-specific — swap this whole folder for a
                                different game later
    objects/                     Item, ItemTemplate, ItemRarity,
                                CharacterClass, CharacterClassTemplate,
                                DungeonEncounter, DungeonEncounterTemplate,
                                EffectTarget, RawFlavorEntry
    events/
      flavor.yaml                  ages 0–9 passive flavor events, pure data
      recurring-social.ts           recurring social-pool events (festivals,
                                  visiting parents, favors, etc.)
      recurring-proficiency.ts      recurring proficiency-pool events (odd jobs,
                                  drills, contracts, study)
      scripted.ts                   one-off storyline arcs: wizard mentor,
                                  coming-of-age class choice, dungeon/ogre fight,
                                  love interest, dowry, family secret, etc.
    classes.ts, items.ts, characterTemplate.ts
    contentLoader.ts              parses flavor.yaml, assembles the EventRegistry

  state/
    gameReducer.ts               AGE_UP / RESOLVE_OPTION / SKIP_EVENT / RESTART
    objects/                     GameState, GameAction

  ui/
    App.tsx                      wires gameReducer to the screen via useReducer
    components/                  StatBar, CarvedButton, EventCard, RelationshipPanel,
                                Frame, HeroPortrait, Icon
    objects/                     IconName
    theme.ts                     colour tokens + CLASS_COLORS
    styles.css                   all layout/material/bevel styling (see UI section)

tools/
  generate-textures.py          bakes the tileable material PNGs into public/textures

public/
  textures/                     oak, stone, leather, parchment — generated, committed
```

## Current state — what's actually implemented

- Full age-up loop: childhood flavor (0–9) → coming-of-age class choice (16) → adult scripted/recurring events.
- Two resource pools (social, proficiency), deliberately scarce, sized by age and level. **Scarcity is a load-bearing design decision** — the event engine deliberately draws more events per year than the pools can afford (see `RECURRING_DRAWS_PER_POOL` in `eventEngine.ts`). Don't "fix" this by loosening it without checking the design doc first.
- Relationship tracking (mother, father, friend, love interest) with a `crossedThreshold()` mechanism on `Relationship`, though most scripted events currently check relationship score directly rather than using that method — worth revisiting for consistency.
- One full storyline arc (wizard mentor), one class-conditional dungeon encounter (the ogre-kin fight — options change for Mage or Warrior-with-Ashen-Blade), a love/dowry arc, a family-secret arc.
- Death: risk-based during risky events (`deathChance` on an `EventResult`), plus a ramping old-age probability after 55.
- Docker + Makefile for containerized dev (`make run`) and a production nginx-served build (`make run-prod`). `make typecheck` runs `tsc && vite build` inside the image. `package-lock.json` is committed and the image installs with `npm ci`.

- **Run `npm install` locally before opening the editor.** Without `node_modules`, TypeScript cannot find `@types/react` or `react/jsx-runtime`, and every `.tsx` file lights up with `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists (7026)` and `This JSX tag requires the module path 'react/jsx-runtime' to exist (2875)`. Those errors mean "dependencies are not installed", not "the code is wrong" — `make typecheck` passes in Docker the whole time, because the container installs its own.

## UI look & feel — Heroes of Might and Magic 3

The UI targets a HoMM3 / late-90s PC game aesthetic: skeuomorphic, dark, grimy, and
entirely opaque. The rules that direction implies:

1. **Materials come from generated raster textures, not CSS gradients.**
   `tools/generate-textures.py` bakes four seamless 256px tiles (oak, stone, leather,
   parchment) using FFT-based tileable noise, anisotropic noise for wood grain, and
   cellular/Worley noise for stone fracture and leather pebbling. Re-run it with
   `python3 tools/generate-textures.py` (needs numpy only — it hand-rolls the PNG
   encoder). Tweak the material functions there rather than layering CSS on top.

2. **Every texture is applied with `background-blend-mode: multiply`** over a solid
   background-color, and with an explicit `background-size` (~92–168px). The colour
   controls tone; the size controls grain scale. Both matter — an unscaled tile reads
   as planks rather than grain.

3. **No transparency.** Panels are fully opaque. Alpha is used only for bevel
   highlights and shadow within a surface, never to let one panel show through another.

4. **Crisp edges, no hand-drawn wobble.** An earlier pass used SVG turbulence
   displacement on borders; it was dropped deliberately. HoMM3's art is painted but its
   UI edges are sharp.

5. **`Frame` is the single panel primitive** (`ui/components/Frame.tsx`) — carved stone
   border, four corner rivets, four gold filigree corners, and an inset well of oak or
   parchment. Use it for any new panel instead of hand-rolling borders.

6. **Styling lives in `ui/styles.css`, not inline styles.** The raised/pressed bevel on
   buttons needs `:hover`/`:active`, which inline style objects cannot express. Inline
   styles are now only used for genuinely dynamic values (a stat bar's width, a
   class-derived colour).

7. **Icons are vendored game-icons.net silhouettes**, not an icon library. `lucide-react`
   was removed deliberately: its stroke-only, uniform-weight, rounded-cap style is the
   opposite of HoMM3's solid painted silhouettes, and thin strokes disappear against the
   textures. `Icon.tsx` holds the raw path data inline (512×512 viewBox, `currentColor`
   fill, engraved drop-shadow via the `.icon` class) so there is no runtime dependency.
   To add one: grab the SVG from the `game-icons/icons` GitHub repo (flat
   `<author>/<name>.svg` layout), drop the `M0 0h512v512H0z` background path, add the
   shape path to `PATHS` and the key to `IconName`, and credit the artist in the README —
   the icons are CC BY 3.0 and attribution is required. Note they carry a lot of detail:
   below ~16px they turn to mush, so size them 16–18px rather than 12–14px.

8. Layout stays a **single centred column**. A 16:9 sidebar layout was considered and
   rejected — see the minimap note under Known gaps.

## Known gaps / explicit next steps

- **No save/load system.** `Character` + `PoolSet` + `seenOnce` is the entire game state — persistence is just serializing that, but it hasn't been built.
- **`DungeonEncounter` is defined but unused.** Dungeons are still resolved as inline prose in `scripted.ts` (the "ogre-kin" fight is hardcoded, not built from a template). The class exists so the *next* dungeon can be built from a template instead of copy-pasting more hardcoded prose — that's the natural next thing to build if adding more dungeon content.
- **No automated tests.** `diceEngine`, `eventEngine`, and `deathSystem` are pure functions with no UI dependency — best candidates to test first.
- **Death legacy system is an explicit v2/stretch goal**, not v1 scope: on death, the player would get a choice (write a book, hide a legendary item, send an inspiration letter) that seeds a new event into a *future* playthrough. `deathSystem.ts` was structured so this is a single extension point later. Do not build this unless asked — it was explicitly deferred.
- **Items/gear beyond the single "Ashen Blade" example are unbuilt.** The `Item` factory pattern is proven out with one example; a real item roster doesn't exist yet.
- **Locations & travel, and the minimap that goes with them.** Planned, not built. The
  intent: the character can travel between named locations (home village, nearby town,
  wilderness, dungeon sites), and where they are gates which events are eligible. When
  that lands, the UI gains a **framed minimap panel** in the HoMM3 style — a `Frame`
  containing a stylised region map with the current location marked, and travel as an
  action that costs pool points like any other event. The minimap was deliberately left
  out of the HoMM3 reskin because there is nothing spatial to show yet; do not add a
  decorative one before the locations system exists. This is also the point at which a
  16:9 sidebar layout becomes worth reconsidering — it was rejected for now specifically
  because a single centred column has nothing to put in a sidebar.

- **`GameState` and `GameAction` live inside `state/gameReducer.ts`**, not in a
  `state/objects/` folder. This contradicts hard rule 2 and the directory listing above.
  Pre-existing; worth fixing when that file is next touched.

- **`content/contentLoader.ts` contains `//` comments**, which hard rule 1 forbids.
  Pre-existing; strip them when next editing that file.

## Working style notes

- The person building this (Andrew) prefers to design/brainstorm conversationally first, then have things drafted/implemented afterward — not implementation-first.
- Prior architecture discussion happened verbally and was translated into this structure iteratively; if something in the code seems like an odd choice, check this file and the design doc before assuming it's arbitrary — most structural decisions here were deliberate trade-offs discussed explicitly, not defaults.
