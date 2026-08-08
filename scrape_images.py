import os
import re
import urllib.request
from urllib.parse import urljoin

urls = [
    'https://es.iitgn.ac.in/index.html',
    'https://es.iitgn.ac.in/faculty.html',
    'https://es.iitgn.ac.in/galllery.html',
    'https://es.iitgn.ac.in/events.html',
    'https://es.iitgn.ac.in/research%20labs%20and%20centres.html'
]

assets_dir = r'C:\Users\hP\.gemini\antigravity\scratch\iitgn-earth-sciences\assets'
os.makedirs(assets_dir, exist_ok=True)

img_urls = set()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for page_url in urls:
    try:
        req = urllib.request.Request(page_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # find src in img tags or background-image styles
            found_srcs = re.findall(r'src=["\']([^"\']+)["\']', html)
            found_bgs = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', html)
            
            for src in found_srcs + found_bgs:
                if any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg']):
                    if not src.startswith('data:'):
                        full_url = urljoin(page_url, src)
                        img_urls.add(full_url)
    except Exception as e:
        print(f"Error reading {page_url}: {e}")

print(f"Total unique images found: {len(img_urls)}")

downloaded_files = []
for idx, img_url in enumerate(sorted(img_urls)):
    try:
        # Generate safe filename
        clean_name = os.path.basename(img_url.split('?')[0])
        if not clean_name or len(clean_name) < 3:
            clean_name = f"img_{idx}.jpg"
        
        save_path = os.path.join(assets_dir, clean_name)
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(save_path, 'wb') as out_file:
            out_file.write(resp.read())
        
        downloaded_files.append((clean_name, img_url))
        print(f"[{idx+1}/{len(img_urls)}] Downloaded: {clean_name}")
    except Exception as e:
        print(f"Failed to download {img_url}: {e}")

print(f"\nSuccessfully downloaded {len(downloaded_files)} images to assets directory!")
