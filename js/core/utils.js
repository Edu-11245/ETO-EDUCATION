
function escapeHtml(s){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
window.ETO_LOADERS = window.ETO_LOADERS || {};

window.ETO_LOADERS.loadTesseract = function () {
    if (window.Tesseract) {
        return Promise.resolve(window.Tesseract);
    }

    if (!window.ETO_LOADERS.tesseractPromise) {
        window.ETO_LOADERS.tesseractPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js';
            script.async = true;

            script.onload = () => {
                if (window.Tesseract) {
                    resolve(window.Tesseract);
                } else {
                    window.ETO_LOADERS.tesseractPromise = null;
                    reject(new Error('Tesseract.js failed to initialize'));
                }
            };

            script.onerror = () => {
                window.ETO_LOADERS.tesseractPromise = null;
                reject(new Error('Failed to load Tesseract.js'));
            };

            document.head.appendChild(script);
        });
    }

    return window.ETO_LOADERS.tesseractPromise;
};
// تحميل مكتبات الأدوات عند الحاجة فقط
window.ETO_LOADERS = window.ETO_LOADERS || {};

window.ETO_LOADERS.loadXLSX = function () {
    if (window.XLSX) {
        return Promise.resolve(window.XLSX);
    }

    if (!window.ETO_LOADERS.xlsxPromise) {
        window.ETO_LOADERS.xlsxPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.src = 'Data/Lib/xlsx.full.min.js';
            script.async = true;

            script.onload = () => {
                if (window.XLSX) {
                    resolve(window.XLSX);
                } else {
                    window.ETO_LOADERS.xlsxPromise = null;
                    reject(new Error('XLSX failed to initialize'));
                }
            };

            script.onerror = () => {
                window.ETO_LOADERS.xlsxPromise = null;
                reject(new Error('Failed to load XLSX'));
            };

            document.head.appendChild(script);
        });
    }

    return window.ETO_LOADERS.xlsxPromise;
};

window.ETO_LOADERS.loadSortable = function () {
    if (window.Sortable) {
        return Promise.resolve(window.Sortable);
    }

    if (!window.ETO_LOADERS.sortablePromise) {
        window.ETO_LOADERS.sortablePromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.src = 'Data/Lib/Sortable.min.js';
            script.async = true;

            script.onload = () => {
                if (window.Sortable) {
                    resolve(window.Sortable);
                } else {
                    window.ETO_LOADERS.sortablePromise = null;
                    reject(new Error('Sortable failed to initialize'));
                }
            };

            script.onerror = () => {
                window.ETO_LOADERS.sortablePromise = null;
                reject(new Error('Failed to load Sortable'));
            };

            document.head.appendChild(script);
        });
    }

    return window.ETO_LOADERS.sortablePromise;
};
window.ETO_LOADERS.loadPDFJS = function () {
    if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = './Data/Lib/pdf.worker.min.js';
        return Promise.resolve(window.pdfjsLib);
    }

    if (!window.ETO_LOADERS.pdfjsPromise) {
        window.ETO_LOADERS.pdfjsPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.src = './Data/Lib/pdf.min.js';
            script.async = true;

            script.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = './Data/Lib/pdf.worker.min.js';
                    resolve(window.pdfjsLib);
                } else {
                    window.ETO_LOADERS.pdfjsPromise = null;
                    reject(new Error('PDF.js failed to initialize'));
                }
            };

            script.onerror = () => {
                window.ETO_LOADERS.pdfjsPromise = null;
                reject(new Error('Failed to load PDF.js'));
            };

            document.head.appendChild(script);
        });
    }

    return window.ETO_LOADERS.pdfjsPromise;
};