(function(){
    'use strict';

    if(window.__etoRobotStarted) return;
    window.__etoRobotStarted = true;

    const ROBOT_CONFIG = {
        sheet: 'Robot/robot.png',
        frameCount: 6,
        frameCols: 2,
        frameRows: 3,
        desktopSize: 96,
        mobileSize: 82,
        frameDuration: 110,
        walkSpeedDesktop: 58,
        walkSpeedMobile: 44,
        idleMin: 1800,
        idleMax: 3800,
        edgeGap: 18,
        zIndex: 999999,
        thoughtInterval: 45000,
        thoughtDuration: 7000
    };

    const state = {
        root: null,
        sprite: null,
        frame: 0,
        frameTimer: 0,
        lastTime: 0,
        x: 0,
        targetX: 0,
        direction: 1,
        mode: 'idle',
        idleUntil: 0,
        initialized: false,

        reducedMotion: false,
        thought: null,
        thoughtTimer: null,
        thoughtHideTimer: null,
        pathLine: null
    };

    function getSize(){
        return window.innerWidth <= 640
            ? ROBOT_CONFIG.mobileSize
            : ROBOT_CONFIG.desktopSize;
    }

    function isMobile(){
        return window.innerWidth <= 640;
    }

    function getSpeed(){
        return window.innerWidth <= 640
            ? ROBOT_CONFIG.walkSpeedMobile
            : ROBOT_CONFIG.walkSpeedDesktop;
    }

    function randomBetween(min,max){
        return min + Math.random() * (max - min);
    }

    function clamp(value,min,max){
        return Math.min(Math.max(value,min),max);
    }
    function getBackButtonSafeZone(){

        const backBtn = document.getElementById('back-to-home-btn');

        if(
            !backBtn ||
            backBtn.classList.contains('hidden')
        ){
            return null;
        }

        const rect = backBtn.getBoundingClientRect();

        return {
            left: rect.left - 18,
            right: rect.right + 18
        };
    }
    function updatePathSafeZone(){

        if(!state.pathLine) return;

        const safeZone = getBackButtonSafeZone();

        if(!safeZone){

            state.pathLine.style.background =
                'linear-gradient(90deg,#1d4ed8,#2563eb,#1d4ed8)';

            state.pathLine.style.opacity = '0.9';

            return;
        }

        const width = Math.max(window.innerWidth,1);

        const left =
            clamp(safeZone.left,0,width);

        const right =
            clamp(safeZone.right,left,width);

        const leftPct =
            (left / width) * 100;

        const rightPct =
            (right / width) * 100;

        state.pathLine.style.background =
            `linear-gradient(
                90deg,
                #1d4ed8 0%,
                #2563eb ${Math.max(leftPct - 4,0)}%,
                transparent ${leftPct}%,
                transparent ${rightPct}%,
                #2563eb ${Math.min(rightPct + 4,100)}%,
                #1d4ed8 100%
            )`;

        state.pathLine.style.opacity = '0.9';
    }

    function injectCss(){

        if(document.querySelector('link[data-eto-robot-css]')){
            return Promise.resolve();
        }

        return new Promise(resolve => {

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = 'Robot/robot.css';
            link.dataset.etoRobotCss = '1';

            link.onload = () => resolve();
            link.onerror = () => resolve();

            document.head.appendChild(link);
        });
    }

    function createDom(){

        if(document.getElementById('eto-robot-root')){

            state.root = document.getElementById('eto-robot-root');
            state.sprite = document.getElementById('eto-robot-sprite');

            return;
        }

        const root = document.createElement('div');

        root.id = 'eto-robot-root';
        root.setAttribute('aria-hidden','true');
        root.dataset.mode = 'idle';
        root.style.setProperty('position','absolute','important');
        root.style.setProperty('bottom','-14px','important');
        root.style.top = 'auto';
        root.style.zIndex = String(ROBOT_CONFIG.zIndex);
        root.style.overflow = 'visible';
        root.style.pointerEvents = 'none';
        root.style.height = `${getSize()}px`;
        const ground = document.createElement('div');

        ground.id = 'eto-robot-ground';
        ground.style.setProperty('position','relative','important');
        ground.style.left = '0';
        ground.style.right = '0';
        ground.style.bottom = 'auto';
        ground.style.height = '10px';
        ground.style.borderRadius = '18px 18px 0 0';
        ground.style.background =
            'linear-gradient(180deg,rgba(148,163,184,.20),rgba(100,116,139,.08))';
        ground.style.borderTop =
            '2px solid rgba(100,116,139,.42)';
        ground.style.boxShadow =
            '0 -6px 20px rgba(100,116,139,.12), inset 0 1px 0 rgba(255,255,255,.35)';
        ground.style.pointerEvents = 'none';
        ground.style.zIndex = String(ROBOT_CONFIG.zIndex - 2);

        const pathLine = document.createElement('div');

        pathLine.style.position = 'absolute';
        pathLine.style.left = '0';
        pathLine.style.right = '0';
        pathLine.style.top = '2px';
        state.pathLine = pathLine;
        pathLine.style.height = '6px';
        pathLine.style.borderRadius = '999px';
        pathLine.style.background =
            'linear-gradient(90deg,#1d4ed8,#2563eb,#1d4ed8)';
        pathLine.style.opacity = '0.9';

        ground.appendChild(pathLine);

        const footer =
            document.querySelector('body > footer');

        if(footer){
            footer.parentNode.insertBefore(
                ground,
                footer
            );
        }else{
            document.body.appendChild(ground);
        }
        const sprite = document.createElement('div');

        sprite.id = 'eto-robot-sprite';
        sprite.style.pointerEvents = 'auto';
        sprite.style.cursor = 'pointer';
        sprite.style.transition =
            'filter .2s ease, transform .2s ease';

        sprite.addEventListener('mouseenter', function(){

            sprite.style.filter =
                'drop-shadow(0 0 10px rgba(37,99,235,.85)) drop-shadow(0 8px 12px rgba(15,23,42,.25))';

            sprite.style.transform =
                state.direction > 0
                    ? 'scaleX(-1) scale(1.08)'
                    : 'scaleX(1) scale(1.08)';

            if(state.thought){

                state.thought.firstChild.textContent =
                    'عايز/ه حاجة؟ ';

                state.thought.classList.add('show');

                updateThoughtPosition();

            }

        });

        sprite.addEventListener('mouseleave', function(){

            sprite.style.filter = '';

            updateDirection();

            if(state.thought){
                state.thought.classList.remove('show');
            }

        });
        sprite.addEventListener('click', function(event){

            event.preventDefault();
            event.stopPropagation();

            window.location.href =
                './Robot/robot-chat.html';

        });

        sprite.style.setProperty(
            '--eto-robot-sheet',
            `url("${ROBOT_CONFIG.sheet}")`
        );

        sprite.style.transformOrigin = 'center center';
        root.appendChild(sprite);
        ground.appendChild(root);

        state.root = root;
        state.sprite = sprite;
    }

    function createThoughtBubble(){

        if(state.thought) return;

        const style = document.createElement('style');

        style.id = 'eto-thought-style';

        style.textContent = `
            #eto-robot-thought{
                position:fixed !important;
                left:0;
                top:0;
                width:max-content;
                max-width:180px;
                min-width:74px;
                padding:7px 11px;
                border:1px solid #e2cb59;
                border-radius:6px 15px 15px 15px;
                background:linear-gradient(135deg,#fffdf1 0%,#fff3a1 100%);
                color:#202b44;
                font-family:'Cairo',sans-serif;
                font-size:9px;
                font-weight:900;
                line-height:1.55;
                text-align:center;
                box-shadow:0 10px 24px rgba(15,23,42,.18),0 3px 8px rgba(15,23,42,.08);
                z-index:2147483647 !important;
                opacity:0;
                visibility:hidden;
                display:block !important;
                pointer-events:auto;
                cursor:pointer;
                outline:none;
                appearance:none;
                -webkit-appearance:none;
                transition:opacity .4s ease,transform .4s cubic-bezier(.16,1,.3,1),visibility .4s ease,box-shadow .2s ease;
            }

            #eto-robot-thought.show{
                opacity:1 !important;
                visibility:visible !important;
                transform:translateY(0) rotate(-1deg) scale(1);
            }

            #eto-robot-thought:hover{
                transform:translateY(-2px) rotate(-1deg) scale(1.03);
                box-shadow:0 14px 28px rgba(15,23,42,.22),0 4px 9px rgba(15,23,42,.10);
            }

            #eto-robot-thought:active{
                transform:translateY(0) rotate(-1deg) scale(.97);
            }

            #eto-robot-thought::before{
                content:"✎";
                position:absolute;
                top:-8px;
                left:7px;
                width:19px;
                height:19px;
                border-radius:6px;
                background:#2563eb;
                color:#fff;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:8px;
                box-shadow:0 3px 9px rgba(37,99,235,.28);
            }

            #eto-robot-thought::after{
                content:"";
                position:absolute;
                left:18px;
                bottom:-6px;
                width:11px;
                height:11px;
                background:#fff3a1;
                border-right:1px solid #e2cb59;
                border-bottom:1px solid #e2cb59;
                transform:rotate(45deg);
            }

            .eto-thought-dots{
                display:inline-flex;
                gap:3px;
                margin-right:3px;
                vertical-align:middle;
            }

            .eto-thought-dots span{
                width:3px;
                height:3px;
                border-radius:50%;
                background:#2563eb;
                animation:etoThoughtDot 1.05s infinite ease-in-out;
            }

            .eto-thought-dots span:nth-child(2){
                animation-delay:.14s;
            }

            .eto-thought-dots span:nth-child(3){
                animation-delay:.28s;
            }

            @keyframes etoThoughtDot{
                0%,60%,100%{
                    opacity:.25;
                    transform:translateY(0);
                }
                30%{
                    opacity:1;
                    transform:translateY(-3px);
                }
            }

            @media(max-width:640px){
                #eto-robot-thought{
                    max-width:150px;
                    min-width:66px;
                    padding:6px 9px;
                    font-size:8.5px;
                }
            }
        `;

        document.head.appendChild(style);

        const thought = document.createElement('button');

        thought.id = 'eto-robot-thought';
        thought.type = 'button';
        thought.setAttribute('aria-label','فتح مساعد Eto.Edu');

        thought.innerHTML =
            'محتاج مساعدة؟ ' +
            '<span class="eto-thought-dots">' +
            '<span></span><span></span><span></span>' +
            '</span>';

        document.body.appendChild(thought);

        state.thought = thought;
    }

    function updateThoughtPosition(){

        if(!state.root || !state.thought) return;

        const rect = state.root.getBoundingClientRect();
        const bubble = state.thought.getBoundingClientRect();

        const left =
            rect.left +
            (rect.width / 2) -
            (bubble.width / 2);

        const top =
            Math.max(
                8,
                rect.top -
                bubble.height -
                10
            );

        state.thought.style.left =
            `${Math.round(left)}px`;

        state.thought.style.top =
            `${Math.round(top)}px`;
    }


    function startThoughtCycle(){

        if(!state.thought) return;

        const showThought = () => {

            if(!state.thought) return;

            if(
                state.root &&
                state.root.classList.contains('eto-robot-hidden')
            ){
                return;
            }

            updateThoughtPosition();
            const thoughtMessages = [
                'محتاج حاجة؟',
                'محتاج مساعدة؟',
                'أساعدك في حاجة؟',
                'عايز تسأل عن حاجة؟',
                'في حاجة مش واضحة؟',
                'تحب أساعدك؟'
            ];

            const randomMessage =
                thoughtMessages[
                    Math.floor(
                        Math.random() * thoughtMessages.length
                    )
                ];

            state.thought.firstChild.textContent =
                randomMessage + ' ';
            state.thought.classList.add('show');

            clearTimeout(state.thoughtHideTimer);

            state.thoughtHideTimer = setTimeout(() => {

                if(!state.thought) return;

                state.thought.classList.remove('show');

            },ROBOT_CONFIG.thoughtDuration);
        };

        state.thoughtTimer = setInterval(
            showThought,
            ROBOT_CONFIG.thoughtInterval
        );
    }

    function setFrame(frame){

        state.frame =
            ((frame % ROBOT_CONFIG.frameCount)
            + ROBOT_CONFIG.frameCount)
            % ROBOT_CONFIG.frameCount;

        const size = getSize();

        const col =
            state.frame % ROBOT_CONFIG.frameCols;

        const row =
            Math.floor(
                state.frame /
                ROBOT_CONFIG.frameCols
            );

        if(state.sprite){

            state.sprite.style.backgroundSize =
                `${size * ROBOT_CONFIG.frameCols}px ${size * ROBOT_CONFIG.frameRows}px`;

            state.sprite.style.backgroundPosition =
                `${-col * size}px ${-row * size}px`;
        }
    }

    function updateDirection(){

        if(!state.root || !state.sprite) return;

        state.root.classList.remove(
            'eto-robot-facing-left'
        );

        state.sprite.style.transform =
            state.direction > 0
                ? 'scaleX(-1) scale(1)'
                : 'scaleX(1) scale(1)';
    }

    function updatePosition(){

        if(!state.root) return;

        const size = getSize();

        const minX = ROBOT_CONFIG.edgeGap;

        const maxX = Math.max(
            0,
            window.innerWidth
            - size
            - ROBOT_CONFIG.edgeGap
        );

        state.x = clamp(
            state.x,
            minX,
            maxX
        );

        const safeZone = getBackButtonSafeZone();

        if(safeZone){

            const robotLeft = state.x;
            const robotRight = state.x + size;

            const overlaps =
                robotLeft < safeZone.right &&
                robotRight > safeZone.left;

            if(overlaps){

                const leftTarget =
                    safeZone.left - size - 12;

                const rightTarget =
                    safeZone.right + 12;

                if(leftTarget >= minX){

                    state.x = clamp(
                        leftTarget,
                        minX,
                        maxX
                    );

                }else if(rightTarget <= maxX){

                    state.x = clamp(
                        rightTarget,
                        minX,
                        maxX
                    );

                }else{

                    state.x =
                        state.x <
                        (window.innerWidth / 2)
                            ? minX
                            : maxX;

                }

                state.targetX = state.x;
            }
        }

        state.root.style.left =
            `${Math.round(state.x)}px`;

        updatePathSafeZone();
        updateThoughtPosition();
    }

    function emitModeChange(){

        if(!state.root) return;

        state.root.dispatchEvent(
            new CustomEvent('eto-robot-mode',{
                detail:{
                    mode:state.mode
                }
            })
        );
    }

    function chooseNextWalk(){

        const size = getSize();

        const minX = ROBOT_CONFIG.edgeGap;

        const maxX = Math.max(
            minX,
            window.innerWidth
            - size
            - ROBOT_CONFIG.edgeGap
        );

        const safeZone = getBackButtonSafeZone();

        let next = randomBetween(minX,maxX);

        if(safeZone){

            const robotRight = next + size;

            const overlaps =
                next < safeZone.right &&
                robotRight > safeZone.left;

            if(overlaps){

                const leftTarget =
                    safeZone.left - size - 12;

                const rightTarget =
                    safeZone.right + 12;

                const canGoLeft =
                    leftTarget >= minX;

                const canGoRight =
                    rightTarget <= maxX;

                if(canGoLeft && canGoRight){

                    next =
                        Math.abs(state.x - leftTarget)
                        <
                        Math.abs(state.x - rightTarget)
                            ? leftTarget
                            : rightTarget;

                }else if(canGoLeft){

                    next = leftTarget;

                }else if(canGoRight){

                    next = rightTarget;

                }else{

                    next =
                        state.x < safeZone.left
                            ? minX
                            : maxX;

                }
            }
        }

        if(
            Math.abs(next - state.x)
            < Math.max(80,window.innerWidth * 0.15)
        ){

            const normalLeft = minX;
            const normalRight = maxX;

            if(safeZone){

                const leftTarget =
                    safeZone.left - size - 12;

                const rightTarget =
                    safeZone.right + 12;

                const choices = [];

                if(leftTarget >= normalLeft){
                    choices.push(leftTarget);
                }

                if(rightTarget <= normalRight){
                    choices.push(rightTarget);
                }

                if(choices.length){

                    next =
                        choices[
                            Math.floor(
                                Math.random() * choices.length
                            )
                        ];

                }else{

                    next =
                        state.x < (window.innerWidth / 2)
                            ? normalRight
                            : normalLeft;

                }

            }else{

                next =
                    state.x < (window.innerWidth / 2)
                        ? normalRight
                        : normalLeft;
            }
        }

        state.targetX = clamp(next,minX,maxX);

        state.direction =
            state.targetX >= state.x ? 1 : -1;

        state.mode = 'walking';

        state.root.dataset.mode = 'walking';

        state.root.classList.remove(
            'eto-robot-paused'
        );

        updateDirection();
        emitModeChange();
    }

    function chooseIdle(){

        state.mode = 'idle';

        state.root.dataset.mode = 'idle';

        state.root.classList.add(
            'eto-robot-paused'
        );

        setFrame(0);

        state.idleUntil =
            performance.now()
                + randomBetween(
                    ROBOT_CONFIG.idleMin,
                    ROBOT_CONFIG.idleMax
                );

        emitModeChange();
    }

    function step(timestamp){

        if(!state.lastTime){
            state.lastTime = timestamp;
        }

        const dt =
            Math.min(
                64,
                timestamp - state.lastTime
            );

        state.lastTime = timestamp;

        if(state.mode === 'walking'){

            const distance =
                state.targetX - state.x;

            const stepDistance =
                getSpeed() * dt / 1000;

            if(
                Math.abs(distance)
                <= stepDistance
            ){

                state.x =
                    state.targetX;

                updatePosition();

                chooseIdle();

            }else{

                state.x +=
                    Math.sign(distance)
                    * stepDistance;

                state.frameTimer += dt;

                if(
                    !state.reducedMotion
                    && state.frameTimer
                    >= ROBOT_CONFIG.frameDuration
                ){

                    state.frameTimer = 0;

                    setFrame(
                        state.frame + 1
                    );
                }

                updatePosition();
            }

        }else{

            if(
                timestamp >=
                state.idleUntil
            ){
                chooseNextWalk();
            }
        }

        updateThoughtPosition();

        requestAnimationFrame(step);
    }

    function reveal(){

        if(!state.root) return;

        state.root.classList.remove(
            'eto-robot-hidden'
        );

        updateThoughtPosition();
    }

    function hide(){

        if(!state.root) return;

        state.root.classList.add(
            'eto-robot-hidden'
        );

        if(state.thought){
            state.thought.classList.remove('show');
        }
    }

    window.addEventListener('message', function(event){

        if(event.data !== 'eto-robot-close-chat') return;

        if(state.thought){
            state.thought.classList.remove('show');
        }

        reveal();
    });

    function start(){

        if(state.initialized) return;

        state.initialized = true;

        state.reducedMotion =
            window.matchMedia
            &&
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

        const size = getSize();

        state.x =
            Math.max(
                ROBOT_CONFIG.edgeGap,
                window.innerWidth
                - size
                - ROBOT_CONFIG.edgeGap
            );

        updatePosition();

        setFrame(0);

        state.direction = 1;

        updateDirection();

        chooseIdle();

        reveal();

        createThoughtBubble();

        updateThoughtPosition();

        startThoughtCycle();

        state.root.addEventListener(
            'pointerup',
            event => {

                if(!isMobile()) return;

                if(event.pointerType === 'mouse'){
                    return;
                }

                if(state.mode === 'idle'){
                    chooseNextWalk();
                }
            },
            {passive:true}
        );

        requestAnimationFrame(step);

        window.addEventListener(
            'resize',
            () => {

                updatePosition();

                updatePathSafeZone();

                setFrame(
                    state.frame
                );

                state.root.style.height =
                    `${getSize()}px`;

            },
            {passive:true}
        );
    }

    function setup(){

        createDom();

        start();

        if(window.EtoRobotUIInit){

            window.EtoRobotUIInit();

        }else{

            const waitForUI = setInterval(() => {

                if(window.EtoRobotUIInit){

                    clearInterval(waitForUI);

                    window.EtoRobotUIInit();
                }

            },50);

            setTimeout(() => {

                clearInterval(waitForUI);

            },5000);
        }
    }

    window.EtoRobot = {

        start,

        hide,

        show: reveal,

        walk: chooseNextWalk,

        idle: chooseIdle,

        setFrame,

        getState: () => ({
            ...state
        })
    };

    if(
        document.readyState === 'loading'
    ){

        document.addEventListener(
            'DOMContentLoaded',
            setup,
            {once:true}
        );

    }else{

        setup();
    }

})();