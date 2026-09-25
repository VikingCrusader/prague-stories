import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execFile } from 'child_process';
import path from 'path';

// Covers dropped into public/pixel-art/ while the dev server is running get
// their card thumbnail (and manifest entry) right away, and images dropped into
// public/history/ get their size recorded, instead of waiting for the next
// `npm run dev`/`npm run build`, which both run these scripts up front.
function regenerateAssetsOnChange() {
  const watched = [
    { dir: path.resolve('public/pixel-art'), script: 'scripts/generateCoverManifest.mjs' },
    { dir: path.resolve('public/history'), script: 'scripts/generateHistoryImageSizes.mjs' },
  ];
  const timers = new Map();
  const run = script => {
    execFile(process.execPath, [script], (err, stdout, stderr) => {
      if (err) console.error('[assets]', stderr || err.message);
      else console.log('[assets]', stdout.trim().replace(/\n/g, ' | '));
    });
  };
  const onChange = file => {
    if (!/\.(webp|jpe?g|png)$/i.test(file)) return;
    const target = watched.find(w => path.dirname(path.resolve(file)) === w.dir);
    if (!target) return;
    clearTimeout(timers.get(target.script));
    timers.set(target.script, setTimeout(() => run(target.script), 500));
  };
  return {
    name: 'regenerate-assets-on-change',
    apply: 'serve',
    configureServer(server) {
      for (const { dir } of watched) server.watcher.add(dir);
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}

export default defineConfig({
  plugins: [react(), regenerateAssetsOnChange()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
