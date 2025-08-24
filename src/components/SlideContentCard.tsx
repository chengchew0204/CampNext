'use client';

import { useEffect, useState } from 'react';
import ContentCard from './ContentCard';
import { ProcessedPost } from '@/types/wordpress';

interface SlideContentCardProps {
  post: ProcessedPost;
  index: number;
  currentSlideIndex: number;
  scrollY: number;
  onCardStateChange: (postId: number, isOpen: boolean) => void;
  cardStates: Map<number, boolean>;
}

export default function SlideContentCard({
  post,
  index,
  currentSlideIndex,
  scrollY,
  onCardStateChange,
  cardStates
}: SlideContentCardProps) {
  const isVisible = index === currentSlideIndex;
  const isCardOpen = cardStates.get(post.id) || false;

  return (
    <ContentCard
      postId={post.id}
      title={post.title || `Slide ${index + 1}`}
      isVisible={isVisible}
      scrollY={scrollY}
      slideIndex={index}
      onStateChange={onCardStateChange}
    />
  );
}
