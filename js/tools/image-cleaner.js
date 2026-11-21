/* ===== تنظيف صور المحاضرات ===== */
        const iCan = document.getElementById('img-canvas'), iCtx = iCan.getContext('2d', { willReadFrequently: true });
        let rawImg = new Image();
        document.getElementById('img-cleaner-file').onchange = (e) => {
            if(!e.target.files.length) return;
            const r = new FileReader();
            r.onload = (ev) => {
                rawImg.onload = () => {
                    document.getElementById('img-cleaner-workspace').classList.remove('hidden');
                    iCan.width = rawImg.width; iCan.height = rawImg.height; applyImgTheme();
                };
                rawImg.src = ev.target.result;
            };
            r.readAsDataURL(e.target.files[0]); showToast('تم الرفع');
        };
        document.getElementById('img-theme').onchange = applyImgTheme;
        function applyImgTheme() {
            iCtx.drawImage(rawImg, 0, 0); const theme = document.getElementById('img-theme').value;
            if(theme === 'original') return;
            const imgData = iCtx.getImageData(0, 0, iCan.width, iCan.height);
            iCtx.putImageData(processPixels(imgData, theme), 0, 0);
        }
        document.getElementById('img-export').onclick = () => {
            const link = document.createElement('a'); link.download = 'Cleaned_Image.jpg'; link.href = iCan.toDataURL('image/jpeg', 0.9); link.click();
            showToast('تم تحميل الصورة');
        };
