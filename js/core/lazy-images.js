/* ===== تحميل كسول لصور الموديولات ===== */
        (() => {
            const images = document.querySelectorAll('.eto-module-image img[data-src]');
            if (!images.length) return;

            const loadImage = (img) => {
                const src = img.dataset.src;
                if (!src) return;

                img.src = src;
                img.removeAttribute('data-src');
            };

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach((entry, index) => {
                        if (!entry.isIntersecting) return;

                        const img = entry.target;

                        setTimeout(() => {
                            loadImage(img);
                        }, index * 70);

                        obs.unobserve(img);
                    });
                }, {
                    rootMargin: '180px 0px'
                });

                images.forEach(img => observer.observe(img));
            } else {
                images.forEach(loadImage);
            }
        })();
