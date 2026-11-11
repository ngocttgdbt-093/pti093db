# Quy ước vận hành Dashboard 093 ngày 11/11/2026

Tài liệu bàn giao cho phiên tiếp theo. Đối chiếu với mã nguồn và nhật ký vận hành khi kiểm tra thực tế.

## Dữ liệu báo cáo và lịch tự động

- Ngày chốt là hôm qua theo giờ Việt Nam. Phát sinh và Giải quyết chạy từ 01/01 của năm báo cáo đến ngày chốt. Tồn chỉ nhập ngày kết thúc.
- Đối chiếu ngày trong tiêu đề của cả ba tệp và kiểm tra quan hệ hồ sơ giữa ba nguồn. Số Phát sinh lũy kế kỳ sau phải lớn hơn hoặc bằng kỳ trước. Bằng nhau là hợp lệ. Chặn cập nhật nếu Phát sinh giảm hoặc bộ tệp không đạt đối soát.
- Lưu ba tệp nguồn, bộ dữ liệu và kết quả so sánh của mỗi kỳ đạt. Lịch sử phục vụ biểu đồ theo ngày. Đã chuẩn hóa 11 kỳ từ 31/10 đến 10/11/2026. Kỳ 10/11 có 3.413 Phát sinh, 3.371 Giải quyết và 490 Tồn.
- Cập nhật lúc 08:00. Gửi email lúc 09:30 nếu lượt sáng hợp lệ. Nếu lượt sáng lỗi, chặn email 09:30, thử lại lúc 12:30 và gửi ngay khi cập nhật hợp lệ. Chống gửi trùng.
- Trong Dữ liệu báo cáo, nhật ký email hiển thị kết quả lượt gần nhất và kế hoạch tiếp theo. Lịch sử chi tiết xem tại GĐV & Email.

## Lịch trực và tài liệu

- Lịch trực Excel mặc định dùng cột B cho người trực chính, cột A cho người trực thay và bỏ qua cột L. Chỉ hiện trực thay khi có tên. Ví dụ 11/11/2026, Phạm Duy Thái trực thay Nguyễn Minh Ngọc. Lịch đang dùng kết thúc 13/12/2026.
- Email nhắc lịch ngày hôm sau cho đúng người. Nhắc trực thay nêu rõ người được thay. Nhắc lịch và cảnh báo hết lịch hiển thị màu đỏ. Cảnh báo lãnh đạo trước ngày hết lịch ba ngày, tương ứng 10/12/2026 đối với đợt hiện tại.
- Mục Lịch trực nhận Excel và mô tả quy tắc tùy chọn. Ô trống dùng quy tắc đang áp dụng. Xem trước cách diễn giải và phân công trước khi xác nhận. Sau khi lưu, chatbot, tệp tải xuống và email dùng cùng lịch.
- Mục Kho tài liệu nhận tài liệu và mô tả tùy chọn. Hệ thống đọc, phân nhóm, tạo câu hỏi gợi ý và chỉ mục để chatbot tra cứu. Giữ tệp gốc tải về và dẫn nguồn trong câu trả lời.

## Quản trị, phiên chatbot và giao diện

- Quản trị hệ thống gộp Dữ liệu và Quản trị GĐV. Bốn mục là Dữ liệu báo cáo, Lịch trực, Kho tài liệu, GĐV & Email. Dùng một lần đăng nhập bằng mật khẩu quản trị đã đặt. Rời menu hoặc chọn Đăng xuất quản trị sẽ khóa phiên quản trị.
- Nhãn phiên bản là Final V1.0 - 20261111. Bộ đếm lượt truy cập tính một lần mỗi phiên đăng nhập. Chatbot chỉ giữ hội thoại trong trang đang mở, mở lại hoặc tải lại trang thì lịch sử trắng.
- Trên điện thoại, toàn vùng báo cáo gồm tiêu đề, trạng thái, bộ lọc và nội dung trượt cùng trang liền kề. Bảng rộng vẫn cuộn ngang để đọc. Thả tay sau khi kéo quá 50% chiều rộng thì sang trang kế tiếp, kéo từ 50% trở xuống thì trở lại. Dải tên mục trên thanh tím than trôi theo tay, rồi mục của trang được giữ lại tự căn giữa và tô sáng.

## Bàn giao Graphify

Đọc tài liệu này cùng AGENTS.md. Đối chiếu các quy ước với commit giao diện `24bb78a87552d918319d797bcaee8cc1bc2400cf` và mã máy chủ hiện hành. Workflow hiện chỉ lấy năm tệp mã nguồn. Khi cập nhật sơ đồ ở phiên kế tiếp, rà soát phạm vi để đưa tài liệu này và các tệp mã liên quan vào đầu vào phù hợp. Sau khi tạo, kiểm tra nội dung thực sự xuất hiện trong sơ đồ, đối chiếu artifact với commit và kiểm tra bản sao Drive nếu có. Tài liệu này chỉ chứa quy ước và số tổng hợp.
