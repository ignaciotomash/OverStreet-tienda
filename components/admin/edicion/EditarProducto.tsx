'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSubcategoriasCompletas, type Categoria, type Producto } from '@/lib/products';
import { getProductos } from '@/app/actions/actions';
import { useMensajeToast } from '@/hooks/useMensajeToast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useSubcatExtras } from '@/hooks/useSubcatExtras';
import { useEdicionForm } from '@/hooks/useEdicionForm';
import ListaProductos from './ListaProductos';
import FormularioEdicion from './FormularioEdicion';

const TODOS = 'todos';
type Paso = 'seleccion' | 'edicion';

const TALLES_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];

export default function EditarProducto() {
  const [paso, setPaso] = useState<Paso>('seleccion');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState<Categoria>('indumentaria');
  const [subcategoria, setSubcategoria] = useState(TODOS);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  const toast = useMensajeToast();
  const imagenes = useImageUpload(toast.mostrarMensaje);
  const subcatExtras = useSubcatExtras();
  const edicion = useEdicionForm({
    archivos: imagenes.archivos,
    existentes: imagenes.existentes,
    setProductos,
    mostrarMensaje: toast.mostrarMensaje,
    onVolver: () => {
      setPaso('seleccion');
      imagenes.limpiar();
    },
  });

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

  const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const busquedaNorm = normalizar(busqueda);
  const productosFiltrados = productos.filter(
    (p) =>
      p.categoria === categoria &&
      (subcategoria === TODOS || p.subcategoria === subcategoria) &&
      (busquedaNorm === '' || normalizar(p.nombre).includes(busquedaNorm)),
  );

  const seleccionarProducto = useCallback((producto: Producto) => {
    edicion.cargarProducto(producto);
    imagenes.cargarExistentes(
      producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes
        : (producto.foto ? [producto.foto] : []),
    );
    setPaso('edicion');
  }, [edicion, imagenes]);

  const handleCategoriaEditChange = useCallback((cat: Categoria) => {
    edicion.setEditCategoria(cat);
    const base = getSubcategoriasCompletas(cat, productos);
    edicion.setEditSubcategoria(base[0]?.value ?? '');
  }, [edicion, productos]);

  const eliminarSubcatExtraEdit = useCallback(() => {
    const result = subcatExtras.eliminarSubcatExtra(
      edicion.editCategoria,
      edicion.editSubcategoria,
      productos,
    );
    if (result !== null) {
      edicion.setEditSubcategoria(result);
    }
  }, [subcatExtras, edicion, productos]);

  const editSubBase = getSubcategoriasCompletas(edicion.editCategoria, productos);
  const editSubcategorias = subcatExtras.obtenerSubcategorias(edicion.editCategoria, productos);

  const imagenProps = {
    existentes: imagenes.existentes,
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

  if (paso === 'seleccion') {
    return (
      <ListaProductos
        cargando={cargando}
        categoria={categoria}
        subcategoria={subcategoria}
        busqueda={busqueda}
        productosFiltrados={productosFiltrados}
        subcategorias={subcatExtras.obtenerSubcategorias(categoria, productos)}
        mensaje={toast.mensaje}
        visible={toast.visible}
        onCategoriaChange={setCategoria}
        onSubcategoriaChange={setSubcategoria}
        onBusquedaChange={setBusqueda}
        onSeleccionar={seleccionarProducto}
      />
    );
  }

  return (
    <FormularioEdicion
      editCategoria={edicion.editCategoria}
      editSubcategoria={edicion.editSubcategoria}
      nombre={edicion.nombre}
      precio={edicion.precio}
      enOferta={edicion.enOferta}
      precioOferta={edicion.precioOferta}
      descripcion={edicion.descripcion}
      descripcionLarga={edicion.descripcionLarga}
      talles={edicion.talles}
      nuevoTalle={edicion.nuevoTalle}
      colores={edicion.colores}
      talleActivo={edicion.talleActivo}
      detalles={edicion.detalles}
      nuevoDetalle={edicion.nuevoDetalle}
      stockUnidades={edicion.stockUnidades}
      editSubcategorias={editSubcategorias}
      editSubBase={editSubBase}
      productos={productos}
      formValido={edicion.formValido()}
      subiendo={edicion.subiendo}
      convirtiendo={imagenes.convirtiendo}
      onVolver={() => {
        setPaso('seleccion');
        imagenes.limpiar();
      }}
      onCategoriaChange={handleCategoriaEditChange}
      onSubcategoriaChange={edicion.setEditSubcategoria}
      onNombreChange={edicion.setNombre}
      onPrecioChange={edicion.setPrecio}
      onEnOfertaChange={edicion.setEnOferta}
      onPrecioOfertaChange={edicion.setPrecioOferta}
      onDescripcionChange={edicion.setDescripcion}
      onDescripcionLargaChange={edicion.setDescripcionLarga}
      onToggleTalle={edicion.toggleTalle}
      onNuevoTalleChange={edicion.setNuevoTalle}
      onAgregarTalle={edicion.agregarTalle}
      onEliminarTalle={edicion.eliminarTalle}
      onActualizarStockTalle={edicion.actualizarStockTalle}
      onSeleccionarTalleActivo={edicion.seleccionarTalleActivo}
      onEliminarColor={edicion.eliminarColor}
      onColoresChange={edicion.setColores}
      onLimpiarTalles={() => edicion.setTalles(TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })))}
      onAgregarDetalle={edicion.agregarDetalle}
      onEliminarDetalle={edicion.eliminarDetalle}
      onNuevoDetalleChange={edicion.setNuevoDetalle}
      onStockUnidadesChange={edicion.setStockUnidades}
      onEliminarSubcatExtra={eliminarSubcatExtraEdit}
      onSubmit={edicion.handleSubmit}
      mensaje={toast.mensaje}
      visible={toast.visible}
      imagenProps={imagenProps}
    />
  );
}
