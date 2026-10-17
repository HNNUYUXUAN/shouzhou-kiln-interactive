"""为文物导航生成 WebP 缩略图，并保留透明通道。

源图选择与前端 ArtifactRail 的展示优先级一致：
processed（数字资产图）优先，缺失时用档案原图。
缩略图最长边 320px（底栏卡片宽 136px 的 ~2.3x，覆盖高 DPI 屏）。
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CERAMICS = os.path.join(ROOT, "public", "assets", "ceramics")
PROCESSED = os.path.join(CERAMICS, "processed")
THUMBS = os.path.join(CERAMICS, "thumbs")
os.makedirs(THUMBS, exist_ok=True)

MAX_EDGE = 320
generated = []

for name in sorted(os.listdir(CERAMICS)):
    if not name.endswith(".png"):
        continue
    src = os.path.join(PROCESSED, name)
    if not os.path.exists(src):
        src = os.path.join(CERAMICS, name)
    out = os.path.join(THUMBS, os.path.splitext(name)[0] + ".webp")
    with Image.open(src) as im:
        im = im.convert("RGBA")
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        im.save(out, "WEBP", quality=82, method=4)
    generated.append((name, os.path.getsize(out)))

total_kb = sum(s for _, s in generated) / 1024
print(f"generated {len(generated)} thumbnails, total {total_kb:.0f} KB")
for name, size in generated[:3] + generated[-2:]:
    print(f"  {os.path.splitext(name)[0]}.webp  {size/1024:.1f} KB")
