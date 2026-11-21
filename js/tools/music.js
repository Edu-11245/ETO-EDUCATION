/* ===== مشغل موسيقى الموقع ===== */
        const musicTracks = [
            { title: 'موسيقى هادئة 1', src: 'Data/audio/music_1.mp3' }
            // ,{ title: 'اسم الأغنية الجديدة', src: 'Data/audio/music_2.mp3' }
        ];

        const siteMusic = document.getElementById('site-music');
        const musicToggle = document.getElementById('music-toggle');
        const musicPanel = document.getElementById('music-panel');
        const musicClose = document.getElementById('music-close');
        const musicPlay = document.getElementById('music-play');
        const musicPrev = document.getElementById('music-prev');
        const musicNext = document.getElementById('music-next');
        const musicMute = document.getElementById('music-mute');
        const musicLoopBtn = document.getElementById('music-loop');
        const musicVolume = document.getElementById('music-volume');
        const musicSeek = document.getElementById('music-seek');
        const musicCurrentTime = document.getElementById('music-current-time');
        const musicDuration = document.getElementById('music-duration');
        const musicCurrentTitle = document.getElementById('music-current-title');
        const musicTrackList = document.getElementById('music-track-list');

        let musicIndex = 0;
        let musicLoopOne = true;
        let musicSeeking = false;

        function formatMusicTime(sec) {
            if (!isFinite(sec) || isNaN(sec)) return '0:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function renderMusicTrackList() {
            if (!musicTracks.length) {
                musicTrackList.innerHTML = '<div class="music-empty-hint"><i class="fa-solid fa-circle-info"></i> مفيش أغاني مضافة لسه، تقدر تضيف أغانيك من كود الصفحة.</div>';
                return;
            }

            musicTrackList.innerHTML = musicTracks.map((t, i) => `
                <div class="music-track ${i === musicIndex ? 'active' : ''}" data-index="${i}">
                    <i class="fa-solid ${i === musicIndex ? 'fa-volume-high' : 'fa-music'}"></i>
                    <span>${t.title}</span>
                </div>
            `).join('');

            musicTrackList.querySelectorAll('.music-track').forEach(el => {
                el.addEventListener('click', () => loadMusicTrack(parseInt(el.dataset.index), true));
            });
        }

        function loadMusicTrack(index, autoplay) {
            if (!musicTracks.length) return;

            musicIndex = (index + musicTracks.length) % musicTracks.length;
            const track = musicTracks[musicIndex];

            siteMusic.src = track.src;
            musicCurrentTitle.textContent = track.title;
            renderMusicTrackList();

            if (autoplay) {
                siteMusic.play().then(() => {
                    musicPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
                }).catch(() => {
                    console.log('المتصفح محتاج ضغطة من المستخدم لتشغيل الصوت.');
                });
            }
        }

        siteMusic.volume = 0.5;
        siteMusic.loop = musicLoopOne;
        renderMusicTrackList();
        if (musicTracks.length) loadMusicTrack(0, false);

        musicToggle.addEventListener('click', async () => {
            musicPanel.classList.toggle('show');

            if (siteMusic.paused && siteMusic.src) {
                try {
                    await siteMusic.play();
                    musicPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
                } catch (error) {
                    console.log('المتصفح محتاج ضغطة من المستخدم لتشغيل الصوت.');
                }
            }
        });

        musicClose.addEventListener('click', () => {
            musicPanel.classList.remove('show');
        });

        musicPlay.addEventListener('click', async () => {
            if (!siteMusic.src) return;

            if (siteMusic.paused) {
                await siteMusic.play();
                musicPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
            } else {
                siteMusic.pause();
                musicPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        });

        musicPrev.addEventListener('click', () => loadMusicTrack(musicIndex - 1, true));
        musicNext.addEventListener('click', () => loadMusicTrack(musicIndex + 1, true));

        musicMute.addEventListener('click', () => {
            siteMusic.muted = !siteMusic.muted;

            musicMute.innerHTML = siteMusic.muted
                ? '<i class="fa-solid fa-volume-xmark"></i>'
                : '<i class="fa-solid fa-volume-high"></i>';
            musicMute.classList.toggle('active', siteMusic.muted);
        });

        musicLoopBtn.addEventListener('click', () => {
            musicLoopOne = !musicLoopOne;
            siteMusic.loop = musicLoopOne;
            musicLoopBtn.classList.toggle('active', musicLoopOne);
        });

        musicVolume.addEventListener('input', () => {
            siteMusic.volume = parseFloat(musicVolume.value);

            if (siteMusic.volume > 0 && siteMusic.muted) {
                siteMusic.muted = false;
                musicMute.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                musicMute.classList.remove('active');
            }
        });

        siteMusic.addEventListener('timeupdate', () => {
            if (musicSeeking) return;

            musicCurrentTime.textContent = formatMusicTime(siteMusic.currentTime);
            musicDuration.textContent = formatMusicTime(siteMusic.duration);

            if (siteMusic.duration) {
                musicSeek.value = (siteMusic.currentTime / siteMusic.duration) * 100;
            }
        });

        musicSeek.addEventListener('input', () => { musicSeeking = true; });
        musicSeek.addEventListener('change', () => {
            if (siteMusic.duration) {
                siteMusic.currentTime = (musicSeek.value / 100) * siteMusic.duration;
            }
            musicSeeking = false;
        });

        siteMusic.addEventListener('ended', () => {
            if (!musicLoopOne) loadMusicTrack(musicIndex + 1, true);
        });
