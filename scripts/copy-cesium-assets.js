import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const src = path.join(rootDir, 'node_modules/cesium/Build/Cesium');
const dest = path.join(rootDir, 'dist/cesium');

// ディレクトリがなければ作成
if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
}

fs.cpSync(src, dest, { recursive: true });
