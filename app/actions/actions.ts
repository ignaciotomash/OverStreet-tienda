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
  stockUnidades: number | null;
  imagenes: unknown;
}): Producto {
  const imagenes = db.imagenes as string[];
  const talles = db.talles as { talle: string; disponible: boolean }[] | null;

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
    stockUnidades: db.stockUnidades ?? undefined,
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
