import os
import subprocess

# --- CẤU HÌNH ---
USERNAME = "20180022"
GUESS_PASS = "20180022" 
CLUSTER = "cluster0.bbmw9pm.mongodb.net"
DB_NAME = "di-cho-tien-loi"

def check_password():
    print(f"--- ĐANG KIỂM TRA MẬT KHẨU: {GUESS_PASS} ---")
    
    # 1. Tạo chuỗi kết nối
    uri = f"mongodb+srv://{USERNAME}:{GUESS_PASS}@{CLUSTER}/{DB_NAME}?retryWrites=true&w=majority&appName=Cluster0"
    
    # 2. Ghi file .env
    env_content = f"""MONGO_URI="{uri}"
JWT_SECRET=vietany_secret_key_123456
JWT_EXPIRE=30d
PORT=5000
"""
    with open(".env", "w", encoding="utf-8") as f:
        f.write(env_content)

    # 3. Tạo file JS để test kết nối (test_db.js)
    js_test_code = """
    const mongoose = require('mongoose');
    require('dotenv').config();

    async function test() {
        try {
            console.log("... Đang kết nối tới Atlas ...");
            await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
            console.log("✅ KẾT NỐI THÀNH CÔNG! Mật khẩu đúng.");
            process.exit(0);
        } catch (err) {
            console.log("❌ KẾT NỐI THẤT BẠI.");
            console.error("Lỗi chi tiết:", err.message);
            process.exit(1);
        }
    }
    test();
    """
    with open("test_db.js", "w", encoding="utf-8") as f:
        f.write(js_test_code)

    print("Đang chạy thử nghiệm kết nối...")
    print("-" * 30)

    # 4. Chạy file JS bằng Node (Cho phép in thẳng ra console để tránh lỗi encoding)
    try:
        # shell=True giúp tương thích tốt hơn trên Windows
        result = subprocess.run(["node", "test_db.js"], shell=True)
        
        print("-" * 30)
        # 5. Kiểm tra mã thoát (Exit code 0 là thành công)
        if result.returncode == 0:
            print(f"-> KẾT QUẢ: MẬT KHẨU {GUESS_PASS} LÀ ĐÚNG!")
            print("File .env đã được cập nhật. Bạn có thể chạy 'node app.js' ngay.")
            # Dọn dẹp file rác
            if os.path.exists("test_db.js"):
                os.remove("test_db.js")
        else:
            print(f"-> KẾT QUẢ: MẬT KHẨU {GUESS_PASS} LÀ SAI (Hoặc lỗi mạng).")
            print("Hãy kiểm tra lại user/pass trên MongoDB Atlas.")

    except Exception as e:
        print(f"Lỗi khi chạy script: {e}")

if __name__ == "__main__":
    check_password()