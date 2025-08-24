'use client';

import { useState, useEffect, useRef } from 'react';
import { getSlideTitleById } from '@/utils/slideTitles';
import Image from 'next/image';
import ContentCard from './ContentCard';
import SEOManager from './SEOManager';
import { ProcessedPost } from '@/types/wordpress';

interface ScrollTrackerProps {
  posts: ProcessedPost[];
}

export default function ScrollTracker({ posts }: ScrollTrackerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cardStates, setCardStates] = useState<Map<number, boolean>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Menu data with post IDs and titles
  const menuItems = [
    { id: '16972', title: 'Mapa', postId: 16972 },
    { id: '12978', title: 'Calendario', postId: 12978 },
    { id: '11777', title: 'Orientación', postId: 11777 },
    { id: '11783', title: 'Huéspedes', postId: 11783 },
    { id: 'voluntarixs', title: 'VOLUNTARIXS', postId: null, isSpecial: true },
    { id: '14850', title: 'ORGANIZADORXS', postId: 14850 },
    { id: '11780', title: 'Artistas', postId: 11780 },
    { id: '19917', title: 'Meditadores', postId: 19917 },
    { id: '11789', title: 'Nosotrxs', postId: 11789 },
    { id: '11771', title: 'Galería', postId: 11771 },
    { id: '11766', title: 'Contexto', postId: 11766 },
    { id: '18978', title: 'RESTAURANTE', postId: 18978 },
    { id: '18971', title: 'CONTRIBUIR', postId: 18971 }
  ];

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

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (e: React.MouseEvent, postId: number | null, isSpecial: boolean = false) => {
    e.stopPropagation(); // Prevent any parent click handlers
    
    if (isSpecial) {
      // Handle VOLUNTARIXS special case - could open external link
      window.open('https://worldpackers.com/locations/camp', '_blank');
      return;
    }
    
    if (postId) {
      // Find the slide index for this post
      const slideIndex = posts.findIndex(post => post.id === postId);
      if (slideIndex !== -1) {
        setCurrentSlideIndex(slideIndex);
        // Scroll to the specific slide
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: slideIndex * window.innerHeight,
            behavior: 'smooth'
          });
        }
      }
    }
    
    // Close the menu
    setIsMenuOpen(false);
  };

  // Close all cards when slide changes
  useEffect(() => {
    setCardStates(new Map());
  }, [currentSlideIndex]);

  useEffect(() => {
    // Set client flag to avoid hydration mismatch
    setIsClient(true);
    
    // Keyboard accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to close all cards
      if (e.key === 'Escape') {
        setCardStates(new Map());
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    // Handle scroll position for the scroll container
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.scroll-container');
      if (scrollContainer) {
        setScrollY(scrollContainer.scrollTop);
      }
    };

    // No need for container click handler - cards manage their own state

    // Create intersection observer to track which section is most visible
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionIndex = parseInt(entry.target.getAttribute('data-index') || '0');
              setCurrentSlideIndex(sectionIndex);
            }
          });
        },
        {
          root: scrollContainer, // Use scroll container as root
          threshold: 0.5, // Trigger when section is 50% visible
          rootMargin: '-10% 0px -10% 0px' // Add some margin to make detection more accurate
        }
      );

      // Observe all sections
      const sections = document.querySelectorAll('.scroll-section');
      sections.forEach((section, index) => {
        section.setAttribute('data-index', index.toString());
        observerRef.current?.observe(section);
      });

      // Add scroll listener to the scroll container
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

      // Set initial scroll position
      handleScroll();
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observerRef.current?.disconnect();
      const scrollContainer = document.querySelector('.scroll-container');
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [posts, currentSlideIndex]);

  // Current post and title are available if needed for future features



  // Don't render slide titles until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="fixed inset-0 z-20 pointer-events-none">
        {/* Top Right - Logo */}
        <div className="absolute top-5 right-5 pointer-events-auto">
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

        {/* Bottom Right - Language Icon */}
      </div>
    );
  }

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

  return (
    <>
      {/* SEO Management */}
      <SEOManager 
        posts={posts}
        currentSlideIndex={currentSlideIndex}
        isCardOpen={cardStates.size > 0}
      />
      
      {/* Content Overlay - managed by individual cards */}
      <div className={`content-overlay ${cardStates.size > 0 ? 'active' : ''}`} />
      
      {/* Fixed Burger Menu */}
      <div className="fixed left-3 top-3 pointer-events-auto z-30">
        <button 
          className="p-2 text-white hover:text-gray-300 transition-colors"
          onClick={handleMenuToggle}
        >
          <svg className="ct-icon" width="36" height="36" viewBox="0 0 18 14" aria-hidden="true" data-type="type-1">
            <rect y="0.00" width="18" height="2.9" rx="1" fill="currentColor"></rect>
            <rect y="6.15" width="18" height="2.9" rx="1" fill="currentColor"></rect>
            <rect y="12.3" width="18" height="2.9" rx="1" fill="currentColor"></rect>
          </svg>
        </button>
      </div>
      
      {/* Menu Overlay */}
      <div className={`fixed inset-0 z-30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0" onClick={handleMenuToggle} />
        <div className={`absolute left-5 top-18 transform transition-transform duration-300 ease-out pointer-events-auto ${isMenuOpen ? '' : 'pointer-events-none'}`} style={{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <div
                  className="menu-item"
                  onClick={(e) => handleMenuClick(e, item.postId, item.isSpecial)}
                  style={{ position: item.isSpecial ? 'relative' : 'static' }}
                >
                  {item.title.toUpperCase()}
                  {item.isSpecial && (
                    <>
                      <Image 
                        src="https://camp.mx/img/caret28.svg" 
                        className="menu-arrow"
                        width={28}
                        height={28}
                        alt=""
                      />
                      <div className="hover-content" style={{ marginLeft: '70px' }}>
                        <a href="https://worldpackers.com/locations/camp" target="_blank" rel="noopener noreferrer">
                          <Image 
                            alt="" 
                            width={280} 
                            height={200}
                            src="https://camp.mx/wp-content/uploads/worldpackers.jpg" 
                            style={{ display: 'block', margin: '0', border: 'medium' }}
                          />
                        </a>
                        <div style={{ color: 'black', fontSize: '12px', textAlign: 'center', padding: '3.5px', margin: '0', backgroundColor: 'transparent', width: '100%', lineHeight: '1' }}>
                          worldpackers.com
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Content Cards - positioned to scroll with slides */}
      {posts.map((post, index) => (
        <ContentCard
          key={post.id}
          postId={post.id}
          title={post.title || getSlideTitleById(post.id)}
          isVisible={index === currentSlideIndex}
          scrollY={scrollY}
          slideIndex={index}
          onStateChange={handleCardStateChange}
        />
      ))}
    </>
  );
}
