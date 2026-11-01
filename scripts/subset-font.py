#!/usr/bin/env python3
"""按源码实际用到的字符生成 YSHST 字体子集。

用法：
    npm run font:subset

输入：scripts/fonts/YSHST.source.woff2（完整字体）
输出：public/fonts/YSHST.woff2（子集字体）

依赖：pip install fonttools brotli
"""

from pathlib import Path
import sys

try:
    from fontTools import subset
except ImportError:
    sys.exit('缺少 fonttools，请先执行：pip install fonttools brotli')

try:
    import brotli  # noqa: F401  woff2 编码需要
except ImportError:
    sys.exit('缺少 brotli，请先执行：pip install fonttools brotli')

ROOT = Path(__file__).resolve().parent.parent
SOURCE_FONT = ROOT / 'scripts' / 'fonts' / 'YSHST.source.woff2'
OUTPUT_FONT = ROOT / 'public' / 'fonts' / 'YSHST.woff2'

TEXT_SUFFIXES = {'.vue', '.js', '.json', '.less', '.html', '.md'}
SCAN_PATHS = (ROOT / 'src', ROOT / 'index.html', ROOT / 'README.md')

# 运行时才会渲染、但源码中不一定出现的字符
DYNAMIC_CHARS = '年月日星期一二三四五六七八九十零〇上午下午时分秒'
PUNCTUATION = '　、。〃々〈〉《》「」『』【】〔〕・ー—–－…“”‘’·©®°±×÷≈≤≥→←↑↓✓✔✕✖★☆'
ASCII = ''.join(chr(code) for code in range(0x20, 0x7F))


def iter_text_files():
    for path in SCAN_PATHS:
        if path.is_file():
            yield path
            continue
        for file in path.rglob('*'):
            if file.is_file() and file.suffix in TEXT_SUFFIXES:
                yield file


def collect_characters():
    chars = set(ASCII) | set(DYNAMIC_CHARS) | set(PUNCTUATION)
    for file in iter_text_files():
        chars |= set(file.read_text(encoding='utf-8', errors='ignore'))
    chars.discard('\n')
    chars.discard('\r')
    return chars


def main():
    if not SOURCE_FONT.exists():
        sys.exit(f'找不到完整字体：{SOURCE_FONT}')

    chars = collect_characters()
    text = ''.join(sorted(chars))

    options = subset.Options()
    options.layout_features = ['*']
    options.hinting = False
    options.desubroutinize = True
    options.flavor = 'woff2'

    font = subset.load_font(str(SOURCE_FONT), options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)

    OUTPUT_FONT.parent.mkdir(parents=True, exist_ok=True)
    subset.save_font(font, str(OUTPUT_FONT), options)

    before = SOURCE_FONT.stat().st_size
    after = OUTPUT_FONT.stat().st_size
    print(f'字符数：{len(chars)}')
    print(f'字体体积：{before / 1024:.1f} KB -> {after / 1024:.1f} KB '
          f'（{(1 - after / before) * 100:.0f}% 缩减）')
    print(f'输出：{OUTPUT_FONT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
