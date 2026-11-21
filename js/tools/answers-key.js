/* ===== بلوك 6 (كان في index.html من سطر 8955) ===== */
;
/* ===== ملف الإجابات + تصدير أسئلة الشيت JSON ===== */
(function () {
    const AK_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'];
    let akRows = [];

    function akDownload(filename, blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function akSafeName(text, fallback) {
        const clean = String(text || '').replace(/[\\/:*?"<>|]+/g, ' ').trim();
        return clean || fallback;
    }

    function akReadJsonFile(file, onData) {
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

    function akRender() {
        const wrap = document.getElementById('ak-table');
        const actions = document.getElementById('ak-actions');
        const summary = document.getElementById('ak-summary');
        if (!wrap) return;

        if (!akRows.length) {
            wrap.innerHTML = '';
            actions.classList.add('hidden');
            summary.classList.add('hidden');
            return;
        }

        wrap.innerHTML = akRows.map((row, i) => {
            const picks = row.opts > 0
                ? Array.from({ length: row.opts }, (_, k) => `
                    <button type="button" data-ak-pick="${i}:${k}" class="w-10 h-10 rounded-full border-2 text-sm font-bold transition ${row.correct === k ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-emerald-400'}">${AK_LETTERS[k] || (k + 1)}</button>`).join('')
                : '<span class="text-xs text-gray-400 font-bold">سؤال مقالي - مش بيتصحح تلقائي</span>';

            const pointsBox = row.opts > 0
                ? `<label class="flex items-center gap-2 text-xs font-bold text-gray-500 shrink-0">الدرجة
                        <input type="number" min="0" step="0.5" value="${row.points}" data-ak-points="${i}" class="w-20 p-2 border rounded-lg text-center dark:text-gray-800 bg-white">
                   </label>`
                : '';

            return `
                <div class="flex items-center gap-3 flex-wrap p-3 border rounded-xl bg-gray-50 dark:bg-slate-900/40 dark:border-slate-600">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black shrink-0">${i + 1}</div>
                    <div class="flex gap-2 flex-wrap flex-1">${picks}</div>
                    ${pointsBox}
                </div>`;
        }).join('');

        actions.classList.remove('hidden');
        summary.classList.remove('hidden');
        akUpdateSummary();
    }

    function akUpdateSummary() {
        const summary = document.getElementById('ak-summary');
        if (!summary) return;
        const graded = akRows.filter(r => r.opts > 0);
        const done = graded.filter(r => r.correct !== null).length;
        const total = graded.reduce((sum, r) => sum + (Number(r.points) || 0), 0);
        summary.textContent = `تم تحديد ${done} من ${graded.length} إجابة • مجموع الدرجات: ${total}`;
    }

    function akBuild(force) {
        const count = Math.min(200, Math.max(1, parseInt(document.getElementById('ak-count').value, 10) || 0));
        const opts = parseInt(document.getElementById('ak-opts').value, 10) || 4;
        const points = Number(document.getElementById('ak-points').value);
        const pts = isNaN(points) || points < 0 ? 1 : points;

        if (!force && akRows.some(r => r.correct !== null) && !confirm('ده هيمسح الإجابات اللي اخترتها، متأكد؟')) return;

        document.getElementById('ak-count').value = count;
        akRows = Array.from({ length: count }, () => ({ opts: opts, correct: null, points: pts }));
        akRender();
    }

    function akCollect() {
        if (!akRows.length) {
            showToast('جهّز جدول الأسئلة الأول', 'error');
            return null;
        }

        const missing = akRows.findIndex(r => r.opts > 0 && r.correct === null);
        if (missing >= 0) {
            showToast(`حدد الإجابة الصح للسؤال رقم ${missing + 1}`, 'error');
            return null;
        }

        const answers = akRows.map((r, i) => ({
            q: i + 1,
            opts: r.opts,
            correct: r.opts > 0 ? r.correct : null,
            points: r.opts > 0 ? (Number(r.points) || 0) : 0
        }));

        return {
            type: 'eto-answers',
            v: 1,
            title: (document.getElementById('ak-title').value || '').trim(),
            total: answers.length,
            totalPoints: answers.reduce((sum, a) => sum + a.points, 0),
            answers: answers
        };
    }

    function akExportJson() {
        const data = akCollect();
        if (!data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        akDownload(akSafeName(data.title, 'ملف الإجابات') + ' - إجابات.json', blob);
        showToast('تم تحميل ملف الإجابات');
    }

    async function akExportPdf() {
        const data = akCollect();
        if (!data) return;

        if (!window.html2canvas || !window.jspdf) {
            showToast('تعذر تحميل مكتبات التصدير، تأكد من الاتصال بالإنترنت', 'error');
            return;
        }

        const perPage = 24;
        const pages = Math.ceil(data.answers.length / perPage);

        showLoad('جاري تجهيز ملف الـ PDF...');

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();

            for (let p = 0; p < pages; p++) {
                const chunk = data.answers.slice(p * perPage, (p + 1) * perPage);
                const box = document.createElement('div');
                box.dir = 'rtl';
                box.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#ffffff;color:#0f172a;padding:40px;box-sizing:border-box;font-family:Cairo,Arial,sans-serif;';

                const rowsHtml = chunk.map(a => {
                    const ans = a.correct === null ? 'مقالي' : (AK_LETTERS[a.correct] || (a.correct + 1));
                    return `<tr>
                        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:800;">${a.q}</td>
                        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:800;">${ans}</td>
                        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;">${a.points}</td>
                    </tr>`;
                }).join('');

                const footer = (p === pages - 1)
                    ? `<div style="margin-top:14px;text-align:center;font-weight:800;">عدد الأسئلة: ${data.total} • مجموع الدرجات: ${data.totalPoints}</div>`
                    : '';

                box.innerHTML = `
                    <div style="text-align:center;margin-bottom:16px;">
                        <div style="font-size:26px;font-weight:900;">${escapeHtml(data.title || 'ملف الإجابات')}</div>
                        <div style="font-size:14px;color:#64748b;font-weight:700;margin-top:4px;">نموذج الإجابة</div>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:15px;">
                        <thead>
                            <tr style="background:#e2e8f0;">
                                <th style="border:1px solid #cbd5e1;padding:8px;">رقم السؤال</th>
                                <th style="border:1px solid #cbd5e1;padding:8px;">الإجابة الصحيحة</th>
                                <th style="border:1px solid #cbd5e1;padding:8px;">الدرجة</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                    ${footer}`;

                document.body.appendChild(box);
                const canvas = await html2canvas(box, { scale: 2, backgroundColor: '#ffffff' });
                box.remove();

                if (p > 0) pdf.addPage();

                let imgW = pageW;
                let imgH = pageW * (canvas.height / canvas.width);
                if (imgH > pageH) {
                    imgW = imgW * (pageH / imgH);
                    imgH = pageH;
                }

                pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (pageW - imgW) / 2, 0, imgW, imgH);
            }

            pdf.save(akSafeName(data.title, 'ملف الإجابات') + ' - إجابات.pdf');
            showToast('تم تحميل الـ PDF');
        } catch (err) {
            console.error(err);
            showToast('حصل خطأ أثناء تجهيز الـ PDF', 'error');
        } finally {
            hideLoad();
        }
    }

    function akImportQuestions(data) {
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
        if (!list) {
            showToast('صيغة الملف غير مدعومة، لازم يكون فيه مصفوفة أسئلة', 'error');
            return;
        }

        const defPoints = Number(document.getElementById('ak-points').value);
        const pts = isNaN(defPoints) || defPoints < 0 ? 1 : defPoints;

        akRows = list
            .filter(item => item && (item.text || item.image))
            .map(item => ({
                opts: Array.isArray(item.answers)
                    ? item.answers.filter(a => a !== null && a !== undefined && String(a).trim() !== '').length
                    : 0,
                correct: null,
                points: pts
            }));

        if (!akRows.length) {
            showToast('مفيش أسئلة في الملف، تأكد من محتواه', 'error');
            return;
        }

        document.getElementById('ak-count').value = akRows.length;
        if (data && data.title && !document.getElementById('ak-title').value.trim()) {
            document.getElementById('ak-title').value = data.title;
        }

        akRender();
        showToast(`تم تجهيز الجدول لـ ${akRows.length} سؤال، حدد الإجابات الصح`);
    }

    function akImportAnswers(data) {
        if (!data || data.type !== 'eto-answers' || !Array.isArray(data.answers)) {
            showToast('ده مش ملف إجابات صادر من الموقع', 'error');
            return;
        }

        akRows = data.answers.map(a => ({
            opts: a.correct === null || a.correct === undefined ? 0 : Math.max(parseInt(a.opts, 10) || 0, (a.correct | 0) + 1),
            correct: a.correct === null || a.correct === undefined ? null : (a.correct | 0),
            points: Number(a.points) || 0
        }));

        document.getElementById('ak-title').value = data.title || '';
        document.getElementById('ak-count').value = akRows.length;
        akRender();
        showToast('تم فتح ملف الإجابات، عدّل وحمّله تاني');
    }

    const table = document.getElementById('ak-table');
    if (table) {
        table.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-ak-pick]');
            if (!btn) return;
            const [i, k] = btn.getAttribute('data-ak-pick').split(':').map(Number);
            akRows[i].correct = akRows[i].correct === k ? null : k;
            akRender();
        });

        table.addEventListener('input', (e) => {
            const input = e.target.closest('[data-ak-points]');
            if (!input) return;
            const i = Number(input.getAttribute('data-ak-points'));
            akRows[i].points = Number(input.value) || 0;
            akUpdateSummary();
        });
    }

    const questionsInput = document.getElementById('ak-questions-file');
    const answersInput = document.getElementById('ak-answers-file');

    document.getElementById('ak-import-questions-btn')?.addEventListener('click', () => questionsInput.click());
    document.getElementById('ak-import-answers-btn')?.addEventListener('click', () => answersInput.click());
    document.getElementById('ak-build-btn')?.addEventListener('click', () => akBuild(false));
    document.getElementById('ak-json-btn')?.addEventListener('click', akExportJson);
    document.getElementById('ak-pdf-btn')?.addEventListener('click', akExportPdf);

    questionsInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) akReadJsonFile(file, akImportQuestions);
        e.target.value = '';
    });

    answersInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) akReadJsonFile(file, akImportAnswers);
        e.target.value = '';
    });

    /* ===== تصدير أسئلة الشيت كـ JSON (من صفحة الشيتات) ===== */
    function teacherExportQuestionsJson() {
        const preview = document.getElementById('teacher-sheet-preview');
        const blocks = preview ? Array.from(preview.querySelectorAll('.q-block')) : [];

        if (!blocks.length) {
            showToast('لا يوجد أسئلة لتصديرها!', 'error');
            return;
        }

        const questions = blocks.map(block => {
            const textEl = block.querySelector('.q-text-el');
            const imgEl = block.querySelector('.q-question-img');

            const answers = Array.from(block.querySelectorAll('.q-choice-slot')).map(slot => {
                const img = slot.querySelector('.q-answer-img');
                if (img) return img.getAttribute('src') || '';
                const txt = slot.querySelector('.q-answer-el');
                return txt ? txt.innerHTML.trim() : '';
            }).filter(a => a !== '');

            const item = {
                text: textEl ? textEl.innerHTML.trim() : '',
                lang: block.dir === 'ltr' ? 'ltr' : 'rtl',
                answers: answers
            };

            if (imgEl && imgEl.getAttribute('src')) item.image = imgEl.getAttribute('src');
            if (block.dataset.pagebreak === '1') item.pagebreak = true;
            return item;
        });

        const payload = { type: 'eto-questions', v: 1, questions: questions };
        akDownload('أسئلة الشيت.json', new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
        showToast(`تم تصدير ${questions.length} سؤال`);
    }

    document.getElementById('teacher-export-json-btn')?.addEventListener('click', teacherExportQuestionsJson);
})();
