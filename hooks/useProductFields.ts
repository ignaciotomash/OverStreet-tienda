'use client';

import { useState, useMemo, useCallback } from 'react';
import { type Categoria, type Talle } from '@/lib/products';

export const TALLES_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];

export function useProductFields(categoriaInicial: Categoria = 'indumentaria', subcatInicial = 'remeras') {
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);
  const [subcategoria, setSubcategoria] = useState(subcatInicial);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [enOferta, setEnOferta] = useState(false);
  const [precioOferta, setPrecioOferta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [talles, setTalles] = useState<Talle[]>(
    TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })),
  );
  const [nuevoTalle, setNuevoTalle] = useState('');
  const [colores, setColores] = useState<string[]>([]);
  const [talleActivo, setTalleActivo] = useState<string | null>(null);
  const [detalles, setDetalles] = useState<string[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState('');
  const [stockUnidadesManual, setStockUnidadesManual] = useState('');

  const stockUnidades = useMemo(() => {
    if (categoria === 'indumentaria') {
      const total = talles.reduce((sum, t) => sum + (t.stock ?? 0), 0);
      return total > 0 ? String(total) : '';
    }
    return stockUnidadesManual;
  }, [categoria, talles, stockUnidadesManual]);

  const toggleTalle = useCallback((talle: string) => {
    setTalles((prev) =>
      prev.map((t) =>
        t.talle === talle ? { ...t, disponible: !t.disponible } : t,
      ),
    );
  }, []);

  const seleccionarTalleActivo = useCallback((talle: string) => {
    setTalles((prev) =>
      prev.map((t) => {
        if (t.talle === talleActivo) {
          return { ...t, colores: colores.length > 0 ? colores : undefined };
        }
        return t;
      }),
    );

    if (talle === talleActivo) {
      setTalleActivo(null);
      setColores([]);
      return;
    }

    setTalleActivo(talle);
    const talleObj = talles.find((t) => t.talle === talle);
    setColores(talleObj?.colores ?? []);
  }, [talleActivo, colores, talles]);

  const actualizarStockTalle = useCallback((talle: string, stock: string) => {
    const valor = stock === '' ? undefined : Number(stock);
    setTalles((prev) =>
      prev.map((t) =>
        t.talle === talle
          ? { ...t, stock: valor, disponible: valor === undefined ? t.disponible : valor > 0 }
          : t,
      ),
    );
  }, []);

  const agregarTalle = useCallback(() => {
    if (nuevoTalle && !talles.find((t) => t.talle === nuevoTalle)) {
      setTalles((prev) => [...prev, { talle: nuevoTalle, disponible: true }]);
      setNuevoTalle('');
    }
  }, [nuevoTalle, talles]);

  const eliminarTalle = useCallback((talle: string) => {
    setTalles((prev) => prev.filter((t) => t.talle !== talle));
  }, []);

  const eliminarColor = useCallback((color: string) => {
    setColores((prev) => prev.filter((c) => c !== color));
  }, []);

  const agregarDetalle = useCallback(() => {
    if (nuevoDetalle && !detalles.includes(nuevoDetalle)) {
      setDetalles((prev) => [...prev, nuevoDetalle]);
      setNuevoDetalle('');
    }
  }, [nuevoDetalle, detalles]);

  const eliminarDetalle = useCallback((detalle: string) => {
    setDetalles((prev) => prev.filter((d) => d !== detalle));
  }, []);

  const limpiarCampos = useCallback(() => {
    setCategoria(categoriaInicial);
    setSubcategoria(subcatInicial);
    setNombre('');
    setPrecio('');
    setEnOferta(false);
    setPrecioOferta('');
    setDescripcion('');
    setDescripcionLarga('');
    setTalles(TALLES_DEFAULT.map((t) => ({ talle: t, disponible: true })));
    setNuevoTalle('');
    setColores([]);
    setTalleActivo(null);
    setDetalles([]);
    setNuevoDetalle('');
    setStockUnidadesManual('');
  }, [categoriaInicial, subcatInicial]);

  return {
    categoria,
    setCategoria,
    subcategoria,
    setSubcategoria,
    nombre,
    setNombre,
    precio,
    setPrecio,
    enOferta,
    setEnOferta,
    precioOferta,
    setPrecioOferta,
    descripcion,
    setDescripcion,
    descripcionLarga,
    setDescripcionLarga,
    talles,
    setTalles,
    nuevoTalle,
    setNuevoTalle,
    colores,
    setColores,
    talleActivo,
    setTalleActivo,
    detalles,
    setDetalles,
    nuevoDetalle,
    setNuevoDetalle,
    stockUnidades,
    setStockUnidades: setStockUnidadesManual,
    toggleTalle,
    seleccionarTalleActivo,
    actualizarStockTalle,
    agregarTalle,
    eliminarTalle,
    eliminarColor,
    agregarDetalle,
    eliminarDetalle,
    limpiarCampos,
  };
}
