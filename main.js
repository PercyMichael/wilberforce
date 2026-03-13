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

  // 2. Cinematic Preloader Logic
  const preloader = document.getElementById('preloader');
  const preloaderLogo = document.getElementById('preloader-logo');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');
  const appContent = document.getElementById('app-content');

  const tlPreloader = gsap.timeline({
    onComplete: () => {
      if (preloader) preloader.style.display = 'none';
    }
  });

  if (preloader && preloaderLogo && preloaderBar && preloaderPercent && appContent) {
    // Incremental percent counter logic
    const counterObj = { value: 0 };
    
    tlPreloader.to(preloaderLogo, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power2.out"
    }).to(counterObj, {
      value: 100,
      duration: 3,
      ease: "power1.inOut",
      onUpdate: () => {
        const progress = Math.round(counterObj.value);
        preloaderPercent.innerText = progress;
        preloaderBar.style.width = progress + '%';
      }
    }, "-=0.5")
    .to(preloader, {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
      duration: 1.2,
      ease: "power4.inOut"
    })
    .to(appContent, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      onStart: () => {
        startHeroAnimation();
      }
    }, "-=0.8");
  } else if (appContent) {
    // Direct show if no preloader
    gsap.set(appContent, { opacity: 1 });
    window.addEventListener('load', startHeroAnimation);
  }

  // 3. GSAP Cinematic Hero Animation
  const tlHero = gsap.timeline();
  function startHeroAnimation() {
    const heroContent = document.querySelector("#hero-content > *");
    if (heroContent) {
      tlHero.fromTo("#hero-img", 
        { scale: 1.1 },
        { scale: 1, duration: 2.5, ease: "power2.out" }
      );
      
      // Animate text elements (h1, p, buttons) but exclude badges on PC if desired
      gsap.from("#hero-content > h1, #hero-content > p, #hero-content > div:not(.overflow-hidden)", { 
        y: 30, 
        opacity: 0, 
        duration: 1.2, 
        stagger: 0.15, 
        ease: "power2.out",
        delay: 0.5 
      });

      // On mobile, also reveal the badges; on PC they stay static
      if (window.innerWidth < 1024) {
        gsap.from("#hero-content > div.overflow-hidden", {
          y: 20,
          opacity: 0,
          duration: 1,
          delay: 1.5
        });
      }
      
      gsap.from("#hero-portrait", { 
        opacity: 0, 
        y: 50, 
        duration: 1.5, 
        ease: "power3.out", 
        delay: 0.8 
      });
      
      // Hero Badges Marquee for Mobile ONLY
      const badgesTrack = document.getElementById('badges-track');
      const duplicateTrack = document.getElementById('badges-track-duplicate');
      if (window.innerWidth < 1024 && badgesTrack && duplicateTrack) {
        gsap.to([badgesTrack, duplicateTrack], {
          xPercent: -100,
          duration: 20,
          ease: "none",
          repeat: -1
        });
      }
    }
  }

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

  // 4. GSAP Text & Grid Reveal Animations (Awwwards Style)
  const revealElements = document.querySelectorAll('section');
  
  revealElements.forEach(section => {
    // Reveal high-impact section titles (PROPERTY 360, EXPERIENCE)
    const bigTitles = section.querySelectorAll('h2');
    if (bigTitles.length > 0) {
      gsap.from(bigTitles, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 2,
        ease: "power4.out",
        stagger: 0.2
      });
    }

    // 4b. Staggered reveal for grid cards (Expertise, Ecosystem & Board)
    // Target any hover-trigger that has a border or is inside a grid
    const gridCards = section.querySelectorAll('.hover-trigger.border, .hover-trigger.group, .grid > .hover-trigger');
    if (gridCards.length > 0) {
      gsap.from(gridCards, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: {
          amount: 0.4,
          from: "start"
        },
        ease: "power2.out",
        clearProps: "all"
      });
    }

    // Simplified Individual element reveals
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      onEnter: () => {
        const textElements = section.querySelectorAll('h3, p:not(.font-sans)');
        
        textElements.forEach(el => {
          if (!el.classList.contains('clip-text') && !el.closest('.hover-trigger')) {
            const originalHTML = el.innerHTML;
            el.innerHTML = `<span style="display: inline-block; transform: translateY(100%); opacity: 0;">${originalHTML}</span>`;
            el.classList.add('clip-text');
            
            const innerSpan = el.querySelector('span');
            gsap.to(innerSpan, {
              y: "0%",
              opacity: 1,
              duration: 1.5,
              ease: "power4.out",
              delay: 0.1
            });
          }
        });
      },
      once: true
    });
  });

  // 5. Full Screen Menu Logic
  const menuBtn = document.getElementById('menu-btn');
  const fsMenu = document.getElementById('fs-menu');
  const menuLinksWrapper = document.querySelectorAll('.menu-link');
  let isMenuOpen = false;

  // Set initial state of overlay (translate it up)
  gsap.set(fsMenu, { yPercent: -100 });

  const tlMenu = gsap.timeline({ paused: true });
  
  tlMenu.to(fsMenu, {
    yPercent: 0,
    duration: 0.8,
    ease: "power4.inOut"
  }).from(menuLinksWrapper, {
    y: "100%",
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power4.out"
  }, "-=0.4");

  if (menuBtn && fsMenu) {
    menuBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        fsMenu.style.pointerEvents = "auto";
        menuBtn.querySelector('span').textContent = "Close";
        tlMenu.play();
      } else {
        fsMenu.style.pointerEvents = "none";
        menuBtn.querySelector('span').textContent = "Menu";
        tlMenu.reverse();
      }
    });

    menuLinksWrapper.forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        fsMenu.style.pointerEvents = "none";
        menuBtn.querySelector('span').textContent = "Menu";
        tlMenu.reverse();
      });
    });
  }
});
