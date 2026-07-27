'use client';

import { useState, useEffect } from 'react';
import { getSubcategoriasCompletas, type Producto } from '@/lib/products';
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

  return (
    <FormularioCreacion
      creacion={creacion}
      imagenes={imagenes}
      toast={toast}
      subcategorias={subcategorias}
      subBase={subBase}
      productos={productos}
      subcatExtras={subcatExtras}
    />
  );
}
