/*
   LOVE PEACE BAND - PREMIUM WEBSITE LOGIC
   Fully interactive, responsive, and performance-optimized.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==================== HERO BACKDROP SLIDESHOW ====================
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentHeroSlide = 0;

  if (heroSlides.length > 0) {
    setInterval(() => {
      heroSlides[currentHeroSlide].classList.remove('active');
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add('active');
    }, 5000); // Fade cross every 5 seconds
  }

  // ==================== MOBILE MENU DRAWER ====================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        const isOpened = navMenu.classList.contains('active');
        icon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
        lucide.createIcons();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      }
    });
    
    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // ==================== STICKY NAV ON SCROLL ====================
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==================== ACTIVE NAV HIGHLIGHTER (OBSERVER) ====================
  const sections = document.querySelectorAll('.id-target');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle portion
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Specially handle home highlight when at the top
        if (id === 'hero') {
          document.querySelector('a[href="#"]').classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
  
  // Also observe hero section to light up "Home" link
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, { rootMargin: '-10% 0px -80% 0px' });
    heroObserver.observe(heroSection);
  }

  // ==================== CINEMATIC VIDEO MODAL ====================
  const videoCards = document.querySelectorAll('.video-card');
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const modalVideoPlayer = document.getElementById('modal-video-player');

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-video-src');
      if (src && modalVideoPlayer && videoModal) {
        modalVideoPlayer.src = src;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
        modalVideoPlayer.load();
        modalVideoPlayer.play().catch(err => console.log("Auto-play blocked or failed", err));
      }
    });
  });

  const closeVideoModal = () => {
    if (videoModal && modalVideoPlayer) {
      videoModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore page scrolling
      modalVideoPlayer.pause();
      modalVideoPlayer.src = ''; // Stops stream download/buffering
    }
  };

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      // Close only if click is directly on the background overlay
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // ==================== PHOTO MASONRY GENERATOR ====================
  // List of all 40 professional photoshoot images
  const PHOTO_FILES = [
    '_DSC0427.jpg', '_DSC0429.jpg', '_DSC0432.jpg', '_DSC0467.jpg',
    '_DSC0484.jpg', '_DSC0488.jpg', '_DSC0497.jpg', '_DSC0502.jpg',
    '_DSC0509.jpg', '_DSC0521.jpg', '_DSC0526.jpg', '_DSC0532.jpg',
    '_DSC0534.jpg', '_DSC0540.jpg', '_DSC0543.jpg', '_DSC0556.jpg',
    '_DSC0561.jpg', '_DSC0565.jpg', '_DSC0568.jpg', '_DSC0571.jpg',
    '_DSC0574.jpg', '_DSC0592.jpg', '_DSC0598.jpg', '_DSC0612.jpg',
    '_DSC0625.jpg', '_DSC0629.jpg', '_DSC0637.jpg', '_DSC0652.jpg',
    '_DSC0653.jpg', '_DSC0661.jpg', '_DSC0668.jpg', '_DSC0675.jpg',
    '_DSC0684.jpg', '_DSC0687.jpg', '_DSC0689.jpg', '_DSC0697.jpg',
    '_DSC0705.jpg', '_DSC0710.jpg', '_DSC0728.jpg', '_DSC0733.jpg'
  ];

  const IMAGES_PER_PAGE = 9;
  let currentIndex = 0;
  
  const photoMasonry = document.getElementById('photo-masonry');
  const btnLoadMore = document.getElementById('btn-load-more');

  // Categorize images to give meaningful descriptions in the lightbox
  const getPhotoMetadata = (filename, index) => {
    const weddingPhotos = [1, 5, 8, 9, 12, 15, 20, 24, 28, 32, 35, 38];
    const portraitPhotos = [0, 2, 4, 6, 7, 10, 11, 14, 17, 19, 21, 23, 27, 30, 34, 37, 39];
    
    if (weddingPhotos.includes(index)) {
      return {
        title: "Stage Elegance",
        tag: "Wedding Performance Highlights"
      };
    } else if (portraitPhotos.includes(index)) {
      return {
        title: "Collective Portrait",
        tag: "Love Peace Band Members"
      };
    } else {
      return {
        title: "Candid Atmosphere",
        tag: "Live Performance Atmosphere"
      };
    }
  };

  const renderPhotos = (count) => {
    if (!photoMasonry) return;
    
    const limit = Math.min(currentIndex + count, PHOTO_FILES.length);
    const fragment = document.createDocumentFragment();

    for (let i = currentIndex; i < limit; i++) {
      const file = PHOTO_FILES[i];
      const meta = getPhotoMetadata(file, i);
      
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      photoItem.setAttribute('data-index', i);
      
      photoItem.innerHTML = `
        <img src="./20260323 PHOTO/${file}" alt="${meta.title}" loading="lazy">
        <div class="photo-overlay">
          <div class="photo-overlay-info">
            <h4>${meta.title}</h4>
            <p>${meta.tag}</p>
          </div>
          <i data-lucide="maximize-2"></i>
        </div>
      `;
      
      // Open Lightbox on item click
      photoItem.addEventListener('click', () => {
        openLightbox(i);
      });
      
      fragment.appendChild(photoItem);
    }

    photoMasonry.appendChild(fragment);
    
    // Refresh newly added Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    currentIndex = limit;
    
    // Hide "Load More" button if all photos are rendered
    if (currentIndex >= PHOTO_FILES.length && btnLoadMore) {
      btnLoadMore.style.display = 'none';
    }
  };

  // Render initial photos
  renderPhotos(IMAGES_PER_PAGE);

  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      // Add loading state style
      btnLoadMore.disabled = true;
      btnLoadMore.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">&#8635;</span> Loading Captures...`;
      
      setTimeout(() => {
        renderPhotos(IMAGES_PER_PAGE);
        btnLoadMore.disabled = false;
        btnLoadMore.innerHTML = `<i data-lucide="image"></i> Load More Captures`;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 500);
    });
  }

  // Add rotation animation for loading spinner
  const style = document.createElement('style');
  style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

  // ==================== PHOTO LIGHTBOX MODAL ====================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-modal-close');
  const lightboxActiveImg = document.getElementById('lightbox-active-img');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxCounter = document.getElementById('lightbox-counter');
  
  let activePhotoIndex = 0;

  const openLightbox = (index) => {
    if (!lightboxModal || !lightboxActiveImg) return;
    
    activePhotoIndex = index;
    updateLightboxContent();
    
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const updateLightboxContent = () => {
    if (!lightboxActiveImg) return;
    
    const file = PHOTO_FILES[activePhotoIndex];
    const meta = getPhotoMetadata(file, activePhotoIndex);
    
    // Smooth transition between slides
    lightboxActiveImg.classList.remove('active');
    
    setTimeout(() => {
      lightboxActiveImg.src = `./20260323 PHOTO/${file}`;
      lightboxActiveImg.alt = meta.title;
      lightboxActiveImg.onload = () => {
        lightboxActiveImg.classList.add('active');
      };
      
      if (lightboxTitle) lightboxTitle.textContent = meta.title;
      if (lightboxTag) lightboxTag.textContent = meta.tag;
      if (lightboxCounter) lightboxCounter.textContent = `${activePhotoIndex + 1} / ${PHOTO_FILES.length}`;
    }, 150);
  };

  const closeLightboxModal = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const navigateLightbox = (direction) => {
    if (direction === 'next') {
      activePhotoIndex = (activePhotoIndex + 1) % PHOTO_FILES.length;
    } else {
      activePhotoIndex = (activePhotoIndex - 1 + PHOTO_FILES.length) % PHOTO_FILES.length;
    }
    updateLightboxContent();
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxModal);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => navigateLightbox('prev'));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => navigateLightbox('next'));
  
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      // Close only if click is directly on the background modal
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-modal-content')) {
        closeLightboxModal();
      }
    });
  }

  // Keyboard navigation for modals
  document.addEventListener('keydown', (e) => {
    if (videoModal && videoModal.classList.contains('active')) {
      if (e.key === 'Escape') closeVideoModal();
    }
    
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightboxModal();
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    }
  });

  // ==================== TESTIMONIALS SLIDER ====================
  const carousel = document.getElementById('reviews-carousel');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('review-prev');
  const nextBtn = document.getElementById('review-next');
  const dotsContainer = document.getElementById('review-dots');
  
  let activeSlide = 0;
  let slideInterval;

  if (carousel && slides.length > 0) {
    // Generate indicator dots
    const dotsFragment = document.createDocumentFragment();
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      dotsFragment.appendChild(dot);
    });
    if (dotsContainer) dotsContainer.appendChild(dotsFragment);
    
    const dots = document.querySelectorAll('.indicator-dot');

    const updateSlider = () => {
      carousel.style.transform = `translateX(-${activeSlide * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeSlide);
      });
    };

    const goToSlide = (index) => {
      activeSlide = index;
      updateSlider();
      resetInterval();
    };

    const nextSlide = () => {
      activeSlide = (activeSlide + 1) % slides.length;
      updateSlider();
    };

    const prevSlide = () => {
      activeSlide = (activeSlide - 1 + slides.length) % slides.length;
      updateSlider();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    // Auto rotate
    const startInterval = () => {
      slideInterval = setInterval(nextSlide, 7000);
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      startInterval();
    };

    startInterval();
  }

  // ==================== FAQ ACCORDION ====================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all other FAQs
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0px';
          }
        });
        
        // Toggle current FAQ
        item.classList.toggle('active', !isOpen);
        answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : '0px';
      });
    }
  });

  // ==================== INQUIRY FORM SUBMISSION ====================
  const inquiryForm = document.getElementById('inquiry-form');
  const formSuccess = document.getElementById('form-success');
  const btnSuccessReset = document.getElementById('btn-success-reset');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Button loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">&#8635;</span> Processing Inquiry...`;
      
      // Simulate API submission
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show success screen
        if (formSuccess) {
          formSuccess.classList.add('active');
        }
      }, 1500);
    });
  }

  if (btnSuccessReset && formSuccess && inquiryForm) {
    btnSuccessReset.addEventListener('click', () => {
      inquiryForm.reset();
      formSuccess.classList.remove('active');
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Allow default click behavior for empty hashes or actions
      if (href === '#') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const headerHeight = header.offsetHeight || 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
