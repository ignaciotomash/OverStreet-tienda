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

  const handleVolver = useCallback(() => {
    setPaso('seleccion');
    imagenes.limpiar();
  }, [imagenes]);

  const editSubBase = getSubcategoriasCompletas(edicion.editCategoria, productos);
  const editSubcategorias = subcatExtras.obtenerSubcategorias(edicion.editCategoria, productos);

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
      edicion={edicion}
      imagenes={imagenes}
      toast={toast}
      editSubcategorias={editSubcategorias}
      editSubBase={editSubBase}
      productos={productos}
      subcatExtras={subcatExtras}
      onVolver={handleVolver}
    />
  );
}
