/**
 * ============================================================================
 *  SITE CONTENT — Single source of truth for the portfolio.
 * ============================================================================
 *
 *  Every section of the website reads its copy, images, links, and settings
 *  from this file. No portfolio component should have hardcoded text.
 *
 *  HOW TO EDIT
 *  -----------
 *  Two ways to change any content on the site:
 *
 *  1) Recommended for day-to-day edits: log in to /admin and use the
 *     dashboard. Changes save to the database and are live immediately —
 *     no code changes, no redeploy.
 *
 *  2) For structural changes or first-time setup: edit the object below.
 *     Values here are the DEFAULTS shown when the database has no override.
 *     The admin dashboard writes a JSON copy of this shape to the database,
 *     and the site merges DB values on top of these defaults at runtime.
 *
 *  ASSETS
 *  ------
 *  Drop images, resume PDF, and favicon into `src/assets/site/` (see the
 *  README in that folder). Then paste the path or URL into the field here.
 *  You can also paste any public URL (Unsplash, your CDN, etc.).
 *
 *  RULES OF THE ROAD
 *  -----------------
 *  - Only add or change fields — never rename or delete existing ones,
 *    or older admin dashboard values will lose their home.
 *  - Every field marked `// TODO` is a placeholder you can fill in from the
 *    admin dashboard whenever you're ready.
 *  - Keep this file the LONELY place with personal data. Components read
 *    it via the `useSite()` hook.
 * ============================================================================
 */

// -----------------------------------------------------------------------------
// TYPES — the shape of the content. Extend freely; never remove fields.
// -----------------------------------------------------------------------------

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface SkillGroup {
  title: string;
  /** Any lucide-react icon name, e.g. "Code2", "Braces", "Wrench", "Palette". */
  icon: string;
  items: string[];
}

export interface Project {
  title: string;
  desc: string;
  tech: string[];
  cats: string[];
  status: string;
  /** Optional CSS gradient used as the cover fallback when `image` is empty. */
  accent?: string;
  image?: string;
  liveUrl?: string;
  codeUrl?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  desc: string;
}

export interface CertificateItem {
  title: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface AchievementStat {
  n: number;
  suffix: string;
  label: string;
}

export interface InterestItem {
  /** lucide-react icon name. */
  icon: string;
  label: string;
  desc: string;
}

export interface GalleryItem {
  label: string;
  /** aspect ratio class, e.g. "aspect-[3/4]" | "aspect-square" | "aspect-[4/5]". */
  h: string;
  /** Optional image URL. When empty, uses `g` (a CSS gradient) as a fallback tile. */
  image?: string;
  g?: string;
}

export interface SocialLink {
  /** lucide-react icon name. */
  icon: string;
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ValueItem {
  label: string;
  desc: string;
}

export interface FactItem {
  k: string;
  v: string;
}

export interface SiteContent {
  // ---- Personal information -------------------------------------------------
  personal: {
    name: string;
    /** Short professional headline shown near the name. */
    headline: string;
    /** One-line tagline used in hero and meta description. */
    tagline: string;
    age: string;
    location: string;
    email: string;
    /** Path/URL to your professional profile photo (see src/assets/site/). */
    profilePhoto: string;
    /** Monogram/logo initials used across the site. */
    initials: string;
    /** Site logo image URL. Leave empty to use `initials` as text logo. */
    logo: string;
    /** Path/URL to favicon (see public/ or src/assets/site/). */
    favicon: string;
  };

  // ---- Hero section ---------------------------------------------------------
  hero: {
    availabilityBadge: string;
    /** Three-line headline. Use \n to break lines. */
    line1: string;
    line2: string;
    line3: string;
    intro: string;
    /** Rotating professional titles displayed below the CTA row. */
    titles: string[];
    ctaPrimary: { label: string; href: string };
    ctaResume: { label: string; href: string };
    ctaContact: { label: string; href: string };
  };

  // ---- About ----------------------------------------------------------------
  about: {
    heading: string;
    body: string;
    values: ValueItem[];
    facts: FactItem[];
  };

  // ---- Education / Journey timeline -----------------------------------------
  education: TimelineItem[];

  // ---- Skills ---------------------------------------------------------------
  skills: SkillGroup[];

  // ---- Projects -------------------------------------------------------------
  projects: {
    heading: string;
    subtitle: string;
    categories: string[];
    items: Project[];
  };

  // ---- Experience -----------------------------------------------------------
  experience: ExperienceItem[];

  // ---- Achievements ---------------------------------------------------------
  achievements: AchievementStat[];

  // ---- Certifications -------------------------------------------------------
  certifications: CertificateItem[];

  // ---- Interests & Hobbies --------------------------------------------------
  interests: InterestItem[];
  hobbies: string[];

  // ---- Languages ------------------------------------------------------------
  languages: string[];

  // ---- Future goals ---------------------------------------------------------
  futureGoals: string[];

  // ---- Gallery --------------------------------------------------------------
  gallery: {
    heading: string;
    subtitle: string;
    items: GalleryItem[];
  };

  // ---- Resume ---------------------------------------------------------------
  resume: {
    /** Path/URL to your PDF (see src/assets/site/). */
    url: string;
    filename: string;
    label: string;
    updated: string;
  };

  // ---- Contact --------------------------------------------------------------
  contact: {
    heading: string;
    subtitle: string;
    availability: string;
    social: SocialLink[];
  };

  // ---- Navigation / Footer --------------------------------------------------
  nav: NavLink[];
  footer: {
    tagline: string;
    quickLinks: NavLink[];
  };

  // ---- SEO ------------------------------------------------------------------
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };

  // ---- Theme (future) — reserved for admin-driven theme tweaks --------------
  theme: {
    /** Placeholder for future light/dark switching. */
    mode: "dark" | "light";
    /** Extension slot for admin-configurable accent colors. */
    accent: string;
  };

  // ---- Admin ----------------------------------------------------------------
  admin: {
    /** Only this email is allowed to log in to /admin. */
    email: string;
  };
}

// -----------------------------------------------------------------------------
// DEFAULT CONTENT
// -----------------------------------------------------------------------------
// Only explicitly confirmed personal facts are baked in. Everything else is a
// placeholder marked TODO — replace via the admin dashboard.
// -----------------------------------------------------------------------------

export const defaultContent: SiteContent = {
  personal: {
    name: "Ishaan Singh",
    headline: "Aspiring Software Developer & Web Designer", // TODO adjust from /admin
    tagline: "Building thoughtful digital experiences.", // TODO adjust from /admin
    age: "", // TODO fill from /admin (kept blank rather than assumed)
    location: "West Bengal, India",
    email: "ishaanprofiee@gmail.com",
    profilePhoto: "/site-assets/profile-placeholder.svg", // Replace via /admin or src/assets/site/
    initials: "IS",
    logo: "",
    favicon: "/favicon.ico",
  },

  hero: {
    availabilityBadge: "AVAILABLE FOR OPPORTUNITIES",
    line1: "Building",
    line2: "digital experiences",
    line3: "with intent.",
    intro:
      "Aspiring software developer and creative web designer. I care about clean code, elegant motion, and interfaces that feel human.",
    titles: ["Software Developer", "Web Designer", "AI Enthusiast"], // TODO edit from /admin
    ctaPrimary: { label: "View Projects", href: "#projects" },
    ctaResume: { label: "Resume", href: "#resume" },
    ctaContact: { label: "Contact", href: "#contact" },
  },

  about: {
    heading: "A student, and a builder.",
    body: "TODO — write your About Me from the admin dashboard. Share your background, what you enjoy building, and what you're currently learning.",
    values: [
      { label: "TODO Value 1", desc: "Add a short description from /admin." },
      { label: "TODO Value 2", desc: "Add a short description from /admin." },
      { label: "TODO Value 3", desc: "Add a short description from /admin." },
      { label: "TODO Value 4", desc: "Add a short description from /admin." },
    ],
    facts: [
      { k: "Based in", v: "West Bengal, India" },
      { k: "Email", v: "ishaanprofiee@gmail.com" },
      { k: "Languages", v: "TODO — add from /admin" },
      { k: "Motto", v: "TODO — add from /admin" },
    ],
  },

  // Confirmed: Class 10 completed 2024, Class 12 completed 2026.
  education: [
    {
      year: "2024",
      title: "Class 10",
      desc: "Completed secondary school.",
    },
    {
      year: "2026",
      title: "Class 12",
      desc: "Completed higher secondary school.",
    },
    // Add more milestones from the admin dashboard.
  ],

  skills: [
    {
      icon: "Code2",
      title: "TODO — Group name",
      items: ["TODO skill 1", "TODO skill 2"],
    },
    // Add more groups from /admin. Recognized icons: Code2, Braces, Wrench,
    // Palette, Sparkles, Cpu, Brain, Dumbbell, Music, Github, Linkedin,
    // Instagram, Mail.
  ],

  projects: {
    heading: "Projects, prototypes & experiments.",
    subtitle: "A growing collection. Add real projects from /admin.",
    categories: ["All", "Web", "Design", "AI"],
    items: [
      {
        title: "TODO — Project title",
        desc: "TODO — short description of the project.",
        tech: ["TODO"],
        cats: ["Web"],
        status: "Draft",
        accent: "linear-gradient(135deg, oklch(0.55 0.22 275), oklch(0.7 0.22 310))",
      },
    ],
  },

  experience: [
    // TODO — add internships and work experience from /admin.
    // { role: "Intern", company: "Company", period: "2026", desc: "..." }
  ],

  achievements: [
    { n: 0, suffix: "+", label: "Projects shipped" }, // TODO adjust from /admin
    { n: 0, suffix: "+", label: "Learning hours" },
    { n: 0, suffix: "", label: "Technologies" },
    { n: 0, suffix: "", label: "Languages spoken" },
  ],

  certifications: [
    // TODO — add certificates from /admin.
  ],

  interests: [
    { icon: "Sparkles", label: "TODO Interest", desc: "TODO short line" },
    // Add more from /admin.
  ],
  hobbies: [
    // TODO — free-form list, editable from /admin.
  ],

  languages: [
    // TODO — add spoken languages from /admin.
  ],

  futureGoals: [
    // TODO — add future goals from /admin.
  ],

  gallery: {
    heading: "Gallery",
    subtitle: "Add photos, artwork, or moodboard tiles from /admin.",
    items: [
      { label: "TODO Tile", h: "aspect-[3/4]", g: "linear-gradient(135deg, oklch(0.55 0.22 275), oklch(0.7 0.22 310))" },
      { label: "TODO Tile", h: "aspect-square", g: "linear-gradient(135deg, oklch(0.75 0.15 200), oklch(0.55 0.22 275))" },
      { label: "TODO Tile", h: "aspect-[4/5]", g: "linear-gradient(135deg, oklch(0.7 0.2 340), oklch(0.6 0.22 30))" },
      { label: "TODO Tile", h: "aspect-square", g: "linear-gradient(135deg, oklch(0.6 0.2 160), oklch(0.55 0.22 260))" },
    ],
  },

  resume: {
    url: "/resume.pdf", // Drop the file at public/resume.pdf, or upload elsewhere and paste the URL from /admin.
    filename: "Ishaan-Singh-Resume.pdf",
    label: "Ishaan Singh — Resume",
    updated: "TODO — updated date",
  },

  contact: {
    heading: "Let's build something amazing.",
    subtitle:
      "Open to internships, collaborations, and interesting problems. Reach out — I usually reply within a day.",
    availability: "Available for opportunities · West Bengal, IN",
    social: [
      { icon: "Github", label: "GitHub", href: "https://github.com/" }, // TODO add real URL from /admin
      { icon: "Linkedin", label: "LinkedIn", href: "https://linkedin.com/" }, // TODO
      { icon: "Instagram", label: "Instagram", href: "https://instagram.com/" }, // TODO
      { icon: "Mail", label: "Mail", href: "mailto:ishaanprofiee@gmail.com" },
    ],
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Journey", href: "#journey" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],

  footer: {
    tagline: "Learn. Build. Improve. Repeat.",
    quickLinks: [
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
  },

  seo: {
    title: "Ishaan Singh — Portfolio",
    description:
      "Portfolio of Ishaan Singh — aspiring software developer and web designer building modern, interactive digital experiences.",
    keywords: ["Ishaan Singh", "portfolio", "software developer", "web designer"],
    ogTitle: "Ishaan Singh — Developer & Designer",
    ogDescription: "Building modern digital experiences through code, creativity, and continuous learning.",
    ogImage: "",
  },

  theme: {
    mode: "dark",
    accent: "violet",
  },

  admin: {
    // Only this email may sign in at /admin. Change from /admin later.
    email: "ishaanprofiee@gmail.com",
  },
};

/**
 * Deep-merges a partial content object (from the database) on top of the
 * defaults. Missing keys fall back to defaults, so the site always renders.
 */
export function mergeContent(partial: unknown): SiteContent {
  if (!partial || typeof partial !== "object") return defaultContent;
  return deepMerge(defaultContent, partial as Record<string, unknown>) as SiteContent;
}

function deepMerge<T>(base: T, patch: Record<string, unknown>): T {
  if (Array.isArray(patch)) return patch as unknown as T;
  if (typeof base !== "object" || base === null) return (patch as unknown as T) ?? base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(patch)) {
    const bv = (base as Record<string, unknown>)[key];
    const pv = patch[key];
    if (pv === undefined) continue;
    if (
      pv !== null &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(bv, pv as Record<string, unknown>);
    } else {
      out[key] = pv;
    }
  }
  return out as T;
}
