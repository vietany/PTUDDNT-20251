import os

# Chuỗi kết nối gốc của bạn
base_uri = "mongodb+srv://20180022:<db_password>@cluster0.bbmw9pm.mongodb.net/"
# Tên database
db_name = "di-cho-tien-loi"
# Tham số
params = "?appName=Cluster0"

def update_env():
    print("--- CẬP NHẬT MONGODB ATLAS ---")
    password = input("Nhập mật khẩu database (User: 20180022): ").strip()
    
    if not password:
        print("Lỗi: Chưa nhập mật khẩu.")
        return

    # Tạo chuỗi kết nối hoàn chỉnh
    # Thay <db_password> và thêm tên DB vào
    final_uri = base_uri.replace("<db_password>", password) + db_name + params
    
    env_content = f"""MONGO_URI="{final_uri}"
JWT_SECRET=vietany_secret_key_123456
JWT_EXPIRE=30d
PORT=5000
"""

    # Ghi đè vào file .env
    with open(".env", "w", encoding="utf-8") as f:
        f.write(env_content)
        
    print("\n[OK] Đã cập nhật file .env thành công.")
    print(f"MONGO_URI mới: {final_uri}")
    print("Bạn có thể chạy lại 'node app.js' để test ngay.")

if __name__ == "__main__":
    update_env()