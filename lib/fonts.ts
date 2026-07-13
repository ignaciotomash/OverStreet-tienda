import { Archivo_Black, Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Archivo Black -> display, grosor de cartel/tag industrial
 * Inter          -> texto de cuerpo, limpio y legible
 * JetBrains Mono -> precios, talles, stock -> voz de "etiqueta impresa"
 */
export const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

export const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});