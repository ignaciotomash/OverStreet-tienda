'use client';

import { useState, useCallback } from 'react';
import { type Producto } from '@/lib/products';
import { subirImagen } from '@/lib/upload';
import { updateProducto } from '@/app/actions/actions';
import { useProductFields, TALLES_DEFAULT } from './useProductFields';

interface UseEdicionFormParams {
  archivos: File[];
  existentes: string[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  mostrarMensaje: (tipo: 'exito' | 'error', texto: string) => void;
  onVolver: () => void;
}

export function useEdicionForm({
  archivos,
  existentes,
  setProductos,
  mostrarMensaje,
  onVolver,
}: UseEdicionFormParams) {
  const fields = useProductFields();
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const cargarProducto = useCallback((producto: Producto) => {
    setProductoSeleccionado(producto);
    fields.setCategoria(producto.categoria);
    fields.setSubcategoria(producto.subcategoria);
    fields.setNombre(producto.nombre);
    fields.setPrecio(producto.precioOriginal != null ? String(producto.precioOriginal) : String(producto.precio));
    fields.setEnOferta(producto.precioOriginal != null && producto.precioOriginal > producto.precio);
    fields.setPrecioOferta(producto.precioOriginal != null ? String(producto.precio) : '');
    fields.setDescripcion(producto.descripcion);
    fields.setDescripcionLarga(producto.descripcionLarga);
    fields.setTalles(producto.talles ?? TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })));
    fields.setColores(producto.colores ?? []);
    fields.setTalleActivo(null);
    fields.setDetalles(producto.detalles);
    fields.setStockUnidades(producto.stockUnidades != null ? String(producto.stockUnidades) : '');
    fields.setNuevoTalle('');
    fields.setNuevoDetalle('');
  }, [fields]);

  const formValido = useCallback(() => {
    if (existentes.length === 0 && archivos.length === 0) return false;
    if (!fields.nombre || !fields.precio || !fields.descripcion || !fields.descripcionLarga || fields.detalles.length === 0) return false;
    if (fields.categoria === 'indumentaria' && fields.talles.length === 0) return false;
    if (!fields.stockUnidades) return false;
    return true;
  }, [existentes, archivos, fields.nombre, fields.precio, fields.descripcion, fields.descripcionLarga, fields.detalles, fields.categoria, fields.talles, fields.stockUnidades]);

  const handleSubmit = useCallback(async () => {
    if (!formValido() || !productoSeleccionado) return;

    setSubiendo(true);

    try {
      const urlsNuevas = archivos.length > 0 ? await Promise.all(archivos.map((f) => subirImagen(f))) : [];
      const todasLasUrls = [...existentes, ...urlsNuevas];

      const tallesFinales = fields.talles.map((t) => {
        if (t.talle === fields.talleActivo) {
          return { ...t, colores: fields.colores.length > 0 ? fields.colores : undefined };
        }
        return t;
      });

      await updateProducto(productoSeleccionado.id, {
        nombre: fields.nombre,
        precio: fields.enOferta && fields.precioOferta ? Number(fields.precioOferta) : Number(fields.precio),
        precioOriginal: fields.enOferta && fields.precioOferta ? Number(fields.precio) : undefined,
        categoria: fields.categoria,
        subcategoria: fields.subcategoria,
        descripcion: fields.descripcion,
        descripcionLarga: fields.descripcionLarga,
        detalles: fields.detalles,
        talles: fields.categoria === 'indumentaria' ? tallesFinales : undefined,
        colores: fields.colores.length > 0 && !fields.talleActivo ? fields.colores : undefined,
        stockUnidades: Number(fields.stockUnidades),
        imagenes: todasLasUrls,
      });

      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoSeleccionado.id
            ? {
                ...p,
                nombre: fields.nombre,
                precio: fields.enOferta && fields.precioOferta ? Number(fields.precioOferta) : Number(fields.precio),
                precioOriginal: fields.enOferta && fields.precioOferta ? Number(fields.precio) : undefined,
                categoria: fields.categoria,
                subcategoria: fields.subcategoria,
                descripcion: fields.descripcion,
                descripcionLarga: fields.descripcionLarga,
                detalles: fields.detalles,
                talles: fields.categoria === 'indumentaria' ? tallesFinales : undefined,
                colores: fields.colores.length > 0 && !fields.talleActivo ? fields.colores : undefined,
                stockUnidades: Number(fields.stockUnidades),
                imagenes: todasLasUrls,
                foto: todasLasUrls[0],
              }
            : p,
        ),
      );

      mostrarMensaje('exito', 'Producto actualizado exitosamente');
      onVolver();
    } catch (error) {
      const texto = error instanceof Error ? error.message : 'Error al actualizar el producto';
      mostrarMensaje('error', texto);
    } finally {
      setSubiendo(false);
    }
  }, [
    formValido, productoSeleccionado, archivos, existentes, fields, setProductos, mostrarMensaje, onVolver,
  ]);

  return {
    productoSeleccionado,
    editCategoria: fields.categoria,
    setEditCategoria: fields.setCategoria,
    editSubcategoria: fields.subcategoria,
    setEditSubcategoria: fields.setSubcategoria,
    nombre: fields.nombre,
    setNombre: fields.setNombre,
    precio: fields.precio,
    setPrecio: fields.setPrecio,
    enOferta: fields.enOferta,
    setEnOferta: fields.setEnOferta,
    precioOferta: fields.precioOferta,
    setPrecioOferta: fields.setPrecioOferta,
    descripcion: fields.descripcion,
    setDescripcion: fields.setDescripcion,
    descripcionLarga: fields.descripcionLarga,
    setDescripcionLarga: fields.setDescripcionLarga,
    talles: fields.talles,
    setTalles: fields.setTalles,
    nuevoTalle: fields.nuevoTalle,
    setNuevoTalle: fields.setNuevoTalle,
    colores: fields.colores,
    setColores: fields.setColores,
    talleActivo: fields.talleActivo,
    detalles: fields.detalles,
    setDetalles: fields.setDetalles,
    nuevoDetalle: fields.nuevoDetalle,
    setNuevoDetalle: fields.setNuevoDetalle,
    stockUnidades: fields.stockUnidades,
    setStockUnidades: fields.setStockUnidades,
    subiendo,
    cargarProducto,
    toggleTalle: fields.toggleTalle,
    seleccionarTalleActivo: fields.seleccionarTalleActivo,
    actualizarStockTalle: fields.actualizarStockTalle,
    agregarTalle: fields.agregarTalle,
    eliminarTalle: fields.eliminarTalle,
    eliminarColor: fields.eliminarColor,
    agregarDetalle: fields.agregarDetalle,
    eliminarDetalle: fields.eliminarDetalle,
    formValido,
    handleSubmit,
  };
}
