"""Local browser QA only. No third-party dependencies; excluded from deployment.

Visit /motion/escaperoom.html, /blocked/escaperoom.html, or /empty/escaperoom.html.
The server injects browser-API failures/preferences before the real app modules load.
It never edits production files or persistent browser settings.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        parts = path.strip('/').split('/', 1)
        fixture = parts[0] if parts[0] in {'motion', 'blocked', 'empty'} else ''
        relative = parts[1] if fixture and len(parts) > 1 else path.lstrip('/')
        file = (ROOT / (relative or 'index.html')).resolve()
        if not file.is_relative_to(ROOT) or not file.is_file():
            self.send_error(404)
            return
        data = file.read_bytes()
        if fixture == 'empty' and relative == 'scripts/challenges.js':
            data = b'export const builderChallenges = []; export const debugChallenges = [];'
        if fixture == 'empty' and relative == 'scripts/questions.js':
            data = b'export const questions = [];'
        if file.suffix == '.html':
            setup = ''
            if fixture == 'motion':
                setup = "const realMatchMedia = window.matchMedia.bind(window); window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true, onchange: null } : realMatchMedia(query);"
            if fixture == 'blocked':
                setup = "Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked for QA', 'SecurityError'); } });"
            data = data.replace(b'<head>', ('<head><script>'+setup+'</script>').encode(), 1)
        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(str(file)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    print('QA fixtures: http://127.0.0.1:4174', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4174), Handler).serve_forever()
