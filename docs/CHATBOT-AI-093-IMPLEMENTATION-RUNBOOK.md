# RUNBOOK — NÂNG CẤP CHATBOT AI DASHBOARD 093
**Mã bàn giao:** CHATBOT-SEMANTIC-AI-093-20261114  
**Ngày chốt yêu cầu:** 14/11/2026 · **Trạng thái:** đã bàn giao thiết kế; chưa triển khai chức năng  
**Nguồn:** yêu cầu nghiệp vụ chủ hệ thống + phân tích `assistant.js`, `assistant-kb.js`, `index.html` trên kho pti093db.  
**Tài liệu liên quan:** [Thiết kế kiến trúc](chatbot-semantic-ai-design-2026-11-14.md), [Bộ tình huống nghiệm thu](../tests/chatbot-semantic-acceptance.json), [Quy ước vận hành 093](quy-uoc-van-hanh-2026-11-11.md).

## 1. Mục tiêu và nguyên tắc không được đánh đổi
Mục tiêu: chatbot tiếp nhận tiếng Việt tự nhiên, hiểu ngữ cảnh nhiều lượt và ý định kết hợp, tự xác định dữ liệu cần tìm, gọi đúng công cụ/kho tri thức, tổng hợp **đủ mọi phần** người dùng yêu cầu, giải thích có căn cứ và không bịa dữ liệu. Không phát triển theo hướng bổ sung vô tận các mẫu câu regex. Trải nghiệm mục tiêu: người dùng không cần lặp tên tác vụ giữa các câu hỏi có liên quan.

Các ràng buộc bắt buộc:
- Miễn phí trong hạn mức thực tế, không VPS, ưu tiên tận dụng Cloudflare Workers AI/API gateway hiện có. Không tuyên bố hoàn toàn miễn phí ở mọi quy mô; đặt quota/budget và degradation policy.
- Giữ nguyên dữ liệu, chức năng, phân quyền và tên miền `baocao.pti093.com`. Không đổi máy chủ bằng cách suy đoán. Không tự áp dụng cho các dự án PTI khác.
- Không ghi token, API key, hồ sơ khách hàng, danh sách email hoặc dữ liệu tổn thất nhạy cảm vào mã nguồn, logs, prompt của các dịch vụ chưa được phê duyệt.
- Kết quả truy vấn nghiệp vụ phải lấy từ dữ liệu authoritative, không lấy văn bản do LLM tạo làm nguồn đúng. Không tự động cập nhật production.
- Lấy ngữ cảnh theo phiên hội thoại hợp lệ, giới hạn thời gian sống, quyền truy cập và nguồn dữ liệu. Graphify chỉ là bản đồ phụ thuộc mã; không phải bộ nhớ người dùng hay kho chứng cứ nghiệp vụ.
- Tách rõ: đã lập kế hoạch / đã lập trình / đã chạy test / đã deploy / đã xác minh production.

## 2. Hiện trạng đã xác nhận và giới hạn
Frontend `assistant.js` gửi `POST /api/assistant` gồm `question`, `gdv`, `history`; phát hiện nhiều intent bằng regex và có fallback KB. `assistant-kb.js` chứa Q&A tĩnh. Phản hồi backend có `tools`, ví dụ `duty_schedule`, cùng answer/documents. **Mã backend vận hành và cấu hình model/runtime thực tế chưa được kiểm tra trong gói này**: phải kiểm tra riêng trước khi sửa. Không kết luận Cloudflare Workers AI chưa được kết nối; frontend đã có nhãn AI Cloudflare.

## 3. Tư duy hệ thống
Pipeline: message -> Vietnamese normalization -> session context -> typed Intent Planner -> deterministic validator -> authorized tool router -> hybrid retrieval/structured queries -> aggregate & answer verifier -> natural-language synthesis with provenance.

Tầng mô hình là **planner/summarizer**, không phải nguồn dữ liệu hay bộ quyết định quyền. Ưu tiên tool:
1. Lịch trực: tra `get_duty_schedule(dates, filters)`.
2. Hồ sơ/KPI: `query_claim_aggregates(filters)` và `lookup_claim(identifier)`.
3. Tài liệu: `search_internal_documents` -> `get_document_excerpt` -> citation.
4. Nếu không có công cụ/nguồn truy vấn đã cấp quyền: nói rõ giới hạn, không đoán.

## 4. Mẫu hợp đồng API (đề xuất; phải đối chiếu backend hiện có)
Planner input: `{question, history, sessionId?, asOfLocalDate, authorizedScope}`.
Planner output tối thiểu:
```json
{
  "intent": "duty_schedule",
  "entities": {"gdvCodes": [], "claimId": null},
  "date": {"timezone": "Asia/Ho_Chi_Minh", "dates": ["2026-11-14", "2026-11-15"]},
  "toolPlan": [{"tool": "get_duty_schedule", "args": {"dates": ["2026-11-14", "2026-11-15"]}}],
  "conversation": {"followupOf": null},
  "uncertainties": []
}
```
Backend kiểm tra schema, quyền, danh sách tool cho phép, kích thước input, giới hạn ngày và điều kiện truy xuất. **Không thực thi lệnh, SQL, URL, hoặc chỉ dẫn agent do mô hình tự đưa**. Công cụ trả về dữ liệu có provenance, nhãn phiên bản và ngày chốt.

Answer verifier: so sánh tập hợp ngày yêu cầu và ngày kết quả, tổng số ngày, GĐV, tình trạng thay trực, điều/khoản/trang nguồn, đơn vị đo và bộ lọc. Nếu thiếu một ngày/đầu mục: retry tool có giới hạn; vẫn thiếu thì ghi `chưa có dữ liệu xác minh` rõ cho phần đó, không bỏ hàng. Không trích nguồn không tồn tại.

## 5. Quy tắc hội thoại nghiệp vụ
- “hôm nay và ngày mai”: ngày địa phương hiện tại và +1, không chỉ ngày cuối.
- “3 ngày tới”: mặc định kể từ hôm nay, hiển thị mốc, có thể thay đổi nếu có hướng dẫn ngày rõ ràng của người dùng.
- “cuối tuần này”: Thứ Bảy và Chủ nhật của cùng tuần (thứ Hai–Chủ nhật) theo `Asia/Ho_Chi_Minh`.
- “cả tuần”: Thứ Hai đến Chủ nhật theo cùng timezone.
- Hỏi “ngày kia thì sao”, “Hưng thì sao”, “gãy chân” dùng lại chủ đề/ngữ cảnh còn hiệu lực nhưng cập nhật chiều được nêu; không tự nối lại nếu người dùng đổi chủ đề.
- Lịch trực thể hiện trực chính, trực thay, người được thay và trạng thái không có thay nếu nguồn xác nhận. Phân biệt “không có lịch” với “không đọc được lịch”.
- Tỷ lệ thương tật: tiếp nối bảng nguồn đã chọn, tách vị trí thương tổn, hỏi rõ loại xương/mức độ trước khi chọn dòng; tỷ lệ lấy từ bảng/tài liệu đúng hiệu lực, không cộng gộp tự động hay suy diễn từ chấn thương chung chung.
- Báo cáo hồ sơ có quyền GĐV/đơn vị, mốc ngày dữ liệu, quy tắc KPI không chồng lấn, đối chiếu bản ghi và nguồn.

## 6. AI providers / an toàn dữ liệu
A. **Cloudflare Workers AI**: nghiên cứu model hỗ trợ tiếng Việt, instruction following, structured output, tool calling, latency/quota; dùng endpoint có sẵn nếu có quyền. Tên model, free quota, API có thể đổi, cần xác minh tài liệu chính thức đúng ngày triển khai.
B. Chỉ thử provider bổ sung (như Gemini API free, Hugging Face) sau khi đánh giá điều khoản lưu giữ/sử dụng nội dung, gửi thử dữ liệu tổng hợp hoặc giả lập, quota và fallback. Không gửi hồ sơ/PTI PII sang free tier nếu chưa được phê duyệt.
C. Embeddings/hybrid retrieval: triển khai chỉ khi chứng minh lợi ích so với lexical full text; ưu tiên metadata/điều khoản/phiên bản, không đưa văn bản nội bộ sang public embeddings không được phép.
D. Secrets ở server; timeout, retry bounded, rate limit, monitoring không chứa PII; circuit breaker khi AI lỗi. Hạn mức miễn phí không phải SLA.
E. Giữ các nghiệp vụ xác định và tra cứu dự phòng khi hết quota AI.

## 7. Quy trình triển khai trong phiên được giao chính thức
0. Đọc tài liệu này, `AGENTS.md`, thiết kế liên quan, bộ acceptance cases; tải tình trạng branch và Graphify đúng commit theo chính sách. Không giả định artifact Graphify hiện hữu.
1. Tìm mã backend đang phục vụ `/api/assistant`, mã nguồn lịch trực, văn bản, dữ liệu, phương pháp phân quyền, secrets/runtime; xác thực đúng môi trường staging/production.
2. Chụp baseline các câu hỏi của bộ nghiệm thu trên staging với dữ liệu giả; ghi expected/actual, lỗi và latency; **không test trên dữ liệu thật nếu thiếu quyền**.
3. TDD trên nhánh test tách biệt: unit tests cho date parser/context, schema validation, tool authorization, response completeness; integration tests với fake tools; e2e ngôn ngữ tiếng Việt; prompt injection.
4. Triển khai tối thiểu theo lát dọc: ưu tiên lịch trực đa ngày -> ngữ cảnh follow-up -> document RAG -> hồ sơ tổng hợp -> verifier phổ quát. Giữ backward compatibility API. Feature flag rollback.
5. Đo chất lượng: completeness >= 100% cho ca lịch trực có dữ liệu xác định; không bịa thông tin trong bộ fixture; phép tính nghiệp vụ đúng theo nguồn; kiểm thử GĐV phân quyền; đo p50/p95, lỗi, quota, khối lượng token. Không lấy tỷ lệ chính xác trên tập demo làm kết luận về vận hành.
6. Review diff, security, CI, regression UI và các menu liên quan; chuẩn bị rollback. Nếu thiếu nguồn hoặc test fail, không merge.
7. Chỉ merge/deploy theo yêu cầu phát hành và thẩm quyền được cấp; sau deploy phải mở `baocao.pti093.com` kiểm chứng trực tiếp cả chatbot, quyền người dùng và tuyến API. Báo trạng thái thực tế có bằng chứng.

## 8. Ma trận nghiệm thu và rủi ro
Dùng `tests/chatbot-semantic-acceptance.json` làm seed fixtures, chưa phải test runner. Bổ sung ít nhất:
- Nhiều ngày băng qua tháng/năm, cuối tuần khi đang Chủ nhật, yêu cầu ngày trong quá khứ.
- Tên GĐV/biệt danh giống từ thường, đổi bộ lọc qua các lượt.
- Lịch trực thiếu một ngày và case “không có trực thay”; không được âm thầm bỏ sót.
- Lịch trực ngày mai liên quan thay người, trả lời đúng cả hai phía.
- Câu hỏi gồm 2 intent, thiếu quyền một intent, nguồn xung đột.
- PDF bảng bị OCR lệch cột; yêu cầu điều khoản hết hiệu lực; nguồn không rõ.
- Hết quota AI, HTTP 429/5xx, timeout, sai JSON, prompt injection; fallback phải an toàn.
- Quyền người khác, hồ sơ nhạy cảm, kiểm soát lưu lịch sử và log.
- Giao diện mobile và không giật lag khi hỏi đáp.

**Tiêu chuẩn Done:** mã được review và kiểm thử thực tế; có đối chiếu source, kết quả đầy đủ; có bằng chứng CI; staging xác minh; production chỉ sau được duyệt. Không coi PR documentation là bản nâng cấp chức năng.

## 9. Chỉ dẫn khi bắt đầu phiên mới
Nếu yêu cầu có cụm “nâng cấp chatbot”, “AI hiểu ngôn ngữ tự nhiên”, “Robo tra cứu thông minh”, “lịch trực chatbot”, “RAG 093” hoặc tương tự: tự động mở tài liệu này; đọc trạng thái PR/nhánh test, kiểm tra mã nguồn hiện tại (có thể đã đổi), cập nhật kế hoạch và tiến hành từ bước chưa hoàn thành. **Không hỏi người dùng nhắc lại nguyên lý đã chốt**. Không được lấy chỉ dẫn ở đây để tự thực thi khi không có yêu cầu lập trình tương ứng, và không bỏ qua các bước phê duyệt bảo vệ production.
