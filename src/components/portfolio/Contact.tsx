import { useState } from "react";
import { Copy, Check, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";

const EMAIL = "[email protected]";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject || "Hello Ishaan")}&body=${encodeURIComponent(body)}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.4em] text-muted-foreground">09 — Contact</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            Let's build <span className="italic text-gradient">something</span> amazing.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Open to internships, collaborations, and interesting problems. Reach out — I usually reply within a day.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={0.15}>
            <form onSubmit={submit} className="glass-card grid gap-4 p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              </div>
              <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
              <Field label="Message" textarea value={form.message} onChange={(v) => setForm({ ...form, message: v })} required />
              <div className="mt-2">
                <MagneticButton onClick={() => {}}>
                  Send message →
                </MagneticButton>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex h-full flex-col gap-4">
              <button
                onClick={copy}
                className="glass-card glass-hover flex items-center justify-between p-5 text-left"
              >
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                  <div className="mt-1 text-base">{EMAIL}</div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border">
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </div>
              </button>

              <div className="glass-card grid grid-cols-2 gap-3 p-5">
                <Social icon={Github} label="GitHub" href="https://github.com/" />
                <Social icon={Linkedin} label="LinkedIn" href="https://linkedin.com/" />
                <Social icon={Instagram} label="Instagram" href="https://instagram.com/" />
                <Social icon={Mail} label="Mail" href={`mailto:${EMAIL}`} />
              </div>

              <div className="glass-card flex items-center gap-3 p-5 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for opportunities · West Bengal, IN
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const shared =
    "peer w-full rounded-2xl border border-glass-border bg-white/[0.03] px-4 pt-6 pb-2 text-sm text-foreground outline-none transition placeholder:text-transparent focus:border-white/25";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea
          rows={5}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={shared + " resize-none"}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={shared}
        />
      )}
      <span className="pointer-events-none absolute left-4 top-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </label>
  );
}

function Social({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-glass-border bg-white/[0.02] p-3 transition hover:border-white/25 hover:bg-white/[0.05]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-glass">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm">{label}</div>
    </a>
  );
}
