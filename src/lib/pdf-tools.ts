import { PDFDocument } from "pdf-lib";

export async function mergePdfs(files: File[]) {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }

  return merged.save();
}

export async function getPdfPageCount(file: File) {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

/** Parse ranges like "1-3,5,8-10" (1-based, inclusive). */
export function parsePageRanges(input: string, pageCount: number) {
  const pages = new Set<number>();
  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) throw new Error("Enter at least one page or range.");

  for (const part of parts) {
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount) {
        throw new Error(`Range ${part} is outside 1–${pageCount}.`);
      }
      if (start > end) throw new Error(`Range ${part} is invalid.`);
      for (let page = start; page <= end; page += 1) pages.add(page);
      continue;
    }

    if (!/^\d+$/.test(part)) throw new Error(`Could not parse "${part}".`);
    const page = Number(part);
    if (page < 1 || page > pageCount) {
      throw new Error(`Page ${page} is outside 1–${pageCount}.`);
    }
    pages.add(page);
  }

  return [...pages].sort((a, b) => a - b);
}

export async function splitPdfByPages(file: File, oneBasedPages: number[]) {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const output = await PDFDocument.create();
  const zeroBased = oneBasedPages.map((page) => page - 1);
  const copied = await output.copyPages(source, zeroBased);
  for (const page of copied) output.addPage(page);
  return output.save();
}

/** One PDF per selected page (1-based page numbers). */
export async function splitPdfToSeparatePages(file: File, oneBasedPages: number[]) {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const parts: { page: number; bytes: Uint8Array }[] = [];

  for (const page of oneBasedPages) {
    const output = await PDFDocument.create();
    const [copied] = await output.copyPages(source, [page - 1]);
    output.addPage(copied);
    parts.push({ page, bytes: await output.save() });
  }

  return parts;
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), filename);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Minimal ZIP (store only) for packaging separate PDF pages. */
export function createZip(files: { name: string; data: Uint8Array }[]) {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);
    const local = new Uint8Array(30 + nameBytes.length + file.data.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(8, 0, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, file.data.length, true);
    localView.setUint32(22, file.data.length, true);
    localView.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(file.data, 30 + nameBytes.length);
    locals.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, file.data.length, true);
    centralView.setUint32(24, file.data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centrals.push(central);

    offset += local.length;
  }

  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);

  const total =
    locals.reduce((sum, part) => sum + part.length, 0) + centralSize + end.length;
  const zip = new Uint8Array(total);
  let cursor = 0;
  for (const part of locals) {
    zip.set(part, cursor);
    cursor += part.length;
  }
  for (const part of centrals) {
    zip.set(part, cursor);
    cursor += part.length;
  }
  zip.set(end, cursor);
  return zip;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1;
    }
    table[i] = value;
  }
  return table;
})();

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
