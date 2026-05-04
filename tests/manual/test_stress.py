import concurrent.futures
import requests
import time
from collections import Counter

BASE_URL = "http://127.0.0.1:8000/auth/login"
PAYLOAD = {"email": "bad@email.com", "password": "badpassword"}

def fetch(url):
    try:
        response = requests.post(url, json=PAYLOAD, timeout=5)
        return response.status_code
    except Exception as e:
        return type(e).__name__

def main():
    total_requests = 1000
    print(f"🚀 Blasting {total_requests} concurrent POST requests to {BASE_URL}...")
    
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(fetch, BASE_URL) for _ in range(total_requests)]
        results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
    duration = time.time() - start_time
    print(f"\n⏱️  Finished in {duration:.2f} seconds.")
    print("-" * 40)
    
    # Analyze and count results
    counts = Counter(results)
    for status, count in sorted(counts.items(), key=lambda x: str(x[0])):
        if status == 200:
            print(f"✅ Success (200 OK): {count} requests")
        elif status == 429:
            print(f"🚫 Blocked (429 Too Many Requests): {count} requests")
        else:
            print(f"⚠️ Other ({status}): {count} requests")
            
    print("-" * 40)
    if counts.get(429, 0) > 0:
        print("🛡️  Rate limiter is WORKING! Most concurrent requests were blocked.")
    else:
        print("❌ Rate limiter FAILED. All requests passed.")

if __name__ == "__main__":
    main()
