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
      preloader.style.display = 'none';
    }
  });

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

  // 3. GSAP Cinematic Hero Animation
  function startHeroAnimation() {
    const tlHero = gsap.timeline();
    tlHero.fromTo("#hero-img", 
      { scale: 1.1 },
      { scale: 1, duration: 2.5, ease: "power2.out" }
    ).from("#hero-content > *", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=1.8");
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
});
