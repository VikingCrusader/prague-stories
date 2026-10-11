"""Build the two small web fonts behind the Simplified-Chinese Explore title.

  python client/scripts/subsetTitleFonts.py

- public/fonts/zhuque-title.woff2: 朱雀仿宋 (Zhuque Fangsong v0.212, OFL), cut
  down to the characters the Chinese title can show, in Simplified and in
  Traditional (converted with opencc-js, as the app does): the zh title
  strings in LanguageContext.jsx, "布拉格{n}区", and the zh quarter names in
  utils/pragueQuarters.js. Rerun after changing any of those.
- public/fonts/title-digits.woff2: just 0-9 from Manufacturing Consent (OFL),
  the navbar wordmark's blackletter, used for the district numbers.

Both licences allow subsetting; OFL.txt in public/fonts/ covers them.
Needs fontTools and brotli (pip install fonttools brotli) and node (for
opencc-js from client/node_modules). The source fonts are downloaded into a
temp folder on first run.
"""
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
import zipfile

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'fonts')
SOURCES = {
    # Official release; earlier preview versions lack most Traditional forms.
    'zhuque.ttf': 'https://github.com/TrionesType/zhuque/releases/download/v0.212/ZhuqueFangsong-v0.212.zip',
    'mc.ttf': 'https://github.com/google/fonts/raw/main/ofl/manufacturingconsent/ManufacturingConsent-Regular.ttf',
}


def source(name):
    path = os.path.join(tempfile.gettempdir(), 'prague-stories-fonts', name)
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print('downloading', name)
        data = urllib.request.urlopen(SOURCES[name]).read()
        if SOURCES[name].endswith('.zip'):
            z = zipfile.ZipFile(io.BytesIO(data))
            data = z.read(next(n for n in z.namelist() if n.endswith('.ttf')))
        with open(path, 'wb') as f:
            f.write(data)
    return path


def title_chars():
    lang = open(os.path.join(ROOT, 'src', 'context', 'LanguageContext.jsx'), encoding='utf-8').read()
    zh = lang[lang.index('  zh: {'):]
    zh = zh[:zh.index('\n  },')]
    text = ''
    for key in ('explore.title', 'explore.titleCity', 'explore.titleGuest', 'detail.district'):
        m = re.search(r"'%s': '([^']*)'" % re.escape(key), zh)
        if not m:
            sys.exit('missing zh string ' + key)
        text += m.group(1).replace('{n}', '')
    quarters = open(os.path.join(ROOT, 'src', 'utils', 'pragueQuarters.js'), encoding='utf-8').read()
    text += ''.join(re.findall(r"zh: '([^']*)'", quarters))
    # Traditional, converted the same way LanguageContext's useConvert does.
    js = ("const OpenCC = require('opencc-js');"
          "const c = OpenCC.Converter({ from: 'cn', to: 'tw' });"
          "process.stdout.write(JSON.stringify(c(JSON.parse(process.argv[1]))));")
    tw = json.loads(subprocess.run(['node', '-e', js, json.dumps(text)], cwd=ROOT,
                                   capture_output=True, text=True, encoding='utf-8', check=True).stdout)
    return ''.join(sorted(set(text + tw) - set(' ')))


def build(src, out, text):
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    font = subset.load_font(src, opts)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    subset.save_font(font, out, opts)
    print(out, os.path.getsize(out), 'bytes,', len(text), 'chars')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build(source('zhuque.ttf'), os.path.join(OUT, 'zhuque-title.woff2'), title_chars())
    build(source('mc.ttf'), os.path.join(OUT, 'title-digits.woff2'), '0123456789')
