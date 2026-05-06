export function createLinkInteractions({ getIsMobile, getVisibleReadingLinks }) {
    const linkTapMetrics = new Map();

    function openReadingLink(link, source = 'direct') {
        const href = link.getAttribute('href');
        if (!href) return;

        const metricKey = `${source}:${href}`;
        linkTapMetrics.set(metricKey, (linkTapMetrics.get(metricKey) || 0) + 1);

        const target = link.getAttribute('target') || '_self';
        if (target === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = href;
        }
    }

    function findVisibleReadingLinkAtPoint(clientX, clientY) {
        const visibleLinks = getVisibleReadingLinks();
        for (const link of visibleLinks) {
            if (!(link instanceof HTMLElement)) continue;
            const rect = link.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) continue;

            const withinX = clientX >= rect.left && clientX <= rect.right;
            const withinY = clientY >= rect.top && clientY <= rect.bottom;
            if (withinX && withinY) return link;
        }
        return null;
    }

    function refreshReadingLinkHover(clientX, clientY) {
        const activeLink = findVisibleReadingLinkAtPoint(clientX, clientY);
        getVisibleReadingLinks().forEach((link) => {
            if (!(link instanceof HTMLElement)) return;
            link.classList.toggle('reading-link-hit-hover', link === activeLink);
        });
    }

    function clearReadingLinkHover() {
        document.querySelectorAll('.reading-link.reading-link-hit-hover').forEach((link) => {
            link.classList.remove('reading-link-hit-hover');
        });
    }

    function init() {
        document.addEventListener('mousemove', (event) => {
            if (getIsMobile()) return;
            refreshReadingLinkHover(event.clientX, event.clientY);
        });

        document.addEventListener('mouseleave', clearReadingLinkHover);

        // Click recovery scoped only to links on currently visible page faces.
        document.addEventListener('click', (event) => {
            if (getIsMobile()) return;
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (!(event.target instanceof Element)) return;
            if (event.target.closest('.nav-btn, .open-book-btn, .theme-toggle, .toc-link')) return;

            const directLink = event.target.closest('.reading-link');
            if (directLink instanceof Element) {
                openReadingLink(directLink, 'direct');
                event.preventDefault();
                return;
            }

            const rectMatchedLink = findVisibleReadingLinkAtPoint(event.clientX, event.clientY);
            if (!(rectMatchedLink instanceof Element)) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            openReadingLink(rectMatchedLink, 'visible-face-recovery');
        }, true);
    }

    return {
        init,
        linkTapMetrics,
    };
}
