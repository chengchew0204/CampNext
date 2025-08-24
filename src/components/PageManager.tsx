'use client';

import { useState, useEffect } from 'react';
import ContentCard from './ContentCard';
import { ProcessedPost } from '@/types/wordpress';

interface PageManagerProps {
  posts: ProcessedPost[];
  currentSlideIndex: number;
}

export default function PageManager({ posts, currentSlideIndex }: PageManagerProps) {
  const [cardStates, setCardStates] = useState<Map<number, boolean>>(new Map());

  // Handle card state changes
  const handleCardStateChange = (postId: number, isOpen: boolean) => {
    setCardStates(prev => {
      const newStates = new Map(prev);
      if (isOpen) {
        // Close all other cards when opening a new one
        newStates.clear();
        newStates.set(postId, true);
      } else {
        newStates.delete(postId);
      }
      return newStates;
    });
  };

  // Close all cards when slide changes
  useEffect(() => {
    setCardStates(new Map());
  }, [currentSlideIndex]);

  return (
    <>
      {posts.map((post, index) => (
        <ContentCard
          key={post.id}
          postId={post.id}
          title={post.title || `Post ${post.id}`}
          isVisible={index === currentSlideIndex}
          onStateChange={handleCardStateChange}
        />
      ))}
    </>
  );
}
