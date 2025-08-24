'use client';

import { useState, useEffect, useRef } from 'react';
import { getSlideTitleById } from '@/utils/slideTitles';
import { useWordPressContent } from '@/hooks/useWordPressContent';
import PageOverlay from './PageOverlay';

interface ScrollTrackerProps {
  posts: Array<{ id: number }>;
}

export default function ScrollTracker({ posts }: ScrollTrackerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // WordPress content management
  const { fetchPostContent, clearPostContent, getPostContent } = useWordPressContent();

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

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent screen click handler from firing
    console.log('Title clicked, current state:', isExpanded);
    
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // If expanding, fetch content for current post
    if (newExpandedState && posts[currentSlideIndex]) {
      const currentPost = posts[currentSlideIndex];
      fetchPostContent(currentPost.id);
    }
    
    // If collapsing, optionally clear content to free memory
    if (!newExpandedState && posts[currentSlideIndex]) {
      const currentPost = posts[currentSlideIndex];
      // Uncomment the line below if you want to clear content when closing
      // clearPostContent(currentPost.id);
    }
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

  useEffect(() => {
    // Set client flag to avoid hydration mismatch
    setIsClient(true);
    
    // Keyboard accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to close expanded card
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        if (posts[currentSlideIndex]) {
          // Optionally clear content when closing with ESC
          // clearPostContent(posts[currentSlideIndex].id);
        }
      }
      
      // Enter or Space to toggle card when focused on title
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.closest('.slide-title-container')) {
        e.preventDefault();
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        
        if (newExpandedState && posts[currentSlideIndex]) {
          fetchPostContent(posts[currentSlideIndex].id);
        }
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

    // Add click handler to scroll container
    const handleContainerClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      // Only respond to left mouse button clicks, not scroll events
      if (mouseEvent.button !== 0) return;
      
      // Don't trigger if clicking on interactive elements (buttons, titles, logo, menu)
      const target = e.target as HTMLElement;
      if (target.closest('button') || 
          target.closest('.pointer-events-auto') ||
          target.closest('.menu-item')) {
        return;
      }
      
      console.log('Screen background clicked, current state:', isExpanded);
      
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);
      
      // If expanding, fetch content for current post
      if (newExpandedState && posts[currentSlideIndex]) {
        const currentPost = posts[currentSlideIndex];
        fetchPostContent(currentPost.id);
      }
      
      // If collapsing, optionally clear content to free memory
      if (!newExpandedState && posts[currentSlideIndex]) {
        const currentPost = posts[currentSlideIndex];
        // Uncomment the line below if you want to clear content when closing
        // clearPostContent(currentPost.id);
      }
    };

    // Create intersection observer to track which section is most visible
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      // Add click event listener to scroll container
      scrollContainer.addEventListener('click', handleContainerClick);
      
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
        scrollContainer.removeEventListener('click', handleContainerClick);
      }
    };
  }, [posts.length, isExpanded, currentSlideIndex, fetchPostContent]);

  const currentPost = posts[currentSlideIndex];
  const currentTitle = currentPost ? getSlideTitleById(currentPost.id) : "CAMP";



  // Don't render slide titles until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="fixed inset-0 z-20 pointer-events-none">
        {/* Top Right - Logo */}
        <div className="absolute top-5 right-5 pointer-events-auto">
          <div className="w-25 h-25">
            <img
              width={100}
              height={100}
              src="https://camp.mx/wp-content/uploads/2023/12/logo.png"
              className="default-logo w-full h-full object-contain"
              alt="CAMP"
            />
          </div>
        </div>

        {/* Bottom Right - Language Icon */}
        <div className="absolute bottom-6 right-6 pointer-events-auto">
          <button className="p-2 text-white hover:text-gray-300 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10,10.1L0,4.7C0.1,3.2,1.4,2,3,2h14c1.6,0,2.9,1.2,3,2.8L10,10.1z M10,11.8c-0.1,0-0.2,0-0.4-0.1L0,6.4V15c0,1.7,1.3,3,3,3h4.9h4.3H17c1.7,0,3-1.3,3-3V6.4l-9.6,5.2C10.2,11.7,10.1,11.7,10,11.8z" fill="currentColor"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

  return (
    <>
      {/* Content Overlay */}
      <div className={`content-overlay ${isExpanded ? 'active' : ''}`} />
      
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
                  {item.title}
                  {item.isSpecial && (
                    <>
                      <img 
                        src="https://camp.mx/img/caret28.svg" 
                        className="menu-arrow"
                        alt=""
                      />
                      <div className="hover-content" style={{ marginLeft: '70px' }}>
                        <a href="https://worldpackers.com/locations/camp" target="_blank" rel="noopener noreferrer">
                          <img 
                            alt="" 
                            width="280" 
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
      {/* Fixed Burger Menu */}
      <div className="fixed left-3 top-3 pointer-events-auto flex items-center gap-4 z-20">
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

      {/* Sliding Titles */}
      {posts.map((post, index) => {
        const title = getSlideTitleById(post.id);
        const slideOffset = index * windowHeight - scrollY;
        const isVisible = Math.abs(slideOffset) < windowHeight;
        
        return (
          <div
            key={post.id}
            className="fixed pointer-events-auto z-20"
            style={{
              left: '84px', // Position next to the burger menu
              top: `${24 + slideOffset}px`, // Align with burger menu center
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            <div 
              className="bg-white/90 backdrop-blur-sm px-2 py-0.9 cursor-pointer hover:bg-white/95 transition-colors"
              style={{
                transform: 'scale(1.1)'
              }}
              onClick={handleTitleClick}
            >
              <h2 className={`text-black font-bold text-lg tracking-wide ${isExpanded ? 'expanded' : ''}`}>
                {title}
              </h2>
            </div>
          </div>
        );
      })}
      
      {/* Keep other overlay elements */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        {/* Top Right - Logo */}
        <div 
          className="absolute top-5 right-5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-25 h-25">
            <img
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
      
      {/* Card Content Area */}
      {isExpanded && posts[currentSlideIndex] && (
        <div className="slide_10 opened">
          <div className="card">
            <div className="card-content">
              <div className="card-content-container">
                {(() => {
                  const currentPost = posts[currentSlideIndex];
                  const contentState = getPostContent(currentPost.id);
                  
                  if (contentState.loading) {
                    return (
                      <div className="card-content-loading">
                        <p>Loading content...</p>
                      </div>
                    );
                  }
                  
                  if (contentState.error) {
                    return (
                      <div className="card-content-error">
                        <p>Error loading content: {contentState.error}</p>
                      </div>
                    );
                  }
                  
                  if (contentState.content) {
                    return (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: contentState.content 
                        }}
                      />
                    );
                  }
                  
                  return (
                    <div className="card-content-loading">
                      <p>Click to load content...</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Caret indicator when not expanded */}
      {!isExpanded && posts[currentSlideIndex] && (
        <div className="slide_10">
          <div className="caretdiv" onClick={handleTitleClick}>
            <a>
              <img 
                src="https://camp.mx/img/caret28.svg" 
                alt="Expand content" 
                style={{ 
                  filter: 'invert(1)', 
                  width: '28px', 
                  height: '28px' 
                }} 
              />
            </a>
          </div>
          
          {/* Mobile caret for iPhone */}
          <div className="caretdiviphone" onClick={handleTitleClick}>
            <img 
              src="https://camp.mx/img/caret28.svg" 
              alt="Expand content" 
              style={{ 
                filter: 'invert(1)', 
                width: '28px', 
                height: '28px' 
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
}
