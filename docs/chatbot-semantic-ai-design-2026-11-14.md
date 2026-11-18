# Chatbot AI 093 — thiết kế nâng cấp theo năng lực (14/11/2026)

Trạng thái: đề xuất + bộ tiêu chí nghiệm thu trên nhánh thử nghiệm; **chưa triển khai backend, chưa kích hoạt production**.

## Chẩn đoán từ mã đã đọc
- `assistant.js` hiện dùng regex ở `roboDutyIntent`, `roboPriorityDocument` và đường dự phòng keyword `roboAnswer`.
- Trình duyệt gọi `POST /api/assistant` với `question, gdv, history`; xử lý lịch trực có đánh dấu tool `duty_schedule`.
- `assistant-kb.js` là kho Q&A được đóng gói trong frontend, không phải chứng cứ rằng hệ thống có thể truy vấn mọi tài liệu gốc.
- Một câu có nhiều ngày phải được giải nghĩa thành **danh sách ngày có thứ tự** trước khi gọi công cụ, không được để LLM tự chọn một ngày. Câu hỏi tiếp nối phải giữ chủ đề/ngữ cảnh.

## Kiến trúc mục tiêu
1. **Input & context**: chuẩn hóa tiếng Việt; tách ý định, thực thể, khoảng thời gian, bộ lọc GĐV, tham chiếu câu trước. Lưu lịch sử ngắn phía server theo phiên và thời hạn; không lưu hồ sơ nhạy cảm lâu dài trên trình duyệt.
2. **Planner**: LLM chỉ lập kế hoạch có cấu trúc `{intent, date_range, dates, gdv, source_scope, followup_of}`. Ràng buộc bằng JSON Schema và validator thuần mã; từ chối ngày thiếu rõ ràng thay vì tự suy đoán. Không coi chuỗi trả lời của mô hình là SQL hoặc lệnh.
3. **Tool router**: công cụ có kiểu và quyền riêng: `get_duty_schedule(dates)`, `query_claim_aggregates(filters)`, `lookup_claim(identifier)`, `search_internal_documents(query, filters)`, `get_document_excerpt(id, range)`. Backend thực thi theo quyền người dùng, không dùng quyền admin mặc định.
4. **Retrieval**: hybrid keyword + semantic embeddings hoặc full-text/metadata filter; chia đoạn tài liệu theo điều/khoản/trang, gắn version, hiệu lực, nguồn. AI chỉ tóm tắt những đoạn đã truy xuất. Với bảng tỷ lệ thương tật phải lấy đúng dòng, cột, ghi chú và trang gốc; không suy luận số phần trăm.
5. **Answer verifier**: xác nhận đủ tất cả ngày và bộ lọc, phép tính đối soát với nguồn, trích dẫn tài liệu; nếu thiếu một nguồn, báo phần chưa xác minh, không âm thầm bỏ qua.
6. **LLM gateway**: ưu tiên hạ tầng server hiện có và Cloudflare Workers AI hạn mức miễn phí. Provider thứ hai tùy chọn sau khi kiểm tra chính sách dữ liệu và quota. Token/API key giữ ở server secrets, không bao giờ đóng gói frontend. Không gửi dữ liệu hồ sơ bảo hiểm sang Gemini Free Tier nếu chưa được tổ chức phê duyệt chính sách dữ liệu.
7. **Fallback**: khi hết quota, phục vụ truy vấn xác định qua công cụ nghiệp vụ, không tạo số liệu bằng câu trả lời từ kho Q&A. Các truy vấn không đủ căn cứ phải ghi rõ không có dữ liệu.

## Hợp đồng lịch trực
- Đầu vào `dates`: mảng ISO `YYYY-MM-DD`, tối đa 31 ngày; lấy giờ Việt Nam `Asia/Ho_Chi_Minh`; ngày hôm nay phải tính theo thời gian server/giờ địa phương, không theo UTC ngầm.
- `hôm nay và ngày mai`: hai ngày, bao gồm cả hai đầu.
- `3 ngày tới`: phải có quy ước được xác nhận: tính từ hôm nay hay từ ngày mai; chọn mặc định công khai `hôm nay, ngày mai, ngày kia` và hiển thị đủ ngày.
- `cuối tuần này`: Thứ Bảy + Chủ nhật của tuần địa phương; nếu hôm nay là Chủ nhật thì phần quá khứ trong tuần vẫn phải được xử lý theo yêu cầu, không tự cắt.
- `cả tuần`: Thứ Hai–Chủ nhật, nêu rõ mốc.
- `ai trực thay cho Hưng?` là truy vấn quan hệ; phải trả được người trực chính, người trực thay và ngày.
- Mỗi ngày phản hồi có `date, primary, substitute, substitution_for, provenance` kể cả giá trị `null` khi không có người thay. Không bỏ phần tử khi thiếu dữ liệu; hiển thị `chưa xác minh`.
- Kiểm tra số ngày đầu ra === số ngày yêu cầu; phát hiện thiếu ngày và tự thử lại công cụ dữ liệu một lần, không để LLM tự bịa.

## Các nhóm nghiệm thu trước merge
- Lịch: hôm nay + mai, ba ngày, cuối tuần, cả tuần, hỏi theo tên/người thay, nối tiếp “ngày kia thì sao”.
- Tra cứu PL01: hỏi “gãy tay” cần xác định xương; sau đó “gãy chân” tiếp tục tra cùng bảng nhưng không ghép tỷ lệ không có căn cứ.
- Tổng hợp hồ sơ: bộ lọc GĐV, khoảng ngày, TNDS/VCX, công thức tồn, thiếu dữ liệu, phát hiện số liệu lịch sử không liên tục.
- Bảo mật: prompt injection trong PDF, phân quyền GĐV/đơn vị, không lộ khóa, không gửi PII ra nhà cung cấp chưa duyệt.
- Vận hành: timeout, quota 429, failover không tự gửi thông tin nhạy cảm, không tạo câu trả lời giả.
- TDD: tạo fixtures dùng dữ liệu giả, chạy trên nhánh test, xác minh CI; cần test tích hợp backend với nguồn lịch thực được cấp quyền mới được nghiệm thu.

## Điều kiện không được xem là hoàn thành
Chỉ thêm mẫu câu hoặc bộ từ khóa không được gọi là AI hiểu ngôn ngữ tự nhiên. Chỉ có tài liệu thiết kế hoặc test case chưa phải tính năng đã triển khai. Mọi thay đổi frontend/backend bắt buộc kiểm tra bằng câu hỏi thực tế trước khi merge/deploy.
