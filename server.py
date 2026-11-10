import http.server
import socketserver
import webbrowser
import os
import json

PORT = 8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/log':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                log_type = data.get('type', 'INFO')
                message = data.get('message', '')
                details = data.get('details', {})

                print("\n" + "="*50)
                if log_type == 'PLAYER_ERROR':
                    print(f"❌ [خطأ تشغيل الأغنية]: {message}")
                elif log_type == 'LYRICS_ERROR':
                    print(f"⚠️ [خطأ جلب الكلمات]: {message}")
                else:
                    print(f"ℹ️ [{log_type}]: {message}")

                if details:
                    print(f"📋 التفاصيل: {json.dumps(details, ensure_ascii=False, indent=2)}")
                print("="*50 + "\n")

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok"}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
        else:
            super().do_POST()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"✅ جاري تشغيل السيرفر المحلي (بدون كاش) على: http://localhost:{PORT}")
print("🛑 لإيقاف السيرفر، اقفل النافذة دي أو اضغط Ctrl+C")

webbrowser.open(f"http://localhost:{PORT}")

socketserver.TCPServer.allow_reuse_address = True

try:
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n👋 تم إيقاف السيرفر بنجاح.")