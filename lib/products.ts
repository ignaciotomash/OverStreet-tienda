export type Categoria = 'indumentaria' | 'tecnologia' | 'perfumeria';

export interface Talle {
  talle: string;
  disponible: boolean;
}

export interface SubcategoriaOpcion {
  value: string;
  label: string;
}

/** Subcategorías disponibles por categoría, en el orden en que se muestran los chips. */
export const SUBCATEGORIAS: Record<Categoria, SubcategoriaOpcion[]> = {
  indumentaria: [
    { value: 'remeras', label: 'Remeras' },
    { value: 'buzos', label: 'Buzos' },
    { value: 'camperas', label: 'Camperas' },
    { value: 'joggers', label: 'Joggers' },
  ],
  tecnologia: [
    { value: 'audio', label: 'Audio' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'accesorios', label: 'Accesorios' },
  ],
  perfumeria: [
    { value: 'todos', label: 'Todos' },
  ],
};

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: Categoria;
  subcategoria: string;
  descripcion: string;
  descripcionLarga: string;
  detalles: string[];
  talles?: Talle[];
  colores?: string[];
  stockUnidades?: number;
  foto?: string;
}

export const COLORES_MOCKUP = ['#000000', '#FFFFFF', '#C1272D', '#1E40AF'];

export const formatearPrecio = (valor: number) =>
  valor.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

export const getSubcategoriaLabel = (categoria: Categoria, subcategoria: string): string =>
  SUBCATEGORIAS[categoria].find((s) => s.value === subcategoria)?.label ?? subcategoria;