(function(){
    'use strict';

    if(window.__etoRobotUIStarted) return;
    window.__etoRobotUIStarted = true;

    function boot(){
        const root = document.getElementById('eto-robot-root');
        if(!root) return;

        let bubble = document.getElementById('eto-robot-bubble');

        if(!bubble){
            bubble = document.createElement('div');
            bubble.id = 'eto-robot-bubble';
            bubble.setAttribute('aria-live','polite');
            bubble.setAttribute('role','status');

            bubble.innerHTML = `
                <div id="eto-robot-bubble-text"></div>
                <span id="eto-robot-bubble-key">R</span>
            `;

            root.appendChild(bubble);
        }

        const text = document.getElementById('eto-robot-bubble-text');
        const key = document.getElementById('eto-robot-bubble-key');

        bubble.addEventListener('pointerup', event => {
            event.stopPropagation();
            hideBubble();
            openChat();
        });

        let hideTimer = null;
        let attentionTimer = null;
        let lastShown = 0;

        function isMobile(){
            return window.matchMedia('(max-width:640px)').matches;
        }

        function setText(message,showKey){
            text.textContent = message;
            key.hidden = !showKey;
        }

        function hideBubble(){
            bubble.classList.remove('show');
            root.classList.remove('eto-robot-attention');
        }

        function showBubble(message,showKey=true,duration=5500){
            clearTimeout(hideTimer);
            clearTimeout(attentionTimer);

            setText(message,showKey);

            bubble.classList.remove('show');

            void bubble.offsetWidth;

            bubble.classList.add('show');
            root.classList.add('eto-robot-attention');

            lastShown = Date.now();

            hideTimer = setTimeout(
                hideBubble,
                duration
            );
        }

        function scheduleAttention(){
            clearTimeout(attentionTimer);

            if(document.hidden) return;
            if(root.dataset.mode !== 'idle') return;

            const delay = 60000 + Math.random() * 30000;

            attentionTimer = setTimeout(() => {

                if(root.dataset.mode !== 'idle'){
                    return;
                }

                if(Date.now() - lastShown < 7000){
                    scheduleAttention();
                    return;
                }

                if(isMobile()){

                    showBubble(
                        'لو وقفت معاك حاجة أنا موجود، دوس عليا وقولي محتاج إيه',
                        false,
                        5000
                    );

                }else{

                    showBubble(
                        'لو وقفت معاك حاجة أنا موجود، دوس R وقولي محتاج إيه',
                        true,
                        6500
                    );
                }

            },delay);
        }

        root.addEventListener(
            'eto-robot-mode',
            event => {

                if(event.detail?.mode === 'idle'){
                    scheduleAttention();
                }else{
                    clearTimeout(attentionTimer);
                    hideBubble();
                }
            }
        );

        document.addEventListener(
            'visibilitychange',
            () => {

                if(document.hidden){
                    clearTimeout(attentionTimer);
                    hideBubble();
                }else{
                    scheduleAttention();
                }

            }
        );

        window.addEventListener(
            'keydown',
            event => {

                if(
                    event.key?.toLowerCase() !== 'r'
                ){
                    return;
                }

                if(
                    event.ctrlKey ||
                    event.altKey ||
                    event.metaKey
                ){
                    return;
                }

                const tag =
                    event.target?.tagName?.toLowerCase();

                if(
                    tag === 'input' ||
                    tag === 'textarea' ||
                    tag === 'select' ||
                    event.target?.isContentEditable
                ){
                    return;
                }

                event.preventDefault();

                hideBubble();
                openChat();

                window.dispatchEvent(
                    new CustomEvent(
                        'eto-robot-help-requested'
                    )
                );
            }
        );

        let overlay = null;

        function openChat(){
            if(!overlay){
                overlay = document.createElement('div');
                overlay.id = 'eto-robot-chat-overlay';

                const iframe = document.createElement('iframe');

                iframe.src = 'Robot/robot-chat.html';
                iframe.title = 'مساعد Eto.Edu';

                overlay.appendChild(iframe);
                document.body.appendChild(overlay);

                overlay.addEventListener('click', event => {
                    if(event.target === overlay) closeChat();
                });
            }

            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        }

        function closeChat(){
            if(overlay){
                overlay.classList.remove('show');
            }
        }

        window.addEventListener('message', event => {
            if(event.data === 'eto-robot-close-chat'){
                closeChat();
            }
        });

        window.EtoRobotUI = {
            show: showBubble,
            hide: hideBubble,
            openChat,
            closeChat
        };

        scheduleAttention();
    }

    window.EtoRobotUIInit = boot;

    if(document.readyState !== 'loading'){
        boot();
    }else{
        document.addEventListener(
            'DOMContentLoaded',
            boot,
            {once:true}
        );
    }

})();