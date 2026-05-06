export function createNavigationController({ elements }) {
    const { openBtn, bookContainer, navControls, prevBtn, nextBtn, tocBtn, sheets } = elements;
    const totalSheets = sheets.length;

    let currentSpread = 0; // 0 = Cover. 1 = Spread 1 (Sheet 1 front).
    let currentMobilePage = 0; // Mobile: 0=Cover Front, 1=Cover Back, 2=Sheet1 Front...
    let isMobile = window.innerWidth <= 1000;

    function getIsMobile() {
        return isMobile;
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

    function flipToSpread(targetSpread) {
        if (targetSpread > currentSpread) {
            for (let i = currentSpread; i < targetSpread; i += 1) {
                const sheet = document.getElementById(`sheet-${i}`);
                if (sheet) sheet.classList.add('flipped');
            }
        } else if (targetSpread < currentSpread) {
            for (let i = currentSpread - 1; i >= targetSpread; i -= 1) {
                const sheet = document.getElementById(`sheet-${i}`);
                if (sheet) sheet.classList.remove('flipped');
            }
        }
        currentSpread = targetSpread;
    }

    function updateMobileView() {
        if (!isMobile) return;

        document.querySelectorAll('.front-side, .page-back').forEach((el) => {
            el.classList.remove('active-mobile');
        });

        if (currentMobilePage === 0) {
            const cover = document.querySelector('#sheet-0 .front-side');
            if (cover) cover.classList.add('active-mobile');
            return;
        }

        const sheetIndex = Math.floor(currentMobilePage / 2);
        const showBack = currentMobilePage % 2 !== 0;
        const sheet = document.getElementById(`sheet-${sheetIndex}`);
        if (!sheet) return;

        const side = showBack ? sheet.querySelector('.page-back') : sheet.querySelector('.front-side');
        if (side) side.classList.add('active-mobile');
    }

    function updateNavButtons() {
        if (isMobile) {
            prevBtn.disabled = false;
            nextBtn.disabled = currentMobilePage >= (totalSheets * 2) - 2;
            sheets.forEach((sheet) => {
                sheet.style.pointerEvents = '';
            });
            return;
        }

        prevBtn.disabled = false;
        nextBtn.disabled = currentSpread >= totalSheets - 1;

        // Keep only active pages clickable and prioritize their stacking order.
        sheets.forEach((sheet, index) => {
            if (index < currentSpread) {
                sheet.style.zIndex = String(index + 10);
            } else {
                sheet.style.zIndex = String((totalSheets - index) + 10);
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

    function bindWindowEvents() {
        window.addEventListener('resize', () => {
            const wasMobile = isMobile;
            isMobile = window.innerWidth <= 1000;

            if (wasMobile !== isMobile) {
                currentSpread = 0;
                currentMobilePage = 0;
                sheets.forEach((sheet) => sheet.classList.remove('flipped'));
                bookContainer.classList.remove('open');
                navControls.classList.remove('visible');
                updateMobileView();
            }

            updateNavButtons();
        });
    }

    function bindNavigationEvents() {
        openBtn.addEventListener('click', () => {
            if (isMobile) {
                currentMobilePage = 2;
                updateMobileView();
                navControls.classList.add('visible');
                updateNavButtons();
                return;
            }

            const coverSheet = document.getElementById('sheet-0');
            if (coverSheet) coverSheet.classList.add('flipped');
            bookContainer.classList.add('open');

            setTimeout(() => {
                navControls.classList.add('visible');
                currentSpread = 1;
                updateNavButtons();
            }, 500);
        });

        document.querySelectorAll('.toc-link').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetSpreadNum = Number.parseInt(
                    event.currentTarget.getAttribute('data-target'),
                    10,
                );
                if (Number.isNaN(targetSpreadNum)) return;

                if (isMobile) {
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
                if (currentMobilePage < (totalSheets * 2) - 2) {
                    currentMobilePage += 1;
                    updateMobileView();
                }
            } else if (currentSpread < totalSheets - 1) {
                const sheetToFlip = document.getElementById(`sheet-${currentSpread}`);
                if (sheetToFlip) sheetToFlip.classList.add('flipped');
                currentSpread += 1;
            }
            updateNavButtons();
        });

        prevBtn.addEventListener('click', () => {
            if (isMobile) {
                if (currentMobilePage > 2) {
                    currentMobilePage -= 1;
                    updateMobileView();
                } else if (currentMobilePage === 2) {
                    currentMobilePage = 0;
                    updateMobileView();
                    navControls.classList.remove('visible');
                }
            } else if (currentSpread > 1) {
                currentSpread -= 1;
                const sheetToUnflip = document.getElementById(`sheet-${currentSpread}`);
                if (sheetToUnflip) sheetToUnflip.classList.remove('flipped');
            } else if (currentSpread === 1) {
                const coverSheet = document.getElementById('sheet-0');
                if (coverSheet) coverSheet.classList.remove('flipped');
                bookContainer.classList.remove('open');
                navControls.classList.remove('visible');
                currentSpread = 0;
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
    }

    function init() {
        bindWindowEvents();
        bindNavigationEvents();

        if (isMobile) {
            updateMobileView();
        }
        updateNavButtons();
    }

    return {
        init,
        getIsMobile,
        getVisibleReadingLinks,
    };
}
