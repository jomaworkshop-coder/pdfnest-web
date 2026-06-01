"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  width?: number;
  height?: number;
  onChange: (dataUrl: string | null) => void;
}

/**
 * Small draw-with-pointer signature pad. Emits PNG dataURL on change.
 * Empty pad (no strokes) emits null. Transparent background.
 */
export function SignaturePad({ width = 360, height = 120, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hasInk = useRef(false);
  const [, force] = useState(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#111";
  }, []);

  function point(e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    hasInk.current = true;
  }
  function end() {
    drawing.current = false;
    last.current = null;
    if (hasInk.current && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  }
  function clear() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    hasInk.current = false;
    onChange(null);
    force((n) => n + 1);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        className="border border-neutral-300 dark:border-neutral-700 rounded touch-none bg-white"
        style={{ width, height, cursor: "crosshair" }}
      />
      <button
        type="button"
        onClick={clear}
        className="mt-1 text-xs text-neutral-500 underline"
      >
        Clear signature
      </button>
    </div>
  );
}
