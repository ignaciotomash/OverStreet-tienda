'use client';

import { useState, useRef, useCallback } from 'react';
import { normalizarImagen } from '@/lib/upload';

export function useImageUpload(
  mostrarMensaje?: (tipo: 'exito' | 'error', texto: string) => void,
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existentes, setExistentes] = useState<string[]>([]);
  const [convirtiendo, setConvirtiendo] = useState(false);

  const handleArchivos = useCallback(async (files: FileList | File[]) => {
    const raw = Array.from(files);
    if (raw.length === 0) return;

    const tieneHeic = raw.some((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext === 'heic' || ext === 'heif' || f.type === 'image/heic' || f.type === 'image/heif';
    });
    if (tieneHeic) setConvirtiendo(true);

    try {
      const resultados = await Promise.allSettled(raw.map((f) => normalizarImagen(f)));
      const normalizadas: File[] = [];
      resultados.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          normalizadas.push(r.value);
        } else {
          console.error(`Error convirtiendo ${raw[i].name}:`, r.reason);
        }
      });
      if (normalizadas.length > 0) {
        setArchivos((prev) => [...prev, ...normalizadas]);
        normalizadas.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
          reader.readAsDataURL(file);
        });
      }
      const fallidos = resultados.filter((r) => r.status === 'rejected').length;
      if (fallidos > 0) {
        mostrarMensaje?.('error', `${fallidos} imagen(es) no se pudo(ieron) procesar. Intentá con otro formato.`);
      }
    } finally {
      setConvirtiendo(false);
    }
  }, [mostrarMensaje]);

  const eliminarArchivo = useCallback((index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const eliminarExistente = useCallback((index: number) => {
    setExistentes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    handleArchivos(e.dataTransfer.files);
  }, [handleArchivos]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleArchivos(files);
  }, [handleArchivos]);

  const cargarExistentes = useCallback((urls: string[]) => {
    setExistentes(urls);
  }, []);

  const limpiar = useCallback(() => {
    setArchivos([]);
    setPreviews([]);
    setExistentes([]);
  }, []);

  return {
    fileInputRef,
    arrastrando,
    archivos,
    previews,
    existentes,
    convirtiendo,
    handleArchivos,
    eliminarArchivo,
    eliminarExistente,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    cargarExistentes,
    limpiar,
  };
}
