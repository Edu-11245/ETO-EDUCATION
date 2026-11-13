
function esLesson(id, level, title, sub, goals, words, lines, notes, quiz) {
    return {
        id: id, level: level, icon: 'fa-book-open', title: title, sub: sub, goals: goals,
        vocab: words.map(function (x, i) { return { k: id + '-' + i, t: x[0], pr: x[1], ar: x[2] }; }),
        dialog: { names: { A: 'Ana', B: 'Carlos' }, lines: lines.map(function (x) { return { w: x[0], t: x[1], ar: x[2] }; }) },
        notes: notes,
        quiz: quiz.map(function (x) { return { q: x[0], a: x[1], c: x[2] }; })
    };
}
var spanishCourse = {
    id: 'es', name: 'Español', nameAr: 'الإسبانية', level: 'A1–C2', speech: 'es-ES', rate: 0.85,
    status: 'ready', hello: 'Hola',
    flag: 'linear-gradient(#c1121f 25%,#fcbf49 25% 75%,#c1121f 75%)',
    theme: { a: '#e11d48', b: '#f97316' },
    title: 'كورس الإسبانية من الصفر',
    intro: 'مسار الإسبانية متدرج من A1 لحد C2. هتبدأ بالحروف والتحيات، وبعدها تنتقل للمواقف اليومية ثم النقاش والكتابة والتحليل المتقدم. كل وحدة فيها مفردات بنطقها وحوار وقواعد واستعمال واختبار، فامشِ بالترتيب عشان تبني مستواك خطوة خطوة.',
    desc: '36 وحدة تعليمية كاملة من A1 إلى C2، مع نطق صوتي وحوارات وقواعد واستعمال واختبارات في كل وحدة.',
    levelDescriptions: {
        A1: 'تتعامل مع التحيات والعبارات اليومية والتعريف بالنفس.',
        A2: 'تنجز مهامًا مألوفة وتتحدث عن حياتك واحتياجاتك المباشرة.',
        B1: 'تتواصل باستقلالية في مواقف مألوفة وتشرح التجارب والآراء والخطط.',
        B2: 'تناقش موضوعات متنوعة وتبني حججًا واضحة وتستخدم اللغة بمرونة أكبر.',
        C1: 'مرحلة متقدمة للدقة والأسلوب الأكاديمي والمهني.',
        C2: 'مرحلة الإتقان والفهم المرن للفروق الدقيقة.'
    },

    alphabet: {
        title: 'الأبجدية الإسبانية',
        items: [
            { l: 'A a', ar: 'آ', w: 'Agua', m: 'مياه' }, { l: 'B b', ar: 'بي', w: 'Bien', m: 'كويس' },
            { l: 'C c', ar: 'ثي / سي', w: 'Casa', m: 'بيت' }, { l: 'D d', ar: 'دي', w: 'Día', m: 'يوم' },
            { l: 'E e', ar: 'إي', w: 'Escuela', m: 'مدرسة' }, { l: 'F f', ar: 'إفي', w: 'Familia', m: 'عيلة' },
            { l: 'G g', ar: 'خي', w: 'Gato', m: 'قطة' }, { l: 'H h', ar: 'آتشي (صامت)', w: 'Hola', m: 'مرحبا' },
            { l: 'I i', ar: 'إي', w: 'Isla', m: 'جزيرة' }, { l: 'J j', ar: 'خوتا', w: 'Jamón', m: 'لحم مقدد' },
            { l: 'K k', ar: 'كا', w: 'Kilo', m: 'كيلو' }, { l: 'L l', ar: 'إيلي', w: 'Luna', m: 'قمر' },
            { l: 'M m', ar: 'إيمي', w: 'Mesa', m: 'ترابيزة' }, { l: 'N n', ar: 'إيني', w: 'Noche', m: 'ليل' },
            { l: 'Ñ ñ', ar: 'إينيي', w: 'Español', m: 'إسباني' }, { l: 'O o', ar: 'أو', w: 'Ojo', m: 'عين' },
            { l: 'P p', ar: 'بي', w: 'Pan', m: 'عيش' }, { l: 'Q q', ar: 'كو', w: 'Queso', m: 'جبنة' },
            { l: 'R r', ar: 'إيرّي', w: 'Rojo', m: 'أحمر' }, { l: 'S s', ar: 'إيسي', w: 'Sol', m: 'شمس' },
            { l: 'T t', ar: 'تي', w: 'Tren', m: 'قطر' }, { l: 'U u', ar: 'أو', w: 'Uno', m: 'واحد' },
            { l: 'V v', ar: 'أوبي', w: 'Vaso', m: 'كوباية' }, { l: 'W w', ar: 'أوبي دوبلي', w: 'Web', m: 'ويب' },
            { l: 'X x', ar: 'إيكيس', w: 'Taxi', m: 'تاكسي' }, { l: 'Y y', ar: 'ييه', w: 'Yo', m: 'أنا' },
            { l: 'Z z', ar: 'ثيتا', w: 'Zapato', m: 'جزمة' }
        ]
    },

    units: [
        {
            id: 'u1', level: 'A1', icon: 'fa-hand', title: 'التحية والتعارف', sub: 'Hola, me llamo...',
            goals: ['تسلّم على الناس وتودّعهم بالإسبانية صح.', 'تعرّف بنفسك وتسأل «اسمك إيه؟» و«إزيك؟».', 'تقول شكرًا ومن فضلك والعفو في الوقت المناسب.'],
            vocab: [
                { k: 'hola', t: 'Hola', pr: 'أُولا', ar: 'مرحبا' },
                { k: 'adios', t: 'Adiós', pr: 'أديوس', ar: 'مع السلامة' },
                { k: 'dias', t: 'Buenos días', pr: 'بوينوس دياس', ar: 'صباح الخير' },
                { k: 'tardes', t: 'Buenas tardes', pr: 'بوينّاس تاردس', ar: 'مساء الخير (بعد الظهر)' },
                { k: 'noches', t: 'Buenas noches', pr: 'بوينّاس نوتشيس', ar: 'مساء الخير / تصبح على خير' },
                { k: 'favor', t: 'Por favor', pr: 'بور فابور', ar: 'من فضلك' },
                { k: 'gracias', t: 'Gracias', pr: 'غراسياس', ar: 'شكرًا' },
                { k: 'nada', t: 'De nada', pr: 'دي ناذا', ar: 'العفو' },
                { k: 'llamo', t: 'Me llamo…', pr: 'مي يامو', ar: 'اسمي…' },
                { k: 'como', t: '¿Cómo estás?', pr: 'كومو إستاس', ar: 'إزيك؟' },
                { k: 'gusto', t: 'Mucho gusto', pr: 'موتشو غوستو', ar: 'تشرفت بمعرفتك' },
                { k: 'luego', t: 'Hasta luego', pr: 'أستا لويغو', ar: 'أشوفك بعدين' }
            ],
            dialog: {
                names: { A: 'Ana', B: 'Carlos' },
                lines: [
                    { w: 'A', t: 'Hola, buenos días. ¿Cómo te llamas?', ar: 'مرحبا، صباح الخير. اسمك إيه؟' },
                    { w: 'B', t: 'Me llamo Carlos. ¿Y tú?', ar: 'اسمي كارلوس. وإنتِ؟' },
                    { w: 'A', t: 'Me llamo Ana. Mucho gusto.', ar: 'اسمي آنا. تشرفت بمعرفتك.' },
                    { w: 'B', t: 'Igualmente. ¿Cómo estás?', ar: 'وأنا كمان. إزيك؟' },
                    { w: 'A', t: 'Estoy bien, gracias.', ar: 'أنا كويسة، شكرًا.' },
                    { w: 'B', t: 'Adiós, hasta luego.', ar: 'مع السلامة، أشوفك بعدين.' }
                ]
            },
            notes: [
                ['H', 'حرف h في الإسبانية صامت دايمًا: Hola بتتنطق «أولا».', 'Hola'],
                ['J', 'حرف j بيتنطق قريب من «خ»: José «خوسيه».', 'José'],
                ['LL', 'اللام المزدوجة ll قريبة من «ي»: llamo «يامو».', 'Me llamo'],
                ['V', 'حرف v قريب جدًا من b في النطق: vaso قريبة من «باسو».', 'Vaso'],
                ['¿ ¡', 'علامة السؤال والتعجب بتتكتب مقلوبة في أول الجملة: ¿Cómo estás?', '¿Cómo estás?']
            ],
            quiz: [
                { q: 'إيه معنى «Buenos días»؟', a: ['صباح الخير', 'مع السلامة', 'شكرًا', 'من فضلك'], c: 0 },
                { q: 'إزاي تقول «شكرًا» بالإسباني؟', a: ['Gracias', 'Adiós', 'Hola', 'De nada'], c: 0 },
                { q: 'لو حد قالك «Gracias» ترد بإيه؟', a: ['De nada', 'Hola', 'Buenas noches', 'Por favor'], c: 0 },
                { q: 'إيه معنى «Me llamo Sara»؟', a: ['اسمي سارة', 'أنا بخير', 'مع السلامة', 'مرحبا'], c: 0 },
                { q: 'أنهي عبارة بتقولها بالليل؟', a: ['Buenas noches', 'Buenos días', 'Gracias', 'Hola'], c: 0 },
                { q: 'إيه معنى «¿Cómo estás?»', a: ['إزيك؟', 'اسمك إيه؟', 'مع السلامة', 'شكرًا'], c: 0 },
                { q: 'إزاي تقول «مع السلامة» بالإسباني؟', a: ['Adiós', 'Hola', 'Gracias', 'Por favor'], c: 0 },
                { q: 'أنهي كلمة بتتنطق «أولا»؟', a: ['Hola', 'Adiós', 'Gracias', 'Nada'], c: 0 }
            ]
        },
        {
            id: 'u2', level: 'A1', icon: 'fa-hashtag', title: 'الأرقام والعمر', sub: 'Uno, dos, tres...',
            goals: ['تعد من 0 لـ 10 بالإسبانية.', 'تسأل «عندك كام سنة؟» وتجاوب على نفس السؤال.', 'تفرّق بين الأرقام لما تسمعها.'],
            vocab: [
                { k: 'cero', t: 'Cero', pr: 'سيرو', ar: '0 • صفر' },
                { k: 'uno', t: 'Uno', pr: 'أونو', ar: '1 • واحد' },
                { k: 'dos', t: 'Dos', pr: 'دوس', ar: '2 • اتنين' },
                { k: 'tres', t: 'Tres', pr: 'تريس', ar: '3 • تلاتة' },
                { k: 'cuatro', t: 'Cuatro', pr: 'كواترو', ar: '4 • أربعة' },
                { k: 'cinco', t: 'Cinco', pr: 'سينكو', ar: '5 • خمسة' },
                { k: 'seis', t: 'Seis', pr: 'سيس', ar: '6 • ستة' },
                { k: 'siete', t: 'Siete', pr: 'سييتي', ar: '7 • سبعة' },
                { k: 'ocho', t: 'Ocho', pr: 'أوتشو', ar: '8 • تمانية' },
                { k: 'nueve', t: 'Nueve', pr: 'نويبي', ar: '9 • تسعة' },
                { k: 'diez', t: 'Diez', pr: 'دييس', ar: '10 • عشرة' },
                { k: 'cuantos', t: '¿Cuántos años tienes?', pr: 'كوانتوس أنيوس تيينيس', ar: 'عندك كام سنة؟' },
                { k: 'tengo', t: 'Tengo… años', pr: 'تينغو… أنيوس', ar: 'عندي… سنة' }
            ],
            dialog: {
                names: { A: 'Ana', B: 'Carlos' },
                lines: [
                    { w: 'A', t: '¿Cuántos años tienes?', ar: 'عندك كام سنة؟' },
                    { w: 'B', t: 'Tengo veinte años. ¿Y tú?', ar: 'عندي عشرين سنة. وإنتِ؟' },
                    { w: 'A', t: 'Tengo diecinueve años.', ar: 'عندي تسعة عشر سنة.' },
                    { w: 'B', t: '¡Qué bien!', ar: 'حلو أوي!' },
                    { w: 'A', t: 'Cuenta de uno a diez.', ar: 'عُدّ من واحد لعشرة.' },
                    { w: 'B', t: 'Uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.', ar: 'واحد، اتنين، تلاتة، أربعة، خمسة، ستة، سبعة، تمانية، تسعة، عشرة.' }
                ]
            },
            notes: [
                ['C', 'حرف c قبل e و i بيتنطق «س» في أمريكا اللاتينية و«ث» في إسبانيا: cinco.', 'Cinco'],
                ['Z', 'حرف z زيه: «س» في أمريكا اللاتينية و«ث» في إسبانيا: diez.', 'Diez'],
                ['CH', 'الحرفين ch مع بعض بيتنطقوا «تش»: ocho «أوتشو».', 'Ocho'],
                ['Ñ', 'حرف ñ بيتنطق زي «ني»: años «أنيوس».', 'Años'],
                ['UE', 'في cuatro و nueve حرف u بيتنطق «و» خفيفة: «كواترو» و«نويبي».', 'Nueve']
            ],
            quiz: [
                { q: 'إزاي تقول 5 بالإسباني؟', a: ['Cinco', 'Seis', 'Siete', 'Cuatro'], c: 0 },
                { q: 'الرقم «Ocho» يعني كام؟', a: ['8', '7', '9', '6'], c: 0 },
                { q: 'إيه معنى «Tres»؟', a: ['3', '2', '5', '10'], c: 0 },
                { q: 'إيه معنى «¿Cuántos años tienes?»', a: ['عندك كام سنة؟', 'اسمك إيه؟', 'إزيك؟', 'إنت منين؟'], c: 0 },
                { q: 'الرقم «Nueve» يعني كام؟', a: ['9', '7', '6', '2'], c: 0 },
                { q: 'إزاي تقول 10 بالإسباني؟', a: ['Diez', 'Dos', 'Siete', 'Uno'], c: 0 }
            ]
        },
        esLesson(
            'u3', 'A1', 'العيلة والأصدقاء', 'Mi familia',
            ['تسمي أفراد العيلة والأصدقاء.', 'تسأل عن شخص وتعرّف أفراد أسرتك.', 'تستخدم صفات الملكية البسيطة.'],
            [
                ['Madre', 'مادري', 'أم'], ['Padre', 'بادري', 'أب'], ['Hermano', 'إرمانو', 'أخ'],
                ['Hermana', 'إرمانا', 'أخت'], ['Abuelo', 'أبويلو', 'جد'], ['Abuela', 'أبويلا', 'جدة'],
                ['Hijo', 'إيخو', 'ابن'], ['Hija', 'إيخا', 'ابنة'], ['Amigo', 'أميجو', 'صديق'],
                ['Amiga', 'أميجا', 'صديقة']
            ],
            [
                ['A', '¿Tienes hermanos?', 'هل عندك إخوات؟'],
                ['B', 'Sí, tengo un hermano y una hermana.', 'أيوه، عندي أخ وأخت.'],
                ['A', '¿Cómo se llama tu hermana?', 'اسم أختك إيه؟'],
                ['B', 'Se llama Laura.', 'اسمها لاورا.'],
                ['A', '¿Quién es él?', 'مين ده؟'],
                ['B', 'Es mi abuelo.', 'ده جدي.']
            ],
            [
                ['MI / MIS', 'mi قبل الاسم المفرد وmis قبل الاسم الجمع.', 'Mi madre / Mis padres'],
                ['TU / TUS', 'tu للمفرد وtus للجمع عند مخاطبة شخص.', 'Tu hermano / Tus amigos'],
                ['TENER', 'الفعل tener معناه يملك أو عنده، ويتغير حسب الضمير.', 'Tengo dos hermanos.']
            ],
            [
                ['إيه معنى Madre؟', ['أم', 'أب', 'أخ', 'أخت'], 0],
                ['إزاي تقول «أختي»؟', ['Mi hermana', 'Mi hermano', 'Tu padre', 'Mis amigos'], 0],
                ['معنى «¿Tienes hermanos?» إيه؟', ['هل عندك إخوات؟', 'اسمك إيه؟', 'أنت منين؟', 'عندك كام سنة؟'], 0],
                ['اختار الجمع الصحيح لـ mi amigo.', ['Mis amigos', 'Mi amigos', 'Tus amigo', 'Su amigo'], 0],
                ['إيه معنى «Tengo una hermana»؟', ['عندي أخت', 'عندي أخ', 'أنا صديق', 'دي أمي'], 0]
            ]
        ),
        esLesson(
            'u4', 'A1', 'الأكل والمشروبات', 'La comida y las bebidas',
            ['تطلب أكلًا أو مشروبًا بطريقة مهذبة.', 'تفهم كلمات أساسية في المطعم.', 'تطلب الحساب وتسأل عن الطعام.'],
            [
                ['Agua', 'أجوا', 'مياه'], ['Pan', 'بان', 'خبز'], ['Leche', 'ليتشي', 'لبن'],
                ['Café', 'كافيه', 'قهوة'], ['Té', 'تي', 'شاي'], ['Manzana', 'مانثانا', 'تفاحة'],
                ['Pollo', 'بويو', 'فراخ'], ['Arroz', 'أروث', 'أرز'], ['Menú', 'مينو', 'قائمة الطعام'],
                ['Cuenta', 'كوينتا', 'الحساب']
            ],
            [
                ['A', 'Buenos días. ¿Qué desea?', 'صباح الخير، تحب تطلب إيه؟'],
                ['B', 'Quisiera un café y un bocadillo.', 'أريد قهوة وساندويتش من فضلك.'],
                ['A', '¿Algo más?', 'أي حاجة تانية؟'],
                ['B', 'Una botella de agua, por favor.', 'زجاجة مياه من فضلك.'],
                ['A', 'Aquí tiene.', 'اتفضل.'],
                ['B', 'Gracias. ¿Me trae la cuenta?', 'شكرًا. ممكن تجيب الحساب؟']
            ],
            [
                ['QUIERO / QUISIERA', 'quiero طلب مباشر، وquisiera ألطف وأكثر تهذيبًا.', 'Quisiera un café.'],
                ['UN / UNA', 'un مع أسماء مذكرة وuna مع أسماء مؤنثة.', 'Un café / Una manzana'],
                ['POR FAVOR', 'تُستخدم لجعل الطلب مهذبًا.', 'Agua, por favor.']
            ],
            [
                ['إيه معنى Agua؟', ['مياه', 'لبن', 'خبز', 'قهوة'], 0],
                ['إزاي تطلب قهوة بأدب؟', ['Quisiera un café', 'Adiós café', 'Tengo café años', 'Dónde café'], 0],
                ['معنى La cuenta إيه؟', ['الحساب', 'قائمة الطعام', 'المياه', 'المطبخ'], 0],
                ['أنهي اختيار صحيح؟', ['Una manzana', 'Un manzana', 'Una café', 'Un leche'], 0],
                ['إزاي تقول «من فضلك»؟', ['Por favor', 'De nada', 'Hasta luego', 'Buenos días'], 0]
            ]
        ),
        esLesson(
            'u5', 'A1', 'الأماكن والاتجاهات', 'Los lugares y las direcciones',
            ['تسأل عن مكان وتفهم الاتجاهات.', 'تصف مكانًا قريبًا أو بعيدًا.', 'تستخدم hay وestar في جمل بسيطة.'],
            [
                ['Calle', 'كايّي', 'شارع'], ['Casa', 'كاسا', 'بيت'], ['Escuela', 'إسكويلا', 'مدرسة'],
                ['Estación', 'إستاثيون', 'محطة'], ['Farmacia', 'فارماثيا', 'صيدلية'], ['Supermercado', 'سوبرميركادو', 'سوبر ماركت'],
                ['Derecha', 'ديريتشا', 'يمين'], ['Izquierda', 'إثكييردا', 'شمال'], ['Cerca', 'ثيركا', 'قريب'],
                ['Lejos', 'ليخوس', 'بعيد']
            ],
            [
                ['A', 'Perdona, ¿dónde está la estación?', 'لو سمحت، فين المحطة؟'],
                ['B', 'Está cerca de aquí.', 'هي قريبة من هنا.'],
                ['A', '¿Cómo llego?', 'أوصل لها إزاي؟'],
                ['B', 'Sigue todo recto y gira a la derecha.', 'امشِ على طول وبعدها لف يمين.'],
                ['A', '¿Está lejos?', 'هي بعيدة؟'],
                ['B', 'No, está al lado del supermercado.', 'لأ، هي بجوار السوبر ماركت.']
            ],
            [
                ['ESTAR', 'نستخدم estar لتحديد مكان شخص أو شيء.', 'La farmacia está aquí.'],
                ['HAY', 'نستخدم hay بمعنى يوجد أو توجد.', 'Hay una farmacia cerca.'],
                ['AL LADO DE', 'تعبير معناه بجوار أو على جانب.', 'Está al lado del banco.']
            ],
            [
                ['إيه معنى Derecha؟', ['يمين', 'شمال', 'بعيد', 'قريب'], 0],
                ['معنى «¿Dónde está la estación?» إيه؟', ['أين المحطة؟', 'كم سعر التذكرة؟', 'ما اسمك؟', 'أين بيتك؟'], 0],
                ['اختار الجملة الصحيحة للمكان:', ['La farmacia está aquí', 'La farmacia es aquí', 'La farmacia hay aquí', 'La farmacia soy aquí'], 0],
                ['إيه معنى Cerca؟', ['قريب', 'بعيد', 'يمين', 'شارع'], 0],
                ['«Hay un supermercado» معناها:', ['يوجد سوبر ماركت', 'السوبر ماركت بعيد', 'أنا في البيت', 'أين المحطة؟'], 0]
            ]
        ),
        esLesson(
            'u6', 'A1', 'الأيام والوقت والروتين', 'Los días y la hora',
            ['تقول أيام الأسبوع وتحدد اليوم.', 'تسأل عن الساعة وتجيب.', 'تتحدث عن مواعيد بسيطة.'],
            [
                ['Lunes', 'لونيس', 'الاثنين'], ['Martes', 'مارتيس', 'الثلاثاء'], ['Miércoles', 'مييركوليس', 'الأربعاء'],
                ['Jueves', 'خويبيس', 'الخميس'], ['Viernes', 'بييرنيس', 'الجمعة'], ['Sábado', 'سابادو', 'السبت'],
                ['Domingo', 'دومينجو', 'الأحد'], ['Hoy', 'أوي', 'اليوم'], ['Mañana', 'مانيانا', 'غدًا / الصباح'],
                ['Ayer', 'أيير', 'أمس'], ['Hora', 'أورا', 'ساعة']
            ],
            [
                ['A', '¿Qué día es hoy?', 'النهارده يوم إيه؟'],
                ['B', 'Hoy es martes.', 'النهارده الثلاثاء.'],
                ['A', '¿Qué hora es?', 'الساعة كام؟'],
                ['B', 'Son las ocho y media.', 'الساعة تمانية ونص.'],
                ['A', '¿A qué hora empieza la clase?', 'المحاضرة بتبدأ الساعة كام؟'],
                ['B', 'Empieza a las nueve.', 'بتبدأ الساعة تسعة.']
            ],
            [
                ['LOS DÍAS', 'أيام الأسبوع مذكرة في الإسبانية، ولا نبدأها بحرف كبير عادةً.', 'el lunes / los lunes'],
                ['LA HORA', 'نقول es la una للواحدة، وson las مع باقي الساعات.', 'Es la una / Son las dos'],
                ['A LAS', 'نستخدم a las قبل موعد الساعة، ما عدا الواحدة: a la una.', 'A las ocho']
            ],
            [
                ['إيه معنى Miércoles؟', ['الأربعاء', 'الثلاثاء', 'الخميس', 'الأحد'], 0],
                ['إزاي تقول «اليوم»؟', ['Hoy', 'Ayer', 'Mañana', 'Lejos'], 0],
                ['اختار الصيغة الصحيحة للساعة 2:', ['Son las dos', 'Es la dos', 'Son el dos', 'Está las dos'], 0],
                ['معنى «¿Qué día es hoy?» إيه؟', ['النهارده يوم إيه؟', 'الساعة كام؟', 'هتروح فين؟', 'عندك كام سنة؟'], 0],
                ['إزاي تقول «في الساعة التاسعة»؟', ['A las nueve', 'En nueve', 'Es nueve', 'De nueve'], 0]
            ]
        ),
        esLesson(
            'u7', 'A2', 'الروتين اليومي والأفعال الانعكاسية', 'Mi rutina diaria',
            ['تصف يومك من الصبح لحد النوم.', 'تستخدم أفعالًا انعكاسية في المضارع.', 'تتكلم عن مواعيدك وعاداتك.'],
            [
                ['Despertarse', 'ديسبيرتارسي', 'يستيقظ'], ['Levantarse', 'ليبانتارسي', 'ينهض من السرير'],
                ['Ducharse', 'دوتشارسي', 'يستحم'], ['Desayunar', 'ديسايونار', 'يتناول الفطار'],
                ['Trabajar', 'تراباخار', 'يعمل'], ['Estudiar', 'إستوديار', 'يدرس'],
                ['Volver', 'بولبير', 'يرجع'], ['Cenar', 'ثينار', 'يتناول العشاء'],
                ['Acostarse', 'أكوستارسي', 'يذهب للنوم'], ['Temprano', 'تيمبرانو', 'مبكرًا']
            ],
            [
                ['A', '¿A qué hora te despiertas?', 'بتصحى الساعة كام؟'],
                ['B', 'Me despierto a las siete.', 'بصحى الساعة سبعة.'],
                ['A', '¿Desayunas en casa?', 'بتفطر في البيت؟'],
                ['B', 'Sí, desayuno antes de estudiar.', 'أيوه، بفطر قبل ما أذاكر.'],
                ['A', '¿A qué hora vuelves?', 'بترجع الساعة كام؟'],
                ['B', 'Vuelvo a las cinco y me acuesto temprano.', 'برجع الساعة خمسة وبنام بدري.']
            ],
            [
                ['VERBOS REFLEXIVOS', 'في الأفعال الانعكاسية نستخدم me / te / se حسب الفاعل.', 'Me levanto temprano.'],
                ['CAMBIO E → IE', 'بعض الأفعال يتغير فيها e إلى ie في المضارع، مثل despertarse.', 'Me despierto a las siete.'],
                ['ANTES DE / DESPUÉS DE', 'يأتي بعدهما اسم أو فعل في صيغة المصدر.', 'Después de estudiar, descanso.']
            ],
            [
                ['إيه معنى Desayunar؟', ['يفطر', 'ينام', 'يرجع', 'يعمل'], 0],
                ['اختار «أنا بصحى»: ', ['Me despierto', 'Te despiertas', 'Se despierta', 'Me despiertas'], 0],
                ['إيه معنى Temprano؟', ['مبكرًا', 'متأخرًا', 'غدًا', 'أحيانًا'], 0],
                ['أي جملة صحيحة؟', ['Me levanto a las siete', 'Me levantas a las siete', 'Se levanto a las siete', 'Yo me levantar a las siete'], 0],
                ['ترجمة «أرجع الساعة خمسة» هي:', ['Vuelvo a las cinco', 'Voy a las cinco', 'Duermo a las cinco', 'Ceno de cinco'], 0]
            ]
        ),
        esLesson(
            'u8', 'A2', 'البيت والسكن ووصف المكان', 'La casa y la vivienda',
            ['تصف غرف البيت والأثاث الأساسي.', 'تسأل عن شقة وتفهم وصفها.', 'تميز بين hay وestar في وصف المكان.'],
            [
                ['Piso', 'بيسو', 'شقة'], ['Habitación', 'أبيتاثيون', 'غرفة'], ['Cocina', 'كوثينا', 'مطبخ'],
                ['Baño', 'بانيو', 'حمام'], ['Salón', 'سالون', 'غرفة معيشة'], ['Dormitorio', 'دورميتوريو', 'غرفة نوم'],
                ['Alquiler', 'ألكيلير', 'إيجار'], ['Llave', 'يابيه', 'مفتاح'], ['Vecino', 'بيثينو', 'جار'],
                ['Ascensor', 'أثينسور', 'مصعد']
            ],
            [
                ['A', '¿Cómo es el piso?', 'الشقة عاملة إزاي؟'],
                ['B', 'Tiene dos habitaciones y un salón grande.', 'فيها غرفتين وغرفة معيشة كبيرة.'],
                ['A', '¿Hay ascensor?', 'هل يوجد مصعد؟'],
                ['B', 'Sí, está al lado de la entrada.', 'أيوه، موجود بجوار المدخل.'],
                ['A', '¿Cuánto cuesta el alquiler?', 'الإيجار بكام؟'],
                ['B', 'Cuesta seiscientos euros al mes.', 'تكلف ستمائة يورو في الشهر.']
            ],
            [
                ['HAY', 'تصف وجود شيء بشكل عام باستخدام hay.', 'Hay dos habitaciones.'],
                ['ESTAR', 'تحدد مكان شيء معروف باستخدام estar.', 'La cocina está al lado del salón.'],
                ['TENER', 'نستخدم tener لوصف ما تحتويه الشقة أو الغرفة.', 'El piso tiene un balcón.']
            ],
            [
                ['إيه معنى Habitación؟', ['غرفة', 'مطبخ', 'مفتاح', 'مصعد'], 0],
                ['إزاي تقول «يوجد مصعد»؟', ['Hay ascensor', 'Es ascensor', 'Está ascensor', 'Tiene ascensor aquí'], 0],
                ['معنى Alquiler إيه؟', ['إيجار', 'جار', 'حمام', 'غرفة نوم'], 0],
                ['اختار جملة سليمة:', ['La cocina está aquí', 'La cocina es aquí', 'La cocina hay aquí', 'La cocina tiene aquí'], 0],
                ['إيه معنى «El piso tiene dos habitaciones»؟', ['الشقة فيها غرفتان', 'الشقة بعيدة', 'الإيجار غالي', 'المفتاح مع الجار'], 0]
            ]
        ),
        esLesson(
            'u9', 'A2', 'التسوق والملابس والأسعار', 'De compras',
            ['تسأل عن السعر والمقاس.', 'تطلب تجربة الملابس وتصف ما يناسبك.', 'تتعامل مع الدفع والخصومات.'],
            [
                ['Camisa', 'كاميسا', 'قميص'], ['Pantalones', 'بانتالونيس', 'بنطلون'], ['Zapatos', 'ثاباتوس', 'حذاء'],
                ['Talla', 'تايا', 'مقاس'], ['Probarse', 'بروبارسي', 'يجرّب ملابس'], ['Precio', 'بريثيو', 'سعر'],
                ['Barato', 'باراتّو', 'رخيص'], ['Caro', 'كارو', 'غالي'], ['Descuento', 'ديسكوينتو', 'خصم'],
                ['Tarjeta', 'تارخيتا', 'بطاقة']
            ],
            [
                ['A', 'Buenas tardes. ¿Puedo ayudarle?', 'مساء الخير، أقدر أساعد حضرتك؟'],
                ['B', 'Busco una camisa azul.', 'بدور على قميص أزرق.'],
                ['A', '¿Qué talla necesita?', 'محتاج مقاس كام؟'],
                ['B', 'La talla mediana. ¿Puedo probármela?', 'المقاس المتوسط. ممكن أجربه؟'],
                ['A', 'Claro. Está en el probador.', 'طبعًا، غرفة القياس هناك.'],
                ['B', 'Perfecto. ¿Cuánto cuesta?', 'تمام، سعره كام؟']
            ],
            [
                ['¿CUÁNTO CUESTA?', 'السؤال المستخدم لمعرفة سعر شيء مفرد.', '¿Cuánto cuesta la camisa?'],
                ['ESTE / ESTA', 'نستخدم este مع المذكر وesta مع المؤنث.', 'Este pantalón / Esta camisa'],
                ['QUEDAR', 'يمكن استخدام quedar لوصف كيف يبدو المقاس على الشخص.', 'La camisa me queda bien.']
            ],
            [
                ['إيه معنى Talla؟', ['مقاس', 'سعر', 'خصم', 'بطاقة'], 0],
                ['إزاي تسأل عن السعر؟', ['¿Cuánto cuesta?', '¿Dónde vives?', '¿Qué hora es?', '¿Quién eres?'], 0],
                ['اختار اسم الإشارة الصحيح:', ['Esta camisa', 'Este camisa', 'Esta pantalones', 'Este zapatos'], 0],
                ['معنى Barato إيه؟', ['رخيص', 'غالي', 'واسع', 'جديد'], 0],
                ['«La camisa me queda bien» معناها:', ['القميص مناسب لي', 'القميص غالي', 'أريد قميصًا', 'أين القميص؟'], 0]
            ]
        ),
        esLesson(
            'u10', 'A2', 'السفر والمواصلات والحجوزات', 'Viajes y transporte',
            ['تحجز تذكرة وتسأل عن المواعيد.', 'تفهم كلمات المطار ومحطة القطار.', 'تشرح مشكلة بسيطة في الرحلة.'],
            [
                ['Billete', 'بييّيتي', 'تذكرة'], ['Ida y vuelta', 'إيدا إي بويلتا', 'ذهاب وعودة'],
                ['Aeropuerto', 'أيروبويرتو', 'مطار'], ['Andén', 'أندين', 'رصيف القطار'],
                ['Equipaje', 'إكيباخي', 'أمتعة'], ['Vuelo', 'بويلو', 'رحلة طيران'],
                ['Retraso', 'ريتراسو', 'تأخير'], ['Reserva', 'ريثيربا', 'حجز'],
                ['Pasaporte', 'باسابورتي', 'جواز سفر'], ['Horario', 'أوراريو', 'جدول المواعيد']
            ],
            [
                ['A', 'Quisiera un billete de ida y vuelta a Madrid.', 'أريد تذكرة ذهاب وعودة إلى مدريد.'],
                ['B', '¿Para qué día?', 'لأي يوم؟'],
                ['A', 'Para el viernes por la mañana.', 'ليوم الجمعة صباحًا.'],
                ['B', 'El tren sale a las nueve desde el andén dos.', 'القطار يتحرك الساعة التاسعة من الرصيف الثاني.'],
                ['A', '¿Hay algún retraso?', 'هل يوجد أي تأخير؟'],
                ['B', 'No, sale a tiempo.', 'لا، سيتحرك في موعده.']
            ],
            [
                ['IDA Y VUELTA', 'تعبير يعني تذكرة ذهاب وعودة.', 'Un billete de ida y vuelta.'],
                ['SALIR A', 'يُستخدم لتحديد موعد مغادرة وسيلة المواصلات.', 'El tren sale a las nueve.'],
                ['¿PARA QUÉ DÍA?', 'سؤال عن اليوم المحدد للحجز أو الموعد.', '¿Para qué día es la reserva?']
            ],
            [
                ['إيه معنى Billete؟', ['تذكرة', 'جواز سفر', 'حقيبة', 'مطار'], 0],
                ['معنى Ida y vuelta إيه؟', ['ذهاب وعودة', 'ذهاب فقط', 'تأخير', 'حجز فندق'], 0],
                ['إيه معنى Andén؟', ['رصيف القطار', 'المطار', 'جواز السفر', 'المقعد'], 0],
                ['اختار الجملة الصحيحة:', ['El tren sale a las nueve', 'El tren es a las nueve sale', 'El tren salen a nueve', 'El tren está sale nueve'], 0],
                ['معنى Retraso إيه؟', ['تأخير', 'موعد', 'تذكرة', 'رحلة'], 0]
            ]
        ),
        esLesson(
            'u11', 'A2', 'الجسم والصحة والمواعيد', 'El cuerpo y la salud',
            ['تصف ألمًا أو عرضًا بسيطًا.', 'تحجز موعدًا وتفهم محادثة قصيرة.', 'تستخدم me duele وme duelen بشكل صحيح.'],
            [
                ['Cabeza', 'كابيثا', 'رأس'], ['Garganta', 'جارغانتا', 'حلق'], ['Espalda', 'إسبالدا', 'ظهر'],
                ['Fiebre', 'فييبري', 'حمّى'], ['Tos', 'توس', 'كحة'], ['Dolor', 'دولور', 'ألم'],
                ['Médico', 'ميديكو', 'طبيب'], ['Farmacia', 'فارماثيا', 'صيدلية'], ['Cita', 'ثيتا', 'موعد'],
                ['Descansar', 'ديسكانسار', 'يرتاح']
            ],
            [
                ['A', 'Buenos días. ¿Qué te pasa?', 'صباح الخير، مالك؟'],
                ['B', 'Me duele la cabeza y tengo fiebre.', 'عندي صداع وعندي حمّى.'],
                ['A', '¿Desde cuándo?', 'من إمتى؟'],
                ['B', 'Desde ayer. También me duele la garganta.', 'من امبارح. وكمان حلقي بيوجعني.'],
                ['A', 'Debes pedir una cita con el médico.', 'لازم تحجز موعد مع الطبيب.'],
                ['B', 'Sí, voy a llamar ahora.', 'أيوه، هتصل دلوقتي.']
            ],
            [
                ['ME DUELE', 'نستخدمها مع اسم مفرد أو فعل في المصدر.', 'Me duele la cabeza.'],
                ['ME DUELEN', 'نستخدمها مع اسم جمع.', 'Me duelen los pies.'],
                ['TENER', 'تعبيرات شائعة للأعراض تستخدم tener.', 'Tengo fiebre / Tengo tos.']
            ],
            [
                ['إيه معنى Garganta؟', ['الحلق', 'الرأس', 'الظهر', 'القدم'], 0],
                ['اختار الصيغة الصحيحة:', ['Me duele la cabeza', 'Me duelen la cabeza', 'Me duele los pies', 'Me duelo la cabeza'], 0],
                ['إزاي تقول «عندي حمّى»؟', ['Tengo fiebre', 'Soy fiebre', 'Estoy fiebre', 'Hago fiebre'], 0],
                ['معنى Cita إيه؟', ['موعد', 'دواء', 'صداع', 'راحة'], 0],
                ['نستخدم Me duelen مع:', ['اسم جمع', 'اسم مفرد فقط', 'اسم مؤنث فقط', 'فعل ماضي'], 0]
            ]
        ),
        esLesson(
            'u12', 'A2', 'التجارب الماضية والإجازات', 'Experiencias y vacaciones',
            ['تتكلم عن رحلة أو تجربة سابقة.', 'تستخدم أفعالًا شائعة في الماضي.', 'تعبّر عن رأيك في تجربة قمت بها.'],
            [
                ['Viaje', 'بياخي', 'رحلة'], ['Vacaciones', 'باكاثيونيس', 'إجازة'], ['Visitar', 'بيثيتار', 'يزور'],
                ['Conocer', 'كونوثير', 'يتعرف على'], ['Probar', 'بروبار', 'يجرب'], ['Museo', 'موسيو', 'متحف'],
                ['Playa', 'بلايا', 'شاطئ'], ['Montaña', 'مونتانيا', 'جبل'], ['Recuerdo', 'ريكويردو', 'ذكرى'],
                ['La semana pasada', 'لا سيمانا باسادا', 'الأسبوع الماضي']
            ],
            [
                ['A', '¿Qué hiciste en las vacaciones?', 'عملت إيه في الإجازة؟'],
                ['B', 'Fui a Barcelona y visité un museo.', 'ذهبت إلى برشلونة وزرت متحفًا.'],
                ['A', '¿Probaste la comida local?', 'جربت الأكل المحلي؟'],
                ['B', 'Sí, probé una paella. ¡Estaba deliciosa!', 'أيوه، جربت باييّا وكانت لذيذة!'],
                ['A', '¿Te gustó el viaje?', 'الرحلة عجبتك؟'],
                ['B', 'Sí, me encantó. Fue una experiencia fantástica.', 'أيوه، عجبتني جدًا. كانت تجربة رائعة.']
            ],
            [
                ['Pretérito indefinido', 'نستخدمه لحدث انتهى في وقت ماضٍ محدد.', 'Ayer visité el museo.'],
                ['SER / IR', 'الفعلان ser وir لهما صيغة fui في الماضي للمفرد مع yo.', 'Fui a Madrid.'],
                ['GUSTAR', 'يتغير الضمير حسب الشخص والشيء الذي أعجبه.', 'Me gustó el viaje.']
            ],
            [
                ['إيه معنى Visitar؟', ['يزور', 'يجرب', 'ينام', 'يشتري'], 0],
                ['معنى La semana pasada إيه؟', ['الأسبوع الماضي', 'الأسبوع القادم', 'كل أسبوع', 'أمس صباحًا'], 0],
                ['اختار الماضي الصحيح مع yo:', ['Fui', 'Voy', 'Iré', 'Iba a'], 0],
                ['إزاي تقول «زرت متحفًا»؟', ['Visité un museo', 'Visito un museo', 'Visitar un museo', 'Estoy museo'], 0],
                ['معنى «Me gustó el viaje» إيه؟', ['الرحلة أعجبتني', 'سافرت غدًا', 'أريد رحلة', 'الرحلة بعيدة'], 0]
            ]
        ),
        esLesson(
            'u13', 'B1', 'الحكايات والتجارب والذكريات', 'Experiencias y recuerdos',
            ['تحكي تجربة ماضية بترتيب زمني واضح.', 'تميّز بين الحدث المكتمل والخلفية والعادة في الماضي.', 'تشرح كيف تغيّرت حياتك أو عاداتك بمرور الوقت.', 'تكتب فقرة من 100 إلى 120 كلمة تستخدم فيها الأزمنة الماضية وروابط السرد.'],
            [
                ['Recuerdo', 'ريكويردو', 'ذكرى'], ['Infancia', 'إنفانثيا', 'طفولة'], ['Mudarse', 'مودارسي', 'ينتقل للسكن'],
                ['Acostumbrarse', 'أكوستومبرارسي', 'يعتاد'], ['Lograr', 'لوغرار', 'ينجح في تحقيق'], ['Darse cuenta', 'دارسي كوينتا', 'يدرك / ينتبه'],
                ['De repente', 'دي ريپينتي', 'فجأة'], ['Mientras tanto', 'ميينتراس تانто', 'في أثناء ذلك'], ['Al principio', 'أل پرينثيپيو', 'في البداية'],
                ['Al final', 'أل فينال', 'في النهاية'], ['Solía', 'سوليا', 'كان معتادًا أن'], ['Experiencia', 'إكسپيريينثيا', 'تجربة']
            ],
            [
                ['A', '¿Cómo era tu vida cuando vivías en Alejandría?', 'كانت حياتك عاملة إزاي لما كنت عايش في الإسكندرية؟'],
                ['B', 'Era bastante tranquila y pasaba mucho tiempo con mis primos.', 'كانت هادية إلى حد كبير وكنت بقضي وقت طويل مع أولاد عمي.'],
                ['A', '¿Y qué pasó cuando empezaste la universidad?', 'وإيه اللي حصل لما بدأت الجامعة؟'],
                ['B', 'Me mudé a otra zona y conocí a personas de muchos lugares.', 'انتقلت لمنطقة تانية واتعرفت على ناس من أماكن كتير.'],
                ['A', '¿Te acostumbraste rápidamente?', 'اتعودت بسرعة؟'],
                ['B', 'Al principio me costaba, pero poco a poco me adapté.', 'في البداية كان الموضوع صعب عليّ، لكن اتأقلمت تدريجيًا.'],
                ['A', '¿Qué fue lo más importante de esa etapa?', 'إيه أهم حاجة في المرحلة دي؟'],
                ['B', 'Me di cuenta de que podía lograr más de lo que pensaba.', 'اكتشفت إني أقدر أحقق أكتر مما كنت متخيل.']
            ],
            [
                ['INDEFINIDO E IMPERFECTO', 'نستخدم indefinido لحدث ماضٍ مكتمل، وimperfecto لوصف الخلفية أو العادة أو الحالة المستمرة وقتها.', 'Ayer conocí a Laura. Antes vivía en Sevilla.'],
                ['PRETÉRITO PERFECTO', 'يشيع مع فترة زمنية لم تنتهِ بعد، مثل hoy وesta semana، مع اختلافات استعمال بين البلدان.', 'Esta semana he leído dos libros.'],
                ['SOLER + INFINITIVO', 'يعبّر عن عادة متكررة في الحاضر أو الماضي؛ solía هي صيغة imperfecto من soler.', 'De pequeño, solía jugar aquí.'],
                ['SEGUIR / DEJAR DE + INFINITIVO', 'seguir + gerundio يعني الاستمرار في فعل، وdejar de + infinitivo يعني التوقف عنه.', 'Sigo estudiando español. Dejé de fumar.'],
                ['CONNECTORS', 'رتّب السرد باستخدام al principio وdespués وmientras tanto وde repente وal final.', 'Al principio tenía miedo; después me acostumbré.']
            ],
            [
                ['أي جملة تصف عادة في الماضي؟', ['Ayer fui al centro', 'De niño, jugaba en el parque', 'Mañana iré al centro', 'He ido hoy'], 1],
                ['اختار الماضي المناسب: «Ayer ___ a Marta».', ['conocía', 'conozco', 'conocí', 'conoceré'], 2],
                ['ما وظيفة «de repente»؟', ['في النهاية', 'فجأة', 'عادةً', 'منذ ذلك الوقت'], 1],
                ['أكمل: «Esta semana ___ mucho».', ['estudié ayer', 'estudio ayer', 'he estudiado', 'estudiaba mañana'], 2],
                ['«Solía vivir aquí» معناها:', ['سأعيش هنا', 'اعتدت أن أعيش هنا', 'أعيش هنا الآن فقط', 'أريد أن أعيش هنا'], 1],
                ['أي رابط يدل على التزامن؟', ['Mientras tanto', 'Al final', 'Por eso', 'Sin embargo'], 0],
                ['أكمل: «Sigo ___ español».', ['estudiar', 'estudiando', 'estudié', 'estudiado'], 1],
                ['أي صيغة تعبّر عن حدث مكتمل في وقت ماضٍ محدد؟', ['Imperfecto', 'Presente', 'Indefinido', 'Gerundio'], 2]
            ]
        ),
        esLesson(
            'u14', 'B1', 'الدراسة والعمل والحياة المهنية', 'Los estudios y el trabajo',
            ['تتحدث عن الدراسة والخبرة والمهام المهنية.', 'تصف مدة نشاط بدأ في الماضي وما زال مستمرًا.', 'تكتب طلبًا بسيطًا وتستعد لمقابلة عمل.', 'تصوغ رسالة تقديم قصيرة من 100 إلى 120 كلمة بلغة مهنية مهذبة.'],
            [
                ['Puesto', 'پويستو', 'وظيفة / منصب'], ['Solicitud', 'سوليثيتود', 'طلب / استمارة تقديم'], ['Currículum', 'كورّيكولوم', 'سيرة ذاتية'],
                ['Entrevista', 'إنتريبيستا', 'مقابلة'], ['Experiencia laboral', 'إكسپيريينثيا لابورال', 'خبرة عملية'], ['Jornada', 'خورنادا', 'يوم / ساعات العمل'],
                ['Contrato', 'كونتراتو', 'عقد'], ['Prácticas', 'پراكتِكاس', 'تدريب عملي'], ['Asignatura', 'أسيغناتورا', 'مادة دراسية'],
                ['Matrícula', 'ماتريكولا', 'تسجيل دراسي'], ['Plazo', 'پلاثو', 'مهلة / موعد نهائي'], ['Beca', 'بيكا', 'منحة دراسية']
            ],
            [
                ['A', 'Buenos días. ¿A qué puesto se presenta?', 'صباح الخير. بتقدم على وظيفة إيه؟'],
                ['B', 'Al puesto de asistente administrativo. Tengo experiencia en atención al cliente.', 'لوظيفة مساعد إداري. عندي خبرة في خدمة العملاء.'],
                ['A', '¿Cuánto tiempo lleva trabajando en ese sector?', 'بقالك قد إيه بتشتغل في المجال ده؟'],
                ['B', 'Llevo dos años trabajando en una empresa pequeña.', 'بقالي سنتين بشتغل في شركة صغيرة.'],
                ['A', '¿Qué tareas realizaba allí?', 'كنت بتقوم بإيه من مهام هناك؟'],
                ['B', 'Organizaba documentos y atendía las consultas de los clientes.', 'كنت بنظم المستندات وبرد على استفسارات العملاء.'],
                ['A', '¿Cuándo podría incorporarse?', 'تقدر تبدأ الشغل إمتى؟'],
                ['B', 'Podría incorporarme a principios del mes que viene.', 'أقدر أبدأ في أول الشهر الجاي.']
            ],
            [
                ['LLEVAR + GERUNDIO', 'للتعبير عن مدة فعل بدأ في الماضي وما زال مستمرًا: llevar + مدة + gerundio.', 'Llevo tres meses estudiando español.'],
                ['DESDE HACE', 'تحدد مدة استمرار الحالة حتى الوقت الحالي، ويتبعها زمن حاضر غالبًا.', 'Trabajo aquí desde hace dos años.'],
                ['ACABAR DE + INFINITIVO', 'تعني أن الفعل حدث منذ لحظات أو منذ وقت قريب.', 'Acabo de enviar mi currículum.'],
                ['POR Y PARA', 'por قد يعبّر عن السبب أو الوسيلة أو المدة؛ وpara عن الغاية أو المستلِم أو الموعد النهائي.', 'Estudio para aprender. Lo envié por correo.'],
                ['PODER EN CONDICIONAL', 'podría صيغة مهذبة لعرض القدرة أو طلب فرصة دون مباشرة زائدة.', 'Podría trabajar por las tardes.']
            ],
            [
                ['«Currículum» يعني:', ['عقد', 'سيرة ذاتية', 'منحة', 'مقابلة'], 1],
                ['أكمل: «Llevo un año ___ aquí».', ['trabajé', 'trabajar', 'trabajando', 'trabajado'], 2],
                ['«Acabo de llegar» معناها:', ['سأصل لاحقًا', 'وصلت منذ قليل', 'كنت أصل دائمًا', 'أريد الوصول'], 1],
                ['أي جملة تعبّر عن الغاية؟', ['Lo hice por ti', 'Trabajo para aprender', 'Viajé por tren', 'Estuve allí por dos días'], 1],
                ['ما معنى «plazo» في سياق التقديم؟', ['مهلة نهائية', 'راتب', 'مقابلة', 'خبرة'], 0],
                ['اختار الطلب الأكثر تهذيبًا:', ['Dame trabajo', 'Podría tener una entrevista', 'Tú me contratas', 'Quiero ahora'], 1],
                ['«Desde hace dos meses» تشير إلى:', ['مدة بدأت في الماضي ومستمرة', 'موعد في المستقبل فقط', 'حدث انتهى أمس', 'عادة يومية قديمة'], 0],
                ['«Prácticas» في سياق الدراسة والعمل تعني:', ['إجازة', 'تدريب عملي', 'امتحان شفهي', 'عقد دائم'], 1]
            ]
        ),
        esLesson(
            'u15', 'B1', 'إبداء الرأي والنقاش والتفاعل', 'Opiniones y debates',
            ['تعرض رأيك وتدعمه بسبب أو مثال.', 'توافق وتختلف باحترام وتطلب توضيحًا.', 'تستخدم subjuntivo في تراكيب شائعة للتوصية والشك.', 'تكتب رأيًا منظمًا من 120 إلى 140 كلمة يتضمن موقفًا وسببين ومثالًا.'],
            [
                ['Punto de vista', 'پونتو دي بيستا', 'وجهة نظر'], ['Estar de acuerdo', 'إستار دي أكويردو', 'يوافق'], ['Discrepar', 'ديسكريپار', 'يختلف في الرأي'],
                ['Argumento', 'أرغومينتو', 'حُجّة'], ['Ventaja', 'بينتاخا', 'ميزة'], ['Inconveniente', 'إنكونبينيينتي', 'عيب / جانب سلبي'],
                ['Proponer', 'پروپونير', 'يقترح'], ['Sugerir', 'سوخيرير', 'يلمح / يقترح'], ['Recomendar', 'ريكوميندار', 'يوصي'],
                ['Exigir', 'إكسيخير', 'يطالب'], ['Aclarar', 'أكلارار', 'يوضّح'], ['Desde mi punto de vista', 'ديسدي مي پونتو دي بيستا', 'من وجهة نظري']
            ],
            [
                ['A', 'Desde mi punto de vista, estudiar en grupo tiene muchas ventajas.', 'من وجهة نظري، المذاكرة في مجموعة ليها مميزات كتير.'],
                ['B', 'Estoy de acuerdo, aunque a veces cuesta ponerse de acuerdo.', 'متفق، رغم إن أحيانًا بيكون صعب نوصل لاتفاق.'],
                ['A', '¿Qué propones para organizar el trabajo?', 'تقترح إيه عشان ننظم الشغل؟'],
                ['B', 'Sugiero que dividamos las tareas según nuestras habilidades.', 'أقترح إننا نقسم المهام حسب مهاراتنا.'],
                ['A', 'No creo que esa solución sea suficiente.', 'مش شايف إن الحل ده كفاية.'],
                ['B', 'Entonces, recomiendo que añadamos una reunión semanal.', 'إذن أوصي إننا نضيف اجتماع أسبوعي.'],
                ['A', 'Buena idea. ¿Podrías explicar cómo funcionaría?', 'فكرة كويسة. ممكن توضح هتشتغل إزاي؟'],
                ['B', 'Claro. Así todos sabrán qué tienen que hacer.', 'طبعًا. كده كل واحد هيعرف المطلوب منه.']
            ],
            [
                ['CREO QUE + INDICATIVO', 'بعد creo que نستخدم غالبًا indicativo عند تقديم الرأي باعتباره اعتقادًا مثبتًا.', 'Creo que la propuesta es útil.'],
                ['NO CREO QUE + SUBJUNTIVO', 'بعد نفي الاعتقاد بـ no creo que يأتي subjuntivo في الاستعمال المعتاد.', 'No creo que sea una buena idea.'],
                ['RECOMENDAR / SUGERIR QUE', 'عند اقتراح أن يقوم شخص بفعل شيء، يأتي subjuntivo بعد que.', 'Sugiero que hablemos mañana.'],
                ['ESTAR DE ACUERDO', 'يأتي غالبًا مع con عند ذكر الشخص أو الرأي، ويمكن أن يتبعه en que.', 'Estoy de acuerdo contigo.'],
                ['AUNQUE', 'مع حقيقة مؤكدة يمكن استخدام indicativo؛ ومع احتمال غير محسوم قد يستخدم subjuntivo.', 'Aunque es difícil, lo intentaré.']
            ],
            [
                ['أكمل: «Creo que esta idea ___ útil».', ['sea', 'es', 'fuera', 'ser'], 1],
                ['أكمل: «No creo que ellos ___ razón».', ['tienen', 'tendrán', 'tengan', 'tener'], 2],
                ['أي عبارة تعني «أختلف معك»؟', ['Estoy de acuerdo', 'No estoy de acuerdo', 'Me da igual', 'Por supuesto'], 1],
                ['أكمل: «Sugiero que ___ una pausa».', ['hacemos', 'hicimos', 'hagamos', 'hacer'], 2],
                ['«Ventaja» معناها:', ['عيب', 'ميزة', 'سبب', 'نتيجة'], 1],
                ['أي تركيب يقدم وجهة نظر؟', ['Desde mi punto de vista', 'De repente', 'A partir de mañana', 'Hace dos años'], 0],
                ['بعد «Aunque es tarde» استُخدم:', ['Indicativo لحقيقة معروضة', 'Infinitivo فقط', 'Condicional compuesto', 'Imperativo'], 0],
                ['اختار صيغة مهذبة لطلب التوضيح:', ['No entiendes nada', 'Acláralo ya', '¿Podrías explicarlo?', 'Explícamelo obligatoriamente'], 2]
            ]
        ),
        esLesson(
            'u16', 'B1', 'المدينة والبيئة والمجتمع', 'La ciudad y el medio ambiente',
            ['تصف مشكلة بيئية وأسبابها ونتائجها.', 'تقترح حلولًا عملية لتحسين الحي أو المدينة.', 'تستخدم se impersonal والتراكيب النسبية الأساسية.', 'تكتب مقترحًا من 120 كلمة يربط المشكلة بأسبابها وحلين قابلين للتنفيذ.'],
            [
                ['Contaminación', 'كونتاميناثيون', 'تلوث'], ['Residuos', 'ريسيذووس', 'مخلّفات'], ['Reciclaje', 'ريثيكلاخي', 'إعادة تدوير'],
                ['Transporte público', 'ترانسبورتي پوپليكو', 'مواصلات عامة'], ['Peatón', 'پياتون', 'مشاة'], ['Carril bici', 'كارّيل بييثي', 'مسار دراجات'],
                ['Ahorro', 'أورّو', 'توفير'], ['Energía renovable', 'إنيرخيا رينوبابلي', 'طاقة متجددة'], ['Ruido', 'روِيذو', 'ضوضاء'],
                ['Barrio', 'بارّيو', 'حيّ'], ['Reducir', 'ريذوثير', 'يقلّل'], ['Mejorar', 'ميخورار', 'يحسّن']
            ],
            [
                ['A', '¿Qué problema afecta más a nuestro barrio?', 'إيه أكتر مشكلة مأثرة على حينا؟'],
                ['B', 'Creo que la contaminación y el ruido son los principales problemas.', 'أعتقد إن التلوث والضوضاء هما أكبر مشكلتين.'],
                ['A', '¿Cómo podríamos reducirlos?', 'ممكن نقللهم إزاي؟'],
                ['B', 'Se debería mejorar el transporte público y crear más carriles bici.', 'المفروض نحسّن المواصلات العامة ونعمل مسارات دراجات أكتر.'],
                ['A', '¿Y qué podemos hacer con los residuos?', 'ونقدر نعمل إيه بالمخلّفات؟'],
                ['B', 'Se pueden separar los residuos para facilitar el reciclaje.', 'ممكن نفرز المخلفات عشان نسهل إعادة تدويرها.'],
                ['A', '¿Conoces alguna zona donde ya se haga?', 'تعرف منطقة بيتعمل فيها ده بالفعل؟'],
                ['B', 'Sí, hay un barrio donde los vecinos organizan campañas cada mes.', 'أيوه، فيه حي السكان فيه بينظموا حملات كل شهر.']
            ],
            [
                ['SE IMPERSONAL', 'نستخدم se مع فعل مفرد للتحدث عن فعل عام دون تحديد الفاعل.', 'En esta ciudad se trabaja mucho.'],
                ['PASIVA REFLEJA', 'نستخدم se مع فعل يوافق الاسم الذي يأتي بعده عندما يكون المقصود أن الشيء يقع عليه الفعل.', 'Se reciclan las botellas.'],
                ['HABER QUE / DEBERÍA', 'hay que للتعبير عن ضرورة عامة، وdebería لتقديم نصيحة أو توصية.', 'Hay que ahorrar agua. Deberíamos reciclar.'],
                ['ORACIONES DE RELATIVO', 'que يربط الاسم بوصف أو معلومة، وdonde يشير إلى مكان.', 'Es una zona donde hay muchos árboles.'],
                ['CAUSA Y CONSECUENCIA', 'بسبب: debido a / por; والنتيجة: por eso / por lo tanto.', 'Hay tráfico; por eso llegamos tarde.']
            ],
            [
                ['«Residuos» تعني:', ['مواصلات', 'مخلّفات', 'حدائق', 'طاقة'], 1],
                ['أكمل: «En esta ciudad ___ mucho».', ['se trabaja', 'se trabajan', 'lo trabaja', 'están trabajar'], 0],
                ['أكمل: «Se ___ las botellas».', ['recicla', 'reciclan', 'reciclar', 'recicló que'], 1],
                ['أي عبارة تقدم نصيحة؟', ['Deberíamos usar el transporte público', 'Ayer usamos el tren', 'Usaremos el tren', 'Hemos usado el tren'], 0],
                ['«Carril bici» هو:', ['رصيف القطار', 'مسار للدراجات', 'موقف سيارات', 'إشارة مرور'], 1],
                ['اختار أداة الربط التي تقدم نتيجة:', ['Aunque', 'Mientras', 'Por eso', 'En cambio'], 2],
                ['أكمل: «Es un barrio ___ hay muchos parques».', ['quien', 'donde', 'cuyo', 'cuando'], 1],
                ['ما المقصود بـ «energía renovable»؟', ['طاقة متجددة', 'طاقة ملوثة', 'ضوضاء', 'نفايات'], 0]
            ]
        ),
        esLesson(
            'u17', 'B1', 'الإعلام والتواصل والمعلومات', 'Los medios y la comunicación',
            ['تفهم خبرًا وتحدد مصدره وفكرته الأساسية.', 'تنقل كلام شخص آخر بصورة مباشرة أو غير مباشرة.', 'تقيّم موثوقية معلومة قبل مشاركتها.', 'تلخص خبرًا في 100 كلمة مع الفصل بين الوقائع والرأي.'],
            [
                ['Noticia', 'نوتيثيا', 'خبر'], ['Titular', 'تيتولار', 'عنوان الخبر'], ['Fuente', 'فوينتي', 'مصدر'],
                ['Reportaje', 'ريبورتاخي', 'تحقيق صحفي'], ['Entrevista', 'إنتريبيستا', 'مقابلة'], ['Red social', 'ريد سوثيال', 'شبكة اجتماعية'],
                ['Difundir', 'ديفونذير', 'ينشر / يذيع'], ['Compartir', 'كومپارتير', 'يشارك'], ['Comprobar', 'كومپروبار', 'يتحقق'],
                ['Rumor', 'رومور', 'إشاعة'], ['Fiable', 'فيابلي', 'موثوق'], ['Audiencia', 'أودييينثيا', 'جمهور']
            ],
            [
                ['A', '¿Has leído la noticia sobre el nuevo proyecto?', 'قريت الخبر عن المشروع الجديد؟'],
                ['B', 'Sí, pero todavía no he comprobado la fuente.', 'أيوه، لكن لسه ما تحققتش من المصدر.'],
                ['A', 'El periodista afirma que el proyecto empezará en junio.', 'الصحفي بيؤكد إن المشروع هيبدأ في يونيو.'],
                ['B', 'En otra entrevista, la portavoz dijo que necesitaban más tiempo.', 'في مقابلة تانية، المتحدثة قالت إنهم محتاجين وقت أكتر.'],
                ['A', 'Entonces, la fecha aún no está confirmada.', 'إذن الموعد لسه متأكدش.'],
                ['B', 'Exactamente. No deberíamos difundir rumores.', 'بالضبط. المفروض ما ننشرش إشاعات.'],
                ['A', '¿Qué haces cuando recibes información dudosa?', 'بتعمل إيه لما توصلك معلومة مش مؤكدة؟'],
                ['B', 'Busco la fuente original y comparo varios medios fiables.', 'بدور على المصدر الأصلي وبقارن بين أكتر من وسيلة موثوقة.']
            ],
            [
                ['ESTILO INDIRECTO', 'لنقل كلام شخص آخر نستخدم que، ونعدّل الضمائر والزمن بحسب سياق النقل.', 'Dice: «Estoy ocupado». → Dice que está ocupado.'],
                ['ESTILO INDIRECTO EN PASADO', 'إذا كان فعل النقل في الماضي، قد يرجع المضارع إلى imperfecto بحسب السياق.', 'Dijo: «No tengo tiempo». → Dijo que no tenía tiempo.'],
                ['PREGUNTAS INDIRECTAS', 'تأتي دون علامات السؤال المباشر، مع الحفاظ على أداة الاستفهام عند الحاجة.', 'Me preguntó dónde vivía.'],
                ['AFIRMAR / NEGAR / SOSTENER', 'أفعال دقيقة لتقديم موقف المصدر؛ اختر الفعل وفق ما قاله فعلًا.', 'La portavoz afirmó que el plan seguía adelante.'],
                ['VERIFICAR FUENTES', 'ميّز بين الخبر والرأي والإشاعة، وابحث عن المصدر الأصلي والتاريخ والسياق.', 'Antes de compartirlo, comprueba la fuente.']
            ],
            [
                ['«Fuente» في الخبر تعني:', ['عنوان', 'مصدر', 'جمهور', 'إشاعة'], 1],
                ['حوّل: «Estoy ocupado» قال إنه:', ['está ocupado', 'estaba ocupado', 'estará ocupar', 'estoy ocupado'], 1],
                ['أي صيغة تعني «التحقق من المعلومة»؟', ['Difundir', 'Compartir', 'Comprobar', 'Rumorear'], 2],
                ['«Dijo que necesitaba tiempo» هي:', ['سؤال مباشر', 'أسلوب غير مباشر', 'أمر مباشر', 'مستقبل بسيط'], 1],
                ['ما معنى «fiable»؟', ['موثوق', 'قديم', 'مجهول', 'عاجل'], 0],
                ['أكمل السؤال غير المباشر: «Me preguntó ___ vivía».', ['qué', 'dónde', 'quién', 'cuándo es'], 1],
                ['قبل مشاركة خبر مشكوك فيه، الأفضل أن:', ['ننشره بسرعة', 'نحذف المصدر', 'نتحقق من المصدر والسياق', 'نغيّر العنوان'], 2],
                ['«Titular» تعني:', ['عنوان الخبر', 'مقابلة', 'شبكة اجتماعية', 'مراسل'], 0]
            ]
        ),
        esLesson(
            'u18', 'B1', 'الخطط والقرارات وحل المشكلات', 'Planes y decisiones',
            ['تتحدث عن خطط وتوقعات مستقبلية.', 'تقدم نصيحة أو طلبًا مهذبًا باستخدام condicional.', 'تربط شرطًا بنتيجة وتستخدم subjuntivo بعد بعض روابط الزمن.', 'تكتب خطة مستقبلية من 100 إلى 120 كلمة تتضمن هدفًا وخطوات وبديلًا.'],
            [
                ['Objetivo', 'أوبيتِيبو', 'هدف'], ['Oportunidad', 'أوپورتونيداد', 'فرصة'], ['Riesgo', 'رييسغو', 'مخاطرة'],
                ['Decisión', 'ديثيسيون', 'قرار'], ['Posibilidad', 'پوسيبيليذاد', 'احتمال'], ['Alcanzar', 'ألكانثار', 'يحقق / يبلغ'],
                ['Conseguir', 'كونسيغير', 'يحصل على / ينجز'], ['Ahorrar', 'أورّار', 'يدّخر / يوفّر'], ['Solicitar', 'سوليثيتار', 'يتقدم بطلب'],
                ['En el futuro', 'إن إل فوتورو', 'في المستقبل'], ['Dentro de', 'دينترو دي', 'بعد / خلال'], ['Tomar una decisión', 'تومار أونا ديثيسيون', 'يتخذ قرارًا']
            ],
            [
                ['A', '¿Qué harás cuando termines el curso?', 'هتعمل إيه لما تخلص الكورس؟'],
                ['B', 'Solicitaré una beca y buscaré una oportunidad de prácticas.', 'هقدم على منحة وهبحث عن فرصة تدريب عملي.'],
                ['A', '¿Y si no consigues la beca?', 'ولو ما حصلتش على المنحة؟'],
                ['B', 'Si no la consigo, ahorraré dinero y volveré a solicitarla el año siguiente.', 'لو ما حصلتش عليها، هدخر فلوس وهقدم تاني السنة الجاية.'],
                ['A', 'Yo en tu lugar, prepararía también un plan alternativo.', 'أنا مكانك، كنت هجهز خطة بديلة كمان.'],
                ['B', 'Tienes razón. ¿Podrías recomendarme alguna opción?', 'معاك حق. ممكن ترشح لي اختيار؟'],
                ['A', 'Podrías buscar programas que ofrezcan formación práctica.', 'ممكن تدور على برامج بتقدم تدريب عملي.'],
                ['B', 'Lo haré en cuanto termine los exámenes.', 'هعمل كده بمجرد ما أخلص الامتحانات.']
            ],
            [
                ['FUTURO SIMPLE', 'نستخدمه للتوقعات والقرارات المستقبلية؛ يضاف غالبًا إلى المصدر النهايات -é, -ás, -á, -emos, -éis, -án.', 'Mañana solicitaré la beca.'],
                ['CONDICIONAL SIMPLE', 'للطلب المهذب أو النصيحة أو موقف افتراضي في الحاضر.', '¿Podrías ayudarme? Yo estudiaría más.'],
                ['SI + PRESENTE, FUTURO', 'في الشرط الواقعي الممكن: si + presente ثم futuro أو أمر حسب المعنى.', 'Si estudio, aprobaré.'],
                ['CUANDO + SUBJUNTIVO', 'عند الإشارة إلى حدث مستقبلي لم يحدث بعد، يأتي subjuntivo بعد cuando.', 'Cuando termine, te llamaré.'],
                ['EN CUANTO / TAN PRONTO COMO', 'روابط زمنية تعني بمجرد أن، ويأتي بعدها subjuntivo عند الحديث عن المستقبل.', 'En cuanto llegue, te escribiré.']
            ],
            [
                ['أكمل: «Mañana ___ al profesor».', ['escribí', 'escribiré', 'escribía', 'escribiendo'], 1],
                ['أي جملة طلب مهذب؟', ['Ayúdame ahora', '¿Podrías ayudarme?', 'Me ayudas ayer', 'Ayudado tú'], 1],
                ['أكمل: «Si tengo tiempo, te ___».', ['llamé', 'llamaba', 'llamaré', 'llamaría ayer'], 2],
                ['أكمل: «Cuando ___ el examen, descansaré».', ['termino ayer', 'termine', 'terminé', 'terminaba'], 1],
                ['«Riesgo» تعني:', ['فرصة', 'هدف', 'مخاطرة', 'قرار'], 2],
                ['صيغة المستقبل مع nosotros من estudiar هي:', ['estudiamos ayer', 'estudiaremos', 'estudiaríamos', 'estudiábamos'], 1],
                ['«En cuanto llegue» معناها:', ['قبل أن أصل', 'بمجرد أن أصل', 'بعد أن وصلت أمس', 'لو كنت وصلت'], 1],
                ['«Yo en tu lugar, prepararía un plan» تعبّر عن:', ['نصيحة افتراضية', 'أمر ماضٍ', 'حقيقة علمية', 'حدث متكرر'], 0]
            ]
        ),
        esLesson(
            'u19', 'B2', 'الحجاج المتقدم وبناء الرأي', 'Argumentación y debate',
            ['تبني حجة مترابطة وتدعمها بأدلة وأمثلة.', 'توازن بين وجهات نظر متعارضة وتوضح حدود موقفك.', 'تختار indicativo أو subjuntivo بعد aunque وفق درجة تحقق المعلومة.', 'تكتب مقالًا حجاجيًا من 180 إلى 220 كلمة بمقدمة وحجج واعتراض وخاتمة.'],
            [
                ['Evidencia', 'إبيذينثيا', 'دليل'], ['Perspectiva', 'پيرسپيكتيبا', 'منظور'], ['Postura', 'پوستورا', 'موقف فكري'],
                ['Matizar', 'ماثيسار', 'يدقّق / يخفف حدة الرأي'], ['Cuestionar', 'كويستيونار', 'يشكك / يطرح تساؤلًا'], ['Respaldar', 'ريسپالدار', 'يدعم'],
                ['Consecuencia', 'كونسيكوينثيا', 'نتيجة'], ['Medida', 'ميذيذا', 'إجراء / تدبير'], ['Ámbito', 'أمبيتو', 'مجال / نطاق'],
                ['Desigualdad', 'ديسيغوالذاد', 'عدم مساواة'], ['Sostenible', 'سوستيني بلي', 'مستدام'], ['Contradictorio', 'كونتراذيكتوريو', 'متناقض']
            ],
            [
                ['A', '¿Consideras que el teletrabajo mejora la calidad de vida?', 'هل شايف إن العمل عن بُعد بيحسن جودة الحياة؟'],
                ['B', 'En muchos casos sí, siempre que exista una organización adecuada.', 'في حالات كتير أيوه، بشرط وجود تنظيم مناسب.'],
                ['A', 'Sin embargo, también puede aumentar el aislamiento.', 'ومع ذلك، ممكن كمان يزود العزلة.'],
                ['B', 'Es cierto. No obstante, esa consecuencia depende del contexto.', 'صحيح. لكن النتيجة دي بتعتمد على السياق.'],
                ['A', '¿Qué medidas respaldarías para evitarla?', 'إيه الإجراءات اللي هتدعمها لتجنبها؟'],
                ['B', 'Propondría encuentros presenciales y una distribución clara de tareas.', 'هقترح لقاءات حضورية وتوزيع واضح للمهام.'],
                ['A', 'Aunque la propuesta parezca costosa, podría ser eficaz.', 'رغم إن الاقتراح قد يبدو مكلفًا، ممكن يكون فعالًا.'],
                ['B', 'De acuerdo; habría que evaluar sus resultados antes de generalizarla.', 'متفق؛ لازم نقيّم نتائجها قبل تعميمها.']
            ],
            [
                ['AUNQUE + INDICATIVO', 'نستخدم indicativo عندما نقدم الأمر بوصفه حقيقة أو معلومة مؤكدة.', 'Aunque es caro, funciona bien.'],
                ['AUNQUE + SUBJUNTIVO', 'نستخدم subjuntivo عندما يكون الأمر افتراضيًا أو غير مؤكد أو غير مهم للحجة.', 'Aunque sea caro, lo compraremos.'],
                ['CONTRASTE', 'sin embargo وno obstante يقدمان تعارضًا؛ en cambio يقارن بين حالتين.', 'Es caro; sin embargo, es eficaz.'],
                ['CONSECUENCIA', 'por consiguiente وpor lo tanto يقدمان نتيجة منطقية لما سبق.', 'Faltan datos; por lo tanto, no concluiremos aún.'],
                ['NO SOLO..., SINO TAMBIÉN...', 'تضيف عنصرًا ثانيًا موازيًا للأول، مع الحفاظ على تركيب متوازن.', 'No solo informa, sino que también educa.']
            ],
            [
                ['أكمل حقيقة مؤكدة: «Aunque ___ difícil, es posible».', ['sea', 'fuera', 'es', 'sería'], 2],
                ['أكمل احتمالًا غير محسوم: «Aunque ___ difícil, lo intentaremos».', ['es', 'fue', 'sea', 'será'], 2],
                ['أي رابط يقدم نتيجة منطقية؟', ['Sin embargo', 'Por lo tanto', 'En cambio', 'Aunque'], 1],
                ['«Respaldar una propuesta» تعني:', ['رفض الاقتراح', 'دعم الاقتراح', 'تأجيل الاقتراح', 'تغيير موضوع النقاش'], 1],
                ['أي عبارة تضيف عنصرًا ثانيًا؟', ['No solo..., sino también...', 'A pesar de que...', 'En cuanto...', 'Antes de que...'], 0],
                ['«Matizar una opinión» تعني:', ['إلغاء الرأي', 'توضيح الرأي وتحديده بدقة', 'تكرار الرأي', 'تجاهل الأدلة'], 1],
                ['اختر الرابط الأنسب: «El plan es caro; ___, puede ser rentable».', ['por consiguiente', 'sin embargo', 'por eso', 'de modo que'], 1],
                ['«Evidencia» تشير إلى:', ['دليل', 'توقع', 'شائعة', 'اعتراض شخصي'], 0]
            ]
        ),
        esLesson(
            'u20', 'B2', 'التواصل الرسمي والكتابة المهنية', 'Comunicación formal y profesional',
            ['تكتب رسالة رسمية بطلب واضح ونبرة مناسبة.', 'تلخص تقريرًا وتعرض نتائجه بترابط.', 'تستخدم المبني للمجهول والتراكيب غير الشخصية بوعي.', 'تنجز بريدًا رسميًا من 150 كلمة وتقريرًا موجزًا يوضح النتيجة والتوصية.'],
            [
                ['Destinatario', 'ديستيناتاريو', 'المُرسَل إليه'], ['Asunto', 'أسونتو', 'موضوع الرسالة'], ['Adjunto', 'أذخونتو', 'مرفق'],
                ['Convocatoria', 'كونبوكاتوريا', 'إعلان / دعوة رسمية'], ['Requisito', 'ريكيسيتو', 'متطلب'], ['Propuesta', 'پروپويستا', 'مقترح'],
                ['Informe', 'إنفورمي', 'تقرير'], ['Conclusión', 'كونكلوسيون', 'خلاصة / استنتاج'], ['Apartado', 'أپارطاذو', 'قسم / بند'],
                ['Agradecer', 'أغراذيثير', 'يشكر'], ['Quedar a la espera', 'كيذار آ لا إسپيرا', 'ينتظر ردًا'], ['Atentamente', 'أتينتامينتي', 'مع خالص التحية']
            ],
            [
                ['A', 'Estimada profesora: Me pongo en contacto con usted para solicitar información sobre la convocatoria.', 'الأستاذة الفاضلة: أتواصل مع حضرتك لطلب معلومات عن الإعلان.'],
                ['B', 'Con mucho gusto. ¿Qué requisito desea consultar?', 'بكل سرور. أي متطلب تود الاستفسار عنه؟'],
                ['A', 'Quisiera saber si se aceptan solicitudes después del plazo indicado.', 'أود معرفة ما إذا كانت الطلبات تُقبل بعد الموعد المحدد.'],
                ['B', 'Las solicitudes se revisan por orden de llegada y no se admiten fuera de plazo.', 'تتم مراجعة الطلبات حسب ترتيب وصولها ولا تُقبل بعد الموعد.'],
                ['A', 'Le agradecería que me confirmara qué documentos deben adjuntarse.', 'أكون شاكرًا لو أكدتِ لي المستندات التي يجب إرفاقها.'],
                ['B', 'Debe adjuntar el formulario y una copia del certificado.', 'يجب إرفاق الاستمارة ونسخة من الشهادة.'],
                ['A', 'Muchas gracias por su atención. Quedo a la espera de su respuesta.', 'شكرًا جزيلًا لاهتمامك. أنتظر رد حضرتك.'],
                ['B', 'Reciba un cordial saludo.', 'تفضّل بقبول خالص التحية.']
            ],
            [
                ['REGISTRO FORMAL', 'استخدم usted وصيغ الاحترام، وابتعد عن الأوامر المباشرة والاختصارات العامية في الرسائل الرسمية.', '¿Podría enviarme la información, por favor?'],
                ['LE AGRADECERÍA QUE + SUBJUNTIVO', 'صيغة مهذبة لطلب شيء؛ إذا كان الطلب متعلقًا بالحاضر أو المستقبل بعد agradecería، يشيع imperfecto de subjuntivo.', 'Le agradecería que me enviara el documento.'],
                ['PASIVA CON SER', 'ser + participio يبرز المفعول به، ويتفق اسم المفعول مع الفاعل النحوي في النوع والعدد.', 'El informe fue aprobado. Las solicitudes fueron revisadas.'],
                ['SE IMPERSONAL Y PASIVA REFLEJA', 'se impersonal مع فعل مفرد دون فاعل محدد؛ أما pasiva refleja فيتفق الفعل مع الاسم المتأثر بالفعل.', 'Se trabaja bien aquí. Se publicaron los resultados.'],
                ['ESTRUCTURA DE UN CORREO', 'رتّب الرسالة إلى saludo، motivo، detalles، petición، despedida؛ واجعل الموضوع محددًا.', 'Asunto: Solicitud de información']
            ],
            [
                ['ما المقصود بـ «destinatario»؟', ['المرسل', 'المُرسَل إليه', 'المرفق', 'الموضوع'], 1],
                ['أي افتتاحية رسمية مناسبة؟', ['Qué pasa', 'Estimado señor:', 'Oye', 'Hola, tío'], 1],
                ['أكمل: «El informe ___ aprobado ayer».', ['fue', 'fueron', 'serán', 'está aprobar'], 0],
                ['أكمل الطلب المهذب: «Le agradecería que me ___».', ['envía', 'enviará', 'enviara', 'enviar'], 2],
                ['«Adjunto» في البريد تعني:', ['عنوان', 'ملف مرفق', 'توقيع', 'موعد نهائي'], 1],
                ['أي صيغة pasiva refleja صحيحة؟', ['Se publicaron los resultados', 'Se publicó los resultados', 'Se publican ayer los resultados', 'Los resultados se publicar'], 0],
                ['ما الترتيب المنطقي للرسالة الرسمية؟', ['طلب ثم تحية ثم موضوع', 'تحية ثم سبب الرسالة ثم التفاصيل ثم ختام', 'ختام ثم مرفقات ثم تحية', 'تفاصيل بلا عنوان أو غرض'], 1],
                ['«Quedo a la espera de su respuesta» تعني:', ['أرفض الرد', 'أنتظر رد حضرتك', 'أرسلت الرد بالفعل', 'أطلب إلغاء الرسالة'], 1]
            ]
        ),
        esLesson(
            'u21', 'B2', 'الفرضيات والندم والاحتمالات', 'Hipótesis y situaciones irreales',
            ['تناقش نتائج افتراضية في الحاضر والماضي.', 'تعبّر عن الندم والاحتمال والرغبة غير المحققة.', 'تستخدم الجمل الشرطية المركبة دون خلط الأزمنة.', 'تكتب ثمانية أمثلة صحيحة لفرضيات حاضرة وماضية وتشرح الفرق بينها.'],
            [
                ['Hipótesis', 'إيپوتيسيس', 'فرضية'], ['Suposición', 'سوپوسيثيون', 'افتراض'], ['Arrepentimiento', 'أرِّيپينتيميِينتو', 'ندم'],
                ['Alternativa', 'ألترناتيبا', 'بديل'], ['Consecuencia', 'كونسيكوينثيا', 'نتيجة'], ['De haber sabido', 'دي أبيير سابيذو', 'لو كنت أعلم'],
                ['Ojalá', 'أوخالا', 'ليت / أتمنى'], ['Quizá', 'كيثا', 'ربما'], ['De lo contrario', 'دي لو كونتراريو', 'وإلا / بخلاف ذلك'],
                ['A condición de que', 'آ كونديثيون دي كي', 'بشرط أن'], ['En caso de que', 'إن كاسو دي كي', 'في حالة أن'], ['Renunciar', 'رينونثيار', 'يتنازل / يستقيل']
            ],
            [
                ['A', '¿Cambiarías de carrera si tuvieras la oportunidad?', 'هل كنت هتغيّر تخصصك لو جاتلك الفرصة؟'],
                ['B', 'Dependería de las opciones. Si encontrara un programa adecuado, lo consideraría.', 'ده هيتوقف على الاختيارات. لو لقيت برنامج مناسب، هفكر فيه.'],
                ['A', '¿Y te arrepientes de alguna decisión anterior?', 'وندمان على قرار سابق؟'],
                ['B', 'Sí. Si hubiera investigado mejor, habría elegido con más seguridad.', 'أيوه. لو كنت بحثت بشكل أفضل، كنت اخترت بثقة أكبر.'],
                ['A', 'Ojalá hubieras tenido esa información antes.', 'يا ريت كانت عندك المعلومات دي من بدري.'],
                ['B', 'Yo también. De haberlo sabido, habría pedido orientación.', 'وأنا كمان. لو كنت عرفت، كنت طلبت إرشاد.'],
                ['A', 'Aun así, todavía puedes tomar otra decisión.', 'ومع ذلك، لسه تقدر تاخد قرار تاني.'],
                ['B', 'Exactamente. Lo importante es aprender de la experiencia.', 'بالضبط. المهم نتعلم من التجربة.']
            ],
            [
                ['SI + IMPERFECTO DE SUBJUNTIVO', 'للافتراض غير الواقعي أو البعيد في الحاضر، يأتي بعد si ويتبعه condicional simple في النتيجة.', 'Si tuviera tiempo, viajaría más.'],
                ['SI + PLUSCUAMPERFECTO DE SUBJUNTIVO', 'لشرط ماضٍ لم يتحقق، ويأتي غالبًا بعده condicional compuesto للنتيجة الماضية الافتراضية.', 'Si hubiera estudiado, habría aprobado.'],
                ['OJALÁ + SUBJUNTIVO', 'للتمني؛ الماضي الناقص قد يعبّر عن أمنية حالية صعبة، والماضي التام عن أمنية تخص الماضي.', 'Ojalá tuviera más tiempo. Ojalá hubiera venido.'],
                ['DE HABER + PARTICIPIO', 'مصدر مركب يؤدي معنى شرط ماضٍ مختصر، ويقابله غالبًا si hubiera + participio.', 'De haberlo sabido, habría llamado.'],
                ['COMO SI + SUBJUNTIVO', 'نستخدمه للمقارنة مع موقف غير حقيقي؛ غالبًا imperfecto أو pluscuamperfecto de subjuntivo.', 'Habla como si lo supiera todo.']
            ],
            [
                ['أكمل: «Si tuviera dinero, ___ una casa».', ['compré', 'compraría', 'compraba ayer', 'he comprado'], 1],
                ['أكمل شرطًا ماضيًا: «Si hubiera salido antes, ___ a tiempo».', ['llegaría', 'llegaba', 'habría llegado', 'llegaré'], 2],
                ['«Arrepentimiento» تعني:', ['فرصة', 'ندم', 'فرضية', 'اتفاق'], 1],
                ['أي جملة تعبر عن أمنية حالية؟', ['Ojalá tengo tiempo', 'Ojalá tuviera tiempo', 'Ojalá tuve tiempo', 'Ojalá tendré tiempo'], 1],
                ['«De haberlo sabido» تعادل:', ['Si lo sé', 'Si lo supiera', 'Si lo hubiera sabido', 'Cuando lo sepa'], 2],
                ['أكمل: «Habla como si lo ___ todo».', ['sabe', 'supiera', 'sabrá', 'supo'], 1],
                ['أي تركيب يعبّر عن شرط ماضٍ لم يتحقق؟', ['Si estudio, aprobaré', 'Si estudiara, aprobaría', 'Si hubiera estudiado, habría aprobado', 'Cuando estudio, apruebo'], 2],
                ['«A condición de que» يتطلب عادةً:', ['Subjuntivo', 'Indefinido فقط', 'Gerundio فقط', 'مستقبلًا دائمًا'], 0]
            ]
        ),
        esLesson(
            'u22', 'B2', 'الخطاب الإعلامي وتحليل المعلومات', 'Medios, discurso e interpretación',
            ['تحلل طريقة صياغة الخبر ومصدره وانحيازه المحتمل.', 'تنقل تصريحات مطوّلة مع ضبط التحويل الزمني والضمائر.', 'تعبّر عن درجة اليقين والتحفظ في عرض المعلومات.', 'تكتب ملخصًا محايدًا من 150 كلمة وتنسب كل معلومة إلى مصدرها.'],
            [
                ['Cobertura', 'كوبيرتورا', 'تغطية إعلامية'], ['Testimonio', 'تيستيمونيو', 'شهادة / إفادة'], ['Portavoz', 'پورتابوث', 'متحدث رسمي'],
                ['Sesgo', 'سيسغو', 'انحياز'], ['Desmentir', 'ديسمينتير', 'ينفي خبرًا'], ['Declarar', 'ديكلارار', 'يصرّح'],
                ['Sostener', 'سوستينير', 'يؤكد / يتمسك برأي'], ['Afirmar', 'أفيرمار', 'يؤكد'], ['Negar', 'نيغار', 'ينكر'],
                ['Filtración', 'فيلتراثيون', 'تسريب'], ['Contexto', 'كونتيكستو', 'سياق'], ['Al parecer', 'أل پارثير', 'على ما يبدو']
            ],
            [
                ['A', '¿Qué te parece la cobertura de este acontecimiento?', 'إيه رأيك في التغطية الإعلامية للحدث ده؟'],
                ['B', 'Me parece incompleta; apenas recoge testimonios de una de las partes.', 'شايفها غير مكتملة؛ بالكاد بتنقل شهادات طرف واحد.'],
                ['A', 'El portavoz afirmó que publicarían un informe al día siguiente.', 'المتحدث الرسمي أكد إنهم هينشروا تقرير في اليوم التالي.'],
                ['B', 'Otros medios sostienen que el documento ya se había filtrado.', 'وسائل إعلام تانية بتقول إن الوثيقة كانت قد تسرّبت بالفعل.'],
                ['A', '¿Se ha confirmado esa información?', 'هل تم تأكيد المعلومة دي؟'],
                ['B', 'No. Al parecer, todavía se está investigando su origen.', 'لأ. على ما يبدو، لسه بيتم التحقيق في مصدرها.'],
                ['A', 'Entonces, conviene distinguir los hechos de las interpretaciones.', 'إذن، الأفضل نفرّق بين الوقائع والتفسيرات.'],
                ['B', 'Exacto, y también comprobar si existe algún sesgo en la selección de fuentes.', 'بالضبط، وكمان نتحقق إذا كان فيه انحياز في اختيار المصادر.']
            ],
            [
                ['ESTILO INDIRECTO: CAMBIOS TEMPORALES', 'عند نقل قول ماضٍ قد يتغير الزمن: presente إلى imperfecto، وpretérito perfecto إلى pluscuamperfecto، والمستقبل إلى condicional، بحسب مرجع الزمن.', '«Estoy aquí» → Dijo que estaba allí.'],
                ['DEÍCTICOS', 'قد تتغير كلمات الزمان والمكان والضمائر وفق منظور الناقل: hoy إلى ese día، وaquí إلى allí، وmañana إلى al día siguiente.', '«Mañana vuelvo» → Dijo que volvería al día siguiente.'],
                ['FUTURO PERFECTO DE PROBABILIDAD', 'قد يُستخدم للتخمين بشأن حدث ماضٍ اكتمل، لا للتعبير عن مستقبل فقط.', 'Habrá olvidado la reunión.'],
                ['AL PARECER / SEGÚN', 'تعبيرات تنسب المعلومة إلى مصدر أو تعرضها بتحفظ بدل تقديمها كحقيقة مؤكدة.', 'Según el informe, los datos han cambiado.'],
                ['HECHO, OPINIÓN Y SESGO', 'افصل بين معلومة قابلة للتحقق ورأي الكاتب وطريقة اختيار المصادر أو عرضها.', 'El artículo presenta una opinión, no un dato confirmado.']
            ],
            [
                ['«Sesgo» في تحليل الإعلام تعني:', ['توازن', 'انحياز', 'تغطية', 'شهادة'], 1],
                ['حوّل: «Estoy aquí» قال إنه:', ['estaba allí', 'estoy aquí', 'estará aquí mañana', 'estuve allí ayer'], 0],
                ['«El portavoz» هو:', ['المتحدث الرسمي', 'المتلقي', 'المحرر اللغوي', 'القارئ'], 0],
                ['أي عبارة تنسب المعلومة إلى مصدر؟', ['De repente', 'Según el informe', 'A pesar de todo', 'En primer lugar'], 1],
                ['«Habrá olvidado la reunión» قد تعبّر عن:', ['أمر', 'تخمين بشأن الماضي', 'عادة يومية', 'شرط مستحيل'], 1],
                ['«Filtración» تعني:', ['تسريب', 'تصحيح', 'مقابلة', 'استنتاج'], 0],
                ['في نقل «Mañana vuelvo» في الماضي، الأقرب هو:', ['Dijo que vuelve mañana', 'Dijo que volvería al día siguiente', 'Dijo que volvió ayer', 'Dijo volver mañana siempre'], 1],
                ['التمييز بين الوقائع والتفسيرات يساعد على:', ['زيادة الانحياز', 'إلغاء المصادر', 'تقييم الخبر بدقة', 'تجنب قراءة السياق'], 2]
            ]
        ),
        esLesson(
            'u23', 'B2', 'الثقافة والأدب ودقة التعبير', 'Cultura, literatura y matices',
            ['تصف عملًا فنيًا وتناقش عناصره وتأثيره.', 'تستخدم جمل الوصل المتقدمة لتحديد الأشخاص والأشياء.', 'تختار subjuntivo في الجمل الوصفية غير المحددة أو غير المحققة.', 'تكتب مراجعة نقدية من 180 كلمة تتناول الحبكة والشخصيات والدلالة.'],
            [
                ['Obra', 'أوبرا', 'عمل فني / أدبي'], ['Trama', 'تراما', 'حبكة'], ['Desenlace', 'ديسينلاثي', 'نهاية العمل'],
                ['Narrador', 'نارّاذور', 'راوي'], ['Personaje', 'پيرسوناخي', 'شخصية'], ['Metáfora', 'ميتافورا', 'استعارة'],
                ['Matiz', 'ماثيس', 'دلالة دقيقة / فارق'], ['Ironía', 'إيرونيا', 'سخرية / مفارقة'], ['Transmitir', 'ترانسميتير', 'ينقل / يوصل'],
                ['Evocar', 'إبوكار', 'يستحضر'], ['Patrimonio', 'پاتريمونيو', 'تراث'], ['Reseña', 'ريسينيا', 'مراجعة نقدية']
            ],
            [
                ['A', '¿Qué te pareció la novela que leíste?', 'إيه رأيك في الرواية اللي قريتها؟'],
                ['B', 'Me gustó la trama, sobre todo la manera en que el narrador presenta los recuerdos.', 'عجبتني الحبكة، خصوصًا الطريقة اللي الراوي بيعرض بيها الذكريات.'],
                ['A', '¿Hay algún personaje con el que te identifiques?', 'فيه شخصية بتحس إنها شبهك؟'],
                ['B', 'Sí, la protagonista, cuyas decisiones reflejan un conflicto bastante humano.', 'أيوه، البطلة، وقراراتها بتعكس صراع إنساني إلى حد كبير.'],
                ['A', 'Busco una obra que trate temas parecidos.', 'بدور على عمل بيتناول موضوعات مشابهة.'],
                ['B', 'Te recomiendo una novela cuya autora explora la memoria y la identidad.', 'أنصحك برواية مؤلفتها بتستكشف الذاكرة والهوية.'],
                ['A', '¿Crees que el final es irónico?', 'هل تعتقد إن النهاية فيها مفارقة ساخرة؟'],
                ['B', 'Sí, aunque admite varias interpretaciones y deja un matiz de incertidumbre.', 'أيوه، رغم إنها تقبل أكتر من تفسير وبتسيب إحساسًا بعدم اليقين.']
            ],
            [
                ['RELATIVOS CON PREPOSICIÓN', 'تأتي حروف الجر قبل el que / la que / los que / las que أو quien بحسب المرجع والسياق.', 'La persona con la que hablé es escritora.'],
                ['CUYO / CUYA / CUYOS / CUYAS', 'أداة ملكية نسبية تتفق مع الاسم المملوك بعدها في النوع والعدد، لا مع صاحب الشيء.', 'Una autora cuyas novelas son conocidas.'],
                ['INDICATIVO O SUBJUNTIVO EN RELATIVAS', 'نستخدم indicativo غالبًا مع مرجع معروف ومحدد؛ وsubjuntivo مع مرجع غير محدد أو غير موجود بعد البحث.', 'Conozco un libro que trata ese tema. Busco un libro que trate ese tema.'],
                ['QUIEN / EL CUAL', 'quien يُستخدم للأشخاص، وغالبًا بعد حرف جر؛ وel cual وأشكاله قد تساعد في تراكيب أكثر رسمية أو لتجنب اللبس.', 'La investigadora con quien hablé publicó el estudio.'],
                ['MATIZ E IRONÍA', 'قد تحمل العبارة معنى ضمنيًا يختلف عن معناها الحرفي؛ افهم السياق والنبرة قبل تفسيرها.', '¡Qué puntual!, dijo cuando llegó una hora tarde.']
            ],
            [
                ['«Trama» تعني:', ['الشخصية', 'الحبكة', 'النهاية', 'المراجعة'], 1],
                ['أكمل: «La autora ___ novelas leí ganó un premio».', ['cuyo', 'cuyas', 'cuyos', 'cuya'], 1],
                ['أكمل: «Busco un libro que ___ este tema».', ['trata', 'trató', 'trate', 'tratará siempre'], 2],
                ['أي تركيب صحيح؟', ['La persona con la que hablé', 'La persona que con hablé', 'La persona con quien la hablé a', 'La persona cual con hablé'], 0],
                ['«Desenlace» تعني:', ['بداية القصة', 'نهاية العمل', 'الراوي', 'الاستعارة'], 1],
                ['نستخدم عادةً «cuyo» للتعبير عن:', ['السبب', 'الملكية في جملة وصل', 'الزمن', 'المقارنة'], 1],
                ['أي جملة تتحدث عن كتاب معروف ومحدد؟', ['Busco un libro que trate el tema', 'Conozco un libro que trata el tema', 'Quiero algún libro que trate el tema', 'Necesito encontrar cualquier libro que trate el tema'], 1],
                ['«Matiz» تعني:', ['فارق دقيق في المعنى', 'عنوان الكتاب', 'شخصية ثانوية', 'نوع من الفصول'], 0]
            ]
        ),
        esLesson(
            'u24', 'B2', 'التفاوض والوساطة وحل الخلافات', 'Negociación y mediación',
            ['تدير نقاشًا وتعيد صياغة كلام الأطراف لتوضيح المقصود.', 'تقدم تنازلات واقتراحات للوصول إلى اتفاق.', 'تستخدم تراكيب الغاية والشرط والاستثناء مع subjuntivo.', 'تكتب محضر اتفاق مختصرًا يحدد المسؤوليات والمهلة وشروط التنفيذ.'],
            [
                ['Negociación', 'نيغوثياثيون', 'تفاوض'], ['Acuerdo', 'أكويردو', 'اتفاق'], ['Desacuerdo', 'ديساكويردو', 'اختلاف'],
                ['Concesión', 'كونثيسيون', 'تنازل'], ['Mediador', 'ميذياذور', 'وسيط'], ['Malentendido', 'مالينتينذيذو', 'سوء فهم'],
                ['Aclarar', 'أكلارار', 'يوضّح'], ['Reformular', 'ريفورمولار', 'يعيد الصياغة'], ['Ceder', 'ثيذير', 'يتنازل'],
                ['Plantear', 'پلانتيار', 'يطرح'], ['Viable', 'بيابلي', 'قابل للتنفيذ'], ['Consenso', 'كونسينسو', 'توافق']
            ],
            [
                ['A', 'Parece que tenemos dos propuestas diferentes.', 'يبدو إن عندنا اقتراحين مختلفين.'],
                ['B', 'Así es. Mi prioridad es que el plazo sea realista.', 'صحيح. أولويتي إن المهلة تكون واقعية.'],
                ['A', 'Si te parece bien, podríamos ampliar el plazo una semana.', 'لو مناسب ليك، ممكن نمد المهلة أسبوع.'],
                ['B', 'Estoy dispuesto a aceptarlo, siempre que se definan las responsabilidades.', 'مستعد أوافق، بشرط إن المسؤوليات تتحدد.'],
                ['A', 'De acuerdo. Reformulo la propuesta para evitar malentendidos.', 'اتفقنا. هعيد صياغة الاقتراح لتجنب سوء الفهم.'],
                ['B', 'Gracias. También sugiero que revisemos los avances cada dos días.', 'شكرًا. وأقترح كمان إننا نراجع التقدم كل يومين.'],
                ['A', 'Lo haremos para que todos puedan seguir el proceso.', 'هنعمل كده عشان الكل يقدر يتابع سير العمل.'],
                ['B', 'Perfecto. Creo que hemos llegado a un consenso viable.', 'ممتاز. أعتقد إننا وصلنا لتوافق قابل للتنفيذ.']
            ],
            [
                ['PARA QUE + SUBJUNTIVO', 'تُستخدم للتعبير عن الغاية عندما يختلف فاعل الجملة التابعة أو يُذكر فعل موجّه لشخص آخر.', 'Te lo explico para que lo entiendas.'],
                ['SIEMPRE QUE + SUBJUNTIVO', 'تعني بشرط أن عندما تقدم شرطًا مطلوبًا للموافقة أو استمرار الأمر.', 'Aceptaré siempre que haya un acuerdo.'],
                ['A MENOS QUE + SUBJUNTIVO', 'تعني إلا إذا، وتقدم استثناءً متوقعًا أو شرطًا مانعًا.', 'Seguiremos, a menos que surja un problema.'],
                ['POR MUCHO QUE + SUBJUNTIVO', 'تعبر عن التنازل: مهما يكن أو مهما حاول؛ لا تلغي ذلك نتيجة الجملة الرئيسية.', 'Por mucho que discutamos, necesitamos una solución.'],
                ['MITIGAR Y REFORMULAR', 'خفف حدة الاعتراض بعبارات مثل quizá podríamos، وsi te parece، ثم أعد صياغة الفكرة للتأكد من الفهم.', 'Quizá podríamos revisar esa parte. ¿Te refieres a...?']
            ],
            [
                ['أكمل: «Te lo explico para que lo ___».', ['entiendes', 'entendiste', 'entiendas', 'entenderás'], 2],
                ['«Siempre que» بمعنى «بشرط أن» يأتي عادةً معه:', ['Subjuntivo', 'Indefinido فقط', 'Infinitivo دائمًا', 'Futuro perfecto فقط'], 0],
                ['«A menos que» تعني:', ['بمجرد أن', 'إلا إذا', 'بسبب أن', 'على الرغم من'], 1],
                ['أي عبارة تخفف حدة الاقتراح؟', ['Hazlo ya', 'No tienes razón', 'Quizá podríamos revisarlo', 'Eso es absurdo'], 2],
                ['«Consenso» تعني:', ['خلاف', 'توافق', 'تأخير', 'شرط'], 1],
                ['أكمل: «Aceptaré, siempre que ___ un acuerdo».', ['hay', 'habrá', 'haya', 'hubo'], 2],
                ['ما الهدف من reformular una idea؟', ['زيادة سوء الفهم', 'إعادة صياغتها لتوضيح المقصود', 'رفض كل المقترحات', 'إنهاء النقاش فورًا'], 1],
                ['«Por mucho que discutamos...» تعبر عن:', ['تنازل / concession', 'سبب مباشر', 'زمن ماضٍ', 'أمر رسمي'], 0]
            ]
        ),

        esLesson(
            'u25', 'C1', 'الحجاج الأكاديمي وبناء الرأي', 'Argumentación académica y pensamiento crítico',
            ['تصوغ أطروحة واضحة وتدعمها بأدلة مناسبة.', 'تعرض رأيًا مخالفًا وترد عليه من غير مبالغة.', 'تستخدم روابط الاستدراك والاستنتاج والتحفظ بدقة.', 'تكتب فقرة حجاجية تميز بين الحقيقة والرأي.'],
            [
                ['Tesis', 'تيسيس', 'أطروحة / فكرة رئيسية'], ['Premisa', 'بريميسا', 'مقدمة منطقية'], ['Planteamiento', 'بلانتيامينتو', 'طرح المشكلة'],
                ['Contraargumento', 'كونتراأرغومينتو', 'حجة مضادة'], ['Refutar', 'ريفوتار', 'يدحض حجة'], ['Matizar', 'ماثيسار', 'يضيف قيدًا أو تفصيلًا'],
                ['Sustentar', 'سوستينتار', 'يسند / يدعم'], ['Evidencia', 'إبيدينثيا', 'دليل'], ['Coherencia', 'كوأيرينثيا', 'ترابط منطقي'],
                ['Alcance', 'ألكانثي', 'نطاق / مدى'], ['Sesgo', 'سيسغو', 'انحياز'], ['Conclusión', 'كونكلوسيون', 'استنتاج']
            ],
            [
                ['A', '¿Cuál es la tesis principal de tu ensayo?', 'إيه الفكرة الأساسية اللي بتدافع عنها في مقالك؟'],
                ['B', 'Sostengo que la educación digital amplía el acceso, aunque no garantiza por sí sola una enseñanza de calidad.', 'أنا شايف إن التعليم الرقمي بيوسّع فرص الوصول، لكنه لوحده مش بيضمن تعليم بجودة عالية.'],
                ['A', '¿Qué evidencia respalda esa afirmación?', 'إيه الأدلة اللي بتدعم الكلام ده؟'],
                ['B', 'Comparo varios estudios y matizo la conclusión según el contexto de cada muestra.', 'بقارن بين دراسات مختلفة وبحدد الاستنتاج حسب ظروف كل عينة.'],
                ['A', 'Algunos autores sostienen lo contrario.', 'بعض الباحثين بيطرحوا رأيًا عكس ده.'],
                ['B', 'Es una objeción válida; sin embargo, no invalida todos los resultados.', 'ده اعتراض وجيه، لكنه مش بيلغي كل النتائج.'],
                ['A', 'Entonces, ¿cómo cerrarías el argumento?', 'إذن هتنهي الحجة إزاي؟'],
                ['B', 'Concluiría que la tecnología ayuda cuando forma parte de un proyecto pedagógico coherente.', 'هستنتج إن التكنولوجيا بتفيد لما تكون جزءًا من مشروع تعليمي مترابط.']
            ],
            [
                ['AUNQUE + INDICATIVO / SUBJUNTIVO', 'نستخدم indicativo لما المعلومة معروفة أو بنعرضها كحقيقة، وsubjuntivo لما تكون افتراضية أو غير محسومة.', 'Aunque el método funciona, tiene límites. / Aunque funcione, hay que evaluarlo.'],
                ['NO SE TRATA DE QUE + SUBJUNTIVO', 'تُستخدم لتصحيح فهم الفكرة: المسألة مش إن كذا، لكن إن كذا.', 'No se trata de que sea fácil, sino de que sea útil.'],
                ['CONCESIÓN Y CONTRASTE', 'روابط زي si bien وaun cuando وno obstante بتسمح بعرض اعتراض ثم توضيح موقفك.', 'Si bien el resultado es relevante, no es definitivo.'],
                ['HEDGING ACADÉMICO', 'خفف درجة الجزم باستخدام parece indicar أو podría sugerir بدل أحكام مطلقة.', 'Los datos parecen indicar una tendencia.'],
                ['ORDEN ARGUMENTATIVO', 'رتّب الفقرة: أطروحة، دليل، تفسير للدليل، اعتراض محتمل، ثم نتيجة مرتبطة بالسؤال.', 'La evidencia respalda esta interpretación; por tanto, conviene revisarla.']
            ],
            [
                ['«Refutar» تعني:', ['يدعم', 'يدحض', 'يلخص', 'يؤجل'], 1],
                ['أكمل: «Aunque ___ útil, el método tiene límites».', ['sea', 'es', 'será', 'fue siempre'], 1],
                ['أي عبارة أكثر تحفظًا في الكتابة الأكاديمية؟', ['Esto demuestra todo', 'Es imposible equivocarse', 'Los datos parecen indicar una tendencia', 'Nadie puede discutirlo'], 2],
                ['«Contraargumento» هو:', ['حجة مضادة', 'نتيجة نهائية', 'عنوان البحث', 'عينة الدراسة'], 0],
                ['«No se trata de que sea fácil» معناها الأقرب:', ['الموضوع إنه سهل', 'المسألة مش إنه سهل', 'لازم يكون سهلًا', 'كان سهلًا بالفعل'], 1],
                ['ما الترتيب الأقوى لفقرة حجاجية؟', ['نتيجة بلا دليل', 'رأي ثم دليل وتفسير', 'أمثلة غير مرتبطة', 'اعتراض ثم تغيير الموضوع'], 1],
                ['أي رابط يقدم استدراكًا؟', ['Por lo tanto', 'No obstante', 'En primer lugar', 'A causa de'], 1],
                ['«Matizar una afirmación» يعني:', ['تعميمها', 'إضافة قيد أو تفصيل لها', 'حذف الدليل', 'ترجمتها حرفيًا'], 1]
            ]
        ),
        esLesson(
            'u26', 'C1', 'البحث العلمي ومنهجية الدراسات', 'Investigación y metodología',
            ['تشرح تصميم دراسة وعينتها ومتغيراتها.', 'تفرق بين الارتباط والسببية.', 'تقيّم موثوقية النتائج وحدودها.', 'تلخص بحثًا مع نسب المعلومات لمصدرها.'],
            [
                ['Hipótesis', 'إيبوتيسيس', 'فرضية'], ['Muestra', 'مويسترا', 'عينة'], ['Muestreo', 'مويستريو', 'اختيار العينة'],
                ['Variable', 'باريابلي', 'متغير'], ['Hallazgo', 'أيازغو', 'نتيجة مكتشفة'], ['Fiabilidad', 'فيابيليذاذ', 'موثوقية'],
                ['Validez', 'باليذيث', 'صدق / صلاحية القياس'], ['Correlación', 'كورّلاثيون', 'ارتباط'], ['Causalidad', 'كاوساليذاذ', 'علاقة سببية'],
                ['Metodología', 'ميتوذولوخيا', 'منهجية'], ['Replicar', 'ريپليكار', 'يعيد إجراء تجربة'], ['Limitación', 'ليميتاثيون', 'قيد / محدودية']
            ],
            [
                ['A', '¿Cómo se diseñó la investigación?', 'إزاي اتصممت الدراسة؟'],
                ['B', 'Se realizó un estudio longitudinal con una muestra de trescientas personas.', 'اتعملت دراسة طولية على عينة مكوّنة من 300 شخص.'],
                ['A', '¿Se confirmó la hipótesis inicial?', 'هل الفرضية الأساسية اتأكدت؟'],
                ['B', 'Los resultados la respaldan parcialmente, pero hay limitaciones en el muestreo.', 'النتائج بتدعمها جزئيًا، لكن فيه قيود في اختيار العينة.'],
                ['A', '¿Podemos afirmar que existe causalidad?', 'نقدر نقول إن فيه علاقة سببية؟'],
                ['B', 'No necesariamente. La correlación observada no demuestra una relación causal.', 'مش بالضرورة. الارتباط اللي ظهر مش بيثبت وجود علاقة سببية.'],
                ['A', '¿Qué haría falta para reforzar el estudio?', 'إيه اللي نحتاجه عشان نقوّي الدراسة؟'],
                ['B', 'Habría que replicarla con otra muestra y comprobar la fiabilidad de las medidas.', 'لازم نعيدها بعينة تانية ونتأكد من موثوقية أدوات القياس.']
            ],
            [
                ['SE PASIVA REFLEJA', 'تُستخدم se مع الفعل لما يكون التركيز على الإجراء أو النتيجة، والاسم هو اللي بيتحكم في المفرد والجمع.', 'Se analizaron los resultados.'],
                ['CONDICIONAL DE CAUTELA', 'قد نستخدم condicional لتقديم استنتاج بحذر بدل الجزم بما لا تثبته البيانات.', 'Esto podría deberse a otros factores.'],
                ['CORRELACIÓN NO ES CAUSALIDAD', 'وجود تغيرين معًا لا يثبت إن واحدًا سبّب التاني؛ لازم تصميم يسمح باختبار السبب.', 'Existe correlación, pero no se ha demostrado causalidad.'],
                ['POR / DEBIDO A / COMO CONSECUENCIA', 'فرّق بين السبب والنتيجة، واذكر فقط ما تسمح به البيانات فعلًا.', 'La muestra se amplió debido a la baja participación.'],
                ['DESCRIBIR MÉTODOS', 'استخدم تراكيب دقيقة لتوضيح العينة والأداة والإجراء من غير إخفاء حدود الدراسة.', 'Los datos se recogieron mediante entrevistas semiestructuradas.']
            ],
            [
                ['«Hipótesis» تعني:', ['عينة', 'فرضية', 'نتيجة', 'أداة'], 1],
                ['الارتباط بين متغيرين يثبت دائمًا:', ['السببية', 'عدم وجود علاقة', 'لا شيء من ذلك وحده', 'صحة كل فرضية'], 2],
                ['أكمل: «Se ___ los resultados».', ['analizó', 'analizaron', 'analiza a', 'analizando'], 1],
                ['«Fiabilidad» تشير إلى:', ['الموثوقية', 'السرعة', 'حجم العينة فقط', 'عنوان الدراسة'], 0],
                ['أي جملة أكثر حذرًا علميًا؟', ['Esto demuestra sin duda la causa', 'El resultado podría explicarse por otros factores', 'Todos los casos son iguales', 'La hipótesis es verdad siempre'], 1],
                ['«Replicar un estudio» يعني:', ['إلغاء الدراسة', 'إعادة إجراء الدراسة للتحقق من النتائج', 'ترجمة العنوان', 'تغيير سؤال البحث فقط'], 1],
                ['«Muestreo» يتعلق بـ:', ['اختيار العينة', 'كتابة الخاتمة', 'نشر الإعلان', 'ترجمة النتائج'], 0],
                ['الفرق الأقرب بين validez وfiabilidad هو:', ['لا فرق بينهما', 'الصدق يقيس ما يفترض قياسه والموثوقية اتساق القياس', 'كلاهما يعني حجم العينة', 'الأولى تخص الحوار فقط'], 1]
            ]
        ),
        esLesson(
            'u27', 'C1', 'التداولية والسياق ومستويات اللباقة', 'Pragmática, contexto y cortesía',
            ['تفهم المعنى الضمني وراء الكلام.', 'تختار مستوى الرسمية حسب الشخص والموقف.', 'تستخدم التلطيف والطلب غير المباشر من غير غموض.', 'تتعرف على السخرية والافتراضات المسبقة.'],
            [
                ['Registro', 'ريخيسترو', 'مستوى اللغة / السجل'], ['Cortesía', 'كورتيسيا', 'لباقة'], ['Atenuador', 'أتينوادور', 'تعبير مخفف'],
                ['Implícito', 'إمبليثيتو', 'ضمني'], ['Presuposición', 'بريسوبوسيثيون', 'افتراض مسبق'], ['Connotación', 'كونّوتاثيون', 'دلالة إيحائية'],
                ['Eufemismo', 'إوفيميسمو', 'تعبير ملطف'], ['Ambigüedad', 'أمبيغويذاذ', 'غموض'], ['Turno de palabra', 'تورنو دي پالابرا', 'دور الكلام'],
                ['Ironía', 'إيرونيا', 'سخرية / مفارقة'], ['Desacuerdo', 'ديساكويردو', 'اختلاف في الرأي'], ['Contexto', 'كونتيكستو', 'سياق']
            ],
            [
                ['A', '¿Podrías revisar el informe cuando tengas un momento?', 'ممكن تراجع التقرير لما يبقى عندك وقت؟'],
                ['B', 'Por supuesto. ¿Lo necesitas para hoy?', 'طبعًا. محتاجه النهارده؟'],
                ['A', 'Preferiría tenerlo antes de las cinco, si fuera posible.', 'أفضل يكون عندي قبل الساعة خمسة، لو ده ممكن.'],
                ['B', 'Haré lo posible, aunque no puedo garantizarlo.', 'هحاول على قد ما أقدر، مع إني مقدرش أضمن ده.'],
                ['A', 'No es que quiera presionarte; necesito organizar la entrega.', 'مش قصدي أضغط عليك؛ أنا محتاج أنظم التسليم.'],
                ['B', 'De acuerdo. Te avisaré en cuanto tenga una respuesta.', 'اتفقنا. هبلغك أول ما يبقى عندي رد.'],
                ['A', 'Te lo agradezco. Cualquier inconveniente, dímelo con confianza.', 'متشكر ليك. لو فيه أي مشكلة، قولي بصراحة.'],
                ['B', 'Así lo haré. Gracias por tenerlo en cuenta.', 'هعمل كده. شكرًا إنك واخد ده في اعتبارك.']
            ],
            [
                ['USTED / TÚ Y REGISTRO', 'اختيار tú أو usted بيعتمد على العلاقة والعرف والموقف، وممكن يتغير خلال الحوار.', '¿Podría ayudarme, por favor?'],
                ['PODER EN CONDICIONAL', 'استخدام podría أو querría بيخلي الطلب ألطف من الأمر المباشر.', '¿Podrías enviármelo hoy?'],
                ['NO ES QUE + SUBJUNTIVO', 'تُستخدم لتوضيح إن تفسيرًا معينًا مش هو المقصود.', 'No es que no quiera ayudarte.'],
                ['POR SI ACASO', 'تعبير احتياطي بمعنى للاحتياط أو تحسبًا لاحتمال معين.', 'Guarda una copia por si acaso.'],
                ['IMPLÍCITO Y PRESUPOSICIÓN', 'المعنى الضمني بيتفهم من السياق، أما الافتراض المسبق فالجملة بتتعامل معاه كأنه معروف.', '¿Has dejado de trabajar aquí? presupone que antes trabajabas aquí.']
            ],
            [
                ['«Atenuador» هو:', ['تعبير يخفف حدة الكلام', 'دليل علمي', 'زمن نحوي', 'نوع من الأفعال'], 0],
                ['أي طلب أكثر لباقة؟', ['Envíamelo ya', '¿Podrías enviármelo cuando puedas?', 'Tienes que hacerlo ahora', 'No discutas'], 1],
                ['«Por si acaso» تعني:', ['بلا سبب', 'للاحتياط', 'في نفس اللحظة', 'على العكس'], 1],
                ['أكمل: «No es que no ___ ayudarte».', ['quiero', 'quiera', 'quería siempre', 'querré'], 1],
                ['الافتراض المسبق في «¿Has dejado de fumar?» هو:', ['الشخص لم يدخن قط', 'الشخص كان يدخن من قبل', 'الشخص سيبدأ التدخين', 'لا يوجد أي افتراض'], 1],
                ['اختيار tú أو usted يرتبط أساسًا بـ:', ['السياق والعلاقة ومستوى الرسمية', 'عدد حروف الاسم', 'زمن الفعل فقط', 'نوع الجملة المكتوبة فقط'], 0],
                ['«Connotación» تشير إلى:', ['المعنى الحرفي وحده', 'الدلالة الإيحائية المصاحبة للكلمة', 'ترتيب الجملة', 'نهاية الفعل'], 1],
                ['فهم السخرية يعتمد غالبًا على:', ['الكلمات وحدها دائمًا', 'السياق والنبرة والمعرفة المشتركة', 'علامة التعجب فقط', 'ترجمة كل كلمة منفردة'], 1]
            ]
        ),

        esLesson(
            'u28', 'C1', 'الخطابة والتأثير في الجمهور', 'Oratoria y comunicación persuasiva',
            ['تنظم خطابًا مناسبًا لجمهور محدد.', 'تستخدم وسائل بلاغية من غير افتعال.', 'توظف الوقفات والتأكيد والانتقال بين الأفكار.', 'تختتم بدعوة واضحة أو نتيجة مقنعة.'],
            [
                ['Discurso', 'ديسكورسّو', 'خطاب'], ['Audiencia', 'أوديِنثيا', 'جمهور'], ['Recurso retórico', 'ريكورسو ريتوريكو', 'أسلوب بلاغي'],
                ['Anáfora', 'أناڤورا', 'تكرار بداية العبارة'], ['Metáfora', 'ميتافورا', 'استعارة'], ['Énfasis', 'إنفاسيس', 'تأكيد'],
                ['Pausa', 'باوسا', 'وقفة'], ['Concesión', 'كونثيسيون', 'إقرار بجزء من رأي مخالف'], ['Elocuencia', 'إيلوكوينثيا', 'فصاحة'],
                ['Convincente', 'كونبينثينتي', 'مقنع'], ['Llamada a la acción', 'ياماذا ألا أكثيون', 'دعوة لاتخاذ إجراء'], ['Mensaje clave', 'مينساخي كلابي', 'رسالة أساسية']
            ],
            [
                ['A', '¿Cómo adaptarías el discurso a un público que no conoce el tema?', 'إزاي هتظبط الخطاب لجمهور مش عارف الموضوع؟'],
                ['B', 'Empezaría con un ejemplo cotidiano y presentaría la idea principal sin tecnicismos.', 'هبدأ بمثال من الحياة اليومية، وأعرض الفكرة الأساسية من غير مصطلحات معقدة.'],
                ['A', '¿Y cómo responderías a quienes discrepan?', 'وهترد إزاي على الناس اللي مختلفين معاك؟'],
                ['B', 'Reconocería primero una parte válida de su preocupación y después explicaría mi propuesta.', 'هعترف الأول بالجزء الوجيه من قلقهم، وبعدها أوضح اقتراحي.'],
                ['A', '¿Qué papel tiene la pausa?', 'الوقفة ليها دور إيه؟'],
                ['B', 'Permite destacar el mensaje clave y dar tiempo al público para asimilarlo.', 'بتساعد على إبراز الرسالة الأساسية وبتدي الجمهور وقت يستوعبها.'],
                ['A', '¿Cómo terminarías?', 'هتنهي إزاي؟'],
                ['B', 'Con una llamada concreta a la acción, vinculada con los argumentos anteriores.', 'بدعوة واضحة لاتخاذ خطوة، وتكون مرتبطة بالحجج اللي اتقالت.']
            ],
            [
                ['ANÁFORA', 'تكرار كلمة أو تركيب في بداية جمل متتابعة بهدف التأكيد والإيقاع.', 'Queremos oportunidades, queremos soluciones, queremos resultados.'],
                ['CONCESIÓN RETÓRICA', 'اعترف بنقطة صحيحة عند الطرف الآخر قبل توضيح حدودها أو تقديم موقفك.', 'Es cierto que cuesta, pero el beneficio a largo plazo es mayor.'],
                ['ESTRUCTURA DEL DISCURSO', 'ابدأ بجذب الانتباه، ثم حدد الفكرة، واعرض الحجج، ورد على الاعتراضات، واختم برسالة أو طلب.', 'Primero el problema; después la propuesta; finalmente, la acción.'],
                ['PAUSAS Y ÉNFASIS', 'الوقفة بعد فكرة مهمة بتديها وزنًا؛ والتأكيد الصوتي يكون على الكلمات المفتاحية مش كل الجملة.', 'Lo importante no es prometer, sino cumplir.'],
                ['ADAPTAR EL REGISTRO', 'اختار المصطلحات والأمثلة وطول الجمل حسب معرفة الجمهور وهدف الخطاب.', 'Para un público general, conviene explicar los términos técnicos.']
            ],
            [
                ['«Audiencia» في الخطابة تعني:', ['الجمهور', 'المقدمة', 'الاستعارة', 'الخاتمة'], 0],
                ['«Anáfora» هي:', ['تكرار في بداية عبارات متتابعة', 'حذف الفعل', 'سؤال بلا إجابة', 'ترجمة حرفية'], 0],
                ['ما فائدة concession retórica؟', ['تجاهل كل اعتراض', 'الاعتراف بنقطة وجيهة قبل الرد', 'تغيير الموضوع', 'إطالة الخطاب بلا هدف'], 1],
                ['أفضل ختام لخطاب إقناعي غالبًا يتضمن:', ['معلومة غير مرتبطة', 'دعوة واضحة لاتخاذ إجراء', 'اعتذارًا عن الموضوع', 'تكرار المقدمة فقط'], 1],
                ['الوقفة الصوتية المناسبة تساعد على:', ['إخفاء الفكرة', 'إبراز الرسالة وإتاحة وقت للفهم', 'تسريع كل الكلمات', 'إلغاء التواصل البصري'], 1],
                ['«Recurso retórico» يعني:', ['أداة أو أسلوب بلاغي', 'ميزانية المشروع', 'نتيجة تجربة', 'مستوى رسمي'], 0],
                ['عند مخاطبة جمهور غير متخصص، الأفضل:', ['استخدام أكبر عدد من المصطلحات', 'شرح المصطلحات بمثال واضح', 'افتراض معرفته بكل شيء', 'تجنب الأمثلة'], 1],
                ['أي صياغة تستخدم anáfora؟', ['Llegó tarde y se fue', 'Queremos respeto, queremos diálogo, queremos soluciones', 'Aunque llueva, saldré', 'No sé dónde está'], 1]
            ]
        ),
        esLesson(
            'u29', 'C1', 'التواصل المهني وإدارة المشروعات', 'Comunicación profesional y gestión de proyectos',
            ['تشارك في اجتماع رسمي وتعرض تقدم العمل.', 'تناقش الميزانية والمهل والمخاطر.', 'توزع المسؤوليات وتطلب توضيح الالتزامات.', 'تكتب تحديثًا مهنيًا واضحًا ومختصرًا.'],
            [
                ['Plazo', 'بلاثو', 'مهلة زمنية'], ['Presupuesto', 'بريسوبويستو', 'ميزانية'], ['Licitación', 'ليثيتاثيون', 'مناقصة'],
                ['Proveedor', 'بروبِيذور', 'مورد'], ['Viabilidad', 'بيابيليذاذ', 'قابلية التنفيذ'], ['Rentabilidad', 'رينتابيليذاذ', 'ربحية'],
                ['Delegar', 'ذيليغار', 'يفوض'], ['Supervisar', 'سوپيربيسار', 'يشرف'], ['Rendir cuentas', 'رينذير كوينتاس', 'يقدم كشف حساب'],
                ['Incumplimiento', 'إنكومپليمينتو', 'عدم الالتزام'], ['Prórroga', 'پروروغا', 'تمديد مهلة'], ['Responsable', 'ريسپونسابلي', 'مسؤول']
            ],
            [
                ['A', '¿Podemos revisar el estado del proyecto?', 'ممكن نراجع حالة المشروع؟'],
                ['B', 'Hemos cumplido los objetivos iniciales, pero el presupuesto necesita una actualización.', 'حققنا الأهداف الأولية، لكن الميزانية محتاجة تحديث.'],
                ['A', '¿Qué tareas siguen pendientes?', 'إيه المهام اللي لسه متبقية؟'],
                ['B', 'La validación técnica y la entrega del proveedor.', 'المراجعة الفنية وتسليم المورد.'],
                ['A', '¿Quién supervisará esas tareas?', 'مين هيشرف على المهام دي؟'],
                ['B', 'Laura coordinará la validación y yo rendiré cuentas sobre los plazos.', 'لاورا هتنسق المراجعة، وأنا هتابع الالتزام بالمواعيد.'],
                ['A', '¿Necesitamos solicitar una prórroga?', 'محتاجين نطلب تمديد للمهلة؟'],
                ['B', 'Solo si el proveedor confirma el retraso por escrito.', 'بس لو المورد أكد التأخير كتابةً.']
            ],
            [
                ['FUTURO Y COMPROMISOS', 'في الاجتماعات، استخدم المستقبل لتحديد المسؤولية والخطوة القادمة، مع ذكر صاحب المهمة والموعد.', 'El equipo entregará el informe el viernes.'],
                ['CONDICIONAL PARA PROPUESTAS', 'condicional مناسب لاقتراح بديل مهني من غير فرضه.', 'Podríamos dividir la tarea en dos fases.'],
                ['DEBER / TENER QUE / DEBER DE', 'deber وtener que قد يعبران عن الالتزام، أما deber de فيشير غالبًا إلى الاحتمال.', 'Debemos revisar el contrato. / Debe de estar ocupado.'],
                ['A FALTA DE / A MENOS QUE', 'الأولى بمعنى في غياب شيء أو لعدم توفره، والثانية بمعنى إلا إذا.', 'A falta de datos, no cerraremos el informe.'],
                ['ACTAS Y SEGUIMIENTO', 'محضر الاجتماع يسجل القرارات والمسؤوليات والمواعيد، ويفصل القرار عن النقاش غير المحسوم.', 'Se acuerda revisar el presupuesto antes del lunes.']
            ],
            [
                ['«Prórroga» تعني:', ['تمديد مهلة', 'ميزانية', 'مورد', 'ربحية'], 0],
                ['«Rendir cuentas» تعني:', ['تقديم توضيح عن المسؤولية والنتائج', 'إلغاء الاجتماع', 'تغيير المورد', 'تأجيل كل المهام'], 0],
                ['أي جملة تقدم اقتراحًا مهنيًا؟', ['Hazlo sin preguntar', 'Podríamos dividir la tarea en dos fases', 'No hay nada que hablar', 'Entrega todo ahora'], 1],
                ['في «Debe de estar ocupado»، المعنى الأقرب:', ['ملزم أن يكون مشغولًا', 'من المحتمل أنه مشغول', 'كان مشغولًا أمس', 'سوف ينهي العمل'], 1],
                ['«Incumplimiento» يعني:', ['التزام', 'عدم الالتزام', 'نجاح المشروع', 'تمديد'], 1],
                ['ما الذي يجب أن يتضمنه محضر الاجتماع؟', ['النكات فقط', 'القرارات والمسؤوليات والمواعيد', 'كل الآراء بلا تنظيم', 'عنوان الشركة فقط'], 1],
                ['«Viabilidad» تتعلق بـ:', ['قابلية تنفيذ المشروع', 'عدد الموظفين فقط', 'لون التقرير', 'موعد الإجازة'], 0],
                ['أكمل: «El equipo ___ el informe mañana».', ['entregaría ayer', 'entregará', 'entregando', 'entregó mañana'], 1]
            ]
        ),
        esLesson(
            'u30', 'C1', 'القضايا الاجتماعية والسياسات العامة', 'Debate social y políticas públicas',
            ['تناقش قضية عامة وتحدد أطرافها وأسبابها.', 'تشرح أثر السياسات على فئات مختلفة.', 'تعرض موقفًا متوازنًا مع الاعتراف بالتعقيد.', 'تقدم توصية مدعومة بأسباب ونتائج متوقعة.'],
            [
                ['Desigualdad', 'ديسيغوالذاذ', 'عدم مساواة'], ['Sostenibilidad', 'سوستينبيليذاذ', 'استدامة'], ['Brecha', 'بريتشا', 'فجوة'],
                ['Colectivo', 'كوليكتِيبو', 'فئة / مجموعة'], ['Vulnerabilidad', 'بولنيرابيليذاذ', 'هشاشة / قابلية للتضرر'], ['Intervención', 'إنتيربينثيون', 'تدخل'],
                ['Repercusión', 'ريپيركوسيون', 'أثر / تداعيات'], ['Concienciar', 'كونثينثيار', 'يرفع الوعي'], ['Regulación', 'ريغولاثيون', 'تنظيم / لائحة'],
                ['Transición', 'ترانسيثيون', 'تحول / انتقال'], ['Resiliencia', 'ريسيليينثيا', 'قدرة على الصمود'], ['Consenso', 'كونسينسو', 'توافق']
            ],
            [
                ['A', '¿Qué medidas reducirían la brecha educativa?', 'إيه الإجراءات اللي ممكن تقلل الفجوة التعليمية؟'],
                ['B', 'Habría que mejorar el acceso a recursos y evaluar las necesidades de cada colectivo.', 'لازم نحسن الوصول للموارد ونقيّم احتياجات كل فئة.'],
                ['A', '¿Bastaría con aumentar la financiación?', 'هل زيادة التمويل وحدها كفاية؟'],
                ['B', 'No necesariamente. También importa cómo se distribuye y qué resultados se evalúan.', 'مش بالضرورة. المهم كمان إزاي بيتوزع التمويل وإيه النتائج اللي بنقيّمها.'],
                ['A', 'Algunas medidas podrían generar efectos no previstos.', 'بعض الإجراءات ممكن ينتج عنها آثار غير متوقعة.'],
                ['B', 'Es cierto; por eso conviene consultar a los grupos afectados antes de aplicarlas.', 'صحيح؛ وعشان كده الأفضل نستشير الفئات المتأثرة قبل تطبيقها.'],
                ['A', '¿Cómo mediríamos el éxito?', 'هنقيس النجاح إزاي؟'],
                ['B', 'Con indicadores transparentes y una evaluación a medio y largo plazo.', 'بمؤشرات واضحة وتقييم على المدى المتوسط والطويل.']
            ],
            [
                ['HABRÍA QUE / CONVENDRÍA', 'تراكيب لاقتراح إجراء أو توصية بصورة غير مباشرة ومهنية.', 'Habría que consultar a la población.'],
                ['NO SOLO..., SINO TAMBIÉN...', 'تضيف عنصرًا ثانيًا مهمًا بدل اختزال المشكلة في سبب واحد.', 'No solo importa el coste, sino también el impacto social.'],
                ['DE AHÍ QUE + SUBJUNTIVO', 'تقدم نتيجة أو توصية ناتجة عما سبق، وغالبًا يأتي بعدها subjuntivo.', 'La brecha persiste; de ahí que se necesiten nuevas medidas.'],
                ['POR MUY + ADJETIVO + QUE', 'تعبير تنازلي بمعنى مهما كان الشيء، ويأتي غالبًا مع subjuntivo.', 'Por muy útil que sea, la medida tiene límites.'],
                ['EVALUAR POLÍTICAS', 'فرّق بين الهدف المعلن والنتائج الفعلية، واذكر مؤشرات القياس والفئات التي استفادت أو تضررت.', 'La evaluación debe medir el impacto en distintos colectivos.']
            ],
            [
                ['«Desigualdad» تعني:', ['مساواة', 'عدم مساواة', 'استدامة', 'توافق'], 1],
                ['أكمل: «De ahí que se ___ nuevas medidas».', ['necesitan', 'necesiten', 'necesitaron siempre', 'necesitarán ayer'], 1],
                ['«Colectivo» في السياق الاجتماعي تعني:', ['فئة أو مجموعة', 'ميزانية', 'تجربة مخبرية', 'رابط لغوي'], 0],
                ['أي جملة تعرض المشكلة بصورة أوسع؟', ['Todo depende del dinero', 'No solo importa el coste, sino también el impacto', 'No hay nada que evaluar', 'La situación es sencilla siempre'], 1],
                ['«Resiliencia» تعني:', ['القدرة على الصمود والتعافي', 'الانحياز', 'التأخير', 'الملكية'], 0],
                ['لماذا نستشير الفئات المتأثرة قبل تطبيق سياسة؟', ['لإلغاء التقييم', 'لفهم احتياجاتها وآثار القرار عليها', 'لتجنب جمع المعلومات', 'لزيادة الغموض'], 1],
                ['«Repercusión» تعني:', ['أثر أو تداعيات', 'سبب نحوي', 'مقدمة خطاب', 'عينة عشوائية'], 0],
                ['أي تعبير يقدّم توصية؟', ['Habría que evaluar los resultados', 'Ayer fui al cine', 'No sé dónde vive', 'El libro es azul'], 0]
            ]
        ),

        esLesson(
            'u31', 'C2', 'التعبيرات الاصطلاحية والفروق الدقيقة', 'Fraseología, modismos y matices',
            ['تفهم التعبيرات الاصطلاحية من سياقها لا من ترجمتها الحرفية.', 'تستخدم تعبيرات شائعة في الكلام الطبيعي.', 'تفرق بين تعبيرات متقاربة في المعنى والنبرة.', 'تعيد صياغة التعبير بما يناسب المقام.'],
            [
                ['Dar por sentado', 'دار پور سينتاذو', 'يعتبر أمرًا مسلمًا به'], ['Estar al tanto', 'إستار أل تانتو', 'يبقى على اطلاع'], ['Echar en falta', 'إيتشار إن فالتا', 'يفتقد'],
                ['Salir adelante', 'سالير أذيلانتي', 'يتجاوز الصعوبات'], ['No dar abasto', 'نو دار أباستو', 'مش قادر يلحق على كل حاجة'], ['Tener en cuenta', 'تينير إن كوينتا', 'يأخذ في الاعتبار'],
                ['Ponerse manos a la obra', 'پونيرسي مانوس أ لا أوبرا', 'يبدأ التنفيذ فورًا'], ['Ir al grano', 'إير أل غرانو', 'يدخل في الموضوع مباشرة'], ['A fin de cuentas', 'أ فين دي كوينتاس', 'في نهاية المطاف'],
                ['A regañadientes', 'أ ريغانْياذيينتيس', 'على مضض'], ['Quedarse corto', 'كيذارسي كورتو', 'يكون أقل من المطلوب'], ['De buenas a primeras', 'دي بويناس أ پريميراس', 'من أول وهلة / فجأة']
            ],
            [
                ['A', 'No des por sentado que todos conocen el procedimiento.', 'ما تعتبرش إن كل الناس عارفة الإجراء تلقائيًا.'],
                ['B', 'Tienes razón. De buenas a primeras, parece sencillo, pero tiene varios detalles.', 'معاك حق. من أول وهلة باين سهل، لكن فيه تفاصيل كتير.'],
                ['A', 'Ve al grano: ¿qué falta para terminar?', 'ادخل في الموضوع: إيه اللي ناقص عشان نخلص؟'],
                ['B', 'Nos falta revisar dos apartados. No damos abasto con todas las tareas.', 'فاضل نراجع جزئين. مش قادرين نلحق كل المهام.'],
                ['A', 'Tendremos que ponernos manos a la obra.', 'لازم نبدأ التنفيذ فورًا.'],
                ['B', 'Sí. A fin de cuentas, el esfuerzo merecerá la pena.', 'أيوه. في نهاية المطاف، المجهود هيكون مستاهل.'],
                ['A', 'Ten en cuenta que el primer borrador puede quedarse corto.', 'خد بالك إن المسودة الأولى ممكن ما توصلش للمستوى المطلوب.'],
                ['B', 'Lo sé, pero saldremos adelante si nos organizamos.', 'عارف، لكن هنتجاوز الموضوع لو نظمنا نفسنا.']
            ],
            [
                ['LOCUCIONES VERBALES', 'التعبير الاصطلاحي ممكن يكون معناه مختلفًا عن مجموع كلماته؛ احفظه كوحدة كاملة مع مثال وسياق.', 'No doy abasto esta semana.'],
                ['RÉGIMEN PREPOSICIONAL', 'بعض التعبيرات مرتبطة بحرف جر ثابت، فلا تغيّره بالترجمة الحرفية.', 'Estar al tanto de algo; tener en cuenta algo.'],
                ['REGISTRO Y CONTEXTO', 'اختار التعبير بحسب المقام؛ ir al grano مباشر وقد يبدو حادًا في بعض المواقف الرسمية.', 'Permítame ir directamente al asunto.'],
                ['SINÓNIMOS NO SIEMPRE INTERCAMBIABLES', 'التعبيرات القريبة في المعنى تختلف في النبرة والانتشار والمنطقة، فراجع السياق قبل الاستبدال.', 'Echar en falta / echar de menos.'],
                ['USO FIGURADO', 'المعنى المجازي يتضح من الجملة الكاملة، مش من ترجمة كل كلمة على حدة.', 'La primera propuesta se quedó corta.']
            ],
            [
                ['«No dar abasto» تعني:', ['يكون مشغولًا لدرجة عدم القدرة على اللحاق', 'يعطي هدية', 'يصل مبكرًا', 'يوافق فورًا'], 0],
                ['«Ir al grano» تعني:', ['يدور حول الموضوع', 'يدخل في صلب الموضوع', 'يغير رأيه', 'يتكلم ببطء'], 1],
                ['أكمل: «Estoy al tanto ___ los cambios».', ['por', 'de', 'con', 'a'], 1],
                ['«A regañadientes» تعني:', ['بحماس شديد', 'على مضض', 'بسرعة', 'من غير قصد'], 1],
                ['أي تعبير يعني «يأخذ في الاعتبار»؟', ['Dar por sentado', 'Tener en cuenta', 'Quedarse corto', 'Salir adelante'], 1],
                ['«La explicación se quedó corta» معناها:', ['الشرح كان كافيًا جدًا', 'الشرح لم يصل للمستوى المطلوب', 'الشرح كان طويلًا', 'الشرح غير مفهوم لغويًا فقط'], 1],
                ['أفضل طريقة لتعلم التعبيرات الاصطلاحية هي:', ['ترجمة كل كلمة وحدها', 'حفظها في سياق وجملة كاملة', 'تجاهل حروف الجر', 'استخدامها في كل موقف'], 1],
                ['أي عبارة ألطف في اجتماع رسمي؟', ['Cállate', 'Permítame ir directamente al asunto', 'No me importa', 'Habla ya'], 1]
            ]
        ),
        esLesson(
            'u32', 'C2', 'القراءة الأدبية وتحليل الأسلوب', 'Lectura literaria y análisis estilístico',
            ['تحلل الراوي ووجهة النظر والبنية السردية.', 'تفسر الرمز والاستعارة والمعنى غير المعلن.', 'تفرق بين الحبكة والزمن وطريقة عرض الأحداث.', 'تكتب قراءة نقدية توازن بين أكثر من تفسير.'],
            [
                ['Voz narrativa', 'بوث نارّاتِيبا', 'الصوت السردي'], ['Focalización', 'فوكاليثاثيون', 'زاوية الرؤية السردية'], ['Elipsis', 'إيليپسيس', 'حذف / فجوة سردية'],
                ['Leitmotiv', 'لايت موتيب', 'فكرة أو صورة متكررة'], ['Verosimilitud', 'بيروسيميليتود', 'قابلية التصديق'], ['Ambivalencia', 'أمبيبالينثيا', 'ازدواج الدلالة أو الشعور'],
                ['Simbolismo', 'سيمبوليسمو', 'رمزية'], ['Subtexto', 'سوبتيكستو', 'معنى ضمني تحت النص'], ['Desenlace abierto', 'ديسينلاثي أبييرتو', 'نهاية مفتوحة'],
                ['Intertextualidad', 'إنتيرتيكستواليذاذ', 'تداخل النصوص'], ['Recurso estilístico', 'ريكورسو إستيليستيكو', 'وسيلة أسلوبية'], ['Perspectiva', 'بيرسپيكتِيبا', 'منظور']
            ],
            [
                ['A', '¿Por qué crees que el narrador no revela lo que piensa el protagonista?', 'ليه تعتقد إن الراوي مش بيكشف أفكار البطل؟'],
                ['B', 'Esa limitación crea incertidumbre y obliga al lector a interpretar los silencios.', 'الحد ده بيخلق عدم يقين وبيجبر القارئ يفسر المساحات المسكوت عنها.'],
                ['A', '¿Y qué función cumple el símbolo del espejo?', 'ورمز المرآة دوره إيه؟'],
                ['B', 'Podría representar una identidad dividida, aunque también admite una lectura más literal.', 'ممكن يرمز لهوية منقسمة، رغم إنه يحتمل تفسيرًا حرفيًا كمان.'],
                ['A', 'El final parece no resolver el conflicto.', 'النهاية باين إنها مش بتحل الصراع.'],
                ['B', 'Precisamente. El desenlace abierto mantiene la ambivalencia del personaje.', 'بالضبط. النهاية المفتوحة بتحافظ على ازدواجية الشخصية.'],
                ['A', '¿Dirías que hay intertextualidad?', 'هل تقول إن فيه تداخلًا مع نصوص تانية؟'],
                ['B', 'Sí, ciertas imágenes evocan obras anteriores sin citarlas directamente.', 'أيوه، بعض الصور بتفكّرنا بأعمال سابقة من غير ما تقتبسها مباشرة.']
            ],
            [
                ['FOCALIZACIÓN', 'بتحدد مين اللي بيشوف الأحداث ومقدار المعلومات المتاحة للقارئ؛ وده مش لازم يكون هو نفس الراوي.', 'La historia se cuenta desde la perspectiva del personaje.'],
                ['ELIPSIS NARRATIVA', 'حذف فترة أو حدث من السرد يترك للقارئ مهمة استنتاج ما وقع خلالها.', 'Años después, volvió al mismo lugar.'],
                ['SUBTEXTO', 'المعنى الضمني قد يظهر من الصمت والتناقض والتفاصيل الصغيرة، لا من التصريح المباشر.', 'Dijo que estaba feliz, pero no sonrió.'],
                ['INTERTEXTUALIDAD', 'قد يستحضر النص عملًا آخر بالتلميح أو إعادة كتابة صورة أو بنية معروفة.', 'El viaje recuerda a un mito clásico.'],
                ['INTERPRETACIÓN ABIERTA', 'اسند تفسيرك إلى شواهد نصية، واعترف بالقراءات البديلة عندما يسمح النص بها.', 'El espejo puede simbolizar la memoria o la identidad.']
            ],
            [
                ['«Focalización» تتعلق بـ:', ['وجهة النظر السردية', 'عدد صفحات الرواية', 'سعر الكتاب', 'وزن الورق'], 0],
                ['«Subtexto» هو:', ['المعنى الضمني تحت الكلام الظاهر', 'عنوان الفصل', 'ترجمة النص', 'اسم الراوي'], 0],
                ['النهاية المفتوحة عادةً:', ['تغلق كل الأسئلة', 'تترك مساحة لتأويل القارئ', 'تلغي الشخصيات', 'تشرح كل الرموز'], 1],
                ['«Leitmotiv» يعني:', ['صورة أو فكرة متكررة', 'خطأ مطبعي', 'راويًا عليمًا', 'تاريخ النشر'], 0],
                ['الراوي ووجهة النظر السردية:', ['هما دائمًا الشيء نفسه', 'قد يختلفان', 'لا علاقة لهما بالسرد', 'لا يظهران في الرواية'], 1],
                ['«Intertextualidad» تشير إلى:', ['علاقة النص بنصوص أخرى', 'تكرار حرف واحد', 'ترتيب الأحداث زمنيًا فقط', 'حذف علامات الترقيم'], 0],
                ['تفسير الرمز الأدبي الأقوى هو الذي:', ['يتجاهل السياق', 'يستند إلى شواهد النص ويقبل الاحتمالات المدعومة', 'يفرض معنى واحدًا دائمًا', 'يعتمد على ترجمة العنوان فقط'], 1],
                ['«Elipsis» السردية تعني:', ['شرحًا مطولًا', 'حذف جزء من زمن أو حدث السرد', 'نهاية سعيدة', 'حوارًا مباشرًا'], 1]
            ]
        ),
        esLesson(
            'u33', 'C2', 'السخرية والفكاهة والتلميح الثقافي', 'Ironía, humor y referencias culturales',
            ['تفهم المفارقة بين المعنى الحرفي والمقصود.', 'تحلل السخرية والتهكم والمبالغة.', 'تتعرف على التلميحات الثقافية واللغوية.', 'تختار نبرة مناسبة عند استخدام الفكاهة.'],
            [
                ['Sarcasmo', 'ساركاسمو', 'تهكم لاذع'], ['Sátira', 'ساتيرا', 'سخرية نقدية'], ['Doble sentido', 'ذوبلي سينتيذو', 'معنى مزدوج'],
                ['Alusión', 'ألوثيون', 'تلميح'], ['Parodia', 'پاروديا', 'محاكاة ساخرة'], ['Hipérbole', 'إيپيربولي', 'مبالغة'],
                ['Eufemismo', 'إوفيميسمو', 'تعبير ملطف'], ['Guiño', 'غوينيو', 'إشارة أو تلميح مرح'], ['Absurdo', 'ابسورذو', 'عبثي'],
                ['Remate', 'ريماتي', 'قفلة النكتة'], ['Literalidad', 'ليتيراليذاذ', 'المعنى الحرفي'], ['Complicidad', 'كومپليثيذاذ', 'ألفة مشتركة']
            ],
            [
                ['A', '¿Te pareció gracioso el comentario del final?', 'التعليق اللي في الآخر كان مضحك بالنسبالك؟'],
                ['B', 'Sí, porque dice lo contrario de lo que realmente quiere dar a entender.', 'أيوه، لأنه بيقول عكس اللي هو عايز يوصله فعلًا.'],
                ['A', '¿Eso sería sarcasmo?', 'ده يعتبر تهكم؟'],
                ['B', 'Depende del tono. También podría ser ironía si no pretende humillar a nadie.', 'حسب النبرة. وممكن يكون مفارقة ساخرة لو مش هدفه يقلل من حد.'],
                ['A', 'Hay una alusión a una película bastante conocida.', 'فيه تلميح لفيلم مشهور جدًا.'],
                ['B', 'Claro, y quien no conozca la referencia quizá no entienda el remate.', 'طبعًا، واللي مش عارف الإشارة دي ممكن ما يفهمش قفلة النكتة.'],
                ['A', '¿Conviene usar ese humor en cualquier contexto?', 'ينفع نستخدم النوع ده من الفكاهة في أي سياق؟'],
                ['B', 'No. La complicidad y la sensibilidad del público son fundamentales.', 'لأ. الألفة المشتركة ومراعاة إحساس الجمهور أساسيتين.']
            ],
            [
                ['IRONÍA Y SARCASMO', 'المفارقة بتقول شيئًا ويكون المقصود مختلفًا من السياق؛ والتهكم غالبًا أشد وقد يستهدف شخصًا أو موقفًا.', '¡Qué puntual!, dijo al llegar una hora tarde.'],
                ['HIPÉRBOLE', 'المبالغة بتضخم الوصف عمدًا لأثر فكاهي أو بلاغي، ومش المقصود فهمها حرفيًا.', 'Te he llamado mil veces.'],
                ['DOBLE SENTIDO', 'العبارة قد تحتمل قراءتين؛ السياق هو اللي يحدد إذا كان التلميح بريئًا أو مقصودًا.', 'El comentario tenía un doble sentido.'],
                ['ALUSIONES CULTURALES', 'التلميح لعمل فني أو حدث أو شخصية يحتاج معرفة مشتركة، وقد يضيع أثره عند جمهور مختلف.', 'La escena es un guiño a una película clásica.'],
                ['HUMOR Y CONTEXTO', 'الفكاهة مش مناسبة لكل مقام؛ راعِ العلاقة وحساسية الموضوع قبل استخدام السخرية.', 'El mismo chiste no funciona en todos los contextos.']
            ],
            [
                ['«Sátira» تعني:', ['نقد ساخر', 'تقرير علمي', 'حوار رسمي', 'مقدمة رواية'], 0],
                ['«¡Qué puntual!» لشخص وصل متأخرًا قد تكون:', ['مدحًا حرفيًا', 'مفارقة ساخرة', 'طلبًا مباشرًا', 'تحية صباحية'], 1],
                ['«Hipérbole» هي:', ['مبالغة مقصودة', 'حذف نحوي', 'تعبير زمني', 'حقيقة إحصائية'], 0],
                ['فهم التلميح الثقافي يعتمد على:', ['عدد الكلمات فقط', 'المعرفة المشتركة والسياق', 'علامة الاستفهام', 'زمن الفعل'], 1],
                ['الفرق الأقرب بين sarcasmo وironía هو:', ['لا يوجد أي فرق', 'التهكم غالبًا أشد وقد يحمل قصدًا لاذعًا', 'السخرية لا تعتمد على السياق', 'المفارقة دائمًا مدح'], 1],
                ['«Doble sentido» يعني:', ['معنى واحد مباشر', 'معنى مزدوج', 'زمنين مختلفين', 'صوتًا مرتفعًا'], 1],
                ['قبل استخدام نكتة ساخرة، الأهم مراعاة:', ['السياق وحساسية الجمهور والعلاقة', 'طول الجملة', 'عدد المتحدثين فقط', 'سرعة الكلام'], 0],
                ['«Remate» في النكتة هو:', ['بداية الحوار', 'القفلة التي تحقق الأثر', 'اسم الشخصية', 'الشرح الحرفي'], 1]
            ]
        ),

        esLesson(
            'u34', 'C2', 'التواصل بين الثقافات وحل سوء الفهم', 'Comunicación intercultural y mediación',
            ['تفسر أثر الخلفية الثقافية على التواصل.', 'تتعامل مع اختلاف الأعراف ومستويات المباشرة.', 'تعيد صياغة رسالة لتجنب سوء الفهم.', 'تتوسط بين أطراف مختلفة من غير فرض حكم مسبق.'],
            [
                ['Mediación intercultural', 'ميذياثيون إنتيركولتورال', 'وساطة بين الثقافات'], ['Estereotipo', 'إستيريوتيپو', 'صورة نمطية'], ['Referente', 'ريفيرينتي', 'مرجع ثقافي'],
                ['Norma implícita', 'نورما إمپليثيتا', 'قاعدة ضمنية'], ['Acomodación', 'أكوموذاثيون', 'تكيّف لغوي'], ['Diversidad lingüística', 'ذيبيرسيذاذ لينغويستيكا', 'تنوع لغوي'],
                ['Malentendido pragmático', 'مالينتينذيذو پراغماتيکو', 'سوء فهم تداولي'], ['Perspectiva', 'بيرسپيكتِيبا', 'وجهة نظر'], ['Escucha activa', 'إسكوتشا أكتِيبا', 'استماع فعّال'],
                ['Sensibilidad', 'سينسيبيليذاذ', 'مراعاة / حساسية'], ['Cortesía verbal', 'كورتيسيا بيربال', 'لباقة لفظية'], ['Contextualizar', 'كونتيكستواليثار', 'يضع في سياقه']
            ],
            [
                ['A', 'Creo que mi compañero interpretó la respuesta como una falta de interés.', 'أعتقد إن زميلي فهم الرد على إنه عدم اهتمام.'],
                ['B', '¿La respuesta fue demasiado breve o faltaba contexto?', 'الرد كان مختصر زيادة ولا كان ناقصه سياق؟'],
                ['A', 'En su entorno, se espera una explicación más explícita.', 'في بيئته، متوقعين شرحًا أوضح.'],
                ['B', 'Entonces, quizá no sea una cuestión de mala intención, sino de normas comunicativas distintas.', 'إذن ممكن الموضوع مش سوء نية، لكن اختلاف في قواعد التواصل.'],
                ['A', '¿Cómo podemos aclararlo sin atribuirle un estereotipo?', 'إزاي نوضح الموضوع من غير ما نعمم صورة نمطية؟'],
                ['B', 'Preguntando qué quiso decir y reformulando el mensaje con respeto.', 'بإننا نسأل هو كان يقصد إيه ونعيد صياغة الرسالة باحترام.'],
                ['A', 'Me parece una buena forma de mediar.', 'شايف إن دي طريقة كويسة للوساطة.'],
                ['B', 'Sí. Escuchar activamente evita convertir una diferencia en un conflicto.', 'أيوه. الاستماع الفعّال بيمنع إن الاختلاف يتحول لخلاف.']
            ],
            [
                ['EVITAR GENERALIZACIONES', 'ما تنسبش سلوك شخص لمجموعة كاملة؛ اسأل عن العرف والسياق بدل الاعتماد على الصور النمطية.', 'En esta situación, ¿cómo suele interpretarse esa expresión?'],
                ['PREGUNTAS DE ACLARACIÓN', 'استخدم سؤالًا مفتوحًا للتأكد من المقصود من غير اتهام المتحدث.', '¿Podrías explicarme qué querías transmitir?'],
                ['REFORMULAR SIN IMPONER', 'أعد عرض كلام الطرفين بكلمات محايدة، وسيب لهم فرصة تصحيح التفسير.', 'Si te he entendido bien, tu preocupación es el plazo.'],
                ['CORTESÍA Y DIRECTIVIDAD', 'درجة المباشرة بتختلف بين المواقف والثقافات، وما ينفعش نساوي الاختلاف بقلة الاحترام تلقائيًا.', '¿Te importaría revisar este punto?'],
                ['MEDIACIÓN', 'الوسيط يوضح المعاني والمصالح المشتركة، لكنه لا يفرض اتفاقًا ولا يحكم على طرف قبل سماعه.', 'Busquemos una solución que ambas partes consideren viable.']
            ],
            [
                ['«Estereotipo» تعني:', ['صورة نمطية', 'اتفاق مكتوب', 'فرضية علمية', 'وقفة صوتية'], 0],
                ['أفضل طريقة لتوضيح سوء الفهم هي:', ['اتهام الطرف الآخر', 'سؤال مفتوح وإعادة صياغة محايدة', 'تعميم التجربة على الجميع', 'إنهاء الحوار'], 1],
                ['«Escucha activa» تعني:', ['استماع مع متابعة وفهم', 'مقاطعة المتحدث', 'قراءة صامتة', 'تكرار الكلام فقط'], 0],
                ['دور الوسيط هو:', ['فرض رأي شخصي', 'توضيح المعاني ومساعدة الأطراف على التواصل', 'اختيار طرف فائز', 'تجاهل الاختلاف'], 1],
                ['أي عبارة تتجنب الاتهام؟', ['أنت دائمًا تقصد الإساءة', 'لماذا تتصرف هكذا؟', 'هل ممكن توضح قصدك من العبارة؟', 'أنتم جميعًا متشابهون'], 2],
                ['«Norma implícita» هي:', ['قاعدة غير معلنة يفهمها أفراد سياق معين', 'قانون مكتوب فقط', 'مصطلح أدبي', 'نتيجة اختبار'], 0],
                ['التكيف اللغوي بين الثقافات لا يعني:', ['مراعاة السياق', 'توضيح المقصود', 'التخلي عن الهوية أو تعميم الصور النمطية', 'الاستماع للطرف الآخر'], 2],
                ['«Malentendido pragmático» يحدث عندما:', ['يختلف المقصود أو تفسير العبارة بحسب السياق', 'يكون الإملاء صحيحًا', 'تكون الكلمة طويلة', 'ينتهي الحوار باتفاق'], 0]
            ]
        ),
        esLesson(
            'u35', 'C2', 'تركيب المصادر وتقييم المعرفة', 'Síntesis de fuentes y evaluación del conocimiento',
            ['تقارن بين مصادر مستقلة وتحدد مواضع الاتفاق والاختلاف.', 'تفرق بين المصدر الأولي والثانوي.', 'تلخص أفكارًا معقدة من غير تشويه معناها.', 'تنسب الادعاءات لأصحابها وتوضح حدود الاستنتاج.'],
            [
                ['Fuente primaria', 'فوينتي پريمريا', 'مصدر أولي'], ['Fuente secundaria', 'فوينتي سيكونذاريا', 'مصدر ثانوي'], ['Convergencia', 'كونبيرخينثيا', 'تقارب في النتائج'],
                ['Discrepancia', 'ذيسكريپانثيا', 'اختلاف / تعارض'], ['Corroborar', 'كورّوبورار', 'يعزز بدليل مستقل'], ['Atribuir', 'أتريبير', 'ينسب إلى مصدر'],
                ['Síntesis', 'سينتيسيس', 'تركيب / خلاصة مقارنة'], ['Paráfrasis', 'پارافراسيس', 'إعادة صياغة'], ['Cita', 'ثيتا', 'اقتباس'],
                ['Limitación', 'ليميتاثيون', 'حد / قيد'], ['Panorama', 'پانوراما', 'صورة عامة'], ['Contrastar', 'كونتراستار', 'يقارن ويفحص الاختلاف']
            ],
            [
                ['A', 'Las dos fuentes coinciden en la tendencia general, pero discrepan en la explicación.', 'المصدرين متفقين في الاتجاه العام، لكن مختلفين في تفسيره.'],
                ['B', '¿Cuál de ellas ofrece datos originales?', 'أنهي واحد فيهم بيقدم بيانات أصلية؟'],
                ['A', 'El informe técnico es una fuente primaria; el artículo resume investigaciones anteriores.', 'التقرير الفني مصدر أولي؛ والمقال بيلخص أبحاثًا سابقة.'],
                ['B', '¿Podemos corroborar el hallazgo?', 'نقدر ندعم النتيجة بدليل مستقل؟'],
                ['A', 'Sí, aunque debemos tener en cuenta las limitaciones de ambas muestras.', 'أيوه، مع ضرورة مراعاة حدود العينتين.'],
                ['B', 'Entonces, redactemos una síntesis y atribuyamos cada afirmación.', 'إذن نكتب خلاصة مقارنة وننسب كل معلومة لمصدرها.'],
                ['A', 'Sin convertir la paráfrasis en una cita literal.', 'من غير ما نخلي إعادة الصياغة كأنها اقتباس حرفي.'],
                ['B', 'Exacto. También indicaremos qué aspectos siguen sin resolverse.', 'بالضبط. وهنوضح كمان إيه الجوانب اللي لسه من غير حسم.']
            ],
            [
                ['FUENTE PRIMARIA Y SECUNDARIA', 'المصدر الأولي يقدم مادة أو بيانات أصلية، والثانوي يحلل أو يلخص مواد منشورة سابقًا؛ والتصنيف بيعتمد على سؤال البحث.', 'Una entrevista original / una revisión bibliográfica.'],
                ['PARÁFRASIS Y CITA', 'إعادة الصياغة تنقل الفكرة بكلماتك مع ذكر المصدر؛ الاقتباس ينقل اللفظ نفسه ويحتاج علامة اقتباس وإحالة دقيقة.', 'Según el informe, la tendencia se mantiene.'],
                ['CONTRASTAR RESULTADOS', 'قارن المنهج والعينة والتعريفات قبل اعتبار اختلاف النتيجة تناقضًا مباشرًا.', 'Los estudios no utilizan la misma definición.'],
                ['ATRIBUCIÓN', 'انسب كل ادعاء لمصدره، ولا تحول رأي مؤلف إلى حقيقة عامة بصياغة مطلقة.', 'La autora sostiene que..., mientras que el informe señala...'],
                ['SÍNTESIS CRÍTICA', 'الخلاصة الجيدة بتعرض المشترك والاختلاف وحدود الأدلة، مش مجرد تلخيص كل مصدر على حدة.', 'En conjunto, las fuentes sugieren..., aunque no permiten concluir...']
            ],
            [
                ['«Fuente primaria» هي:', ['مصدر يقدم مادة أو بيانات أصلية', 'ملخص كتاب فقط', 'رأي غير موثق', 'ترجمة آلية'], 0],
                ['إعادة الصياغة تتطلب:', ['تغيير كلمتين فقط', 'نقل الفكرة بأسلوبك مع توثيق المصدر', 'حذف اسم المؤلف', 'وضع الكلام بين علامتي اقتباس دائمًا'], 1],
                ['«Corroborar» تعني:', ['ينفي', 'يعزز أو يؤكد بدليل', 'يحذف', 'يترجم'], 1],
                ['قبل مقارنة نتائج دراستين، راجع:', ['لون الغلاف', 'المنهج والعينة والتعريفات', 'اسم المدينة فقط', 'عدد الصور'], 1],
                ['«Discrepancia» تعني:', ['اتفاق', 'اختلاف أو تعارض', 'خلاصة', 'اقتباس'], 1],
                ['أي صياغة تنسب الرأي لمصدر؟', ['La verdad es...', 'La autora sostiene que...', 'Todos saben que...', 'Es obvio que...'], 1],
                ['الخلاصة النقدية الجيدة يجب أن:', ['تخفي الاختلافات', 'تجمع أوجه الاتفاق والاختلاف والحدود', 'تكرر كل مصدر حرفيًا', 'تستبعد المصادر المخالفة'], 1],
                ['الفرق بين الاقتباس وإعادة الصياغة هو:', ['لا فرق', 'الاقتباس ينقل اللفظ، وإعادة الصياغة تنقل الفكرة بكلمات جديدة', 'إعادة الصياغة لا تحتاج مصدرًا', 'الاقتباس لا يحتاج دقة'], 1]
            ]
        ),
        esLesson(
            'u36', 'C2', 'الطلاقة المرنة ودقة التعبير', 'Fluidez flexible y precisión expresiva',
            ['تتكلم بطلاقة مع الحفاظ على الدقة والوضوح.', 'تعيد صياغة الفكرة تلقائيًا عند نسيان كلمة.', 'تغير السجل والنبرة حسب الموقف.', 'تربط الأفكار المعقدة من غير حشو أو تكرار.'],
            [
                ['Circunloquio', 'ثيركونلوكيو', 'شرح المعنى بعبارة بديلة'], ['Precisión léxica', 'پريثيسيون ليكسيكا', 'دقة اختيار المفردات'], ['Reformular', 'ريفورمولار', 'يعيد الصياغة'],
                ['Espontaneidad', 'إسپونتانيذاذ', 'عفوية'], ['Vacilación', 'باثيلاثيون', 'تردد أثناء الكلام'], ['Autocorrección', 'أوتوكورّيكثيون', 'تصحيح الذات'],
                ['Cohesión', 'كوأيسيون', 'ترابط لغوي'], ['Coherencia', 'كوأيرينثيا', 'اتساق منطقي'], ['Naturalidad', 'ناتوراليذاذ', 'طبيعية التعبير'],
                ['Matiz', 'ماثيس', 'فرق دقيق في المعنى'], ['Fluidez', 'فلوئيذيث', 'طلاقة'], ['Muletilla', 'مويتييا', 'كلمة حشو متكررة']
            ],
            [
                ['A', '¿Cómo explicarías esa idea sin utilizar el término técnico?', 'هتشرح الفكرة دي إزاي من غير المصطلح التقني؟'],
                ['B', 'Podría decir que es el proceso por el que una sociedad se adapta a cambios profundos.', 'ممكن أقول إنها العملية اللي المجتمع بيتكيف من خلالها مع تغييرات عميقة.'],
                ['A', 'Has reformulado la definición sin perder precisión.', 'إنت أعدت صياغة التعريف من غير ما تفقد الدقة.'],
                ['B', 'Intento evitar las muletillas y corregirme solo cuando el error afecta al sentido.', 'بحاول أتجنب كلمات الحشو، وأصحح نفسي بس لما الغلط يأثر على المعنى.'],
                ['A', '¿Y si no recuerdas una palabra?', 'ولو مش فاكر كلمة؟'],
                ['B', 'Uso un circunloquio breve y continúo, en lugar de interrumpir toda la explicación.', 'بستخدم وصفًا بديلًا مختصرًا وبكمل بدل ما أوقف الشرح كله.'],
                ['A', 'Eso hace que el discurso suene más natural.', 'ده بيخلي الكلام طبيعي أكتر.'],
                ['B', 'Sí, siempre que mantenga la coherencia y adapte el registro al interlocutor.', 'أيوه، بشرط أحافظ على ترابط الكلام وأظبط مستوى اللغة حسب اللي قدامي.']
            ],
            [
                ['CIRCUNLOQUIO', 'لما تنسى كلمة، اشرح وظيفتها أو شكلها أو استخدامها مؤقتًا، وبعدها ارجع للكلمة الدقيقة لو افتكرتها.', 'Es un objeto que sirve para medir la temperatura.'],
                ['AUTOCORRECCIÓN', 'صحح نفسك لما التصحيح يغير المعنى أو يمنع اللبس؛ مش لازم توقف بعد كل زلة صغيرة.', 'Quería decir el segundo resultado, no el primero.'],
                ['MULETILLAS', 'قلل تكرار كلمات زي bueno وpues وo sea من غير وظيفة واضحة، واستبدلها بوقفة قصيرة أو رابط مناسب.', 'En primer lugar..., además..., por último...'],
                ['COHESIÓN Y COHERENCIA', 'cohesión هي الروابط اللغوية الظاهرة، وcoherencia هي منطق الأفكار وتسلسلها؛ ممكن نص يكون فيه روابط كتير لكنه غير مترابط.', 'La propuesta es viable; sin embargo, requiere financiación.'],
                ['PRECISIÓN Y REGISTRO', 'اختار كلمة محددة بدل كلمة عامة، وبدّل درجة الرسمية حسب الشخص والمقام من غير ما تفقد طبيعية الكلام.', 'Me preocupa el impacto / Estoy bastante inquieto por las consecuencias.']
            ],
            [
                ['«Circunloquio» هو:', ['وصف بديل للمعنى عند عدم تذكر الكلمة', 'اقتباس حرفي', 'خطأ في التصريف', 'تكرار بلا معنى'], 0],
                ['متى تكون autocorrección مفيدة؟', ['بعد كل كلمة', 'لما الخطأ يسبب لبسًا أو يغير المعنى', 'لإطالة الكلام', 'لتجنب إكمال الجملة'], 1],
                ['«Muletilla» تعني:', ['كلمة حشو متكررة', 'مصدر أولي', 'خاتمة خطاب', 'فرضية'], 0],
                ['الفرق بين cohesión وcoherencia هو:', ['لا فرق', 'الأولى روابط لغوية والثانية ترابط منطقي', 'الأولى تخص الصوت فقط', 'الثانية تعني النطق'], 1],
                ['لو نسيت كلمة أثناء الكلام، الأفضل غالبًا:', ['تتوقف تمامًا', 'تستخدم شرحًا بديلًا وتكمل', 'تخترع كلمة', 'تكرر آخر جملة'], 1],
                ['«Precisión léxica» تعني:', ['كثرة المفردات فقط', 'اختيار الكلمة الأدق للمعنى', 'سرعة النطق', 'رفع الصوت'], 1],
                ['الطلاقة الجيدة تعني:', ['السرعة مهما كان الوضوح', 'استمرار الكلام بوضوح ودقة ومرونة', 'عدم التصحيح أبدًا', 'استخدام كلمات معقدة دائمًا'], 1],
                ['أي رابط يوضح استدراكًا؟', ['Además', 'Sin embargo', 'Por ejemplo', 'En primer lugar'], 1]
            ]
        )
    ]
};

/* ---------- расширение المحتوى: مفردات وتطبيقات إضافية لكل وحدة ---------- */
var spanishExpansion = {
    u1: [
        ['Encantado / Encantada', 'إنكانتاذو / إنكانتاذا', 'سعيد بمعرفتك'], ['¿De dónde eres?', 'دي دوندي إيريس', 'إنت منين؟'],
        ['Soy de…', 'سوي دي', 'أنا من…'], ['¿Qué tal?', 'كي تال', 'عامل إيه؟'], ['Bienvenido / Bienvenida', 'بيينبينيدو / بيينبينيدا', 'أهلًا وسهلًا'], ['Igualmente', 'إيجوالمينتي', 'وأنا كذلك']
    ],
    u2: [
        ['Once', 'أونثي', 'أحد عشر'], ['Doce', 'دوثي', 'اثنا عشر'], ['Quince', 'كينثي', 'خمسة عشر'],
        ['Veinte', 'بيينتي', 'عشرون'], ['Treinta', 'ترينتا', 'ثلاثون'], ['Cien', 'ثيين', 'مئة']
    ],
    u3: [
        ['Padres', 'بادريس', 'الوالدان'], ['Primo', 'پريمو', 'ابن العم / الخال'], ['Prima', 'پريما', 'ابنة العم / الخال'],
        ['Tío', 'تيو', 'عم / خال'], ['Tía', 'تيا', 'عمة / خالة'], ['Pareja', 'پارِيخا', 'شريك / شريكة الحياة']
    ],
    u4: [
        ['Desayuno', 'ديسايونو', 'فطار'], ['Almuerzo', 'ألمويرثو', 'غداء'], ['Cena', 'ثينا', 'عشاء'],
        ['Pescado', 'پيسكاذو', 'سمك'], ['Verduras', 'بيرذوراس', 'خضروات'], ['Fruta', 'فروتا', 'فاكهة']
    ],
    u5: [
        ['Mapa', 'مابا', 'خريطة'], ['Semáforo', 'سيمَفورو', 'إشارة مرور'], ['Esquina', 'إسكينا', 'ناصية / ركن'],
        ['Cruzar', 'كروثار', 'يعبر الطريق'], ['Girar', 'خيرار', 'يلف'], ['Todo recto', 'توذو ريكـتو', 'على طول']
    ],
    u6: [
        ['Calendario', 'كالينذاريو', 'تقويم'], ['Mediodía', 'ميذيوذيا', 'وقت الظهر'], ['Medianoche', 'ميذيا نوتشي', 'منتصف الليل'],
        ['Minuto', 'مينوتو', 'دقيقة'], ['Temprano', 'تيمپرانو', 'بدري'], ['Tarde', 'تارذي', 'متأخر / بعد الظهر']
    ],
    u7: [
        ['Peinarse', 'پينارسي', 'يمشّط شعره'], ['Vestirse', 'بيستيرسي', 'يلبس'], ['Lavarse', 'لابارسي', 'يغسل نفسه'],
        ['Preparar', 'پريپارار', 'يحضّر'], ['Descansar', 'ذيسكانسار', 'يرتاح'], ['A menudo', 'آ مينوذو', 'غالبًا']
    ],
    u8: [
        ['Balcón', 'بالكون', 'شرفة'], ['Jardín', 'خارذين', 'حديقة'], ['Muebles', 'مويبليس', 'أثاث'],
        ['Ventana', 'بينتانا', 'شباك'], ['Puerta', 'پويرتا', 'باب'], ['Amueblado', 'أمويبلا​ذو', 'مفروش']
    ],
    u9: [
        ['Falda', 'فالذا', 'جيبة'], ['Vestido', 'بيستيدو', 'فستان'], ['Probador', 'پروبا​ذور', 'غرفة قياس الملابس'],
        ['En efectivo', 'إن إيفيكتيبو', 'نقدًا'], ['Devolver', 'ذيبولبير', 'يرجّع / يستبدل'], ['Rebaja', 'ريباخا', 'تخفيض']
    ],
    u10: [
        ['Billete', 'بيييتي', 'تذكرة'], ['Andén', 'أندين', 'رصيف القطار'], ['Equipaje', 'إكيپاخي', 'أمتعة'],
        ['Retraso', 'ريتراسو', 'تأخير'], ['Salida', 'ساليذا', 'مغادرة'], ['Llegada', 'ييغاذا', 'وصول']
    ],
    u11: [
        ['Médico', 'ميذيكو', 'طبيب'], ['Enfermera', 'إنفيرميرا', 'ممرضة'], ['Fiebre', 'فييبري', 'حمّى'],
        ['Dolor', 'ذولور', 'ألم'], ['Receta', 'ريثيتا', 'روشتة طبية'], ['Síntoma', 'سينتوما', 'عَرَض']
    ],
    u12: [
        ['Paisaje', 'پايساخي', 'منظر طبيعي'], ['Alojamiento', 'ألوخاميينتو', 'مكان إقامة'], ['Descubrir', 'ديسكوبرير', 'يكتشف'],
        ['Recuerdo', 'ريكويرذو', 'ذكرى'], ['Excursión', 'إكسكورسيون', 'رحلة قصيرة'], ['Aventura', 'أبينتورا', 'مغامرة']
    ],
    u13: [
        ['Infancia', 'إنفانثيا', 'طفولة'], ['Ocurrir', 'أوكورير', 'يحدث'], ['Conocer', 'كونوثير', 'يتعرف على'],
        ['Perder', 'پيرذير', 'يفقد'], ['Celebrar', 'ثيليبـرار', 'يحتفل'], ['Acordarse de', 'أكورذارسي ذي', 'يتذكر']
    ],
    u14: [
        ['Empleo', 'إمپلِيـو', 'وظيفة'], ['Entrevista', 'إنتريبستا', 'مقابلة'], ['Sueldo', 'سويلذو', 'راتب'],
        ['Horario', 'أوراريو', 'مواعيد العمل'], ['Compañero', 'كومپانييرو', 'زميل'], ['Experiencia', 'إكسپيريينثيا', 'خبرة']
    ],
    u15: [
        ['Opinión', 'أپينيون', 'رأي'], ['Argumento', 'أرغومينتو', 'حُجّة'], ['Acuerdo', 'أكويرذو', 'اتفاق'],
        ['Desacuerdo', 'ذيساكويرذو', 'اختلاف / عدم اتفاق'], ['Convencer', 'كونبينثير', 'يقنع'], ['Matizar', 'ماثيسار', 'يوضح الفروق الدقيقة']
    ],
    u16: [
        ['Contaminación', 'كونتامينياثيون', 'تلوث'], ['Reciclaje', 'ريثيكلاخي', 'إعادة تدوير'], ['Residuos', 'ريسيذووس', 'مخلّفات'],
        ['Energía', 'إنيرخيا', 'طاقة'], ['Sequía', 'سيكيا', 'جفاف'], ['Biodiversidad', 'بيوذيبييرسيذاذ', 'تنوع بيولوجي']
    ],
    u17: [
        ['Titular', 'تيتولار', 'عنوان خبر'], ['Noticia', 'نوتيثيا', 'خبر'], ['Fuente', 'فوينتي', 'مصدر'],
        ['Audiencia', 'أوذيينثيا', 'جمهور'], ['Publicar', 'پوبليكـار', 'ينشر'], ['Rumor', 'رومور', 'شائعة']
    ],
    u18: [
        ['Objetivo', 'أوبيتيبو', 'هدف'], ['Decisión', 'ذيثيسيون', 'قرار'], ['Riesgo', 'رييسغو', 'مخاطرة'],
        ['Ventaja', 'بينتاخا', 'ميزة'], ['Inconveniente', 'إنكونبينيينتي', 'عيب / صعوبة'], ['Lograr', 'لوغرار', 'يحقق']
    ],
    u19: [
        ['Evidencia', 'إبيذينثيا', 'دليل'], ['Premisa', 'پريميسا', 'مقدمة منطقية'], ['Conclusión', 'كونكلوسيون', 'استنتاج'],
        ['Refutar', 'ريفوتار', 'يدحض'], ['Coherente', 'كوأيرينتي', 'متماسك منطقيًا'], ['Objeción', 'أوبخيثيون', 'اعتراض']
    ],
    u20: [
        ['Solicitud', 'سوليثيتود', 'طلب رسمي'], ['Adjunto', 'أذخونتو', 'مرفق'], ['Destinatario', 'ديستيناتاريو', 'المرسَل إليه'],
        ['Asunto', 'أسونتو', 'موضوع الرسالة'], ['Plazo', 'پلاثو', 'مهلة'], ['Reunión', 'ريونيون', 'اجتماع']
    ],
    u21: [
        ['Condición', 'كونذيثيون', 'شرط'], ['Consecuencia', 'كونسيكوينثيا', 'نتيجة'], ['Arrepentirse', 'أريپينتيرسي', 'يندم'],
        ['Posibilidad', 'پوسيبيليذاذ', 'احتمال / إمكانية'], ['Improbable', 'إيمپروبابلِه', 'مستبعد'], ['Suponer', 'سوپونير', 'يفترض']
    ],
    u22: [
        ['Reportero', 'ريپورتيـرو', 'مراسل صحفي'], ['Verificación', 'بيريفيكاثيون', 'تحقق'], ['Desinformación', 'ذيسإنفورماثيون', 'معلومات مضللة'],
        ['Comunicado', 'كومونيكاذو', 'بيان رسمي'], ['Fuente fiable', 'فوينتي فيابلِه', 'مصدر موثوق'], ['Rectificación', 'ريكتيفيكاثيون', 'تصحيح منشور']
    ],
    u23: [
        ['Capítulo', 'كاپيتولو', 'فصل من كتاب'], ['Prólogo', 'پرولوغو', 'مقدمة كتاب'], ['Verso', 'بيرسو', 'بيت شعري'],
        ['Estrofa', 'إستروفا', 'مقطع شعري'], ['Símbolo', 'سيمبولو', 'رمز'], ['Estilo', 'إستيلو', 'أسلوب']
    ],
    u24: [
        ['Propuesta', 'پروپويستا', 'اقتراح'], ['Compromiso', 'كومپروميسو', 'التزام'], ['Cláusula', 'كلاوسولا', 'بند في اتفاق'],
        ['Mediación', 'ميذياثيون', 'وساطة'], ['Condición', 'كونذيثيون', 'شرط'], ['Cumplimiento', 'كومپليمينتو', 'تنفيذ / التزام']
    ],
    u25: [
        ['Tesis', 'تيسيس', 'أطروحة / فكرة رئيسية'], ['Premisa', 'پريميسا', 'مقدمة منطقية'], ['Refutación', 'ريفوتاثيون', 'دحض'],
        ['Solidez', 'سوليذيث', 'متانة الحجة'], ['Sesgo', 'سيسغو', 'انحياز'], ['Alcance', 'ألكانثي', 'نطاق / مدى']
    ],
    u26: [
        ['Hipótesis', 'إيپوتيسيس', 'فرضية'], ['Muestra', 'مويسترا', 'عينة بحثية'], ['Variable', 'باريابلي', 'متغير'],
        ['Metodología', 'ميتوذولوخيا', 'منهجية'], ['Hallazgo', 'أياجغو', 'نتيجة مكتشفة'], ['Revisión', 'ريبِسيون', 'مراجعة']
    ],
    u27: [
        ['Implicatura', 'إيمپليكاتورا', 'معنى ضمني مستنتج'], ['Turno de palabra', 'تورنو ذي پالابرا', 'دور الكلام'], ['Atenuar', 'أتينوار', 'يخفف حدة التعبير'],
        ['Cortesía', 'كورتيثيا', 'لباقة'], ['Contexto', 'كونتيكستو', 'سياق'], ['Interpretación', 'إنتيرپريتاثيون', 'تفسير']
    ],
    u28: [
        ['Audiencia', 'أوذيينثيا', 'جمهور'], ['Discurso', 'ذيسكورسو', 'خطاب'], ['Énfasis', 'إنفاسيس', 'توكيد'],
        ['Pausa', 'پاوسا', 'وقفة'], ['Persuadir', 'پيرسوا ذير', 'يقنع'], ['Elocuencia', 'إلوكُوينثيا', 'فصاحة']
    ],
    u29: [
        ['Presupuesto', 'پريسوبويستو', 'ميزانية'], ['Objetivo', 'أوبيتيبو', 'هدف'], ['Tarea', 'تاريا', 'مهمة'],
        ['Seguimiento', 'سيغيميينتو', 'متابعة'], ['Coordinación', 'كوورذيناثيون', 'تنسيق'], ['Responsable', 'ريسپونسابلي', 'مسؤول']
    ],
    u30: [
        ['Ciudadanía', 'ثيوذاذانيا', 'مواطنة'], ['Desigualdad', 'ذيسيجوالذاذ', 'عدم مساواة'], ['Bienestar', 'بيينإستار', 'رفاه'],
        ['Regulación', 'ريغولاثيون', 'تنظيم / لائحة'], ['Participación', 'پارتثيپاثيون', 'مشاركة'], ['Administración pública', 'أذمينستـراثيون پوبليكا', 'إدارة عامة']
    ],
    u31: [
        ['Modismo', 'موذيسمو', 'تعبير اصطلاحي'], ['Refrán', 'ريفران', 'مثل شائع'], ['Doble sentido', 'ذوبلي سينتيذو', 'معنى مزدوج'],
        ['Literal', 'ليتيرال', 'حرفي'], ['Figurado', 'فيغوراذو', 'مجازي'], ['Connotación', 'كونوتاثيون', 'دلالة إيحائية']
    ],
    u32: [
        ['Capítulo', 'كاپيتولو', 'فصل'], ['Metáfora', 'ميتافورا', 'استعارة'], ['Aliteración', 'أليتيراثيون', 'جناس استهلالي / تكرار صوتي'],
        ['Perspectiva', 'پيرسپيكتيبا', 'وجهة نظر'], ['Ritmo', 'ريتمو', 'إيقاع'], ['Ambigüedad', 'أمبيغويذاذ', 'غموض / ازدواج معنى']
    ],
    u33: [
        ['Sarcasmo', 'ساركاسمو', 'تهكم لاذع'], ['Guiño', 'غيينيو', 'غمزة / تلميح'], ['Parodia', 'پاروديا', 'محاكاة ساخرة'],
        ['Burla', 'بورلا', 'سخرية'], ['Alusión', 'ألوثيون', 'تلميح'], ['Doble lectura', 'ذوبلي لِكتورا', 'قراءة مزدوجة']
    ],
    u34: [
        ['Estereotipo', 'إستيريوتيپو', 'صورة نمطية'], ['Malentendido', 'مالينتينذيذو', 'سوء فهم'], ['Norma implícita', 'نورما إيمپليسيتا', 'قاعدة ضمنية'],
        ['Empatía', 'إيمپاتيا', 'تعاطف'], ['Perspectiva', 'پيرسپيكتيبا', 'وجهة نظر'], ['Mediador', 'ميذياذور', 'وسيط']
    ],
    u35: [
        ['Cita', 'ثيتا', 'اقتباس'], ['Paráfrasis', 'پارافراسيس', 'إعادة صياغة'], ['Corroborar', 'كورّوبورار', 'يدعم بدليل إضافي'],
        ['Discrepancia', 'ذيسكريپانثيا', 'اختلاف / تعارض'], ['Evidencia', 'إبيذينثيا', 'دليل'], ['Atribución', 'أتريبوسيون', 'نَسب المعلومة لمصدر']
    ],
    u36: [
        ['Circunloquio', 'ثيركونلوكيو', 'شرح المعنى بعبارة بديلة'], ['Muletilla', 'مويتييا', 'كلمة حشو متكررة'], ['Reformular', 'ريفورمولار', 'يعيد الصياغة'],
        ['Espontáneo', 'إسپونتانيـو', 'عفوي'], ['Precisión', 'پريثيسيون', 'دقة'], ['Naturalidad', 'ناتوراليذاذ', 'طبيعية التعبير']
    ]
};

var spanishDialogExpansion = {
    u1: [['A', '¿Cómo se escribe tu nombre?', 'اسمك بيتكتب إزاي؟'], ['B', 'Se escribe con eme y o. Encantado de conocerte.', 'بيتكتب بحرف الميم والواو. سعيد بمعرفتك.']],
    u2: [['A', '¿Cuántos libros tienes?', 'عندك كام كتاب؟'], ['B', 'Tengo quince libros y veinte cuadernos.', 'عندي خمستاشر كتاب وعشرين كراسة.']],
    u3: [['A', '¿Tienes primos?', 'عندك أولاد عم أو خال؟'], ['B', 'Sí, mi prima vive cerca de mis padres.', 'أيوه، بنت عمي ساكنة قريب من أهلي.']],
    u4: [['A', '¿Qué quieres para cenar?', 'تحب تاكل إيه على العشا؟'], ['B', 'Pescado con verduras y agua, por favor.', 'سمك بالخضار ومياه من فضلك.']],
    u5: [['A', '¿Hay un banco en esta esquina?', 'فيه بنك عند الناصية دي؟'], ['B', 'Sí, cruza la calle y gira a la izquierda.', 'أيوه، اقطع الشارع ولف شمال.']],
    u6: [['A', '¿A qué hora es el descanso?', 'الراحة الساعة كام؟'], ['B', 'Al mediodía, durante quince minutos.', 'وقت الظهر لمدة خمستاشر دقيقة.']],
    u7: [['A', '¿Te preparas rápido por la mañana?', 'بتجهز بسرعة الصبح؟'], ['B', 'Sí, me visto y desayuno antes de salir.', 'أيوه، بلبس وبفطر قبل ما أخرج.']],
    u8: [['A', '¿El piso está amueblado?', 'الشقة مفروشة؟'], ['B', 'Sí, tiene muebles nuevos y un balcón.', 'أيوه، فيها أثاث جديد وبلكونة.']],
    u9: [['A', '¿Puedo devolver esta falda?', 'ممكن أرجّع الجيبة دي؟'], ['B', 'Sí, conserva el recibo y la etiqueta.', 'أيوه، احتفظ بالإيصال والبطاقة.']],
    u10: [['A', '¿Dónde está el andén de salida?', 'فين رصيف المغادرة؟'], ['B', 'Al fondo. El tren tiene diez minutos de retraso.', 'في الآخر. القطر متأخر عشر دقايق.']],
    u11: [['A', 'Tengo fiebre y dolor de garganta.', 'عندي حرارة ووجع في الزور.'], ['B', 'Deberías consultar al médico y seguir la receta.', 'الأفضل تستشير الطبيب وتتبع الروشتة.']],
    u12: [['A', '¿Qué paisaje te gustó más?', 'أنهي منظر طبيعي عجبك أكتر؟'], ['B', 'El de la montaña. Fue una aventura inolvidable.', 'منظر الجبل. كانت مغامرة متتنسيش.']],
    u13: [['A', '¿Qué recuerdas de tu infancia?', 'فاكر إيه من طفولتك؟'], ['B', 'Recuerdo los viajes que hacía con mi familia.', 'فاكر الرحلات اللي كنت بعملها مع عيلتي.']],
    u14: [['A', '¿Cómo fue tu entrevista de trabajo?', 'مقابلة الشغل كانت عاملة إزاي؟'], ['B', 'Bien. Preguntaron por mi experiencia y mi horario.', 'كويسة. سألوا عن خبرتي ومواعيد شغلي.']],
    u15: [['A', '¿Cuál es tu argumento principal?', 'إيه حجتك الأساسية؟'], ['B', 'Estoy de acuerdo en parte, pero hay que matizarla.', 'متفق جزئيًا، لكن لازم نوضح الفروق الدقيقة.']],
    u16: [['A', '¿Cómo podemos reducir los residuos?', 'إزاي نقلل المخلفات؟'], ['B', 'Con reciclaje, menos plástico y energía limpia.', 'بإعادة التدوير وتقليل البلاستيك واستخدام الطاقة النظيفة.']],
    u17: [['A', '¿Has leído el titular de hoy?', 'قرأت عنوان خبر النهارده؟'], ['B', 'Sí, pero quiero comprobar la fuente antes de compartirlo.', 'أيوه، بس عايز أتأكد من المصدر قبل ما أشاركه.']],
    u18: [['A', '¿Qué objetivo quieres lograr este año?', 'إيه الهدف اللي عايز تحققه السنة دي؟'], ['B', 'Tomar una decisión profesional y reducir los riesgos.', 'إني آخد قرار مهني وأقلل المخاطر.']],
    u19: [['A', '¿Qué evidencia respalda tu conclusión?', 'إيه الدليل اللي بيدعم استنتاجك؟'], ['B', 'Varias fuentes independientes y datos coherentes.', 'مصادر مستقلة متعددة وبيانات متماسكة.']],
    u20: [['A', '¿Has enviado la solicitud?', 'بعت الطلب الرسمي؟'], ['B', 'Sí, incluí el documento adjunto antes del plazo.', 'أيوه، أرفقت المستند قبل انتهاء المهلة.']],
    u21: [['A', '¿Te arrepientes de aquella decisión?', 'ندمان على القرار ده؟'], ['B', 'A veces, aunque supongo que aprendí algo importante.', 'أحيانًا، رغم إني أعتقد إني اتعلمت حاجة مهمة.']],
    u22: [['A', '¿Se ha verificado el comunicado?', 'هل تم التحقق من البيان؟'], ['B', 'Todavía no; el medio prepara una rectificación.', 'لسه لأ؛ الوسيلة الإعلامية بتجهز تصحيحًا.']],
    u23: [['A', '¿Qué recurso literario aparece en este verso?', 'إيه الأسلوب الأدبي الموجود في البيت ده؟'], ['B', 'Una metáfora que refuerza el símbolo central.', 'استعارة بتقوّي الرمز الأساسي.']],
    u24: [['A', '¿Podemos incluir esa cláusula?', 'نقدر نضيف البند ده؟'], ['B', 'Sí, siempre que ambas partes acepten el compromiso.', 'أيوه، بشرط إن الطرفين يوافقوا على الالتزام.']],
    u25: [['A', '¿La tesis está suficientemente fundamentada?', 'هل الأطروحة مدعومة بما يكفي؟'], ['B', 'Sí, pero conviene revisar el alcance de la conclusión.', 'أيوه، لكن الأفضل نراجع نطاق الاستنتاج.']],
    u26: [['A', '¿Cómo seleccionaste la muestra?', 'اخترت العينة إزاي؟'], ['B', 'Según la metodología y las variables del estudio.', 'حسب منهجية الدراسة ومتغيراتها.']],
    u27: [['A', '¿Ese comentario podría interpretarse como ironía?', 'هل ممكن التعليق ده يتفهم على إنه سخرية؟'], ['B', 'Depende del contexto, el tono y la relación entre hablantes.', 'ده بيتوقف على السياق والنبرة والعلاقة بين المتحدثين.']],
    u28: [['A', '¿Cómo mantienes la atención de la audiencia?', 'إزاي بتحافظ على انتباه الجمهور؟'], ['B', 'Combino ejemplos, pausas y énfasis en las ideas clave.', 'بجمع بين الأمثلة والوقفات والتأكيد على الأفكار الأساسية.']],
    u29: [['A', '¿Quién coordina el seguimiento del proyecto?', 'مين مسؤول عن متابعة المشروع؟'], ['B', 'La responsable revisa las tareas y el presupuesto.', 'المسؤولة بتراجع المهام والميزانية.']],
    u30: [['A', '¿Cómo se evalúa una política pública?', 'إزاي بنقيّم سياسة عامة؟'], ['B', 'Por sus resultados, su equidad y la participación ciudadana.', 'من خلال نتائجها وعدالتها ومشاركة المواطنين.']],
    u31: [['A', '¿La expresión tiene un sentido figurado?', 'هل التعبير ده معناه مجازي؟'], ['B', 'Sí, el refrán no debe interpretarse literalmente.', 'أيوه، المثل مينفعش يتفهم بشكل حرفي.']],
    u32: [['A', '¿Por qué cambia la perspectiva del narrador?', 'ليه وجهة نظر الراوي بتتغير؟'], ['B', 'Para crear ambigüedad y modificar la interpretación.', 'عشان يخلق غموض ويغير طريقة فهم النص.']],
    u33: [['A', '¿Es una crítica o una parodia?', 'ده نقد ولا محاكاة ساخرة؟'], ['B', 'Una parodia con un guiño a otra obra conocida.', 'محاكاة ساخرة فيها تلميح لعمل تاني معروف.']],
    u34: [['A', '¿Cómo evitar un malentendido intercultural?', 'إزاي نتجنب سوء فهم بين ثقافتين؟'], ['B', 'Escuchando con empatía y preguntando por el contexto.', 'بالاستماع بتعاطف والسؤال عن السياق.']],
    u35: [['A', '¿Coinciden las fuentes en todos los puntos?', 'هل المصادر متفقة في كل النقاط؟'], ['B', 'No; la síntesis debe explicar cada discrepancia.', 'لأ؛ الخلاصة لازم توضح كل اختلاف.']],
    u36: [['A', '¿Qué haces cuando olvidas una palabra?', 'بتعمل إيه لما تنسى كلمة؟'], ['B', 'La describo con otras palabras y continúo hablando.', 'بوصفها بكلمات تانية وبكمل كلام.']]
};

var spanishNoteExpansion = {
    u1: ['PRESENTAR A OTRA PERSONA', 'لما تقدم شخصًا لحد، تقدر تستخدم este es / esta es، وبعدها الاسم أو الصفة.', 'Este es mi amigo Carlos.'],
    u2: ['NÚMEROS Y GÉNERO', 'uno بيتغير إلى un قبل اسم مذكر مفرد، وإلى una قبل اسم مؤنث مفرد.', 'Tengo veintiún libros y veintiuna revistas.'],
    u3: ['POSESIVOS', 'su / sus ممكن تعني ملكيته أو ملكيتها أو ملكيتهم؛ السياق هو اللي يوضح المقصود.', 'Su hermana vive en Madrid.'],
    u4: ['PEDIR EN UN RESTAURANTE', 'quisiera وme gustaría ألطف من الطلب المباشر، واستخدم la cuenta لما تطلب الحساب.', 'Me gustaría una ensalada, por favor.'],
    u5: ['DAR INDICACIONES', 'استخدم imperativo مع تعليمات الطريق: sigue، cruza، gira، ثم حدد الاتجاه.', 'Cruza la plaza y gira a la derecha.'],
    u6: ['FRECUENCIA', 'لو بتتكلم عن تكرار العادة استخدم siempre وnormalmente وa veces وnunca.', 'Normalmente estudio por la mañana.'],
    u7: ['PRONOMBRES REFLEXIVOS', 'ضمير الفعل الانعكاسي يسبق الفعل المصرف، لكنه يتصل بالمصدر أو gerundio في تراكيب معينة.', 'Voy a levantarme temprano. / Me estoy vistiendo.'],
    u8: ['SER Y ESTAR EN DESCRIPCIONES', 'ser لوصف طبيعة المكان أو صفته العامة، وestar لتحديد موقعه أو حالته.', 'El piso es amplio y está cerca del centro.'],
    u9: ['DEMOSTRATIVOS', 'este / esta للقريب، ese / esa للمتوسط أو ما قرب من المخاطب، aquel / aquella للبعيد.', '¿Puedo probarme aquella chaqueta?'],
    u10: ['POR Y PARA EN VIAJES', 'para بتوضح الوجهة أو الغرض غالبًا، وpor ممكن توضح المرور عبر مكان أو سبب الحركة.', 'Salimos para Sevilla por la autopista.'],
    u11: ['ESTAR + GERUNDIO', 'نستخدم estar مع gerundio لوصف فعل جاري في اللحظة الحالية.', 'Estoy esperando al médico.'],
    u12: ['PRETÉRITO INDEFINIDO E IMPERFECTO', 'indefinido للأحداث المحددة المكتملة، وimperfecto للخلفية والعادة والوصف في الماضي.', 'Ayer visité el museo; antes iba allí cada verano.'],
    u13: ['CONECTORES NARRATIVOS', 'رتب الأحداث باستخدام al principio، luego، mientras tanto، finalmente.', 'Al principio dudé; finalmente acepté.'],
    u14: ['DESDE / DESDE HACE / HACE', 'desde يحدد نقطة بداية، وdesde hace مدة مستمرة حتى الآن، وhace قد يحدد زمنًا مضى.', 'Trabajo aquí desde hace tres años.'],
    u15: ['EXPRESAR ACUERDO PARCIAL', 'للموافقة الجزئية استخدم estoy de acuerdo en parte أو comparto esa idea hasta cierto punto.', 'Comparto esa idea hasta cierto punto.'],
    u16: ['FUTURO Y CONSECUENCIAS', 'اربط السبب بالنتيجة باستخدام por eso، por lo tanto، como consecuencia، debido a.', 'Se redujo el consumo; por lo tanto, bajaron las emisiones.'],
    u17: ['ESTILO INDIRECTO', 'عند نقل الكلام، راجع الضمائر والزمان والمكان، وقد يتغير الزمن حسب فعل النقل.', 'Dijo: «Estoy ocupado» → Dijo que estaba ocupado.'],
    u18: ['FUTURO Y PLANES', 'ir a + infinitivo للخطة المقصودة، والمستقبل البسيط للتوقع أو القرار في سياقه.', 'Voy a solicitar el puesto mañana.'],
    u19: ['CONECTORES ARGUMENTATIVOS', 'اربط الأطروحة بالأدلة والنتيجة باستخدام por una parte، además، no obstante، en consecuencia.', 'La medida es útil; no obstante, tiene límites.'],
    u20: ['REGISTRO FORMAL', 'في المراسلات الرسمية تجنب الاختصارات العامية، وحدد الغرض والطلب والموعد بوضوح.', 'Le agradecería que confirmara la recepción.'],
    u21: ['CONDICIONALES', 'الشرط الواقعي يستخدم si + presente، والافتراضي الحالي يستخدم si + imperfecto de subjuntivo.', 'Si tuviera más tiempo, estudiaría otro idioma.'],
    u22: ['ATRIBUIR INFORMACIÓN', 'استخدم según، de acuerdo con، el portavoz afirmó que لتوضيح مصدر الخبر.', 'Según el informe, los datos siguen incompletos.'],
    u23: ['INTERPRETAR RECURSOS LITERARIOS', 'افصل بين وصف الصورة الفنية وتأثيرها في القارئ، وادعم التفسير بقرينة من النص.', 'La metáfora refuerza la sensación de pérdida.'],
    u24: ['NEGOCIAR CONDICIONES', 'وضح الشرط والمهلة والمسؤولية قبل الموافقة النهائية على الاتفاق.', 'Aceptamos la propuesta siempre que se cumpla el plazo.'],
    u25: ['TESIS Y ANTÍTESIS', 'اعرض الفكرة الأساسية ثم الرأي المقابل، وبعدها قيّم الأدلة بدل مهاجمة صاحب الرأي.', 'Aunque la tesis es sólida, admite una objeción.'],
    u26: ['DISEÑO DE INVESTIGACIÓN', 'لا تخلط بين الارتباط والسببية، واذكر خصائص العينة وحدود طريقة جمع البيانات.', 'La correlación no demuestra causalidad.'],
    u27: ['ACTOS DE HABLA', 'المعنى المقصود قد يختلف عن المعنى الحرفي؛ النبرة والعلاقة والسياق بتحدد وظيفة العبارة.', '¿Puedes cerrar la ventana? puede ser una petición.'],
    u28: ['ESTRUCTURA DEL DISCURSO', 'نظم الخطاب إلى مقدمة ومحاور وخاتمة، واستخدم الوقفات لتأكيد النقاط المهمة.', 'En primer lugar..., por otra parte..., para concluir...'],
    u29: ['GESTIÓN DE PROYECTOS', 'حدد المسؤول والموعد والمؤشر لكل مهمة، وراجع المخاطر والتقدم بانتظام.', 'El equipo revisará los avances cada viernes.'],
    u30: ['EVALUAR POLÍTICAS', 'قيّم السياسة من حيث الفاعلية والعدالة والتكلفة والآثار غير المقصودة.', 'La eficacia debe medirse junto con la equidad.'],
    u31: ['SENTIDO LITERAL Y FIGURADO', 'التعبير الاصطلاحي لا يُفهم دائمًا من جمع معاني كلماته؛ تعلّمه داخل جملة وسياق.', 'Estar en las nubes no describe una ubicación real.'],
    u32: ['RECURSOS ESTILÍSTICOS', 'اختيار الراوي والإيقاع والتكرار والصور البلاغية بيشكل تجربة القراءة وطريقة تفسير الأحداث.', 'La repetición crea un ritmo insistente.'],
    u33: ['IRONÍA Y SARCASMO', 'السخرية تعتمد على الفارق بين المعنى الظاهر والمقصود، لكن تحديدها يحتاج قرائن سياقية.', '¡Qué puntual!, cuando alguien llega tarde.'],
    u34: ['COMPETENCIA INTERCULTURAL', 'اسأل عن المقصود والعرف المحلي قبل الحكم على السلوك، وتجنب تعميم تجربة فردية.', '¿Cómo se interpreta esta expresión en tu contexto?'],
    u35: ['SÍNTESIS Y CITACIÓN', 'اجمع النتائج المشتركة والاختلافات، وانسب كل فكرة لمصدرها، واذكر حدود الأدلة.', 'Las fuentes coinciden en..., aunque difieren respecto a...'],
    u36: ['ESTRATEGIAS DE REPARACIÓN', 'لو نسيت كلمة، استخدم وصفًا بديلًا أو مثالًا أو إعادة صياغة، وبعدها ارجع للتعبير الأدق.', 'Es un objeto que se utiliza para medir la temperatura.']
};

var spanishQuizExpansion = {
    u1: [['إيه أنسب معنى لـ «¿De dónde eres?»؟', ['إنت منين؟', 'اسمك إيه؟', 'عندك كام سنة؟', 'رايح فين؟'], 0], ['لما تقدم صديقك تقول:', ['Esta es mi casa', 'Este es mi amigo', 'Tengo amigo años', 'Soy amigo tú'], 1]],
    u2: [['«Quince» يساوي:', ['12', '15', '20', '30'], 1], ['اختار العدد الصحيح لـ 100:', ['Cien', 'Treinta', 'Doce', 'Once'], 0]],
    u3: [['«Primo» تعني:', ['ابن العم أو الخال', 'الجد', 'الأب', 'الزوج'], 0], ['«Mis padres» معناها:', ['أصدقائي', 'والداي', 'أخواتي', 'أطفالي'], 1]],
    u4: [['«Pescado» تعني:', ['فاكهة', 'سمك', 'خبز', 'أرز'], 1], ['أنهي كلمة معناها عشاء؟', ['Desayuno', 'Almuerzo', 'Cena', 'Fruta'], 2]],
    u5: [['«Esquina» تعني:', ['ناصية', 'خريطة', 'إشارة مرور', 'محطة'], 0], ['إيه معنى «Cruza la calle»؟', ['اقفل الشارع', 'اعبر الشارع', 'امش للخلف', 'قف هنا'], 1]],
    u6: [['«Medianoche» تعني:', ['الظهر', 'منتصف الليل', 'الصباح', 'العصر'], 1], ['«Normalmente» معناها:', ['أبدًا', 'غالبًا / عادةً', 'فجأة', 'أمس'], 1]],
    u7: [['«Vestirse» تعني:', ['يلبس', 'يطبخ', 'يقرأ', 'يستريح'], 0], ['أي جملة تعني «أنا بجهز نفسي»؟', ['Me preparo', 'Te preparas', 'Se preparan', 'Preparo tú'], 0]],
    u8: [['«Balcón» تعني:', ['باب', 'شرفة', 'مطبخ', 'مفتاح'], 1], ['«El piso está cerca» تصف:', ['مكان الشقة', 'سعر الشقة', 'عمر الشقة', 'مالك الشقة'], 0]],
    u9: [['«Rebaja» تعني:', ['تخفيض', 'فاتورة', 'مقاس', 'قماش'], 0], ['«En efectivo» معناها الدفع:', ['بالبطاقة', 'نقدًا', 'بالتقسيط', 'مجانًا'], 1]],
    u10: [['«Andén» هو:', ['رصيف القطار', 'جواز السفر', 'حقيبة', 'مطار'], 0], ['«Retraso» تعني:', ['وصول', 'تأخير', 'حجز', 'خروج'], 1]],
    u11: [['«Fiebre» تعني:', ['صداع', 'حمّى', 'دواء', 'موعد'], 1], ['«Receta» في سياق الطبيب هي:', ['روشتة', 'فاتورة', 'بطاقة', 'شكوى'], 0]],
    u12: [['«Alojamiento» تعني:', ['إقامة', 'مغامرة', 'ذكرى', 'منظر'], 0], ['«Descubrir» معناها:', ['ينسى', 'يكتشف', 'يغادر', 'يستأجر'], 1]],
    u13: [['«Infancia» تعني:', ['طفولة', 'وظيفة', 'رحلة', 'مستقبل'], 0], ['«Acordarse de» معناها:', ['يختلف مع', 'يتذكر', 'يبحث عن', 'يستيقظ'], 1]],
    u14: [['«Sueldo» تعني:', ['راتب', 'مقابلة', 'زميل', 'خبرة'], 0], ['«Entrevista» تعني:', ['استراحة', 'مقابلة', 'استقالة', 'إجازة'], 1]],
    u15: [['«Convencer» معناها:', ['يقنع', 'يعترض', 'ينسى', 'يصف'], 0], ['«Desacuerdo» تعني:', ['اتفاق', 'اختلاف', 'نتيجة', 'اقتراح'], 1]],
    u16: [['«Sequía» تعني:', ['فيضانات', 'جفاف', 'تلوث ضوضائي', 'تدوير'], 1], ['«Reciclaje» هو:', ['إعادة تدوير', 'استهلاك', 'تصنيع أولي', 'هدر'], 0]],
    u17: [['«Titular» في الصحافة يعني:', ['عنوان الخبر', 'المراسل', 'الجمهور', 'الإعلان'], 0], ['قبل مشاركة خبر، الأفضل:', ['نشره فورًا', 'التحقق من المصدر', 'حذف التاريخ', 'تغيير العنوان'], 1]],
    u18: [['«Ventaja» تعني:', ['ميزة', 'مخاطرة', 'تأخير', 'خسارة'], 0], ['«Lograr un objetivo» معناها:', ['يؤجل هدفًا', 'يحقق هدفًا', 'يلغي هدفًا', 'يشرح هدفًا'], 1]],
    u19: [['«Refutar» تعني:', ['يدعم دون دليل', 'يدحض حجة', 'يعيد كتابة', 'يوافق'], 1], ['«Premisa» هي:', ['مقدمة منطقية', 'خاتمة', 'مثال فقط', 'عنوان'], 0]],
    u20: [['«Adjunto» في البريد تعني:', ['مرفق', 'مرسل إليه', 'موضوع', 'توقيع'], 0], ['«Plazo» تعني:', ['مهلة', 'ميزانية', 'اجتماع', 'طلب'], 0]],
    u21: [['«Arrepentirse» تعني:', ['يندم', 'يقترح', 'يصل', 'يستنتج'], 0], ['«Consecuencia» تعني:', ['شرط', 'نتيجة', 'سبب', 'احتمال'], 1]],
    u22: [['«Rectificación» تعني:', ['تصحيح', 'تسريب', 'تغطية', 'مقابلة'], 0], ['المصدر الموثوق بالإسبانية هو:', ['Fuente fiable', 'Doble sentido', 'Salida', 'Refrán'], 0]],
    u23: [['«Prólogo» هو:', ['مقدمة الكتاب', 'خاتمة', 'شخصية', 'بيت شعري'], 0], ['«Símbolo» تعني:', ['إيقاع', 'رمز', 'حبكة', 'راوي'], 1]],
    u24: [['«Cláusula» تعني:', ['بند اتفاق', 'خلاف', 'وسيط', 'تأخير'], 0], ['الاتفاق القابل للتنفيذ يحتاج:', ['مسؤوليات وشروط واضحة', 'كلامًا عامًا', 'غياب المواعيد', 'إخفاء الخلاف'], 0]],
    u25: [['«Tesis» تعني:', ['فكرة رئيسية / أطروحة', 'نتيجة تجربة', 'عينة', 'تلميح'], 0], ['«Solidez de un argumento» تعني:', ['قوة الحجة', 'طول الجملة', 'سرعة الكلام', 'شهرة الكاتب'], 0]],
    u26: [['«Muestra» في البحث تعني:', ['عينة', 'فرضية', 'استنتاج', 'مراجعة'], 0], ['الارتباط بين متغيرين يثبت دائمًا:', ['السببية', 'لا شيء بمفرده', 'أن العينة كاملة', 'أن الفرضية صحيحة'], 1]],
    u27: [['«Implicatura» تعني:', ['معنى ضمني', 'معنى حرفي فقط', 'تصريف فعل', 'نبرة صوت'], 0], ['تفسير العبارة يعتمد على:', ['السياق والنبرة والعلاقة', 'القاموس فقط', 'عدد الحروف', 'الزمن فقط'], 0]],
    u28: [['«Énfasis» تعني:', ['توكيد', 'مقاطعة', 'خاتمة', 'جمهور'], 0], ['الوقفة في الخطاب ممكن تستخدم من أجل:', ['توضيح الفكرة وإبرازها', 'إخفاء الموضوع', 'إطالة بلا هدف', 'إرباك المستمع'], 0]],
    u29: [['«Presupuesto» تعني:', ['ميزانية', 'تأخير', 'مهمة', 'تقرير'], 0], ['متابعة المشروع تتطلب:', ['مراجعة المهام والمواعيد', 'تجاهل التقدم', 'إلغاء المسؤوليات', 'إخفاء المخاطر'], 0]],
    u30: [['«Desigualdad» تعني:', ['عدم مساواة', 'مشاركة', 'رفاه', 'تنظيم'], 0], ['تقييم السياسة العامة يشمل:', ['الفاعلية والعدالة والآثار', 'الشعار فقط', 'اسم المسؤول فقط', 'عدد الصفحات فقط'], 0]],
    u31: [['«Refrán» تعني:', ['مثل شائع', 'اقتباس علمي', 'فصل', 'مقدمة'], 0], ['«Sentido figurado» هو المعنى:', ['الحرفي', 'المجازي', 'النحوي', 'الصوتي'], 1]],
    u32: [['«Aliteración» ترتبط بـ:', ['تكرار الأصوات', 'نوع الراوي', 'ترتيب الفصول', 'وجهة النظر'], 0], ['«Perspectiva» تعني:', ['وجهة نظر', 'إيقاع', 'استعارة', 'عنوان'], 0]],
    u33: [['«Parodia» تعني:', ['محاكاة ساخرة', 'مقدمة', 'خلاصة', 'تقرير'], 0], ['لفهم السخرية نحتاج إلى:', ['السياق والفرق بين الظاهر والمقصود', 'المعنى الحرفي فقط', 'ترجمة كلمة واحدة', 'تجاهل النبرة'], 0]],
    u34: [['«Empatía» تعني:', ['تعاطف', 'انحياز', 'قانون', 'تعميم'], 0], ['لتجنب تعميم ثقافي، الأفضل:', ['سؤال الشخص عن السياق', 'الحكم على مجموعة كاملة', 'افتراض النية', 'تجاهل التوضيح'], 0]],
    u35: [['«Paráfrasis» تعني:', ['إعادة صياغة', 'اقتباس حرفي', 'تسريب', 'اختلاف'], 0], ['الخلاصة الجيدة تذكر:', ['الاتفاق والاختلاف وحدود الأدلة', 'مصدرًا واحدًا فقط', 'النتيجة دون مصدر', 'الآراء كحقائق'], 0]],
    u36: [['«Muletilla» تعني:', ['كلمة حشو متكررة', 'دليل مستقل', 'وجهة نظر', 'بند اتفاق'], 0], ['نسيان كلمة أثناء الحديث يمكن علاجه بـ:', ['وصفها بكلمات أخرى ومواصلة الكلام', 'التوقف عن الحديث', 'اختراع مصطلح', 'تغيير الموضوع دائمًا'], 0]]
};

Object.keys(spanishCourse.units.reduce(function (index, unit) { index[unit.id] = unit; return index; }, {})).forEach(function (id) {
    var unit = spanishCourse.units.filter(function (x) { return x.id === id; })[0];
    var extraWords = spanishExpansion[id] || [];
    extraWords.forEach(function (x, i) {
        unit.vocab.push({ k: 'extra-' + id + '-' + i, t: x[0], pr: x[1], ar: x[2] });
    });
    (spanishDialogExpansion[id] || []).forEach(function (x) {
        unit.dialog.lines.push({ w: x[0], t: x[1], ar: x[2] });
    });
    if (spanishNoteExpansion[id]) unit.notes.push(spanishNoteExpansion[id]);
    (spanishQuizExpansion[id] || []).forEach(function (x) {
        unit.quiz.push({ q: x[0], a: x[1], c: x[2] });
    });
});

spanishCourse.dictionary = true;
spanishCourse.level = 'A1–C2';
spanishCourse.desc = '36 وحدة من A1 إلى C2، وقاموس شامل قابل للبحث، ونطق صوتي وحوارات وقواعد واختبارات موسعة.';
spanishCourse.intro += ' واتضافت مفردات وتطبيقات وحوارات وأسئلة إضافية في كل وحدة، مع قاموس شامل يجمع كلمات المستويات كلها.';
EtoLang.register(spanishCourse);

