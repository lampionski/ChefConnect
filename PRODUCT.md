# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18 + Vite SPA, CSS Modules, react-router-dom 7, react-icons, sweetalert2. Express/MongoDB backend in `backend/` (out of scope for frontend work).

## Purpose

ChefConnect is the website of a restaurant: guests browse the menu, request a table reservation, and get the answer as an in-site message. Staff and admins run the menu, reservations, users, workers, and contact messages from the same app.

## Users and jobs

- **Guest (public):** decide whether to come, browse the menu by category, open a dish, find address and hours, send a contact message. Menu and reservation are equally important first actions.
- **Signed-in guest:** request a reservation (date, round hour 10:00–21:00, 1–20 people, at least 4 hours ahead), read replies in Messages, edit profile.
- **Admin:** approve/decline reservations, manage menu items and categories, users, workers, read contact-form messages.

## Brand commitments

- ChefConnect is its own brand. The bundled "Godzila / 25 години" logo and the "ГОДЗИЛА" history in the About text are content, not the visual identity.
- All user-facing copy is Bulgarian.
- Contact facts (confirmed 2026-11-08): address бул. Княз Борис I 66, Варна; phone +123 456 7890 and info@chefconnect.com are placeholders kept as-is until the owner supplies real ones. Hours: Пон–Пет 10:00–22:00, Съб–Нед 11:00–23:00.

## Assets

Real interior photography in `src/assets/images/` (hero conservatory hall, terrace, café rooms, copper-clad private room). No food photography beyond what admins upload per menu item.

## Constraints

- Frontend-only redesign: no changes to backend, API contracts, routes, auth/role logic, state handling, data shapes, or form/button behaviour.
- Accessibility: visible keyboard focus, labelled controls, `prefers-reduced-motion`.
- Performance: no heavy libraries; optimise images.

## Open decisions

- Real phone, email, and social profile URLs.
