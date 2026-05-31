export type EngineInput = File[];
export type EngineOutput = Blob | Blob[];
export type EngineProgress = (pct: number, msg?: string) => void;

export interface EngineOpts {
  signal?: AbortSignal;
  onProgress?: EngineProgress;
}

export type Engine<O extends EngineOpts = EngineOpts> = (
  files: EngineInput,
  opts: O,
) => Promise<EngineOutput>;

export class InvalidPdfError extends Error {
  constructor(message = "Invalid PDF") {
    super(message);
    this.name = "InvalidPdfError";
  }
}
export class EncryptedPdfError extends Error {
  constructor(message = "PDF is encrypted") {
    super(message);
    this.name = "EncryptedPdfError";
  }
}
export class OutOfMemoryError extends Error {
  constructor(message = "Out of memory") {
    super(message);
    this.name = "OutOfMemoryError";
  }
}
export class CancelledError extends Error {
  constructor(message = "Cancelled") {
    super(message);
    this.name = "CancelledError";
  }
}
