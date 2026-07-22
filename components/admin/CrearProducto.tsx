'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { mono, body } from '@/lib/fonts';
import { getSubcategoriasCompletas, COLORES_PREDEFINIDOS, COLORES_CLAROS, type Categoria, type Producto } from '@/lib/products';
import { subirImagen, normalizarImagen } from '@/lib/upload';
import { createProducto, getProductos } from '@/app/actions/actions';

const TALLES_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CrearProducto() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [categoria, setCategoria] = useState<Categoria>('indumentaria');
  const [subcategoria, setSubcategoria] = useState('remeras');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [talles, setTalles] = useState<{ talle: string; disponible: boolean; stock?: number }[]>(
    TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true }))
  );
  const [nuevoTalle, setNuevoTalle] = useState('');
  const [colores, setColores] = useState<string[]>([]);
  const [detalles, setDetalles] = useState<string[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState('');
  const [stockUnidades, setStockUnidades] = useState('');

  const [subcatExtras, setSubcatExtras] = useState<Record<Categoria, { value: string; label: string }[]>>(() => {
    if (typeof window === 'undefined') return { indumentaria: [], tecnologia: [], perfumeria: [] };
    try {
      const stored = localStorage.getItem('subcatExtras');
      return stored ? JSON.parse(stored) : { indumentaria: [], tecnologia: [], perfumeria: [] };
    } catch { return { indumentaria: [], tecnologia: [], perfumeria: [] }; }
  });
  const [mostrarInputSub, setMostrarInputSub] = useState(false);
  const [nuevaSub, setNuevaSub] = useState('');

  const [convirtiendo, setConvirtiendo] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mensaje) {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = setTimeout(() => setMensaje(null), 300);
      }, 2700);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mensaje]);

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  useEffect(() => {
    localStorage.setItem('subcatExtras', JSON.stringify(subcatExtras));
  }, [subcatExtras]);

  const subBase = getSubcategoriasCompletas(categoria, productos);
  const subcategorias = [
    ...subBase,
    ...subcatExtras[categoria].filter(
      (extra) => !subBase.find((s) => s.value === extra.value)
    ),
  ];

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
        setMensaje({ tipo: 'error', texto: `${fallidos} imagen(es) no se pudo(ieron) procesar. Intentá con otro formato.` });
      }
    } finally {
      setConvirtiendo(false);
    }
  }, []);

  const eliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

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

  const toggleTalle = (talle: string) => {
    setTalles((prev) =>
      prev.map((t) =>
        t.talle === talle ? { ...t, disponible: !t.disponible } : t
      )
    );
  };

  const actualizarStockTalle = (talle: string, stock: string) => {
    const valor = stock === '' ? undefined : Number(stock);
    setTalles((prev) =>
      prev.map((t) =>
        t.talle === talle
          ? { ...t, stock: valor, disponible: valor === undefined ? t.disponible : valor > 0 }
          : t
      )
    );
  };

  const agregarTalle = () => {
    if (nuevoTalle && !talles.find((t) => t.talle === nuevoTalle)) {
      setTalles((prev) => [...prev, { talle: nuevoTalle, disponible: true }]);
      setNuevoTalle('');
    }
  };

  const eliminarTalle = (talle: string) => {
    setTalles((prev) => prev.filter((t) => t.talle !== talle));
  };

  const eliminarColor = (color: string) => {
    setColores((prev) => prev.filter((c) => c !== color));
  };

  const agregarDetalle = () => {
    if (nuevoDetalle && !detalles.includes(nuevoDetalle)) {
      setDetalles((prev) => [...prev, nuevoDetalle]);
      setNuevoDetalle('');
    }
  };

  const eliminarDetalle = (detalle: string) => {
    setDetalles((prev) => prev.filter((d) => d !== detalle));
  };

  const formValido = () => {
    if (archivos.length === 0 || !nombre || !precio || !descripcion || !descripcionLarga || detalles.length === 0) return false;
    if (categoria === 'indumentaria' && talles.length === 0) return false;
    if (!stockUnidades) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!formValido() || archivos.length === 0) return;

    setSubiendo(true);
    setMensaje(null);

    try {
      const urls = await Promise.all(archivos.map((f) => subirImagen(f)));

      await createProducto({
        nombre,
        precio: Number(precio),
        categoria,
        subcategoria,
        descripcion,
        descripcionLarga,
        detalles,
        talles: categoria === 'indumentaria' ? talles : undefined,
        colores: colores.length > 0 ? colores : undefined,
        stockUnidades: Number(stockUnidades),
        imagenes: urls,
      });

      setMensaje({ tipo: 'exito', texto: 'Producto creado exitosamente' });
      resetFormulario();
    } catch (error) {
      const texto = error instanceof Error ? error.message : 'Error al crear el producto';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setSubiendo(false);
    }
  };

  const resetFormulario = () => {
    setArchivos([]);
    setPreviews([]);
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setDescripcionLarga('');
    setTalles(TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })));
    setColores([]);
    setDetalles([]);
    setStockUnidades('');
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Zona de fotos */}
      <div>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
            arrastrando
              ? 'border-black bg-black/5'
              : 'border-black/20 hover:border-black/40'
          }`}
        >
          {previews.length === 0 ? (
            <div className={`${mono.className} py-10 text-center text-xs uppercase tracking-wider text-black/40`}>
              <svg className="mx-auto mb-3 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Arrastrá fotos o hacé click
            </div>
          ) : (
            <div className="grid w-full grid-cols-2 gap-2 p-2">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-[3/4]">
                  <img src={p} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); eliminarArchivo(i); }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-white/80 text-xs text-black hover:bg-white"
                  >
                    ×
                  </button>
                  {i === 0 && (
                    <span className={`${mono.className} absolute left-1 top-1 bg-black/60 px-1.5 py-0.5 text-[9px] uppercase text-white`}>
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {previews.length > 0 && (
          <p className={`${mono.className} mt-1 text-[10px] text-black/40`}>
            {previews.length} foto{previews.length !== 1 ? 's' : ''} seleccionada{previews.length !== 1 ? 's' : ''}
          </p>
        )}
        {convirtiendo && (
          <p className={`${mono.className} mt-1 text-[10px] text-black/60`}>
            Convirtiendo imagen HEIC a JPEG...
          </p>
        )}
      </div>

      {/* Formulario */}
      <div className="flex flex-col gap-5">
        {/* Categoría y subcategoría */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <select
              value={categoria}
              onChange={(e) => {
                const cat = e.target.value as Categoria;
                setCategoria(cat);
                const base = getSubcategoriasCompletas(cat, productos);
                const extras = subcatExtras[cat].filter((extra) => !base.find((s) => s.value === extra.value));
                setSubcategoria([...base, ...extras][0].value);
                setMostrarInputSub(false);
                setNuevaSub('');
              }}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              <option value="indumentaria">Indumentaria</option>
              <option value="tecnologia">Tecnología</option>
              <option value="perfumeria">Perfumería</option>
            </select>
            <select
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              {subcategorias.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { setMostrarInputSub((v) => !v); setNuevaSub(''); }}
              className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10`}
            >
              +
            </button>
          </div>

          {mostrarInputSub && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nueva subcategoría..."
                value={nuevaSub}
                onChange={(e) => setNuevaSub(e.target.value)}
                onBlur={() => {
                  if (nuevaSub.trim()) {
                    const value = nuevaSub.trim().toLowerCase().replace(/\s+/g, '-');
                    const label = nuevaSub.trim();
                    if (!subcategorias.find((s) => s.value === value)) {
                      setSubcatExtras((prev) => ({
                        ...prev,
                        [categoria]: [...prev[categoria], { value, label }],
                      }));
                    }
                    setSubcategoria(value);
                  }
                  setNuevaSub('');
                  setMostrarInputSub(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && nuevaSub.trim()) {
                    const value = nuevaSub.trim().toLowerCase().replace(/\s+/g, '-');
                    const label = nuevaSub.trim();
                    if (!subcategorias.find((s) => s.value === value)) {
                      setSubcatExtras((prev) => ({
                        ...prev,
                        [categoria]: [...prev[categoria], { value, label }],
                      }));
                    }
                    setSubcategoria(value);
                    setNuevaSub('');
                    setMostrarInputSub(false);
                  }
                  if (e.key === 'Escape') { setMostrarInputSub(false); setNuevaSub(''); }
                }}
                autoFocus
                className={`${mono.className} flex-1 border border-black/20 bg-transparent px-3 py-2 text-xs`}
              />
              <button
                type="button"
                onClick={() => {
                  if (nuevaSub.trim()) {
                    const value = nuevaSub.trim().toLowerCase().replace(/\s+/g, '-');
                    const label = nuevaSub.trim();
                    if (!subcategorias.find((s) => s.value === value)) {
                      setSubcatExtras((prev) => ({
                        ...prev,
                        [categoria]: [...prev[categoria], { value, label }],
                      }));
                    }
                    setSubcategoria(value);
                    setNuevaSub('');
                    setMostrarInputSub(false);
                  }
                }}
                className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10`}
              >
                ✓
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setMostrarInputSub(false); setNuevaSub(''); }}
                className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10`}
              >
                X 
              </button>
            </div>
          )}
        </div>

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        {/* Precio */}
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        {/* Descripción corta */}
        <input
          type="text"
          placeholder="Descripción corta"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        {/* Descripción larga */}
        <textarea
          placeholder="Descripción larga"
          value={descripcionLarga}
          onChange={(e) => setDescripcionLarga(e.target.value)}
          rows={4}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs resize-none`}
        />

        {/* Talles (solo indumentaria) */}
        {categoria === 'indumentaria' && (
          <div>
            <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
              Talles
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {talles.map((t) => (
                <div key={t.talle} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleTalle(t.talle)}
                    className={`${mono.className} flex h-9 min-w-9 items-center justify-center border px-2 text-sm transition-colors ${
                      t.disponible
                        ? 'border-black bg-black text-white'
                        : 'border-black/20 text-black/25 line-through'
                    }`}
                  >
                    {t.talle}
                  </button>
                  <input
                    type="number"
                    min={0}
                    placeholder="Stock"
                    value={t.stock ?? ''}
                    onChange={(e) => actualizarStockTalle(t.talle, e.target.value)}
                    className={`${mono.className} h-9 w-14 border border-black/20 bg-transparent px-1.5 text-center text-xs`}
                  />
                  <button
                    type="button"
                    onClick={() => eliminarTalle(t.talle)}
                    className="text-xs text-black/30 hover:text-black"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+"
                  value={nuevoTalle}
                  onChange={(e) => setNuevoTalle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && agregarTalle()}
                  className={`${mono.className} h-9 w-12 border border-black/20 bg-transparent px-2 text-center text-sm`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTalles(TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })))}
              className={`${mono.className} mt-2 border border-black/15 bg-black/5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-black/40 transition-colors hover:border-black/30 hover:text-black`}
            >
              Limpiar
            </button>
          </div>
        )}

        {/* Colores */}
        <div>
          <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
            Colores
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {colores.map((color) => (
              <div key={color} className="flex items-center gap-1">
                <span
                  className="h-7 w-7 rounded-full border-2 border-black/20"
                  style={{ backgroundColor: color }}
                />
                <button
                  type="button"
                  onClick={() => eliminarColor(color)}
                  className="text-xs text-black/30 hover:text-black"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-16 md:grid-cols-16">
            {COLORES_PREDEFINIDOS.map((color) => {
              const seleccionado = colores.includes(color.hex);
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => {
                    if (seleccionado) {
                      eliminarColor(color.hex);
                    } else {
                      setColores((prev) => [...prev, color.hex]);
                    }
                  }}
                  title={color.nombre}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                    seleccionado
                      ? 'border-black scale-110'
                      : 'border-black/15 hover:border-black/40'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {seleccionado && (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke={COLORES_CLAROS.has(color.hex) ? 'black' : 'white'} strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setColores([])}
            className={`${mono.className} mt-2 border border-black/15 bg-black/5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-black/40 transition-colors hover:border-black/30 hover:text-black`}
          >
            Limpiar
          </button>
        </div>

        {/* Detalles */}
        <div>
          <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
            Detalles
          </span>
          <div className="mt-2 flex flex-col gap-1">
            {detalles.map((detalle) => (
              <div key={detalle} className="flex items-center gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-black" />
                <span className={`${body.className} flex-1 text-sm text-black/70`}>
                  {detalle}
                </span>
                <button
                  type="button"
                  onClick={() => eliminarDetalle(detalle)}
                  className={`${mono.className} flex h-9 w-9 shrink-0 items-center justify-center border border-black/15 text-xs text-black/30 transition-colors hover:border-black/40 hover:text-black`}
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                placeholder="Agregar detalle..."
                value={nuevoDetalle}
                onChange={(e) => setNuevoDetalle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregarDetalle()}
                onBlur={agregarDetalle}
                className={`${mono.className} flex-1 border border-black/20 bg-transparent px-2 py-1 text-xs`}
              />
              <button
                type="button"
                onClick={agregarDetalle}
                className={`${mono.className} flex h-9 w-9 shrink-0 items-center justify-center border border-black/20 text-sm text-black/50 transition-colors hover:border-black hover:text-black`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Stock */}
        <input
          type="number"
          placeholder="Unidades en stock"
          value={stockUnidades}
          onChange={(e) => setStockUnidades(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        {/* Mensaje de feedback */}
        {mensaje && (
          <div
            className={`${mono.className} fixed right-5 top-24 z-50 border px-4 py-3 text-xs uppercase tracking-wider shadow-lg transition-opacity duration-300 ${
              visible ? 'opacity-100' : 'opacity-0'
            } ${
              mensaje.tipo === 'exito'
                ? 'border-green-600/30 bg-green-600/10 text-green-700'
                : 'border-[#C1272D]/30 bg-[#C1272D]/10 text-[#C1272D]'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Botón subir */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!formValido() || subiendo || convirtiendo}
            className={`${mono.className} border border-black bg-black px-8 py-3 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white`}
          >
            {convirtiendo ? 'Convirtiendo...' : subiendo ? 'Subiendo...' : 'Subir producto'}
          </button>
            </div>
          </div>
        </div>
  );
}
