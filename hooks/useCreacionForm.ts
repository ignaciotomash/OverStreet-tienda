'use client';

import { useState, useMemo, useCallback } from 'react';
import { subirImagen } from '@/lib/upload';
import { createProducto } from '@/app/actions/actions';
import { useProductFields } from './useProductFields';

interface UseCreacionFormParams {
  archivos: File[];
  mostrarMensaje: (tipo: 'exito' | 'error', texto: string) => void;
}

export function useCreacionForm({ archivos, mostrarMensaje }: UseCreacionFormParams) {
  const fields = useProductFields();
  const [subiendo, setSubiendo] = useState(false);

  const formValido = useMemo(() => {
    if (archivos.length === 0) return false;
    if (!fields.nombre || !fields.precio || !fields.descripcion || !fields.descripcionLarga || fields.detalles.length === 0) return false;
    if (fields.categoria === 'indumentaria' && fields.talles.length === 0) return false;
    if (!fields.stockUnidades) return false;
    return true;
  }, [archivos, fields.nombre, fields.precio, fields.descripcion, fields.descripcionLarga, fields.detalles, fields.categoria, fields.talles, fields.stockUnidades]);

  const handleSubmit = useCallback(async () => {
    if (!formValido || archivos.length === 0) return;

    setSubiendo(true);

    try {
      const urls = await Promise.all(archivos.map((f) => subirImagen(f)));

      const tallesFinales = fields.talles.map((t) => {
        if (t.talle === fields.talleActivo) {
          return { ...t, colores: fields.colores.length > 0 ? fields.colores : undefined };
        }
        return t;
      });

      await createProducto({
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
        imagenes: urls,
      });

      mostrarMensaje('exito', 'Producto creado exitosamente');
      fields.limpiarCampos();
    } catch (error) {
      const texto = error instanceof Error ? error.message : 'Error al crear el producto';
      mostrarMensaje('error', texto);
    } finally {
      setSubiendo(false);
    }
  }, [formValido, archivos, fields, mostrarMensaje]);

  const resetFormulario = useCallback(() => {
    fields.limpiarCampos();
  }, [fields]);

  return {
    ...fields,
    subiendo,
    formValido,
    handleSubmit,
    resetFormulario,
  };
}
