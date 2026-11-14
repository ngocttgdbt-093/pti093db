# Cloudflare Cron Triggers — PTI093 (chưa deploy)

## Trạng thái
Mẫu Worker đã lưu ở nhánh kiểm thử. **Chưa triển khai**: chưa có quyền deploy Cloudflare và chưa xác minh backend có cron endpoint được bảo vệ, có thể tự khởi tạo/điều phối các bước và xác minh thành công. Không nhập token trực tiếp vào GitHub.

## Thời điểm
Cron dùng UTC: `0 1 * * *` = 08:00 Việt Nam; `20 1 * * *` = 08:20 kiểm tra; `30 5 * * *` = 12:30 retry. Không sử dụng thao tác AI chờ đến giờ. Xem https://developers.cloudflare.com/workers/configuration/cron-triggers/

## Hợp đồng backend cần có (CHƯA KIỂM CHỨNG)
- `POST <PTI093_CRON_ENDPOINT>` qua HTTPS, chỉ cho phép `Authorization: Bearer <PTI093_CRON_SECRET>`, khóa chống replay và rate limit. So sánh secret constant-time; không log secret. Endpoint **không phải** endpoint đăng nhập hay `/api/pti-sync/status` công khai; không khai báo URI thật khi chưa được xác nhận.
- Body `{ mode: "morning"|"morning_watchdog"|"retry", scheduledFor, localDate, idempotencyKey }`. Backend phải tự tính lại ngày chốt Asia/Ho_Chi_Minh, không tin ngày/identity từ body; dùng server-side idempotency lock.
- Backend phải điều phối đủ `begin -> step` cho ba nguồn, có checkpoint và resume/recovery hợp lệ. Worker chỉ là trigger, không thay được máy chủ và không thể giả định MCP tools gọi được từ Worker.
- Response `{status:"accepted"|"running"|"completed"|"already_verified"|"skipped",runId?}`. `accepted/running` không đồng nghĩa đồng bộ thành công. Backend phải có nhật ký `scheduledAt,receivedAt,runId,phase,finishedAt,reportDate,verifiedAllSources,errorCode` và cảnh báo thiếu kết quả.
- Email giữ quy trình riêng, không gửi mail trong Cron handler. Không tắt automations cũ cho tới khi staging và lịch thực đạt; khi chuyển nguồn chính phải chống chạy đúp bằng backend lock.

## Quy trình nghiệm thu
1. Người có quyền Cloudflare xác nhận account/project, hiện trạng deployment, quyền secrets; người có quyền backend xác nhận endpoint và threat model.
2. Trên nhánh test chạy unit tests và `wrangler dev --test-scheduled`. Không truyền secret production vào local.
3. Deploy staging với tài khoản Cloudflare được ủy quyền; thử 08:00/08:20/12:30 trên dữ liệu giả; kiểm tra auth, duplicate, backend timeout, status accepted, quota, lịch sử audit và rollback.
4. Thử production chỉ sau phê duyệt; theo dõi Cron invocations và máy chủ xác minh dữ liệu ít nhất kỳ chạy kế tiếp. Không công bố đã fix nếu thiếu những bằng chứng đó.
5. Khi xác nhận Cron đang thực thi đúng thì mới điều chỉnh các lịch ChatGPT cũ thành giám sát dự phòng, tránh tạo hai nguồn trigger chính.

## Secrets cần cấp ngoài repo
`PTI093_CRON_ENDPOINT` (đường dẫn bảo mật được backend cung cấp);
`PTI093_CRON_SECRET` (giá trị ngẫu nhiên mạnh, lưu qua Wrangler secrets).
Không lưu giá trị tại đây.

## Ràng buộc của gói
Nếu thiếu endpoint backend hoặc tài khoản Cloudflare thì Worker này không có đường triển khai an toàn thực tế. Không cấu hình Worker gọi thẳng công cụ ChatGPT, không giả mạo token PTI.
