"""
Generate all CineVerse app icon assets for Android and iOS.
"""
import os
import json
from PIL import Image, ImageDraw, ImageFilter

MASTER_PATH = r"C:\Users\User\.gemini\antigravity-ide\brain\ebe6df29-2cdc-4e1b-b0d6-5e3d159288d0\cineverse_app_icon_1791996605326.jpg"
ANDROID_RES = r"d:\Bengalore\Assignment\Task9\CineVerse\android\app\src\main\res"
IOS_APPICON = r"d:\Bengalore\Assignment\Task9\CineVerse\ios\CineVerse\Images.xcassets\AppIcon.appiconset"

def make_round(image):
    """Create a circular masked version of image with smooth anti-aliased edge."""
    size = image.size
    # Create mask at 4x resolution for super-sampled anti-aliasing
    scale = 4
    mask = Image.new('L', (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0] * scale - 1, size[1] * scale - 1), fill=255)
    mask = mask.resize(size, Image.Resampling.LANCZOS)
    
    # Apply to image with alpha
    output = image.convert('RGBA')
    output.putalpha(mask)
    return output

def make_foreground(master_img, target_size):
    """
    Generate adaptive icon foreground with safe zone.
    Total canvas is target_size x target_size (e.g. 432x432).
    Inner safe zone is ~66% of the canvas in the center.
    """
    canvas = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
    # Safe zone size ~ 72/108 = 66.6%
    inner_size = int(target_size * 0.72)
    inner_img = master_img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
    
    # Center inner_img on canvas
    offset = (target_size - inner_size) // 2
    canvas.paste(inner_img, (offset, offset))
    return canvas

def make_background(target_size):
    """Solid/gradient dark background for adaptive icon."""
    # Dark cinematic background (#0D0E15)
    return Image.new('RGBA', (target_size, target_size), (13, 14, 21, 255))

def main():
    print("Opening master icon:", MASTER_PATH)
    master = Image.open(MASTER_PATH).convert('RGBA')
    
    # ─── 1. Android Mipmaps ───────────────────────────────────────────────────────
    # Standard icon sizes
    densities = {
        'mipmap-mdpi': (48, 108),
        'mipmap-hdpi': (72, 162),
        'mipmap-xhdpi': (96, 216),
        'mipmap-xxhdpi': (144, 324),
        'mipmap-xxxhdpi': (192, 432),
    }
    
    for density, (legacy_size, adaptive_size) in densities.items():
        dir_path = os.path.join(ANDROID_RES, density)
        os.makedirs(dir_path, exist_ok=True)
        
        # Legacy square / squircle icon
        legacy_icon = master.resize((legacy_size, legacy_size), Image.Resampling.LANCZOS)
        legacy_icon.save(os.path.join(dir_path, "ic_launcher.png"), "PNG", optimize=True)
        
        # Legacy round icon
        round_icon = make_round(legacy_icon)
        round_icon.save(os.path.join(dir_path, "ic_launcher_round.png"), "PNG", optimize=True)
        
        # Adaptive icon foreground
        foreground = make_foreground(master, adaptive_size)
        foreground.save(os.path.join(dir_path, "ic_launcher_foreground.png"), "PNG", optimize=True)
        
        # Adaptive icon background
        background = make_background(adaptive_size)
        background.save(os.path.join(dir_path, "ic_launcher_background.png"), "PNG", optimize=True)
        
        print(f"Generated {density}: legacy {legacy_size}x{legacy_size}, adaptive {adaptive_size}x{adaptive_size}")
    
    # ─── 2. Android Adaptive Icon XML (API 26+) ──────────────────────────────────
    anydpi_dir = os.path.join(ANDROID_RES, "mipmap-anydpi-v26")
    os.makedirs(anydpi_dir, exist_ok=True)
    
    adaptive_xml = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"""
    with open(os.path.join(anydpi_dir, "ic_launcher.xml"), "w", encoding="utf-8") as f:
        f.write(adaptive_xml)
        
    with open(os.path.join(anydpi_dir, "ic_launcher_round.xml"), "w", encoding="utf-8") as f:
        f.write(adaptive_xml)
        
    print("Generated mipmap-anydpi-v26 XML files.")
    
    # ─── 3. Store Web Asset ───────────────────────────────────────────────────────
    web_icon = master.resize((512, 512), Image.Resampling.LANCZOS)
    drawable_dir = os.path.join(ANDROID_RES, "drawable")
    os.makedirs(drawable_dir, exist_ok=True)
    web_icon.save(os.path.join(drawable_dir, "ic_launcher_web.png"), "PNG", optimize=True)
    print("Generated 512x512 store icon in drawable/ic_launcher_web.png")
    
    # ─── 4. iOS AppIcon.appiconset ────────────────────────────────────────────────
    os.makedirs(IOS_APPICON, exist_ok=True)
    
    ios_sizes = [
        ("icon-20@2x.png", 40, "iphone", "2x", "20x20"),
        ("icon-20@3x.png", 60, "iphone", "3x", "20x20"),
        ("icon-29@2x.png", 58, "iphone", "2x", "29x29"),
        ("icon-29@3x.png", 87, "iphone", "3x", "29x29"),
        ("icon-40@2x.png", 80, "iphone", "2x", "40x40"),
        ("icon-40@3x.png", 120, "iphone", "3x", "40x40"),
        ("icon-60@2x.png", 120, "iphone", "2x", "60x60"),
        ("icon-60@3x.png", 180, "iphone", "3x", "60x60"),
        ("icon-1024.png", 1024, "ios-marketing", "1x", "1024x1024"),
    ]
    
    contents_images = []
    for filename, px, idiom, scale, size in ios_sizes:
        ios_img = master.resize((px, px), Image.Resampling.LANCZOS)
        ios_img.save(os.path.join(IOS_APPICON, filename), "PNG", optimize=True)
        contents_images.append({
            "filename": filename,
            "idiom": idiom,
            "scale": scale,
            "size": size
        })
        print(f"Generated iOS icon: {filename} ({px}x{px})")
        
    contents_json = {
        "images": contents_images,
        "info": {
            "author": "xcode",
            "version": 1
        }
    }
    with open(os.path.join(IOS_APPICON, "Contents.json"), "w", encoding="utf-8") as f:
        json.dump(contents_json, f, indent=2)
        
    print("Updated iOS Contents.json successfully.")
    print("\nAll CineVerse icon assets generated successfully!")

if __name__ == '__main__':
    main()
