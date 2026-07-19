'use client';

import { useState, useRef, useCallback } from 'react';
import { mono, body } from '@/lib/fonts';
import { SUBCATEGORIAS, type Categoria } from '@/lib/products';
import { subirImagen } from '@/lib/upload';
import { createProducto } from '@/app/actions/actions';

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

export default function CrearProducto() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [categoria, setCategoria] = useState<Categoria>('indumentaria');
  const [subcategoria, setSubcategoria] = useState('remeras');
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

  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const subcategorias = SUBCATEGORIAS[categoria];

  const handleArchivo = useCallback((file: File) => {
    setArchivo(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleArchivo(file);
    }
  }, [handleArchivo]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleArchivo(file);
  }, [handleArchivo]);

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
    if (!archivo || !nombre || !precio || !descripcion || !descripcionLarga || detalles.length === 0) return false;
    if (categoria === 'indumentaria' && talles.length === 0) return false;
    if (categoria === 'tecnologia' && !stockUnidades) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!formValido() || !archivo) return;

    setSubiendo(true);
    setMensaje(null);

    try {
      const url = await subirImagen(archivo);

      await createProducto({
        nombre,
        precio: Number(precio),
        categoria,
        subcategoria,
        descripcion,
        descripcionLarga,
        detalles,
        talles: categoria === 'indumentaria' ? talles : undefined,
        stockUnidades: categoria === 'tecnologia' ? Number(stockUnidades) : undefined,
        imagenes: [url],
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
    setArchivo(null);
    setPreview(null);
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
      {/* Zona de foto */}
      <div>
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
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className={`${mono.className} text-center text-xs uppercase tracking-wider text-black/40`}>
              <svg className="mx-auto mb-3 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Arrastrá una foto o hacé click
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Formulario */}
      <div className="flex flex-col gap-5">
        {/* Categoría y subcategoría */}
        <div className="flex gap-3">
          <select
            value={categoria}
            onChange={(e) => {
              const cat = e.target.value as Categoria;
              setCategoria(cat);
              setSubcategoria(SUBCATEGORIAS[cat][0].value);
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

        {/* Stock (solo tecnología) */}
        {categoria === 'tecnologia' && (
          <input
            type="number"
            placeholder="Unidades en stock"
            value={stockUnidades}
            onChange={(e) => setStockUnidades(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />
        )}

        {/* Mensaje de feedback */}
        {mensaje && (
          <div
            className={`${mono.className} border px-3 py-2 text-xs uppercase tracking-wider ${
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
            disabled={!formValido() || subiendo}
            className={`${mono.className} border border-black bg-black px-8 py-3 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white`}
          >
            {subiendo ? 'Subiendo...' : 'Subir producto'}
          </button>
            </div>
          </div>
        </div>
  );
}
