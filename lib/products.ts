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
  indumentaria: [],
  tecnologia: [],
  perfumeria: [],
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
  vistas?: number;
  imagenes?: string[];
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

export function getSubcategoriasCompletas(categoria: Categoria, productos: Producto[]): SubcategoriaOpcion[] {
  const defaults = SUBCATEGORIAS[categoria];
  const defaultsValues = new Set(defaults.map((d) => d.value));

  const extras = [...new Set(
    productos
      .filter((p) => p.categoria === categoria)
      .map((p) => p.subcategoria)
      .filter((s) => s && !defaultsValues.has(s))
  )];

  return [
    ...defaults,
    ...extras.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
  ];
}