# Economy Reference

The scale every gold value in the game is priced against. Read this before inventing a
number for an event reward, an item, or a story beat that involves money.

This is a **pricing reference, not a mechanic.** Nothing here is deducted automatically.
There is no yearly upkeep, no rent charged at age-up, no starvation rule. The tables exist
so that a reward written in one event and a cost written in another are denominated in the
same currency and mean the same thing. If upkeep ever becomes a real mechanic, this is the
document it should be built from.

## The anchor

**1 gold buys roughly two and a half weeks of food for one adult.**
**Annual subsistence for one adult is 7 gold.**

The anchor was derived from the content that already existed rather than invented, so the
game's original numbers still hold: a working adult earns 10–40 gold a year, which must sit
just above subsistence or nobody in a medieval village is poor.

One turn is one year, so **every figure below is annual unless stated otherwise.**

## Household spending

What a household needs per year for food, fuel, clothing and rent. Children count as
roughly half an adult.

| Household | Gold / year |
|---|---|
| Single adult | 7 |
| Couple | 14 |
| Couple + 1 child | 18 |
| Couple + 2 children | 21 |
| Couple + 4 children | 28 |

## Housing

| | Gold |
|---|---|
| Rented room (per year) | 3 |
| Tenant cottage (per year) | 5 |
| Buy a village cottage | 60 |
| Buy a townhouse | 180 |
| A manor with land | 900 |

Buying a cottage is roughly three years of a labouring household's entire spending. That
is deliberate: property should be out of reach for most lives and a genuine milestone when
it happens.

## Income by station

What a working adult in that station earns per year. These are the figures a character
should converge on once established in a class, and they are the same figures used to set
the starting purse of a family of that station.

| Station | Gold / year |
|---|---|
| Casual labourer | 10–16 |
| Tenant farmer | 12–20 |
| Soldier (levy) | 15–25 |
| Hedge-wizard | 20–40 |
| Skilled smith | 25–45 |
| Scribe | 30–50 |
| Merchant | 50–120 |
| Minor noble (from rents) | 120–300 |

### The anchoring rule

**A family's wealth and the wealth their child can reach in the same station must match.**
If the father is a modest hedge-wizard, a character who becomes a modest hedge-wizard
should end up in roughly the same bracket. Wealth in this game comes from *station*, not
from accumulating event rewards, and a life that stays in its birth station should end
about where it started.

A family's **starting purse** is its liquid savings, not its income: expect roughly
0.3–1.5× annual income. The backgrounds in `content/familyBackgrounds.ts` follow this.

| Background | Starting purse | Implied station income |
|---|---|---|
| Peasant farmers | 2–8 | 12–20 |
| Labourers | 4–12 | 10–16 |
| Soldiers | 8–22 | 15–25 |
| Hedge-wizard | 10–30 | 20–40 |
| Smith | 12–26 | 25–45 |
| Scribes | 18–40 | 30–50 |
| Merchants | 25–60 | 50–120 |
| Minor nobility | 70–160 | 120–300 |

Peasants holding under half a year of spending is correct. They live hand to mouth.

## Goods and services

`ItemTemplate.value` is the item's worth in gold. It is a valuation, not a promise that the
item is purchasable — legendary items are priced so they can be appraised, sold, or used as
a story stake, not bought off a shelf.

| | Gold |
|---|---|
| Simple knife | 2 |
| A year of work tools | 5 |
| Healer's treatment | 8 |
| Plain sword | 25 |
| Basic spellbook | 40 |
| Mail hauberk | 80 |
| Warhorse | 120 |
| Legendary weapon (Ashen Blade) | 400 |
| Apprenticeship fee | 20 |
| Modest dowry | 50 |
| Gentry dowry | 200 |

## Event rewards already in the game

Existing values, listed so new content stays consistent with them rather than drifting.

| Event | Gold |
|---|---|
| Stranger conversation | 10 |
| Contract, poor roll | 10 |
| Odd job | 12 |
| Dungeon, poor roll | 15 |
| Scripted job | 20 |
| Contract, good roll | 25 |
| Dungeon, good roll | 40 |
| Family support (cost) | 20 |
| Dowry (cost) | 50 |

## Writing new content

- A single year's event reward should sit in the **10–40** band for ordinary work. Paying
  much more than a station's annual income for one event breaks the anchoring rule.
- Anything above **100 gold** should be a life event, not a job: an inheritance, a noble
  patron, a legendary find.
- Costs above **50 gold** should hurt. That is more than two years of a poor household's
  total spending, and for most characters it should mean choosing not to do something else.
- Do not let a character out-earn their station through repeatable events. If a labourer
  can grind to merchant wealth, station stops meaning anything.
