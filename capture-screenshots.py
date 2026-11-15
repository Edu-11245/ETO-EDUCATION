
import sys, pathlib
from playwright.sync_api import sync_playwright
BASE = 'https://edu-11245.github.io/ETO-EDUCATION/'
if '--local' in sys.argv:
    BASE = sys.argv[sys.argv.index('--local') + 1]
OUT = pathlib.Path(__file__).parent / 'screenshots'
OUT.mkdir(exist_ok=True)
SECTIONS = {
    'student-tools': 'my-teachers my-platforms summaries exams schedule pomodoro percentage calculator translate library reader cleaner',
    'teacher-tools': 'grades certificate teacher templates answers-key exam-maker student-exams image-cleaner compare',
    'pdf-tools':     'merge extract editor convert pdf-to-word text watermark reorder protect ppt-pdf',
    'audio-tools':   'mp3-to-mp4 mp4-to-mp3 mp3-to-wav wav-to-mp3 mp3-to-ogg ogg-to-mp3',
    'extra-tools':   'audio-tools pdf-tools edu-tools',
}
def card(page, section, name):
    return page.locator(f"#page-{section} [onclick*=\"navigate('{name}')\"]").first
with sync_playwright() as p:
    b = p.chromium.launch(headless='--show' not in sys.argv)
    ctx = b.new_context(viewport={'width': 1366, 'height': 900}, device_scale_factor=2, locale='ar-EG')
    page = ctx.new_page()
    page.goto(BASE, wait_until='networkidle', timeout=90000)
    page.wait_for_timeout(2000)
    def shot(loc, name):
        try:
            loc.wait_for(state='visible', timeout=6000)
            loc.scroll_into_view_if_needed()
            page.wait_for_timeout(500)          # عشان الصورة جوه الكارت تحمّل
            loc.screenshot(path=str(OUT / f'{name}.png'))
            print('ok  ', name)
        except Exception as e:
            print('FAIL', name, '-', str(e).splitlines()[0])
    page.screenshot(path=str(OUT / 'portal.png')); print('ok   portal')
    shot(page.locator('.eto-module-lang').first, 'languages')
    for section, names in SECTIONS.items():
        page.evaluate("id => navigate(id)", section)
        page.wait_for_timeout(1200)
        for n in names.split():
            shot(card(page, section, n), n)
        if section == 'pdf-tools':
            shot(page.locator('#page-pdf-tools .tool-card', has_text='ضغط').first, 'compress')
    page.evaluate("id => navigate(id)", 'education'); page.wait_for_timeout(1200)
    shot(page.locator("#page-education [onclick*='courses']").first, 'subjects')
    page.evaluate("id => navigate(id)", 'islamic'); page.wait_for_timeout(2000)
    shot(page.locator('#page-islamic .rl-card').first, 'prayer-times')
    b.close()
print('\nخلصت. الصور في:', OUT)
print('الصورة اللي لازم تصوّرها بإيدك: bot.png (الروبوت)')
