import os
from PIL import Image, ImageChops

def prepare_product_images():
    src_dir = os.path.join("packages", "web", "public", "images", "products")
    target_dir = os.path.join("packages", "web", "public", "products")
    os.makedirs(target_dir, exist_ok=True)

    mapping = {
        "excel-mpk.png": "excel-mpk.jpg",
        "genius-cr.png": "GENIUS-CR.jpg",
        "genius-ps.png": "GENUIN-PS.png",
        "ouro-ps.png": "GENUIN-PS.png",
        "signature-stem.png": "SignatureCementlessPorousTitaniumHipStem.png",
        "signature-duo.png": "Signature-Duo-Cup-1.png",
        "signature-nx.png": "Signature-NX-cup-with-ceramic-head.png",
        "dj-stent.png": "DJ-Stent-Short-Term.jpg",
        "indoscope-sleek.png": "Indoscope-Sleek.png",
    }

    CANVAS_SIZE = (800, 800)
    # Give uniform padding so products look balanced and prominent
    MAX_BOX = (680, 680)

    for target_name, src_name in mapping.items():
        src_path = os.path.join(src_dir, src_name)
        with Image.open(src_path) as raw_img:
            img = raw_img.convert("RGBA")
            
            # Find content bbox
            alpha = img.split()[-1]
            bbox = alpha.getbbox()
            
            # If no transparency (e.g. from JPEG), detect content difference from white background
            if not bbox or alpha.getextrema() == (255, 255):
                rgb = raw_img.convert("RGB")
                bg = Image.new("RGB", rgb.size, (255, 255, 255))
                diff = ImageChops.difference(rgb, bg)
                gray = diff.convert("L")
                thresholded = gray.point(lambda p: 255 if p > 18 else 0)
                diff_bbox = thresholded.getbbox()
                if diff_bbox:
                    bbox = diff_bbox
            
            if bbox:
                # Add small 8px safety margin to crop
                w_orig, h_orig = img.size
                x1 = max(0, bbox[0] - 8)
                y1 = max(0, bbox[1] - 8)
                x2 = min(w_orig, bbox[2] + 8)
                y2 = min(h_orig, bbox[3] + 8)
                cropped = img.crop((x1, y1, x2, y2))
            else:
                cropped = img

            # For ouro-ps, let's slightly rotate or mirror so it has a distinct angle
            if target_name == "ouro-ps.png":
                cropped = cropped.transpose(Image.FLIP_LEFT_RIGHT)

            # Proportional scale
            cropped.thumbnail(MAX_BOX, Image.Resampling.LANCZOS)

            # Create clean white 800x800 square canvas (seamless on white cards)
            canvas = Image.new("RGBA", CANVAS_SIZE, (255, 255, 255, 255))

            # Center on canvas
            offset_x = (CANVAS_SIZE[0] - cropped.size[0]) // 2
            offset_y = (CANVAS_SIZE[1] - cropped.size[1]) // 2

            canvas.paste(cropped, (offset_x, offset_y), cropped)

            target_path = os.path.join(target_dir, target_name)
            canvas.save(target_path, "PNG", optimize=True)
            print(f"Generated {target_name}: {canvas.size} from {src_name}")

if __name__ == "__main__":
    prepare_product_images()

