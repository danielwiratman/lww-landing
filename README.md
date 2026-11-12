# PT Limawira Wisesa — Marketing Site

Next.js 15 (App Router) + TinaCMS + Tailwind CSS v4 website for PT Limawira
Wisesa, an Indonesian system integrator specialising in enterprise digital
infrastructure and critical power solutions.

> **Full documentation:** see [AGENTS.md](./AGENTS.md) for the content model,
> editing guide, deployment, conventions and troubleshooting.
>
> **TL;DR:**
>
> ```bash
> npm install
> npm run dev          # dev server on http://localhost:3000 (+ CMS at /admin)
> npm run build        # production build (needs TinaCloud credentials)
> npm run build:local  # production build against the local content files
> ```

The CMS lives at **`/admin/`** on the live site. Editors sign in with
TinaCloud; every committed change triggers a new deploy.

## Languages

| Language            | URL prefix | Content                          |
| ------------------- | ---------- | -------------------------------- |
| Bahasa Indonesia    | `/`        | `content/**/*.md` (`language: id`) |
| English             | `/en`      | `content/**/*.md` (`language: en`) |

Internal links are stored **without** a language prefix (`/contact/`) and are
rewritten to the right language at render time.
