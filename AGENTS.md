# PT Limawira Wisesa — Marketing Site

A **Next.js 15 (App Router) + TinaCMS** marketing site for PT Limawira Wisesa,
an Indonesian system integrator specialising in enterprise digital
infrastructure and critical power solutions.

> **TL;DR**
>
> ```bash
> npm install
> npm run dev          # dev server on http://localhost:3000
> npm run build        # production build (TinaCloud)
> npm run build:local  # production build against local content files
> npm run typecheck    # tsc --noEmit
> npm run lint         # biome
> ```
>
> The CMS lives at **`/admin/`** on the live site. Editors sign in with
> TinaCloud; every commit triggers a new Netlify deploy.

---

## 0. Rules for coding agents

**This site is a Next.js + TinaCMS app. The CMS setup is load-bearing — a
careless edit to it breaks the whole site, not just the CMS.**

### Never touch these unless the task is explicitly about the CMS

| Path                        | Why it is off-limits                                    |
| --------------------------- | ------------------------------------------------------- |
| `tina/config.tsx`          | Backend, media and collection wiring                    |
| `tina/collection/*`         | The content schema — the shape of every content file    |
| `tina/fields/*`             | Shared field definitions used by the schema             |
| `tina/tina-lock.json`       | **Generated** compiled schema TinaCloud indexes. Commit it, never hand-edit it. |
| `tina/__generated__/`       | **Generated** GraphQL client + types. Git-ignored.      |
| `public/admin/`             | **Generated** Tina admin SPA. Git-ignored.              |
| `scripts/build.mjs`, `scripts/build-local.mjs` | The build entry points (TinaCloud vs local content) |

If a content field needs to change, the correct move is to add it to the
collection in `tina/collection/<name>.ts` **and** render it in the matching
view in `components/views/<name>-view.tsx` — then regenerate and commit
`tina/tina-lock.json`. Never work around a missing field by hard-coding
content in a component.

### What to change for normal work

| Task                       | Where                                                        |
| -------------------------- | ------------------------------------------------------------ |
| Edit copy / images / data  | `content/**/*.md` — Markdown + YAML front matter              |
| Site settings, nav, footer | `content/global/global.json` and `global.en.json`            |
| Layout, styling, sections  | `components/**`, `app/**`, `styles.css`                      |
| Icon set                   | `components/icon.tsx` + the `iconNames` list in `tina/fields/common.ts` (both) |
| Brand colours / fonts      | `styles.css` (`@theme` block)                               |

### The golden rules

1. **Never change a content file's `language` or `translationKey`** unless the
   task is about moving a page between languages. Routing is resolved from
   those two fields — changing one silently breaks the page.
2. **Never rename a content file.** Filenames are cosmetic, but keeping the
   `{translationKey}.md` / `{translationKey}.en.md` convention keeps the
   editor's file browser readable.
3. **Never store a language prefix in a content link.** Write `/contact/`,
   not `/en/contact/`. `localizeHref()` adds the prefix at render time.
4. **Never hard-code a language-specific string in a component.** Put it in
   the content file instead, so it can be translated.
5. **Never edit a generated file.** Run `npm run dev` to regenerate, then
   commit `tina/tina-lock.json` if it changed.
6. **Before pushing**, run `npm run typecheck && npm run lint`. If you changed
   the Tina schema, also run `npm run build:local` once to confirm the schema
   still compiles.

### Safe change recipes

**Change a headline on the homepage**
→ edit `content/home/home.md` (and `content/home/home.en.md` for English).
Nothing else. The editor can then change it from `/admin` too.

**Add a new section to the About page**
→ 1. add the field to `tina/collection/about.ts`
→ 2. render it in `components/views/about-view.tsx`
→ 3. `npm run dev` (regenerates `tina/tina-lock.json`), commit the lock file
→ 4. add the value to `content/about/about.md` and `about.en.md`

**Add a new solution**
→ create it in the CMS (`/admin` → Solusi → New Solution). Both language
versions are separate documents with the same `slug` and `translationKey`.
The home grid and the `/solutions/` listing pick it up automatically.

**Add a brand-new page type**
→ add a collection in `tina/collection/`, a route in `app/[locale]/`, and a
view in `components/views/`. The generic `app/[locale]/[slug]/page.tsx` route
already handles standalone pages that need nothing but a title and a body —
use `content/pages/` for those.

---

## 1. Project structure

```
.
├── app/                          ← Next.js App Router
│   ├── [locale]/
│   │   ├── layout.tsx              # root layout (<html lang>), header + footer
│   │   ├── page.tsx                # /  and  /en        → home
│   │   ├── about/page.tsx          # /about  and  /en/about
│   │   ├── awards/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── customers/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── posts/page.tsx
│   │   ├── posts/[slug]/page.tsx
│   │   ├── solutions/page.tsx
│   │   ├── solutions/[slug]/page.tsx
│   │   ├── [slug]/page.tsx         # generic pages (thank-you)
│   │   └── not-found.tsx
│   ├── robots.ts                   # /robots.txt
│   └── sitemap.ts                  # /sitemap.xml
│
├── components/
│   ├── views/                      # one client component per page (visual editing)
│   │   ├── home-view.tsx
│   │   ├── about-view.tsx
│   │   ├── contact-view.tsx
│   │   ├── customers-view.tsx
│   │   ├── partners-view.tsx
│   │   ├── awards-view.tsx
│   │   ├── solution-listing-view.tsx
│   │   ├── solution-view.tsx
│   │   ├── post-listing-view.tsx
│   │   ├── post-view.tsx
│   │   └── page-view.tsx
│   ├── site-header.tsx             # navbar + language switcher
│   ├── site-footer.tsx
│   ├── lang-switcher.tsx           # flag dropdown (client)
│   ├── page-header.tsx             # reusable page hero
│   ├── cta.tsx                    # reusable bottom CTA strip
│   ├── client-marquee.tsx         # scrolling client ticker
│   ├── lightbox.tsx               # award image lightbox
│   ├── reveal.tsx                 # scroll-reveal wrapper
│   ├── whatsapp-button.tsx
│   ├── icon.tsx                   # inline SVG icon catalogue
│   └── flag.tsx                   # inline flag SVGs
│
├── content/                      ← ALL editable content (Markdown + JSON)
│   ├── global/
│   │   ├── global.json             # brand, contact, social, nav, footer
│   │   └── global.en.json
│   ├── home/home.md, home.en.md
│   ├── about/about.md, about.en.md
│   ├── contact/contact.md, contact.en.md
│   ├── customers/customers.md, customers.en.md
│   ├── partners/partners.md, partners.en.md
│   ├── awards/awards.md, awards.en.md
│   ├── solution-listing/solution-listing.md, .en.md
│   ├── solutions/<slug>.md, <slug>.en.md
│   ├── products/<slug>.md, <slug>.en.md
│   ├── post-listing/post-listing.md, .en.md
│   ├── posts/<slug>.md, <slug>.en.md
│   └── pages/thank-you.md, thank-you.en.md
│
├── tina/                         ← TinaCMS configuration
│   ├── config.tsx                 # defineConfig — backend, media, collections
│   ├── collection/                # one file per collection
│   │   ├── global.ts  home.ts  about.ts  contact.ts
│   │   ├── customers.ts  partners.ts  awards.ts
│   │   ├── solution-listing.ts  solution.ts  product.ts
│   │   ├── post-listing.ts  post.ts  page.ts
│   ├── fields/common.ts           # shared field definitions + helpers
│   └── tina-lock.json              # compiled schema — COMMIT THIS
│
├── lib/
│   ├── i18n.ts                    # locales, path helpers, link localisation
│   └── content.ts                 # typed content queries
│
├── public/                       ← served as-is
│   ├── img/                        # brand & content images (also the media root)
│   ├── admin/                      # generated Tina admin (git-ignored)
│   └── favicon.svg, manifest.json, browserconfig.xml
│
├── scripts/build-local.mjs       # credential-free local production build
├── scripts/import-products.mjs   # company-profile pack → content/products
├── styles.css                    # Tailwind v4 entry + design tokens
├── middleware.ts                 # locale prefix routing
├── next.config.ts
├── netlify.toml
└── AGENTS.md                     ← you are here
```

---

## 2. Tech stack

| Layer        | Tool                     | Version |
| ------------ | ------------------------ | ------- |
| Framework    | Next.js (App Router)     | 15.5.x  |
| CMS          | TinaCMS                  | 3.15.x  |
| CMS CLI      | `@tinacms/cli`           | 4.x     |
| Backend      | TinaCloud (hosted)       | —       |
| Styling      | Tailwind CSS             | 4.x     |
| Hosting      | Netlify                  | —       |
| Forms        | Netlify Forms            | —       |
| Lint/format  | Biome                    | 1.9.x   |

---

## 3. The content model

### 3.1 One collection per content type, one document per language

Every collection holds **both** languages in the same collection. A document is
addressed by two fields:

| Field            | Type   | Purpose                                                          |
| ---------------- | ------ | ---------------------------------------------------------------- |
| `language`       | select | `id` (Indonesian) or `en` (English). Decides which site version it belongs to. |
| `translationKey` | string | Pairs the Indonesian document with its English counterpart.       |

**Routing is resolved from `language`, not from the filename.** A page is
fetched with a filtered query:

```ts
client.queries.aboutConnection({
  filter: { language: { eq: "id" }, translationKey: { eq: "about" } },
  first: 1,
});
```

Consequences:

- Renaming a file or flipping the `language` field can never 404 a page.
- The filename is cosmetic: it is generated from `translationKey` + `language`
  (`about.md` for Indonesian, `about.en.md` for English) by
  `ui.filename.slugify` in `tina/fields/common.ts`.

### 3.2 Collections

| Collection         | Path                      | Format | Documents                     |
| ------------------ | ------------------------- | ------ | ----------------------------- |
| `global`           | `content/global`          | json   | `global.json`, `global.en.json` |
| `home`             | `content/home`            | md     | `home.md`, `home.en.md`       |
| `about`            | `content/about`           | md     | `about.md`, `about.en.md`     |
| `contact`          | `content/contact`         | md     | `contact.md`, `contact.en.md` |
| `customers`        | `content/customers`       | md     | `customers.md`, `customers.en.md` |
| `partners`         | `content/partners`        | md     | `partners.md`, `partners.en.md` |
| `awards`           | `content/awards`          | md     | `awards.md`, `awards.en.md`   |
| `solutionListing`  | `content/solution-listing`| md     | listing hero + CTA            |
| `solution`         | `content/solutions`       | md     | one per solution              |
| `product`          | `content/products`        | md     | one per product line          |
| `postListing`      | `content/post-listing`    | md     | blog index hero               |
| `post`             | `content/posts`           | md     | one per article               |
| `page`             | `content/pages`           | md     | standalone pages (thank-you) |

### 3.3 Editing content

Everything an editor can change lives in `content/` and is declared in
`tina/collection/*.ts`. **If a non-developer needs to change it, add it to the
schema — never to a template.**

To add a field:

1. Add it to the collection in `tina/collection/<name>.ts`.
2. Render it in the matching component in `components/views/<name>-view.tsx`.
3. Run `npm run dev` — Tina regenerates `tina/tina-lock.json`. Commit it.

### 3.4 Adding a new page

1. Create `content/pages/<slug>.md` and `content/pages/<slug>.en.md`.
2. Add `language` + `translationKey` to the front matter.
3. The generic route `app/[locale]/[slug]/page.tsx` picks it up automatically —
   no code change needed.

To add a page **type** with its own fields, add a collection and a route
instead (see `tina/collection/page.ts` and `app/[locale]/[slug]/page.tsx`).

### 3.5 Adding a new solution

1. In the CMS, open **Solusi → New Solution** and fill in title, slug, order,
   icon, short description, hero, description, features, specs, customers, CTA.
2. The home page grid and the `/solutions/` listing read from this collection
   automatically (ordered by the `order` field).
3. Add the English version with the **same `slug`** and `translationKey`.
4. `content/solutions/<slug>.md` and `<slug>.en.md` are created for you.

### 3.6 The product catalogue

The "Product Catalog" section of `/solutions/` is fed by the `product`
collection — one document per product line, in `content/products/`.

The source of truth is the company-profile pack in
`resources/compro/03-products/` (plus `04-service-maintenance/` for product
13). That folder is **git-ignored**, so the catalogue is imported into the CMS
rather than read at build time:

```bash
node scripts/import-products.mjs
```

The script normalises the heterogeneous pack JSON into one uniform document
(title, slug, order, category, brand, description, features, specs, images,
datasheet), converts the photography to WebP under `public/img/products/`,
extracts the matching product page of the company profile into
`public/img/products/datasheets/`, and writes both language versions. Commit
the content **and** the assets together.

Editors can change every field afterwards — the import is a starting point,
not a read-only mirror.

### 3.7 Icon and flag catalogues

- **Icons** are inline SVG in `components/icon.tsx`. Add a new entry to the
  `paths` map to extend. The CMS "Ikon" dropdown enumerates the same names via
  `iconNames` in `tina/fields/common.ts`.
- **Flags** are inline SVG in `components/flag.tsx`. Currently `id` and `us`.

---

## 4. Internationalisation

Indonesian is the default language and is served from the site root; English
lives under `/en`.

```
/                 → Indonesian home
/about/           → Indonesian about
/en/              → English home
/en/about/        → English about
```

### 4.1 How the routing works

`middleware.ts` rewrites every public URL onto an internal route that always
carries an explicit locale segment:

```
/about/   →  /id/about/    →   app/[locale]/about/page.tsx
/en/about/ → /en/about/    →   app/[locale]/about/page.tsx
```

`app/[locale]/layout.tsx` then reads the `locale` param, fetches the matching
`global` document and sets `<html lang="id-ID">` / `<html lang="en">`.

### 4.2 Internal links

Content stores **locale-less** paths (`/contact/`, `/solutions/data-center/`).
`localizeHref()` in `lib/i18n.ts` adds the `/en` prefix for English and leaves
external URLs, `tel:`, `mailto:` and anchors untouched. Use it for every
internal link:

```tsx
<Link href={localizeHref(item.url, locale)}>{item.label}</Link>
```

Image paths are **never** passed through `localizeHref` — they are static
assets under `/img/`.

### 4.3 Adding a new language

1. Add the locale to `locales` in `lib/i18n.ts` and to `localeMeta`.
2. Add the entry to `tina/fields/common.ts` (`language` field options).
3. Create `<locale>.json` in `content/global/` and mirror every content file.
4. Add the flag to `components/flag.tsx`.

---

## 5. Visual editing

Page content is rendered by client components in `components/views/` that call
Tina's `useTina()` hook:

```tsx
const { data } = useTina(tina);
const page = data.aboutConnection.edges?.[0]?.node;
```

The server component fetches the document and hands the whole response
(`{ data, query, variables }`) to the view via `toTinaProps()` in
`lib/content.ts`. While the CMS is open, edits appear live in the preview and
fields are highlighted in place.

The header, footer and language switcher are rendered on the server from the
`global` document and are **not** live-updated in the preview.

---

## 6. Local development

### 6.1 Install

```bash
npm install
```

### 6.2 Run

```bash
npm run dev
```

This starts the Tina local content API (port 4001) and the Next.js dev server
(port 3000) together. The CMS is at <http://localhost:3000/admin/> and runs in
**local mode** — no login required, changes are written straight to the files
in `content/`.

> The Tina datalayer uses port 9100 (the default 9000 is commonly taken by
> ClickHouse). The flag is passed in `package.json`.

### 6.3 Building

```bash
npm run build        # production build (TinaCloud when credentials are present)
npm run build:local  # production build against the files in ./content
```

`build:local` runs `scripts/build-local.mjs`, which boots the local content
API, runs `next build` against it, and shuts it down again. Logs land in
`.next-local-logs/`.

`npm run build` runs `scripts/build.mjs`. With `NEXT_PUBLIC_TINA_CLIENT_ID`
and `TINA_TOKEN` in the environment it builds against TinaCloud; without them
it falls back to the local content files so the site still deploys (the CMS
at `/admin` only becomes editable once the credentials are present).

> The Tina CLI needs **Node 22+** (Netlify is pinned to Node 24 in
> `netlify.toml`) and the datalayer runs on port **9100**, because 9000 is
> commonly taken by ClickHouse.

### 6.4 Content API playground

While `npm run dev` is running: <http://localhost:3000/admin/index.html#/graphql>

---

## 7. Deployment

The site deploys to Netlify automatically on every push to `main`.
`netlify.toml` sets:

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

### 7.1 Required environment variables

Set these in **Netlify → Site settings → Environment variables**:

| Variable                   | Scope  | Where to get it                        |
| -------------------------- | ------ | --------------------------------------- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | build + admin | TinaCloud project → Overview tab |
| `TINA_TOKEN`               | build only | TinaCloud project → Tokens tab (read-only) |

Both are required by `tinacms build` and by the Next.js build that queries
TinaCloud for content. `NEXT_PUBLIC_TINA_BRANCH` is optional — it defaults to
Netlify's `HEAD` variable.

### 7.2 First-time TinaCloud setup

1. Create a project at <https://app.tina.io> and connect the GitHub repo.
2. Copy the **Client ID** and a **read-only token** into Netlify's environment
   variables.
3. Commit `tina/tina-lock.json` — TinaCloud needs it to index the content.
4. Invite editors under **TinaCloud → Project → Collaborators**.
5. Redeploy. The CMS is then live at `https://<site>/admin/`.

---

## 8. Forms

The contact form on `/contact/` posts to Netlify Forms. Next.js pre-renders
pages into a cache rather than static HTML, so Netlify cannot detect the form
in the rendered markup. Instead:

- `public/__forms.html` holds the static form definition used for deploy-time
  detection.
- `components/contact-form.tsx` renders the CMS-driven fields and posts the
  payload to `/__forms.html`, then redirects to the thank-you page.

To add or remove form fields, edit the `form.fields` list in
`content/contact/contact.md` (or via the CMS). The field list is data-driven:
`type` may be `text`, `email`, `tel`, `textarea` or `select`. A honeypot
(`bot-field`) is already in place.

If you add a field, add the matching `<input>` to `public/__forms.html` too —
Netlify only recognises the field names it detects at deploy time.

---

## 9. Styling guide

### 9.1 Brand colours

Defined in `styles.css` under `@theme`:

| Token         | Hex       | Use                              |
| ------------- | --------- | -------------------------------- |
| `brand`       | `#475b29` | Primary brand green              |
| `brand-dark`  | `#2a3620` | Dark surfaces (footer, heroes)   |
| `brand-50`    | `#f3f6ee` | Soft brand backgrounds           |
| `brand-100`   | `#e2ead4` | Hover on soft brand              |
| `ink`         | `#0f172a` | Body text                        |
| `ink-muted`   | `#475569` | Secondary text                   |
| `cream`       | `#f7f5ef` | Section backgrounds              |
| `line`        | `#e2e8f0` | Borders, dividers                |

### 9.2 Typography

- **Display / headings**: Plus Jakarta Sans (500–800)
- **Body**: Inter (400–700)

Both are loaded with `next/font` in `app/[locale]/layout.tsx`.

### 9.3 Component classes (`@layer components` in `styles.css`)

- `.container-x` — max-width container with responsive padding
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- `.card` — white card with border + soft shadow
- `.input` — form input style
- `.badge` — pill-shaped tag
- `.dot-grid` — decorative dot background
- `.eyebrow` — small uppercase label with green underline

### 9.4 Component vs. utility

If the pattern is reused 3+ times, add a component class to `styles.css`.
Otherwise use Tailwind utilities directly.

### 9.5 Prefer platform primitives

Before hand-rolling something, check whether Next.js, React, CSS or the
browser already does it. Do not add a dependency for something the platform
covers.

| Instead of | Use |
| ---------- | ---- |
| `<img src=...>` | `next/image` (`fill` + `sizes`, `priority` for the LCP image) |
| `<a href="/internal">` | `next/link` with `localizeHref()` |
| Hand-written SVG icons | `components/icon.tsx` — add the entry to `paths` **and** to `iconNames` in `tina/fields/common.ts` |
| A carousel / slider / modal library | A small client component (`components/hero-carousel.tsx` is the reference) |
| JS scroll or animation helpers | CSS transitions, `scroll-snap`, `@keyframes`, `prefers-reduced-motion` |
| Manual `<picture>` format negotiation | Ship pre-optimised assets — `next.config.ts` sets `images.unoptimized`, so files are served verbatim |

Images therefore have to be web-ready **before** they reach `public/img/`:
export at ≤ 1920 px wide as WebP (`magick input.tif -auto-orient -strip
-resize 1920x -quality 78 public/img/<name>.webp`). Browsers cannot display
TIFF, PNG-with-alpha-over-heavy-file or raw camera originals. Keep the source
files out of git (see `resources/hero-carousel/` in `.gitignore`).

Interactive components should be small, self-contained client components with
local state: keyboard support, `aria-*` labelling, a pause control for
auto-advancing content, and a `prefers-reduced-motion` fallback.

---

## 10. Conventions

- **No comments in code** unless they explain *why* something non-obvious is
  done. The code should be self-documenting.
- **Don't inline styles** — always use Tailwind utilities.
- **Don't edit `public/admin/`** — it is generated by `tinacms build` and
  git-ignored.
- **Don't edit `tina/__generated__/`** — it is generated and git-ignored.
- **Always commit `tina/tina-lock.json`** — it is the compiled schema TinaCloud
  uses to index the content.
- **Image placeholders**: the hero, solution heroes and customer logos use
  `/img/...` paths. Drop real images into `public/img/`; the CMS uploads into
  the same folder.
- **Slug convention**: lowercase, hyphen-separated, no leading slash.
- **Order matters**: the solutions grid is ordered by the `order` field
  (lower = first).

---

## 11. Troubleshooting

| Problem                                        | Fix |
| ---------------------------------------------- | --- |
| "Error loading the CMS configuration"           | A schema error in `tina/config.tsx`. Run `npm run dev` and read the CLI output — it points at the offending field. |
| `/admin/` shows a blank page                    | `npm run build` failed to emit the admin. Check `public/admin/index.html` exists and that `NEXT_PUBLIC_TINA_CLIENT_ID` is set. |
| CMS says "not connected"                        | The TinaCloud project is not linked, or the client ID is wrong. Re-check the ID in the Netlify environment variables and redeploy. |
| A page 404s after editing                        | Check the document's `language` and `translationKey` — the route looks documents up by those two fields. |
| English page shows Indonesian content            | The `language` field on that document is set to `id`. |
| `ERROR: Datalayer server is busy on port 9000`  | Change `--datalayer-port` in `package.json` to a free port. |
| Image does not appear                           | The path must start with `/img/` and the file must live in `public/img/`. |
| Tailwind classes missing                         | Restart `npm run dev` — Tailwind v4 scans the source tree automatically. |
| `tina-lock.json` out of date                     | Run `npm run dev` once and commit the regenerated file. |

---

## 12. Known gaps

- [ ] Real hero / solution images (the templates fall back to a coloured
      block when an image is missing). The product catalogue has real
      photography and per-product datasheets.
- [ ] Real customer logos for every partner listed in the CMS.
- [ ] Blog posts: the collection and routes are ready, but no articles have
      been published yet.
- [ ] Search: TinaCloud search is available but not yet wired into the UI.
