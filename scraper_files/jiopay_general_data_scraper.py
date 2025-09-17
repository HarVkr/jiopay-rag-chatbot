# content_scraper.py
import asyncio
import json
import time

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import requests

# --- Configuration ---
URL_FILE = "urls.txt"
OUTPUT_FILE_REQUESTS = "scraped_data_requests.json"
OUTPUT_FILE_PLAYWRIGHT = "scraped_data_playwright.json"


# --- Text Extraction Logic ---
# content_scraper.py (Replace this function)

# --- Text Extraction Logic ---
def parse_text_from_html(html_content: str) -> str:
    """
    Parses HTML to extract clean text by first finding and removing common,
    repeated boilerplate sections from the SPA shell.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find and remove the "Our Products" section
    products_heading = soup.find(lambda tag: tag.name in ['h2', 'h3'] and 'Our Products' in tag.get_text())
    if products_heading:
        # Assumes the section is in a parent container; find a common parent and remove it
        products_section = products_heading.find_parent('div', class_=lambda c: c and 'product' in c.lower())
        if products_section:
            products_section.decompose()
        else: # Fallback if class name is not found
            parent = products_heading.find_parent()
            if parent:
                parent.decompose()

    # Find and remove the "Why JioPay?" section
    why_jiopay_heading = soup.find(lambda tag: tag.name in ['h2', 'h3'] and 'Why JioPay?' in tag.get_text())
    if why_jiopay_heading:
        parent = why_jiopay_heading.find_parent()
        if parent:
            parent.decompose()
            
    # Find and remove the top hero section
    hero_heading = soup.find(lambda tag: tag.name in ['h2', 'h3'] and 'Digital payment acceptance made easy' in tag.get_text())
    if hero_heading:
        parent = hero_heading.find_parent()
        if parent:
            parent.decompose()

    # General cleanup of remaining unwanted tags
    for element in soup(["script", "style", "header", "footer", "nav"]):
        element.decompose()
        
    return soup.get_text(separator=' ', strip=True)


# --- Pipeline 1: Requests ---
def fetch_with_requests(url: str) -> str | None:
    """Fetches a single URL using requests."""
    print(f"  [Requests] Fetching: {url}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"  [Requests] Error fetching {url}: {e}")
        return None

# --- Pipeline 2: Playwright ---
async def fetch_with_playwright(url: str, page) -> str | None:
    """Fetches a single URL using Playwright."""
    print(f"  [Playwright] Fetching: {url}")
    try:
        await page.goto(url, wait_until='networkidle', timeout=30000)
        return await page.content()
    except Exception as e:
        print(f"  [Playwright] Error fetching {url}: {e}")
        return None


# --- Main Execution Logic ---
async def main():
    print("Reading URLs from:", URL_FILE)
    with open(URL_FILE, 'r') as f:
        urls_to_scrape = [line.strip() for line in f if line.strip()]
    print(f"Found {len(urls_to_scrape)} URLs to scrape.")

    # --- Run Requests Pipeline ---
    print("\n--- Starting Requests Pipeline ---")
    requests_data = []
    start_time_req = time.time()
    for url in urls_to_scrape:
        html = fetch_with_requests(url)
        if html:
            text = parse_text_from_html(html)
            requests_data.append({"url": url, "text": text})
    with open(OUTPUT_FILE_REQUESTS, 'w', encoding='utf-8') as f:
        json.dump(requests_data, f, indent=2, ensure_ascii=False)
    print(f"Requests pipeline finished. Scraped {len(requests_data)} pages.")
    print(f"Time taken: {time.time() - start_time_req:.2f} seconds.")

    # --- Run Playwright Pipeline ---
    print("\n--- Starting Playwright Pipeline ---")
    playwright_data = []
    start_time_pw = time.time()
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        for url in urls_to_scrape:
            html = await fetch_with_playwright(url, page)
            if html:
                text = parse_text_from_html(html)
                playwright_data.append({"url": url, "text": text})
        await browser.close()
    with open(OUTPUT_FILE_PLAYWRIGHT, 'w', encoding='utf-8') as f:
        json.dump(playwright_data, f, indent=2, ensure_ascii=False)
    print(f"Playwright pipeline finished. Scraped {len(playwright_data)} pages.")
    print(f"Time taken: {time.time() - start_time_pw:.2f} seconds.")
    
    # --- Final Summary ---
    print("\n--- Final Ablation Study Summary ---")
    print(f"Total pages processed by Requests: {len(requests_data)}")
    print(f"Total pages processed by Playwright: {len(playwright_data)}")


if __name__ == "__main__":
    asyncio.run(main())