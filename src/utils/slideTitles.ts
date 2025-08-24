// Mapping of WordPress post IDs to slide titles
export const slideTitles: Record<number, string> = {
  16972: "MAPA",        // Mapa
  12978: "CALENDARIO",  // Calendario  
  11777: "ORIENTACIÓN", // Orientación
  11783: "HUÉSPEDES",   // Huéspedes
  14850: "ORGANIZADORXS", // Organizadorxs (retiros)
  11780: "ARTISTAS",    // Artistas
  19917: "MEDITADORES", // Meditadores
  11789: "NOSOTRXS",    // Nosotrxs (About/drone)
  11771: "GALERÍA",     // Galería
  11766: "CONTEXTO",    // Contexto (historia)
  18978: "RESTAURANTE", // Restaurante
  18971: "CONTRIBUIR"   // Contribuir
};

export function getSlideTitleById(postId: number): string {
  return slideTitles[postId] || "CAMP";
}
