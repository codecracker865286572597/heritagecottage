// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(entry.target.dataset.animation);
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1, // Start animation when 10% of element is visible
        rootMargin: '50px' // Start slightly before element comes into view
    });

    // Find all elements with data-animation attribute
    document.querySelectorAll('[data-animation]').forEach((element) => {
        element.classList.add('animate'); // Add initial state
        observer.observe(element);
    });

    const header = document.querySelector('header');
    const applyHeaderSolid = () => {
        if (!header) return;
        if (window.scrollY > 40) header.classList.add('header--solid');
        else header.classList.remove('header--solid');
    };
    applyHeaderSolid();
    window.addEventListener('scroll', applyHeaderSolid, { passive: true });

    // Hero background slideshow (crossfade)
    const hero = document.querySelector('.hero');
    const slides = hero ? hero.querySelectorAll('.slide') : [];
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let slideIndex = 0;
    let slideTimer;

    const startSlideshow = () => {
        if (!slides || slides.length <= 1 || reduceMotion) return;
        clearInterval(slideTimer);
        slideTimer = setInterval(() => {
            slides[slideIndex].classList.remove('is-active');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('is-active');
        }, 4500);
    };

    const stopSlideshow = () => clearInterval(slideTimer);

    if (slides && slides.length > 1 && !reduceMotion) {
        startSlideshow();
        if (hero) {
            hero.addEventListener('mouseenter', stopSlideshow);
            hero.addEventListener('mouseleave', startSlideshow);
        }
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopSlideshow(); else startSlideshow();
        });
    }

    // Mobile nav toggle
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('header nav');
    if (toggle && nav) {
        const closeNav = () => {
            document.body.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        };
        const openNav = () => {
            document.body.classList.add('nav-open');
            toggle.setAttribute('aria-expanded', 'true');
        };
        toggle.addEventListener('click', () => {
            const isOpen = document.body.classList.contains('nav-open');
            isOpen ? closeNav() : openNav();
        });
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });
    }
});

// Resposive hamburger 

    document.addEventListener('DOMContentLoaded', function() {
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('nav');

      hamburger.addEventListener('click', function() {
          navMenu.classList.toggle('active');

          // Animate hamburger to X
          const spans = hamburger.querySelectorAll('span');
          if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(2px, 1px)';
            spans[1].style.opacity ='0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -4px)';
          } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity ='1';
            spans[2].style.transform = 'none';
          }
      });

      // Close menu when clicking on a link
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          const spans = hamburger.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity ='1';
          spans[2].style.transform = 'none';
        });
      });
    });
