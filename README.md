# moe moe kyun~ after dark

The original violet-gray secret room, split into real, separately addressable pages. Built with React, TypeScript, Vite, and the original CSS. There is no backend, account system, or server-side routing.

## The rooms

| Page             | Contents                                               |
| ---------------- | ------------------------------------------------------ |
| `index.html`     | Entrance, welcome message, and room directory          |
| `about.html`     | Webmaster introduction, profile, and inventory         |
| `journal.html`   | Changelog and currently card                           |
| `music.html`     | Original browser-synth playlist and audio controls     |
| `shrine.html`    | Game recommendations, genre filters, and surprise pick |
| `gallery.html`   | Scrapbook and keyboard-accessible image viewer         |
| `guestbook.html` | Private, browser-local notes                           |
| `links.html`     | Neighbor buttons, inspirations, and credits            |

The sidebar, footer, and previous/next links all use actual relative `.html` links. Each page has its own title and description. Display preferences, volume, and guestbook notes persist between pages on the same website. Old `index.html#about`-style bookmarks redirect to the corresponding page.

## Run locally

Use Node.js 22.12+ (or another version supported by Vite 7).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The directory links work in development too.

## Build for Neocities

```sh
npm ci
npm run build
```

**Upload the contents of `dist/`, not the source project and not the `dist` folder itself.**

Your Neocities root should contain:

```text
index.html
about.html
journal.html
music.html
shrine.html
gallery.html
guestbook.html
links.html
assets/
  *.js
  *.css
```

You can drag these files and the `assets` folder into the Neocities dashboard. Keep `assets` alongside the HTML files. If replacing an older build, remove obsolete files from the old `assets` folder; hashed filenames change between builds. Do not delete your unrelated Neocities files.

The build checker verifies that every room exists, its local HTML assets resolve, and there are no raw TypeScript entry references or root-relative asset paths.

### Why a build is needed

Neocities serves static browser files. Browsers cannot execute the project's `.tsx` / TypeScript source directly. Vite compiles React and TypeScript into ordinary JavaScript and bundles the CSS; Neocities serves those compiled files normally. You do not need Node.js running on Neocities, a paid hosting tier, a database, rewrite rules, or a single-page-app fallback.

The pages use relative asset URLs, so they also work in a subdirectory. JavaScript must be enabled for the room contents and interactive features; a plain navigation directory is shown when it is disabled.

To inspect exactly what will be uploaded:

```sh
npm run preview
```

## Existing behavior and credits

- The existing artwork, buttons, favicon, cursor, and font remain linked from their original external hosts. They need those hosts to remain available; they are not copied into this build. The neighbors page retains the source links.
- Music is synthesized in the browser using Web Audio. It never autoplays and stops when you leave the music page. Volume is remembered.
- The guestbook is intentionally **local to each visitor's browser**, not a shared public guestbook. Its notes do not leave the browser. A shared guestbook would require an external service/backend; none has been added.
- CRT and motion settings are remembered. The OS reduced-motion preference is respected by default.
- Browser visits are a local counter, not site analytics.

## Checks

```sh
npm run typecheck
npm run build
```

The production build includes the static-hosting checks in `scripts/check-build.mjs`.
