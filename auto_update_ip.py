import socket
import re
import os

CLIENT_JS_PATH = os.path.join("di-cho-tien-loi-app", "src", "api", "client.js")

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def update_ip():
    if not os.path.exists(CLIENT_JS_PATH):
        print(f"[ERROR] Khong tim thay file: {CLIENT_JS_PATH}")
        return

    my_ip = get_local_ip()
    print(f"[INFO] IP hien tai: {my_ip}")
    
    with open(CLIENT_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Regex thay the IP cu trong baseURL
    new_content = re.sub(r"const baseURL = 'http://.*?:5000';", f"const baseURL = 'http://{my_ip}:5000';", content)
    
    if content != new_content:
        with open(CLIENT_JS_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"[SUCCESS] Da cap nhat IP {my_ip} vao client.js")
    else:
        print("[INFO] IP khong doi, giu nguyen.")

if __name__ == "__main__":
    update_ip()
