"use client";
import { useState, useRef } from "react";
import { Dropzone } from "./Dropzone";
import { PrivacyBadge } from "./PrivacyBadge";
import { ToolFAQ } from "./ToolFAQ";
import type { ToolMeta } from "@/lib/tools";
import type { Engine, EngineOpts } from "@/lib/engines/types";
import JSZip from "jszip";

interface ToolShellProps<O extends EngineOpts> {
  tool: ToolMeta;
  engine: Engine<O>;
  defaultOpts: O;
  OptionsForm?: React.ComponentType<{ value: O; onChange: (v: O) => void }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  InvalidPdfError: "That file doesn't look like a valid PDF. Try a different file.",
  EncryptedPdfError: "This PDF is password-protected. Unlock it first, then try again.",
  OutOfMemoryError: "The browser ran out of memory on this file. Try splitting it first, or use a smaller PDF.",
  CancelledError: "",
};

export function ToolShell<O extends EngineOpts>({ tool, engine, defaultOpts, OptionsForm }: ToolShellProps<O>) {
  const [files, setFiles] = useState<File[]>([]);
  const [opts, setOpts] = useState<O>(defaultOpts);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  function reset() {
    setBusy(false);
    setPct(0);
    setMsg("");
    if (downloadUrl) { URL.revokeObjectURL(downloadUrl); }
    setDownloadUrl(null);
  }

  function removeFile(idx: number) {
    setFiles((fs) => fs.filter((_, i) => i !== idx));
  }
  function moveFile(idx: number, dir: -1 | 1) {
    setFiles((fs) => {
      const next = [...fs];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return fs;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function run() {
    if (!files.length || busy) return;
    setErr("");
    setBusy(true);
    setPct(0);
    abortRef.current = new AbortController();
    try {
      const out = await engine(files, {
        ...opts,
        signal: abortRef.current.signal,
        onProgress: (p, m) => { setPct(p); if (m) setMsg(m); },
      });
      let blob: Blob;
      let name: string;
      if (Array.isArray(out)) {
        const zip = new JSZip();
        out.forEach((b, i) => zip.file(`${tool.slug}-${i + 1}.${b.type === "application/pdf" ? "pdf" : "jpg"}`, b));
        blob = await zip.generateAsync({ type: "blob" });
        name = `pdfnest-${tool.slug}.zip`;
      } else {
        blob = out;
        name = `pdfnest-${tool.slug}.${out.type === "application/pdf" ? "pdf" : "bin"}`;
      }
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(name);
      setPct(100);
    } catch (e) {
      const name = (e as Error)?.name ?? "Error";
      const lookup = ERROR_MESSAGES[name];
      if (name !== "CancelledError") {
        setErr(lookup ?? "Something went wrong. Try refreshing and uploading again.");
      }
    } finally {
      setBusy(false);
    }
  }

  function cancel() { abortRef.current?.abort(); }

  return (
    <div>
      <section className="max-w-3xl mx-auto px-4 pt-10">
        <h1 className="text-3xl font-bold">{tool.title}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">{tool.description}</p>
        <div className="mt-3"><PrivacyBadge /></div>

        <div className="mt-6">
          {!files.length ? (
            <Dropzone accept={tool.accept} multi={tool.multi} onFiles={setFiles} />
          ) : (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 rounded p-2 text-sm">
                  <span className="flex-1 truncate">{f.name}</span>
                  <span className="text-neutral-500">{(f.size / 1024).toFixed(1)} KB</span>
                  {tool.multi && (
                    <>
                      <button onClick={() => moveFile(i, -1)} aria-label="Move up" className="px-2">▲</button>
                      <button onClick={() => moveFile(i, 1)} aria-label="Move down" className="px-2">▼</button>
                    </>
                  )}
                  <button onClick={() => removeFile(i)} aria-label="Remove" className="px-2 text-red-500">✕</button>
                </div>
              ))}
              {tool.multi && (
                <button onClick={() => setFiles([])} className="text-xs text-neutral-500 underline">Clear all</button>
              )}
            </div>
          )}
        </div>

        {OptionsForm && files.length > 0 && (
          <div className="mt-4">
            <OptionsForm value={opts} onChange={setOpts} />
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6 flex items-center gap-3">
            {!busy && !downloadUrl && (
              <button
                onClick={run}
                className="px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                {tool.cta}
              </button>
            )}
            {busy && (
              <>
                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm tabular-nums">{pct}%</span>
                <button onClick={cancel} className="px-3 py-1.5 rounded border text-sm">Cancel</button>
              </>
            )}
            {downloadUrl && (
              <>
                <a
                  href={downloadUrl}
                  download={downloadName}
                  className="px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  Download {downloadName}
                </a>
                <button onClick={() => { setFiles([]); reset(); }} className="px-3 py-1.5 rounded border text-sm">Start over</button>
              </>
            )}
          </div>
        )}

        {msg && <p className="mt-2 text-xs text-neutral-500">{msg}</p>}
        {err && <p className="mt-3 text-red-600 dark:text-red-400 text-sm">{err}</p>}
      </section>

      <section className="mt-12 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <ol className="list-decimal pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
          {tool.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </section>

      <ToolFAQ faqs={tool.faqs} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: tool.title,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            browserRequirements: "Requires JavaScript. Requires HTML5.",
          }),
        }}
      />
    </div>
  );
}
