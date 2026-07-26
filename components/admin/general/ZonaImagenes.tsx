'use client';

import { mono } from '@/lib/fonts';

interface ZonaImagenesProps {
  variant?: 'create' | 'edit';
  existentes: string[];
  previews: string[];
  arrastrando: boolean;
  convirtiendo: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEliminarExistente: (index: number) => void;
  onEliminarArchivo: (index: number) => void;
}

export default function ZonaImagenes({
  variant = 'edit',
  existentes,
  previews,
  arrastrando,
  convirtiendo,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onEliminarExistente,
  onEliminarArchivo,
}: ZonaImagenesProps) {
  const esCreate = variant === 'create';
  const totalFotos = existentes.length + previews.length;

  return (
    <div>
      {existentes.length === 0 && previews.length === 0 ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
            esCreate ? 'min-h-[200px]' : 'aspect-[3/4]'
          } ${
            arrastrando
              ? 'border-black bg-black/5'
              : 'border-black/20 hover:border-black/40'
          }`}
        >
          <div className={`${mono.className} text-center text-xs uppercase tracking-wider text-black/40`}>
            <svg className="mx-auto mb-3 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Arrastrá fotos o hacé click
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer grid grid-cols-2 gap-2 border-2 border-dashed p-2 transition-colors ${
            arrastrando ? 'border-black bg-black/5' : 'border-black/20 hover:border-black/40'
          }`}
        >
          {existentes.map((url, i) => (
            <div key={`exist-${i}`} className="relative aspect-[3/4]">
              <img src={url} alt={`Existente ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEliminarExistente(i); }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-white/80 text-xs text-black hover:bg-white"
              >
                ×
              </button>
              {!esCreate && i === 0 && (
                <span className={`${mono.className} absolute left-1 top-1 bg-black/60 px-1.5 py-0.5 text-[9px] uppercase text-white`}>
                  Principal
                </span>
              )}
            </div>
          ))}
          {previews.map((p, i) => (
            <div key={`new-${i}`} className="relative aspect-[3/4]">
              <img src={p} alt={`Nueva ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEliminarArchivo(i); }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-white/80 text-xs text-black hover:bg-white"
              >
                ×
              </button>
              {!esCreate && (
                <span className={`${mono.className} absolute left-1 top-1 bg-blue-600/80 px-1.5 py-0.5 text-[9px] uppercase text-white`}>
                  Nueva
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="hidden"
      />
      {totalFotos > 0 && (
        <p className={`${mono.className} mt-1 text-[10px] text-black/40`}>
          {esCreate ? (
            <>
              {previews.length} foto{previews.length !== 1 ? 's' : ''} seleccionada{previews.length !== 1 ? 's' : ''}
            </>
          ) : (
            <>
              {existentes.length} existente{existentes.length !== 1 ? 's' : ''} · {previews.length} nueva{previews.length !== 1 ? 's' : ''}
            </>
          )}
        </p>
      )}
      {convirtiendo && (
        <p className={`${mono.className} mt-1 text-[10px] text-black/60`}>
          Convirtiendo imagen HEIC a JPEG...
        </p>
      )}
    </div>
  );
}
