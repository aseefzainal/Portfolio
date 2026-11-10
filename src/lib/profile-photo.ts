const MAX_EDGE = 480;
const JPEG_QUALITY = 0.82;

export const profilePhotoShapes = ["circle", "rounded", "square"] as const;
export type ProfilePhotoShape = (typeof profilePhotoShapes)[number];

export function parseProfilePhotoShape(value: unknown): ProfilePhotoShape {
  if (value === "rounded" || value === "square" || value === "circle") return value;
  return "circle";
}

export function profilePhotoShapeClass(shape: ProfilePhotoShape | string | undefined) {
  switch (parseProfilePhotoShape(shape)) {
    case "rounded":
      return "rounded-xl";
    case "square":
      return "rounded-sm";
    case "circle":
    default:
      return "rounded-full";
  }
}


export async function fileToCompressedImageDataUrl(
  file: File,
  options?: { maxEdge?: number; maxChars?: number },
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPEG, PNG, or WebP).");
  }

  const maxEdge = options?.maxEdge ?? MAX_EDGE;
  const maxChars = options?.maxChars ?? 350_000;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not process that image.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  if (dataUrl.length > maxChars) {
    throw new Error("Image is still too large after compression. Try a smaller photo.");
  }
  return dataUrl;
}

export async function fileToProfilePhotoDataUrl(file: File): Promise<string> {
  return fileToCompressedImageDataUrl(file);
}

export async function fileToProjectImageDataUrl(file: File): Promise<string> {
  return fileToCompressedImageDataUrl(file, { maxEdge: 960, maxChars: 450_000 });
}
