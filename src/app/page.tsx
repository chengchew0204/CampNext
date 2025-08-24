import { fetchWordPressPosts } from '@/utils/wordpress';
import BackgroundMedia from '@/components/BackgroundMedia';
import ScrollTracker from '@/components/ScrollTracker';

export default async function Home() {
  const posts = await fetchWordPressPosts('es');

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
          <p>No se encontraron publicaciones o error al cargar el contenido.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="scroll-container">
        {posts.map((post) => (
          <section key={post.id} className="scroll-section">
            <BackgroundMedia
              videoUrl={post.videoUrl}
              imageUrl={post.featureImage}
            />
            {/* Content layer with enhanced card system */}
            <div className="relative z-10 h-full w-full">
              {/* Content cards will be managed by ScrollTracker */}
            </div>
          </section>
        ))}
      </div>
      <ScrollTracker posts={posts} />
    </>
  );
}
