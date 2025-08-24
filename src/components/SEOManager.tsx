'use client';

import { useEffect } from 'react';
import { ProcessedPost } from '@/types/wordpress';

interface SEOManagerProps {
  posts: ProcessedPost[];
  currentSlideIndex: number;
  isCardOpen: boolean;
}

// SEO data mapping for each post ID
const seoData: Record<number, {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}> = {
  16972: {
    title: 'Mapa - CAMP MX',
    description: 'Explora el mapa interactivo de CAMP MX y descubre todas las instalaciones y actividades disponibles.',
    keywords: 'mapa, ubicación, instalaciones, CAMP MX',
    ogImage: 'https://camp.mx/wp-content/uploads/mapa_escrit.webp'
  },
  12978: {
    title: 'Calendario - CAMP MX',
    description: 'Consulta el calendario de eventos y actividades de CAMP MX.',
    keywords: 'calendario, eventos, actividades, fechas, CAMP MX'
  },
  11777: {
    title: 'Orientación - CAMP MX',
    description: 'Información sobre la orientación y guías para nuevos visitantes de CAMP MX.',
    keywords: 'orientación, guía, información, visitantes, CAMP MX'
  },
  11783: {
    title: 'Huéspedes - CAMP MX',
    description: 'Información para huéspedes y alojamiento en CAMP MX.',
    keywords: 'huéspedes, alojamiento, hospedaje, CAMP MX'
  },
  14850: {
    title: 'Organizadores - CAMP MX',
    description: 'Conoce al equipo organizador de CAMP MX.',
    keywords: 'organizadores, equipo, staff, CAMP MX'
  },
  11780: {
    title: 'Artistas - CAMP MX',
    description: 'Descubre los artistas que participan en CAMP MX.',
    keywords: 'artistas, música, arte, espectáculos, CAMP MX'
  },
  19917: {
    title: 'Meditadores - CAMP MX',
    description: 'Información sobre las sesiones de meditación en CAMP MX.',
    keywords: 'meditación, mindfulness, bienestar, CAMP MX'
  },
  11789: {
    title: 'Nosotros - CAMP MX',
    description: 'Conoce más sobre CAMP MX, nuestra misión y valores.',
    keywords: 'sobre nosotros, misión, valores, CAMP MX'
  },
  11771: {
    title: 'Galería - CAMP MX',
    description: 'Explora la galería de fotos y videos de CAMP MX.',
    keywords: 'galería, fotos, videos, imágenes, CAMP MX'
  },
  11766: {
    title: 'Contexto - CAMP MX',
    description: 'Comprende el contexto y la historia detrás de CAMP MX.',
    keywords: 'contexto, historia, background, CAMP MX'
  },
  18978: {
    title: 'Restaurante - CAMP MX',
    description: 'Descubre las opciones gastronómicas en el restaurante de CAMP MX.',
    keywords: 'restaurante, comida, gastronomía, menú, CAMP MX'
  },
  18971: {
    title: 'Contribuir - CAMP MX',
    description: 'Aprende cómo puedes contribuir y apoyar a CAMP MX.',
    keywords: 'contribuir, donar, apoyar, colaborar, CAMP MX'
  }
};

export default function SEOManager({ posts, currentSlideIndex, isCardOpen }: SEOManagerProps) {
  useEffect(() => {
    const currentPost = posts[currentSlideIndex];
    if (!currentPost) return;

    const currentSEO = seoData[currentPost.id];
    if (!currentSEO) return;

    // Update document title
    document.title = isCardOpen 
      ? `${currentSEO.title} - Contenido Detallado`
      : currentSEO.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', currentSEO.description);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = currentSEO.description;
      document.head.appendChild(newMetaDescription);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', currentSEO.keywords);
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = currentSEO.keywords;
      document.head.appendChild(newMetaKeywords);
    }

    // Update Open Graph meta tags
    const updateOGMeta = (property: string, content: string) => {
      const existing = document.querySelector(`meta[property="${property}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', property);
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
      }
    };

    updateOGMeta('og:title', currentSEO.title);
    updateOGMeta('og:description', currentSEO.description);
    updateOGMeta('og:type', 'website');
    updateOGMeta('og:url', `${window.location.origin}#slide-${currentPost.id}`);
    
    if (currentSEO.ogImage) {
      updateOGMeta('og:image', currentSEO.ogImage);
    } else if (currentPost.featureImage) {
      updateOGMeta('og:image', currentPost.featureImage);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = `${window.location.origin}#slide-${currentPost.id}`;
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      const newCanonical = document.createElement('link');
      newCanonical.rel = 'canonical';
      newCanonical.href = canonicalUrl;
      document.head.appendChild(newCanonical);
    }

    // Update URL hash for better navigation
    if (window.location.hash !== `#slide-${currentPost.id}`) {
      history.replaceState(null, '', `#slide-${currentPost.id}`);
    }

  }, [posts, currentSlideIndex, isCardOpen]);

  return null; // This component only manages meta tags
}
