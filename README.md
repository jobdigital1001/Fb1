# KI-Kennzeichnungs-Check

One self-contained `index.html` (styles and script inline). No build step, no external requests, no cookies.

## Before going live
- Replace `CHECKOUT_URL_EINZEL`, `CHECKOUT_URL_AGENTUR`, `PLATTFORM`, `KONTAKT_EMAIL`.
- Review every entry in `evaluate()` against Article 50 of Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744. The rules were written from secondary sources, not from the official text.
- The paid kit files (badges, snippets, team rule) are not in this repository.
- Create `/impressum` and `/datenschutz` on the domain, or change the two footer links.
- Update `STAND` at the top of the `<script id="logic">` block when rules or parameters change.

## Upload to IONOS
1. Connect by SFTP or open the Webspace Explorer.
2. Create the folder `ki-kennzeichnung` in the web root of the domain.
3. Upload `index.html` into it.
4. Open `https://DOMAIN/ki-kennzeichnung/` on a phone and run through once.

## Test
```
node test.js
```
