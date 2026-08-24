## mtil.uk - personal website

This is my personal website where I write and share my projects and thoughts. This is primarily a static site built with Next.js and is self-hosted on a VPS behind Docker.

The design was inspired by dithered and retro themed media out there - which is some of my favourite. 


| | |
|---|---|
| Framework | Next.js (App Router, React 19) |
| Styling | Tailwind CSS v4 |
| Content | MDX files on disk, rendered with `next-mdx-remote` |
| Animation | Motion |
| Storage | Redis (post likes, rate limiting) |
| Deploy | Docker Compose, `output: "standalone"` |


## Running locally

```bash
npm install
cp .env.example .env    # fill in the values below
npm run dev
```

Redis is only needed for likes. Without it the like button degrades to a disabled 0 rather than erroring.

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

Then set `REDIS_URL=redis://localhost:6379`.

## Environment

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Absolute site URL. Read at build time — baked into the image. |
| `REDIS_URL` | yes | `redis://redis:6379` in Compose, `redis://localhost:6379` outside it. |
| `LIKES_SALT` | yes | Long random string. Visitor IDs are `SHA256(ip + salt)`, so no raw IPs are stored. **Changing it resets everyone's like allowance.** |
| `DISCORD_WEBHOOK_URL` | yes | Where contact form submissions are delivered. |
| `GITHUB_TOKEN` | no | Classic PAT, no scopes needed. Used for the contribution graph on the GitHub social card. Without it, a public proxy is used instead. |

## Content

All content for the site is done using markdown or yaml - there is no database or CMS to keep the site as simple as possible. 
```
content/
├── blogs/*.mdx        posts — frontmatter + body
├── projects/*.mdx     project write-ups
├── reads.yaml         links I've found worth keeping
└── socials.yaml       profile data for the social hover cards
```

**Slugs are derived from filenames**, not frontmatter. If you name a blog post 
`content/blogs/my-post.mdx` then the path for the post will be `/blog/my-post`

Posts support a `series` field to group them; the series card and prev/next navigation appear automatically. Footnote-style references at the bottom of a post are parsed out of the body.

## Layout

```
app/            routes, API handlers, feed/sitemap/robots
components/
├── article/    long-form rendering: MDX components, TOC, references, share
├── home/       home page sections
├── layout/     site chrome: command palette, preferences bar
├── providers/  theme and sound context
├── socials/    per-platform hover cards
├── icons/      hand-rolled brand marks
└── ui/         primitives
lib/            content loading, search index, palettes, validation
```

## Notable bits

**Command palette** (`⌘K` or `/`) searches posts, projects and socials, and carries the theme and sound controls.

**Themes** (`⌘B`) swap a set of CSS custom properties registered with `@property`, so every colour on the page cross-fades rather than snapping. The choice is applied by an inline script before first paint to avoid a flash.

**Social cards** are per-platform widgets that mimicks each platforms UI. The GitHub widget has a contribution graph, Letterboxd has a poster row and LinkedIn has the LinkedIn colours and banner.

**Sounds** are off by default and toggleable from the preferences bar.

## Deploying

```bash
docker compose up -d --build
```

Serves on port 3001, expecting a reverse proxy in front for TLS. Redis persists to a named volume with AOF enabled.
