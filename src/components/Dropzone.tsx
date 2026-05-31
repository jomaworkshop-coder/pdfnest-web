"use client";
import { useCallback, useRef, useState } from "react";

interface DropzoneProps {
  accept: string;
  multi: boolean;
  onFiles: (files: File[]) => void;
}

export function Dropzone({ accept, multi, onFiles }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const accepted = accept.split(",").map((a) => a.trim());
    const filtered = Array.from(fileList).filter((f) =>
      accepted.some((a) => f.type === a || (a.startsWith(".") && f.name.toLowerCase().endsWith(a))),
    );
    if (filtered.length === 0) return;
    onFiles(multi ? filtered : filtered.slice(0, 1));
  }, [accept, multi, onFiles]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      className={
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition " +
        (drag
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-neutral-300 dark:border-neutral-700 hover:border-emerald-400")
      }
    >
      <p className="text-lg font-medium">Drop {multi ? "files" : "a file"} here</p>
      <p className="text-sm text-neutral-500 mt-1">or click to choose</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multi}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
