'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSubcategoriasCompletas, type Categoria, type Producto } from '@/lib/products';
import { getProductos } from '@/app/actions/actions';
import { useMensajeToast } from '@/hooks/useMensajeToast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useSubcatExtras } from '@/hooks/useSubcatExtras';
import { useCreacionForm } from '@/hooks/useCreacionForm';
import FormularioCreacion from './FormularioCreacion';

export default function CrearProducto() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const toast = useMensajeToast();
  const imagenes = useImageUpload(toast.mostrarMensaje);
  const subcatExtras = useSubcatExtras();
  const creacion = useCreacionForm({ archivos: imagenes.archivos, mostrarMensaje: toast.mostrarMensaje });

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  const subBase = getSubcategoriasCompletas(creacion.categoria, productos);
  const subcategorias = subcatExtras.obtenerSubcategorias(creacion.categoria, productos);

  const handleCategoriaChange = useCallback((cat: Categoria) => {
    creacion.setCategoria(cat);
    const base = getSubcategoriasCompletas(cat, productos);
    const extras = subcatExtras.subcatExtras[cat].filter((extra) => !base.find((s) => s.value === extra.value));
    creacion.setSubcategoria([...base, ...extras][0]?.value ?? '');
  }, [creacion, productos, subcatExtras]);

  const eliminarSubcatExtra = useCallback(() => {
    const result = subcatExtras.eliminarSubcatExtra(
      creacion.categoria,
      creacion.subcategoria,
      productos,
    );
    if (result !== null) {
      creacion.setSubcategoria(result);
    }
  }, [subcatExtras, creacion, productos]);

  const imagenProps = {
    existentes: [],
    previews: imagenes.previews,
    arrastrando: imagenes.arrastrando,
    convirtiendo: imagenes.convirtiendo,
    fileInputRef: imagenes.fileInputRef,
    onDragOver: imagenes.handleDragOver,
    onDragLeave: imagenes.handleDragLeave,
    onDrop: imagenes.handleDrop,
    onFileChange: imagenes.handleFileChange,
    onEliminarExistente: imagenes.eliminarExistente,
    onEliminarArchivo: imagenes.eliminarArchivo,
  };

  return (
    <FormularioCreacion
      categoria={creacion.categoria}
      subcategoria={creacion.subcategoria}
      nombre={creacion.nombre}
      precio={creacion.precio}
      enOferta={creacion.enOferta}
      precioOferta={creacion.precioOferta}
      descripcion={creacion.descripcion}
      descripcionLarga={creacion.descripcionLarga}
      talles={creacion.talles}
      nuevoTalle={creacion.nuevoTalle}
      colores={creacion.colores}
      talleActivo={creacion.talleActivo}
      detalles={creacion.detalles}
      nuevoDetalle={creacion.nuevoDetalle}
      stockUnidades={creacion.stockUnidades}
      subcategorias={subcategorias}
      subBase={subBase}
      productos={productos}
      formValido={creacion.formValido()}
      subiendo={creacion.subiendo}
      convirtiendo={imagenes.convirtiendo}
      onCategoriaChange={handleCategoriaChange}
      onSubcategoriaChange={creacion.setSubcategoria}
      onNombreChange={creacion.setNombre}
      onPrecioChange={creacion.setPrecio}
      onEnOfertaChange={creacion.setEnOferta}
      onPrecioOfertaChange={creacion.setPrecioOferta}
      onDescripcionChange={creacion.setDescripcion}
      onDescripcionLargaChange={creacion.setDescripcionLarga}
      onToggleTalle={creacion.toggleTalle}
      onNuevoTalleChange={creacion.setNuevoTalle}
      onAgregarTalle={creacion.agregarTalle}
      onEliminarTalle={creacion.eliminarTalle}
      onActualizarStockTalle={creacion.actualizarStockTalle}
      onSeleccionarTalleActivo={creacion.seleccionarTalleActivo}
      onEliminarColor={creacion.eliminarColor}
      onColoresChange={creacion.setColores}
      onLimpiarTalles={() => creacion.setTalles(['S', 'M', 'L', 'XL', 'XXL'].map((t) => ({ talle: t, disponible: true })))}
      onAgregarDetalle={creacion.agregarDetalle}
      onEliminarDetalle={creacion.eliminarDetalle}
      onNuevoDetalleChange={creacion.setNuevoDetalle}
      onStockUnidadesChange={creacion.setStockUnidades}
      onEliminarSubcatExtra={eliminarSubcatExtra}
      onAgregarSubcat={subcatExtras.agregarSubcat}
      onSubmit={creacion.handleSubmit}
      mensaje={toast.mensaje}
      visible={toast.visible}
      imagenProps={imagenProps}
    />
  );
}
