# PTI093 Dashboard V3 — phạm vi triển khai chốt 23/11/2026

## Phạm vi chính xác
- Chỉ đổi giao diện cho phiên đăng nhập `pti093` (mật khẩu không lưu trong mã/tài liệu), gồm toàn bộ 7 menu và giao diện quản trị bên trong.
- Giữ nguyên hoàn toàn giao diện và luồng `003/lan`, `003/upload`, không sửa CSS toàn cục, không sửa API/quyền, không đổi đường dẫn hay chức năng.
- Dashboard 093 chỉ quản lý và hiển thị **doanh thu/bồi thường theo năm nghiệp vụ**. Không đưa năm tài chính vào nhóm pti093; không được xóa hoặc làm hỏng nghiệp vụ riêng của nhóm 003.
- Giữ nguyên quy trình dữ liệu 3 nguồn, đồng bộ, lịch tự động, gửi mail, chatbot, xuất báo cáo, dữ liệu, đối soát.

## Kiến trúc thông tin mục tiêu
1. Tổng quan: KPI và cảnh báo hành động, diễn biến tồn tóm tắt, liên kết đi sâu.
2. Giám định viên: so sánh GĐV, phát sinh/giải quyết, hiệu suất, tồn tăng liên tục, chi tiết.
3. Hồ sơ & tồn: phân tích tuổi tồn, tồn theo trạng thái, waterfall tồn, giải quyết theo kỳ, tra cứu.
4. Doanh thu & bồi thường: **chỉ năm nghiệp vụ**, báo cáo theo kênh, tỷ lệ bồi thường, chi phí liên quan.
5. Thêm: cải tiến CLDV, chatbot, xuất báo cáo, quản trị (giữ nguyên xác thực quản trị riêng).

## Thiết kế
- Mobile: bottom navigation 5 mục cố định; nội dung cuộn dọc độc lập, safe-area iPhone, header tối giản, không cuộn ngang toàn trang.
- Desktop: sidebar điều hướng; cùng định nghĩa dữ liệu/biểu đồ; không nhân đôi nội dung.
- Một biểu đồ có một nơi chính; các trang khác dùng KPI tóm tắt + drilldown.
- Bộ lọc dùng chung có ngữ cảnh; phân biệt ngày mở HSBT, ngày giải quyết, kỳ dữ liệu và năm nghiệp vụ. Không gộp nhầm nghiệp vụ.
- Giữ mọi khả năng lọc, tìm kiếm, click biểu đồ xem hồ sơ, xuất xlsx, quản trị và lịch sử.

## Điều kiện bắt buộc trước triển khai production
1. Xác minh **repo/commit HEAD thực tế** của production (ưu tiên local `dashboard-093-deploy`, không suy diễn `pti093db` là production).
2. Kiểm kê 100% menu, biểu đồ, bộ lọc, bảng, chức năng từ mã nguồn production; lập ma trận cũ → mới; xác minh nghiệp vụ năm nghiệp vụ.
3. Xác minh **identity/role từ backend hoặc session hợp lệ**, không dựa vào tên người dùng do client tự khai hoặc token đoán giải mã. Bọc giao diện mới trong scope role `pti093`, không đổi hai role 003.
4. Tạo nhánh thử nghiệm, kiểm thử 3 role + quản trị riêng, dữ liệu và xuất file, mobile iPhone/desktop; kiểm thử lịch/email không bị ảnh hưởng.
5. Deploy lên hosting test độc lập, kiểm chứng HTTP và hiển thị thực tế; chỉ đưa production sau nghiệm thu.

## Hiện trạng đã xác minh
- `pti093db` có các module `app.js`, `history.js`, `cohort-cost.js`, `xo-report.js`, `admin-hub.js`, `mail-admin.js` và giao diện test HTML.
- `index.html` ở repo này không thể hiện phân nhánh giao diện theo role; `login.html` có redirect tới backend bên ngoài. Vì vậy **không đủ cơ sở để áp dụng CSS mới trực tiếp lên production hoặc bảo đảm không ảnh hưởng 003**.
- Đây là tài liệu phạm vi/điều kiện phát hành, **chưa phải V3 đã tích hợp hoặc triển khai production**.
