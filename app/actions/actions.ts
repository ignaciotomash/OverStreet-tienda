"use server";

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { productoSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import type { Producto, Categoria } from "@/lib/products";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined;
  if (metadata?.role !== "admin") {
    throw new Error("No autorizado");
  }
}

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
  const talles = db.talles as { talle: string; disponible: boolean; stock?: number }[] | null;
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
  talles?: { talle: string; disponible: boolean; stock?: number }[];
  colores?: string[];
  stockUnidades?: number;
  imagenes: string[];
}) {
  await requireAdmin();
  const parsed = productoSchema.parse(data);

  const prefix = parsed.categoria === 'indumentaria' ? 'ind' : parsed.categoria === 'tecnologia' ? 'tec' : 'perf';
  const id = `${prefix}-${Date.now()}`;

  const producto = await prisma.producto.create({
    data: {
      id,
      nombre: parsed.nombre,
      precio: parsed.precio,
      categoria: parsed.categoria,
      subcategoria: parsed.subcategoria,
      descripcion: parsed.descripcion,
      descripcionLarga: parsed.descripcionLarga,
      detalles: parsed.detalles,
      talles: parsed.talles ?? undefined,
      colores: parsed.colores ?? undefined,
      stockUnidades: parsed.stockUnidades ?? undefined,
      imagenes: parsed.imagenes,
    },
  });

  return { success: true, producto: mapProducto(producto) };
}

export async function deleteProducto(id: string) {
  await requireAdmin();
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
    talles?: { talle: string; disponible: boolean; stock?: number }[];
    colores?: string[];
    stockUnidades?: number;
    imagenes: string[];
  }
) {
  await requireAdmin();
  const parsed = productoSchema.parse(data);

  const producto = await prisma.producto.update({
    where: { id },
    data: {
      nombre: parsed.nombre,
      precio: parsed.precio,
      categoria: parsed.categoria,
      subcategoria: parsed.subcategoria,
      descripcion: parsed.descripcion,
      descripcionLarga: parsed.descripcionLarga,
      detalles: parsed.detalles,
      talles: parsed.talles ?? undefined,
      colores: parsed.colores ?? undefined,
      stockUnidades: parsed.stockUnidades ?? undefined,
      imagenes: parsed.imagenes,
    },
  });

  return { success: true, producto: mapProducto(producto) };
}

export async function descontarStock(
  items: { productoId: string; cantidad: number; talle?: string }[]
) {
  for (const item of items) {
    const producto = await prisma.producto.findUnique({ where: { id: item.productoId } });
    if (!producto) continue;

    if (item.talle && Array.isArray(producto.talles)) {
      const talles = producto.talles as { talle: string; disponible: boolean; stock?: number }[];
      const idx = talles.findIndex((t) => t.talle === item.talle);
      if (idx !== -1 && talles[idx].stock != null) {
        talles[idx].stock = Math.max(0, (talles[idx].stock ?? 0) - item.cantidad);
        if (talles[idx].stock === 0) talles[idx].disponible = false;
        await prisma.producto.update({
          where: { id: item.productoId },
          data: { talles },
        });
        continue;
      }
    }

    if (producto.stockUnidades != null) {
      const nuevoStock = Math.max(0, producto.stockUnidades - item.cantidad);
      await prisma.producto.update({
        where: { id: item.productoId },
        data: {
          stockUnidades: nuevoStock,
          agotado: nuevoStock === 0,
        },
      });
    }
  }

  return { success: true };
}

export async function incrementarVistas(id: string) {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown";
  if (isRateLimited(`views:${id}:${ip}`)) return;

  await prisma.producto.update({
    where: { id },
    data: { vistas: { increment: 1 } },
  });
}
