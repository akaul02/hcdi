import { createNavigationController } from './navigation.js';
import { createLinkInteractions } from './linkInteractions.js';
import { initThemeToggle } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        openBtn: document.getElementById('open-btn'),
        bookContainer: document.querySelector('.book-container'),
        navControls: document.getElementById('nav-controls'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        tocBtn: document.getElementById('toc-btn'),
        sheets: document.querySelectorAll('.page'),
    };

    if (
        !elements.openBtn ||
        !elements.bookContainer ||
        !elements.navControls ||
        !elements.prevBtn ||
        !elements.nextBtn ||
        !elements.tocBtn ||
        elements.sheets.length === 0
    ) {
        return;
    }

    const navigation = createNavigationController(elements);
    navigation.init();

    const linkInteractions = createLinkInteractions({
        getIsMobile: navigation.getIsMobile,
        getVisibleReadingLinks: navigation.getVisibleReadingLinks,
    });
    linkInteractions.init();

    initThemeToggle(document.getElementById('theme-toggle'));
});
