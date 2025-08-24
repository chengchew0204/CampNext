'use client';

import { useState, useEffect } from 'react';
import { useWordPressContent } from '@/hooks/useWordPressContent';
import Image from 'next/image';

interface ContentCardProps {
  postId: number;
  title: string;
  isVisible: boolean;
  scrollY: number;
  slideIndex: number;
  onStateChange?: (postId: number, isOpen: boolean) => void;
}

export default function ContentCard({ 
  postId, 
  title, 
  isVisible, 
  scrollY,
  slideIndex,
  onStateChange 
}: ContentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { fetchPostContent, getPostContent } = useWordPressContent();
  
  const contentState = getPostContent(postId);

  // Handle card toggle
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      // Load content when opening
      fetchPostContent(postId);
    }
    
    // Notify parent component about state change
    onStateChange?.(postId, newState);
  };

  // Close card when it becomes invisible (slide changes)
  useEffect(() => {
    if (!isVisible && isOpen) {
      setIsOpen(false);
      onStateChange?.(postId, false);
    }
  }, [isVisible, isOpen, postId, onStateChange]);

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  
  // Calculate the current slide position relative to viewport
  // slideIndex * windowHeight = where this slide starts
  // scrollY = current scroll position
  // When scrollY equals slideIndex * windowHeight, we're at the top of this slide
  const slideStartY = slideIndex * windowHeight;
  const relativePosition = slideStartY - scrollY;
  
  // Title should appear 24px from the top when the slide is in view
  const titleTopPosition = 24 + relativePosition;

  // Only show title when the slide is near the viewport
  const slideIsInView = Math.abs(relativePosition) < windowHeight;

  return (
    <>
            {/* Coffee overlay layer when card is open - matches homepage design */}
      <div className={`homepage-overlay ${isOpen ? 'active' : ''}`} />
      
      {/* Title trigger - exactly like homepage, scrolls with slide */}
      {(slideIsInView || isOpen) && (
        <div
          className="fixed pointer-events-auto z-40"
          style={{
            left: '84px',
            top: `${titleTopPosition}px`,
            opacity: (slideIsInView || isOpen) ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        >
        <div 
          className={`${isOpen ? 'bg-white/95' : 'bg-white/90'} backdrop-blur-sm px-2 py-0.9 cursor-pointer hover:bg-white/95 transition-colors`}
          style={{
            transform: 'scale(1.1)',
            pointerEvents: 'auto'
          }}
          onClick={handleToggle}
        >
          <h2 className={`text-black font-bold text-lg tracking-wide ${isOpen ? 'expanded' : ''}`}>
            {title.toUpperCase()}
          </h2>
        </div>
        </div>
      )}



      {/* Logo - exactly like homepage */}
      <div className="fixed top-5 right-5 pointer-events-auto z-30">
        <div className="w-25 h-25">
          <Image
            width={100}
            height={100}
            src="https://camp.mx/wp-content/uploads/2023/12/logo.png"
            className="default-logo w-full h-full object-contain"
            alt="CAMP"
          />
        </div>
      </div>



      {/* Caret indicator when not expanded - exactly like homepage */}
      {!isOpen && (
        <div className="slide_10">
          <div className="caretdiv" onClick={handleToggle}>
            <a>
              <Image 
                src="https://camp.mx/img/caret28.svg" 
                alt="Expand content" 
                width={28}
                height={28}
                style={{ 
                  filter: 'invert(1)', 
                  width: '28px', 
                  height: '28px' 
                }} 
              />
            </a>
          </div>
          
          {/* Mobile caret for iPhone */}
          <div className="caretdiviphone" onClick={handleToggle}>
            <Image 
              src="https://camp.mx/img/caret28.svg" 
              alt="Expand content" 
              width={28}
              height={28}
              style={{ 
                filter: 'invert(1)', 
                width: '28px', 
                height: '28px' 
              }} 
            />
          </div>
        </div>
      )}
      
      {/* Content card - only rendered when open, exactly like homepage */}
      {isOpen && (
        <div className="slide_10 opened">
          <div className="card">
            <div className="card-content">
              <div className="card-content-container">
                {contentState.loading && (
                  <div className="card-content-loading">
                    <p>Loadinf...</p>
                  </div>
                )}
                
                {contentState.error && (
                  <div className="card-content-error">
                    <p>Failed: {contentState.error}</p>
                    <button 
                      onClick={() => fetchPostContent(postId)}
                      className="retry-button"
                    >
                      Retry
                    </button>
                  </div>
                )}
                
                {contentState.content && (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: contentState.content 
                    }}
                  />
                )}
                
                {!contentState.loading && !contentState.error && !contentState.content && (
                  <div className="card-content-loading">
                    <p>Click to load content</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
