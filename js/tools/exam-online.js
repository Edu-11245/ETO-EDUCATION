/* ===== الامتحان الأونلاين (معلم + طالب) ===== */
(function () {
    const EM_ID_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
    let emQuestions = null;
    let emAnswers = null;
    let emUser = null;
    let emFbPromise = null;
    let emAuthBound = false;

    const $ = (id) => document.getElementById(id);

    function emWaitFor(check, ms) {
        return new Promise((resolve, reject) => {
            const started = Date.now();
            (function poll() {
                if (check()) return resolve();
                if (Date.now() - started > ms) return reject(new Error('firebase load timeout'));
                setTimeout(poll, 100);
            })();
        });
    }

    function emLoadFirebase() {
        if (emFbPromise) return emFbPromise;

        emFbPromise = (async () => {
            const base = 'https://www.gstatic.com/firebasejs/9.23.0/';
            const steps = [
                ['firebase-app-compat.js', () => !!window.firebase],
                ['firebase-database-compat.js', () => !!(window.firebase && window.firebase.database)],
                ['firebase-auth-compat.js', () => !!(window.firebase && window.firebase.auth)]
            ];

            for (const [file, ready] of steps) {
                if (ready()) continue;
                if (!document.querySelector('script[src="' + base + file + '"]')) {
                    const s = document.createElement('script');
                    s.src = base + file;
                    document.head.appendChild(s);
                }
                await emWaitFor(ready, 20000);
            }

            const ns = window.firebase;
            const app = ns.apps.find(a => a.name === 'eto-exam') || ns.initializeApp(SUMMARIES_FIREBASE_CONFIG, 'eto-exam');
            return { ns: ns, app: app, db: app.database(), auth: app.auth() };
        })().catch(err => {
            emFbPromise = null;
            throw err;
        });

        return emFbPromise;
    }
    window.emLoadFirebase = emLoadFirebase;
    /* ---------- تسجيل دخول المعلم ---------- */
    function emRefreshAuth(user) {
        emUser = user && !user.isAnonymous ? user : null;
        const text = $('em-auth-text');
        const loginBtn = $('em-login-btn');
        const logoutBtn = $('em-logout-btn');

        if (emUser) {
            text.textContent = 'مسجّل دخول بـ: ' + (emUser.email || emUser.displayName || 'حساب جوجل');
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            text.textContent = 'سجّل دخولك بجوجل عشان تنشر امتحانك وتشوف النتايج بعدين.';
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    }

    async function emInitAuth() {
        try {
            const fb = await window.emLoadFirebase();
            if (!emAuthBound) {
                emAuthBound = true;
                fb.auth.onAuthStateChanged(emRefreshAuth);
            }
        } catch (err) {
            console.error(err);
            $('em-auth-text').textContent = 'تعذر الاتصال بـ Firebase، تأكد من الإنترنت وحدّث الصفحة.';
        }
    }

    async function emLogin() {
        try {
            const fb = await emLoadFirebase();
            await fb.auth.signInWithPopup(new fb.ns.auth.GoogleAuthProvider());
        } catch (err) {
            console.error(err);
            const code = err && err.code;
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
            const msg = code === 'auth/unauthorized-domain' ? 'ضيف دومين الموقع في Authorized domains من إعدادات Firebase Authentication'
                : code === 'auth/operation-not-allowed' ? 'فعّل تسجيل الدخول بجوجل من Firebase Authentication'
                : code === 'auth/popup-blocked' ? 'المتصفح منع النافذة، اسمح بالـ popups وجرّب تاني'
                : 'مقدرناش نسجّل الدخول، جرّب تاني';
            showToast(msg, 'error');
        }
    }

    async function emLogout() {
        try {
            const fb = await emLoadFirebase();
            await fb.auth.signOut();
        } catch (err) {
            console.error(err);
        }
    }

    /* ---------- الملفات ---------- */
    function emReadJson(file, onData) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            let data;
            try {
                data = JSON.parse(ev.target.result);
            } catch (err) {
                showToast('ملف الـ JSON مش سليم، اتأكد من صيغته', 'error');
                return;
            }
            onData(data);
        };
        reader.readAsText(file, 'UTF-8');
    }

    function emCountChoices(item) {
        return Array.isArray(item.answers)
            ? item.answers.filter(a => a !== null && a !== undefined && String(a).trim() !== '').length
            : 0;
    }

    function emFillTitle(data) {
        if (data && data.title && !$('em-title').value.trim()) $('em-title').value = data.title;
    }

    function emLoadQuestions(data) {
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
        const items = list ? list.filter(it => it && (it.text || it.image)) : [];

        if (!items.length) {
            emQuestions = null;
            $('em-q-status').textContent = 'الملف مفيهوش أسئلة';
            showToast('مفيش أسئلة في الملف، تأكد من محتواه', 'error');
            return;
        }

        emQuestions = items;
        const withChoices = items.filter(it => emCountChoices(it) > 0).length;
        $('em-q-status').textContent = `${items.length} سؤال • ${withChoices} اختيار من متعدد`;
        emFillTitle(data);
    }

    function emLoadAnswers(data) {
        if (!data || data.type !== 'eto-answers' || !Array.isArray(data.answers)) {
            emAnswers = null;
            $('em-a-status').textContent = 'ده مش ملف إجابات صادر من الموقع';
            showToast('ده مش ملف إجابات صادر من الموقع', 'error');
            return;
        }

        emAnswers = data;
        $('em-a-status').textContent = `${data.answers.length} إجابة • مجموع الدرجات: ${data.totalPoints || 0}`;
        emFillTitle(data);
    }

    function emCheckMatch() {
        const answers = emAnswers.answers;

        if (answers.length !== emQuestions.length) {
            return `عدد الأسئلة (${emQuestions.length}) مختلف عن عدد الإجابات (${answers.length})، اتأكد إن الملفين لنفس الامتحان`;
        }

        for (let i = 0; i < answers.length; i++) {
            const a = answers[i];
            if (a.correct === null || a.correct === undefined) continue;
            const choices = emCountChoices(emQuestions[i]);
            if (choices === 0 || a.correct >= choices) {
                return `الإجابة الصح للسؤال رقم ${i + 1} مش متوافقة مع اختياراته`;
            }
        }

        return '';
    }

    /* ---------- الوقت والرسالة ---------- */
    function emToLocalInput(d) {
        const pad = n => String(n).padStart(2, '0');
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function emFillDefaultTimes() {
        if ($('em-start').value || $('em-end').value) return;
        const start = new Date();
        start.setHours(start.getHours() + 1, 0, 0, 0);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        $('em-start').value = emToLocalInput(start);
        $('em-end').value = emToLocalInput(end);
    }

    function emBuildMessage(teacherName, title, link, startAt, endAt, durationMin) {
        const s = new Date(startAt);
        const e = new Date(endAt);
        const dayFmt = { weekday: 'long', day: 'numeric', month: 'long' };
        const timeFmt = { hour: 'numeric', minute: '2-digit' };
        const day = s.toLocaleDateString('ar-EG', dayFmt);
        const from = s.toLocaleTimeString('ar-EG', timeFmt);
        const to = s.toDateString() === e.toDateString()
            ? e.toLocaleTimeString('ar-EG', timeFmt)
            : e.toLocaleDateString('ar-EG', dayFmt) + ' ' + e.toLocaleTimeString('ar-EG', timeFmt);

        return [
            '📝 امتحان: ' + title,
            '👨‍🏫 المعلم: ' + teacherName,
            '',
            '📅 ' + day,
            '🕗 من الساعة ' + from + ' إلى ' + to,
            '⏱ مدة الحل: ' + durationMin + ' دقيقة',
            '',
            'ادخل على الرابط، اكتب اسمك ورقم تليفونك وابدأ الامتحان:',
            link,
            '',
            '⚠️ الامتحان بيتفتح مرة واحدة بس، ولو خرجت من الصفحة مش هتقدر ترجع تاني.'
        ].join('\n');
    }

    function emGenId() {
        const bytes = new Uint8Array(8);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, b => EM_ID_CHARS[b % EM_ID_CHARS.length]).join('');
    }

    async function emCopy(text, okMsg) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;left:-10000px;top:0;';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        showToast(okMsg);
    }

    async function emPublish() {
        if (!emUser) {
            showToast('سجّل دخولك بجوجل الأول', 'error');
            return;
        }

        const teacherName = $('em-teacher-name').value.trim();
        const title = $('em-title').value.trim();

        if (!teacherName) return showToast('اكتب اسم المعلم', 'error');
        if (!title) return showToast('اكتب اسم الامتحان', 'error');
        if (!emQuestions) return showToast('ارفع ملف الأسئلة الأول', 'error');
        if (!emAnswers) return showToast('ارفع ملف الإجابات الأول', 'error');

        const mismatch = emCheckMatch();
        if (mismatch) return showToast(mismatch, 'error');

        const startAt = new Date($('em-start').value).getTime();
        const endAt = new Date($('em-end').value).getTime();
        if (isNaN(startAt) || isNaN(endAt)) return showToast('حدد بداية ونهاية الامتحان', 'error');
        if (endAt <= startAt) return showToast('وقت النهاية لازم يكون بعد وقت البداية', 'error');
        if (endAt <= Date.now()) return showToast('وقت النهاية عدّى، اختار وقت في المستقبل', 'error');

        const windowMin = Math.max(1, Math.round((endAt - startAt) / 60000));
        const durInput = parseInt($('em-duration').value, 10);
        const durationMin = durInput > 0 ? Math.min(durInput, windowMin) : windowMin;

        const questions = emQuestions.map(q => {
            const item = { text: String(q.text || ''), lang: q.lang === 'ltr' ? 'ltr' : 'rtl' };
            const choices = Array.isArray(q.answers)
                ? q.answers.filter(a => a !== null && a !== undefined && String(a).trim() !== '').map(String)
                : [];
            if (choices.length) item.answers = choices;
            if (q.image) item.image = String(q.image);
            return item;
        });

        const key = emAnswers.answers.map(a => ({
            correct: a.correct === undefined ? null : a.correct,
            points: Number(a.points) || 0
        }));

        const sizeMB = new Blob([JSON.stringify(questions)]).size / 1048576;
        if (sizeMB > 12) {
            return showToast(`حجم الأسئلة (${sizeMB.toFixed(1)} ميجا) كبير، صغّر صور الأسئلة وجرّب تاني`, 'error');
        }

        showLoad('جاري نشر الامتحان...');

        try {
            const fb = await emLoadFirebase();
            const id = emGenId();
            const totalPoints = Number(emAnswers.totalPoints) || key.reduce((sum, k) => sum + k.points, 0);

            const updates = {};
            updates['exams/' + id] = {
                title: title,
                teacherName: teacherName,
                ownerUid: emUser.uid,
                startAt: startAt,
                endAt: endAt,
                durationMin: durationMin,
                count: questions.length,
                createdAt: fb.ns.database.ServerValue.TIMESTAMP
            };
            updates['examQuestions/' + id] = { ownerUid: emUser.uid, items: questions };
            updates['examKeys/' + id] = { ownerUid: emUser.uid, totalPoints: totalPoints, answers: key };

            await fb.db.ref().update(updates);

            const link = location.origin + location.pathname + '?exam=' + id;
            $('em-link').value = link;
            $('em-message').value = emBuildMessage(teacherName, title, link, startAt, endAt, durationMin);
            $('em-result').classList.remove('hidden');
            $('em-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast('تم نشر الامتحان');
        } catch (err) {
            console.error(err);
            const denied = String((err && (err.code || err.message)) || '').includes('PERMISSION_DENIED');
            showToast(denied ? 'Firebase رفض الكتابة، اتأكد من قواعد الأمان وتسجيل الدخول' : 'حصل خطأ أثناء النشر، جرّب تاني', 'error');
        } finally {
            hideLoad();
        }
    }

    /* ---------- امتحان الطالب ---------- */
    let studentExamData = null;
    let studentExamQuestions = [];
    let studentExamTimer = null;
    let studentExamStartedAt = 0;
    let studentExamDeadline = 0;

    function studentExamFormatDate(ts) {
        const d = new Date(ts);
        return d.toLocaleDateString('ar-EG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Africa/Cairo'
        }) + ' - ' + d.toLocaleTimeString('ar-EG', {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'Africa/Cairo'
        });
    }

    function studentExamSetMessage(text, type) {
        const box = $('student-exam-message');
        box.textContent = text;
        box.className = 'm-5 p-4 rounded-2xl font-bold text-sm leading-7';

        if (type === 'error') {
            box.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-700');
        } else if (type === 'success') {
            box.classList.add('bg-emerald-50', 'border', 'border-emerald-200', 'text-emerald-700');
        } else {
            box.classList.add('bg-sky-50', 'border', 'border-sky-200', 'text-sky-700');
        }

        box.classList.remove('hidden');
    }

    function studentExamFormatCountdown(ms) {
        ms = Math.max(0, ms);
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    }

    function studentExamRenderQuestions() {
        const wrap = $('student-exam-questions');
        wrap.innerHTML = '';

        studentExamQuestions.forEach((q, index) => {
            const box = document.createElement('div');
            box.className = 'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm';
            box.dir = q.lang === 'ltr' ? 'ltr' : 'rtl';

            const title = document.createElement('div');
            title.className = 'flex items-start gap-3 mb-4';

            const num = document.createElement('div');
            num.className = 'shrink-0 w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black';
            num.textContent = String(index + 1);

            const textWrap = document.createElement('div');
            textWrap.className = 'flex-1';

            const qText = document.createElement('div');
            qText.className = 'font-black text-slate-800 dark:text-white leading-7 text-base';
            qText.textContent = q.text || '';

            textWrap.appendChild(qText);
            title.appendChild(num);
            title.appendChild(textWrap);
            box.appendChild(title);

            const choices = Array.isArray(q.answers) ? q.answers : [];

            if (choices.length) {
                const choicesWrap = document.createElement('div');
                choicesWrap.className = 'grid grid-cols-1 md:grid-cols-2 gap-3';

                choices.forEach((choice, choiceIndex) => {
                    const label = document.createElement('label');
                    label.className = 'flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer transition';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = 'student-q-' + index;
                    radio.value = String(choiceIndex);
                    radio.className = 'mt-1 accent-sky-600';

                    const letter = document.createElement('span');
                    letter.className = 'shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs';
                    letter.textContent = String.fromCharCode(65 + choiceIndex);

                    const choiceText = document.createElement('span');
                    choiceText.className = 'font-bold text-slate-700 dark:text-slate-200 leading-6';
                    choiceText.textContent = String(choice);

                    label.appendChild(radio);
                    label.appendChild(letter);
                    label.appendChild(choiceText);
                    choicesWrap.appendChild(label);
                });

                box.appendChild(choicesWrap);
            }

            wrap.appendChild(box);
        });
    }

    function studentExamUpdateLobbyTimer() {
        if (!studentExamData) return;

        const now = Date.now();
        const startAt = Number(studentExamData.startAt);
        const endAt = Number(studentExamData.endAt);
        const btn = $('student-exam-start-btn');

        if (now < startAt) {
            btn.disabled = true;
            $('student-exam-countdown-label').textContent = 'الامتحان هيبدأ بعد';
            $('student-exam-countdown').textContent = studentExamFormatCountdown(startAt - now);
            $('student-exam-start-hint').textContent = 'استنى لحد موعد البداية، وبعدها زر "ابدأ الامتحان" هيتفعل تلقائيًا.';
            return;
        }

        if (now >= endAt) {
            btn.disabled = true;
            $('student-exam-countdown-label').textContent = 'انتهى موعد الامتحان';
            $('student-exam-countdown').textContent = '00:00:00';
            $('student-exam-start-hint').textContent = 'الامتحان لم يعد متاحًا للبدء.';
            studentExamSetMessage('انتهى وقت الامتحان.', 'error');
            clearInterval(studentExamTimer);
            return;
        }

        btn.disabled = false;
        $('student-exam-countdown-label').textContent = 'الامتحان متاح الآن';
        $('student-exam-countdown').textContent = studentExamFormatCountdown(endAt - now);
        $('student-exam-start-hint').textContent = 'اكتب اسمك ورقم تليفونك واضغط "ابدأ الامتحان".';
    }

    function studentExamUpdateRunningTimer() {
        const remaining = studentExamDeadline - Date.now();

        if (remaining <= 0) {
            $('student-exam-running-timer').textContent = '00:00';
            $('student-exam-finished').classList.remove('hidden');
            clearInterval(studentExamTimer);
            return;
        }

        $('student-exam-running-timer').textContent = studentExamFormatCountdown(remaining);
    }

    async function studentExamStart() {
        if (!studentExamData) return;

        const name = $('student-exam-name').value.trim();
        const phone = $('student-exam-phone').value.trim();

        if (!name) {
            showToast('اكتب اسمك الأول', 'error');
            $('student-exam-name').focus();
            return;
        }

        if (!phone) {
            showToast('اكتب رقم التليفون', 'error');
            $('student-exam-phone').focus();
            return;
        }

        const now = Date.now();
        const startAt = Number(studentExamData.startAt);
        const endAt = Number(studentExamData.endAt);

        if (now < startAt) {
            showToast('الامتحان لسه ما بدأش', 'error');
            return;
        }

        if (now >= endAt) {
            showToast('وقت الامتحان انتهى', 'error');
            return;
        }

        try {
            showLoad('جاري تحميل أسئلة الامتحان...');

            const fb = await emLoadFirebase();
            const snap = await fb.db.ref('examQuestions/' + studentExamData.id + '/items').once('value');
            const items = snap.val();

            studentExamQuestions = Array.isArray(items) ? items : [];

            if (!studentExamQuestions.length) {
                throw new Error('NO_QUESTIONS');
            }

            studentExamStartedAt = Date.now();

            const durationMs = Math.max(1, Number(studentExamData.durationMin) || 1) * 60000;
            studentExamDeadline = Math.min(
                Number(studentExamData.endAt),
                studentExamStartedAt + durationMs
            );

            $('student-exam-lobby').classList.add('hidden');
            $('student-exam-running').classList.remove('hidden');

            $('student-exam-running-info').textContent =
                'الطالب: ' + name + ' • ' + phone;

            studentExamRenderQuestions();
            clearInterval(studentExamTimer);
            studentExamTimer = setInterval(studentExamUpdateRunningTimer, 1000);
            studentExamUpdateRunningTimer();

            showToast('بدأ الامتحان');
        } catch (err) {
            console.error(err);
            showToast(
                err && err.message === 'NO_QUESTIONS'
                    ? 'الامتحان موجود لكن مفيش أسئلة مرتبطة به'
                    : 'مقدرناش نحمل أسئلة الامتحان، جرّب تحديث الصفحة',
                'error'
            );
        } finally {
            hideLoad();
        }
    }

    async function emStudentInit() {
        const params = new URLSearchParams(window.location.search);
        const examId = params.get('exam');

        if (!examId) return;

        const app = $('student-exam-app');
        if (!app) return;

        app.classList.remove('hidden');

        try {
            showLoad('جاري تحميل بيانات الامتحان...');

            const fb = await emLoadFirebase();
            if (!fb.auth.currentUser) {
                await fb.auth.signInAnonymously();
            }
            const snap = await fb.db.ref('exams/' + examId).once('value');
            const exam = snap.val();

            if (!exam) {
                studentExamSetMessage('الامتحان غير موجود أو الرابط غير صحيح.', 'error');
                return;
            }
            studentExamData = {
                id: examId,
                title: exam.title || 'امتحان أونلاين',
                teacherName: exam.teacherName || '',
                startAt: Number(exam.startAt) || 0,
                endAt: Number(exam.endAt) || 0,
                durationMin: Number(exam.durationMin) || 1,
                count: Number(exam.count) || 0
            };

            $('student-exam-title').textContent = studentExamData.title;
            $('student-exam-teacher').textContent = studentExamData.teacherName
                ? '👨‍🏫 المعلم: ' + studentExamData.teacherName
                : '';
            $('student-exam-start-time').textContent = studentExamFormatDate(studentExamData.startAt);
            $('student-exam-end-time').textContent = studentExamFormatDate(studentExamData.endAt);
            $('student-exam-duration').textContent = studentExamData.durationMin + ' دقيقة';

            $('student-exam-start-btn').onclick = studentExamStart;

            clearInterval(studentExamTimer);
            studentExamTimer = setInterval(studentExamUpdateLobbyTimer, 1000);
            studentExamUpdateLobbyTimer();
        } catch (err) {
            console.error(err);
            studentExamSetMessage('حصل خطأ أثناء تحميل الامتحان. تأكد من الإنترنت وصحة الرابط.', 'error');
        } finally {
            hideLoad();
        }
    }
    $('student-exam-submit-btn')?.addEventListener('click', studentExamSubmit);

    $('student-exam-results-back')?.addEventListener('click', () => {
        $('student-exam-results-view').classList.add('hidden');
        $('student-exams-list').classList.remove('hidden');
        studentExamsLoad();
    });
    /* ---------- نتائج امتحان الطالب ---------- */

    function studentExamGetAnswers() {
        return studentExamQuestions.map((q, index) => {
            const selected = document.querySelector('input[name="student-q-' + index + '"]:checked');
            return selected ? Number(selected.value) : null;
        });
    }

    async function studentExamSubmit() {
        if (!studentExamData || !studentExamQuestions.length) return;

        const name = $('student-exam-name').value.trim();
        const phone = $('student-exam-phone').value.trim();

        if (!name || !phone) {
            showToast('بيانات الطالب ناقصة', 'error');
            return;
        }

        const submitBtn = $('student-exam-submit-btn');

        const answers = studentExamGetAnswers();
        const unanswered = answers.filter(a => a === null).length;

        if (unanswered > 0) {
            const ok = confirm(`لسه فيه ${unanswered} سؤال بدون إجابة. هل تريد تسليم الامتحان؟`);
            if (!ok) return;
        }

        const alreadySubmittedKey = 'eto-exam-submitted:' + studentExamData.id + ':' + phone;

        if (localStorage.getItem(alreadySubmittedKey)) {
            showToast('تم تسليم هذا الامتحان من هذا الجهاز بالفعل', 'error');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري التصحيح...';

            const fb = await emLoadFirebase();

            const keySnap = await fb.db.ref('examKeys/' + studentExamData.id).once('value');
            const keyData = keySnap.val();

            if (!keyData || !Array.isArray(keyData.answers)) {
                throw new Error('NO_KEY');
            }

            const answerKey = keyData.answers;
            const totalPoints = Number(keyData.totalPoints) || 0;

            let score = 0;
            const wrong = [];

            answerKey.forEach((item, index) => {
                const correct = item && item.correct !== undefined ? Number(item.correct) : null;
                const points = item && Number(item.points) > 0 ? Number(item.points) : 0;
                const studentAnswer = answers[index] === undefined ? null : answers[index];

                if (correct !== null && studentAnswer === correct) {
                    score += points;
                } else {
                    wrong.push({
                        q: index + 1,
                        studentAnswer: studentAnswer,
                        correctAnswer: correct,
                        points: points
                    });
                }
            });

            const percentage = totalPoints > 0
                ? Math.round((score / totalPoints) * 100)
                : 0;

            const submissionId = emGenId();

            const result = {
                examId: studentExamData.id,
                studentName: name,
                phone: phone,
                startedAt: studentExamStartedAt || Date.now(),
                submittedAt: Date.now(),
                score: score,
                totalPoints: totalPoints,
                percentage: percentage,
                answers: answers,
                wrong: wrong
            };

            await fb.db.ref('examResults/' + studentExamData.id + '/' + submissionId).set(result);

            localStorage.setItem(alreadySubmittedKey, JSON.stringify({
                submissionId: submissionId,
                score: score,
                totalPoints: totalPoints,
                percentage: percentage
            }));

            clearInterval(studentExamTimer);

            $('student-exam-submit-btn').classList.add('hidden');
            $('student-exam-result-box').classList.remove('hidden');

            $('student-exam-result-score').textContent = `${score} / ${totalPoints}`;
            $('student-exam-result-percent').textContent = `${percentage}%`;
            $('student-exam-result-note').textContent =
                `عدد الأسئلة التي لم تكن صحيحة: ${wrong.length}`;

            $('student-exam-finished').classList.remove('hidden');

            showToast('تم تسليم الامتحان وتصحيحه');

        } catch (err) {
            console.error(err);
            showToast(
                err && err.message === 'NO_KEY'
                    ? 'ملف الإجابات الخاص بالامتحان غير موجود'
                    : 'حصل خطأ أثناء تسليم الامتحان',
                'error'
            );

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane ml-2"></i> تسليم الامتحان';
        }
    }

    async function studentExamsLoad() {
        const listEl = $('student-exams-list');
        const emptyEl = $('student-exams-empty');
        const loadingEl = $('student-exams-loading');
        const authBox = $('student-exams-auth-box');

        listEl.innerHTML = '';
        emptyEl.classList.add('hidden');
        loadingEl.classList.remove('hidden');
        authBox.classList.add('hidden');

        try {
            const fb = await emLoadFirebase();
            const user = fb.auth.currentUser;

            if (!user || user.isAnonymous) {
                loadingEl.classList.add('hidden');
                authBox.innerHTML = `
                    <div class="flex flex-col md:flex-row items-center justify-between gap-3">
                        <span>سجّل دخولك بجوجل عشان تشوف الامتحانات اللي نشرتها.</span>
                        <button type="button" id="student-exams-login-btn" class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-black transition">
                            <i class="fa-brands fa-google ml-2"></i>تسجيل الدخول بجوجل
                        </button>
                    </div>
                `;
                authBox.classList.remove('hidden');
                $('student-exams-login-btn').onclick = async () => {
                    await emLogin();
                    await studentExamsLoad();
                };
                emptyEl.classList.add('hidden');
                return;
            }

            const snap = await fb.db.ref('exams').orderByChild('ownerUid').equalTo(user.uid).once('value');
            const data = snap.val() || {};

            const exams = Object.entries(data)
                .map(([id, exam]) => ({ id, ...exam }))
                .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

            loadingEl.classList.add('hidden');

            if (!exams.length) {
                emptyEl.classList.remove('hidden');
                return;
            }

            exams.forEach(exam => {
                const card = document.createElement('div');
                card.className = 'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg transition';

                card.innerHTML = `
                    <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl mb-4">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </div>

                    <h3 class="text-lg font-black text-slate-800 dark:text-white mb-2">${escapeHtml(exam.title || 'امتحان')}</h3>

                    <div class="space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-5">
                        <div>👨‍🏫 ${escapeHtml(exam.teacherName || '')}</div>
                        <div>📝 ${Number(exam.count) || 0} سؤال</div>
                        <div>⏱ ${Number(exam.durationMin) || 0} دقيقة</div>
                        <div>📅 ${studentExamFormatDate(Number(exam.startAt))}</div>
                    </div>

                    <button type="button"
                        class="student-results-open-btn w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-black transition">
                        <i class="fa-solid fa-users ml-2"></i>
                        فتح نتائج الطلاب
                    </button>
                `;

                card.querySelector('.student-results-open-btn').addEventListener('click', () => {
                    studentExamsOpenResults(exam);
                });

                listEl.appendChild(card);
            });

        } catch (err) {
            console.error(err);
            loadingEl.classList.add('hidden');
            authBox.textContent = 'مقدرناش نحمل امتحاناتك. اتأكد من تسجيل الدخول والاتصال بالإنترنت.';
            authBox.classList.remove('hidden');
        }
    }

    async function studentExamsOpenResults(exam) {
        const listEl = $('student-exams-list');
        const emptyEl = $('student-exams-empty');
        const resultsView = $('student-exam-results-view');

        try {
            showLoad('جاري تحميل نتائج الطلاب...');

            const fb = await emLoadFirebase();
            const snap = await fb.db.ref('examResults/' + exam.id).once('value');
            const data = snap.val() || {};

            const results = Object.entries(data)
                .map(([id, result]) => ({ id, ...result }))
                .sort((a, b) => Number(b.submittedAt || 0) - Number(a.submittedAt || 0));

            listEl.classList.add('hidden');
            emptyEl.classList.add('hidden');
            resultsView.classList.remove('hidden');

            $('student-exam-results-title').textContent = exam.title || 'نتائج الامتحان';
            $('student-exam-results-meta').textContent =
                `المعلم: ${exam.teacherName || ''} • عدد الطلاب: ${results.length}`;

            const avg = results.length
                ? Math.round(results.reduce((sum, r) => sum + Number(r.score || 0), 0) / results.length)
                : 0;

            const passed = results.filter(r => Number(r.percentage || 0) >= 50).length;

            $('student-exam-results-summary').innerHTML = `
                <div class="rounded-2xl bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">عدد الطلاب</div>
                    <div class="text-2xl font-black text-sky-600 mt-1">${results.length}</div>
                </div>

                <div class="rounded-2xl bg-emerald-50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">متوسط الدرجات</div>
                    <div class="text-2xl font-black text-emerald-600 mt-1">${avg}</div>
                </div>

                <div class="rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">الناجحون</div>
                    <div class="text-2xl font-black text-indigo-600 mt-1">${passed}</div>
                </div>

                <div class="rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">الدرجة النهائية</div>
                    <div class="text-2xl font-black text-amber-600 mt-1">${Number(results[0]?.totalPoints || 0)}</div>
                </div>
            `;

            if (!results.length) {
                $('student-exam-results-table').innerHTML = `
                    <div class="p-10 text-center text-slate-400 font-bold">
                        لسه مفيش طالب سلّم الامتحان.
                    </div>
                `;
                return;
            }

            const rows = results.map((r, index) => `
                <tr class="border-t border-slate-200 dark:border-slate-700">
                    <td class="p-3 font-black">${index + 1}</td>
                    <td class="p-3 font-black">${escapeHtml(r.studentName || '-')}</td>
                    <td class="p-3">${escapeHtml(r.phone || '-')}</td>
                    <td class="p-3 font-black">${Number(r.score || 0)} / ${Number(r.totalPoints || 0)}</td>
                    <td class="p-3 font-black">${Number(r.percentage || 0)}%</td>
                    <td class="p-3">${r.wrong?.length || 0}</td>
                    <td class="p-3">${studentExamFormatDate(Number(r.submittedAt || 0))}</td>
                    <td class="p-3">
                        <button type="button"
                            class="result-details-btn bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-black">
                            التفاصيل
                        </button>
                    </td>
                </tr>
            `).join('');

            $('student-exam-results-table').innerHTML = `
                <table class="w-full text-sm text-right">
                    <thead class="bg-slate-100 dark:bg-slate-800 font-black">
                        <tr>
                            <th class="p-3">#</th>
                            <th class="p-3">الطالب</th>
                            <th class="p-3">الهاتف</th>
                            <th class="p-3">الدرجة</th>
                            <th class="p-3">النسبة</th>
                            <th class="p-3">الغلط</th>
                            <th class="p-3">التسليم</th>
                            <th class="p-3">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;

            [...$('student-exam-results-table').querySelectorAll('.result-details-btn')].forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    studentExamsShowStudentDetails(exam, results[index]);
                });
            });

        } catch (err) {
            console.error(err);
            showToast('مقدرناش نحمل النتائج', 'error');
        } finally {
            hideLoad();
        }
    }

    async function studentExamsShowStudentDetails(exam, result) {
        try {
            const fb = await emLoadFirebase();

            const qSnap = await fb.db.ref('examQuestions/' + exam.id + '/items').once('value');
            const questions = Array.isArray(qSnap.val()) ? qSnap.val() : [];

            const kSnap = await fb.db.ref('examKeys/' + exam.id + '/answers').once('value');
            const key = Array.isArray(kSnap.val()) ? kSnap.val() : [];

            const wrong = Array.isArray(result.wrong) ? result.wrong : [];

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';

            const wrongRows = wrong.map(item => {
                const idx = Number(item.q) - 1;
                const q = questions[idx];
                const choices = Array.isArray(q?.answers) ? q.answers : [];

                const studentText =
                    item.studentAnswer === null || item.studentAnswer === undefined
                        ? 'بدون إجابة'
                        : (choices[item.studentAnswer] || `اختيار ${Number(item.studentAnswer) + 1}`);

                const correctText =
                    item.correctAnswer === null || item.correctAnswer === undefined
                        ? 'غير محددة'
                        : (choices[item.correctAnswer] || `اختيار ${Number(item.correctAnswer) + 1}`);

                return `
                    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
                        <div class="font-black text-slate-800 mb-2">السؤال ${item.q}</div>
                        <div class="text-sm font-bold text-slate-600 mb-3">${escapeHtml(q?.text || '')}</div>
                        <div class="text-sm"><b>إجابة الطالب:</b> ${escapeHtml(String(studentText))}</div>
                        <div class="text-sm text-emerald-700 mt-1"><b>الإجابة الصحيحة:</b> ${escapeHtml(String(correctText))}</div>
                    </div>
                `;
            }).join('');

            modal.innerHTML = `
                <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                    <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-black text-slate-800 dark:text-white">${escapeHtml(result.studentName || 'الطالب')}</h3>
                            <p class="text-xs text-slate-500 mt-1">${escapeHtml(result.phone || '')} • ${Number(result.score || 0)} / ${Number(result.totalPoints || 0)}</p>
                        </div>
                        <button type="button" class="result-modal-close w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="p-5 overflow-y-auto max-h-[75vh]">
                        ${wrongRows || '<div class="text-center p-10 text-emerald-600 font-black">الطالب جاوب كل الأسئلة صح 🎉</div>'}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.result-modal-close').onclick = () => modal.remove();
            modal.addEventListener('click', e => {
                if (e.target === modal) modal.remove();
            });

        } catch (err) {
            console.error(err);
            showToast('مقدرناش نعرض تفاصيل الطالب', 'error');
        }
    }

    $('em-login-btn').addEventListener('click', emLogin);
    $('em-logout-btn').addEventListener('click', emLogout);
    $('em-publish-btn').addEventListener('click', emPublish);
    $('em-questions-btn').addEventListener('click', () => $('em-questions-file').click());
    $('em-answers-btn').addEventListener('click', () => $('em-answers-file').click());
    $('em-copy-link').addEventListener('click', () => emCopy($('em-link').value, 'تم نسخ اللينك'));
    $('em-copy-msg').addEventListener('click', () => emCopy($('em-message').value, 'تم نسخ الرسالة'));
    $('em-wa-btn').addEventListener('click', () => {
        window.open('https://wa.me/?text=' + encodeURIComponent($('em-message').value), '_blank');
    });

    $('em-questions-file').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) emReadJson(file, emLoadQuestions);
        e.target.value = '';
    });

    $('em-answers-file').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) emReadJson(file, emLoadAnswers);
        e.target.value = '';
    });

    const _navigate = window.navigate;
    window.navigate = function (pageId, addHistory) {
        _navigate(pageId, addHistory);

        if (pageId === 'exam-maker') {
            emFillDefaultTimes();
            emInitAuth();
        }

        if (pageId === 'student-exams') {
            emInitAuth();
            studentExamsLoad();
        }
    };

    emStudentInit();
})();
