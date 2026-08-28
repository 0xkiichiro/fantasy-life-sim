# Fantasy Life Sim — Game Design Document (v1 Prototype)

## Concept

A BitLife-style life simulator set in a medieval fantasy world (roughly a 1400s–1500s aesthetic, with magic and dragons). The player experiences a randomly-influenced life from childhood through a chosen class path, aging up year by year, making choices that shape stats, relationships, wealth, and eventual class proficiency — building toward becoming a legendary hero, a veteran adventurer, or something far more ordinary.

This is the first of two planned prototypes. A second, tonally distinct game (a political satire life sim set in Turkey) is planned to reuse this same underlying engine once it's proven out.

---

## Core Loop

1. Character is randomly generated at birth (name, family, starting circumstances).
2. Player ages up one year at a time.
3. Each year, the event system draws from:
   - Random life events appropriate to the character's age and life stage
   - Any active storyline arcs (see below)
   - Conditional options unlocked by stats, skills, items, or class
4. Player spends **action points** from resource pools to engage with events (see Resource Pools).
5. Outcomes update stats, relationships, gold, and proficiency — which in turn affect future event availability.
6. Loop continues until death (old age, or risk-driven death from dangerous choices).

---

## Stats

**Core Stats** (drive what choices/classes are available):
- Strength
- Dexterity
- Intelligence
- Charisma

**Condition Stats** (fluctuate based on life events):
- Health
- Happiness
- Renown (fame/reputation/legacy — replaces BitLife's "Looks/Fame")

**Resources** (tracked separately from stats):
- **Gold** — earned, spent on gear, and gates certain story beats (dowries, family financial requests, etc.)
- **Class Proficiency / Experience** — tracked independently of age; earned through meaningful events (training with a mentor, clearing a dungeon, finding a legendary item), not by simply surviving another year

**Level** is *derived* from Proficiency crossing defined thresholds — not a manually tracked stat.

---

## Life Stages

- **Childhood (~ages 0–16):** Mirrors BitLife's early game — family life, village events, early hints of talent, potential triggered arcs (e.g. a traveling wizard mentor).
- **Coming of Age:** Player selects a class (Warrior, Mage, Rogue, etc.). This is the fork point where the event pool shifts from generic village life into class-relevant quest and dungeon content.
- **Adulthood:** Full access to class-specific proficiency events, dungeon/quest content, relationship arcs, and risk-driven events (including possible death).

---

## Resource Pools (Action Points)

Instead of one event per age-up, each year grants a limited pool of action points across categories, forcing meaningful tradeoffs:

- **Social Pool** — covers Love, Family, and Friends. Deliberately scarce (e.g., 2 points against 3 competing event options), so the player must neglect at least one relationship track per year.
- **Professional/Proficiency Pool** — covers Training (pure skill growth) vs. Questing/Working (wealth generation). Also deliberately scarce, producing natural archetypes: the broke legendary swordsman vs. the comfortably wealthy mediocre one.

**Pool sizing factors:**
- Base size scales with age/life stage (small as a child, larger as an adult)
- Scales with class level/proficiency (higher-level characters get bigger pools)
- Modified up or down by recent event outcomes (a bad year — injury, illness — can shrink next year's pool; a great year can expand it)

**Scarcity is load-bearing, not incidental.** Pools stay deliberately tight (2-4 points most years). Each year should draw *more* eligible events than the pools can cover — a mix of storyline/arc events plus a rotating pool of recurring generic events (festivals, visiting parents, favors, odd jobs, training drills, contracts, study) — so the player routinely has to let something go, not just occasionally. If pools are large relative to the number of events on offer in a given year, the resource-management tension collapses and the pools stop mattering. When a player has nothing left to spend on an event, they can explicitly let it pass rather than being forced to pick an option they can't afford.

---

## Childhood (Ages 0–9)

The earliest years shouldn't ask for real decisions — a five-year-old doesn't have agency over their own life — but they also shouldn't be empty. Instead of decision events, this window uses lightweight **flavor events**: short narrated beats (a good harvest, a bout of illness, a new sibling, a storm damaging the family home, a tax collector's visit, a village festival, an unexplained thing glimpsed in the woods) that apply small automatic effects to stats, happiness, gold, or relationships without presenting a choice. These exist purely to give the slow years texture and a sense that the world and family are moving around the character, before the coming-of-age fork at 16 hands the player real agency.

---

## Relationships

Each significant relationship (love interest, each parent, friends) is tracked as its **own numeric score**, which:
- Rises or falls based on event outcomes and how the player allocates Social pool points
- Crosses **hidden thresholds** that unlock new branching events (e.g., a girlfriend's father demanding a dowry, discovering a family secret, a friend connecting the player to a mentor)
- Can trigger **negative story events** if neglected long enough — not just a declining number, but actual consequences

Relationships are also a **gateway to resources and content** — a wealthy love interest, a high-renown in-law, a family secret unlocking a forbidden book, a parent's connection securing a mentorship.

Money interacts directly with relationships: certain relationship milestones require gold (dowries, family financial support), and refusing due to lack of funds can damage the relationship even if the refusal is "justified."

---

## Storyline Arcs

Triggered by specific events (e.g., a traveling wizard offers mentorship). When triggered:
- A flag is set on the character (e.g., `mentor_arc = active`)
- The event pool surfaces arc-relevant events for a limited window (roughly 2–3 age-ups)
- The arc runs in parallel with ongoing Social/Proficiency pool decisions — engaging with it means trading off other events
- Arcs are **time-limited opportunities, not permanently missable paths with a worse outcome** — if neglected, the opportunity simply expires (e.g., the wizard moves on)

Hidden family secrets can also be seeded at character creation (e.g., `has_secret = true`) and only become discoverable through sufficient investment in the relevant relationship track.

---

## Dice & Skill Checks

Risk-based actions use an **advantage-style roll** (D&D-inspired): roll two dice, take the higher result. Better relevant stats improve the odds of success without guaranteeing it — skill tilts probability rather than replacing it.

---

## Items & Skills

**Items:**
- Modify stats or dice rolls (e.g., a sword granting advantage on strength-related dungeon events, a cloak boosting stealth rolls for a Rogue)
- Acquired via gold, quest rewards, or legendary finds tied to the Proficiency arc

**Skills:**
- Extend the Proficiency track — unlocked at specific thresholds rather than a separate skill tree
- Become new options inside events once unlocked

**Dynamic/Conditional Event Options:**
Events present a base set of options available to everyone (e.g., "Fight" or "Flee"), plus additional options that only appear if the player meets certain requirements:
- A Mage with the right skill might get a "Cast radiant light" option
- A Warrior with a specific weapon might see "Fight" replaced with a flavored finishing move (e.g., "Get behind it and slash with your [weapon]")

This means the same event can feel completely different depending on the player's build.

---

## Death

- Not scripted at fixed ages — **probabilistic and risk-driven**
- Risky choices (dungeon delves, duels, dangerous quests) carry real death risk baked into the event
- Default outcome if playing safe: death of old age

---

## Stretch Goals (Version 2 / Later)

- **Death Legacy System:** Depending on how/where the character dies, the player gets a final choice that seeds content into *future* playthroughs (e.g., dying as a famous horseman lets you write a book, hide a legendary sword, or send an inspiration letter to a child in a future game — generating a new event in that future playthrough's pool)
- Full combat system (currently deliberately excluded — dungeon/combat events are resolved narratively for v1, not with a full battle system)
- Second prototype: political satire life sim set in Turkey (Erdoğan remains leader for life via a fictional anti-aging serum; player can work within the system or attempt to overthrow him)

---

## Explicitly Out of Scope for V1

- Full turn-based or real-time combat system
- Death legacy / cross-playthrough content system
- The political satire game (planned as the second prototype, reusing this engine)

---

## Revision Notes

- **v1.1** — Added the Childhood (Ages 0–9) section and made resource-pool scarcity explicit as a design requirement, based on playtesting the POC: the first pass had pools that were rarely contested, and the 0–9 window had no content at all.
