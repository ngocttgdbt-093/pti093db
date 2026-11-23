# PTI093 — Mobile UI preview (23/11/2026)

**Phạm vi:** duyệt giao diện trước khi tích hợp. Chỉ thêm `mobile-preview-20261123/index.html`, giữ nguyên toàn bộ file nghiệp vụ và `index.html` của dự án. Không gọi API thật, không tạo kết nối tài khoản, không ghi dữ liệu, không can thiệp lịch đồng bộ/email. Toàn bộ số liệu và hồ sơ trong trang đều **GIẢ LẬP**, GĐV được ẩn danh.

## Nội dung đã mô phỏng
- Mobile: header ngắn, badge cảnh báo, bộ lọc dạng bottom sheet, tab 5 mục Tổng quan / GĐV / Tồn / Chi phí / Thêm, hỗ trợ safe area và chế độ sáng/tối.
- Desktop: sidebar đầy đủ 7 màn, lưới responsive.
- KPI tổng quan; 7 nhóm cảnh báo; tuổi tồn xếp chồng 100%; GĐV với màu định danh cố định, ngưỡng 80%/130%; diễn biến tồn theo các kỳ minh họa; phân tích AI thu gọn.
- GĐV dạng thẻ, 4 nhóm tuổi tồn, cảnh báo 7 xu hướng dạng sparkline, thang điểm sức khỏe, biểu đồ chi phí bình quân và hai biểu đồ doanh thu/tỷ lệ bồi thường tách riêng, CLDV, tra cứu hồ sơ thẻ.
- Tương tác: chuyển tab, lọc GĐV, lọc nghiệp vụ trong danh sách hồ sơ demo, đổi sáng/tối, mở thông tin từng KPI/cảnh báo/hồ sơ, mở Thêm, in trang.

## Các nguyên tắc bắt buộc khi tích hợp vào Dashboard thật
1. Chỉ thay lớp trình bày; không sửa thuật toán bồi thường, nguồn dữ liệu, cơ chế xác thực, gửi mail, đồng bộ Drive/Cron, lịch sử báo cáo, định nghĩa KPI, phân quyền.
2. Kết nối từng số liệu vào bộ lọc đang dùng trong production. Không dùng các số giả lập trong test, không suy ra dữ liệu nghiệp vụ từ dữ liệu thiếu. Bộ lọc XO.1/XO.4 hiện chỉ minh họa cho danh sách hồ sơ, **chưa** tính lại KPI toàn trang.
3. 7 cảnh báo có thể giao nhau; số hồ sơ cảnh báo **không được cộng** thành số tồn. Chỉ số tuổi tồn phải tạo thành một phân hoạch không chồng lấn.
4. Phân biệt màu trạng thái (xanh/vàng/cam/đỏ) với màu định danh GĐV cố định. Nếu thiếu dữ liệu kỳ trước, hiển thị “Chưa đủ dữ liệu”, không tự dùng chênh lệch 0.
5. Xử lý ngày chốt của từng nguồn riêng. Đặc biệt các biểu đồ dữ liệu 003 có thể lệch ngày so với dữ liệu bồi thường 093.
6. Tương tác số liệu ở production phải gọi lại **hàm danh sách hồ sơ + phân quyền hiện hữu**, truyền đủ bộ lọc, thay cho modal giả lập.
7. Giữ toàn bộ các chức năng xuất Excel chuẩn xlsx, chatbot, quản trị, đăng xuất, AI phân tích thật và tính năng xem chi tiết hồ sơ; không được thay bằng placeholder demo.
8. Hiển thị chuỗi các kỳ thực tế từ dữ liệu đã lưu, không nội suy ngày thiếu; ngưỡng lấy cấu hình và giữ đúng quy tắc tuổi tồn đang áp dụng.
9. Chỉ số sức khỏe hồ sơ dùng lại công thức hiện hành, không tính từ mã minh họa. Phân biệt dữ liệu thật, nhận định AI và chỉ tiêu đề xuất.

## Kiểm thử và nghiệm thu production (chưa thực hiện)
- Visual: 360, 375, 390, 430px; iPhone notch/home bar; iPad và desktop 1024/1440px; xoay màn hình; phóng chữ 200%; chế độ tối.
- Không tràn ngang, không cắt bảng/số/biển số; nội dung KPI đầu tiên xuất hiện ngay màn đầu; chatbot không che số; tab và sheet có target chạm >=44px theo hướng dẫn truy cập.
- Đối soát Tổng quan và đủ 7 menu, từng bộ lọc, từng GĐV, từng kỳ, dữ liệu 003, dấu chấm/phẩy/thập phân, cảnh báo 45/90 ngày, ngưỡng 80/130%; chênh lệch so với bản hiện hành phải bằng 0.
- Tương tác drilldown từng con số, quyền truy cập dữ liệu, export xlsx, import, chatbot, AI, quản trị; regression cho lịch cập nhật, Drive, báo cáo email tự động và cơ chế không gửi trùng.
- Kiểm thử trình duyệt thật trên iPhone và đối soát production **chưa có trong đợt dựng mockup**.

## Kiểm thử đã thực hiện
- GitHub `index.html` có SHA không đổi `69419fef297c4ca8f1227f9cc6cc3434109d5bb7`.
- Tệp preview được lưu thành công, kiểm tra cú pháp JavaScript qua V8.
- Chạy render giả lập DOM cho 8 trạng thái màn hình, kiểm tra tổng số giả lập và khi lọc GĐV, không có lỗi thực thi.
- **Chưa xác minh URL GitHub Pages từ trình duyệt bên ngoài** và chưa kiểm tra trực quan iPhone. Kết quả này là nghiệm thu kỹ thuật sơ bộ cho bản mockup, không phải nghiệm thu production.

### Địa chỉ dự kiến
https://baocao.pti093.com/mobile-preview-20261123/

### Mã nguồn
https://github.com/ngocttgdbt-093/pti093db/tree/main/mobile-preview-20261123
