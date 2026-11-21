/* ===== مكتبة كلية العلوم ===== */
(function(){

    function scienceEscape(value){

        const div=document.createElement('div');

        div.textContent=value ?? '';

        return div.innerHTML;

    }


    function sciencePreviewUrl(url){

        if(!url) return '';

        const match=
            url.match(/\/file\/d\/([^/]+)/);

        if(match){

            return(
                'https://drive.google.com/file/d/' +
                match[1] +
                '/preview'
            );

        }

        return url;

    }


    window.scienceOpenPdf=function(url,title){

        const modal=
            document.getElementById(
                'dev-pdf-viewer'
            );

        const frame=
            document.getElementById(
                'dev-pdf-frame'
            );

        const titleEl=
            document.getElementById(
                'dev-pdf-title'
            );


        if(!modal || !frame) return;


        if(titleEl){

            titleEl.textContent=
                title || 'شرح المادة';

        }


        frame.src=
            sciencePreviewUrl(url);


        modal.classList.remove('hidden');

        document.body.style.overflow=
            'hidden';

    };


    function scienceClosePdf(){

        const modal=
            document.getElementById(
                'dev-pdf-viewer'
            );

        const frame=
            document.getElementById(
                'dev-pdf-frame'
            );


        if(modal){

            modal.classList.add('hidden');

        }


        if(frame){

            frame.src='about:blank';

        }


        document.body.style.overflow='';

    }


    async function loadScienceLibrary(){

        const grid=
            document.getElementById(
                'science-subjects-grid'
            );

        const empty=
            document.getElementById(
                'science-empty'
            );


        if(!grid) return;


        try{

            const response=
                await fetch(
                    SCIENCE_DATA_URL,
                    {
                        cache:'no-store'
                    }
                );


            if(!response.ok){

                grid.innerHTML='';

                if(empty){

                    empty.classList.remove(
                        'hidden'
                    );

                }

                return;

            }


            const data=
                await response.json();


            const subjects=
                Array.isArray(data.subjects)
                    ? data.subjects
                    : [];


            if(!subjects.length){

                grid.innerHTML='';

                if(empty){

                    empty.classList.remove(
                        'hidden'
                    );

                }

                return;

            }


            if(empty){

                empty.classList.add(
                    'hidden'
                );

            }


            grid.innerHTML=
                subjects
                    .filter(
                        subject =>
                            Array.isArray(
                                subject.items
                            ) &&
                            subject.items.length
                    )
                    .map(subject=>`

                        <section
                            class="science-subject-block">

                            <div
                                class="science-subject-head">

                                <div
                                    class="science-subject-title">

                                    <div
                                        class="science-subject-icon">

                                        <i class="fa-solid fa-flask"></i>

                                    </div>

                                    <div>

                                        <h3>
                                            ${scienceEscape(
                                                subject.name ||
                                                'مادة'
                                            )}
                                        </h3>

                                        <span>
                                            ${subject.items.length}
                                            ملف
                                        </span>

                                    </div>

                                </div>

                                <i
                                    class="fa-solid fa-folder-open text-slate-300">
                                </i>

                            </div>


                            <div
                                class="science-material-list">

                                ${subject.items.map(item=>{

                                    const openUrl=
                                        item.driveUrl ||
                                        item.url ||
                                        '';

                                    const downloadUrl=
                                        item.url ||
                                        item.driveUrl ||
                                        '#';


                                    return `

                                        <article
                                            class="science-material-card">

                                            <div
                                                class="science-material-icon">

                                                <i class="fa-solid fa-file-pdf"></i>

                                            </div>


                                            <div
                                                class="science-material-content">

                                                <strong>
                                                    ${scienceEscape(
                                                        item.title ||
                                                        'ملف بدون اسم'
                                                    )}
                                                </strong>

                                                <span>

                                                    ${scienceEscape(
                                                        item.type ||
                                                        'شرح'
                                                    )}

                                                    ${
                                                        item.description
                                                        ? ' • ' +
                                                          scienceEscape(
                                                              item.description
                                                          )
                                                        : ''
                                                    }

                                                </span>

                                            </div>


                                            ${
                                                openUrl
                                                ? `

                                                    <button
                                                        type="button"
                                                        class="science-material-btn"
                                                        onclick='scienceOpenPdf(
                                                            ${JSON.stringify(openUrl)},
                                                            ${JSON.stringify(item.title || "شرح المادة")}
                                                        )'>

                                                        <i class="fa-solid fa-eye"></i>
                                                        معاينة

                                                    </button>

                                                `
                                                : ''
                                            }


                                            ${
                                                downloadUrl
                                                ? `

                                                    <a
                                                        href="${scienceEscape(downloadUrl)}"
                                                        target="_blank"
                                                        rel="noopener"
                                                        class="science-material-btn">

                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>

                                                    </a>

                                                `
                                                : ''
                                            }

                                        </article>

                                    `;

                                }).join('')}

                            </div>

                        </section>

                    `)
                    .join('');


            const closeBtn=
                document.getElementById(
                    'dev-pdf-close-btn'
                );


            if(closeBtn){

                closeBtn.onclick=
                    scienceClosePdf;

            }


            const viewer=
                document.getElementById(
                    'dev-pdf-viewer'
                );


            if(viewer){

                viewer.onclick=e=>{

                    if(
                        e.target.id===
                        'dev-pdf-viewer'
                    ){

                        scienceClosePdf();

                    }

                };

            }


        }catch(error){

            console.error(
                'College Science JSON:',
                error
            );


            grid.innerHTML='';

            if(empty){

                empty.classList.remove(
                    'hidden'
                );

            }

        }

    }


    loadScienceLibrary();



    document.getElementById('dev-pdf-close-btn')?.addEventListener(
        'click',
        scienceClosePdf
    );

    document.getElementById('dev-pdf-viewer')?.addEventListener(
        'click',
        e => {
            if(e.target.id === 'dev-pdf-viewer'){
                scienceClosePdf();
            }
        }
    );

})();
