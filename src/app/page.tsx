import { fetchWordPressPosts } from '@/utils/wordpress';
import BackgroundMedia from '@/components/BackgroundMedia';

export default async function Home() {
  const posts = await fetchWordPressPosts('en');

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>No posts found or error loading content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-container">
      {posts.map((post) => (
        <section key={post.id} className="scroll-section">
          <BackgroundMedia
            videoUrl={post.videoUrl}
            imageUrl={post.featureImage}
          />
          {/* Content layer - currently empty as requested */}
          <div className="relative z-10 h-full w-full">
            {/* Future content can be added here */}
          </div>
        </section>
      ))}
    </div>
  );
}
