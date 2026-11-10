window.ETO_GAMES_CONFIG = {
    brand: 'ETO Games',
    homeUrl: '../index.html',
    hero: {
        gif: 'https://cdn.pixabay.com/animation/2023/01/09/01/35/01-35-51-99_512.gif',
        source: 'https://pixabay.com/gifs/games-gamer-controller-play-3119/',
        alt: 'Gaming controller GIF from Pixabay'
    },
    api: {
        gamerPower: 'https://www.gamerpower.com/api/giveaways',
        freeToGame: 'https://www.freetogame.com/api/games',
        cheapShark: 'https://www.cheapshark.com/api/1.0/deals',
        gdeltNews: 'https://api.gdeltproject.org/api/v2/doc/doc'
    },
    pageSizes: {
        giveaways: 18,
        free: 18,
        deals: 18,
        search: 48,
        featured: 10,
        news: 12
    },
    cacheHours: 6
};

window.ETO_GAMES_PLATFORMS = [
    {id:'pc',name:'PC',icon:'fa-solid fa-desktop'},
    {id:'steam',name:'Steam',icon:'fa-brands fa-steam'},
    {id:'epic-games-store',name:'Epic Games',icon:'fa-solid fa-gamepad'},
    {id:'gog',name:'GOG',icon:'fa-solid fa-cube'},
    {id:'ps4',name:'PlayStation 4',icon:'fa-brands fa-playstation'},
    {id:'ps5',name:'PlayStation 5',icon:'fa-brands fa-playstation'},
    {id:'xbox-series-xs',name:'Xbox Series X/S',icon:'fa-brands fa-xbox'},
    {id:'xbox-one',name:'Xbox One',icon:'fa-brands fa-xbox'},
    {id:'switch',name:'Nintendo Switch',icon:'fa-solid fa-gamepad'},
    {id:'android',name:'Android',icon:'fa-brands fa-android'},
    {id:'ios',name:'iOS',icon:'fa-brands fa-apple'},
    {id:'drm-free',name:'DRM-Free',icon:'fa-solid fa-unlock'},
    {id:'itchio',name:'itch.io',icon:'fa-solid fa-ghost'}
];

window.ETO_GAMES_HOME_CARDS = [
    {
        id:'giveaways',
        title:'Giveaways',
        ar:'جيفوايز مجانية',
        desc:'الألعاب والعروض المجانية المتاحة دلوقتي.',
        icon:'fa-solid fa-gift',
        image:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=82',
        tone:'blue'
    },
    {
        id:'eto',
        title:'Eto Games',
        ar:'ألعاب ETO',
        desc:'ألعاب ETO اللي هنضيفها عشان تتلعب من هنا.',
        icon:'fa-solid fa-gamepad',
        image:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=82',
        tone:'violet'
    },
    {
        id:'offers',
        title:'Offers & Trending',
        ar:'العروض والتريندنج',
        desc:'خصومات وألعاب عليها اهتمام كبير في مكان واحد.',
        icon:'fa-solid fa-fire-flame-curved',
        image:'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=82',
        tone:'orange'
    },
    {
        id:'allgames',
        title:'All Games',
        ar:'كل الألعاب',
        desc:'سيرش على كل الألعاب الموجودة في كتالوج ETO.',
        icon:'fa-solid fa-magnifying-glass',
        image:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=82',
        tone:'green'
    },
    {
        id:'popular',
        title:'Official Game Pages',
        ar:'صفحات الألعاب المشهورة',
        desc:'روابط مباشرة لمصادر ومتاجر رسمية وموثوقة.',
        icon:'fa-solid fa-shield-check',
        image:'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1200&q=82',
        tone:'indigo'
    },
    {
        id:'news',
        title:'Gaming News',
        ar:'أخبار الألعاب',
        desc:'أخبار حديثة تتجاب من API بدل الأخبار الثابتة.',
        icon:'fa-solid fa-newspaper',
        image:'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=82',
        tone:'slate'
    }
];

window.ETO_ORIGINAL_GAMES = [
    {
        id:'eto-runner',
        title:'ETO Runner',
        subtitle:'اللعبة الأولى',
        desc:'مساحة جاهزة للعبة Web خفيفة تتشغل من داخل ETO Games.',
        icon:'fa-solid fa-person-running',
        image:'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1000&q=82',
        playUrl:''
    },
    {
        id:'eto-arena',
        title:'ETO Arena',
        subtitle:'قريبًا',
        desc:'واجهة مخصصة للعبة تنافسية وإحصائيات اللاعبين.',
        icon:'fa-solid fa-crosshairs',
        image:'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=82',
        playUrl:''
    },
    {
        id:'eto-space',
        title:'ETO Space',
        subtitle:'قريبًا',
        desc:'لعبة فضائية خفيفة تعمل من المتصفح بدون تثبيت.',
        icon:'fa-solid fa-rocket',
        image:'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1000&q=82',
        playUrl:''
    },
    {
        id:'eto-puzzle',
        title:'ETO Puzzle',
        subtitle:'قريبًا',
        desc:'ألعاب ألغاز وتحديات سريعة من تطوير ETO.',
        icon:'fa-solid fa-puzzle-piece',
        image:'https://images.unsplash.com/photo-1606503153255-59d8b8b99a31?auto=format&fit=crop&w=1000&q=82',
        playUrl:''
    }
];

window.ETO_GAMES_OFFICIAL_PAGES = [
    {name:'Steam',desc:'المتجر الرسمي لـSteam والبحث عن أي لعبة.',icon:'fa-brands fa-steam',url:'https://store.steampowered.com/'},
    {name:'Epic Games Store',desc:'المتجر الرسمي لـEpic Games والعروض والألعاب.',icon:'fa-solid fa-gamepad',url:'https://store.epicgames.com/'},
    {name:'Google Play Games',desc:'ألعاب Google Play على الهاتف والكمبيوتر.',icon:'fa-brands fa-google-play',url:'https://play.google.com/googleplaygames/exploregames'},
    {name:'PlayStation Store',desc:'المتجر الرسمي لألعاب PlayStation.',icon:'fa-brands fa-playstation',url:'https://store.playstation.com/'},
    {name:'Xbox',desc:'الواجهة الرسمية للألعاب وخدمات Xbox.',icon:'fa-brands fa-xbox',url:'https://www.xbox.com/'},
    {name:'Nintendo',desc:'الموقع الرسمي وواجهة ألعاب Nintendo.',icon:'fa-solid fa-gamepad',url:'https://www.nintendo.com/'},
    {name:'GOG',desc:'متجر GOG الرسمي للألعاب.',icon:'fa-solid fa-cube',url:'https://www.gog.com/'},
    {name:'Riot Games',desc:'الصفحات الرسمية لألعاب Riot.',icon:'fa-solid fa-bolt',url:'https://www.riotgames.com/'},
    {name:'Electronic Arts',desc:'الموقع الرسمي لألعاب EA.',icon:'fa-solid fa-building',url:'https://www.ea.com/games'},
    {name:'Ubisoft',desc:'الموقع الرسمي لألعاب Ubisoft.',icon:'fa-solid fa-shield-halved',url:'https://www.ubisoft.com/en-us/games'},
    {name:'Rockstar Games',desc:'الموقع الرسمي لألعاب Rockstar.',icon:'fa-solid fa-star',url:'https://www.rockstargames.com/'},
    {name:'Battle.net',desc:'منصة Blizzard الرسمية للألعاب.',icon:'fa-solid fa-burst',url:'https://www.blizzard.com/'},
    {name:'Minecraft',desc:'الموقع الرسمي لـMinecraft.',icon:'fa-solid fa-cube',url:'https://www.minecraft.net/'},
    {name:'VALORANT',desc:'الموقع الرسمي لـVALORANT.',icon:'fa-solid fa-crosshairs',url:'https://playvalorant.com/'},
    {name:'League of Legends',desc:'الموقع الرسمي لـLeague of Legends.',icon:'fa-solid fa-dragon',url:'https://www.leagueoflegends.com/'},
    {name:'Fortnite',desc:'الموقع الرسمي لـFortnite من Epic.',icon:'fa-solid fa-bolt',url:'https://www.fortnite.com/'}
];

window.ETO_GAMES_STORE_SEARCH = [
    {name:'Steam',icon:'fa-brands fa-steam',url:q=>'https://store.steampowered.com/search/?term='+encodeURIComponent(q)},
    {name:'Epic Games',icon:'fa-solid fa-gamepad',url:q=>'https://store.epicgames.com/en-US/browse?q='+encodeURIComponent(q)},
    {name:'Google Play',icon:'fa-brands fa-google-play',url:q=>'https://play.google.com/store/search?q='+encodeURIComponent(q)+'&c=apps'},
    {name:'PlayStation',icon:'fa-brands fa-playstation',url:q=>'https://store.playstation.com/en-us/search/'+encodeURIComponent(q)},
    {name:'Xbox',icon:'fa-brands fa-xbox',url:q=>'https://www.xbox.com/en-US/search?q='+encodeURIComponent(q)},
    {name:'GOG',icon:'fa-solid fa-cube',url:q=>'https://www.gog.com/en/games?query='+encodeURIComponent(q)}
];

window.ETO_GAMES_IMAGE_FALLBACKS = {
    default:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=82',
    action:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=82',
    shooter:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=82',
    rpg:'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=82',
    racing:'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=82',
    sports:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=82',
    horror:'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=82'
};
