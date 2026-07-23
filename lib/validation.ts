import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(200),
  precio: z.number().int().positive("El precio debe ser mayor a 0"),
  categoria: z.enum(["indumentaria", "tecnologia", "perfumeria"]),
  subcategoria: z.string().min(1).max(100),
  descripcion: z.string().min(1, "La descripción corta es obligatoria").max(300),
  descripcionLarga: z.string().min(1, "La descripción larga es obligatoria").max(5000),
  detalles: z.array(z.string()).min(1, "Agregá al menos un detalle"),
  talles: z
    .array(
      z.object({
        talle: z.string(),
        disponible: z.boolean(),
        stock: z.number().optional(),
      })
    )
    .optional(),
  colores: z.array(z.string()).optional(),
  stockUnidades: z.number().int().min(0, "El stock no puede ser negativo"),
  imagenes: z.array(z.string().min(1)).min(1, "Subí al menos una imagen"),
});

export type ProductoInput = z.infer<typeof productoSchema>;
