document.addEventListener('DOMContentLoaded', () => {
  // ─── DOM ELEMENTS ───
  const viewport = document.getElementById('slides-viewport');
  const slides = document.querySelectorAll('.slide');
  const progress = document.getElementById('progress-bar');
  const counterCurrent = document.getElementById('current-slide-num');
  const counterTotal = document.getElementById('total-slide-num');
  
  // Controls Buttons
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnPlay = document.getElementById('btn-play');
  const btnOverview = document.getElementById('btn-overview');
  const btnHelp = document.getElementById('btn-help');
  const helpOverlay = document.getElementById('help-overlay');
  const btnCloseHelp = document.getElementById('btn-close-help');
  
  // ─── STATE VARIABLES ───
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayInterval = null;
  let isAutoplayActive = false;
  let isOverviewMode = false;
  
  // Touch Gestures State
  let touchStartX = 0;
  let touchEndX = 0;
  
  // ─── INITIALIZATION ───
  counterTotal.textContent = totalSlides;
  updateSlides();
  
  // ─── NAVIGATION FUNCTIONS ───
  
  function goToSlide(index) {
    if (isOverviewMode) {
      exitOverviewMode();
    }
    
    // Boundary check
    if (index >= 0 && index < totalSlides) {
      currentSlide = index;
      updateSlides();
    }
  }
  
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else if (isAutoplayActive) {
      // Loop back if auto-playing
      goToSlide(0);
    }
  }
  
  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }
  
  function updateSlides() {
    // 1. Move viewport using transform translate
    const offset = currentSlide * 100;
    viewport.style.transform = `translateX(-${offset / totalSlides}%)`;
    
    // 2. Toggle active slide class for entrance animations
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('slide--active');
      } else {
        slide.classList.remove('slide--active');
      }
    });
    
    // 3. Update Progress Bar
    const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // 4. Update Header Counter
    counterCurrent.textContent = currentSlide + 1;
    
    // 5. Update Control Button States (disable edge arrows)
    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === totalSlides - 1 && !isAutoplayActive;
  }
  
  // ─── AUTOPLAY SLIDESHOW ───
  
  function toggleAutoplay() {
    if (isAutoplayActive) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }
  
  function startAutoplay() {
    isAutoplayActive = true;
    btnPlay.classList.add('pres-footer__btn--active');
    btnPlay.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
    
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 4500); // 4.5 seconds per slide
  }
  
  function stopAutoplay() {
    isAutoplayActive = false;
    btnPlay.classList.remove('pres-footer__btn--active');
    btnPlay.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    
    // Update button boundary check
    updateSlides();
  }
  
  // ─── OVERVIEW MODE ───
  
  function toggleOverviewMode() {
    if (isOverviewMode) {
      exitOverviewMode();
    } else {
      enterOverviewMode();
    }
  }
  
  function enterOverviewMode() {
    stopAutoplay();
    isOverviewMode = true;
    document.getElementById('presentation').classList.add('presentation--overview');
    btnOverview.classList.add('pres-footer__btn--active');
  }
  
  function exitOverviewMode() {
    isOverviewMode = false;
    document.getElementById('presentation').classList.remove('presentation--overview');
    btnOverview.classList.remove('pres-footer__btn--active');
    // Force recalculate offsets
    updateSlides();
  }
  
  // ─── HELP MODAL CONTROLLER ───
  
  function openHelp() {
    helpOverlay.classList.add('help-overlay--active');
    stopAutoplay();
  }
  
  function closeHelp() {
    helpOverlay.classList.remove('help-overlay--active');
  }
  
  // ─── EVENT LISTENERS ───
  
  // Navigation Clicks
  btnPrev.addEventListener('click', () => {
    stopAutoplay();
    prevSlide();
  });
  
  btnNext.addEventListener('click', () => {
    stopAutoplay();
    nextSlide();
  });
  
  // Autoplay play/pause
  btnPlay.addEventListener('click', toggleAutoplay);
  
  // Overview toggle
  btnOverview.addEventListener('click', toggleOverviewMode);
  
  // Help click handlers
  btnHelp.addEventListener('click', openHelp);
  btnCloseHelp.addEventListener('click', closeHelp);
  helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) closeHelp();
  });
  
  // Progress Bar click to jump to slide
  document.getElementById('progress-container').addEventListener('click', (e) => {
    stopAutoplay();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const targetIdx = Math.floor(percent * totalSlides);
    goToSlide(targetIdx);
  });
  
  // Click Handler for Overview Mode items
  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (isOverviewMode) {
        goToSlide(index);
      }
    });
  });
  
  // Keyboard Controls
  document.addEventListener('keydown', (e) => {
    // If help modal is open, Escape closes it
    if (helpOverlay.classList.contains('help-overlay--active')) {
      if (e.key === 'Escape') closeHelp();
      return;
    }
    
    switch (e.key) {
      case 'ArrowRight':
      case ' ': // Spacebar
      case 'PageDown':
        e.preventDefault();
        stopAutoplay();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        stopAutoplay();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        stopAutoplay();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        stopAutoplay();
        goToSlide(totalSlides - 1);
        break;
      case 'o':
      case 'O':
        toggleOverviewMode();
        break;
      case 'h':
      case 'H':
      case '?':
        openHelp();
        break;
      case 'Escape':
        if (isOverviewMode) exitOverviewMode();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });
  
  // Fullscreen support
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  // Swipe Gestures for Mobile devices
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // pixels
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      stopAutoplay();
      if (swipeDistance < 0) {
        // Swipe Left -> Next
        nextSlide();
      } else {
        // Swipe Right -> Prev
        prevSlide();
      }
    }
  }
  
  // Window resizing fallback
  window.addEventListener('resize', () => {
    if (!isOverviewMode) {
      updateSlides();
    }
  });
});
