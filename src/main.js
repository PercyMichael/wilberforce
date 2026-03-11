import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Magnetic Cursor
  const cursor = document.getElementById('custom-cursor');
  const hoverTriggers = document.querySelectorAll('a, button, .hover-trigger');

  document.addEventListener('mousemove', (e) => {
    // Lerp could be used here for smoother delay, but basic assignment is fine for standard tracking
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    trigger.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // 2. Simple Smooth Scroll & Parallax logic
  // For a true Awwwards site we might use Lenis or Locomotive, but we will implement
  // a lightweight vanilla intersection observer and scroll listener for parallax.
  
  const heroImg = document.getElementById('hero-img');
  const parallaxImages = document.querySelectorAll('.img-bg-fill');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Hero Parallax
    if (heroImg) {
      // Move the image slightly down as we scroll down
      heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
    }

    // Generic Parallax for other images
    parallaxImages.forEach(img => {
      if (img.id !== 'hero-img') {
        const rect = img.parentElement.getBoundingClientRect();
        // Check if in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // Calculate progress of the element through the viewport (0 to 1)
          const progress = 1 - (rect.bottom / (window.innerHeight + rect.height));
          // Move from -10% to 10% based on scroll progress
          const y = (progress - 0.5) * 20; 
          img.style.transform = `scale(1.1) translateY(${y}%)`;
        }
      }
    });
  });

  // 3. Intersection Observer for Text Reveals (Fade in / Slide up)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply hidden states initialy to text elements we want to reveal
  const revealElements = document.querySelectorAll('h2, h3, p, ul');
  revealElements.forEach(el => {
    // Skip if it's inside the hero to avoid FOUC delays on load
    if (!el.closest('.hero')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo)';
      observer.observe(el);
    }
  });
});
