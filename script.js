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
        
        // Hide all sides
        document.querySelectorAll('.front-side, .page-back').forEach(el => {
            el.classList.remove('active-mobile');
        });
        
        if (currentMobilePage === 0) {
            const cover = document.querySelector('#sheet-0 .front-side');
            if (cover) cover.classList.add('active-mobile');
        } else {
            const sheetIndex = Math.floor(currentMobilePage / 2);
            const isBack = currentMobilePage % 2 !== 0;
            const sheet = document.getElementById(`sheet-${sheetIndex}`);
            if (sheet) {
                const side = isBack ? sheet.querySelector('.page-back') : sheet.querySelector('.front-side');
                if (side) side.classList.add('active-mobile');
            }
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
            if (rightPage) rightPage.style.pointerEvents = 'auto';
            
            if (currentSpread > 0) {
                const leftPage = document.getElementById(`sheet-${currentSpread - 1}`);
                if (leftPage) leftPage.style.pointerEvents = 'auto';
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
});
