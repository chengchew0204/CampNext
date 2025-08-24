import { fetchWordPressPosts } from '@/utils/wordpress';

export default async function DebugPage() {
  const posts = await fetchWordPressPosts('en');

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">WordPress Posts Debug</h1>
      
      <div className="mb-4">
        <p className="text-lg">Total posts: {posts.length}</p>
      </div>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <div key={post.id} className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Post {index + 1} (ID: {post.id})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Feature Image:</h3>
                {post.featureImage ? (
                  <div className="mt-2">
                    <img 
                      src={post.featureImage} 
                      alt="Feature" 
                      className="w-full h-48 object-cover rounded"
                    />
                    <p className="text-sm text-gray-600 mt-1">{post.featureImage}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No feature image</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Video URL:</h3>
                {post.videoUrl ? (
                  <div className="mt-2">
                    <video 
                      src={post.videoUrl} 
                      controls 
                      className="w-full h-48 object-cover rounded"
                    />
                    <p className="text-sm text-gray-600 mt-1">{post.videoUrl}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No video</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
