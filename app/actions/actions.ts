"use server";

import { prisma } from "@/lib/prisma";
import type { Producto, Categoria } from "@/lib/products";

function mapProducto(db: {
  id: string;
  nombre: string;
  precio: number;
  categoria: "indumentaria" | "tecnologia" | "perfumeria";
  subcategoria: string;
  descripcion: string;
  descripcionLarga: string;
  detalles: unknown;
  talles: unknown;
  colores: unknown;
  stockUnidades: number | null;
  vistas: number;
  imagenes: unknown;
}): Producto {
  const imagenes = db.imagenes as string[];
  const talles = db.talles as { talle: string; disponible: boolean }[] | null;
  const colores = db.colores as string[] | null;

  return {
    id: db.id,
    nombre: db.nombre,
    precio: db.precio,
    categoria: db.categoria as Categoria,
    subcategoria: db.subcategoria,
    descripcion: db.descripcion,
    descripcionLarga: db.descripcionLarga,
    detalles: db.detalles as string[],
    talles: talles ?? undefined,
    colores: colores ?? undefined,
    stockUnidades: db.stockUnidades ?? undefined,
    vistas: db.vistas,
    imagenes: imagenes,
    foto: imagenes.length > 0 ? imagenes[0] : undefined,
  };
}

export async function getProductos(): Promise<Producto[]> {
  const productos = await prisma.producto.findMany({
    orderBy: { creadoEn: "desc" },
  });
  return productos.map(mapProducto);
}

export async function getProductosPorCategoria(
  categoria: Categoria
): Promise<Producto[]> {
  const productos = await prisma.producto.findMany({
    where: { categoria },
    orderBy: { creadoEn: "desc" },
  });
  return productos.map(mapProducto);
}

export async function getProductoPorId(id: string): Promise<Producto | null> {
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) return null;
  return mapProducto(producto);
}

export async function createProducto(data: {
  nombre: string;
  precio: number;
  categoria: Categoria;
  subcategoria: string;
  descripcion: string;
  descripcionLarga: string;
  detalles: string[];
  talles?: { talle: string; disponible: boolean }[];
  colores?: string[];
  stockUnidades?: number;
  imagenes: string[];
}) {
  const prefix = data.categoria === 'indumentaria' ? 'ind' : data.categoria === 'tecnologia' ? 'tec' : 'perf';
  const id = `${prefix}-${Date.now()}`;

  const producto = await prisma.producto.create({
    data: {
      id,
      nombre: data.nombre,
      precio: data.precio,
      categoria: data.categoria,
      subcategoria: data.subcategoria,
      descripcion: data.descripcion,
      descripcionLarga: data.descripcionLarga,
      detalles: data.detalles,
      talles: data.talles ?? undefined,
      colores: data.colores ?? undefined,
      stockUnidades: data.stockUnidades ?? undefined,
      imagenes: data.imagenes,
    },
  });

  return { success: true, producto: mapProducto(producto) };
}

export async function deleteProducto(id: string) {
  await prisma.producto.delete({ where: { id } });
  return { success: true };
}

export async function updateProducto(
  id: string,
  data: {
    nombre: string;
    precio: number;
    categoria: Categoria;
    subcategoria: string;
    descripcion: string;
    descripcionLarga: string;
    detalles: string[];
    talles?: { talle: string; disponible: boolean }[];
    colores?: string[];
    stockUnidades?: number;
    imagenes: string[];
  }
) {
  const producto = await prisma.producto.update({
    where: { id },
    data: {
      nombre: data.nombre,
      precio: data.precio,
      categoria: data.categoria,
      subcategoria: data.subcategoria,
      descripcion: data.descripcion,
      descripcionLarga: data.descripcionLarga,
      detalles: data.detalles,
      talles: data.talles ?? undefined,
      colores: data.colores ?? undefined,
      stockUnidades: data.stockUnidades ?? undefined,
      imagenes: data.imagenes,
    },
  });

  return { success: true, producto: mapProducto(producto) };
}

export async function incrementarVistas(id: string) {
  await prisma.producto.update({
    where: { id },
    data: { vistas: { increment: 1 } },
  });
}
