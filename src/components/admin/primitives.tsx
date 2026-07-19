/**
 * Form primitives shared by every /admin section editor. Kept intentionally
 * thin — they wrap raw inputs with consistent labels, hints, and validation
 * styling so section files stay declarative.
 */
import { useCallback, useRef, useState, type ReactNode } from "react";
import { GripVertical, ChevronUp, ChevronDown, Copy, Plus, Trash2, Upload, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { uploadSiteAsset, deleteSiteAsset } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function SectionShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-glass-border bg-white/[0.02] p-5 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fields
// ---------------------------------------------------------------------------

const inputCls =
  "w-full rounded-xl border border-glass-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-white/25";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-muted-foreground/70">{hint}</span>}
      {error && <span className="block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "min-h-[96px] resize-y", props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, "bg-black/40", props.className)} />;
}

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 md:grid-cols-2", className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// List editor: add / remove / reorder / duplicate
// ---------------------------------------------------------------------------

export function ListEditor<T>({
  items,
  onChange,
  makeNew,
  renderItem,
  itemLabel,
  addLabel,
  empty,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  makeNew: () => T;
  renderItem: (item: T, patch: (u: Partial<T>) => void, replace: (v: T) => void, index: number) => ReactNode;
  itemLabel?: (item: T, index: number) => string;
  addLabel?: string;
  empty?: string;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };

  const duplicate = (i: number) => {
    const next = items.slice();
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(items[i])));
    onChange(next);
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const patchAt = (i: number, u: Partial<T>) =>
    onChange(items.map((row, idx) => (idx === i ? { ...(row as object), ...u } as T : row)));

  const replaceAt = (i: number, v: T) => onChange(items.map((row, idx) => (idx === i ? v : row)));

  return (
    <div className="space-y-3">
      {items.length === 0 && empty && (
        <div className="rounded-2xl border border-dashed border-glass-border bg-white/[0.015] p-6 text-center text-sm text-muted-foreground">
          {empty}
        </div>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-glass-border bg-white/[0.02] p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />
              {itemLabel?.(item, i) ?? `Item ${i + 1}`}
            </div>
            <div className="flex items-center gap-1">
              <IconButton title="Move up" onClick={() => move(i, i - 1)} disabled={i === 0}>
                <ChevronUp className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton title="Move down" onClick={() => move(i, i + 1)} disabled={i === items.length - 1}>
                <ChevronDown className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton title="Duplicate" onClick={() => duplicate(i)}>
                <Copy className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton title="Delete" onClick={() => remove(i)} variant="danger">
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </div>
          {renderItem(item, (u) => patchAt(i, u), (v) => replaceAt(i, v), i)}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, makeNew()])}
        className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel ?? "Add item"}
      </button>
    </div>
  );
}

export function IconButton({
  children,
  onClick,
  title,
  disabled,
  variant = "default",
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors",
        "hover:border-glass-border hover:bg-white/[0.04] hover:text-foreground",
        variant === "danger" && "hover:border-red-500/40 hover:text-red-300",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// String list (chips)
// ---------------------------------------------------------------------------

export function StringListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const add = () => {
    const v = value.trim();
    if (!v) return;
    onChange([...items, v]);
    setValue("");
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-white/[0.04] px-2.5 py-1 text-xs"
          >
            {s}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-muted-foreground hover:text-red-300"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <TextInput
          value={value}
          placeholder={placeholder ?? "Type and press Enter"}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

export function useUpload(folder: string) {
  const upload = useServerFn(uploadSiteAsset);
  const del = useServerFn(deleteSiteAsset);
  const [busy, setBusy] = useState(false);

  const doUpload = useCallback(
    async (file: File): Promise<string> => {
      if (!file) throw new Error("No file");
      setBusy(true);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(reader.error);
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.slice(result.indexOf(",") + 1));
          };
          reader.readAsDataURL(file);
        });
        const res = await upload({
          data: { filename: file.name, contentType: file.type || "application/octet-stream", base64, folder },
        });
        return res.url;
      } finally {
        setBusy(false);
      }
    },
    [upload, folder],
  );

  const doDelete = useCallback(
    async (urlOrPath: string) => {
      if (!urlOrPath || !urlOrPath.startsWith("/api/public/asset/")) return;
      try {
        await del({ data: { path: urlOrPath } });
      } catch (e) {
        console.warn("[admin] delete asset failed", e);
      }
    },
    [del],
  );

  return { doUpload, doDelete, busy };
}

export function ImageUploader({
  value,
  onChange,
  folder,
  aspect = "aspect-video",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
  hint?: string;
}) {
  const { doUpload, doDelete, busy } = useUpload(folder);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = async (file: File) => {
    try {
      const url = await doUpload(file);
      // best-effort cleanup of a previous upload
      if (value && value !== url) void doDelete(value);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  return (
    <div className="space-y-2">
      <div className={cn("relative overflow-hidden rounded-xl border border-glass-border bg-black/30", aspect)}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-black/50 text-xs">Uploading…</div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onPick(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
        >
          <Upload className="h-3.5 w-3.5" /> Upload
        </button>
        {value && (
          <>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>
            <button
              type="button"
              onClick={() => {
                if (value.startsWith("/api/public/asset/")) void doDelete(value);
                onChange("");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-red-500/40 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </>
        )}
      </div>
      <TextInput
        value={value}
        placeholder="…or paste an image URL"
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

export function FileUploader({
  value,
  onChange,
  folder,
  accept,
  label = "Upload file",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
  hint?: string;
}) {
  const { doUpload, doDelete, busy } = useUpload(folder);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const url = await doUpload(f);
              if (value && value !== url) void doDelete(value);
              onChange(url);
              toast.success("File uploaded");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Upload failed");
            }
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
        >
          <Upload className="h-3.5 w-3.5" /> {busy ? "Uploading…" : label}
        </button>
        {value && (
          <>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-white/25"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Preview
            </a>
            <button
              type="button"
              onClick={() => {
                if (value.startsWith("/api/public/asset/")) void doDelete(value);
                onChange("");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/[0.03] px-3 py-2 text-xs hover:border-red-500/40 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </>
        )}
      </div>
      <TextInput value={value} placeholder="…or paste a URL" onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}
