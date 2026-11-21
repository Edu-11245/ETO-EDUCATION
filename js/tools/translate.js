/* ===== المترجم ===== */
    const GOOGLE_TRANSLATE_URL =
        'https://translate.googleapis.com/translate_a/single';

    function etoEgyptianizeArabic(text){

        if(!text){
            return '';
        }

        if(
            window.EtoEgyptianTranslationData &&
            typeof window.EtoEgyptianTranslationData.egyptianize === 'function'
        ){

            return window.EtoEgyptianTranslationData.egyptianize(
                String(text).trim()
            );

        }

        return String(text).trim();
    }

    async function etoTranslateText(){

        const input = document.getElementById('translate-input');
        const source = document.getElementById('translate-source');
        const target = document.getElementById('translate-target');
        const result = document.getElementById('translate-result');
        const egyptian = document.getElementById('translate-egy-result');
        const button = document.getElementById('translate-btn');

        if(!input || !result || !egyptian || !button) return;

        const text = input.value.trim();

        if(!text){

            result.textContent = 'اكتب كلمة أو نص الأول.';

            egyptian.textContent =
                'اكتب اللي عايز تترجمه وأنا هظبطهولك.';

            return;
        }

        button.disabled = true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري الترجمة...';

        result.classList.add('translate-loading');
        egyptian.classList.add('translate-loading');

        result.textContent = '';
        egyptian.textContent = '';

        try{

            const sourceLanguage =
                source.value || 'auto';

            const targetLanguage =
                target.value || 'en';

            const url =
                GOOGLE_TRANSLATE_URL +
                '?client=gtx' +
                '&sl=' + encodeURIComponent(sourceLanguage) +
                '&tl=' + encodeURIComponent(targetLanguage) +
                '&dt=t' +
                '&q=' + encodeURIComponent(text);

            const response =
                await fetch(url);

            if(!response.ok){
                throw new Error(
                    'Translation request failed'
                );
            }

            const data =
                await response.json();

            const translated =
                Array.isArray(data?.[0])
                    ? data[0]
                        .map(item => item?.[0] || '')
                        .join('')
                    : '';

            if(!translated){
                throw new Error(
                    'Empty translation'
                );
            }

            result.classList.remove(
                'translate-loading'
            );

            egyptian.classList.remove(
                'translate-loading'
            );

            result.classList.remove(
                'translate-result-pop'
            );

            egyptian.classList.remove(
                'translate-result-pop'
            );

            void result.offsetWidth;
            void egyptian.offsetWidth;

            result.classList.add(
                'translate-result-pop'
            );

            egyptian.classList.add(
                'translate-result-pop'
            );

            result.textContent =
                translated;

            if(targetLanguage === 'ar'){

                egyptian.textContent =
                    etoEgyptianizeArabic(
                        translated
                    );

            }else{

                egyptian.textContent =
                    'اختار الترجمة للعربي عشان أقدر أطلعلك المعنى بالمصري.';
            }

        }catch(error){

            console.error(
                '[Eto Translate]',
                error
            );

            result.classList.remove(
                'translate-loading'
            );

            egyptian.classList.remove(
                'translate-loading'
            );

            result.textContent =
                'حصلت مشكلة في الترجمة، جرّب تاني.';

            egyptian.textContent =
                'ممكن تكون الخدمة مش متاحة دلوقتي، جرّب بعد شوية.';

        }finally{

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-wand-magic-sparkles ml-2"></i> ترجم دلوقتي';
        }
    }

    const translateButton =
        document.getElementById('translate-btn');

    if(translateButton){

        translateButton.addEventListener(
            'click',
            etoTranslateText
        );

    }
