'use client';

import { useCallback } from 'react';
import { mono, body } from '@/lib/fonts';
import { COLORES_PREDEFINIDOS, COLORES_CLAROS, getSubcategoriasCompletas, type Categoria, type Producto, type SubcategoriaOpcion } from '@/lib/products';
import { type useEdicionForm } from '@/hooks/useEdicionForm';
import { type useImageUpload } from '@/hooks/useImageUpload';
import { type useSubcatExtras } from '@/hooks/useSubcatExtras';
import ZonaImagenes from '../general/ZonaImagenes';

interface FormularioEdicionProps {
  edicion: ReturnType<typeof useEdicionForm>;
  imagenes: ReturnType<typeof useImageUpload>;
  toast: { mensaje: { tipo: 'exito' | 'error'; texto: string } | null; visible: boolean };
  editSubcategorias: SubcategoriaOpcion[];
  editSubBase: SubcategoriaOpcion[];
  productos: Producto[];
  subcatExtras: ReturnType<typeof useSubcatExtras>;
  onVolver: () => void;
}

export default function FormularioEdicion({
  edicion,
  imagenes,
  toast,
  editSubcategorias,
  editSubBase,
  productos,
  subcatExtras,
  onVolver,
}: FormularioEdicionProps) {
  const handleCategoriaChange = useCallback((cat: Categoria) => {
    edicion.setEditCategoria(cat);
    const base = getSubcategoriasCompletas(cat, productos);
    edicion.setEditSubcategoria(base[0]?.value ?? '');
  }, [edicion, productos]);

  const handleEliminarSubcatExtra = useCallback(() => {
    const result = subcatExtras.eliminarSubcatExtra(
      edicion.editCategoria,
      edicion.editSubcategoria,
      productos,
    );
    if (result !== null) {
      edicion.setEditSubcategoria(result);
    }
  }, [subcatExtras, edicion, productos]);

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
          <ZonaImagenes
            existentes={imagenes.existentes}
            previews={imagenes.previews}
            arrastrando={imagenes.arrastrando}
            convirtiendo={imagenes.convirtiendo}
            fileInputRef={imagenes.fileInputRef}
            onDragOver={imagenes.handleDragOver}
            onDragLeave={imagenes.handleDragLeave}
            onDrop={imagenes.handleDrop}
            onFileChange={imagenes.handleFileChange}
            onEliminarExistente={imagenes.eliminarExistente}
            onEliminarArchivo={imagenes.eliminarArchivo}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            <select
              value={edicion.editCategoria}
              onChange={(e) => handleCategoriaChange(e.target.value as Categoria)}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              <option value="indumentaria">Indumentaria</option>
              <option value="tecnologia">Tecnología</option>
              <option value="perfumeria">Perfumería</option>
            </select>
            <select
              value={edicion.editSubcategoria}
              onChange={(e) => edicion.setEditSubcategoria(e.target.value)}
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
              onClick={handleEliminarSubcatExtra}
              disabled={editSubBase.some((s) => s.value === edicion.editSubcategoria) || productos.some((p) => p.categoria === edicion.editCategoria && p.subcategoria === edicion.editSubcategoria)}
              className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              ×
            </button>
          </div>

          <input
            type="text"
            placeholder="Nombre del producto"
            value={edicion.nombre}
            onChange={(e) => edicion.setNombre(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <input
            type="number"
            placeholder="Precio"
            value={edicion.precio}
            onChange={(e) => edicion.setPrecio(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={edicion.enOferta}
                onChange={(e) => {
                  edicion.setEnOferta(e.target.checked);
                  edicion.setPrecioOferta('');
                }}
                className="h-4 w-4 accent-[#16a34a]"
              />
              <span className={`${mono.className} text-xs uppercase tracking-wide text-black/70`}>
                Este producto está en oferta
              </span>
            </label>
            {edicion.enOferta && (
              <input
                type="number"
                placeholder="Precio de oferta"
                value={edicion.precioOferta}
                onChange={(e) => edicion.setPrecioOferta(e.target.value)}
                className={`${mono.className} border border-[#16a34a]/30 bg-[#22c55e]/5 px-3 py-2 text-xs`}
              />
            )}
          </div>

          <input
            type="text"
            placeholder="Descripción corta"
            value={edicion.descripcion}
            onChange={(e) => edicion.setDescripcion(e.target.value)}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
          />

          <textarea
            placeholder="Descripción larga"
            value={edicion.descripcionLarga}
            onChange={(e) => edicion.setDescripcionLarga(e.target.value)}
            rows={10}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs resize-none`}
          />

          {edicion.editCategoria === 'indumentaria' && (
            <div>
              <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                Talles
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {edicion.talles.map((t) => (
                  <div key={t.talle} className="flex min-w-[140px] items-center gap-1">
                    <button
                      type="button"
                      onClick={() => edicion.toggleTalle(t.talle)}
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
                      onChange={(e) => edicion.actualizarStockTalle(t.talle, e.target.value)}
                      className={`${mono.className} h-9 w-14 border border-black/20 bg-transparent px-1.5 text-center text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => edicion.eliminarTalle(t.talle)}
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
                    value={edicion.nuevoTalle}
                    onChange={(e) => edicion.setNuevoTalle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && edicion.agregarTalle()}
                    className={`${mono.className} h-9 w-12 border border-black/20 bg-transparent px-2 text-center text-sm`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={edicion.limpiarTalles}
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

            {edicion.editCategoria === 'indumentaria' && (
              <div className="mt-2">
                <span className={`${mono.className} text-[10px] uppercase tracking-wider text-black/40`}>
                  Asignar colores a talle:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {edicion.talles.map((t) => (
                    <button
                      key={t.talle}
                      type="button"
                      onClick={() => edicion.seleccionarTalleActivo(t.talle)}
                      className={`${mono.className} flex h-8 min-w-8 items-center justify-center border px-2 text-xs transition-all ${
                        edicion.talleActivo === t.talle
                          ? 'border-black bg-black text-white'
                          : t.colores && t.colores.length > 0
                            ? 'border-black/40 bg-black/5 text-black'
                            : 'border-black/20 text-black/40 hover:border-black/40'
                      }`}
                    >
                      {t.talle}
                      {t.colores && t.colores.length > 0 && edicion.talleActivo !== t.talle && (
                        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-black/40" />
                      )}
                    </button>
                  ))}
                </div>
                {edicion.talleActivo && (
                  <p className={`${mono.className} mt-1.5 text-[10px] text-black/40`}>
                    Editando colores del talle {edicion.talleActivo}
                  </p>
                )}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              {edicion.colores.map((color) => (
                <div key={color} className="flex items-center gap-1">
                  <span
                    className="h-7 w-7 rounded-full border-2 border-black/20"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => edicion.eliminarColor(color)}
                    className="text-xs text-black/30 hover:text-black"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-16 md:grid-cols-16">
              {COLORES_PREDEFINIDOS.map((color) => {
                const seleccionado = edicion.colores.includes(color.hex);
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => {
                      if (seleccionado) {
                        edicion.eliminarColor(color.hex);
                      } else {
                        edicion.setColores((prev) => [...prev, color.hex]);
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
              onClick={() => edicion.setColores([])}
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
              {edicion.detalles.map((detalle) => (
                <div key={detalle} className="flex items-center gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-black" />
                  <span className={`${body.className} flex-1 text-sm text-black/70`}>
                    {detalle}
                  </span>
                  <button
                    type="button"
                    onClick={() => edicion.eliminarDetalle(detalle)}
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
                  value={edicion.nuevoDetalle}
                  onChange={(e) => edicion.setNuevoDetalle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && edicion.agregarDetalle()}
                  onBlur={edicion.agregarDetalle}
                  className={`${mono.className} flex-1 border border-black/20 bg-transparent px-2 py-1 text-xs`}
                />
                <button
                  type="button"
                  onClick={edicion.agregarDetalle}
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
            value={edicion.stockUnidades}
            onChange={(e) => edicion.setStockUnidades(e.target.value)}
            readOnly={edicion.editCategoria === 'indumentaria'}
            className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs ${edicion.editCategoria === 'indumentaria' ? 'bg-black/5 cursor-not-allowed' : ''}`}
          />

          {toast.mensaje && (
            <div
              className={`${mono.className} fixed right-5 top-24 z-50 border px-4 py-3 text-xs uppercase tracking-wider shadow-lg transition-opacity duration-300 ${
                toast.visible ? 'opacity-100' : 'opacity-0'
              } ${
                toast.mensaje.tipo === 'exito'
                  ? 'border-green-600/30 bg-green-600/10 text-green-700'
                  : 'border-[#C1272D]/30 bg-[#C1272D]/10 text-[#C1272D]'
              }`}
            >
              {toast.mensaje.texto}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={edicion.handleSubmit}
              disabled={!edicion.formValido || edicion.subiendo || imagenes.convirtiendo}
              className={`${mono.className} border border-black bg-black px-8 py-3 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white`}
            >
              {imagenes.convirtiendo ? 'Convirtiendo...' : edicion.subiendo ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
