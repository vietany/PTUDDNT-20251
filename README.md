# DI CHO TIEN LOI (GROCERY APP)

Đồ án môn học: Phát triển ứng dụng đa nền tảng (IT4788)

## GIỚI THIỆU
Ứng dụng quản lý sinh hoạt gia đình, hỗ trợ đi chợ, quản lý thực phẩm trong tủ lạnh và lên kế hoạch ăn uống. Hệ thống bao gồm Backend (Node.js) và Mobile App (React Native).

## TÍNH NĂNG ĐÃ HOÀN THIỆN

1. **Xác thực (Authentication)**
   - Đăng ký, Đăng nhập, Tự động lưu phiên đăng nhập.
   - Phân quyền User/Admin.

2. **Quản lý Nhóm (Group)**
   - Tạo nhóm gia đình mới.
   - Mời thành viên qua email.
   - Rời nhóm, Xóa thành viên (Admin nhóm).

3. **Tủ lạnh (Fridge)**
   - Quản lý danh sách thực phẩm đang có.
   - Cảnh báo hạn sử dụng (Hiển thị màu đỏ khi hết hạn).
   - Thêm, Sửa, Xóa thực phẩm.

4. **Đi chợ (Shopping List)**
   - Tạo danh sách mua sắm theo sự kiện.
   - Thêm món cần mua.
   - Đánh dấu đã mua (Checklist).

5. **Lên lịch & Công thức (Meal & Recipe)**
   - Lên thực đơn (Sáng, Trưa, Tối) theo ngày.
   - Quản lý kho công thức nấu ăn.

6. **Báo cáo (Report)**
   - Thống kê số lượng thực phẩm.
   - Cảnh báo số lượng món sắp hết hạn trong 3 ngày tới.

## CÀI ĐẶT VÀ CHẠY DỰ ÁN

**Yêu cầu:** Đã cài đặt Node.js và Python.

**Cách 1: Chạy tự động (Khuyến nghị)**
1. Tìm file `RUN_PROJECT.bat` tại thư mục gốc.
2. Double click để khởi động.
   - Script sẽ tự động cập nhật IP máy tính vào cấu hình App.
   - Tự động bật Server Backend và App Frontend.

**Cách 2: Chạy thủ công**
- Backend: `node app.js` (Port 5000)
- Frontend: `cd di-cho-tien-loi-app` -> `npx expo start -c`

