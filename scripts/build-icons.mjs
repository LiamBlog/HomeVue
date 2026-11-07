#!/usr/bin/env node
/**
 * 从源码中提取实际使用的 Font Awesome 图标，生成内联 SVG mask 样式。
 *
 * 用法：npm run icons:build
 * 输入：node_modules/@fortawesome/fontawesome-free/svgs（开发依赖）
 * 输出：src/styles/icons.less
 *
 * 与图标字体的区别：不加载任何字体文件，图标以 CSS mask + 内联 SVG 绘制，
 * 颜色跟随 currentColor，体积从数百 KB 降至十几 KB。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FA_SVG_DIR = path.join(ROOT, 'node_modules', '@fortawesome', 'fontawesome-free', 'svgs');
const OUTPUT = path.join(ROOT, 'src', 'styles', 'icons.less');
const SCAN_TARGETS = [path.join(ROOT, 'src'), path.join(ROOT, 'index.html')];
const TEXT_SUFFIXES = new Set(['.vue', '.js', '.json', '.less', '.html', '.md']);
const STYLE_DIRS = ['solid', 'brands', 'regular'];

function* walk(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (TEXT_SUFFIXES.has(path.extname(target)) && target !== OUTPUT) yield target;
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    yield* walk(path.join(target, entry.name));
  }
}

function collectIconNames() {
  const names = new Set();
  for (const file of SCAN_TARGETS.flatMap((target) => [...walk(target)])) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(/\bfa-([a-z0-9-]+)\b/g)) {
      names.add(match[1]);
    }
  }
  return [...names].sort();
}

function resolveSvg(name) {
  for (const style of STYLE_DIRS) {
    const candidate = path.join(FA_SVG_DIR, style, `${name}.svg`);
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, 'utf8').trim();
  }
  return null;
}

function toDataUri(svg) {
  // mask 只关心 alpha 通道，可去掉注释与固定填充色以减小体积
  const compact = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\sfill="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return `url("data:image/svg+xml,${encodeURIComponent(compact)}")`;
}

function main() {
  if (!fs.existsSync(FA_SVG_DIR)) {
    console.error('找不到 Font Awesome SVG 源，请先执行 npm install');
    process.exit(1);
  }

  const names = collectIconNames();
  const rules = [];
  const missing = [];

  for (const name of names) {
    const svg = resolveSvg(name);
    if (!svg) {
      missing.push(name);
      continue;
    }
    const uri = toDataUri(svg);
    rules.push(`.fa-${name} {\n  --fa-icon: ${uri};\n}\n`);
  }

  if (missing.length) {
    console.warn(`未找到以下图标的 SVG，已跳过：${missing.join(', ')}`);
  }

  const header = [
    '// 由 scripts/build-icons.mjs 自动生成，请勿手动编辑。',
    '// 图标来源：Font Awesome Free（CC BY 4.0 / SIL OFL 1.1 / MIT）。',
    '',
    '.fa,',
    '.fas,',
    '.far,',
    '.fab,',
    '.fa-solid,',
    '.fa-regular,',
    '.fa-brands {',
    '  display: inline-block;',
    '  width: 1em;',
    '  height: 1em;',
    '  vertical-align: -0.125em;',
    '  background-color: currentColor;',
    '  -webkit-mask-image: var(--fa-icon);',
    '  mask-image: var(--fa-icon);',
    '  -webkit-mask-repeat: no-repeat;',
    '  mask-repeat: no-repeat;',
    '  -webkit-mask-position: center;',
    '  mask-position: center;',
    '  -webkit-mask-size: contain;',
    '  mask-size: contain;',
    '}',
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, header + rules.join('\n'), 'utf8');

  const size = fs.statSync(OUTPUT).size;
  console.log(`图标数量：${names.length - missing.length}`);
  console.log(`输出：${path.relative(ROOT, OUTPUT)}（${(size / 1024).toFixed(1)} KB）`);
}

main();
