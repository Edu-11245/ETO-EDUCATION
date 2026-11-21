        const desktopLinks = document.querySelector('.hidden.lg\\:flex.space-x-5.space-x-reverse').innerHTML;
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.innerHTML = desktopLinks.replace(/px-2 py-4/g, 'block w-full text-right px-4 py-3 border-b hover:bg-gray-50 text-gray-700 dark:hover:bg-slate-800 dark:text-gray-200');
        document.getElementById('mobile-menu-btn').onclick = () => mobileMenu.classList.toggle('hidden');

        let globalOperationCancelled = false;
        let globalOperationId = 0;

        function showLoad(txt) {
            globalOperationCancelled = false;
            globalOperationId++;

            document.getElementById('global-loading-txt').textContent = txt;
            document.getElementById('global-loading').classList.remove('hidden');
            document.getElementById('progress-container').classList.add('hidden');
            document.getElementById('progress-text').classList.add('hidden');
            document.getElementById('progress-bar').style.width = '0%';

            const cancelBtn = document.getElementById('global-loading-cancel');
            if (cancelBtn) {
                cancelBtn.disabled = false;
                cancelBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> إلغاء العملية';
            }
        }

        function hideLoad() {
            document.getElementById('global-loading').classList.add('hidden');
        }

        function isOperationCancelled() {
            return globalOperationCancelled;
        }

        document.getElementById('global-loading-cancel')?.addEventListener('click', () => {
            globalOperationCancelled = true;

            const cancelBtn = document.getElementById('global-loading-cancel');
            if (cancelBtn) {
                cancelBtn.disabled = true;
                cancelBtn.classList.add('opacity-50', 'cursor-not-allowed');
                cancelBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإلغاء...';
            }

            hideLoad();
            showToast('تم إلغاء العملية', 'error');
        });
        async function updateProgress(percent, txt) {
            document.getElementById('progress-container').classList.remove('hidden');
            document.getElementById('progress-text').classList.remove('hidden');
            document.getElementById('progress-bar').style.width = percent + '%';
            document.getElementById('progress-text').textContent = percent + '% ' + (txt ? '- ' + txt : '');
            await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
        }

        function hexToRgb(hex) { let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : {r:0, g:0, b:0}; }
