import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { defineConfig, type Plugin } from 'vite';
import { VOICE_PROMPTS } from './src/data/voicePrompts';

function readProjectVoices(inline = false) {
  const voices: Record<string, string> = {};
  for (const prompt of VOICE_PROMPTS) {
    const file = path.resolve(__dirname, 'public/voice', `${prompt.id}.mp3`);
    if (fs.existsSync(file)) {
      voices[prompt.id] = inline
        ? `data:audio/mpeg;base64,${fs.readFileSync(file).toString('base64')}`
        : `./voice/${prompt.id}.mp3`;
    }
  }
  return voices;
}

function mascotUploadPlugin(): Plugin {
  return {
    name: 'mascot-upload-plugin',
    async generateBundle() {
      const pubImagesDir = path.resolve(__dirname, 'public/images');
      const optimizeImage = async (file: string) => {
        const relativePath = path.relative(pubImagesDir, file);
        const originalUrl = `./images/${relativePath.split(path.sep).map(encodeURIComponent).join('/')}`;
        if (!/\.(png|jpe?g|webp)$/i.test(file)) return originalUrl;
        const input = await fs.promises.readFile(file);
        const optimized = await sharp(input)
          .rotate()
          .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
        if (optimized.length >= input.length) return originalUrl;
        const reference = this.emitFile({
          type: 'asset',
          name: `${path.basename(file, path.extname(file))}.webp`,
          source: optimized,
        });
        return `./${this.getFileName(reference)}`;
      };
      const readImageUrls = async (directory: string) => {
        if (!fs.existsSync(directory)) return {};

        const imageUrls: Record<string, string> = {};
        for (const fileName of fs.readdirSync(directory).sort()) {
          if (/\.(png|jpg|jpeg|webp|svg)$/i.test(fileName)) {
            const id = fileName.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
            imageUrls[id] = await optimizeImage(path.join(directory, fileName));
          }
        }
        return imageUrls;
      };

      const customCostumes = await readImageUrls(path.join(pubImagesDir, 'costumes'));
      const customTrashImages = await readImageUrls(path.join(pubImagesDir, 'trash'));
      const readImageUrlIfExists = async (fileName: string) => {
        const file = path.join(pubImagesDir, fileName);
        return fs.existsSync(file) ? optimizeImage(file) : null;
      };
      const preloadedAssets = {
        voiceClips: readProjectVoices(),
        customCostumes,
        customTrashImages,
        customMascotUrl:
          customCostumes['tim_rac_01'] ||
          customCostumes['k-v-2'] ||
          await readImageUrlIfExists('kien-sang-main.png'),
        customOrganicUrl: await readImageUrlIfExists('thung_rac_xanh.png'),
        customRecyclableUrl: await readImageUrlIfExists('thung_rac_cam.png'),
      };

      this.emitFile({
        type: 'asset',
        fileName: 'kien-sang-assets.json',
        source: JSON.stringify(preloadedAssets),
      });
    },
    configureServer(server: any) {
      server.middlewares.use('/api/upload-mascot', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed && parsed.dataUrl) {
                const base64Data = parsed.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const pubImagesDir = path.resolve(__dirname, 'public/images');
                fs.mkdirSync(pubImagesDir, { recursive: true });

                const targets = [
                  path.join(pubImagesDir, 'kien-sang-main.png'),
                  path.join(pubImagesDir, 'k-v-2-happy.png'),
                  path.join(pubImagesDir, 'k-v-2-sad.png'),
                  path.join(pubImagesDir, 'k-v-2-scratch-idle.png'),
                  path.join(pubImagesDir, 'k-v-2-scratch-vui.png'),
                  path.join(pubImagesDir, 'k-v-2-scratch-buon.png'),
                  path.resolve(__dirname, 'public/kien-sang-main.png'),
                ];

                for (const target of targets) {
                  fs.writeFileSync(target, buffer);
                }

                // If dist exists, copy over
                const distImagesDir = path.resolve(__dirname, 'dist/images');
                if (fs.existsSync(distImagesDir)) {
                  for (const target of targets) {
                    const filename = path.basename(target);
                    fs.writeFileSync(path.join(distImagesDir, filename), buffer);
                  }
                  fs.writeFileSync(path.resolve(__dirname, 'dist/kien-sang-main.png'), buffer);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, size: buffer.length }));
                return;
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
              return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing dataUrl' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/upload-bin', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed && parsed.dataUrl && parsed.binType) {
                const base64Data = parsed.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const pubImagesDir = path.resolve(__dirname, 'public/images');
                fs.mkdirSync(pubImagesDir, { recursive: true });

                const isOrganic = parsed.binType === 'organic';
                const targets = isOrganic
                  ? [
                      path.join(pubImagesDir, 'thung_rac_xanh.png'),
                      path.join(pubImagesDir, 'Thung_Rac_Xanh_Huu_Co.png'),
                    ]
                  : [
                      path.join(pubImagesDir, 'thung_rac_cam.png'),
                      path.join(pubImagesDir, 'Thung_Rac_Cam_Tai_Che.png'),
                    ];

                for (const target of targets) {
                  fs.writeFileSync(target, buffer);
                }

                // If dist exists, copy over
                const distImagesDir = path.resolve(__dirname, 'dist/images');
                if (fs.existsSync(distImagesDir)) {
                  for (const target of targets) {
                    const filename = path.basename(target);
                    fs.writeFileSync(path.join(distImagesDir, filename), buffer);
                  }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, size: buffer.length }));
                return;
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
              return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing dataUrl or binType' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/upload-trash-item', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed && parsed.dataUrl && parsed.itemId) {
                const base64Data = parsed.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const trashDir = path.resolve(__dirname, 'public/images/trash');
                fs.mkdirSync(trashDir, { recursive: true });

                const safeId = parsed.itemId.replace(/[^a-zA-Z0-9_-]/g, '');
                const target = path.join(trashDir, `${safeId}.png`);
                fs.writeFileSync(target, buffer);

                // If dist exists, copy over
                const distTrashDir = path.resolve(__dirname, 'dist/images/trash');
                if (fs.existsSync(distTrashDir)) {
                  fs.writeFileSync(path.join(distTrashDir, `${safeId}.png`), buffer);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, size: buffer.length }));
                return;
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
              return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing dataUrl or itemId' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      server.middlewares.use('/api/upload-costume', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed && parsed.dataUrl && parsed.costumeId) {
                const base64Data = parsed.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const costumesDir = path.resolve(__dirname, 'public/images/costumes');
                fs.mkdirSync(costumesDir, { recursive: true });

                const safeId = parsed.costumeId.replace(/[^a-zA-Z0-9_-]/g, '');
                const target = path.join(costumesDir, `${safeId}.png`);
                fs.writeFileSync(target, buffer);

                // If k-v-2, sync with root public/images/kien-sang-main.png for backwards compat
                if (safeId === 'k-v-2') {
                  const pubImagesDir = path.resolve(__dirname, 'public/images');
                  fs.writeFileSync(path.join(pubImagesDir, 'kien-sang-main.png'), buffer);
                  fs.writeFileSync(path.join(pubImagesDir, 'k-v-2-happy.png'), buffer);
                }

                // If dist exists, copy over
                const distCostumesDir = path.resolve(__dirname, 'dist/images/costumes');
                if (fs.existsSync(distCostumesDir)) {
                  fs.writeFileSync(path.join(distCostumesDir, `${safeId}.png`), buffer);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, size: buffer.length }));
                return;
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
              return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing dataUrl or costumeId' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      const readDiskPreloadedAssets = () => {
        const customCostumes: Record<string, string> = {};
        const customTrashImages: Record<string, string> = {};

        const costumesDir = path.resolve(__dirname, 'public/images/costumes');
        if (fs.existsSync(costumesDir)) {
          const files = fs.readdirSync(costumesDir);
          for (const f of files) {
            if (/\.(png|jpg|jpeg|webp|svg)$/i.test(f)) {
              const id = f.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
              const buf = fs.readFileSync(path.join(costumesDir, f));
              const ext = path.extname(f).toLowerCase().replace('.', '');
              const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
              customCostumes[id] = `data:${mime};base64,${buf.toString('base64')}`;
            }
          }
        }

        const trashDir = path.resolve(__dirname, 'public/images/trash');
        if (fs.existsSync(trashDir)) {
          const files = fs.readdirSync(trashDir);
          for (const f of files) {
            if (/\.(png|jpg|jpeg|webp|svg)$/i.test(f)) {
              const id = f.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
              const buf = fs.readFileSync(path.join(trashDir, f));
              const ext = path.extname(f).toLowerCase().replace('.', '');
              const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
              customTrashImages[id] = `data:${mime};base64,${buf.toString('base64')}`;
            }
          }
        }

        const pubImagesDir = path.resolve(__dirname, 'public/images');
        const readDataUrlIfExists = (filename: string): string | null => {
          const p = path.join(pubImagesDir, filename);
          if (fs.existsSync(p)) {
            return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
          }
          return null;
        };

        const customMascotUrl =
          customCostumes['tim_rac_01'] ||
          customCostumes['k-v-2'] ||
          readDataUrlIfExists('kien-sang-main.png');

        const customOrganicUrl = readDataUrlIfExists('thung_rac_xanh.png');
        const customRecyclableUrl = readDataUrlIfExists('thung_rac_cam.png');

        return {
          voiceClips: readProjectVoices(true),
          customCostumes,
          customTrashImages,
          customMascotUrl,
          customOrganicUrl,
          customRecyclableUrl,
        };
      };

      server.middlewares.use('/api/preloaded-assets', (_req: any, res: any) => {
        try {
          const assets = readDiskPreloadedAssets();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(assets));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: String(err) }));
        }
      });

      server.middlewares.use('/api/download-offline-html', (_req: any, res: any) => {
        const offlinePath = path.resolve(__dirname, 'public/Robot_Kien_Sang_Offline.html');
        if (!fs.existsSync(offlinePath)) {
          try {
            const { execSync } = require('child_process');
            execSync('node scripts/generate_offline_html.cjs', { stdio: 'ignore' });
          } catch (e) {
            console.error('Failed to generate offline HTML:', e);
          }
        }

        if (fs.existsSync(offlinePath)) {
          let htmlContent = fs.readFileSync(offlinePath, 'utf8');
          try {
            const diskAssets = readDiskPreloadedAssets();
            const safeJson = JSON.stringify(diskAssets).replace(/<\/script/gi, '<\\/script');
            const scriptTag = `\n    <script id="kien-sang-disk-preloaded-state">\n      window.__KIEN_SANG_PRELOADED_STATE__ = Object.assign({}, window.__KIEN_SANG_PRELOADED_STATE__ || {}, ${safeJson});\n    </script>\n`;
            if (htmlContent.includes('</head>')) {
              htmlContent = htmlContent.replace('</head>', `${scriptTag}</head>`);
            }
          } catch (err) {
            console.warn('Error injecting disk assets into offline HTML:', err);
          }

          const contentBuf = Buffer.from(htmlContent, 'utf8');
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': 'attachment; filename="Robot_Kien_Sang_Offline.html"',
            'Content-Length': contentBuf.length,
          });
          res.end(contentBuf);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Offline HTML file not found');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    build: {
      rollupOptions: {
        input: {
          game: path.resolve(__dirname, 'index.html'),
          editor: path.resolve(__dirname, 'editor.html'),
        },
      },
    },
    plugins: [react(), tailwindcss(), mascotUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
