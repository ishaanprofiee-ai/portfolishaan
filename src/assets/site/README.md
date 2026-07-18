# Portfolio Assets

Drop your files here — the site picks them up automatically as long as the
matching path is set in `src/content/site.ts` or the `/admin` dashboard.

## What goes where

| File               | Suggested location            | Referenced by (in content) |
| ------------------ | ----------------------------- | -------------------------- |
| Profile photo      | `public/site-assets/profile.jpg` | `personal.profilePhoto`    |
| Resume PDF         | `public/resume.pdf`           | `resume.url`               |
| Favicon            | `public/favicon.ico`          | `personal.favicon`         |
| Logo               | `public/site-assets/logo.png` | `personal.logo`            |
| Project images     | `public/site-assets/projects/…`| `projects.items[].image`   |
| Gallery images     | `public/site-assets/gallery/…`| `gallery.items[].image`    |
| Open Graph image   | `public/site-assets/og.jpg`   | `seo.ogImage`              |

> Files placed in `public/` are served at the same path (e.g. a file at
> `public/site-assets/profile.jpg` is available at `/site-assets/profile.jpg`).

## Replacing the profile photo (fastest path)

1. Save your photo as `public/site-assets/profile.jpg`.
2. In `/admin`, change **Personal → profilePhoto** to `/site-assets/profile.jpg`.
3. Save. It updates live — no rebuild needed.

Prefer a **1:1 photo, 800×800 or larger**, well lit, centered.

## Replacing the resume PDF

1. Save your PDF as `public/resume.pdf`.
2. In `/admin`, keep **Resume → url** as `/resume.pdf` (or point to an external URL).

## Using external URLs

Any field that accepts a path also accepts a full `https://…` URL. This is
useful for images hosted on a CDN, Cloudinary, Unsplash, Google Drive, etc.

## Design tip

Placeholders in the site use CSS gradients so nothing looks broken while
you're filling things in. Once you set an `image` on a project or gallery
tile, the gradient is replaced automatically.
