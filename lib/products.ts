export type Categoria = 'indumentaria' | 'tecnologia' | 'perfumeria';

export interface Talle {
  talle: string;
  disponible: boolean;
  stock?: number;
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

export const COLORES_PREDEFINIDOS = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Gris Claro', hex: '#D9D9D9' },
  { nombre: 'Gris', hex: '#808080' },
  { nombre: 'Gris Oscuro', hex: '#4A4A4A' },
  { nombre: 'Azul Marino', hex: '#1B2A41' },
  { nombre: 'Azul', hex: '#2563EB' },
  { nombre: 'Celeste', hex: '#60A5FA' },
  { nombre: 'Azul Petróleo', hex: '#1F5C5C' },
  { nombre: 'Verde Militar', hex: '#556B2F' },
  { nombre: 'Verde Oliva', hex: '#708238' },
  { nombre: 'Verde', hex: '#22C55E' },
  { nombre: 'Verde Agua', hex: '#5EEAD4' },
  { nombre: 'Amarillo', hex: '#FACC15' },
  { nombre: 'Mostaza', hex: '#D4A017' },
  { nombre: 'Naranja', hex: '#F97316' },
  { nombre: 'Coral', hex: '#FB7185' },
  { nombre: 'Rojo', hex: '#DC2626' },
  { nombre: 'Bordó', hex: '#800020' },
  { nombre: 'Rosa', hex: '#EC4899' },
  { nombre: 'Fucsia', hex: '#C026D3' },
  { nombre: 'Violeta', hex: '#7C3AED' },
  { nombre: 'Lila', hex: '#C4B5FD' },
  { nombre: 'Marrón', hex: '#8B5A2B' },
  { nombre: 'Chocolate', hex: '#5C4033' },
  { nombre: 'Beige', hex: '#D6C2A1' },
  { nombre: 'Arena', hex: '#E5D3B3' },
  { nombre: 'Crema', hex: '#F8F4E3' },
  { nombre: 'Camel', hex: '#C19A6B' },
  { nombre: 'Caqui', hex: '#BDB76B' },
  { nombre: 'Turquesa', hex: '#40E0D0' },
  { nombre: 'Aqua', hex: '#00CFCF' },
];

export const COLORES_CLAROS = new Set(['#FFFFFF', '#D9D9D9', '#FACC15', '#5EEAD4', '#C4B5FD', '#F8F4E3', '#E5D3B3', '#D6C2A1', '#40E0D0', '#00CFCF', '#FB7185', '#60A5FA']);

export const colorA_nombre = (hex: string): string =>
  COLORES_PREDEFINIDOS.find((c) => c.hex === hex)?.nombre ?? hex;

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