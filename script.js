document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const bookContainer = document.querySelector('.book-container');
    const navControls = document.getElementById('nav-controls');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const tocBtn = document.getElementById('toc-btn');
    
    const sheets = document.querySelectorAll('.page');
    const totalSheets = sheets.length; // 6 sheets total (0 to 5)
    
    let currentSpread = 0; // 0 = Cover. 1 = Spread 1 (Sheet 1 front).
    let currentMobilePage = 0; // For mobile: 0=Cover Front, 1=Cover Back, 2=Sheet1 Front...
    
    let isMobile = window.innerWidth <= 1000;
    const linkTapMetrics = new Map();
    
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 1000;
        if (wasMobile !== isMobile) {
            // reset state when changing view
            currentSpread = 0;
            currentMobilePage = 0;
            sheets.forEach(s => s.classList.remove('flipped'));
            bookContainer.classList.remove('open');
            navControls.classList.remove('visible');
            updateMobileView();
        }
    });
    
    // Cover opening
    openBtn.addEventListener('click', () => {
        if (isMobile) {
            currentMobilePage = 2; // Jump to TOC (Sheet 1 Front)
            updateMobileView();
            navControls.classList.add('visible');
            updateNavButtons();
        } else {
            const coverSheet = document.getElementById('sheet-0');
            coverSheet.classList.add('flipped');
            bookContainer.classList.add('open');
            
            setTimeout(() => {
                navControls.classList.add('visible');
                currentSpread = 1;
                updateNavButtons();
            }, 500);
        }
    });

    // TOC Navigation
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSpreadNum = parseInt(e.target.getAttribute('data-target'));
            if (isMobile) {
                // Mobile page for left side of the spread is ((S-1)*2)+1
                currentMobilePage = ((targetSpreadNum - 1) * 2) + 1;
                updateMobileView();
            } else {
                flipToSpread(targetSpreadNum);
            }
            updateNavButtons();
        });
    });
    
    nextBtn.addEventListener('click', () => {
        if (isMobile) {
            if (currentMobilePage < (totalSheets * 2) - 2) { // up to sheet 5 front
                currentMobilePage++;
                updateMobileView();
            }
        } else {
            if (currentSpread < totalSheets - 1) { // 0 to 5 spreads max
                const sheetToFlip = document.getElementById(`sheet-${currentSpread}`);
                if (sheetToFlip) sheetToFlip.classList.add('flipped');
                currentSpread++;
            }
        }
        updateNavButtons();
    });
    
    prevBtn.addEventListener('click', () => {
        if (isMobile) {
            if (currentMobilePage > 2) {
                currentMobilePage--;
                updateMobileView();
            } else if (currentMobilePage === 2) {
                currentMobilePage = 0;
                updateMobileView();
                navControls.classList.remove('visible');
            }
        } else {
            if (currentSpread > 1) {
                currentSpread--;
                const sheetToUnflip = document.getElementById(`sheet-${currentSpread}`);
                if (sheetToUnflip) sheetToUnflip.classList.remove('flipped');
            } else if (currentSpread === 1) {
                const coverSheet = document.getElementById('sheet-0');
                coverSheet.classList.remove('flipped');
                bookContainer.classList.remove('open');
                navControls.classList.remove('visible');
                currentSpread = 0;
            }
        }
        updateNavButtons();
    });
    
    tocBtn.addEventListener('click', () => {
        if (isMobile) {
            currentMobilePage = 2;
            updateMobileView();
        } else {
            flipToSpread(1);
        }
        updateNavButtons();
    });

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

    function getVisibleReadingLinks() {
        if (isMobile) {
            const mobileSide = document.querySelector('.front-side.active-mobile, .page-back.active-mobile');
            return mobileSide ? Array.from(mobileSide.querySelectorAll('.reading-link')) : [];
        }

        const links = [];
        const rightSheet = document.getElementById(`sheet-${currentSpread}`);
        if (rightSheet) {
            const rightFace = rightSheet.querySelector('.front-side');
            if (rightFace) {
                links.push(...rightFace.querySelectorAll('.reading-link'));
            }
        }
        if (currentSpread > 0) {
            const leftSheet = document.getElementById(`sheet-${currentSpread - 1}`);
            if (leftSheet) {
                const leftFace = leftSheet.querySelector('.page-back');
                if (leftFace) {
                    links.push(...leftFace.querySelectorAll('.reading-link'));
                }
            }
        }
        return links;
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
        const visibleLinks = getVisibleReadingLinks();
        visibleLinks.forEach((link) => {
            if (!(link instanceof HTMLElement)) return;
            link.classList.toggle('reading-link-hit-hover', link === activeLink);
        });
    }

    document.addEventListener('mousemove', (event) => {
        if (isMobile) return;
        refreshReadingLinkHover(event.clientX, event.clientY);
    });

    document.addEventListener('mouseleave', () => {
        document.querySelectorAll('.reading-link.reading-link-hit-hover').forEach((link) => {
            link.classList.remove('reading-link-hit-hover');
        });
    });

    // Lightweight click recovery scoped only to links on visible page faces.
    document.addEventListener('click', (event) => {
        if (isMobile) return;
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
    
    function flipToSpread(targetSpread) {
        if (targetSpread > currentSpread) {
            for (let i = currentSpread; i < targetSpread; i++) {
                const sheet = document.getElementById(`sheet-${i}`);
                if (sheet) sheet.classList.add('flipped');
            }
        } else if (targetSpread < currentSpread) {
            for (let i = currentSpread - 1; i >= targetSpread; i--) {
                const sheet = document.getElementById(`sheet-${i}`);
                if (sheet) sheet.classList.remove('flipped');
            }
        }
        currentSpread = targetSpread;
    }
    
    function updateMobileView() {
        if (!isMobile) return;
        
        // Hide all pages and faces
        document.querySelectorAll('.page, .front-side, .page-back, .back-cover, .back-cover-solid').forEach(el => {
            el.classList.remove('active-mobile');
        });
        
        const sheetIndex = Math.floor(currentMobilePage / 2);
        const isBack = currentMobilePage % 2 !== 0;
        const sheet = document.getElementById(`sheet-${sheetIndex}`);
        
        if (sheet) {
            sheet.classList.add('active-mobile');
            const sideSelector = isBack ? '.page-back, .back-cover, .back-cover-solid' : '.front-side';
            const side = sheet.querySelector(sideSelector);
            if (side) side.classList.add('active-mobile');
        }
    }
    
    function updateNavButtons() {
        if (isMobile) {
            prevBtn.disabled = false;
            nextBtn.disabled = currentMobilePage >= (totalSheets * 2) - 2;
            
            sheets.forEach(sheet => {
                sheet.style.pointerEvents = '';
            });
        } else {
            prevBtn.disabled = false;
            nextBtn.disabled = currentSpread >= totalSheets - 1;
            
            // Fix click interception on hidden 3D layers and stacking context
            sheets.forEach((sheet, index) => {
                // Flipped pages (Left side) -> Higher index means closer to top
                if (index < currentSpread) {
                    sheet.style.zIndex = index + 10;
                } else {
                    // Unflipped pages (Right side) -> Lower index means closer to top
                    sheet.style.zIndex = (totalSheets - index) + 10;
                }
                sheet.style.pointerEvents = 'none';
            });
            
            const rightPage = document.getElementById(`sheet-${currentSpread}`);
            if (rightPage) {
                rightPage.style.pointerEvents = 'auto';
                rightPage.style.zIndex = String(totalSheets + 30);
            }
            
            if (currentSpread > 0) {
                const leftPage = document.getElementById(`sheet-${currentSpread - 1}`);
                if (leftPage) {
                    leftPage.style.pointerEvents = 'auto';
                    leftPage.style.zIndex = String(totalSheets + 40);
                }
            }
        }
    }

    if (isMobile) {
        updateMobileView();
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // --- Navigation Helpers ---
    function handleNextAction(e) {
        if (isMobile && currentMobilePage === 0) {
            openBtn.click();
        } else if (!isMobile && currentSpread === 0) {
            openBtn.click();
        } else if (!nextBtn.disabled) {
            if (e && e.key === ' ') e.preventDefault(); // prevent scroll down on spacebar
            nextBtn.click();
        }
    }

    function handlePrevAction() {
        if (!prevBtn.disabled) {
            prevBtn.click();
        }
    }

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        // Prevent interfering with any potential inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowRight' || e.key === ' ') {
            handleNextAction(e);
        } else if (e.key === 'ArrowLeft') {
            handlePrevAction();
        }
    });

    // --- Swipe Navigation (Mobile) ---
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50; // minimum swipe distance in pixels
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) < threshold) return;
        
        if (diff < 0) {
            // Swiped left -> Next page
            handleNextAction();
        } else {
            // Swiped right -> Previous page
            handlePrevAction();
        }
    }

});
