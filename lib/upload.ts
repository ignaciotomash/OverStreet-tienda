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

export async function normalizarImagen(file: File): Promise<File> {
  if (esHeic(file)) {
    return convertirHeic(file);
  }
  return file;
}

export async function subirImagen(file: File): Promise<string> {
  const archivoFinal = await normalizarImagen(file);

  const formData = new FormData();
  formData.append('file', archivoFinal);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error al subir la imagen');
  }

  return data.url;
}
