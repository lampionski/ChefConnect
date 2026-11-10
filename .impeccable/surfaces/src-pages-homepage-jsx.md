---
version: 1
slug: "src-pages-homepage-jsx"
primary_target: "src/pages/HomePage.jsx"
related_targets: ["src"]
---

# ChefConnect site (public + account + admin)

Scope: every route under `src/` — home (Persuade), menu and dish detail (Persuade/Read), reservation, contact, sign-in, profile, messages (Operate), admin panel and its screens (Operate, quieter register of the same world).

Audience and job: guests deciding to come; menu and reservation are equal first actions. Admins approve reservations and keep the menu current.

Constraints: no backend, route, auth, state or form-behaviour changes; Bulgarian copy; keyboard focus, reduced motion, light weight.

## Direction contract

THESIS: ChefConnect is printed, not rendered — a two-ink restaurant card from the Black Sea coast in the tradition of 60s–70s resort print. It refuses the dark-photo-plus-gold-serif restaurant template.

OWN-WORLD: Three inks only: sea ultramarine (#1B2F8F family) owns whole fields and all text; vermilion is reserved for what is under attention — primary action, active filter, error; cool white paper. Photos are blue duotones on blue fields, true-colour plates elsewhere. Sofia Sans (Bulgarian Cyrillic forms) with Extra Condensed black for display. Double print rules (thick+thin) separate sections; corners are square; no shadows except a printed offset is never used.

STORY: In one viewport the visitor knows the place, sees the room, and has two equal actions: book a table, read the menu. Below, the room's story, the plates, and the address as a colophon.

FIRST VIEWPORT: full-width blue field. Left 7/12: heading "Добре дошли в / ChefConnect" with ChefConnect at display scale in paper ink, tagline, then two buttons side by side — vermilion "Запази маса" and paper "Разгледай менюто". Right 5/12: the conservatory hall as a blue duotone plate in a paper-ruled frame. Bottom edge: colophon strip with hours and address.

FORM: Balkan resort two-colour print, candidate 4 of 7 on the ordered list. seed:85e8def391db60a2
Raises: vermilion reserved for attention (patent sheet); strictly three inks (sapeur plate); one continuous double rule threads every section to the footer (provenance ribbon).
Signature interaction: overprint registration — the vermilion layer of the heading and primary button lands into register on load (once) and slips 2px out of register on hover; reduced motion keeps colour only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
