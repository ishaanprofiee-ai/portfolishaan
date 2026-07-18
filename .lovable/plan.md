Ishaan Singh — Premium Portfolio

An Awwwards-caliber single-page portfolio: dark aurora background, glassmorphism cards, custom cursor, magnetic buttons, scroll-triggered reveals, and a Vercel-inspired typographic rhythm. Built with TanStack Start + Framer Motion + Lenis.

## Visual direction (locked)

- **Palette:** near-black background (`oklch(0.14 0.02 265)`), soft off-white text, indigo→violet→cyan aurora accents, subtle white 6% glass surfaces with 1px inner border.
- **Typography:** Geist Sans (body/UI) + Instrument Serif (display italic accents) via `<link>` in `__root.tsx`. Tight leading on display, generous tracking on eyebrow labels.
- **Radius/shadow:** 20–28px rounded glass cards, soft layered shadows plus a colored glow on hover.
- **Motion:** Lenis smooth scroll, Framer Motion for reveals/stagger/spring, custom cursor + magnetic CTA, aurora blob animation, parallax on hero and gallery.

## Sections built (in this order)

1. **Loading screen** — animated "IS" monogram + 0→100% counter, ~1.8s, fade-out.
2. **Hero** — left: eyebrow, name, headline, tagline, CTAs (View Projects / Download Resume / Contact); right: floating glass card with animated aurora orb (CSS/SVG, no Three.js). Scroll indicator.
3. **About** — portrait placeholder + intro/mission/values/quick facts + tilt on cards.
4. **Journey Timeline** — vertical alternating timeline with scroll-triggered glow line.
5. **Skills** — grouped categories (Frontend, Learning, Tools, Design), animated proficiency bars + hover glow.
6. **Featured Projects** — filter chips (All / Web / Design / AI), 2-col glass cards with tilt lift; entries: Personal Portfolio, EduNest360, Pinterest Creative Designs, AI Web Projects (upcoming).
7. **Achievements** — animated counters (Projects, Learning Hours, Technologies, Certificates).
8. **Interests & Hobbies** — icon card grid with floating hover.
9. **Gallery** — masonry grid, hover zoom + glass overlay.
10. **Resume** — glass card with Download / View buttons.
11. **Contact** — glass form (Name, Email, Subject, Message — client-side only, opens mailto), social links, copy-email.
12. **Footer** — logo, quick links, socials, back-to-top.

Sticky glassmorphism navbar with scroll-progress bar across the top.

## Deferred (not in this build)

Blog, AI assistant chat, testimonials, command palette, easter eggs, theme switcher, visitor counter, GitHub contribution graph, ambient audio. Structure leaves room to add them later without redesign.

## Technical details

- **Stack:** TanStack Start (existing), Tailwind v4 tokens in `src/styles.css`, Framer Motion, Lenis (`bun add framer-motion lenis`).
- **Routing:** single route `src/routes/index.tsx` replacing placeholder; sections are components in `src/components/portfolio/*`. Nav anchors scroll to section IDs (long-scroll page, per the spec's flow).
- **Fonts:** Geist + Instrument Serif via `<link>` in `__root.tsx` head; mapped in `@theme` in `styles.css`.
- **Design tokens:** add aurora colors, glass surface, glow shadow, and radii to `src/styles.css` (`@theme inline` + `:root`), all oklch, no hardcoded hex in components.
- **Custom cursor + magnetic buttons:** `useCursor` hook + `<MagneticButton>` primitive; disabled on touch via `pointer:coarse` media query.
- **Smooth scroll:** `LenisProvider` mounted in `__root.tsx` RootComponent (client only via `useEffect`).
- **Aurora background:** three animated blurred gradient blobs positioned fixed behind content, `will-change: transform`, Framer Motion infinite tween.
- **Scroll reveals:** `whileInView` with `viewport={{ once: true, margin: "-80px" }}`.
- **Counters:** `useMotionValue` + `useTransform` + `useInView`.
- **Head metadata:** unique title/description/og in `index.tsx` head() — "Ishaan Singh — Aspiring Software Developer & Creative Web Designer".
- **Assets:** portrait, project thumbs, and gallery images generated via `imagegen` (abstract/aesthetic placeholders matching palette) and stored under `src/assets/`. Resume PDF: placeholder file at `/public/resume.pdf` you can replace.
- **Accessibility:** semantic landmarks, focus-visible rings on all interactive elements, `prefers-reduced-motion` disables custom cursor/aurora animation/parallax.
- **Performance:** lazy-load gallery images, `content-visibility: auto` on below-fold sections, no heavy 3D libs.

## Content (from your answers)

Name, headline, about, skills (with "Learning" tag on React/Next/Tailwind/Python/C++), education (Class 12 PCM), currently learning, projects, strengths, interests, hobbies, languages, future goals, core values, motto ("Learn. Build. Improve. Repeat.") — all wired in.

## Out of scope reminders

- No backend, no Lovable Cloud, no form submission (mailto only).
- No blog CMS, no AI chat, no auth.
- Resume PDF is a placeholder file you replace at `/public/resume.pdf`.

Ready to build when you approve.Yes. Here's a refined master prompt that combines the strengths of your original prompt with the improvements I recommended. It's written as a specification for an AI website builder.

&nbsp;

&nbsp;

---

&nbsp;

MASTER PROMPT — ISHAAN SINGH PORTFOLIO V2

&nbsp;

Role

&nbsp;

You are an award-winning senior product designer, creative developer, UX psychologist, motion designer, accessibility specialist, and performance engineer. Build a production-ready portfolio that could realistically compete with Awwwards, inspired by Apple, Vercel, Linear, Stripe, Framer, Nothing, and Raycast.

&nbsp;

The website should not feel like a template. Every interaction must feel intentional, premium, and elegant.

&nbsp;

The overall feeling should be:

&nbsp;

> Luxury × Futuristic × Minimal × Interactive × Professional × Cinematic

&nbsp;

&nbsp;

&nbsp;

Prioritize quality over quantity.

&nbsp;

&nbsp;

---

&nbsp;

Design Philosophy

&nbsp;

Visitors should experience these emotions while scrolling:

&nbsp;

First 3 seconds

&nbsp;

"Wow."

&nbsp;

After Hero

&nbsp;

"This person has excellent design taste."

&nbsp;

After About

&nbsp;

"This person is disciplined and professional."

&nbsp;

After Projects

&nbsp;

"This person can actually build things."

&nbsp;

After Contact

&nbsp;

"I should connect with Ishaan."

&nbsp;

Every animation must guide attention instead of existing just for decoration.

&nbsp;

&nbsp;

---

&nbsp;

Tech Stack

&nbsp;

TanStack Start

&nbsp;

React

&nbsp;

Tailwind CSS v4

&nbsp;

Framer Motion

&nbsp;

Lenis

&nbsp;

TypeScript

&nbsp;

&nbsp;

Avoid unnecessary dependencies.

&nbsp;

Only use GSAP if one animation absolutely requires it.

&nbsp;

No Three.js.

&nbsp;

Create premium-looking abstract effects using CSS, SVG and Framer Motion instead.

&nbsp;

&nbsp;

---

&nbsp;

Visual Direction

&nbsp;

Dark luxury interface.

&nbsp;

Background:

&nbsp;

Near black

&nbsp;

Animated Aurora

&nbsp;

Subtle animated grid

&nbsp;

Fine noise texture

&nbsp;

Floating particles

&nbsp;

Mouse spotlight

&nbsp;

Glass reflections

&nbsp;

Premium depth

&nbsp;

&nbsp;

Glass cards

&nbsp;

Frosted blur

&nbsp;

Soft transparency

&nbsp;

Inner highlight

&nbsp;

Rounded 24px

&nbsp;

Premium shadows

&nbsp;

Colored hover glow

&nbsp;

&nbsp;

Color Palette

&nbsp;

Near Black

&nbsp;

Soft White

&nbsp;

Indigo

&nbsp;

Violet

&nbsp;

Cyan

&nbsp;

&nbsp;

Use OKLCH tokens.

&nbsp;

Never hardcode colors inside components.

&nbsp;

&nbsp;

---

&nbsp;

Typography

&nbsp;

Primary

&nbsp;

Geist Sans

&nbsp;

Accent

&nbsp;

Instrument Serif

&nbsp;

Rules

&nbsp;

Large headings

&nbsp;

Minimal text

&nbsp;

Excellent spacing

&nbsp;

Strong visual hierarchy

&nbsp;

Animated word reveal

&nbsp;

Gradient highlights

&nbsp;

Elegant typography rhythm

&nbsp;

&nbsp;

---

&nbsp;

Motion

&nbsp;

60 FPS

&nbsp;

Framer Motion

&nbsp;

Lenis

&nbsp;

Spring physics

&nbsp;

Natural easing

&nbsp;

Micro interactions

&nbsp;

No flashy animations.

&nbsp;

Every motion must feel intentional.

&nbsp;

Include

&nbsp;

Smooth scrolling

&nbsp;

Section reveal

&nbsp;

Stagger animation

&nbsp;

Magnetic buttons

&nbsp;

Custom cursor

&nbsp;

Ripple click

&nbsp;

Mouse spotlight

&nbsp;

Floating cards

&nbsp;

Aurora movement

&nbsp;

Hover lift

&nbsp;

Tilt

&nbsp;

Blur transitions

&nbsp;

Scroll progress

&nbsp;

Counter animations

&nbsp;

Text reveal

&nbsp;

Image reveal

&nbsp;

Section transitions

&nbsp;

Parallax

&nbsp;

Floating badges

&nbsp;

&nbsp;

Respect prefers-reduced-motion.

&nbsp;

&nbsp;

---

&nbsp;

Navigation

&nbsp;

Floating Glass Navbar

&nbsp;

Features

&nbsp;

Blur increases while scrolling

&nbsp;

Active section highlight

&nbsp;

Hide on scroll down

&nbsp;

Reveal on scroll up

&nbsp;

Smooth anchor scrolling

&nbsp;

Progress bar

&nbsp;

Mobile glass menu

&nbsp;

&nbsp;

&nbsp;

---

&nbsp;

Website Structure

&nbsp;

Loading Screen

&nbsp;

Animated IS monogram

&nbsp;

0–100 counter

&nbsp;

Elegant fade

&nbsp;

Aurora background

&nbsp;

&nbsp;

---

&nbsp;

Hero

&nbsp;

Most important section.

&nbsp;

Layout

&nbsp;

Left

&nbsp;

Name

&nbsp;

Ishaan Singh

&nbsp;

Professional title

&nbsp;

Aspiring Software Developer

&nbsp;

Creative Web Designer

&nbsp;

AI Enthusiast

&nbsp;

Short headline

&nbsp;

One sentence introduction

&nbsp;

CTA Buttons

&nbsp;

View Projects

&nbsp;

Resume

&nbsp;

Contact

&nbsp;

Right

&nbsp;

Premium floating holographic glass crystal (CSS/SVG)

&nbsp;

Mouse reactive lighting

&nbsp;

Animated reflections

&nbsp;

Aurora glow

&nbsp;

Scroll indicator

&nbsp;

&nbsp;

---

&nbsp;

About

&nbsp;

Professional portrait

&nbsp;

About text

&nbsp;

Mission

&nbsp;

Vision

&nbsp;

Core Values

&nbsp;

Quick Facts

&nbsp;

Currently Learning

&nbsp;

My Philosophy

&nbsp;

Fun Facts

&nbsp;

Interactive Glass Cards

&nbsp;

&nbsp;

---

&nbsp;

Journey

&nbsp;

Vertical animated timeline

&nbsp;

Class 10

&nbsp;

Class 12

&nbsp;

Started Learning

&nbsp;

Portfolio

&nbsp;

Future Goals

&nbsp;

Glow follows scrolling.

&nbsp;

&nbsp;

---

&nbsp;

Skills

&nbsp;

Replace boring progress bars.

&nbsp;

Create floating interactive cards.

&nbsp;

Categories

&nbsp;

Frontend

&nbsp;

Learning

&nbsp;

Programming

&nbsp;

Tools

&nbsp;

Design

&nbsp;

Hover expands card.

&nbsp;

Animated icon.

&nbsp;

Glow.

&nbsp;

Tilt.

&nbsp;

Skill tags.

&nbsp;

&nbsp;

---

&nbsp;

Projects

&nbsp;

This section should impress recruiters.

&nbsp;

Each project includes

&nbsp;

Image

&nbsp;

Device mockup

&nbsp;

Description

&nbsp;

Problem

&nbsp;

Solution

&nbsp;

Features

&nbsp;

Technology Stack

&nbsp;

Duration

&nbsp;

Status

&nbsp;

Live Demo

&nbsp;

GitHub

&nbsp;

Case Study

&nbsp;

Hover animation

&nbsp;

Glass lift

&nbsp;

Gradient border

&nbsp;

Tilt

&nbsp;

Filter chips

&nbsp;

All

&nbsp;

Web

&nbsp;

Design

&nbsp;

AI

&nbsp;

Projects

&nbsp;

Personal Portfolio

&nbsp;

EduNest360

&nbsp;

Pinterest Designs

&nbsp;

AI Web Projects

&nbsp;

&nbsp;

---

&nbsp;

Achievements

&nbsp;

Animated counters

&nbsp;

Projects

&nbsp;

Hours Learned

&nbsp;

Technologies

&nbsp;

Certificates

&nbsp;

&nbsp;

---

&nbsp;

Interests

&nbsp;

Interactive floating cards

&nbsp;

Coding

&nbsp;

Gym

&nbsp;

Design

&nbsp;

Technology

&nbsp;

AI

&nbsp;

Music

&nbsp;

Photography

&nbsp;

&nbsp;

---

&nbsp;

Gallery

&nbsp;

Pinterest masonry layout

&nbsp;

Hover zoom

&nbsp;

Glass overlay

&nbsp;

Parallax

&nbsp;

&nbsp;

---

&nbsp;

Resume

&nbsp;

Elegant card

&nbsp;

Download

&nbsp;

Preview

&nbsp;

Timeline summary

&nbsp;

&nbsp;

---

&nbsp;

Contact

&nbsp;

Large premium CTA

&nbsp;

"Let's Build Something Amazing."

&nbsp;

Glass form

&nbsp;

Copy email

&nbsp;

Availability badge

&nbsp;

Social cards

&nbsp;

Animated border

&nbsp;

&nbsp;

---

&nbsp;

Footer

&nbsp;

Minimal

&nbsp;

Current Year

&nbsp;

Made by Ishaan Singh

&nbsp;

Back to Top

&nbsp;

Version

&nbsp;

Social Links

&nbsp;

&nbsp;

---

&nbsp;

Hidden Premium Features

&nbsp;

Mouse spotlight

&nbsp;

Animated favicon

&nbsp;

Dynamic browser title

&nbsp;

Scroll percentage

&nbsp;

Keyboard shortcuts

&nbsp;

Cursor trail

&nbsp;

Ripple effect

&nbsp;

Dock-style hover

&nbsp;

Glass reflections

&nbsp;

Gradient borders

&nbsp;

Image lazy blur

&nbsp;

Skeleton loading

&nbsp;

Animated dividers

&nbsp;

Smooth page transitions

&nbsp;

&nbsp;

---

&nbsp;

Accessibility

&nbsp;

Semantic HTML

&nbsp;

Keyboard navigation

&nbsp;

ARIA labels

&nbsp;

Focus indicators

&nbsp;

Reduced motion support

&nbsp;

Contrast compliance

&nbsp;

Responsive

&nbsp;

&nbsp;

---

&nbsp;

Performance

&nbsp;

Lighthouse above 95

&nbsp;

Lazy loading

&nbsp;

Optimized images

&nbsp;

Content visibility

&nbsp;

Minimal bundle

&nbsp;

Maintain 60 FPS

&nbsp;

&nbsp;

---

&nbsp;

SEO

&nbsp;

Title

&nbsp;

Meta description

&nbsp;

Open Graph

&nbsp;

Twitter cards

&nbsp;

Structured data

&nbsp;

Favicon

&nbsp;

Sitemap

&nbsp;

Robots

&nbsp;

&nbsp;

---

&nbsp;

Content

&nbsp;

Use the following information:

&nbsp;

Name: Ishaan Singh

&nbsp;

Headline: Aspiring Software Developer | Creative Web Designer | AI Enthusiast

&nbsp;

About: I'm an aspiring software developer passionate about creating modern, interactive, and user-focused digital experiences. I enjoy learning new technologies, solving real-world problems through code, and continuously improving my design and development skills.

&nbsp;

Education: Higher Secondary (PCM)

&nbsp;

Skills: HTML CSS JavaScript React (Learning) Next.js (Learning) Tailwind CSS Python (Learning) C++ (Learning) Git GitHub Canva UI/UX

&nbsp;

Projects

&nbsp;

Personal Portfolio

&nbsp;

EduNest360

&nbsp;

Pinterest Creative Designs

&nbsp;

AI Projects (Upcoming)

&nbsp;

&nbsp;

Languages

&nbsp;

English

&nbsp;

Hindi

&nbsp;

Bengali

&nbsp;

Future Goal

&nbsp;

Become a Full Stack Software Engineer, build impactful products, contribute to open source, and create a technology company.

&nbsp;

Core Values

&nbsp;

Discipline

&nbsp;

Creativity

&nbsp;

Curiosity

&nbsp;

Consistency

&nbsp;

Integrity

&nbsp;

Motto

&nbsp;

> Learn. Build. Improve. Repeat.

&nbsp;

&nbsp;

&nbsp;

&nbsp;

---

&nbsp;

Final Goal

&nbsp;

The portfolio should feel like a premium digital product, not just a personal website. It should be memorable, elegant, fast, accessible, and scalable. Every section, animation, and interaction should reinforce the impression that Ishaan Singh is a thoughtful, creative, and technically capable developer with a strong eye for design.