-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('indumentaria', 'tecnologia');

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
    "stock_unidades" INTEGER,
    "imagenes" JSONB NOT NULL DEFAULT '[]',
    "agotado" BOOLEAN NOT NULL DEFAULT false,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_items" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "talle" TEXT NOT NULL DEFAULT '',
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrito_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carrito_items_usuario_id_producto_id_talle_key" ON "carrito_items"("usuario_id", "producto_id", "talle");

-- AddForeignKey
ALTER TABLE "carrito_items" ADD CONSTRAINT "carrito_items_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
