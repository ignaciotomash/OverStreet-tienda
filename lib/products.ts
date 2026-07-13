export type Categoria = 'indumentaria' | 'tecnologia';

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
};

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: Categoria;
  /** Debe ser uno de los "value" definidos en SUBCATEGORIAS para esta categoría. */
  subcategoria: string;
  descripcion: string;
  /** Texto más largo para la página de detalle del producto. */
  descripcionLarga: string;
  /** Bullets cortos con características puntuales, para la página de detalle. */
  detalles: string[];
  talles?: Talle[];
  stockUnidades?: number;
  /**
   * Ruta de la foto real en /public, ej: '/productos/ind-01.jpg'.
   * Si no está definida, se muestra el placeholder gris "FOTO PENDIENTE".
   * Recomendado: foto cuadrada o 4:5, producto centrado sobre fondo
   * neutro, mínimo 1000x1000px.
   */
  foto?: string;
}

export const PRODUCTOS: Producto[] = [
  {
    id: 'ind-01',
    subcategoria: 'remeras',
    nombre: 'Remera Oversize Básica',
    precio: 14999,
    categoria: 'indumentaria',
    descripcion: 'Algodón peinado 24/1, calce oversize',
    descripcionLarga:
      'Remera de algodón peinado 24/1 con calce oversize, pensada tanto para uso diario como para reventa. Tela de buen gramaje que no se transparenta y mantiene la forma después de varios lavados.',
    detalles: ['Algodón peinado 24/1', 'Calce oversize unisex', 'Cuello reforzado', 'Colores sujetos a stock'],
    talles: [
      { talle: 'S', disponible: true },
      { talle: 'M', disponible: true },
      { talle: 'L', disponible: true },
      { talle: 'XL', disponible: false },
      { talle: 'XXL', disponible: true },
    ],
  },
  {
    id: 'ind-02',
    subcategoria: 'buzos',
    nombre: 'Buzo Canguro Frisado',
    precio: 27999,
    categoria: 'indumentaria',
    descripcion: 'Frisa interior, bolsillo canguro',
    descripcionLarga:
      'Buzo con frisa interior para los días fríos, bolsillo canguro delantero y puños elastizados que mantienen el calor. Un clásico que nunca falta en el catálogo.',
    detalles: ['Frisa interior', 'Bolsillo canguro', 'Puños y cintura elastizados', 'Capucha con cordón'],
    talles: [
      { talle: 'S', disponible: false },
      { talle: 'M', disponible: true },
      { talle: 'L', disponible: true },
      { talle: 'XL', disponible: true },
    ],
  },
  {
    id: 'ind-03',
    subcategoria: 'camperas',
    nombre: 'Campera Rompeviento',
    precio: 34999,
    categoria: 'indumentaria',
    descripcion: 'Impermeable liviana, capucha fija',
    descripcionLarga:
      'Campera liviana e impermeable, ideal para entretiempo. Capucha fija, cierre frontal reforzado y bolsillos con cierre para guardar lo esencial sin que se caiga nada.',
    detalles: ['Tela impermeable', 'Capucha fija', 'Bolsillos con cierre', 'Se guarda en su propio bolsillo'],
    talles: [
      { talle: 'M', disponible: true },
      { talle: 'L', disponible: true },
      { talle: 'XL', disponible: true },
    ],
  },
  {
    id: 'ind-04',
    subcategoria: 'joggers',
    nombre: 'Jogger Cargo',
    precio: 22999,
    categoria: 'indumentaria',
    descripcion: 'Puño en botamanga, bolsillos laterales',
    descripcionLarga:
      'Pantalón jogger con bolsillos cargo laterales y puño elastizado en la botamanga. Calce cómodo, ideal para uso diario o entrenamiento.',
    detalles: ['Bolsillos cargo laterales', 'Puño en botamanga', 'Cintura con cordón ajustable', 'Tela resistente'],
    talles: [
      { talle: 'S', disponible: true },
      { talle: 'M', disponible: false },
      { talle: 'L', disponible: true },
      { talle: 'XL', disponible: true },
    ],
  },
  {
    id: 'ind-05',
    subcategoria: 'remeras',
    nombre: 'Remera Estampada Street',
    precio: 16999,
    categoria: 'indumentaria',
    descripcion: 'Estampa frente y espalda',
    descripcionLarga:
      'Remera con estampa serigrafiada en frente y espalda, base de algodón suave. Pensada para quienes buscan algo con más personalidad que una remera lisa.',
    detalles: ['Estampa frente y espalda', 'Serigrafía de alta durabilidad', 'Algodón 100%', 'Calce regular'],
    talles: [
      { talle: 'S', disponible: true },
      { talle: 'M', disponible: true },
      { talle: 'L', disponible: false },
      { talle: 'XL', disponible: false },
    ],
  },
  {
    id: 'ind-06',
    subcategoria: 'buzos',
    nombre: 'Buzo Crewneck Liso',
    precio: 24999,
    categoria: 'indumentaria',
    descripcion: 'Cuello redondo, algodón pesado',
    descripcionLarga:
      'Buzo crewneck de algodón pesado, cuello redondo reforzado y corte recto. Una base sólida para combinar con cualquier outfit, sin estampas ni complicaciones.',
    detalles: ['Algodón pesado', 'Cuello redondo reforzado', 'Corte recto', 'Ideal para estampar por mayor'],
    talles: [
      { talle: 'S', disponible: true },
      { talle: 'M', disponible: true },
      { talle: 'L', disponible: true },
      { talle: 'XL', disponible: true },
    ],
  },
  {
    id: 'tec-01',
    subcategoria: 'audio',
    nombre: 'Auriculares Bluetooth TWS',
    precio: 18999,
    categoria: 'tecnologia',
    descripcion: 'Autonomía 20hs con estuche de carga',
    descripcionLarga:
      'Auriculares inalámbricos true wireless con estuche de carga incluido. Conexión Bluetooth estable y controles táctiles para música y llamadas sin sacar el celular del bolsillo.',
    detalles: ['Bluetooth 5.0', 'Autonomía 20hs con estuche', 'Controles táctiles', 'Resistentes al sudor'],
    stockUnidades: 12,
  },
  {
    id: 'tec-02',
    subcategoria: 'audio',
    nombre: 'Parlante Portátil 20W',
    precio: 29999,
    categoria: 'tecnologia',
    descripcion: 'Resistente a salpicaduras, BT 5.0',
    descripcionLarga:
      'Parlante portátil de 20W con buena respuesta de graves, resistente a salpicaduras. Batería para varias horas de uso continuo, ideal para juntadas al aire libre.',
    detalles: ['Potencia 20W', 'Resistente a salpicaduras (IPX)', 'Bluetooth 5.0', 'Batería de larga duración'],
    stockUnidades: 5,
  },
  {
    id: 'tec-03',
    subcategoria: 'wearables',
    nombre: 'Smartwatch Sport Pro',
    precio: 45999,
    categoria: 'tecnologia',
    descripcion: 'Monitor de ritmo cardíaco y GPS',
    descripcionLarga:
      'Smartwatch deportivo con monitor de ritmo cardíaco, GPS integrado y notificaciones del celular en la muñeca. Pantalla a color de buena visibilidad al aire libre.',
    detalles: ['Monitor de ritmo cardíaco', 'GPS integrado', 'Notificaciones del celular', 'Resistente al agua'],
    stockUnidades: 0,
  },
  {
    id: 'tec-04',
    subcategoria: 'accesorios',
    nombre: 'Cargador Rápido 33W',
    precio: 9999,
    categoria: 'tecnologia',
    descripcion: 'Carga rápida compatible multi-marca',
    descripcionLarga:
      'Cargador de pared de 33W con carga rápida, compatible con la mayoría de los celulares del mercado. Un básico que siempre se vende bien.',
    detalles: ['Potencia 33W', 'Compatible multi-marca', 'Protección contra sobrecarga', 'Cable no incluido'],
    stockUnidades: 30,
  },
  {
    id: 'tec-05',
    subcategoria: 'accesorios',
    nombre: 'Power Bank 10000mAh',
    precio: 16999,
    categoria: 'tecnologia',
    descripcion: 'Doble salida USB, carga rápida',
    descripcionLarga:
      'Batería portátil de 10000mAh con doble salida USB, para cargar dos dispositivos a la vez. Tamaño compacto, entra cómodo en cualquier mochila o cartera.',
    detalles: ['Capacidad 10000mAh', 'Doble salida USB', 'Carga rápida', 'Indicador de batería LED'],
    stockUnidades: 8,
  },
  {
    id: 'tec-06',
    subcategoria: 'accesorios',
    nombre: 'Mouse Inalámbrico Silencioso',
    precio: 8999,
    categoria: 'tecnologia',
    descripcion: 'Click silencioso, batería de larga duración',
    descripcionLarga:
      'Mouse inalámbrico con click silencioso, ideal para oficina o estudio. Sensor óptico preciso y batería de larga duración con un solo pilón AA.',
    detalles: ['Click silencioso', 'Sensor óptico preciso', 'Conexión inalámbrica 2.4GHz', 'Batería de larga duración'],
    stockUnidades: 20,
  },
];

export const formatearPrecio = (valor: number) =>
  valor.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

export const getProductoPorId = (id: string): Producto | undefined =>
  PRODUCTOS.find((p) => p.id === id);

export const getSubcategoriaLabel = (categoria: Categoria, subcategoria: string): string =>
  SUBCATEGORIAS[categoria].find((s) => s.value === subcategoria)?.label ?? subcategoria;