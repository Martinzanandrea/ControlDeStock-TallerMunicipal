/**
 * Ejemplo de tipo alternativo usado en alguna vista/ejemplo.
 * En la app real usamos `interface.ts` con las formas completas
 * tal como las devuelve el backend. Mantengo este archivo como
 * referencia simple y desacoplada.
 */
export interface Producto {
  idProducto: number;
  nombre: string;
  // Agrega aquí otras propiedades que devuelva tu API, por ejemplo:
  // precio?: number;
  // stock?: number;
}
