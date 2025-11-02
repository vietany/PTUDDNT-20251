https://github.com/vietany/PTUDDNT-20251

Công nghệ chốt:

•	Backend: Node.js / Express

•	Database: MongoDB

•	Triển khai: Heroku

Việc chung: Anh đã push khung sườn dự án (cấu trúc thư mục, 5 models cơ bản) lên Git. Mọi người git pull origin main và npm install.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Nhiệm vụ của Việt Anh (Lead):

1.Usecase 1 (Authentication): Hiện thực Register, Login (tạo JWT), Refresh Token, Verify Email.

2.Auth Middleware: Tạo file src/middleware/auth.middleware.js (hàm protect) để giải mã token và gắn req.user. Push file này lên sớm nhất.

3.Routes: Kết nối tất cả routes (của cả 3 người) vào app.js.



Nhiệm vụ của Hiệp (Backend Developer):

1.Thiết kế Sơ đồ Logic CSDL:Vẽ một sơ đồ logic cho MongoDB (thể hiện các Collections và mối quan hệ tham chiếu/nhúng).

2.Usecase 4 (Quản lý Category): Hiện thực 4 API: Create, Get all, Edit, Delete (dùng category.model.js).

3.Usecase 5 (Quản lý Unit): Hiện thực 4 API: Create, Get all, Edit, Delete (dùng unit.model.js).

4.Tích hợp: Sau khi có file middleware, git pull về và thêm vào các route trên để kiểm tra quyền Admin.



Nhiệm vụ của Minh Đức (Backend Developer):

1.Usecase 3 (Quản lý Group): Hiện thực các API: Create group, Add member, Delete member, Get members (dùng group.model.js, user.model.js).

2.Usecase 2 (Quản lý Tài khoản): Hiện thực các API: Change password, Edit user, Get user, Delete user.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Quy trình làm việc (Bắt buộc):

1.Pull: Luôn git pull origin main trước khi code.

2.Tạo nhánh: Tạo nhánh mới cho mỗi Usecase (ví dụ: feature/hiep-usecase-4).

3.Code \& Commit: Code trên nhánh riêng.

4.Tạo Pull Request (PR): Push nhánh và tạo PR, gán Việt Anh làm "Reviewer".

5.Merge: Việt Anh sẽ review và merge vào main.

Bắt đầu.





