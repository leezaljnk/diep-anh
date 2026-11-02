const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateOfflineHtml() {
  const outPubPath = path.resolve(__dirname, '../public/Robot_Kien_Sang_Offline.html');
  const outDistPath = path.resolve(__dirname, '../dist/Robot_Kien_Sang_Offline.html');

  // Remove old offline HTML before building so Vite build is fast & clean
  if (fs.existsSync(outPubPath)) {
    try {
      fs.unlinkSync(outPubPath);
    } catch {}
  }

  console.log('Building Vite project to get latest assets...');
  execSync('npm run build', { stdio: 'inherit' });

  const distDir = path.resolve(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('dist/index.html not found!');
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Inline CSS files
  const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  html = html.replace(cssRegex, (match, href) => {
    const cleanHref = href.startsWith('/') ? href.slice(1) : href;
    const cssPath = path.join(distDir, cleanHref);
    if (fs.existsSync(cssPath)) {
      console.log(`Inlining CSS: ${cleanHref}`);
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      return `<style>\n${cssContent}\n</style>`;
    }
    return match;
  });

  // 2. Collect all custom costumes & trash images from public/images
  const pubImagesDir = path.resolve(__dirname, '../public/images');
  const customCostumes = {};
  const customTrashImages = {};

  const costumesDir = path.join(pubImagesDir, 'costumes');
  if (fs.existsSync(costumesDir)) {
    for (const f of fs.readdirSync(costumesDir)) {
      if (/\.(png|jpg|jpeg|webp|svg)$/i.test(f)) {
        const id = f.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
        const buf = fs.readFileSync(path.join(costumesDir, f));
        const ext = path.extname(f).toLowerCase().replace('.', '');
        const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        customCostumes[id] = `data:${mime};base64,${buf.toString('base64')}`;
      }
    }
  }

  const trashDir = path.join(pubImagesDir, 'trash');
  if (fs.existsSync(trashDir)) {
    for (const f of fs.readdirSync(trashDir)) {
      if (/\.(png|jpg|jpeg|webp|svg)$/i.test(f)) {
        const id = f.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
        const buf = fs.readFileSync(path.join(trashDir, f));
        const ext = path.extname(f).toLowerCase().replace('.', '');
        const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        customTrashImages[id] = `data:${mime};base64,${buf.toString('base64')}`;
      }
    }
  }

  const readDataUrlIfExists = (filename) => {
    const p = path.join(pubImagesDir, filename);
    if (fs.existsSync(p)) {
      return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
    }
    return null;
  };

  const preloadedState = {
    voiceClips: Object.fromEntries(
      fs.existsSync(path.resolve(__dirname, '../public/voice'))
        ? fs.readdirSync(path.resolve(__dirname, '../public/voice'))
          .filter(f => f.endsWith('.mp3'))
          .map(f => [path.basename(f, '.mp3'), `data:audio/mpeg;base64,${fs.readFileSync(path.resolve(__dirname, '../public/voice', f)).toString('base64')}`])
        : []
    ),
    customCostumes,
    customTrashImages,
    customMascotUrl:
      customCostumes['tim_rac_01'] ||
      customCostumes['k-v-2'] ||
      readDataUrlIfExists('kien-sang-main.png'),
    customOrganicUrl: readDataUrlIfExists('thung_rac_xanh.png'),
    customRecyclableUrl: readDataUrlIfExists('thung_rac_cam.png'),
    sortingGameAssets: Object.fromEntries(
      ['rac-chinh', 'gay_nhieu'].flatMap(folder => {
        const directory = path.join(pubImagesDir, 'thu-tai-phan-loai', folder);
        return fs.existsSync(directory)
          ? fs.readdirSync(directory)
            .filter(file => file.endsWith('.svg'))
            .map(file => [
              `thu-tai-phan-loai/${folder}/${file}`,
              `data:image/svg+xml;base64,${fs.readFileSync(path.join(directory, file)).toString('base64')}`,
            ])
          : [];
      })
    ),
  };

  // 3. Inline JavaScript module
  const scriptRegex = /<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["'][^>]*><\/script>/gi;
  html = html.replace(scriptRegex, (match, src) => {
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    const jsPath = path.join(distDir, cleanSrc);
    if (fs.existsSync(jsPath)) {
      console.log(`Inlining JS: ${cleanSrc}`);
      let jsContent = fs.readFileSync(jsPath, 'utf8');

      // Base64 inline essential images so file:// protocol works 100% offline
      const imageFiles = [
        'kien-sang-main.png',
        'k-v-2-happy.png',
        'k-v-2-sad.png',
        'thung_rac_xanh.png',
        'thung_rac_cam.png',
        'Thung_Rac_Xanh_Huu_Co.png',
        'Thung_Rac_Cam_Tai_Che.png',
        'tai-su-dung/giay_cu_taisudung.png',
        'tai-su-dung/ong_nhua_taisudung.png',
        'tai-su-dung/vo_chai_nhua_taisudung.png',
        'tai-su-dung/vo_chai_taisudung.png',
        'tai-su-dung/vo_hop_giay_taisudung.png',
        'tai-su-dung/vo_hop_sua_taisudung.png',
        'tai-su-dung/vo_lon_taisudung.png',
      ];

      for (const imgFile of imageFiles) {
        const fullImgPath = path.join(pubImagesDir, imgFile);
        if (fs.existsSync(fullImgPath)) {
          const b64 = fs.readFileSync(fullImgPath).toString('base64');
          const dataUrl = `data:image/png;base64,${b64}`;
          const relativeSearchPath = `./images/${imgFile}`;
          const searchPath1 = `/images/${imgFile}`;
          const searchPath2 = `images/${imgFile}`;
          jsContent = jsContent.split(relativeSearchPath).join(dataUrl);
          jsContent = jsContent.split(searchPath1).join(dataUrl);
          jsContent = jsContent.split(searchPath2).join(dataUrl);
        }
      }

      return `<script type="module">\n${jsContent.replace(/<\/script/gi, '<\\/script')}\n</script>`;
    }
    return match;
  });

  const safeJson = JSON.stringify(preloadedState).replace(/<\/script/gi, '<\\/script');

  // Add offline metadata and preloaded state
  html = html.replace(
    '<head>',
    `<head>\n    <!-- Standalone Offline Edition - Chơi Không Cần Mạng Internet -->\n    <meta name="offline-ready" content="true">\n    <script id="kien-sang-preloaded-state">\n      window.__KIEN_SANG_PRELOADED_STATE__ = ${safeJson};\n    </script>`
  );

  fs.writeFileSync(outPubPath, html, 'utf8');
  fs.writeFileSync(outDistPath, html, 'utf8');

  const stat = fs.statSync(outPubPath);
  console.log(`✅ Successfully generated standalone offline HTML file!`);
  console.log(`👕 Embedded costumes: ${Object.keys(customCostumes).length}`);
  console.log(`🗑️ Embedded trash images: ${Object.keys(customTrashImages).length}`);
  console.log(`📁 File path: ${outPubPath}`);
  console.log(`📦 File size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

generateOfflineHtml();
