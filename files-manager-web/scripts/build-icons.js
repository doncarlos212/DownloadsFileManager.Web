// Requiere: npm i -D sharp
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const srcSvg = path.join(ROOT, 'public', 'favicon.svg');

const out = {
  fav16: path.join(ROOT, 'public', 'favicon-16.png'),
  fav32: path.join(ROOT, 'public', 'favicon-32.png'),
  i192: path.join(ROOT, 'public', 'logo192.png'),
  i512: path.join(ROOT, 'public', 'logo512.png'),
  mask512: path.join(ROOT, 'public', 'icons', 'maskable-512.png'),
};

(async () => {
  await fs.promises.mkdir(path.dirname(out.mask512), { recursive: true });

  await sharp(srcSvg).resize(16, 16).png().toFile(out.fav16);
  await sharp(srcSvg).resize(32, 32).png().toFile(out.fav32);
  await sharp(srcSvg).resize(192, 192).png().toFile(out.i192);
  await sharp(srcSvg).resize(512, 512).png().toFile(out.i512);
  await sharp(srcSvg).resize(512, 512).png({ compressionLevel: 9 }).toFile(out.mask512);

  console.log('Icons generated:', out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});