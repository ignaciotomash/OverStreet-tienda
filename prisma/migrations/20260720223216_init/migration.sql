-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('indumentaria', 'tecnologia', 'perfumeria');

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "subcategoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcion_larga" TEXT NOT NULL,
    "detalles" JSONB NOT NULL,
    "talles" JSONB,
    "colores" JSONB,
    "stock_unidades" INTEGER,
    "imagenes" JSONB NOT NULL DEFAULT '[]',
    "agotado" BOOLEAN NOT NULL DEFAULT false,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);
