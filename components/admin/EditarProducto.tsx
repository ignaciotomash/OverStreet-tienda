'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { mono, body } from '@/lib/fonts';
import { getSubcategoriasCompletas, type Categoria, type Producto } from '@/lib/products';
import { subirImagen, normalizarImagen } from '@/lib/upload';
import { getProductos, updateProducto } from '@/app/actions/actions';
import ProductCard from '../ProductCard';
import Reveal from '../Reveal';

const TALLES_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];

const COLORES_PREDEFINIDOS = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Gris Claro', hex: '#D9D9D9' },
  { nombre: 'Gris', hex: '#808080' },
  { nombre: 'Gris Oscuro', hex: '#4A4A4A' },
  { nombre: 'Azul Marino', hex: '#1B2A41' },
  { nombre: 'Azul', hex: '#2563EB' },
  { nombre: 'Celeste', hex: '#60A5FA' },
  { nombre: 'Azul Petróleo', hex: '#1F5C5C' },
  { nombre: 'Verde Militar', hex: '#556B2F' },
  { nombre: 'Verde Oliva', hex: '#708238' },
  { nombre: 'Verde', hex: '#22C55E' },
  { nombre: 'Verde Agua', hex: '#5EEAD4' },
  { nombre: 'Amarillo', hex: '#FACC15' },
  { nombre: 'Mostaza', hex: '#D4A017' },
  { nombre: 'Naranja', hex: '#F97316' },
  { nombre: 'Coral', hex: '#FB7185' },
  { nombre: 'Rojo', hex: '#DC2626' },
  { nombre: 'Bordó', hex: '#800020' },
  { nombre: 'Rosa', hex: '#EC4899' },
  { nombre: 'Fucsia', hex: '#C026D3' },
  { nombre: 'Violeta', hex: '#7C3AED' },
  { nombre: 'Lila', hex: '#C4B5FD' },
  { nombre: 'Marrón', hex: '#8B5A2B' },
  { nombre: 'Chocolate', hex: '#5C4033' },
  { nombre: 'Beige', hex: '#D6C2A1' },
  { nombre: 'Arena', hex: '#E5D3B3' },
  { nombre: 'Crema', hex: '#F8F4E3' },
  { nombre: 'Camel', hex: '#C19A6B' },
  { nombre: 'Caqui', hex: '#BDB76B' },
  { nombre: 'Turquesa', hex: '#40E0D0' },
  { nombre: 'Aqua', hex: '#00CFCF' },
];

const COLORES_CLAROS = new Set(['#FFFFFF', '#D9D9D9', '#FACC15', '#5EEAD4', '#C4B5FD', '#F8F4E3', '#E5D3B3', '#D6C2A1', '#40E0D0', '#00CFCF', '#FB7185', '#60A5FA']);

const TODOS = 'todos';

type Paso = 'seleccion' | 'edicion';

export default function EditarProducto() {
  const [paso, setPaso] = useState<Paso>('seleccion');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [categoria, setCategoria] = useState<Categoria>('indumentaria');
  const [subcategoria, setSubcategoria] = useState(TODOS);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existantes, setExistantes] = useState<string[]>([]);

  const [editCategoria, setEditCategoria] = useState<Categoria>('indumentaria');
  const [editSubcategoria, setEditSubcategoria] = useState('remeras');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [talles, setTalles] = useState<{ talle: string; disponible: boolean }[]>(
    TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true }))
  );
  const [nuevoTalle, setNuevoTalle] = useState('');
  const [colores, setColores] = useState<string[]>([]);
  const [detalles, setDetalles] = useState<string[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState('');
  const [stockUnidades, setStockUnidades] = useState('');

  const [subcatExtras] = useState<Record<Categoria, { value: string; label: string }[]>>(() => {
    if (typeof window === 'undefined') return { indumentaria: [], tecnologia: [], perfumeria: [] };
    try {
      const stored = localStorage.getItem('subcatExtras');
      return stored ? JSON.parse(stored) : { indumentaria: [], tecnologia: [], perfumeria: [] };
    } catch { return { indumentaria: [], tecnologia: [], perfumeria: [] }; }
  });

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
    getProductos().then((p) => {
      setProductos(p);
      setCargando(false);
    });
  }, []);

  useEffect(() => {
    setSubcategoria(TODOS);
    setBusqueda('');
  }, [categoria]);

  const subBase = getSubcategoriasCompletas(categoria, productos);
  const subcategorias = [
    ...subBase,
    ...subcatExtras[categoria].filter(
      (extra) => !subBase.find((s) => s.value === extra.value)
    ),
  ];
  const editSubBase = getSubcategoriasCompletas(editCategoria, productos);
  const editSubcategorias = [
    ...editSubBase,
    ...subcatExtras[editCategoria].filter(
      (extra) => !editSubBase.find((s) => s.value === extra.value)
    ),
  ];

  const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const busquedaNorm = normalizar(busqueda);
  const productosFiltrados = productos.filter(
    (p) =>
      p.categoria === categoria &&
      (subcategoria === TODOS || p.subcategoria === subcategoria) &&
      (busquedaNorm === '' || normalizar(p.nombre).includes(busquedaNorm)),
  );

  const seleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setEditCategoria(producto.categoria);
    setEditSubcategoria(producto.subcategoria);
    setNombre(producto.nombre);
    setPrecio(String(producto.precio));
    setDescripcion(producto.descripcion);
    setDescripcionLarga(producto.descripcionLarga);
    setTalles(producto.talles ?? TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })));
    setColores(producto.colores ?? []);
    setDetalles(producto.detalles);
    setStockUnidades(producto.stockUnidades != null ? String(producto.stockUnidades) : '');
    setExistantes(producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : (producto.foto ? [producto.foto] : []));
    setArchivos([]);
    setPreviews([]);
    setPaso('edicion');
  };

  const handleArchivos = useCallback(async (files: FileList | File[]) => {
    const raw = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (raw.length === 0) return;

    const tieneHeic = raw.some((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext === 'heic' || ext === 'heif' || f.type === 'image/heic' || f.type === 'image/heif';
    });
    if (tieneHeic) setConvirtiendo(true);

    try {
      const normalizadas = await Promise.all(raw.map((f) => normalizarImagen(f)));
      setArchivos((prev) => [...prev, ...normalizadas]);
      normalizadas.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
        reader.readAsDataURL(file);
      });
    } finally {
      setConvirtiendo(false);
    }
  }, []);

  const eliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const eliminarExistente = (index: number) => {
    setExistantes((prev) => prev.filter((_, i) => i !== index));
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
    if (existantes.length === 0 && archivos.length === 0) return false;
    if (!nombre || !precio || !descripcion || !descripcionLarga || detalles.length === 0) return false;
    if (editCategoria === 'indumentaria' && talles.length === 0) return false;
    if (!stockUnidades) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!formValido() || !productoSeleccionado) return;

    setSubiendo(true);
    setMensaje(null);

    try {
      const urlsNuevas = archivos.length > 0 ? await Promise.all(archivos.map((f) => subirImagen(f))) : [];
      const todasLasUrls = [...existantes, ...urlsNuevas];

      await updateProducto(productoSeleccionado.id, {
        nombre,
        precio: Number(precio),
        categoria: editCategoria,
        subcategoria: editSubcategoria,
        descripcion,
        descripcionLarga,
        detalles,
        talles: editCategoria === 'indumentaria' ? talles : undefined,
        colores: colores.length > 0 ? colores : undefined,
        stockUnidades: Number(stockUnidades),
        imagenes: todasLasUrls,
      });

      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoSeleccionado.id
            ? {
                ...p,
                nombre,
                precio: Number(precio),
                categoria: editCategoria,
                subcategoria: editSubcategoria,
                descripcion,
                descripcionLarga,
                detalles,
                talles: editCategoria === 'indumentaria' ? talles : undefined,
                colores: colores.length > 0 ? colores : undefined,
                stockUnidades: Number(stockUnidades),
                imagenes: todasLasUrls,
                foto: todasLasUrls[0],
              }
            : p
        )
      );

      setMensaje({ tipo: 'exito', texto: 'Producto actualizado exitosamente' });
      setPaso('seleccion');
      setProductoSeleccionado(null);
    } catch (error) {
      const texto = error instanceof Error ? error.message : 'Error al actualizar el producto';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setSubiendo(false);
    }
  };

  if (paso === 'seleccion') {
    return (
      <div>
        {cargando ? (
          <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
            Cargando productos...
          </p>
        ) : (
          <>
            <Reveal>
              <div className="mb-6 flex flex-col items-center gap-4 border-b border-black pb-4 sm:flex-row sm:items-end sm:justify-between">
                <nav role="tablist" aria-label="Categoría" className="flex w-fit border border-black text-sm">
                  <button
                    role="tab"
                    aria-selected={categoria === 'indumentaria'}
                    onClick={() => setCategoria('indumentaria')}
                    className={`${mono.className} px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                      categoria === 'indumentaria' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                    }`}
                  >
                    Indumentaria
                  </button>
                  <button
                    role="tab"
                    aria-selected={categoria === 'tecnologia'}
                    onClick={() => setCategoria('tecnologia')}
                    className={`${mono.className} border-l border-black px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                      categoria === 'tecnologia' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                    }`}
                  >
                    Tecnología
                  </button>
                  <button
                    role="tab"
                    aria-selected={categoria === 'perfumeria'}
                    onClick={() => setCategoria('perfumeria')}
                    className={`${mono.className} border-l border-black px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                      categoria === 'perfumeria' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                    }`}
                  >
                    Perfumería
                  </button>
                </nav>

                <span className={`${mono.className} text-sm text-black/50`}>{productosFiltrados.length} productos</span>
              </div>
            </Reveal>

            <Reveal delay={40}>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start" role="group" aria-label="Filtrar por subcategoría">
                <button
                  onClick={() => setSubcategoria(TODOS)}
                  aria-pressed={subcategoria === TODOS}
                  className={`${mono.className} border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                    subcategoria === TODOS
                      ? 'border-black bg-black text-white'
                      : 'border-black/30 text-black/60 hover:border-black hover:text-black'
                  }`}
                >
                  Todos
                </button>
                {subcategorias.filter((sub) => sub.value !== 'todos').map((sub) => (
                  <button
                    key={sub.value}
                    onClick={() => setSubcategoria(sub.value)}
                    aria-pressed={subcategoria === sub.value}
                    className={`${mono.className} border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      subcategoria === sub.value
                        ? 'border-black bg-black text-white'
                        : 'border-black/30 text-black/60 hover:border-black hover:text-black'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="mb-8 relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className={`${mono.className} w-full border border-black/30 bg-white py-2.5 pl-10 pr-4 text-xs uppercase tracking-wide text-black placeholder:text-black/40 focus:border-black focus:outline-none`}
                />
              </div>
            </Reveal>

            {productosFiltrados.length === 0 ? (
              <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
                No hay productos en esta subcategoría por ahora.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {productosFiltrados.map((producto, i) => (
                  <Reveal key={producto.id} delay={(i % 3) * 90}>
                    <ProductCard
                      producto={producto}
                      subcategoria={subcategoria}
                      onSeleccionar={seleccionarProducto}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

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
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => { setPaso('seleccion'); setProductoSeleccionado(null); }}
        className={`${mono.className} mb-6 inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black`}
      >
        ← Volver a la lista
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          {existantes.length === 0 && previews.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex aspect-[3/4] cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer grid grid-cols-2 gap-2 border-2 border-dashed p-2 transition-colors ${
                arrastrando ? 'border-black bg-black/5' : 'border-black/20 hover:border-black/40'
              }`}
            >
              {existantes.map((url, i) => (
                <div key={`exist-${i}`} className="relative aspect-[3/4]">
                  <img src={url} alt={`Existente ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); eliminarExistente(i); }}
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
              {previews.map((p, i) => (
                <div key={`new-${i}`} className="relative aspect-[3/4]">
                  <img src={p} alt={`Nueva ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); eliminarArchivo(i); }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-white/80 text-xs text-black hover:bg-white"
                  >
                    ×
                  </button>
                  <span className={`${mono.className} absolute left-1 top-1 bg-blue-600/80 px-1.5 py-0.5 text-[9px] uppercase text-white`}>
                    Nueva
                  </span>
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {(existantes.length > 0 || previews.length > 0) && (
            <p className={`${mono.className} mt-1 text-[10px] text-black/40`}>
              {existantes.length} existente{existantes.length !== 1 ? 's' : ''} · {previews.length} nueva{previews.length !== 1 ? 's' : ''}
            </p>
          )}
          {convirtiendo && (
            <p className={`${mono.className} mt-1 text-[10px] text-black/60`}>
              Convirtiendo imagen HEIC a JPEG...
            </p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            <select
              value={editCategoria}
              onChange={(e) => {
                const cat = e.target.value as Categoria;
                setEditCategoria(cat);
                setEditSubcategoria(getSubcategoriasCompletas(cat, productos)[0].value);
              }}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              <option value="indumentaria">Indumentaria</option>
              <option value="tecnologia">Tecnología</option>
              <option value="perfumeria">Perfumería</option>
            </select>
            <select
              value={editSubcategoria}
              onChange={(e) => setEditSubcategoria(e.target.value)}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              {editSubcategorias.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <input
            type="text"
            placeholder="Descripción corta"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <textarea
            placeholder="Descripción larga"
            value={descripcionLarga}
            onChange={(e) => setDescripcionLarga(e.target.value)}
            rows={4}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs resize-none`}
          />

          {editCategoria === 'indumentaria' && (
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

          <input
            type="number"
            placeholder="Unidades en stock"
            value={stockUnidades}
            onChange={(e) => setStockUnidades(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

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

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!formValido() || subiendo || convirtiendo}
              className={`${mono.className} border border-black bg-black px-8 py-3 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white`}
            >
              {convirtiendo ? 'Convirtiendo...' : subiendo ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
