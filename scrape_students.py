import urllib.request
import re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []

    def handle_data(self, data):
        self.text.append(data)

def get_text_from_url(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            parser = TextExtractor()
            parser.feed(html)
            return "\n".join(parser.text)
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

print("Fetching M.Tech Students...")
mtech_text = get_text_from_url('https://es.iitgn.ac.in/mtech%20students.html')
with open('mtech_scraped.txt', 'w', encoding='utf-8') as f:
    f.write(mtech_text)

print("Fetching PhD Scholars...")
phd_text = get_text_from_url('https://es.iitgn.ac.in/phd%20people.html')
with open('phd_scraped.txt', 'w', encoding='utf-8') as f:
    f.write(phd_text)

print("Fetching Post-Docs...")
postdoc_text = get_text_from_url('https://es.iitgn.ac.in/post%20doc%20people.html')
with open('postdoc_scraped.txt', 'w', encoding='utf-8') as f:
    f.write(postdoc_text)

print("Scraping finished!")
