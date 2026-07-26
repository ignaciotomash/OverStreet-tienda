'use client';

import { mono, body } from '@/lib/fonts';
import { COLORES_PREDEFINIDOS, COLORES_CLAROS, type Categoria, type Producto, type Talle, type SubcategoriaOpcion } from '@/lib/products';
import ZonaImagenes from '../general/ZonaImagenes';

interface FormularioEdicionProps {
  editCategoria: Categoria;
  editSubcategoria: string;
  nombre: string;
  precio: string;
  enOferta: boolean;
  precioOferta: string;
  descripcion: string;
  descripcionLarga: string;
  talles: Talle[];
  nuevoTalle: string;
  colores: string[];
  talleActivo: string | null;
  detalles: string[];
  nuevoDetalle: string;
  stockUnidades: string;
  editSubcategorias: SubcategoriaOpcion[];
  editSubBase: SubcategoriaOpcion[];
  productos: Producto[];
  formValido: boolean;
  subiendo: boolean;
  convirtiendo: boolean;
  onVolver: () => void;
  onCategoriaChange: (cat: Categoria) => void;
  onSubcategoriaChange: (sub: string) => void;
  onNombreChange: (v: string) => void;
  onPrecioChange: (v: string) => void;
  onEnOfertaChange: (v: boolean) => void;
  onPrecioOfertaChange: (v: string) => void;
  onDescripcionChange: (v: string) => void;
  onDescripcionLargaChange: (v: string) => void;
  onToggleTalle: (t: string) => void;
  onNuevoTalleChange: (v: string) => void;
  onAgregarTalle: () => void;
  onEliminarTalle: (t: string) => void;
  onActualizarStockTalle: (t: string, s: string) => void;
  onSeleccionarTalleActivo: (t: string) => void;
  onEliminarColor: (c: string) => void;
  onColoresChange: React.Dispatch<React.SetStateAction<string[]>>;
  onLimpiarTalles: () => void;
  onAgregarDetalle: () => void;
  onEliminarDetalle: (d: string) => void;
  onNuevoDetalleChange: (v: string) => void;
  onStockUnidadesChange: (v: string) => void;
  onEliminarSubcatExtra: () => void;
  onSubmit: () => void;
  mensaje: { tipo: 'exito' | 'error'; texto: string } | null;
  visible: boolean;
  imagenProps: {
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
  };
}

export default function FormularioEdicion({
  editCategoria,
  editSubcategoria,
  nombre,
  precio,
  enOferta,
  precioOferta,
  descripcion,
  descripcionLarga,
  talles,
  nuevoTalle,
  colores,
  talleActivo,
  detalles,
  nuevoDetalle,
  stockUnidades,
  editSubcategorias,
  editSubBase,
  productos,
  formValido,
  subiendo,
  convirtiendo,
  onVolver,
  onCategoriaChange,
  onSubcategoriaChange,
  onNombreChange,
  onPrecioChange,
  onEnOfertaChange,
  onPrecioOfertaChange,
  onDescripcionChange,
  onDescripcionLargaChange,
  onToggleTalle,
  onNuevoTalleChange,
  onAgregarTalle,
  onEliminarTalle,
  onActualizarStockTalle,
  onSeleccionarTalleActivo,
  onEliminarColor,
  onColoresChange,
  onLimpiarTalles,
  onAgregarDetalle,
  onEliminarDetalle,
  onNuevoDetalleChange,
  onStockUnidadesChange,
  onEliminarSubcatExtra,
  onSubmit,
  mensaje,
  visible,
  imagenProps,
}: FormularioEdicionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onVolver}
        className={`${mono.className} mb-6 inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black`}
      >
        ← Volver a la lista
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <ZonaImagenes {...imagenProps} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            <select
              value={editCategoria}
              onChange={(e) => {
                const cat = e.target.value as Categoria;
                onCategoriaChange(cat);
              }}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              <option value="indumentaria">Indumentaria</option>
              <option value="tecnologia">Tecnología</option>
              <option value="perfumeria">Perfumería</option>
            </select>
            <select
              value={editSubcategoria}
              onChange={(e) => onSubcategoriaChange(e.target.value)}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              {editSubcategorias.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onEliminarSubcatExtra}
              disabled={editSubBase.some((s) => s.value === editSubcategoria) || productos.some((p) => p.categoria === editCategoria && p.subcategoria === editSubcategoria)}
              className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              ×
            </button>
          </div>

          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => onPrecioChange(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enOferta}
                onChange={(e) => {
                  onEnOfertaChange(e.target.checked);
                  onPrecioOfertaChange('');
                }}
                className="h-4 w-4 accent-[#16a34a]"
              />
              <span className={`${mono.className} text-xs uppercase tracking-wide text-black/70`}>
                Este producto está en oferta
              </span>
            </label>
            {enOferta && (
              <input
                type="number"
                placeholder="Precio de oferta"
                value={precioOferta}
                onChange={(e) => onPrecioOfertaChange(e.target.value)}
                className={`${mono.className} border border-[#16a34a]/30 bg-[#22c55e]/5 px-3 py-2 text-xs`}
              />
            )}
          </div>

          <input
            type="text"
            placeholder="Descripción corta"
            value={descripcion}
            onChange={(e) => onDescripcionChange(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <textarea
            placeholder="Descripción larga"
            value={descripcionLarga}
            onChange={(e) => onDescripcionLargaChange(e.target.value)}
            rows={10}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs resize-none`}
          />

          {editCategoria === 'indumentaria' && (
            <div>
              <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                Talles
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {talles.map((t) => (
                <div key={t.talle} className="flex min-w-[140px] items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleTalle(t.talle)}
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
                      onChange={(e) => onActualizarStockTalle(t.talle, e.target.value)}
                      className={`${mono.className} h-9 w-14 border border-black/20 bg-transparent px-1.5 text-center text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => onEliminarTalle(t.talle)}
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
                    onChange={(e) => onNuevoTalleChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onAgregarTalle()}
                    className={`${mono.className} h-9 w-12 border border-black/20 bg-transparent px-2 text-center text-sm`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={onLimpiarTalles}
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

            {editCategoria === 'indumentaria' && (
              <div className="mt-2">
                <span className={`${mono.className} text-[10px] uppercase tracking-wider text-black/40`}>
                  Asignar colores a talle:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {talles.map((t) => (
                    <button
                      key={t.talle}
                      type="button"
                      onClick={() => onSeleccionarTalleActivo(t.talle)}
                      className={`${mono.className} flex h-8 min-w-8 items-center justify-center border px-2 text-xs transition-all ${
                        talleActivo === t.talle
                          ? 'border-black bg-black text-white'
                          : t.colores && t.colores.length > 0
                            ? 'border-black/40 bg-black/5 text-black'
                            : 'border-black/20 text-black/40 hover:border-black/40'
                      }`}
                    >
                      {t.talle}
                      {t.colores && t.colores.length > 0 && talleActivo !== t.talle && (
                        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-black/40" />
                      )}
                    </button>
                  ))}
                </div>
                {talleActivo && (
                  <p className={`${mono.className} mt-1.5 text-[10px] text-black/40`}>
                    Editando colores del talle {talleActivo}
                  </p>
                )}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              {colores.map((color) => (
                <div key={color} className="flex items-center gap-1">
                  <span
                    className="h-7 w-7 rounded-full border-2 border-black/20"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => onEliminarColor(color)}
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
                        onEliminarColor(color.hex);
                      } else {
                        onColoresChange((prev) => [...prev, color.hex]);
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
              onClick={() => onColoresChange([])}
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
                    onClick={() => onEliminarDetalle(detalle)}
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
                  onChange={(e) => onNuevoDetalleChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onAgregarDetalle()}
                  onBlur={onAgregarDetalle}
                  className={`${mono.className} flex-1 border border-black/20 bg-transparent px-2 py-1 text-xs`}
                />
                <button
                  type="button"
                  onClick={onAgregarDetalle}
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
            onChange={(e) => onStockUnidadesChange(e.target.value)}
            readOnly={editCategoria === 'indumentaria'}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs ${editCategoria === 'indumentaria' ? 'bg-black/5 cursor-not-allowed' : ''}`}
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
              onClick={onSubmit}
              disabled={!formValido || subiendo || convirtiendo}
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
