document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-current-year]').forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    const animatedElements = document.querySelectorAll('[data-animation]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(entry.target.dataset.animation);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(element => {
            element.classList.add('animate');
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add(element.dataset.animation);
        });
    }

    const header = document.querySelector('header');
    const applyHeaderSolid = () => {
        if (!header) return;
        header.classList.toggle('header--solid', window.scrollY > 40);
    };
    applyHeaderSolid();
    window.addEventListener('scroll', applyHeaderSolid, { passive: true });

    const hero = document.querySelector('.hero');
    const slides = hero ? hero.querySelectorAll('.slide') : [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let slideIndex = 0;
    let slideTimer;

    const stopSlideshow = () => window.clearInterval(slideTimer);
    const startSlideshow = () => {
        if (slides.length <= 1 || reduceMotion || document.hidden) return;
        stopSlideshow();
        slideTimer = window.setInterval(() => {
            slides[slideIndex].classList.remove('is-active');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('is-active');
        }, 4500);
    };

    if (slides.length > 1 && !reduceMotion) {
        startSlideshow();
        hero.addEventListener('mouseenter', stopSlideshow);
        hero.addEventListener('mouseleave', startSlideshow);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopSlideshow();
            else startSlideshow();
        });
    }

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-navigation');
    if (toggle && nav) {
        const setNavOpen = (isOpen, restoreFocus) => {
            nav.classList.toggle('active', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            if (restoreFocus) toggle.focus();
        };

        toggle.addEventListener('click', () => {
            setNavOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setNavOpen(false));
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                setNavOpen(false, true);
            }
        });

        const desktopNav = window.matchMedia('(min-width: 761px)');
        const closeOnDesktop = event => {
            if (event.matches) setNavOpen(false);
        };
        if (desktopNav.addEventListener) {
            desktopNav.addEventListener('change', closeOnDesktop);
        } else {
            desktopNav.addListener(closeOnDesktop);
        }
    }
});
