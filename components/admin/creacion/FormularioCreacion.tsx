'use client';

import { useState, useCallback } from 'react';
import { mono, body } from '@/lib/fonts';
import { COLORES_PREDEFINIDOS, COLORES_CLAROS, getSubcategoriasCompletas, type Categoria, type Producto, type SubcategoriaOpcion } from '@/lib/products';
import { type useCreacionForm } from '@/hooks/useCreacionForm';
import { type useImageUpload } from '@/hooks/useImageUpload';
import { type useSubcatExtras } from '@/hooks/useSubcatExtras';
import ZonaImagenes from '../general/ZonaImagenes';
import NuevaSubcategoriaInput from './NuevaSubcategoriaInput';

interface FormularioCreacionProps {
  creacion: ReturnType<typeof useCreacionForm>;
  imagenes: ReturnType<typeof useImageUpload>;
  toast: { mensaje: { tipo: 'exito' | 'error'; texto: string } | null; visible: boolean };
  subcategorias: SubcategoriaOpcion[];
  subBase: SubcategoriaOpcion[];
  productos: Producto[];
  subcatExtras: ReturnType<typeof useSubcatExtras>;
}

export default function FormularioCreacion({
  creacion,
  imagenes,
  toast,
  subcategorias,
  subBase,
  productos,
  subcatExtras,
}: FormularioCreacionProps) {
  const [mostrarInputSub, setMostrarInputSub] = useState(false);

  const handleCategoriaChange = useCallback((cat: Categoria) => {
    creacion.setCategoria(cat);
    const base = getSubcategoriasCompletas(cat, productos);
    const extras = subcatExtras.subcatExtras[cat].filter(
      (extra) => !base.find((s) => s.value === extra.value),
    );
    creacion.setSubcategoria([...base, ...extras][0]?.value ?? '');
  }, [creacion, productos, subcatExtras]);

  const handleEliminarSubcatExtra = useCallback(() => {
    const result = subcatExtras.eliminarSubcatExtra(
      creacion.categoria,
      creacion.subcategoria,
      productos,
    );
    if (result !== null) {
      creacion.setSubcategoria(result);
    }
  }, [subcatExtras, creacion, productos]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <ZonaImagenes
          variant="create"
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
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <select
              value={creacion.categoria}
              onChange={(e) => {
                handleCategoriaChange(e.target.value as Categoria);
                setMostrarInputSub(false);
              }}
              className={`${mono.className} flex-1 border border-black bg-transparent px-3 py-2 text-xs uppercase tracking-wider`}
            >
              <option value="indumentaria">Indumentaria</option>
              <option value="tecnologia">Tecnología</option>
              <option value="perfumeria">Perfumería</option>
            </select>
            <select
              value={creacion.subcategoria}
              onChange={(e) => creacion.setSubcategoria(e.target.value)}
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
              onClick={() => { setMostrarInputSub((v) => !v); }}
              className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10`}
            >
              +
            </button>
            <button
              type="button"
              onClick={handleEliminarSubcatExtra}
              disabled={subBase.some((s) => s.value === creacion.subcategoria) || productos.some((p) => p.categoria === creacion.categoria && p.subcategoria === creacion.subcategoria)}
              className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              ×
            </button>
          </div>

          {mostrarInputSub && (
            <NuevaSubcategoriaInput
              categoria={creacion.categoria}
              subcategorias={subcategorias}
              onAgregarSubcat={subcatExtras.agregarSubcat}
              onSubcategoriaChange={(v) => { creacion.setSubcategoria(v); setMostrarInputSub(false); }}
              onCerrar={() => setMostrarInputSub(false)}
            />
          )}
        </div>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={creacion.nombre}
          onChange={(e) => creacion.setNombre(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        <input
          type="number"
          placeholder="Precio"
          value={creacion.precio}
          onChange={(e) => creacion.setPrecio(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={creacion.enOferta}
              onChange={(e) => {
                creacion.setEnOferta(e.target.checked);
                creacion.setPrecioOferta('');
              }}
              className="h-4 w-4 accent-[#16a34a]"
            />
            <span className={`${mono.className} text-xs uppercase tracking-wide text-black/70`}>
              Este producto está en oferta
            </span>
          </label>
          {creacion.enOferta && (
            <input
              type="number"
              placeholder="Precio de oferta"
              value={creacion.precioOferta}
              onChange={(e) => creacion.setPrecioOferta(e.target.value)}
              className={`${mono.className} border border-[#16a34a]/30 bg-[#22c55e]/5 px-3 py-2 text-xs`}
            />
          )}
        </div>

        <input
          type="text"
          placeholder="Descripción corta"
          value={creacion.descripcion}
          onChange={(e) => creacion.setDescripcion(e.target.value)}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs`}
        />

        <textarea
          placeholder="Descripción larga"
          value={creacion.descripcionLarga}
          onChange={(e) => creacion.setDescripcionLarga(e.target.value)}
          rows={10}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs resize-none`}
        />

        {creacion.categoria === 'indumentaria' && (
          <div>
            <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
              Talles
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {creacion.talles.map((t) => (
                <div key={t.talle} className="flex min-w-[140px] items-center gap-1">
                  <button
                    type="button"
                    onClick={() => creacion.toggleTalle(t.talle)}
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
                    onChange={(e) => creacion.actualizarStockTalle(t.talle, e.target.value)}
                    className={`${mono.className} h-9 w-14 border border-black/20 bg-transparent px-1.5 text-center text-xs`}
                  />
                  <button
                    type="button"
                    onClick={() => creacion.eliminarTalle(t.talle)}
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
                  value={creacion.nuevoTalle}
                  onChange={(e) => creacion.setNuevoTalle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && creacion.agregarTalle()}
                  className={`${mono.className} h-9 w-12 border border-black/20 bg-transparent px-2 text-center text-sm`}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={creacion.limpiarTalles}
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

          {creacion.categoria === 'indumentaria' && (
            <div className="mt-2">
              <span className={`${mono.className} text-[10px] uppercase tracking-wider text-black/40`}>
                Asignar colores a talle:
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {creacion.talles.map((t) => (
                  <button
                    key={t.talle}
                    type="button"
                    onClick={() => creacion.seleccionarTalleActivo(t.talle)}
                    className={`${mono.className} flex h-8 min-w-8 items-center justify-center border px-2 text-xs transition-all ${
                      creacion.talleActivo === t.talle
                        ? 'border-black bg-black text-white'
                        : t.colores && t.colores.length > 0
                          ? 'border-black/40 bg-black/5 text-black'
                          : 'border-black/20 text-black/40 hover:border-black/40'
                    }`}
                  >
                    {t.talle}
                    {t.colores && t.colores.length > 0 && creacion.talleActivo !== t.talle && (
                      <span className="ml-1 h-1.5 w-1.5 rounded-full bg-black/40" />
                    )}
                  </button>
                ))}
              </div>
              {creacion.talleActivo && (
                <p className={`${mono.className} mt-1.5 text-[10px] text-black/40`}>
                  Editando colores del talle {creacion.talleActivo}
                </p>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {creacion.colores.map((color) => (
              <div key={color} className="flex items-center gap-1">
                <span
                  className="h-7 w-7 rounded-full border-2 border-black/20"
                  style={{ backgroundColor: color }}
                />
                <button
                  type="button"
                  onClick={() => creacion.eliminarColor(color)}
                  className="text-xs text-black/30 hover:text-black"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-16 md:grid-cols-16">
            {COLORES_PREDEFINIDOS.map((color) => {
              const seleccionado = creacion.colores.includes(color.hex);
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => {
                    if (seleccionado) {
                      creacion.eliminarColor(color.hex);
                    } else {
                      creacion.setColores((prev) => [...prev, color.hex]);
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
            onClick={() => creacion.setColores([])}
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
            {creacion.detalles.map((detalle) => (
              <div key={detalle} className="flex items-center gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-black" />
                <span className={`${body.className} flex-1 text-sm text-black/70`}>
                  {detalle}
                </span>
                <button
                  type="button"
                  onClick={() => creacion.eliminarDetalle(detalle)}
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
                value={creacion.nuevoDetalle}
                onChange={(e) => creacion.setNuevoDetalle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && creacion.agregarDetalle()}
                onBlur={creacion.agregarDetalle}
                className={`${mono.className} flex-1 border border-black/20 bg-transparent px-2 py-1 text-xs`}
              />
              <button
                type="button"
                onClick={creacion.agregarDetalle}
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
          value={creacion.stockUnidades}
          onChange={(e) => creacion.setStockUnidades(e.target.value)}
          readOnly={creacion.categoria === 'indumentaria'}
          className={`${mono.className} border border-black bg-transparent px-3 py-2 text-xs ${creacion.categoria === 'indumentaria' ? 'bg-black/5 cursor-not-allowed' : ''}`}
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
            onClick={creacion.handleSubmit}
            disabled={!creacion.formValido || creacion.subiendo || imagenes.convirtiendo}
            className={`${mono.className} border border-black bg-black px-8 py-3 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white`}
          >
            {imagenes.convirtiendo ? 'Convirtiendo...' : creacion.subiendo ? 'Subiendo...' : 'Subir producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
