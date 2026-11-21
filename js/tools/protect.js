/* ===== حماية PDF بباسورد ===== */
        let prFile = null;
        const prFileInput = document.getElementById('pr-file');
        const prWorkspace = document.getElementById('pr-workspace');
        
        if (prFileInput) {
            prFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    prFile = e.target.files[0];
                    prWorkspace.classList.remove('hidden');
                    showToast('تم رفع الملف بنجاح، أدخل الباسورد الآن');
                }
            });
        }

        document.getElementById('pr-toggle-pass').onclick = () => {
            const input = document.getElementById('pr-pass');
            const icon = document.querySelector('#pr-toggle-pass i');

            input.type = input.type === 'password' ? 'text' : 'password';
            icon.className = input.type === 'password'
                ? 'fa-solid fa-eye'
                : 'fa-solid fa-eye-slash';
        };

        const prExportBtn = document.getElementById('pr-export');
        if (prExportBtn) {
            prExportBtn.addEventListener('click', async () => {
                const pass = document.getElementById('pr-pass').value;
                const confirmPass = document.getElementById('pr-pass-confirm').value;

                if (pass !== confirmPass) {
                    showToast('كلمتا المرور غير متطابقتين', 'error');
                    return;
                }
                if (!pass || pass.trim() === '') {
                    showToast('الرجاء إدخال الباسورد أولاً!', 'error');
                    return;
                }
                if (!prFile) return;

                showLoad('جاري تشفير الملف بباسورد حقيقي...');
                try {
                    const arrayBuffer = await prFile.arrayBuffer();
                    const bytes = new Uint8Array(arrayBuffer);
                    
                    const Encryptor = window.PDFEncryptLite;

                    if (Encryptor && typeof Encryptor.encryptPDF === 'function') {
                        const encryptedData = await Encryptor.encryptPDF(bytes, pass);
                        const blob = new Blob([encryptedData], { type: 'application/pdf' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `Locked_${prFile.name}`;
                            link.click();
                            showToast('تم التشفير! جرب تفتحه دلوقتي هيطلب باسورد');
                    } else {
                        showToast('خطأ: مكتبة التشفير غير متاحة', 'error');
                    }
                } catch (err) {
                    console.error(err);
                    showToast('حدث خطأ أثناء تشفير الملف', 'error');
                }
                hideLoad();
            });
        }
