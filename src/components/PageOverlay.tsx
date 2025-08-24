'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PageOverlayProps {
  currentSlideTitle?: string;
  scrollY?: number;
}

export default function PageOverlay({ currentSlideTitle = "MAPA", scrollY = 0 }: PageOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScreenClick = () => {
    console.log('Screen clicked, current state:', isExpanded);
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      {/* Full Screen Click Handler */}
      <div 
        className="fixed inset-0 z-10 cursor-pointer"
        onClick={handleScreenClick}
      />
      
      {/* Content Overlay */}
      <div className={`content-overlay ${isExpanded ? 'active' : ''}`} />
      
      <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Top Left - Burger Menu and Slide Title */}
      <div 
        className="absolute left-3 pointer-events-auto flex items-center gap-4 transition-transform duration-300 ease-out"
        style={{
          top: `${12 + scrollY * 0.15}px`,
          transform: `translateY(${Math.min(scrollY * 0.08, 30)}px)`
        }}
      >
        <button 
          className="p-2 text-white hover:text-gray-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="ct-icon" width="36" height="36" viewBox="0 0 18 14" aria-hidden="true" data-type="type-1">
            <rect y="0.00" width="18" height="2.9" rx="1" fill="currentColor"></rect>
            <rect y="6.15" width="18" height="2.9" rx="1" fill="currentColor"></rect>
            <rect y="12.3" width="18" height="2.9" rx="1" fill="currentColor"></rect>
          </svg>
        </button>
        
        {/* Slide Title */}
        <div 
          className="bg-white/90 backdrop-blur-sm px-2 py-0.9"
          style={{
            transform: 'scale(1.1)'
          }}
        >
          <h2 
            className={`text-black font-bold text-lg tracking-wide ${isExpanded ? 'expanded' : ''}`}
          >
{currentSlideTitle}
          </h2>
        </div>
      </div>

      {/* Top Right - Logo */}
      <div 
        className="absolute top-5 right-5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-25 h-25">
          <Image
            width={100}
            height={100}
            src="https://camp.mx/wp-content/uploads/2023/12/logo.png"
            className="default-logo w-full h-full object-contain"
            alt="CAMP"
            decoding="async"
            priority
          />
        </div>
      </div>

      {/* Bottom Right - Language Icon */}
      
      </div>
    </>
  );
}
