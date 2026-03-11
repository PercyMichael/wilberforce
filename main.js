document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // 1. Custom Magnetic Cursor Core
  const cursor = document.getElementById('custom-cursor');
  const hoverTriggers = document.querySelectorAll('a, button, .hover-trigger');

  document.addEventListener('mousemove', (e) => {
    // QuickSet for high performance cursor tracking
    gsap.quickSetter(cursor, "x", "px")(e.clientX);
    gsap.quickSetter(cursor, "y", "px")(e.clientY);
  });

  hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    trigger.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // 2. GSAP Cinematic Hero Animation on Load
  const tlHero = gsap.timeline();
  // Ensure the image covers the area completely. Instead of a `from` that ends at scale 1,
  // we use a slow scale down from 1.1 to 1 to ensure no black borders at the start.
  tlHero.fromTo("#hero-img", 
    { scale: 1.1 },
    { scale: 1, duration: 2.5, ease: "power2.out" }
  ).from("header h1, header p", {
    y: 30,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power2.out"
  }, "-=1.8");

  // 3. GSAP Parallax Images
  const scrollParallaxImages = document.querySelectorAll('.img-parallax');
  scrollParallaxImages.forEach(img => {
    gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom", 
        end: "bottom top",
        scrub: true
      }
    });
  });

  // 4. GSAP Text Reveal Animations (Awwwards Style Stagger)
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    // Select headers and paragraphs
    const textElements = section.querySelectorAll('h2, h3, p:not(.font-sans)');
    
    textElements.forEach(el => {
      // Create a wrapper for the clipping mask effect often seen on Awwwards
      const originalHTML = el.innerHTML;
      el.innerHTML = `<span style="display: inline-block; transform: translateY(100%); opacity: 0;">${originalHTML}</span>`;
      el.classList.add('clip-text');
      
      const innerSpan = el.querySelector('span');
      
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%", 
        onEnter: () => {
          gsap.to(innerSpan, {
            y: "0%",
            opacity: 1,
            duration: 1.2,
            ease: "power4.out"
          });
        },
        once: true
      });
    });

    // Stagger list items separately
    const listItems = section.querySelectorAll('li');
    if (listItems.length > 0) {
      gsap.set(listItems, { x: -20, opacity: 0 });
      ScrollTrigger.create({
        trigger: listItems[0].parentElement,
        start: "top 85%",
        onEnter: () => {
          gsap.to(listItems, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
          });
        },
        once: true
      });
    }
  });
});
