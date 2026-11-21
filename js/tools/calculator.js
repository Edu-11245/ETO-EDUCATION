/* ===== بلوك 9 (كان في index.html من سطر 10591) ===== */
;
(function(){
    'use strict';

    const state = {
        initialized:false,
        mathReady:false,
        mathPromise:null,
        mathLivePromise:null,
        lastResult:null,
        angle:'DEG'
    };

    function $(id){
        return document.getElementById(id);
    }

    function loadMathJs(){

        if(window.math){
            state.mathReady = true;
            return Promise.resolve(window.math);
        }

        if(state.mathPromise){
            return state.mathPromise;
        }

        state.mathPromise = new Promise((resolve,reject)=>{

            const script = document.createElement('script');

            script.src =
                'Data/Lib/math.js';

            script.async = true;

            script.onload = () => {

                if(window.math){

                    state.mathReady = true;

                    resolve(
                        window.math
                    );

                }else{

                    reject(
                        new Error(
                            'math.js loaded without math global'
                        )
                    );

                }

            };

            script.onerror = () => {

                reject(
                    new Error(
                        'Failed to load math.js'
                    )
                );

            };

            document.head.appendChild(script);

        });

        return state.mathPromise;
    }

    function loadMathLive(){

        if(window.MathfieldElement){

            window.MathfieldElement.fontsDirectory =
                'Data/Lib/MathLive/fonts';

            window.MathfieldElement.soundsDirectory =
                null;

            return Promise.resolve(
                window.MathfieldElement
            );
        }

        if(state.mathLivePromise){
            return state.mathLivePromise;
        }

        state.mathLivePromise = new Promise((resolve,reject)=>{

            const script =
                document.createElement('script');

            script.src =
                'Data/Lib/MathLive/mathlive.min.js';

            script.async = true;

            script.onload = async () => {

                try{

                    await customElements.whenDefined(
                        'math-field'
                    );

                    if(window.MathfieldElement){

                        window.MathfieldElement.fontsDirectory =
                            'Data/Lib/MathLive/fonts';

                        window.MathfieldElement.soundsDirectory =
                            null;
                    }

                    resolve(
                        window.MathfieldElement || true
                    );

                }catch(error){

                    reject(error);

                }

            };

            script.onerror = () => {

                reject(
                    new Error(
                        'Failed to load MathLive'
                    )
                );

            };

            document.head.appendChild(script);

        });

        return state.mathLivePromise;
    }

    function setStatus(
        text,
        isError=false
    ){

        const status =
            $('eto-calc-status');

        if(!status) return;

        status.textContent =
            text;

        status.classList.toggle(
            'text-red-500',
            isError
        );

        status.classList.toggle(
            'text-emerald-400',
            !isError
        );
    }

    function setButtonsDisabled(
        disabled
    ){

        document
            .querySelectorAll(
                '#page-calculator .eto-calc-key'
            )
            .forEach(btn => {

                btn.disabled =
                    disabled;

                btn.style.opacity =
                    disabled
                        ? '.55'
                        : '';

            });
    }

    function getMathField(){

        return $('eto-calc-field');

    }

    function fieldLatex(){

        const mf =
            getMathField();

        return mf
            ? String(
                mf.getValue('latex') || ''
            )
            : '';

    }

    function insertLatex(
        value,
        selectionMode='after'
    ){

        const mf =
            getMathField();

        if(!mf) return;

        mf.focus();

        mf.insert(
            value,
            {
                selectionMode
            }
        );
    }

    function endsWithOperator(
        latex
    ){

        return /[+\-*/^=({[,\s]$/.test(
            latex
        );

    }

    function insertFunction(
        name
    ){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? `\\${name}(#?)`
                : `\\${name}(#@)`;

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertSqrt(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '\\sqrt{#?}'
                : '\\sqrt{#@}';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertFraction(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '\\frac{#?}{#?}'
                : '\\frac{#@}{#?}';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertSquare(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '#?^2'
                : '#@^2';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertPower(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '#?^{#?}'
                : '#@^{#?}';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertFactorial(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '#?!'
                : '#@!';

        insertLatex(
            token,
            'after'
        );
    }

    function removeLast(){

        const mf =
            getMathField();

        if(!mf) return;

        mf.focus();

        mf.executeCommand(
            'deleteBackward'
        );
    }

    function clearAll(){

        const mf =
            getMathField();

        const result =
            $('eto-calc-result');

        if(mf){

            mf.setValue(
                ''
            );

            mf.focus();

        }

        if(result){

            result.textContent =
                '0';

        }

        setStatus(
            state.mathReady
                ? 'جاهز'
                : 'جاري تجهيز الآلة...'
        );
    }

    function angleFactor(){

        return state.angle === 'DEG'
            ? Math.PI / 180
            : 1;
    }

    function fromRadians(
        value
    ){

        return state.angle === 'DEG'
            ? value * 180 / Math.PI
            : value;
    }

    function buildScope(){

        const factor =
            angleFactor();

        const sin =
            value =>
                Math.sin(
                    Number(value) *
                    factor
                );

        const cos =
            value =>
                Math.cos(
                    Number(value) *
                    factor
                );

        const tan =
            value =>
                Math.tan(
                    Number(value) *
                    factor
                );

        return {

            ans:
                state.lastResult === null ||
                typeof state.lastResult === 'undefined'
                    ? 0
                    : state.lastResult,

            sin,

            cos,

            tan,

            csc:
                value =>
                    1 / sin(value),

            sec:
                value =>
                    1 / cos(value),

            cot:
                value =>
                    1 / tan(value),

            log10:
                value =>
                    Math.log10(
                        Number(value)
                    ),

            ln:
                value =>
                    Math.log(
                        Number(value)
                    ),

            asin:
                value =>
                    fromRadians(
                        Math.asin(
                            Number(value)
                        )
                    ),

            acos:
                value =>
                    fromRadians(
                        Math.acos(
                            Number(value)
                        )
                    ),

            atan:
                value =>
                    fromRadians(
                        Math.atan(
                            Number(value)
                        )
                    )
        };
    }

    function readGroup(
        str,
        index
    ){

        if(
            str[index] !== '{'
        ){

            return {
                value:
                    str[index] || '',

                next:
                    index + 1
            };

        }

        let depth =
            0;

        for(
            let i = index;
            i < str.length;
            i++
        ){

            if(
                str[i] === '{'
            ){

                depth++;

            }else if(
                str[i] === '}'
            ){

                depth--;

                if(depth === 0){

                    return {

                        value:
                            str.slice(
                                index + 1,
                                i
                            ),

                        next:
                            i + 1
                    };

                }

            }

        }

        throw new Error(
            'Unclosed group'
        );
    }

    function readAtom(
        str,
        index
    ){

        if(
            str[index] === '{'
        ){

            return readGroup(
                str,
                index
            );

        }

        let j =
            index;

        while(
            j < str.length &&
            /[A-Za-z0-9.]/.test(
                str[j]
            )
        ){

            j++;

        }

        if(j === index){

            return {

                value:
                    str[index] || '',

                next:
                    index + 1

            };

        }

        return {

            value:
                str.slice(
                    index,
                    j
                ),

            next:
                j
        };
    }

    function latexToMathJs(
        input
    ){

        const source =
            String(input || '')
                .replace(
                    /\\left|\\right|\\displaystyle|\\textstyle/g,
                    ''
                )
                .replace(
                    /\\!|\\,|\\;|\\:/g,
                    ''
                )
                .trim();

        const commands = {

            sin:'sin',

            cos:'cos',

            tan:'tan',

            csc:'csc',

            sec:'sec',

            cot:'cot',

            ln:'ln',

            log:'log10',

            pi:'pi',

            cdot:'*',

            times:'*',

            div:'/'
        };

        function convert(
            str
        ){

            let out =
                '';

            for(
                let i = 0;
                i < str.length;
            ){

                const ch =
                    str[i];

                if(
                    ch === '\\'
                ){

                    let j =
                        i + 1;

                    while(
                        j < str.length &&
                        /[A-Za-z]/.test(
                            str[j]
                        )
                    ){

                        j++;

                    }

                    const command =
                        str.slice(
                            i + 1,
                            j
                        );

                    if(
                        command === 'frac'
                    ){

                        const numerator =
                            readGroup(
                                str,
                                j
                            );

                        const denominator =
                            readGroup(
                                str,
                                numerator.next
                            );

                        out +=
                            '(' +
                            convert(
                                numerator.value
                            ) +
                            ')/(' +
                            convert(
                                denominator.value
                            ) +
                            ')';

                        i =
                            denominator.next;

                        continue;
                    }

                    if(
                        command === 'sqrt'
                    ){

                        let cursor =
                            j;

                        if(
                            str[cursor] === '['
                        ){

                            const end =
                                str.indexOf(
                                    ']',
                                    cursor + 1
                                );

                            cursor =
                                end >= 0
                                    ? end + 1
                                    : cursor;

                        }

                        const inside =
                            readGroup(
                                str,
                                cursor
                            );

                        out +=
                            'sqrt(' +
                            convert(
                                inside.value
                            ) +
                            ')';

                        i =
                            inside.next;

                        continue;
                    }

                    if(
                        command === 'operatorname'
                    ){

                        const inside =
                            readGroup(
                                str,
                                j
                            );

                        out +=
                            convert(
                                inside.value
                            );

                        i =
                            inside.next;

                        continue;
                    }

                    if(
                        command === 'text'
                    ){

                        const inside =
                            readGroup(
                                str,
                                j
                            );

                        out +=
                            convert(
                                inside.value
                            );

                        i =
                            inside.next;

                        continue;
                    }

                    out +=
                        commands[command] ??
                        command;

                    i =
                        j;

                    continue;
                }

                if(
                    ch === '{'
                ){

                    const group =
                        readGroup(
                            str,
                            i
                        );

                    out +=
                        '(' +
                        convert(
                            group.value
                        ) +
                        ')';

                    i =
                        group.next;

                    continue;
                }

                if(
                    ch === '^'
                ){

                    const atom =
                        readAtom(
                            str,
                            i + 1
                        );

                    out +=
                        '^(' +
                        convert(
                            atom.value
                        ) +
                        ')';

                    i =
                        atom.next;

                    continue;
                }

                if(
                    ch === '_'
                ){

                    const atom =
                        readAtom(
                            str,
                            i + 1
                        );

                    i =
                        atom.next;

                    continue;
                }

                if(
                    /\s/.test(ch)
                ){

                    i++;

                    continue;
                }

                out +=
                    ch;

                i++;
            }

            return out;
        }

        let expression =
            convert(
                source
            )
            .replace(
                /(\d|\))(?=(pi|ans|[A-Za-z]))/g,
                '$1*'
            )
            .replace(
                /(\d|\)|pi|ans)(?=\()/g,
                '$1*'
            )
            .replace(
                /(\))(?=[A-Za-z])/g,
                '$1*'
            );

        return expression;
    }

    function formatResult(
        math,
        value
    ){

        if(
            typeof value === 'number'
        ){

            if(
                Number.isNaN(value)
            ){

                return 'NaN';

            }

            if(
                !Number.isFinite(value)
            ){

                return value > 0
                    ? '∞'
                    : '-∞';

            }

            return math.format(
                value,
                {
                    precision:14
                }
            );
        }

        try{

            return math.format(
                value,
                {
                    precision:14
                }
            );

        }catch(e){

            return String(value);

        }
    }

    function escapeHtml(
        value
    ){

        return String(
            value ?? ''
        )
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        );
    }

    function getHistory(){

        try{

            const items =
                JSON.parse(
                    localStorage.getItem(
                        'eto-calculator-history'
                    ) || '[]'
                );

            return Array.isArray(items)
                ? items
                : [];

        }catch(e){

            return [];

        }
    }

    function saveHistory(
        expression,
        result
    ){

        try{

            const old =
                getHistory();

            old.unshift({

                expression,

                result,

                time:
                    new Date()
                        .toLocaleString(
                            'ar-EG'
                        )

            });

            localStorage.setItem(
                'eto-calculator-history',
                JSON.stringify(
                    old
                )
            );

        }catch(e){}

        renderHistory();
    }

    async function renderHistory(){

        const wrap =
            $('eto-calc-history-page');

        if(!wrap) return;

        const items =
            getHistory();

        if(!items.length){

            wrap.innerHTML = `
                <div class="eto-calc-empty-history">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <strong>لسه مفيش عمليات محفوظة</strong>
                    <span>كل عملية بتحسبها هتظهر هنا تلقائيًا.</span>
                </div>
            `;

            return;
        }

        try{

            await loadMathLive();

        }catch(e){}

        wrap.innerHTML =
            items.map(
                (item,index) => `

                    <div
                        class="eto-calc-history-item"
                        role="button"
                        tabindex="0"
                        data-history-index="${index}"
                    >

                        <math-field
                            class="eto-calc-history-math"
                            read-only
                            math-virtual-keyboard-policy="manual"
                        ></math-field>

                        <div class="eto-calc-history-result">
                            = ${escapeHtml(
                                item.result
                            )}
                        </div>

                        <div class="eto-calc-history-meta">
                            ${escapeHtml(
                                item.time || ''
                            )}
                        </div>

                    </div>

                `
            )
            .join('');

        wrap
            .querySelectorAll(
                '[data-history-index]'
            )
            .forEach(
                itemEl => {

                    const index =
                        Number(
                            itemEl.dataset
                                .historyIndex
                        );

                    const mathField =
                        itemEl.querySelector(
                            'math-field'
                        );

                    const item =
                        items[index];

                    if(
                        mathField &&
                        item
                    ){

                        mathField.value =
                            item.expression || '';

                    }

                    const openItem =
                        () => {

                            const selected =
                                getHistory()[index];

                            if(!selected)
                                return;

                            navigate(
                                'calculator'
                            );

                            requestAnimationFrame(
                                () => {

                                    const mf =
                                        getMathField();

                                    if(mf){

                                        mf.setValue(
                                            selected.expression ||
                                            ''
                                        );

                                        mf.focus();

                                    }

                                }
                            );
                        };

                    itemEl.addEventListener(
                        'click',
                        openItem
                    );

                    itemEl.addEventListener(
                        'keydown',
                        event => {

                            if(
                                event.key === 'Enter' ||
                                event.key === ' '
                            ){

                                event.preventDefault();

                                openItem();

                            }

                        }
                    );

                }
            );
    }

    async function calculate(){

        const resultEl =
            $('eto-calc-result');

        const mf =
            getMathField();

        if(
            !resultEl ||
            !mf
        ){

            return;
        }

        const latex =
            fieldLatex().trim();

        if(!latex){

            resultEl.textContent =
                '0';

            return;
        }

        try{

            const math =
                await loadMathJs();

            const expression =
                latexToMathJs(
                    latex
                );

            const result =
                math.evaluate(
                    expression,
                    buildScope()
                );

            state.lastResult =
                result;

            const formatted =
                formatResult(
                    math,
                    result
                );

            resultEl.textContent =
                formatted;

            saveHistory(
                latex,
                formatted
            );

            setStatus(
                'تم الحساب'
            );

        }catch(error){

            console.error(
                '[Eto Calculator]',
                error
            );

            resultEl.textContent =
                'خطأ';

            setStatus(
                'راجع العملية الحسابية',
                true
            );
        }
    }

    async function copyResult(){

        const result =
            $('eto-calc-result')
                ?.textContent ||
            '';

        if(
            !result ||
            result === '0' ||
            result === 'خطأ'
        ){

            return;

        }

        try{

            await navigator.clipboard.writeText(
                result
            );

            setStatus(
                'تم نسخ النتيجة'
            );

        }catch(e){

            setStatus(
                'النسخ مش متاح دلوقتي',
                true
            );

        }
    }

    function updateAngle(){

        const btn =
            $('eto-calc-angle');

        if(btn){

            btn.textContent =
                state.angle;

        }
    }

    function handleButton(
        btn
    ){

        const action =
            btn.dataset.action;

        const value =
            btn.dataset.value;

        const fn =
            btn.dataset.function;

        if(
            action === 'clear'
        ){

            clearAll();

            return;
        }

        if(
            action === 'delete'
        ){

            removeLast();

            return;
        }

        if(
            action === 'equals'
        ){

            calculate();

            return;
        }

        if(
            action === 'copy'
        ){

            copyResult();

            return;
        }

        if(
            action === 'history'
        ){

            navigate(
                'calculator-history'
            );

            requestAnimationFrame(
                renderHistory
            );

            return;
        }

        if(
            action === 'angle'
        ){

            state.angle =
                state.angle === 'DEG'
                    ? 'RAD'
                    : 'DEG';

            updateAngle();

            setStatus(
                `الوضع ${state.angle}`
            );

            return;
        }

        if(
            action === 'ans'
        ){

            insertLatex(
                'ans',
                'after'
            );

            return;
        }

        if(
            action === 'fraction'
        ){

            insertFraction();

            return;
        }

        if(
            action === 'sqrt'
        ){

            insertSqrt();

            return;
        }

        if(
            action === 'square'
        ){

            insertSquare();

            return;
        }

        if(
            action === 'power'
        ){

            insertPower();

            return;
        }

        if(fn){

            insertFunction(
                fn
            );

            return;
        }

        if(
            typeof value === 'string'
        ){

            if(
                value === '!'
            ){

                insertFactorial();

            }else{

                insertLatex(
                    value,
                    'after'
                );

            }
        }
    }

    function wire(){

        if(
            state.initialized
        ){

            renderHistory();

            return;
        }

        if(
            !$('page-calculator')
        ){

            return;
        }

        state.initialized =
            true;

        document
            .querySelectorAll(
                '#page-calculator .eto-calc-key'
            )
            .forEach(
                btn => {

                    btn.addEventListener(
                        'click',
                        () =>
                            handleButton(btn)
                    );

                }
            );

        $('eto-calc-history-back')
            ?.addEventListener(
                'click',
                () =>
                    navigate(
                        'calculator'
                    )
            );

        $('eto-calc-clear-history')
            ?.addEventListener(
                'click',
                () => {

                    try{

                        localStorage.removeItem(
                            'eto-calculator-history'
                        );

                    }catch(e){}

                    renderHistory();

                }
            );

        const mf =
            getMathField();

        mf?.addEventListener(
            'keydown',
            event => {

                if(
                    event.key === 'Enter'
                ){

                    event.preventDefault();

                    calculate();

                }

                if(
                    event.key === 'Escape'
                ){

                    event.preventDefault();

                    clearAll();

                }

            }
        );

        updateAngle();

        setButtonsDisabled(
            true
        );

        setStatus(
            'جاري تجهيز الآلة...'
        );

        Promise.all([
            loadMathLive(),
            loadMathJs()
        ])
        .then(
            () => {

                setButtonsDisabled(
                    false
                );

                setStatus(
                    'جاهز'
                );

            }
        )
        .catch(
            () => {

                setButtonsDisabled(
                    false
                );

                setStatus(
                    'تعذر تحميل المكتبة',
                    true
                );

            }
        );
    }

    window.initEtoCalculator =
        wire;

})();
