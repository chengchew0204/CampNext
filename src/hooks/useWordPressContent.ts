'use client';

import { useState, useCallback } from 'react';

interface ContentState {
  content: string | null;
  loading: boolean;
  error: string | null;
}

interface UseWordPressContentReturn {
  fetchPostContent: (postId: number) => Promise<void>;
  getPostContent: (postId: number) => ContentState;
  clearPostContent: (postId: number) => void;
  clearAllContent: () => void;
}

export function useWordPressContent(): UseWordPressContentReturn {
  const [contentCache, setContentCache] = useState<Map<number, ContentState>>(new Map());

  const fetchPostContent = useCallback(async (postId: number) => {
    // Check if already loading or loaded
    const currentState = contentCache.get(postId);
    if (currentState?.loading || currentState?.content) {
      return;
    }

    // Set loading state
    setContentCache(prev => new Map(prev.set(postId, {
      content: null,
      loading: true,
      error: null
    })));

    try {
      const response = await fetch(`/api/wordpress?postId=${postId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const post = await response.json();
      
      // Clean up the content by removing video elements and other unwanted content
      let cleanContent = post.content.rendered;
      
      // Remove video elements since they're handled as background
      cleanContent = cleanContent.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '');
      // Remove source elements
      cleanContent = cleanContent.replace(/<source[^>]*\/?>/gi, '');
      // Remove empty paragraphs
      cleanContent = cleanContent.replace(/<p[^>]*>\s*<\/p>/gi, '');
      // Remove WordPress shortcodes
      cleanContent = cleanContent.replace(/\[.*?\]/g, '');
      // Clean up extra whitespace
      cleanContent = cleanContent.trim();
      
      // Update with loaded content
      setContentCache(prev => new Map(prev.set(postId, {
        content: cleanContent,
        loading: false,
        error: null
      })));
      
    } catch (error) {
      console.error('Error fetching WordPress content:', error);
      
      // Update with error state
      setContentCache(prev => new Map(prev.set(postId, {
        content: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })));
    }
  }, [contentCache]);

  const getPostContent = useCallback((postId: number): ContentState => {
    return contentCache.get(postId) || {
      content: null,
      loading: false,
      error: null
    };
  }, [contentCache]);

  const clearPostContent = useCallback((postId: number) => {
    setContentCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(postId);
      return newCache;
    });
  }, []);

  const clearAllContent = useCallback(() => {
    setContentCache(new Map());
  }, []);

  return {
    fetchPostContent,
    getPostContent,
    clearPostContent,
    clearAllContent
  };
}
