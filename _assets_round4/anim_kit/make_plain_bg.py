"""Make startnew_bg_plain.webp: the same sunburst with the BAKED stars/sparkles/rings/dots removed.
The kit's recipe 1 requires this — its drifting sky layer on top of a background that already has
stars painted in gives you two sets, one frozen and one moving.
Method: the shapes are small and LIGHTER than their surroundings; the rays and gradient are
large-scale. So blur hard (the blur contains the rays but not the shapes), take everything
meaningfully lighter than the blur as the shape mask, dilate it, and paste the blur back there."""
from PIL import Image, ImageFilter, ImageChops
import os
SRC = r"D:\Dev_Kit\factories\FLN_Content_Factory\KG\HI02H11_L01_S01\assets\UI\startnew_bg.webp"
im = Image.open(SRC).convert("RGB")
W, H = im.size
print("source %dx%d" % (W, H))

blur = im.filter(ImageFilter.GaussianBlur(26))       # keeps rays + gradient, loses the shapes
# lighter-than-local-background, on the max channel so white shapes on blue are caught
diff = ImageChops.subtract(im.convert("L"), blur.convert("L"))
mask = diff.point(lambda v: 255 if v > 6 else 0)
px = mask.load()
on = sum(1 for y in range(0, H, 3) for x in range(0, W, 3) if px[x, y]) * 9
print("shape pixels detected: ~%d (%.2f%% of frame)" % (on, 100.0 * on / (W * H)))
mask = mask.filter(ImageFilter.MaxFilter(9))          # dilate so soft edges go too
mask = mask.filter(ImageFilter.GaussianBlur(3))       # feather the seam
out = Image.composite(blur, im, mask)
# a second, gentler pass catches the faint halos the first one feathered around
blur2 = out.filter(ImageFilter.GaussianBlur(18))
d2 = ImageChops.subtract(out.convert("L"), blur2.convert("L")).point(lambda v: 255 if v > 5 else 0)
d2 = d2.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(3))
out = Image.composite(blur2, out, d2)
DST = r"D:\Dev_Kit\factories\FLN_Content_Factory\KG\HI02H11_L01_S01\assets\UI\startnew_bg_plain.webp"
out.save(DST, "WEBP", quality=92, method=6)
print("wrote %s  %d KB (source %d KB)" % (os.path.basename(DST), os.path.getsize(DST)/1024, os.path.getsize(SRC)/1024))
# how much is left that reads as a shape?
b3 = out.filter(ImageFilter.GaussianBlur(26))
d3 = ImageChops.subtract(out.convert("L"), b3.convert("L")).point(lambda v: 255 if v > 6 else 0)
p3 = d3.load()
left = sum(1 for y in range(0, H, 3) for x in range(0, W, 3) if p3[x, y]) * 9
print("shape pixels remaining: ~%d (%.2f%%)  -> %.1f%% removed" % (left, 100.0*left/(W*H), 100.0*(1-left/max(on,1))))
out.resize((W//2, H//2)).save("plainbg_preview.png")
