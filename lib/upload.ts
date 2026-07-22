const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const MAX_DIMENSION = 2048;

function esHeic(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase();
  return (
    ext === 'heic' ||
    ext === 'heif' ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  );
}

async function convertirHeic(file: File): Promise<File> {
  const { default: heic2any } = await import('heic2any');
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
  const resultado = Array.isArray(blob) ? blob[0] : blob;
  const nombreLimpio = file.name.replace(/\.(heic|heif)$/i, '.jpg');
  return new File([resultado], nombreLimpio, { type: 'image/jpeg' });
}

function archivoEsGrande(file: File): boolean {
  return file.size > MAX_FILE_SIZE && file.type.startsWith('image/');
}

async function comprimirImagen(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.82 });
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
}

export async function normalizarImagen(file: File): Promise<File> {
  let resultado = file;

  if (esHeic(resultado)) {
    resultado = await convertirHeic(resultado);
  }

  if (archivoEsGrande(resultado)) {
    resultado = await comprimirImagen(resultado);
  }

  return resultado;
}

export async function subirImagen(file: File): Promise<string> {
  const archivoFinal = await normalizarImagen(file);

  const formData = new FormData();
  formData.append('file', archivoFinal);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const texto = await res.text();
  let data: Record<string, string>;
  try {
    data = JSON.parse(texto);
  } catch {
    throw new Error(`Error del servidor (${res.status}): respuesta no válida`);
  }

  if (!res.ok) {
    throw new Error(data.error || `Error al subir la imagen (${res.status})`);
  }

  return data.url!;
}
