/**
 * Section editors for the /admin dashboard. Each exported component edits
 * a single slice of the SiteContent draft via `useDraft()`. They render
 * inside AdminShell (see routes/admin.tsx) and rely on the primitives in
 * ./primitives.tsx for the visual language.
 *
 * Structure follows the sidebar in the dashboard exactly:
 *   Dashboard, Personal, Hero, About, Education, Skills, Projects,
 *   Experience, Achievements, Certifications, Interests, Gallery, Resume,
 *   Social, Contact, Navigation, Footer, SEO, Appearance, Advanced.
 */
import { useMemo } from "react";
import {
  Card,
  Field,
  ImageUploader,
  FileUploader,
  ListEditor,
  Row,
  SectionShell,
  SelectInput,
  StringListEditor,
  TextArea,
  TextInput,
} from "./primitives";
import { useDraft } from "./store";
import type {
  AchievementStat,
  CertificateItem,
  ExperienceItem,
  FactItem,
  GalleryItem,
  InterestItem,
  NavLink,
  Project,
  SkillGroup,
  SocialLink,
  TimelineItem,
  ValueItem,
} from "@/content/site";

// ---------------------------------------------------------------------------
// Dashboard (overview)
// ---------------------------------------------------------------------------

export function DashboardOverview({ onGo }: { onGo: (section: string) => void }) {
  const { draft, lastSavedAt, dirty } = useDraft();
  const stats = [
    { k: "Projects", v: draft.projects.items.length, go: "projects" },
    { k: "Skill groups", v: draft.skills.length, go: "skills" },
    { k: "Education", v: draft.education.length, go: "education" },
    { k: "Experience", v: draft.experience.length, go: "experience" },
    { k: "Gallery tiles", v: draft.gallery.items.length, go: "gallery" },
    { k: "Certificates", v: draft.certifications.length, go: "certifications" },
    { k: "Achievements", v: draft.achievements.length, go: "achievements" },
    { k: "Interests", v: draft.interests.length, go: "interests" },
    { k: "Social links", v: draft.contact.social.length, go: "social" },
  ];
  return (
    <SectionShell
      title="Welcome back"
      description={`Editing ${draft.personal.name}'s portfolio. ${
        lastSavedAt ? `Last saved ${lastSavedAt.toLocaleTimeString()}.` : "No changes saved this session yet."
      }`}
    >
      <Card>
        <div className="flex items-center gap-3">
          <span
            className={
              "inline-block h-2 w-2 rounded-full " + (dirty ? "bg-amber-400" : "bg-emerald-400")
            }
          />
          <span className="text-sm">
            {dirty ? "You have unpublished changes." : "Everything is up to date."}
          </span>
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.k}
            onClick={() => onGo(s.go)}
            className="rounded-2xl border border-glass-border bg-white/[0.02] p-4 text-left transition-colors hover:border-white/20"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.k}</div>
            <div className="mt-1 font-display text-3xl">{s.v}</div>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Personal
// ---------------------------------------------------------------------------

export function PersonalEditor() {
  const { draft, setSection } = useDraft();
  const p = draft.personal;
  const patch = (u: Partial<typeof p>) => setSection("personal", { ...p, ...u });
  return (
    <SectionShell title="Personal information" description="Name, contact, and identity assets used across the site.">
      <Card>
        <Row>
          <Field label="Full name">
            <TextInput value={p.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Initials (monogram)">
            <TextInput value={p.initials} onChange={(e) => patch({ initials: e.target.value })} />
          </Field>
          <Field label="Headline">
            <TextInput value={p.headline} onChange={(e) => patch({ headline: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <TextInput value={p.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </Field>
          <Field label="Age">
            <TextInput value={p.age} onChange={(e) => patch({ age: e.target.value })} />
          </Field>
          <Field label="Location">
            <TextInput value={p.location} onChange={(e) => patch({ location: e.target.value })} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={p.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
        </Row>
      </Card>
      <Card>
        <Field label="Profile photo">
          <ImageUploader
            value={p.profilePhoto}
            onChange={(url) => patch({ profilePhoto: url })}
            folder="profile"
            aspect="aspect-square"
          />
        </Field>
      </Card>
      <Card>
        <Row>
          <Field label="Site logo (image, optional)" hint="Leave blank to use initials as text logo.">
            <ImageUploader
              value={p.logo}
              onChange={(url) => patch({ logo: url })}
              folder="branding"
              aspect="aspect-[3/1]"
            />
          </Field>
          <Field label="Favicon" hint="Small square icon (32×32 or 64×64).">
            <ImageUploader
              value={p.favicon}
              onChange={(url) => patch({ favicon: url })}
              folder="branding"
              aspect="aspect-square"
            />
          </Field>
        </Row>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export function HeroEditor() {
  const { draft, setSection } = useDraft();
  const h = draft.hero;
  const patch = (u: Partial<typeof h>) => setSection("hero", { ...h, ...u });
  return (
    <SectionShell title="Hero" description="The first thing visitors see. Keep it punchy.">
      <Card>
        <Row>
          <Field label="Availability badge">
            <TextInput value={h.availabilityBadge} onChange={(e) => patch({ availabilityBadge: e.target.value })} />
          </Field>
          <Field label="Line 1"><TextInput value={h.line1} onChange={(e) => patch({ line1: e.target.value })} /></Field>
          <Field label="Line 2"><TextInput value={h.line2} onChange={(e) => patch({ line2: e.target.value })} /></Field>
          <Field label="Line 3"><TextInput value={h.line3} onChange={(e) => patch({ line3: e.target.value })} /></Field>
        </Row>
        <div className="mt-4">
          <Field label="Intro paragraph">
            <TextArea value={h.intro} onChange={(e) => patch({ intro: e.target.value })} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Rotating titles" hint="Cycled below the CTA row.">
            <StringListEditor items={h.titles} onChange={(items) => patch({ titles: items })} placeholder="e.g. Software Developer" />
          </Field>
        </div>
      </Card>
      <Card>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Call-to-action buttons
        </div>
        <Row>
          <Field label="Primary label">
            <TextInput value={h.ctaPrimary.label} onChange={(e) => patch({ ctaPrimary: { ...h.ctaPrimary, label: e.target.value } })} />
          </Field>
          <Field label="Primary link">
            <TextInput value={h.ctaPrimary.href} onChange={(e) => patch({ ctaPrimary: { ...h.ctaPrimary, href: e.target.value } })} />
          </Field>
          <Field label="Resume label">
            <TextInput value={h.ctaResume.label} onChange={(e) => patch({ ctaResume: { ...h.ctaResume, label: e.target.value } })} />
          </Field>
          <Field label="Resume link">
            <TextInput value={h.ctaResume.href} onChange={(e) => patch({ ctaResume: { ...h.ctaResume, href: e.target.value } })} />
          </Field>
          <Field label="Contact label">
            <TextInput value={h.ctaContact.label} onChange={(e) => patch({ ctaContact: { ...h.ctaContact, label: e.target.value } })} />
          </Field>
          <Field label="Contact link">
            <TextInput value={h.ctaContact.href} onChange={(e) => patch({ ctaContact: { ...h.ctaContact, href: e.target.value } })} />
          </Field>
        </Row>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export function AboutEditor() {
  const { draft, setSection } = useDraft();
  const a = draft.about;
  const patch = (u: Partial<typeof a>) => setSection("about", { ...a, ...u });
  return (
    <SectionShell title="About" description="Your story, values, and quick facts.">
      <Card>
        <Field label="Heading"><TextInput value={a.heading} onChange={(e) => patch({ heading: e.target.value })} /></Field>
        <div className="mt-4">
          <Field label="Body"><TextArea rows={5} value={a.body} onChange={(e) => patch({ body: e.target.value })} /></Field>
        </div>
      </Card>
      <Card>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Values</div>
        <ListEditor<ValueItem>
          items={a.values}
          onChange={(items) => patch({ values: items })}
          makeNew={() => ({ label: "New value", desc: "Short description" })}
          itemLabel={(v) => v.label || "Value"}
          addLabel="Add value"
          empty="No values yet."
          renderItem={(v, u) => (
            <Row>
              <Field label="Label"><TextInput value={v.label} onChange={(e) => u({ label: e.target.value })} /></Field>
              <Field label="Description"><TextInput value={v.desc} onChange={(e) => u({ desc: e.target.value })} /></Field>
            </Row>
          )}
        />
      </Card>
      <Card>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Quick facts</div>
        <ListEditor<FactItem>
          items={a.facts}
          onChange={(items) => patch({ facts: items })}
          makeNew={() => ({ k: "Label", v: "Value" })}
          itemLabel={(f) => f.k || "Fact"}
          addLabel="Add fact"
          renderItem={(f, u) => (
            <Row>
              <Field label="Label"><TextInput value={f.k} onChange={(e) => u({ k: e.target.value })} /></Field>
              <Field label="Value"><TextInput value={f.v} onChange={(e) => u({ v: e.target.value })} /></Field>
            </Row>
          )}
        />
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export function EducationEditor() {
  const { draft, setSection } = useDraft();
  return (
    <SectionShell title="Education & Journey" description="Timeline entries rendered in the Journey section.">
      <ListEditor<TimelineItem>
        items={draft.education}
        onChange={(items) => setSection("education", items)}
        makeNew={() => ({ year: "2026", title: "New milestone", desc: "" })}
        itemLabel={(e) => `${e.year} — ${e.title || "Milestone"}`}
        addLabel="Add milestone"
        renderItem={(e, u) => (
          <div className="space-y-3">
            <Row>
              <Field label="Year"><TextInput value={e.year} onChange={(ev) => u({ year: ev.target.value })} /></Field>
              <Field label="Title"><TextInput value={e.title} onChange={(ev) => u({ title: ev.target.value })} /></Field>
            </Row>
            <Field label="Description"><TextArea rows={2} value={e.desc} onChange={(ev) => u({ desc: ev.target.value })} /></Field>
          </div>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

const ICON_HINT =
  "Any lucide-react icon name — e.g. Code2, Braces, Wrench, Palette, Cpu, Brain, Github, Linkedin, Instagram, Mail, Sparkles.";

export function SkillsEditor() {
  const { draft, setSection } = useDraft();
  return (
    <SectionShell title="Skills" description="Grouped by category. Each group has an icon and a chip list.">
      <ListEditor<SkillGroup>
        items={draft.skills}
        onChange={(items) => setSection("skills", items)}
        makeNew={() => ({ title: "New group", icon: "Code2", items: [] })}
        itemLabel={(g) => g.title || "Skill group"}
        addLabel="Add skill group"
        renderItem={(g, u) => (
          <div className="space-y-3">
            <Row>
              <Field label="Title"><TextInput value={g.title} onChange={(e) => u({ title: e.target.value })} /></Field>
              <Field label="Icon name" hint={ICON_HINT}><TextInput value={g.icon} onChange={(e) => u({ icon: e.target.value })} /></Field>
            </Row>
            <Field label="Skills"><StringListEditor items={g.items} onChange={(v) => u({ items: v })} placeholder="Add a skill" /></Field>
          </div>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function ProjectsEditor() {
  const { draft, setSection } = useDraft();
  const p = draft.projects;
  const patch = (u: Partial<typeof p>) => setSection("projects", { ...p, ...u });
  return (
    <SectionShell title="Projects" description="Filterable grid of case studies and experiments.">
      <Card>
        <Row>
          <Field label="Heading"><TextInput value={p.heading} onChange={(e) => patch({ heading: e.target.value })} /></Field>
          <Field label="Subtitle"><TextInput value={p.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} /></Field>
        </Row>
        <div className="mt-4">
          <Field label="Filter categories" hint="Include an 'All' entry to show every project.">
            <StringListEditor items={p.categories} onChange={(v) => patch({ categories: v })} placeholder="e.g. Web" />
          </Field>
        </div>
      </Card>
      <ListEditor<Project>
        items={p.items}
        onChange={(items) => patch({ items })}
        makeNew={() => ({ title: "New project", desc: "", tech: [], cats: ["Web"], status: "Draft" })}
        itemLabel={(pr) => pr.title || "Project"}
        addLabel="Add project"
        renderItem={(pr, u) => (
          <div className="space-y-3">
            <Row>
              <Field label="Title"><TextInput value={pr.title} onChange={(e) => u({ title: e.target.value })} /></Field>
              <Field label="Status"><TextInput value={pr.status} onChange={(e) => u({ status: e.target.value })} /></Field>
            </Row>
            <Field label="Description"><TextArea rows={2} value={pr.desc} onChange={(e) => u({ desc: e.target.value })} /></Field>
            <Row>
              <Field label="Tech stack"><StringListEditor items={pr.tech} onChange={(v) => u({ tech: v })} placeholder="e.g. React" /></Field>
              <Field label="Categories"><StringListEditor items={pr.cats} onChange={(v) => u({ cats: v })} placeholder="e.g. Web" /></Field>
            </Row>
            <Row>
              <Field label="Live URL"><TextInput value={pr.liveUrl ?? ""} onChange={(e) => u({ liveUrl: e.target.value })} /></Field>
              <Field label="Code URL"><TextInput value={pr.codeUrl ?? ""} onChange={(e) => u({ codeUrl: e.target.value })} /></Field>
            </Row>
            <Field label="Cover image">
              <ImageUploader value={pr.image ?? ""} onChange={(url) => u({ image: url })} folder="projects" aspect="aspect-video" />
            </Field>
            <Field label="Accent gradient (CSS)" hint="Used when no cover image is set.">
              <TextInput value={pr.accent ?? ""} onChange={(e) => u({ accent: e.target.value })} placeholder="linear-gradient(135deg, ...)" />
            </Field>
          </div>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export function ExperienceEditor() {
  const { draft, setSection } = useDraft();
  return (
    <SectionShell title="Experience" description="Internships, roles, and work history.">
      <ListEditor<ExperienceItem>
        items={draft.experience}
        onChange={(items) => setSection("experience", items)}
        makeNew={() => ({ role: "Role", company: "Company", period: "2026", desc: "" })}
        itemLabel={(x) => `${x.role || "Role"} · ${x.company || ""}`}
        addLabel="Add role"
        empty="No experience yet."
        renderItem={(x, u) => (
          <div className="space-y-3">
            <Row>
              <Field label="Role"><TextInput value={x.role} onChange={(e) => u({ role: e.target.value })} /></Field>
              <Field label="Company"><TextInput value={x.company} onChange={(e) => u({ company: e.target.value })} /></Field>
              <Field label="Period"><TextInput value={x.period} onChange={(e) => u({ period: e.target.value })} /></Field>
            </Row>
            <Field label="Description"><TextArea rows={3} value={x.desc} onChange={(e) => u({ desc: e.target.value })} /></Field>
          </div>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export function AchievementsEditor() {
  const { draft, setSection } = useDraft();
  return (
    <SectionShell title="Achievements" description="Animated counters shown on the site.">
      <ListEditor<AchievementStat>
        items={draft.achievements}
        onChange={(items) => setSection("achievements", items)}
        makeNew={() => ({ n: 0, suffix: "+", label: "New stat" })}
        itemLabel={(a) => a.label || "Stat"}
        addLabel="Add achievement"
        renderItem={(a, u) => (
          <Row>
            <Field label="Number">
              <TextInput type="number" value={a.n} onChange={(e) => u({ n: Number(e.target.value) || 0 })} />
            </Field>
            <Field label="Suffix" hint="e.g. + · %"><TextInput value={a.suffix} onChange={(e) => u({ suffix: e.target.value })} /></Field>
            <Field label="Label"><TextInput value={a.label} onChange={(e) => u({ label: e.target.value })} /></Field>
          </Row>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export function CertificationsEditor() {
  const { draft, setSection } = useDraft();
  return (
    <SectionShell title="Certifications" description="Courses, credentials, and recognitions.">
      <ListEditor<CertificateItem>
        items={draft.certifications}
        onChange={(items) => setSection("certifications", items)}
        makeNew={() => ({ title: "New certificate", issuer: "", year: "2026" })}
        itemLabel={(c) => c.title || "Certificate"}
        addLabel="Add certificate"
        empty="No certificates yet."
        renderItem={(c, u) => (
          <div className="space-y-3">
            <Row>
              <Field label="Title"><TextInput value={c.title} onChange={(e) => u({ title: e.target.value })} /></Field>
              <Field label="Issuer"><TextInput value={c.issuer} onChange={(e) => u({ issuer: e.target.value })} /></Field>
              <Field label="Year"><TextInput value={c.year} onChange={(e) => u({ year: e.target.value })} /></Field>
              <Field label="URL (optional)"><TextInput value={c.url ?? ""} onChange={(e) => u({ url: e.target.value })} /></Field>
            </Row>
          </div>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Interests, hobbies, languages, futureGoals
// ---------------------------------------------------------------------------

export function InterestsEditor() {
  const { draft, setSection } = useDraft();
  return (
    <SectionShell title="Interests, hobbies & goals" description="Personal touches shown around the site.">
      <Card>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Interests</div>
        <ListEditor<InterestItem>
          items={draft.interests}
          onChange={(items) => setSection("interests", items)}
          makeNew={() => ({ icon: "Sparkles", label: "New interest", desc: "" })}
          itemLabel={(i) => i.label || "Interest"}
          addLabel="Add interest"
          renderItem={(i, u) => (
            <Row>
              <Field label="Icon" hint={ICON_HINT}><TextInput value={i.icon} onChange={(e) => u({ icon: e.target.value })} /></Field>
              <Field label="Label"><TextInput value={i.label} onChange={(e) => u({ label: e.target.value })} /></Field>
              <Field label="Description"><TextInput value={i.desc} onChange={(e) => u({ desc: e.target.value })} /></Field>
            </Row>
          )}
        />
      </Card>
      <Card>
        <Field label="Hobbies"><StringListEditor items={draft.hobbies} onChange={(v) => setSection("hobbies", v)} placeholder="Add hobby" /></Field>
      </Card>
      <Card>
        <Field label="Languages"><StringListEditor items={draft.languages} onChange={(v) => setSection("languages", v)} placeholder="Add language" /></Field>
      </Card>
      <Card>
        <Field label="Future goals"><StringListEditor items={draft.futureGoals} onChange={(v) => setSection("futureGoals", v)} placeholder="Add goal" /></Field>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

const ASPECTS = ["aspect-square", "aspect-video", "aspect-[3/4]", "aspect-[4/5]", "aspect-[4/3]", "aspect-[5/4]"];

export function GalleryEditor() {
  const { draft, setSection } = useDraft();
  const g = draft.gallery;
  const patch = (u: Partial<typeof g>) => setSection("gallery", { ...g, ...u });
  return (
    <SectionShell title="Gallery" description="Masonry-style photo grid. Upload images or paste URLs.">
      <Card>
        <Row>
          <Field label="Heading"><TextInput value={g.heading} onChange={(e) => patch({ heading: e.target.value })} /></Field>
          <Field label="Subtitle"><TextInput value={g.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} /></Field>
        </Row>
      </Card>
      <ListEditor<GalleryItem>
        items={g.items}
        onChange={(items) => patch({ items })}
        makeNew={() => ({ label: "New tile", h: "aspect-square", g: "linear-gradient(135deg, oklch(0.55 0.22 275), oklch(0.7 0.22 310))" })}
        itemLabel={(t) => t.label || "Tile"}
        addLabel="Add gallery tile"
        renderItem={(t, u) => (
          <div className="space-y-3">
            <Row>
              <Field label="Label"><TextInput value={t.label} onChange={(e) => u({ label: e.target.value })} /></Field>
              <Field label="Aspect ratio">
                <SelectInput value={t.h} onChange={(e) => u({ h: e.target.value })}>
                  {ASPECTS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </SelectInput>
              </Field>
            </Row>
            <Field label="Image">
              <ImageUploader value={t.image ?? ""} onChange={(url) => u({ image: url })} folder="gallery" aspect={t.h} />
            </Field>
            <Field label="Fallback gradient (used when no image)"><TextInput value={t.g ?? ""} onChange={(e) => u({ g: e.target.value })} /></Field>
          </div>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

export function ResumeEditor() {
  const { draft, setSection } = useDraft();
  const r = draft.resume;
  const patch = (u: Partial<typeof r>) => setSection("resume", { ...r, ...u });
  return (
    <SectionShell title="Resume" description="Upload or link your latest PDF.">
      <Card>
        <Field label="Resume PDF">
          <FileUploader
            value={r.url}
            onChange={(url) => patch({ url })}
            folder="resume"
            accept="application/pdf"
            label="Upload PDF"
            hint="Uploads replace the download automatically."
          />
        </Field>
      </Card>
      <Card>
        <Row>
          <Field label="Download filename"><TextInput value={r.filename} onChange={(e) => patch({ filename: e.target.value })} /></Field>
          <Field label="Display label"><TextInput value={r.label} onChange={(e) => patch({ label: e.target.value })} /></Field>
          <Field label="Last updated"><TextInput value={r.updated} onChange={(e) => patch({ updated: e.target.value })} /></Field>
        </Row>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

export function SocialEditor() {
  const { draft, setSection } = useDraft();
  const c = draft.contact;
  return (
    <SectionShell title="Social links" description="Buttons in the Contact section and footer.">
      <ListEditor<SocialLink>
        items={c.social}
        onChange={(items) => setSection("contact", { ...c, social: items })}
        makeNew={() => ({ icon: "Github", label: "New", href: "https://" })}
        itemLabel={(s) => `${s.label} · ${s.href}`}
        addLabel="Add social link"
        renderItem={(s, u) => (
          <Row>
            <Field label="Icon" hint={ICON_HINT}><TextInput value={s.icon} onChange={(e) => u({ icon: e.target.value })} /></Field>
            <Field label="Label"><TextInput value={s.label} onChange={(e) => u({ label: e.target.value })} /></Field>
            <Field label="URL"><TextInput value={s.href} onChange={(e) => u({ href: e.target.value })} /></Field>
          </Row>
        )}
      />
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export function ContactEditor() {
  const { draft, setSection } = useDraft();
  const c = draft.contact;
  const patch = (u: Partial<typeof c>) => setSection("contact", { ...c, ...u });
  return (
    <SectionShell title="Contact" description="Contact section copy.">
      <Card>
        <Field label="Heading"><TextInput value={c.heading} onChange={(e) => patch({ heading: e.target.value })} /></Field>
        <div className="mt-4">
          <Field label="Subtitle"><TextArea rows={3} value={c.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Availability line"><TextInput value={c.availability} onChange={(e) => patch({ availability: e.target.value })} /></Field>
        </div>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Navigation & Footer
// ---------------------------------------------------------------------------

export function NavFooterEditor() {
  const { draft, setSection } = useDraft();
  const f = draft.footer;
  return (
    <SectionShell title="Navigation & Footer" description="Menu links and footer content.">
      <Card>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Top navigation</div>
        <ListEditor<NavLink>
          items={draft.nav}
          onChange={(items) => setSection("nav", items)}
          makeNew={() => ({ label: "New", href: "#" })}
          itemLabel={(n) => n.label}
          addLabel="Add nav link"
          renderItem={(n, u) => (
            <Row>
              <Field label="Label"><TextInput value={n.label} onChange={(e) => u({ label: e.target.value })} /></Field>
              <Field label="Href"><TextInput value={n.href} onChange={(e) => u({ href: e.target.value })} /></Field>
            </Row>
          )}
        />
      </Card>
      <Card>
        <Field label="Footer tagline"><TextInput value={f.tagline} onChange={(e) => setSection("footer", { ...f, tagline: e.target.value })} /></Field>
        <div className="mt-4 mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Footer quick links</div>
        <ListEditor<NavLink>
          items={f.quickLinks}
          onChange={(items) => setSection("footer", { ...f, quickLinks: items })}
          makeNew={() => ({ label: "New", href: "#" })}
          itemLabel={(n) => n.label}
          addLabel="Add quick link"
          renderItem={(n, u) => (
            <Row>
              <Field label="Label"><TextInput value={n.label} onChange={(e) => u({ label: e.target.value })} /></Field>
              <Field label="Href"><TextInput value={n.href} onChange={(e) => u({ href: e.target.value })} /></Field>
            </Row>
          )}
        />
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export function SeoEditor() {
  const { draft, setSection } = useDraft();
  const s = draft.seo;
  const patch = (u: Partial<typeof s>) => setSection("seo", { ...s, ...u });
  return (
    <SectionShell title="SEO & social" description="Metadata used for search results and link previews.">
      <Card>
        <Row>
          <Field label="Page title"><TextInput value={s.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
          <Field label="OG title"><TextInput value={s.ogTitle} onChange={(e) => patch({ ogTitle: e.target.value })} /></Field>
        </Row>
        <div className="mt-4">
          <Field label="Description"><TextArea rows={2} value={s.description} onChange={(e) => patch({ description: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="OG description"><TextArea rows={2} value={s.ogDescription} onChange={(e) => patch({ ogDescription: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Keywords"><StringListEditor items={s.keywords} onChange={(v) => patch({ keywords: v })} placeholder="Add keyword" /></Field>
        </div>
        <div className="mt-4">
          <Field label="OG image (1200×630)">
            <ImageUploader value={s.ogImage} onChange={(url) => patch({ ogImage: url })} folder="seo" aspect="aspect-[1200/630]" />
          </Field>
        </div>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Appearance / Theme
// ---------------------------------------------------------------------------

export function AppearanceEditor() {
  const { draft, setSection } = useDraft();
  const t = draft.theme;
  const patch = (u: Partial<typeof t>) => setSection("theme", { ...t, ...u });
  return (
    <SectionShell title="Appearance" description="Theme knobs. More coming later.">
      <Card>
        <Row>
          <Field label="Mode">
            <SelectInput value={t.mode} onChange={(e) => patch({ mode: e.target.value as "dark" | "light" })}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </SelectInput>
          </Field>
          <Field label="Accent" hint="Reserved for a future accent-color switcher.">
            <TextInput value={t.accent} onChange={(e) => patch({ accent: e.target.value })} />
          </Field>
        </Row>
      </Card>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Advanced (raw JSON)
// ---------------------------------------------------------------------------

export function AdvancedEditor() {
  const { draft, update, loadDefaults } = useDraft();
  const text = useMemo(() => JSON.stringify(draft, null, 2), [draft]);
  return (
    <SectionShell
      title="Advanced (raw JSON)"
      description="Power tool. Every field on the site lives here. Publish to apply."
      actions={
        <button
          type="button"
          onClick={loadDefaults}
          className="rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
        >
          Reset draft to defaults
        </button>
      }
    >
      <Card>
        <textarea
          value={text}
          spellCheck={false}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              update(() => parsed);
            } catch {
              /* ignore invalid JSON while typing */
            }
          }}
          className="h-[65vh] w-full rounded-xl border border-glass-border bg-black/40 p-4 font-mono text-xs text-foreground/90 outline-none focus:border-white/25"
        />
      </Card>
    </SectionShell>
  );
}
