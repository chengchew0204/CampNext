import { WordPressPost, ProcessedPost } from '@/types/wordpress';

export async function fetchWordPressPosts(lang: string = 'en'): Promise<ProcessedPost[]> {
  try {
    const response = await fetch(
      `https://camp.mx/wp-json/wp/v2/posts?_embed&per_page=30`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts: WordPressPost[] = await response.json();
    
    // Define language-specific titles to filter by
    const englishTitles = ['Map', 'Calendar', 'Orientation', 'Guests', 'Organisers', 'Artists', 'Meditators', 'About', 'Gallery', 'Context', 'RESTAURANT', 'GIVING'];
    const spanishTitles = ['Mapa', 'Calendario', 'Orientación', 'Huéspedes', 'Organizadorxs', 'Artistas', 'Meditadores', 'Nosotrxs', 'Galería', 'Contexto', 'RESTAURANTE', 'CONTRIBUIR'];
    
    const targetTitles = lang === 'es' ? spanishTitles : englishTitles;
    
    return posts
      .filter(post => targetTitles.includes(post.title.rendered))
      .map(post => {
        const processedPost: ProcessedPost = {
          id: post.id,
          title: post.title.rendered,
        };
        
        // Special handling for Map/Mapa - add manual background image
        if (post.title.rendered === 'Map' || post.title.rendered === 'Mapa') {
          processedPost.featureImage = 'https://camp.mx/wp-content/uploads/mapa_escrit.webp';
        }
        // Extract feature image for other posts
        else if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          processedPost.featureImage = post._embedded['wp:featuredmedia'][0].source_url;
        }
        
        // Extract video URL from excerpt with more flexible regex
        const excerpt = post.excerpt.rendered;
        const videoMatch = excerpt.match(/<source[^>]*src="([^"]*)"[^>]*\/?>/i);
        if (videoMatch) {
          processedPost.videoUrl = videoMatch[1];
        }
        
        return processedPost;
      })
      .filter(post => post.featureImage || post.videoUrl); // Only return posts with media
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return [];
  }
}
