document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = [...document.querySelectorAll('.category-btn')];
    const galleryItems = [...document.querySelectorAll('.gallery-item')];
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousButton = lightbox.querySelector('.prev');
    const nextButton = lightbox.querySelector('.next');
    let visibleItems = galleryItems;
    let currentIndex = 0;
    let returnFocusTarget;

    const showImage = () => {
        const image = visibleItems[currentIndex].querySelector('img');
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
    };

    const openLightbox = item => {
        returnFocusTarget = item;
        visibleItems = galleryItems.filter(galleryItem => !galleryItem.hidden);
        currentIndex = visibleItems.indexOf(item);
        showImage();
        lightbox.showModal();
        closeButton.focus();
    };

    const moveLightbox = direction => {
        currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
        showImage();
    };

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            categoryButtons.forEach(categoryButton => {
                const isActive = categoryButton === button;
                categoryButton.classList.toggle('active', isActive);
                categoryButton.setAttribute('aria-pressed', String(isActive));
            });
            galleryItems.forEach(item => {
                item.hidden = category !== 'all' && item.dataset.category !== category;
            });
            visibleItems = galleryItems.filter(item => !item.hidden);
        });
    });

    galleryItems.forEach(item => {
        const image = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption h3');
        const label = caption && caption.textContent.trim() || image.alt || 'gallery image';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `View image: ${label}`);
        item.addEventListener('click', () => openLightbox(item));
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(item);
            }
        });
    });

    closeButton.addEventListener('click', () => lightbox.close());
    previousButton.addEventListener('click', () => moveLightbox(-1));
    nextButton.addEventListener('click', () => moveLightbox(1));
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', () => {
        if (returnFocusTarget) returnFocusTarget.focus();
    });
    document.addEventListener('keydown', event => {
        if (!lightbox.open) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            lightbox.close();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveLightbox(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveLightbox(1);
        }
    });
});
