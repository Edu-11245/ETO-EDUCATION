/* ===== PWA: زر التثبيت + Service Worker ===== */
        let deferredPrompt;
        const installBtn = document.getElementById('app-download-btn');
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) {
                installBtn.classList.remove('hidden');
                installBtn.classList.add('flex');
            }
        });
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') deferredPrompt = null;
                    installBtn.classList.add('hidden');
                    installBtn.classList.remove('flex');
                }
            });
        }
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js').catch(err => console.error('SW register failed:', err));
            });
        }
