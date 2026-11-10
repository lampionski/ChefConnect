---
name: ChefConnect
description: A restaurant site printed in two inks on cool paper, in the manner of 60s–70s Black Sea resort print.
colors:
  blue: "#1b2f8f"
  blue-ink: "#121a4a"
  blue-soft: "#4a5590"
  blue-line: "rgb(27 47 143 / 0.22)"
  blue-tint: "rgb(27 47 143 / 0.06)"
  on-blue-soft: "#c9d0f0"
  red: "#c8321a"
  red-hover: "#ad2a14"
  red-tint: "rgb(200 50 26 / 0.08)"
  ok: "#1b6b4a"
  ok-tint: "rgb(27 107 74 / 0.09)"
  paper: "#f6f6f1"
  paper-2: "#ecedf3"
  sheet-white: "#ffffff"
typography:
  display:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, system-ui, sans-serif"
    fontSize: "clamp(4rem, 1rem + 10.5vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.4vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  lede:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Sofia Sans Condensed, Sofia Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  small:
    fontFamily: "Sofia Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
  "9": "7rem"
  gutter: "clamp(1rem, 4vw, 3rem)"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.35rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
    textColor: "{colors.paper}"
  button-default:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.35rem"
    height: "48px"
  button-default-hover:
    backgroundColor: "{colors.blue-ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.blue}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.35rem"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blue}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.35rem"
    height: "48px"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.red}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.35rem"
  button-danger-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.none}"
    padding: "0.65rem 0.85rem"
    height: "48px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.blue}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.95rem"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
  tag-ok:
    backgroundColor: "{colors.ok-tint}"
    textColor: "{colors.ok}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0.6rem"
  tag-bad:
    backgroundColor: "{colors.red-tint}"
    textColor: "{colors.red}"
    rounded: "{rounded.none}"
    padding: "0.2rem 0.6rem"
  panel:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.none}"
    padding: "1.5rem 2rem 2rem"
  modal:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.none}"
    padding: "2rem"
    width: "520px"
  nav-link:
    textColor: "{colors.blue}"
    typography: "{typography.label}"
    padding: "0.5rem 0.75rem"
---

# Design System: ChefConnect

## Overview

**Creative North Star: "The Resort Print Card"**

ChefConnect is printed, not rendered. Every screen reads as a sheet pulled from a two-ink press on the Black Sea coast in the 60s–70s: sea ultramarine owns whole fields and all text, vermilion is the second plate and is laid only where attention belongs, and the paper stays cool and bare. The world refuses the dark-photo-plus-gold-serif restaurant template.

Density is that of a well-set menu card: generous margins, condensed Bulgarian Cyrillic set large, prices on dotted leaders, sections threaded together by a double print rule. Public pages persuade with full blue fields and photographic plates; account and admin screens use the same inks in a quieter register (white sheets on paper, ruled tables, no fields of blue except the sign-in aside).

**Key Characteristics:**
- Two inks plus paper; a green appears only to say "approved".
- Square corners everywhere; borders are printed strokes (2px), not hairlines.
- A thick-plus-thin double rule threads header, sections and footer.
- Condensed Sofia Sans in three widths carries all hierarchy; no serif.
- One signature motion: the vermilion plate slipping out of register.

## Colors

Sea ultramarine and vermilion on cool paper, with blue carrying everything and red rationed.

### Primary
- **Sea Ultramarine** (blue): the house ink. Full-bleed fields (hero, footer, mobile nav, dropdown, sign-in aside), every heading, links, default buttons, filter-chip strokes, table rules, the double rule.
- **Deep Harbour Ink** (blue-ink): body text on paper and the hover state of default buttons. Never a field colour.
- **Faded Ink** (blue-soft): secondary text, ledes, hints, table headers, placeholders.
- **Ink Wash / Ink Haze** (blue-line, blue-tint): 22% strokes for fields, row dividers, dotted leaders; 6% washes for hover rows and info notices.
- **Pale Ink on Blue** (on-blue-soft): secondary text inside blue fields.

### Secondary
- **Press Vermilion** (red): the attention plate. Primary action, the selected filter chip, the active-nav underline, focus outlines, error notices and declined tags, the registration ghost of the hero wordmark, and the small overprint square in the brand mark.
- **Vermilion Pressed** (red-hover): primary button hover only.

### Tertiary
- **Ledger Green** (ok, ok-tint): status only. Success notices and the approved tag. It is a fourth colour by necessity, not a fourth ink: never on a button, heading, field or decoration.

### Neutral
- **Cool Paper** (paper): page background and text on blue fields.
- **Second Sheet** (paper-2): the location band, disabled fields, empty image wells.
- **Sheet White** (sheet-white): bordered working surfaces laid on paper: form panels, message cards, admin editors, inputs.

### Named Rules
**The Second Plate Rule.** Vermilion marks what is under attention (act here, you are here, this went wrong) and nothing else. If removing the red would not change what the user should do next, it should not be red.

**The Status-Only Green Rule.** Ledger Green appears only inside a success notice or approved tag.

## Typography

**Display Font:** Sofia Sans Extra Condensed 800/900 (fallback Sofia Sans, system-ui)
**Body Font:** Sofia Sans variable (fallback system-ui)
**Label Font:** Sofia Sans Condensed 600/700/800

**Character:** One Bulgarian-drawn family in three widths. Extra Condensed black does the shouting at poster scale, Condensed bold does every interactive label, regular-width Sofia Sans does the reading. All faces are self-hosted with Cyrillic and Latin subsets.

### Hierarchy
- **Display** (900, clamp 4–9.5rem, 0.84): the hero wordmark only, with its vermilion registration plate behind it.
- **Headline** (800, step-4 clamp 2.75–4.75rem, 1.0): page titles, the footer wordmark, section headings on public pages.
- **Title** (800, step-3 clamp 2–3rem, 1.0): section and category titles, modal headings; step-2 (clamp 1.5–1.875rem) for admin option labels and empty-state headings.
- **Body** (400, 1.0625rem, 1.55): running text, capped at a 66ch measure; ledes at 1.25rem / 1.45 in Faded Ink.
- **Label** (Condensed 700, ~1rem, 1.1): buttons, nav, chips, field labels, tags, table headers, dish names and prices (800, 1.2–1.25rem, tabular numerals).

### Named Rules
**The Three Widths Rule.** Width encodes role: extra-condensed for display, condensed for anything you can press or scan, normal width for reading. Do not introduce another family.

**The Lining Figures Rule.** Numbers are lining everywhere and tabular wherever they align (prices, hours, phone, tables).

## Layout

A centred column of min(100% − 2 × gutter, 1240px), gutter clamp(1rem, 4vw, 3rem); narrow pages cap at 760px, sign-in at 1040px. The spacing scale is 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4.5 / 7rem; pages open with 3rem and close with 7rem. The fixed header is 72px including its 7px double rule; content offsets by it and scroll-padding respects it.

The home hero is a 7/12 + 5/12 grid on a full-bleed blue field, ending in a four-column colophon (hours, address, phone) under an on-blue double rule. The menu is two columns of leader-ruled dish rows under a sticky chip filter bar; a category with a single dish leaves its right column empty on purpose (real categories hold several dishes, and a printed menu keeps its columns fixed rather than reflowing). The gallery is a six-column plate grid (one large, two stacked, one wide band). Breakpoints in use: 960px (header phone collapses to icon, footer to two columns), 900px (hero and splits stack), 768px (full-screen blue mobile nav), 720px (data tables stack into label/value rows), 480px (hero buttons stack, dish thumbs 60px).

**The Thread Rule.** A double print rule (3px thick, 3px gap, 1px thin) separates page heads and sections and runs from header to footer. On blue fields it prints in paper.

## Elevation & Depth

Flat by nature: depth comes from ink fields, 2px printed strokes and tonal paper changes, not lift. Two soft shadows exist only for things that genuinely float above the sheet; the one hard offset is the signature interaction and is state-only.

### Shadow Vocabulary
- **Floating sheet** (`box-shadow: 0 24px 60px -20px rgb(18 26 74 / 0.5)`): modal dialogs.
- **Dropdown** (`box-shadow: 0 18px 40px -16px rgb(18 26 74 / 0.55)`): the account menu.
- **Registration slip** (`transform: translate(-2px, -2px); box-shadow: 2px 2px 0 var(--blue)`): primary button hover only, on fine pointers, removed under reduced motion.

### Named Rules
**The Registration Rule.** The vermilion plate lands in register once on load (hero wordmark) and slips 2px out of register on primary hover. That is the only offset in the system; no resting element carries an offset block or offset shadow.

## Shapes

Square corners everywhere (0px); the only round shape is the loading spinner. Strokes are printed: 2px for buttons, chips, inputs, panels; 3px for table and section tops; 1px Ink Wash for row dividers; dashed 2px for empty states. Modals and SweetAlert dialogs carry a 10px blue top band instead of a border.

Photographs sit in a paper-ruled frame: a 2px outline offset 8–10px from the image (paper ink on blue fields, blue ink on paper), with matching margin so the rule never clips. On blue fields the photo prints as a blue duotone with a halftone dot screen; on paper it stays true colour.

## Components

### Buttons
Tactile, square, condensed.
- **Shape:** square (0px), 2px stroke matching the fill, 48px minimum height (40px small, 56px hero).
- **Primary:** vermilion fill, paper text. One per view region: the action that matters (book a table, sign up, save).
- **Hover / Focus:** default buttons darken to Deep Harbour Ink; primary takes Vermilion Pressed plus the registration slip. All buttons press to scale 0.97. Focus is a 3px vermilion outline offset 3px (paper-coloured on blue fields).
- **Default / Ghost / Paper / Danger:** blue fill; blue stroke on transparent (fills blue on hover); paper fill for use on blue fields (inverts to outline on hover); red stroke on transparent for destructive actions (fills red on hover).

### Chips
- **Style:** 2px blue stroke, transparent, Condensed 700, 40px high.
- **State:** selected (aria-pressed) fills vermilion; hover adds Ink Haze.

### Tags
Status stamps: 1.5px stroke in currentColor, condensed. Pending is blue on paper, approved is Ledger Green on its tint, declined is vermilion on its tint.

### Cards / Containers
- **Corner Style:** square.
- **Background:** Sheet White on Cool Paper.
- **Shadow Strategy:** none.
- **Border:** 2px Sea Ultramarine.
- **Internal Padding:** 1.5–2rem.

### Inputs / Fields
- **Style:** Sheet White, 2px Ink Wash stroke, square, 48px; Condensed bold labels above with icon; hints in Faded Ink.
- **Focus:** stroke turns blue plus a 2px blue outline at 0 offset.
- **Error / Disabled:** invalid strokes vermilion; disabled goes Second Sheet with no stroke.

### Notices and States
Notices are 2px currentColor boxes on a tint (error vermilion, success green, info blue). Empty states are dashed Ink Wash boxes with an extra-condensed heading. The loader is a small ring with inline text.

### Navigation
Paper header with the double rule at its foot; brand mark is a blue square overprinted by a small multiply-blended vermilion square, wordmark in Extra Condensed 900. Links are Condensed 700 blue; hover draws a 3px vermilion underline to 40%, the active page draws it full. Below 768px a blue toggle opens a full-screen blue sheet with extra-condensed 2rem links in paper.

### Data Tables
A 3px blue top rule, condensed Faded Ink headers over a 1px blue line, Ink Wash row dividers, Ink Haze row hover. Below 720px stacked tables become label/value rows per record.

### Menu Row (signature)
Dish thumbnail (76px square), condensed dish name, a dotted Ink Wash leader, and a tabular price, two-line clamped description below; hover underlines the name in vermilion and scales the photo 1.06.

## Do's and Don'ts

### Do:
- **Do** set every field, heading and text in the blue family; reach for vermilion only for the primary action, the selected filter, the current nav item, focus and errors.
- **Do** separate sections with the double print rule, in paper ink when on a blue field.
- **Do** frame photographs with a 2px outline offset 8–10px; duotone them only on blue fields.
- **Do** keep corners square and strokes at 2px.
- **Do** keep the hero's two actions side by side and equal in size: "Запази маса" (vermilion) and "Към менюто" (paper).
- **Do** honour reduced motion: the registration slip and load-in become colour-only.

### Don't:
- **Don't** use Ledger Green outside a success notice or approved tag.
- **Don't** put an offset block or hard offset shadow behind a photo or card; the only offset is the primary-button registration slip on hover.
- **Don't** round corners or add a serif, script or gold accent.
- **Don't** add a second vermilion action in the same region; secondary actions are ghost, paper or default blue.
- **Don't** use soft shadows on resting surfaces; they belong only to modals and the dropdown.
