/* ══════════════════════════════════════════════════════════════════════════
   BỘ TRI THỨC TRỢ LÝ ẢO GIÁM ĐỊNH VIÊN — PTISOS Quảng Ninh
   Nạp bởi index.html (popup "Trợ lý GĐV"). Chạy offline, không gọi AI/Internet.

   Nguồn chính (ưu tiên quy trình PTI) — toàn bộ nằm trong docs/Kho tri thức:
   · Quy trình giải quyết YCBT NV XCG ký hiệu PTI.XCG.20 (QĐ ban hành 20/12/2024)
     và 18 phụ lục PL.PTI.XCG.20.01 → 20.18 (PL.20.04 dùng bản "mới" — nhận thế
     quyền đòi NT3, bộ biểu mẫu NVXE039.01.xx)
   · Quy tắc BH vật chất xe ô tô — QĐ 109/QĐ-PTI ngày 23/09/2025 (hiệu lực 14/10/2025)
   · NĐ 67/2023/NĐ-CP (BH bắt buộc TNDS chủ xe) — trích theo PL.PTI.XCG.20.12
   · Quy tắc QĐ 110/QĐ-PTI ngày 23/09/2025 (trách nhiệm chủ xe/lái xe với phụ xe, người ngồi trên xe)
   · Quy trình thu hồi & thanh lý tài sản sau bồi thường (01/07/2025)
   · Công văn nghiệp vụ PTI: CV 4406 (cam kết CLDV), CV 3653 (ảnh cấp đơn),
     CV 1959 (thanh toán phí), CV 5884 (GPLX & định giá TS), CV 3770 + CV 25
     (phí tái tục VCX); sổ tay nội bộ "Tiện ích tra cứu CV"
   · Pháp luật: Luật KDBH 2022 + Luật 139/2025 (dùng VBHN 31/VBHN-VPQH),
     NĐ 46/2023, TT 67/2023/TT-BTC, NĐ 67/2023, NĐ 220/2026, BLDS 91/2015
   · Sổ tay tham khảo (gắn v: 0): Bộ Q&A 300 tình huống, Nhóm tình huống thực tế GĐBT
   Văn bản ban hành trước QT PTI.XCG.20 được gắn v: 0 (tham khảo).
   Bản gốc lưu tại docs/Kho tri thức (đã .gitignore — KHÔNG đẩy lên GitHub Pages).
   ⚠ Chỉ đưa vào đây nội dung có tài liệu gốc trong docs/ — tài liệu bị gỡ khỏi kho
     thì gỡ luôn mục tương ứng (xem CLAUDE.md, mục Trợ lý ảo GĐV).

   CÁCH BỔ SUNG / SỬA NỘI DUNG
   Mỗi mục trong TL_KB:
     id : mã duy nhất (không trùng)
     g  : nhóm — 'tiepnhan' | 'giamdinh' | 'duyetgia' | 'chungtu' | 'saubt' |
          'quytac' | 'tnds' | 'nt3' | 'cldv' | 'phaply' | 'tinhhuong' |
          'bieumau' | 'dulieu'
     q  : câu hỏi chuẩn (hiện trên nút gợi ý)
     k  : từ khoá/cụm từ đồng nghĩa (có dấu hay không dấu đều được)
     a  : câu trả lời. Định dạng rút gọn, mỗi dòng một ý:
            "- nội dung"  → gạch đầu dòng
            "|a|b|c|"     → dòng bảng (dòng bảng đầu tiên là tiêu đề)
            "!! nội dung" → khung lưu ý màu cam
            "**chữ đậm**" → in đậm
     s  : nguồn (văn bản, mục) — luôn ghi để GĐV đối chiếu bản gốc
     r  : (tuỳ chọn) mảng id các mục liên quan
     v  : (tuỳ chọn) 0 = nội dung tham khảo, chưa phải quy định hiện hành
   ⚠ Không đưa họ tên, số điện thoại, email cán bộ vào đây — file này nằm cùng
     trang web, ai mở được trang đều đọc được.
   ══════════════════════════════════════════════════════════════════════════ */

window.TL_META = {
  version: '2026-09-28',
  basis: 'QT PTI.XCG.20 (12/2024) · QT VCX 109/2025 · QT 110/2025 · NĐ 67/2023 (sửa bởi NĐ 220/2026) · Luật KDBH 2022 (sửa bởi Luật 139/2025) · NĐ 46/2023 & TT 67/2023/TT-BTC'
};

/* Nhóm chủ đề — thứ tự hiển thị trên màn hình chào */
window.TL_GROUPS = [
  { id: 'tiepnhan', icon: '🚨', name: 'Tiếp nhận & hiện trường' },
  { id: 'giamdinh', icon: '🔍', name: 'Giám định chi tiết' },
  { id: 'duyetgia', icon: '💰', name: 'Duyệt giá & phương án' },
  { id: 'chungtu',  icon: '🧾', name: 'Chứng từ & thanh toán' },
  { id: 'saubt',    icon: '📁', name: 'Sau bồi thường & hệ thống' },
  { id: 'quytac',   icon: '📜', name: 'Quy tắc VCX 2025' },
  { id: 'tnds',     icon: '⚖️', name: 'TNDS & tạm ứng' },
  { id: 'nt3',      icon: '🚗', name: 'Phân lỗi & đòi NT3' },
  { id: 'cldv',     icon: '⭐', name: 'CLDV & công văn PTI' },
  { id: 'phaply',   icon: '📕', name: 'Khung pháp lý' },
  { id: 'tinhhuong',icon: '🧩', name: 'Tình huống thực tế' },
  { id: 'bieumau',  icon: '📝', name: 'Biểu mẫu' },
  { id: 'dulieu',   icon: '📊', name: 'Tra cứu hồ sơ' }
];

/* Danh mục biểu mẫu. code: mã tra cứu; step: bước quy trình dùng mẫu */
window.TL_FORMS = [
  { code: '20.01',  step: 'B2', name: 'Hướng dẫn cung cấp chứng từ tạm ứng BT thiệt hại người – BH BB TNDS' },
  { code: '20.01A', step: 'B2', name: 'Hướng dẫn thu thập hồ sơ vật chất xe (VCX)' },
  { code: '20.01B', step: 'B2', name: 'Hướng dẫn thu thập hồ sơ TNDS của chủ xe đối với hàng hoá trên xe' },
  { code: '20.01C', step: 'B2', name: 'Hướng dẫn thu thập hồ sơ TNDS đối với NT3 & hành khách, BH lái phụ xe & người ngồi trên xe' },
  { code: '20.02',  step: 'B2', name: 'Thông báo tai nạn và yêu cầu bồi thường' },
  { code: '20.02A', step: 'B2', name: 'Phụ lục Thông báo tai nạn & YCBT (tạm ứng BT về người – BB TNDS)' },
  { code: '20.03',  step: 'B2', name: 'Biên bản giám định hiện trường – Sơ đồ hiện trường' },
  { code: '20.04',  step: 'B2', name: 'Biên bản xác minh (hiện trường/thông tin)' },
  { code: '20.05',  step: 'B4', name: 'Tờ trình tạm ứng BT thiệt hại sức khoẻ, tính mạng – BH BB TNDS' },
  { code: '20.06',  step: 'B5', name: 'Thông báo chi tạm ứng bồi thường' },
  { code: '20.07',  step: 'B5', name: 'Đề nghị chi tạm ứng bồi thường' },
  { code: '20.08',  step: 'B3', name: 'Xác minh phí (lấy từ phần mềm nghiệp vụ)' },
  { code: '20.09',  step: 'B2', name: 'Báo cáo giám định' },
  { code: '20.10',  step: 'B2', name: 'Trưng cầu kết luận điều tra (công an/giám định chuyên ngành)' },
  { code: '20.11',  step: 'B2', name: 'Xác định điều tra nguyên nhân tổn thất (thống nhất trưng cầu GĐ độc lập chuyên ngành)' },
  { code: '20.12',  step: 'B3', name: 'Giấy yêu cầu giám định (thuê giám định độc lập)' },
  { code: '20.13',  step: 'B2', name: 'Công văn xin sao y hồ sơ công an' },
  { code: '20.14',  step: 'B3', name: 'Thông báo mời các bên liên quan tham gia giám định' },
  { code: '20.15',  step: 'B3', name: 'Biên bản giám định thiệt hại vật chất xe' },
  { code: '20.15A', step: 'B3', name: 'Biên bản giám định (TNDS tài sản & hàng hoá)' },
  { code: '20.16',  step: 'B3', name: 'Thông báo kết quả giám định' },
  { code: '20.17',  step: 'B3', name: 'Biên bản làm việc các bên' },
  { code: '20.18',  step: 'B3', name: 'Biên bản thoả thuận TNDS' },
  { code: '20.19',  step: 'B3', name: 'Văn bản NĐBH yêu cầu NT3 bồi thường' },
  { code: '20.20',  step: 'B3', name: 'Công văn đề nghị ngân hàng/TCTD xác nhận quyền thụ hưởng' },
  { code: '20.20A', step: 'B3', name: 'Công văn gửi ngân hàng xác nhận phương thức giải quyết bồi thường' },
  { code: '20.21',  step: 'B3', name: 'Công văn gửi cơ quan chức năng xác minh thông tin bằng lái xe' },
  { code: '20.22',  step: 'B4', name: 'Bảng kê thiệt hại XCG (22A tài sản khác · 22B hàng hoá · 22C cứu hộ · 22D người · 22E người – tạm ứng · 22F thù lao GĐ · 22G chi phí GĐ/khác)' },
  { code: '20.23',  step: 'B4', name: 'Giấy yêu cầu bồi thường bằng tiền' },
  { code: '20.24',  step: 'B4', name: 'Tờ trình từ chối bồi thường' },
  { code: '20.25',  step: 'B4', name: 'Tờ trình phương án GQBT vật chất xe (25A TNDS NT3 & hành khách · 25B TNDS hàng hoá · 25C lái phụ xe & người ngồi trên xe)' },
  { code: '20.26',  step: 'B4', name: 'Tờ trình tạm ứng bảo hiểm tự nguyện' },
  { code: '20.27',  step: 'B5', name: 'Thông báo phương án ghi nhận giá (chưa xác định phạm vi BH)' },
  { code: '20.28',  step: 'B5', name: 'Bảng kê ghi nhận chi phí khắc phục thiệt hại' },
  { code: '20.29',  step: 'B5', name: 'Uỷ quyền sửa chữa (để PTI khấu trừ thuế GTGT khi hoá đơn mang tên NĐBH)' },
  { code: '20.30',  step: 'B5', name: 'Thông báo từ chối bồi thường' },
  { code: '20.31',  step: 'B5', name: 'Thông báo chi phí khắc phục thiệt hại (đòi NT3)' },
  { code: '20.32',  step: 'B5', name: 'Giấy chuyển giao quyền yêu cầu bồi hoàn' },
  { code: '20.33',  step: 'B7', name: 'Công văn PTI gửi cơ quan, toà án tham gia tố tụng' },
  { code: '20.34',  step: 'B5', name: 'Thông báo phương án giải quyết bồi thường' },
  { code: '20.35',  step: 'B5', name: 'Bảo lãnh thanh toán' },
  { code: '20.40',  step: 'B5', name: 'Hợp đồng sửa chữa (bắt buộc khi giá sửa chữa > 50 triệu chưa thuế)' },
  { code: '20.42',  step: 'B5', name: 'Giấy chuyển giao quyền sở hữu xe/xác xe (tổn thất toàn bộ)' },
  { code: '20.43',  step: 'B5', name: 'Biên bản bàn giao xe và chứng từ liên quan' },
  { code: '20.44',  step: 'B5', name: 'Giấy xác nhận phương án bồi thường (bản đủ · VCX rút gọn · VCX + cứu hộ)' },
  { code: '20.45',  step: 'B5', name: 'Biên bản thu hồi và ký gửi tài sản (vật tư thay thế)' },
  { code: '20.46',  step: 'B6', name: 'Đề nghị thanh toán bồi thường' },
  { code: '20.47',  step: 'B7', name: 'Công văn PTI đòi người thứ ba' },
  { code: '20.48',  step: 'B7', name: 'Công văn PTI gửi cơ quan chức năng khi chưa xác định được NT3' },
  { code: '20.49',  step: 'B7', name: 'Thông báo phương án bồi hoàn' },
  { code: '20.53',  step: 'B7', name: 'Biểu mẫu cập nhật tiến trình giải quyết & báo cáo' },
  { code: '20.54',  step: 'B7', name: 'Bảng kê đề nghị hoàn trả bồi thường (VP Miền lập)' },
  { code: '20.55',  step: 'B7', name: 'Bảng tổng hợp số tiền đề nghị hoàn trả tạm ứng (Phòng CS&QLCL lập)' },
  { code: '20.56',  step: 'B7', name: 'Đơn đề nghị hoàn trả tạm ứng bồi thường (gửi Quỹ BH XCG)' },
  { code: '20.57',  step: 'B7', name: 'Bảng kê khiếu nại hoàn ứng với Quỹ' },
  { code: '20.58',  step: 'B5', name: 'Biên bản ký gửi tài sản (xác xe, lưu kho/bãi)' },
  { code: 'NVXE039.01.12', step: 'NT3', name: 'Thông báo mời tham gia giám định thiệt hại (đòi NT3)' },
  { code: 'NVXE039.01.19', step: 'NT3', name: 'Thông báo kết quả giám định (gửi NT3, CQCN, DNBH của NT3)' },
  { code: 'NVXE039.01.20', step: 'NT3', name: 'Biên bản làm việc các bên' },
  { code: 'NVXE039.01.21', step: 'NT3', name: 'Biên bản thoả thuận bồi thường TNDS' },
  { code: 'NVXE039.01.42', step: 'B5',  name: 'Bảo lãnh thanh toán (lần 1)' },
  { code: 'NVXE039.01.47', step: 'NT3', name: 'Thông báo chi phí khắc phục thiệt hại đã được PTI ghi nhận' },
  { code: 'NVXE039.01.56', step: 'NT3', name: 'Văn bản NĐBH yêu cầu NT3 bồi thường' },
  { code: 'NVXE039.01.57', step: 'NT3', name: 'Giấy chuyển giao quyền yêu cầu NT3 bồi hoàn kèm thông báo các bên' },
  { code: 'NVXE039.01.58', step: 'NT3', name: 'Công văn PTI gửi cơ quan, toà án tham gia tố tụng' },
  { code: 'NVXE039.01.59', step: 'NT3', name: 'Công văn PTI yêu cầu NT3 bồi hoàn' },
  { code: 'NVXE039.01.60', step: 'NT3', name: 'Thông báo cho PTI nhận lại tài sản (chưa xác định NT3)' },
  { code: 'NVXE039.01.61', step: 'NT3', name: 'Thông báo phương án bồi hoàn' },
  { code: 'NVXE039.01.62', step: 'NT3', name: 'Báo cáo xác minh năng lực tài chính NT3' },
  { code: 'NVXE039.01.63', step: 'NT3', name: 'Thư mời NT3 thương thảo bồi thường' },
  { code: 'NVXE039.01.64', step: 'NT3', name: 'Biên bản thương thảo bồi thường với NT3' },
  { code: 'NVXE039.01.65', step: 'NT3', name: 'Tờ trình đề xuất phương án thu đòi NT3' },
  { code: 'NVXE039.01.72', step: 'B5',  name: 'Bảo lãnh thanh toán (lần 2/điều chỉnh)' }
];

/* Thời hạn Bước 4 theo số tiền (QT PTI.XCG.20 mục 4.2.3.2 & 4.2.3.3 — giờ làm việc) */
window.TL_SLA_B4 = [
  { max: 20e6,     label: 'Dưới 20 triệu',    gdv: '4 giờ',  cv: '4 giờ'  },
  { max: 50e6,     label: '20 – 50 triệu',    gdv: '10 giờ', cv: '06 giờ' },
  { max: 100e6 + 1, label: '50 – 100 triệu',  gdv: '24 giờ', cv: '08 giờ' },
  { max: Infinity, label: 'Trên 100 triệu',   gdv: '32 giờ', cv: '16 giờ' }
];

/* Trạng thái hồ sơ trên phần mềm → bước quy trình PTI.XCG.20 và việc cần làm tiếp.
   re: biểu thức so khớp trên trạng thái đã bỏ dấu, chữ thường. Duyệt theo thứ tự, gặp là dừng. */
window.TL_STATUS = [
  { re: 'huy', step: 'Luồng hủy', name: 'Hủy / đề nghị hủy hồ sơ',
    todo: 'Hồ sơ đang trong luồng hủy. Chưa có báo giá: chọn kiểu duyệt "Hủy hồ sơ" tại màn 3-Báo giá. Đã có báo giá: nhập Giảm trừ BT = 100% kèm lý do. Chọn người Check rồi gửi yêu cầu; Check/Validate duyệt hoặc từ chối hủy.' },
  { re: 'da thanh toan', step: 'Bước 7', name: 'Đã thanh toán – triển khai sau bồi thường',
    todo: 'Trong 02 ngày sau khi bồi thường: thông báo chấm dứt HĐBH/GCNBH nếu BT bằng tiền và hợp đồng còn hiệu lực; thu đòi NT3 (PL.20.04); thu đòi tái/đồng BH (PL.20.17); bàn giao tài sản thu hồi cho bộ phận thanh lý. Lưu bản cứng 05 năm (PL.20.18).' },
  { re: 'cho thanh toan|da duyet de nghi thanh toan', step: 'Bước 6', name: 'Chờ chi tiền bồi thường',
    todo: 'Trung tâm thanh toán chi tự động theo ngày hạn thanh toán của GĐV. Trường hợp không xử lý được tự động: trong 02 ngày làm việc kể từ khi nhận yêu cầu.' },
  { re: 'de nghi thanh toan', step: 'Bước 6', name: 'Đề nghị thanh toán đang trình/duyệt',
    todo: 'Người có thẩm quyền check & validate đề nghị thanh toán tối đa 02 ngày kể từ khi nhận đề xuất (PL.20.16). Kiểm tra lại thông tin thụ hưởng: đối tượng, số tiền, chủ tài khoản, số tài khoản, hình thức nhận tiền.' },
  { re: 'bao lanh', step: 'Bước 5', name: 'Bảo lãnh thanh toán',
    todo: 'Giám sát sửa chữa → nghiệm thu → thu hồi vật tư (≤ 02 ngày sau nghiệm thu, BM 20.45) → thu thập, kiểm tra, upload chứng từ sửa chữa (≤ 01 ngày kể từ khi nhận) → lập Đề nghị thanh toán BM 20.46 (≤ 03 ngày sau khi đủ chứng từ).' },
  { re: 'da duyet', step: 'Bước 5', name: 'Đã duyệt phương án/giá',
    todo: 'Gửi thông báo phương án cho NĐBH/gara/người thụ hưởng trong 04 giờ sau khi được duyệt (BM 20.34 hoặc 20.27, kèm bảng kê 20.28; bảo lãnh BM 20.35 nếu có). Lập HĐ sửa chữa BM 20.40 nếu giá > 50 triệu chưa thuế; giám sát sửa chữa.' },
  { re: 'cong nhan gia|duyet gia|trinh|check|cho duyet', step: 'Bước 4', name: 'Trình / check / validate phương án – giá',
    todo: 'Hồ sơ đang ở khâu xét duyệt phương án (công nhận giá/duyệt giá). Thời hạn theo số tiền ước: xem bảng bên dưới. Hồ sơ chưa xác định được phạm vi BH thì gửi Thông báo ghi nhận chi phí BM 20.27 + bảng kê 20.28 và tiếp tục thu thập chứng từ.' },
  { re: 'giam dinh chi tiet', step: 'Bước 3', name: 'Giám định chi tiết & thu thập hồ sơ',
    todo: 'GĐ chi tiết trong 4–8 giờ sau khi xe về xưởng; gửi kết quả GĐ cho gara lấy báo giá ≤ 02 giờ; upload chứng từ ≤ 04 giờ; lập bảng kê & tờ trình phương án ≤ 01 ngày kể từ khi kết thúc GĐ thiệt hại.' },
  { re: '^(-|chua giai quyet|)$', step: 'Bước 1–2', name: 'Chưa cập nhật trạng thái / mới tiếp nhận',
    todo: 'Kiểm tra đã GĐ/xác minh hiện trường theo PL.20.02 chưa; khởi tạo HSBT và nhập ước bồi thường trên phần mềm trong tối đa 02 ngày kể từ ngày tiếp nhận thông tin tổn thất (mục 2.5).' }
];

window.TL_KB = [];
/* ─── 1. TIẾP NHẬN & HIỆN TRƯỜNG (Bước 1–2) ─── */
TL_KB.push(
{ id: 'tn-quytrinh', g: 'tiepnhan',
  q: 'Quy trình giải quyết bồi thường XCG gồm những bước nào?',
  k: ['quy trình', 'các bước', '7 bước', 'sơ đồ quy trình', 'quy trình bồi thường', 'quy trình giám định', 'PTI.XCG.20', 'tổng quan quy trình'],
  a: `Quy trình giải quyết YCBT NV XCG **PTI.XCG.20** (ban hành 20/12/2024) gồm 7 bước:
|Bước|Nội dung|Phụ lục chính|
|B1|Tiếp nhận & xử lý thông tin tổn thất (TVV, GĐV)|PL 01, 02, 03|
|B2|GĐ hiện trường / xác minh hiện trường, xác minh thông tin|PL 02, 04, 05, 10–14, 16|
|B3|Giám định chi tiết, thu thập hồ sơ – chứng từ|PL 06, 10–14|
|B4|Lập bảng kê, xét phạm vi BH, đề xuất phương án, tạm ứng|PL 07, 08, 09, 15, 16|
|B5|Thông báo phương án, giám sát khắc phục, thu hồi vật tư, thu chứng từ|PL 07, 15, 17, 18|
|B6|Lập đề nghị thanh toán, thanh toán bồi thường|PL 15, 16|
|B7|Sau bồi thường: đòi NT3, tái/đồng BH, hoàn ứng, thanh lý, lưu hồ sơ|PL 04, 16, 17, 18|
- Mỗi bước đều theo cơ chế **Make – Check – Validate** (PL.20.16).
- Chưa xác định được phạm vi BH ở B5 thì quay lại B4; đã xác định thì chuyển B6.
- Quy trình này thay thế QT giám định, QT bồi thường XCG và QT phối hợp thế quyền đòi NT3 trước đây.`,
  s: 'QT PTI.XCG.20 – Sơ đồ tổng quan', r: ['tn-hotline', 'ht-khinao', 'gd-thoigian', 'dg-thoihan'] },

{ id: 'tn-hotline', g: 'tiepnhan',
  q: 'Tổng đài tiếp nhận thông tin tai nạn và chuyển cho GĐV thế nào?',
  k: ['tổng đài', 'hotline', 'call center', '1900545475', '1900 54 54 75', 'báo tai nạn', 'tiếp nhận thông tin', 'tư vấn viên', 'TVV', 'vùng chờ'],
  a: `Mọi thông tin tổn thất báo PTI qua **Call center 1900 54 54 75** (24/7).
- TVV tiếp nhận, hướng dẫn ban đầu trong **tối đa 15 phút**. Thông tin thu thập: người báo & SĐT, số HĐ/GCNBH, biển số/số khung, ngày giờ – địa điểm – diễn biến, **họ tên người điều khiển (bắt buộc)**, lái xe còn ở hiện trường không, xe tải có chở hàng không.
- TVV nhập Form tiếp nhận lên **vùng chờ**, chuyển thông tin cho GĐV trực địa bàn qua **App giám định** (còn hiện trường thì gọi điện thêm).
- Sau tối đa 15 phút TVV gọi lại người khai báo xác nhận GĐV đã hỗ trợ.
- Tổn thất ước **từ 20 triệu**: email tự động tới phòng GĐ hiện trường khu vực và LĐ VP Miền. Đơn có **tái/đồng BH** hoặc KH **VIP**: hệ thống tự nhận diện, gửi email tới đầu mối liên quan.
- Thông tin đặc biệt cần lưu ý: người khai báo gay gắt, báo nhiều tổn thất liên tiếp, lái xe có dấu hiệu không tỉnh táo, không hợp tác.`,
  s: 'PL.PTI.XCG.20.01 – mục 1, 2; QT PTI.XCG.20 – mục 1.1', r: ['tn-gdv-lienhe', 'tn-khonghopdong'] },

{ id: 'tn-gdv-lienhe', g: 'tiepnhan',
  q: 'Nhận thông tin tai nạn, GĐV phải liên hệ khách hàng và báo cáo trong bao lâu?',
  k: ['liên hệ khách hàng', 'gọi khách', 'bao lâu', 'thời gian liên hệ', 'phút', 'báo cáo lãnh đạo', 'vụ phức tạp', 'hướng dẫn ban đầu'],
  a: `- **Liên hệ NĐBH/lái xe:** tối đa **10 phút** kể từ khi nhận thông tin từ TVV (QT mục 1.2); PL.20.01 yêu cầu **trong vòng 5 phút**.
- **Còn hiện trường:** xác định chính xác địa điểm, tình huống (đâm vật cố định hay va chạm NT3), xin ảnh tổn thất, báo thời gian dự kiến tới, hướng dẫn giữ nguyên hiện trạng.
- **Không còn hiện trường:** đánh giá sơ bộ thiệt hại & yếu tố phạm vi BH, phân loại xem có phải xác minh hiện trường không, hẹn lịch GĐ, hướng dẫn giấy tờ.
- **Vụ phức tạp, nghiêm trọng:** báo cáo ngay lãnh đạo theo thẩm quyền check & validate (điện thoại, Zalo, Dlink…) — tối đa **30 phút** sau khi xử lý thông tin.
!! Phục vụ hiện trường 24/7 (xem thời hạn có mặt tại hiện trường).`,
  s: 'QT PTI.XCG.20 – mục 1.2, 1.3; PL.PTI.XCG.20.01 – mục 3', r: ['tn-dacbiet', 'tn-phuctap', 'ht-thoigian'] },

{ id: 'tn-dacbiet', g: 'tiepnhan',
  q: 'Hướng dẫn khách xử lý ban đầu khi cháy xe, ngập nước, lật xe, mất cắp, va chạm NT3?',
  k: ['xử lý ban đầu', 'cháy xe', 'ngập nước', 'xe ngập', 'thủy kích', 'lật xe', 'lao xuống vực', 'mất cắp', 'mất trộm', 'hướng dẫn khách', 'xuống kính', 'không khởi động lại'],
  a: `Hướng dẫn chung (còn hiện trường): cứu chữa người bị nạn; báo cơ quan chức năng gần nhất; bảo vệ hiện trường & tài sản, **không tự di chuyển xe** khi chưa có ý kiến PTI; chụp ảnh ban đầu **4 phía** (trước, sau, phải, trái) của xe tổn thất và các xe liên quan; báo thông tin cứu hộ (Pan).
- **Cháy xe:** biện pháp chữa cháy ban đầu hạn chế thiệt hại; báo cảnh sát PCCC hoặc CQCN thụ lý.
- **Mất cắp toàn bộ:** báo ngay cơ quan công an.
- **Lật xe/lao xuống vực:** rút/tháo ắc quy, hạn chế dầu phát tán gây cháy nổ.
- **Ngập nước:** tắt máy, **không đề nổ lại**, xuống kính, hạn chế mở cửa (ra bằng cửa sổ), tháo cọc âm ắc quy, đẩy xe lên chỗ cao.
- **Va chạm NT3:** không tự thoả thuận bồi thường với NT3 khi chưa có ý kiến PTI; bảo lưu quyền đòi NT3 cho PTI.`,
  s: 'PL.PTI.XCG.20.01 – mục 1.2, 3.1.1', r: ['ht-dacthu', 'gd-ngapnuoc', 'gd-chay', 'nt3-khongbaoluu'] },

{ id: 'tn-khonglienlac', g: 'tiepnhan',
  q: 'Không liên lạc được hoặc khách không phối hợp khi còn hiện trường thì làm gì?',
  k: ['không liên lạc được', 'không phối hợp', 'khách không nghe máy', 'tin nhắn mẫu', 'nhắn tin'],
  a: `- Gửi **tin nhắn theo mẫu** PL.20.01: chào, nêu PTI đã nhận thông báo tổn thất xe (biển số, thời gian, địa điểm), nêu việc không liên lạc được/khách chưa phối hợp; đề nghị **giữ nguyên hiện trường**, liên hệ GĐV (tên, SĐT) và thông báo cơ quan chức năng nếu cần.
- Đồng thời báo **tổng đài** để cập nhật & phối hợp; TVV có thể gọi xác nhận lại với lái xe/NĐBH.
!! Theo Quy tắc VCX 2025, không ký biên bản GĐ/xác minh, không cung cấp tài liệu, hoặc lái xe từ chối xét nghiệm nồng độ cồn theo yêu cầu PTI đều bị coi là **không phối hợp** (có thể bị giảm trừ bồi thường).`,
  s: 'PL.PTI.XCG.20.01 – mục 3; QT VCX 109/2025 – Điều 7.2.7', r: ['qt-nghiavu', 'dg-giamtru'] },

{ id: 'tn-khonghopdong', g: 'tiepnhan',
  q: 'Không tìm thấy hợp đồng bảo hiểm trên hệ thống thì xử lý thế nào?',
  k: ['không tìm thấy hợp đồng', 'không có hợp đồng', 'đơn chưa nhập', 'hợp đồng giả', 'GCNBH giả', 'chưa có trên hệ thống'],
  a: `- Hướng dẫn khách kiểm tra đơn vị cấp đơn/đầu mối/đại lý.
- **Khách cung cấp được thông tin:** ghi nhận đơn vị cấp đơn, vẫn tiếp nhận & chuyển GĐV; liên hệ đơn vị cấp đơn/Ban NV xác thực đơn chưa nhập; báo KTV nhập đơn lên phần mềm.
- **Không cung cấp được:** hướng dẫn tiếp tục tìm thông tin từ chủ xe, chụp ảnh sơ bộ hiện trường, báo công an nếu cần; xác nhận PTI chưa có căn cứ giải quyết; hẹn báo lại khi có thông tin.
!! Nghi ngờ HĐBH/GCNBH **giả** → báo ngay bộ phận **An ninh nội bộ**.`,
  s: 'PL.PTI.XCG.20.01 – mục IV', r: ['gd-xmp'] },

{ id: 'tn-phuctap', g: 'tiepnhan',
  q: 'Thế nào là vụ tai nạn phức tạp?',
  k: ['vụ phức tạp', 'tai nạn phức tạp', 'định nghĩa phức tạp', 'nghiêm trọng'],
  a: `Theo QT PTI.XCG.20, vụ tai nạn phức tạp là vụ có một trong các yếu tố:
- Có dấu hiệu **trục lợi**.
- Liên quan NT3 mà các bên **không thống nhất** diễn biến, nguyên nhân, lỗi, thiệt hại, trách nhiệm bồi thường.
- Có tranh chấp giữa các bên.
- Thiệt hại nghiêm trọng về người/tài sản.
- Liên quan quyền lợi BH của nhiều bên; thiệt hại tài sản đặc biệt.
Vụ phức tạp phải báo cáo lãnh đạo ngay (≤ 30 phút) và thường phải lập **Báo cáo giám định BM 20.09**.`,
  s: 'QT PTI.XCG.20 – Giải thích từ ngữ; mục 1.3, 2.4', r: ['ht-baocao', 'ht-cqcn'] },

{ id: 'ht-khinao', g: 'tiepnhan',
  q: 'Khi nào bắt buộc giám định trực tiếp tại hiện trường, khi nào được giám định từ xa?',
  k: ['giám định từ xa', 'giám định trực tiếp', 'bắt buộc ra hiện trường', 'có phải ra hiện trường', 'đâm vật cố định', 'vật cố định', 'xe sang', 'giám định online', 'xuống hiện trường', 'ra hiện trường', 'cần ra hiện trường', 'xước nhẹ', 'va chạm nhẹ', 'đâm cột'],
  a: `Bảng tình huống PL.20.02 (còn hiện trường):
|Tình huống|Được GĐ từ xa|Phải GĐ trực tiếp|
|Đâm vật cố định / đâm đuôi xe phía trước khi đang lưu thông|Chỉ xước, móp thân vỏ, ước < 20 triệu, không phải xe sang, GĐV xác định được phạm vi BH|Vỡ ≤ 4 phụ tùng xe sang; gãy vỡ > 4 phụ tùng; móp bẹp phía sau xe; ước > 20 triệu|
|Va chạm NT3 (trừ đâm đuôi)|Như trên và nhận định không có trách nhiệm NT3|Có trách nhiệm NT3, hoặc các mức thiệt hại lớn như trên|
|Ngập nước chết máy · Cháy · Lật, đổ|—|Luôn GĐ trực tiếp (ngập: trừ khi thời tiết không thể tiếp cận)|
- Xe sang: Audi, BMW, Mercedes, Land Rover, Rolls-Royce, Bentley, Cadillac, Ferrari, Porsche.
- Xe còn ở vị trí TN hoặc đã di dời trong bán kính khoảng **1 km** và quay lại được = **còn hiện trường** → phải GĐ hiện trường.
- GĐ từ xa: hướng dẫn KH chụp ảnh hiện trường gửi GĐV kiểm tra, lưu hồ sơ. Khuyến khích GĐ trực tiếp.
!! Hiện trường không rõ ràng, nghi dựng hiện trường/trục lợi → ra hiện trường ngay hoặc xác minh lại. Không GĐ trực tiếp đúng quy định → phải giải trình trong Tờ trình phương án.`,
  s: 'PL.PTI.XCG.20.02 – mục 1', r: ['ht-thoigian', 'ht-xacminh', 'ht-kiemtra'] },

{ id: 'ht-thoigian', g: 'tiepnhan',
  q: 'GĐV phải có mặt tại hiện trường trong bao lâu? Giám định hiện trường tối đa bao lâu?',
  k: ['có mặt hiện trường', 'thời gian đến hiện trường', 'bao lâu', '30 phút', '60 phút', 'nội thành', 'ngoại thành', 'thời gian giám định hiện trường'],
  a: `- Hỗ trợ **24/7**: tới hiện trường trong **30 phút** (nội thành) và **60 phút** (ngoại thành có đơn vị PTI). Trường hợp khác: căn cứ giao thông, khoảng cách, báo NĐBH thời gian dự kiến tới (gọi/nhắn tin).
- Giám định hiện trường: tối đa **3 giờ** (trừ vụ hiện trường phức tạp). TP khu vực check & validate.
- Kết thúc: hướng dẫn NĐBH di chuyển xe khỏi hiện trường và các bước tiếp theo.
!! Cam kết CLDV (CV 4406/2021): GĐV tới hiện trường 30 phút nội thành, 60 phút ngoại thành; chia sẻ vị trí, hành trình di chuyển cho khách hàng.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.1; QT PTI.XCG.20 – mục 2.1; CV 4406/PTI-BHXCG (22/10/2021) – PL01 mục II', r: ['ht-kiemtra', 'ht-baocao', 'cl-camket'] },

{ id: 'ht-kiemtra', g: 'tiepnhan',
  q: 'Tại hiện trường GĐV cần kiểm tra, thu thập những gì?',
  k: ['kiểm tra tại hiện trường', 'thu thập tại hiện trường', 'giấy tờ hiện trường', 'giám định hiện trường', 'ghi nhận hiện trường', 'camera hành trình', 'nhân chứng'],
  a: `**Giấy tờ (kiểm tra & sao chụp):**
- GCNBH (loại hình, DN cấp, hiệu lực); GPLX (tên, ảnh đúng người lái, hạng, hiệu lực); CCCD/hộ chiếu lái xe (với BB TNDS); GCN kiểm định (hiệu lực).
**Ghi nhận hiện trường:**
- Thời gian, địa điểm; người điều khiển (họ tên, địa chỉ, SĐT), có ở hiện trường không, lý do vắng; tình trạng lái xe ngay trước TN.
- Đối tượng tổn thất: biển số, nhãn hiệu, **số khung (VIN)**.
- Lời khai nhân chứng (hướng/chiều đi, diễn biến); số người thực tế trên xe; người bị thương.
- **Camera** hành trình, camera giao thông, camera nhà dân, trong/ngoài xe.
- Dấu vết TN, tình trạng hiện trường, thời tiết, **biển báo** có hiệu lực tại đoạn đường.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.2.1', r: ['ht-dacthu', 'ht-chupanh', 'ht-bienban'] },

{ id: 'ht-dacthu', g: 'tiepnhan',
  q: 'Giám định hiện trường trường hợp đặc thù: xe kinh doanh vận tải, xe tải, xe cẩu, xe ngập, vỡ đèn đầu xe?',
  k: ['xe kinh doanh vận tải', 'GPS', 'giám sát hành trình', 'xe tải', 'tải trọng', 'phiếu cân', 'xe cẩu', 'xe chuyên dùng', 'chứng chỉ vận hành cẩu', 'lọc gió', 'đèn pha', 'vỡ đèn', 'đầu xe'],
  a: `- **Xe kinh doanh vận tải:** thu dữ liệu **GPS** (hành trình, thời gian, tốc độ trước/ngay lúc TN).
- **Xe tải chở hàng:** xác định tải trọng (phiếu cân, ảnh cân xe, phiếu vận chuyển), chủng loại hàng, kết cấu thùng, quy cách chằng buộc; vận đơn, hoá đơn, phiếu xuất kho; niêm phong/kẹp chì container.
- **Xe cẩu/xe chuyên dùng (thiệt hại do vận hành thiết bị):** chứng chỉ vận hành cẩu, đăng kiểm thiết bị, bảng nhôm thông số trên thân cẩu (góc nâng, góc quay, tải cho phép theo góc ra cần); ghi nhận chiều dài tay cẩu, góc ra cần, chân cẩu, cần điều khiển, hàng được cẩu.
- **Xe ngập nước:** tình trạng sàn xe, **lọc gió có nước không**, mức nước ngập tại hiện trường (trên thân xe/cây/tường).
- **Tổn thất đầu xe (đèn giá trị lớn):** kiểm tra đèn còn sáng không, dấu vết hốc đèn có phù hợp hiện trường, vít chân đèn còn nguyên vẹn; cho các bên ký xác nhận.
- Có lỗi NT3 là xe cơ giới (VCX) → làm theo PL.20.04 thế quyền.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.2.2', r: ['gd-ngapnuoc', 'nt3-thequyen'] },

{ id: 'ht-chupanh', g: 'tiepnhan',
  q: 'Chụp ảnh và đo đạc hiện trường như thế nào?',
  k: ['chụp ảnh hiện trường', 'đo hiện trường', 'ảnh hiện trường', 'App PTI SOS', 'mốc cố định', 'số VIN'],
  a: `- Chụp qua **App PTI SOS** (khuyến khích) hoặc điện thoại, máy ảnh.
- **Ảnh hiện trường:** tổng thể; đo & chụp vị trí đối tượng tổn thất, dấu vết, biển báo, **mốc cố định** (số nhà, cột điện, hướng di chuyển); vị trí phương tiện sau va chạm so với mốc; kích thước đo được.
- **Ảnh xe:** ảnh sơ bộ thể hiện **tổng thể xe + biển số**; ảnh **số khung/VIN**.
- **Tài sản khác:** chụp bao quát rồi cận cảnh từng hạng mục; khoanh vùng bằng phấn/bút; dùng thước đo diện tích.
- **Hàng hoá:** chụp bao quát, cận cảnh, đánh số khu vực (hư toàn bộ/một phần/không hư); chụp kho bãi, số container, kẹp chì, ảnh thu hồi.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.4', r: ['gd-chupanh', 'ht-bienban'] },

{ id: 'ht-bienban', g: 'tiepnhan',
  q: 'Lập biên bản giám định hiện trường và sơ đồ hiện trường theo mẫu nào?',
  k: ['biên bản hiện trường', 'sơ đồ hiện trường', 'BM 20.03', 'vẽ sơ đồ', 'không ký biên bản', 'biên bản ghi nhận thiệt hại'],
  a: `- Lập **Biên bản GĐ hiện trường & sơ đồ hiện trường theo BM.PTI.XCG.20.03**, kèm biên bản ghi nhận thiệt hại.
- Phải đủ thông tin và **chữ ký các bên** tham gia. Bên nào không ký → ghi rõ lý do (hoặc GĐV ghi rõ lý do).
- Tài sản NT3 không phải xe cơ giới → Biên bản GĐ thiệt hại **BM 20.15A** (tên, số lượng, kích thước, tình trạng, năm SX, chất liệu, diện tích…).
- Biên bản GĐ hiện trường cũng là **chứng từ thanh toán thù lao GĐ hiện trường**.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.2.3, 2.5; PL.PTI.XCG.20.09 – mục 3', r: ['ht-baocao', 'sb-thulao'] },

{ id: 'ht-xacminh', g: 'tiepnhan',
  q: 'Khi nào phải xác minh hiện trường, xác minh thông tin (vụ không còn hiện trường)?',
  k: ['xác minh hiện trường', 'xác minh thông tin', 'không còn hiện trường', 'biên bản xác minh', 'BM 20.04'],
  a: `Vụ **không còn hiện trường** phải xác minh khi:
- Tổn thất **không phù hợp** thông tin khai báo.
- Vụ thuộc BH BB TNDS, TNDS tự nguyện, BH lái phụ xe & người ngồi trên xe, hàng hoá trên xe.
- Tổn thất phù hợp khai báo nhưng ước **từ 50 triệu trở lên** (VCX).
- Tổn thất liên quan **NT3**; trường hợp khác nếu cần.
**Nội dung:** địa điểm, thời gian, diễn biến, dấu vết còn lại, biển báo, **camera** xung quanh, người điều khiển, các bên liên quan; thiệt hại người → xác minh đối tượng, mức độ tổn thương, thoả thuận bồi thường.
- Chụp ảnh xác minh; lập **Biên bản xác minh BM.PTI.XCG.20.04**.
- Thời hạn: tối đa **01 ngày** kể từ khi nhận thông báo tổn thất. TP khu vực check & validate.`,
  s: 'QT PTI.XCG.20 – mục 2.2; PL.PTI.XCG.20.02 – mục 3', r: ['ht-khinao', 'ht-baocao'] },

{ id: 'ht-baocao', g: 'tiepnhan',
  q: 'Khi nào phải lập Báo cáo giám định bằng văn bản (BM 20.09)?',
  k: ['báo cáo giám định', 'BM 20.09', 'báo cáo bằng văn bản', 'báo cáo lãnh đạo', 'báo cáo sơ bộ', 'check validate báo cáo', 'trên 20 triệu', 'phải báo cáo'],
  a: `Mọi vụ GĐ/xác minh hiện trường đều báo cáo lãnh đạo theo thẩm quyền (điện thoại, Zalo, Viber, Dlink…) **≤ 15 phút** sau khi kết thúc. Người thẩm quyền phản hồi: ước < 100 triệu ≤ 15 phút; > 100 triệu ≤ 30 phút.
**Lập Báo cáo GĐ bằng văn bản BM.PTI.XCG.20.09** (≤ 02 ngày từ khi tiếp nhận thông tin) khi:
- Tổn thất **> 20 triệu/1 loại hình** nghiệp vụ; liên quan trách nhiệm NT3; có dấu hiệu trục lợi.
- TN trong **30 ngày đầu** hiệu lực BH (trừ xe tái tục liên tục), hoặc gần ngày khôi phục/sửa đổi HĐBH (trong 30 ngày).
- Dấu vết không phù hợp diễn biến; phải thuê GĐ độc lập/trưng cầu CQCN; các bên không thống nhất kết quả GĐ; tổn thất phức tạp.
- GĐV không thực hiện GĐ hiện trường theo quy định; mất trộm, cướp toàn bộ xe; xác minh không ghi nhận được thông tin.
- Check & validate báo cáo: ≤ 01 ngày (TP giám định; có thuê GĐ độc lập/trưng cầu thì LĐ VP Miền validate).`,
  s: 'QT PTI.XCG.20 – mục 2.4', r: ['tn-phuctap', 'gd-thuegd', 'ht-cqcn'] },

{ id: 'ht-mohs', g: 'tiepnhan',
  q: 'Thời hạn khởi tạo hồ sơ bồi thường, nhập ước trên phần mềm là bao lâu?',
  k: ['mở hồ sơ', 'khởi tạo hồ sơ', 'nhập ước', 'ước bồi thường', 'mở HSBT', '2 ngày'],
  a: `- Sau GĐ/xác minh hiện trường và **trước Bước 3**, GĐV chọn loại hình BH phát sinh BT, **nhập ước bồi thường** để khởi tạo số HSBT trên phần mềm.
- Thời hạn: tối đa **02 ngày** kể từ ngày tiếp nhận thông tin tổn thất.`,
  s: 'QT PTI.XCG.20 – mục 2.5', r: ['dl-ton'] },

{ id: 'ht-bangiao', g: 'tiepnhan',
  q: 'Nơi sửa chữa ở địa bàn khác thì bàn giao hồ sơ hiện trường thế nào?',
  k: ['bàn giao hồ sơ', 'địa bàn khác', 'chuyển hồ sơ', 'bàn giao hiện trường'],
  a: `Khi nơi sửa chữa ở địa bàn khác nơi xảy ra TN, GĐV thụ lý hiện trường bàn giao trong tối đa **04 giờ** kể từ khi có thông tin nơi sửa chữa:
- Hồ sơ GĐ hiện trường/xác minh hiện trường.
- Số HSBT đã khởi tạo trên phần mềm.
- Tài liệu CQCN (công an, y tế…), GĐ độc lập, NT3 (nếu có).
Chưa đủ tài liệu → GĐV thụ lý hiện trường tiếp tục thu thập rồi bàn giao bổ sung.`,
  s: 'QT PTI.XCG.20 – mục 2.6', r: ['ht-mohs'] },

{ id: 'ht-thuthapct', g: 'tiepnhan',
  q: 'Hướng dẫn khách hàng thu thập chứng từ sau giám định dùng mẫu nào?',
  k: ['hướng dẫn chứng từ', 'thu thập chứng từ', 'giấy tờ cần nộp', 'thông báo tai nạn', 'BM 20.02', 'BM 20.01A', 'hồ sơ khách cần cung cấp'],
  a: `Sau GĐ/xác minh (tối đa **02 giờ**), GĐV hướng dẫn NĐBH hoàn thiện **Thông báo tai nạn & YCBT BM.PTI.XCG.20.02** và cung cấp chứng từ theo mẫu hướng dẫn:
|Loại hình|Mẫu hướng dẫn|
|Vật chất xe|BM 20.01A|
|BB TNDS – thiệt hại người & tạm ứng|BM 20.01 (+ Phụ lục TBTN BM 20.02A)|
|TNDS hàng hoá trên xe|BM 20.01B|
|TNDS NT3 & hành khách; lái phụ xe & người ngồi trên xe|BM 20.01C|`,
  s: 'QT PTI.XCG.20 – mục 2.3, 3.3; PL.PTI.XCG.20.02 – mục 4', r: ['qt-hoso', 'td-hoso'] },

{ id: 'ht-cqcn', g: 'tiepnhan',
  q: 'Khi nào phải thu thập hồ sơ công an, cơ quan chức năng?',
  k: ['hồ sơ công an', 'hồ sơ cơ quan chức năng', 'CQCN', 'CSGT', 'biên bản khám nghiệm', 'có cần công an', 'hồ sơ cảnh sát'],
  a: `**Bắt buộc** thu thập hồ sơ CQCN khi:
- Vụ liên quan NT3 mà các bên **không thống nhất** diễn biến, nguyên nhân, lỗi, thiệt hại, trách nhiệm; hoặc các bên cùng đề nghị công an thụ lý.
- Hiện trường, dấu vết, thông tin **không phù hợp lời khai**, có dấu hiệu trục lợi.
- Thiệt hại do **phá hoại**, huỷ hoại tài sản được BH.
- **Cháy xe** (trừ cháy một phần và PTI xác định được nguyên nhân).
- **Mất cắp, mất cướp**, lừa đảo chiếm đoạt tài sản.
- BH BB TNDS: theo quy định nhà nước từng thời kỳ.
Ngoài các trường hợp trên, GĐV báo cáo theo thẩm quyền để quyết định cần hay không cần hồ sơ CQCN.
**Hồ sơ công an thường gồm:** biên bản khám nghiệm hiện trường, sơ đồ & bản ảnh, biên bản khám nghiệm phương tiện, thông báo kết quả điều tra ban đầu, biên bản giải quyết TN/kết luận điều tra, biên bản hoà giải.`,
  s: 'PL.PTI.XCG.20.05 – mục I; PL.PTI.XCG.20.10 – mục 2.4', r: ['ht-baocao', 'gd-chay'] },

{ id: 'tn-qn-cam-ket', g: 'tiepnhan',
  q: 'Cam kết thời gian phục vụ khách hàng trên địa bàn Quảng Ninh là bao lâu?',
  k: ['Quảng Ninh', 'thời gian có mặt Quảng Ninh', 'Hạ Long', 'Uông Bí', 'Đông Triều', 'Cẩm Phả', 'Móng Cái', 'cam kết địa bàn', 'bao lâu ra hiện trường', 'SLA Quảng Ninh', 'duyệt giá bao lâu', 'tạm ứng 50%'],
  a: `Theo bản cam kết dịch vụ PTI Quảng Ninh (04/01/2019) — tham khảo khi trả lời khách hàng trên địa bàn:
- **Thông báo tai nạn:** chủ xe/lái xe gọi **1900 545475** trong vòng **30 phút** kể từ khi xảy ra tai nạn (Call Center 24/7).
- **Thời gian GĐV có mặt tại hiện trường (Quảng Ninh):** **30 phút** tại Hạ Long, Uông Bí, Đông Triều, Cẩm Phả, Móng Cái; tối đa **02 tiếng** tại các huyện, thị xã khác.
- **Giám định tại xưởng:** trong vòng **02 tiếng** kể từ khi xe được đưa về xưởng.
- **Duyệt giá sửa chữa** kể từ khi xưởng gửi báo giá:
|Số tiền sửa chữa|Thời hạn duyệt giá|
|Dưới 10 triệu|04 giờ làm việc|
|Từ 10 đến dưới 50 triệu|08 giờ làm việc|
|Từ 50 đến 100 triệu|24 giờ làm việc|
|Trên 100 triệu|05 ngày làm việc|
- **Tạm ứng:** khi KH hoặc xưởng có công văn yêu cầu, PTI có thể tạm ứng **50%** số tiền sửa chữa thuộc trách nhiệm.
- **Thanh toán bồi thường:** trong vòng **10 ngày** kể từ khi nhận đủ hồ sơ, chứng từ và hiện vật thu hồi.
- **Đối soát hồ sơ:** định kỳ **ngày 20 hằng tháng** PTI thông báo danh sách hồ sơ còn thiếu giấy tờ; KH có **10 ngày** kể từ ngày nhận thông báo để bổ sung (không tính thời gian cơ quan chức năng xử lý, trả hồ sơ).
!! Đây là bản cam kết cũ (2019) dùng để tham khảo mức phục vụ tại địa bàn. Thời hạn **duyệt giá và Bước 4 hiện hành** áp dụng theo QT PTI.XCG.20 và CV 4406 — nếu lệch nhau thì lấy quy trình hiện hành.`,
  s: 'Quy trình xử lý đền bù (bồi thường) xe ô tô — PTI Quảng Ninh, 04/01/2019 (Ban XCG cung cấp; bản gốc không lưu trong docs/Kho tri thức)', r: ['dg-thoihan', 'cl-camket', 'cl-duyetgia'], v: 0 },

{ id: 'tn-anchi-quytac', g: 'tiepnhan',
  q: 'Kiểm tra ấn chỉ bảo hiểm và xác định Quy tắc áp dụng cho hồ sơ thế nào?',
  k: ['ấn chỉ', 'ấn chỉ vật lý', 'ấn chỉ điện tử', 'cấp đơn online', 'quét QR', 'mã QR ấn chỉ', 'quy tắc nào áp dụng', 'quy tắc 26/12/2024', 'tranh chấp quy tắc', 'kiểm tra giấy chứng nhận bảo hiểm thật'],
  a: `Mỗi hồ sơ áp dụng **Quy tắc bảo hiểm ghi trên ấn chỉ (GCNBH/HĐBH) tại thời điểm cấp**, không phải quy tắc mới nhất.
Bộ Quy tắc bảo hiểm tự nguyện XCG ban hành **26/12/2024** có thời điểm áp dụng khác nhau theo loại ấn chỉ:
|Loại ấn chỉ|Áp dụng cho đơn cấp từ|
|Ấn chỉ vật lý|**23/01/2025**|
|Ấn chỉ điện tử (online)|**25/02/2025**|
Khi giải quyết bồi thường, GĐV phải:
- Xác định ấn chỉ là **vật lý hay điện tử** và **thời điểm cấp**.
- **Quét mã QR** trên ấn chỉ để kiểm tra Quy tắc áp dụng có đúng thông báo của ban nghiệp vụ không.
- Đơn cấp đúng quy định → giải quyết bồi thường bình thường.
- **Tranh chấp với khách hàng** về Quy tắc áp dụng, hoặc quét QR thấy Quy tắc **không đúng thời điểm cấp** → gọi điện đồng thời gửi email cho **Ban/Phòng kỹ thuật nghiệp vụ XCG** để làm rõ; nhận email xác nhận thì **đính kèm email + chứng từ (PDF hoặc ảnh chụp màn hình) vào hồ sơ bồi thường trên web** làm căn cứ.
- Có dấu hiệu sai phạm cấp đơn → **báo cáo đầu mối tiếp nhận sai phạm** theo quy định.
!! Quy tắc VCX **QĐ 109/2025** (hiệu lực 14/10/2025) là bản sau bộ 26/12/2024 — đơn cấp trước ngày hiệu lực vẫn theo quy tắc cũ ghi trên ấn chỉ.`,
  s: 'Thông báo Phòng KTNV XCG về thời điểm áp dụng Quy tắc BH tự nguyện ban hành 26/12/2024 (docs/Kho tri thức — Tiện ích tra cứu CV)', r: ['qt-thaydoi', 'gd-tailieu', 'sb-saipham'] }
);
/* ─── 2. GIÁM ĐỊNH CHI TIẾT (Bước 3) ─── */
TL_KB.push(
{ id: 'gd-thoigian', g: 'giamdinh',
  q: 'Giám định chi tiết phải làm trong bao lâu, gồm những việc gì?',
  k: ['giám định chi tiết', 'thời gian giám định', 'bước 3', 'lấy báo giá', 'upload chứng từ', 'tự giám định'],
  a: `|Việc|Thời hạn|
|Tự giám định chi tiết tại xưởng|Trong **4 – 8 giờ** sau khi xe được đưa về đơn vị sửa chữa|
|Hướng dẫn NĐBH hoàn thiện TBTN & YCBT (BM 20.02) + chứng từ|≤ 02 giờ sau khi kết thúc GĐ|
|Gửi kết quả GĐ cho gara lấy báo giá/chào giá cạnh tranh|≤ 02 giờ sau GĐ chi tiết|
|Cập nhật, upload kết quả GĐ & chứng từ lên phần mềm|≤ 04 giờ sau GĐ chi tiết|
|Đề xuất thuê GĐ độc lập (nếu cần)|≤ 02 ngày sau tổn thất|
Nội dung GĐ: giám định hồ sơ tài liệu → xác định nguyên nhân, mức độ tổn thất → chụp ảnh thiệt hại → tổng hợp đánh giá → lập biên bản GĐ thiệt hại (PL.20.06).`,
  s: 'QT PTI.XCG.20 – mục 3.1 – 3.5', r: ['gd-chuanbi', 'gd-tailieu', 'gd-bienban', 'gd-thuegd'] },

{ id: 'gd-chuanbi', g: 'giamdinh',
  q: 'Cần chuẩn bị gì trước khi đi giám định?',
  k: ['chuẩn bị giám định', 'dụng cụ giám định', 'mang theo', 'thước dây'],
  a: `- **Tài liệu:** Quy tắc bảo hiểm, mẫu Biên bản GĐ, Thông báo tai nạn & YCBT, Biên bản làm việc, mẫu Hướng dẫn cung cấp chứng từ…
- **Công cụ:** điện thoại cài **App PTI SOS**, thước dây, thước, kẹp, bút/phấn đánh dấu…
- **Thống nhất** với các bên: ngày, giờ, địa điểm, thành phần tham gia GĐ. Có NT3 mà NT3 không cùng GĐ tại hiện trường → gửi thông báo mời tham gia GĐ bằng văn bản trước (NVXE039.01.12).`,
  s: 'PL.PTI.XCG.20.06 – Phần A, mục I; PL.PTI.XCG.20.04 – Bước 2', r: ['gd-thoigian', 'nt3-buoc'] },

{ id: 'gd-tailieu', g: 'giamdinh',
  q: 'Giám định hồ sơ xe: kiểm tra Thông báo tai nạn, HĐBH, chủ xe, người thụ hưởng thế nào?',
  k: ['giám định tài liệu', 'kiểm tra hồ sơ xe', 'thông báo tai nạn quá 5 ngày', 'chủ xe khác đăng ký', 'hồ sơ khai thác', 'ảnh khai thác', 'đồng bảo hiểm', 'tái bảo hiểm', 'dưới giá trị'],
  a: `**Thông báo tai nạn & YCBT:** ngày NĐBH thông báo bằng văn bản = ngày ký / ngày gửi điện tử / ngày dấu bưu cục (lưu chứng từ). **Quá 5 ngày** kể từ ngày TN → cần xác nhận của GĐV và NĐBH.
- Kiểm tra: chủ xe, lái xe, người đại diện, người thụ hưởng; biển số, số khung; thẩm quyền người ký; diễn biến; nội dung yêu cầu.
- Tên chủ xe trên HĐ/GCNBH hoặc người ký/người thụ hưởng **khác** chủ xe trên đăng ký → phải có giấy tờ chứng minh quyền sở hữu/thụ hưởng hợp pháp.
**Hồ sơ khai thác (HĐBH/GCNBH, SĐBS, giấy yêu cầu):** đối tượng BH khớp đăng ký; mục đích sử dụng (so đăng kiểm); điều khoản, loại hình; có **tái/đồng BH** không; hiệu lực tại ngày TN; phí & hạn thanh toán phí.
- VCX: giá trị khai báo so với giá thị trường (dưới/trên/đúng giá trị), xe kinh doanh hay không, điều khoản bổ sung, mức khấu trừ.
- Kiểm tra **ảnh khai thác**/tài liệu đánh giá rủi ro trước khi cấp đơn.
!! Tổn thất sát ngày cấp đơn: đối chiếu ảnh chụp đánh giá rủi ro trước khi cấp đơn (bắt buộc với mọi xe tham gia VCX, trừ các trường hợp đặc biệt — CV 3653/2024).`,
  s: 'PL.PTI.XCG.20.06 – mục II.1; CV 3653/PTI-BHXCG (03/10/2024)', r: ['gd-anhcapdon', 'gd-xmp', 'gd-thuhuong', 'gd-gplx', 'gd-dangkiem'] },

{ id: 'gd-xmp', g: 'giamdinh',
  q: 'Xác minh phí kiểm tra những gì? Khách chưa đóng phí thì xử lý ra sao?',
  k: ['xác minh phí', 'XMP', 'đóng phí', 'nợ phí', 'chưa đóng phí', 'thanh toán phí', 'lịch sử tổn thất', 'BM 20.08'],
  a: `Lấy **Xác minh phí BM.PTI.XCG.20.08** từ phần mềm, đủ mã số/vạch. Kiểm tra: chủ xe, người thụ hưởng; số GCNBH/HĐBH; loại hình; biển số, số khung, số máy; hiệu lực, ngày cấp, đơn vị cấp; tỷ lệ phí, phí BH; **lịch sử tổn thất**; ngày thanh toán phí, doanh thu, phí còn nợ.
- **Đóng phí đúng hạn** → giám định bình thường.
- **Chưa đóng phí nhưng chưa đến hạn** thanh toán theo HĐBH → vẫn tiếp tục GĐ; lưu ý điều khoản cho nợ phí.
- **Vi phạm nghĩa vụ thanh toán phí** → báo cáo lãnh đạo theo thẩm quyền để đề xuất phương án.
- Thu thiếu phí do kê khai sai → xem mục giảm trừ theo tỷ lệ phí.`,
  s: 'PL.PTI.XCG.20.06 – mục II.1 (Xác minh phí)', r: ['dg-thuphi', 'gd-tailieu', 'gd-thanhtoanphi'] },

{ id: 'gd-gplx', g: 'giamdinh',
  q: 'Kiểm tra giấy phép lái xe thế nào (hạng B1, tra cứu, bị tước bằng)?',
  k: ['giấy phép lái xe', 'GPLX', 'bằng lái', 'hạng bằng', 'B1', 'số tự động', 'tra cứu bằng lái', 'tước bằng', 'bằng giả', 'BM 20.21'],
  a: `- Kiểm tra họ tên, số GPLX, hạng bằng, hiệu lực; người điều khiển khớp với biên bản GĐ/khai báo/hồ sơ CQCN.
- Hạng bằng phù hợp xe: bằng **B1 chỉ lái xe số tự động** → xác định thông số kỹ thuật xe.
- Tra cứu số phôi tại **gplx.gov.vn** (hoặc kênh được CQCN chấp thuận). Không tra được hoặc số phôi khác → gửi công văn cơ quan cấp GPLX theo **BM.PTI.XCG.20.21**.
- Tra cứu thông tin & thời hạn **tước GPLX**.
!! Loại trừ (VCX & BB TNDS): không có GPLX, GPLX không phù hợp loại xe, hết hạn tại thời điểm TN; bị tước có thời hạn hoặc bị thu hồi được coi như **không có GPLX**. Không áp dụng với học viên trên xe tập lái, thi sát hạch (VCX).`,
  s: 'PL.PTI.XCG.20.06 – mục II.1 (GPLX); QT VCX 109/2025 – khoản 15.4; NĐ 67/2023 – Điều 7', r: ['qt-loaitru', 'td-loaitru', 'gd-gplx-ca'] },

{ id: 'gd-dangkiem', g: 'giamdinh',
  q: 'Kiểm tra đăng kiểm và đăng ký xe; xe hết hạn đăng kiểm có được bồi thường không?',
  k: ['đăng kiểm', 'giấy chứng nhận kiểm định', 'hết hạn đăng kiểm', 'gia hạn đăng kiểm', 'đăng ký xe', 'thông số kỹ thuật', 'hoán cải'],
  a: `**GCN kiểm định (đăng kiểm):** hiệu lực tại ngày TN; hết hạn → kiểm tra xe có được **gia hạn** tại giahanxcg.vr.org.vn; biển số, số khung, số máy khớp đăng ký; năm SX (tính khấu hao, giá trị xe); mục đích sử dụng (có kinh doanh vận tải không, so GCNBH); tải trọng/số người cho phép so với thực tế; thông số kỹ thuật so với thực tế.
**Đăng ký xe:** chủ xe, biển số, số khung, số máy, màu sơn, ngày đăng ký; giấy tờ mua bán, cho tặng, uỷ quyền (công chứng/chứng thực).
!! QT VCX 2025 – loại trừ 15.2: không có đăng kiểm hợp lệ, còn hiệu lực hoặc đăng kiểm **không còn giá trị**. Không áp dụng với: xe mới 100% chờ đăng ký lần đầu ≤ 30 ngày; xe có giấy phép lưu hành tạm thời; xe hoạt động trong khai trường, mỏ, cảng, kho… nếu ghi rõ trong HĐBH.
!! Loại trừ 15.3: thông số kỹ thuật không khớp đăng kiểm — trừ thay la-zăng/lốp; thùng hàng thay đổi kết cấu nếu ghi rõ trong HĐBH.`,
  s: 'PL.PTI.XCG.20.06 – mục II.1; QT VCX 109/2025 – khoản 15.2, 15.3', r: ['gd-xemoi', 'qt-loaitru'] },

{ id: 'gd-xemoi', g: 'giamdinh',
  q: 'Xe mới chưa có đăng ký, đăng kiểm hoặc xe lưu hành tạm thời cần giấy tờ gì?',
  k: ['xe mới', 'chưa có đăng ký', 'chưa đăng kiểm', 'lưu hành tạm thời', 'phiếu xuất xưởng', 'xe nhập khẩu', 'biên bản bàn giao xe', 'ảnh khai thác xe mới'],
  a: `- **Xe mới 100% năm BH đầu tiên** đang chờ đăng ký/đăng kiểm (GCNBH cấp theo số khung, số máy): **Phiếu kiểm tra chất lượng xuất xưởng** (Cục Đăng kiểm VN) + HĐ & hoá đơn mua xe.
- **Xe nhập khẩu từ kho, cảng:** GCN kiểm định chất lượng xe nhập khẩu + hồ sơ hoàn tất thủ tục hải quan.
- **Xe lưu hành tạm thời:** Giấy phép lưu hành tạm thời thay đăng ký, đăng kiểm.
- Xe lưu hành nội bộ không cấp phép lưu thông đường bộ: theo điều kiện ghi trong HĐBH.
!! Ảnh đánh giá rủi ro của xe mới 100% cấp BH trước khi showroom bàn giao: được thay bằng hoá đơn mua xe (hiệu lực BH không muộn hơn 01 ngày kể từ ngày xuất hoá đơn) hoặc biên bản bàn giao xe (không muộn hơn ngày bàn giao) — CV 3653/2024.`,
  s: 'PL.PTI.XCG.20.06 – mục II.1; PL.PTI.XCG.20.10 – mục 2.1.2; CV 3653/PTI-BHXCG (03/10/2024) – mục 1.1', r: ['gd-dangkiem', 'gd-anhcapdon'] },

{ id: 'gd-thuhuong', g: 'giamdinh',
  q: 'Xe đang thế chấp ngân hàng, người thụ hưởng là TCTD thì làm gì?',
  k: ['thế chấp', 'ngân hàng', 'thụ hưởng', 'tổ chức tín dụng', 'TCTD', 'xác nhận thụ hưởng', 'BM 20.20', 'đăng ký photo', 'ủy quyền thụ hưởng'],
  a: `- Đăng ký xe là bản photo, bản gốc thế chấp tại TCTD → thu thập & kiểm tra **giấy chuyển quyền thụ hưởng** cho TCTD.
- Gửi công văn đề nghị TCTD **xác nhận quyền thụ hưởng BM.PTI.XCG.20.20** trong vòng **½ ngày** sau khi ước thiệt hại đến hạn mức phải thông báo TCTD; gửi **thư có báo phát**, lưu báo phát vào hồ sơ. (Mẫu 20.20A: xác nhận phương thức giải quyết bồi thường.)
- Kiểm tra CV trả lời của TCTD: đối tượng thụ hưởng, số tài khoản, hình thức BT, ngày xác nhận, hiệu lực.
- Giấy uỷ quyền thụ hưởng/nhận tiền: người uỷ quyền, thẩm quyền, người được uỷ quyền, thời hiệu, nội dung. NĐBH là cá nhân uỷ quyền nhận tiền → cần chứng thực chữ ký.
- Xác nhận quyền thụ hưởng của TCTD và giấy uỷ quyền thụ hưởng là chứng từ phải **lưu bản cứng**.`,
  s: 'PL.PTI.XCG.20.06 – mục II.1; PL.PTI.XCG.20.15 – mục III; PL.PTI.XCG.20.18', r: ['ct-xacnhanpa', 'sb-luutru'] },

{ id: 'gd-ngapnuoc', g: 'giamdinh',
  q: 'Giám định xe ngập nước, thuỷ kích như thế nào?',
  k: ['giám định ngập nước', 'giám định thuỷ kích', 'ngập nước', 'thủy kích', 'thuỷ kích', 'nước vào động cơ', 'bó máy', 'hộp điều khiển', 'lọc gió', 'que thăm dầu', 'bugi'],
  a: `**Ngập nước (động cơ, điện, điều khiển):** GĐ **ngay** khi xe về xưởng.
- Xác định vết/ngấn nước trên xe, sàn xe, hoen gỉ nội thất, hộp điều khiển, giắc điện.
- Phối hợp xưởng vệ sinh ngay nội thất, sàn, hộp điều khiển, hệ thống điện; chụp tem mác hộp điều khiển, **ký kiểm soát** các hạng mục sau khi xử lý.
- Lắp hoàn thiện để xác định hạng mục hư hỏng; chụp lỗi taplo, mã lỗi máy chẩn đoán; thay thử hộp điều khiển tốt để so sánh.
**Thuỷ kích:** kiểm tra khoang máy; nước trong lọc gió, hộp lọc, cổ hút; que thăm dầu máy, dầu số (có nước?); tháo bugi xem nước vào buồng đốt; quay trục cơ kiểm tra bó máy. Hư động cơ → giám sát tháo hạ máy; chụp trục cơ, tay biên, piston, xéc măng, bạc… **xếp theo vị trí và đánh số** theo chu trình động cơ.
!! Phạm vi: thiệt hại động cơ do nước lọt vào khi xe hoạt động trong vùng ngập **bị loại trừ** (15.13), trừ khi xe có **BS06** (khấu trừ 20% STBT, tối thiểu 3 triệu/vụ).`,
  s: 'PL.PTI.XCG.20.06 – mục III.1; QT VCX 109/2025 – khoản 15.13, Điều 23 (BS06)', r: ['qt-bs06', 'ht-dacthu', 'tn-dacbiet'] },

{ id: 'gd-chay', g: 'giamdinh',
  q: 'Giám định xe bị cháy cần lưu ý gì?',
  k: ['cháy xe', 'xe cháy', 'hỏa hoạn', 'cháy nổ', 'chập điện', 'nguyên nhân cháy', 'bảo hành cháy'],
  a: `- Luôn **GĐ trực tiếp** tại hiện trường.
- Hạng mục cháy không còn nguyên vẹn → in **catalog** nhà SX đối chiếu, chụp chi tiết. Hạng mục bị nung/tác động nhiệt → kiểm tra đặc tính vật liệu để đánh giá; đọc lỗi taplo, mã lỗi máy chẩn đoán; thay thử phụ tùng tốt để so sánh.
- Phải thu thập **hồ sơ CQCN** (trừ cháy một phần và PTI xác định được nguyên nhân).
- Xe còn **bảo hành** mà cháy/tổn thất thuộc trách nhiệm bảo hành → PTI nhận thế quyền đòi nhà SX: thu HĐ mua xe, BB bàn giao xe, sổ bảo hành & lịch sử bảo dưỡng, văn bản NĐBH yêu cầu bảo hành, xác nhận xe không thay đổi kết cấu, **kết luận nguyên nhân cháy** (viện KHHS, PCCC…) hoặc GĐ độc lập.
!! Loại trừ 15.19: thiết bị điện hư do chạy quá tải, quá áp, đoản mạch, tự đốt nóng, hồ quang, rò điện (bộ phận khác bị cháy lan do nguyên nhân đó vẫn được xem xét BT — PL.20.10).`,
  s: 'PL.PTI.XCG.20.02 – mục 1; PL.PTI.XCG.20.06 – mục III.1; PL.PTI.XCG.20.05 – mục I; PL.PTI.XCG.20.04 – Bước 3; QT VCX 109/2025 – khoản 15.19', r: ['ht-cqcn', 'nt3-thequyen'] },

{ id: 'gd-xedien', g: 'giamdinh',
  q: 'Tổn thất pin xe điện được bảo hiểm thế nào?',
  k: ['xe điện', 'pin', 'pin xe điện', 'bộ pin', 'Vinfast', 'BS22'],
  a: `- Theo Quy tắc VCX 2025, **pin xe điện được bảo hiểm mặc định** trong đơn gốc (bỏ điều khoản BS22 trước đây), **không áp khấu trừ 10%** riêng cho tổn thất pin.
- Loại trừ (15.15): pin không chính hãng; pin hỏng/lỗi do nhà sản xuất; lỗi kỹ thuật, hao mòn tự nhiên, hư hỏng do khả năng hấp thụ sạc điện.
- Khi giám định: kiểm tra, **chụp ảnh mã PIN** để xác định pin do nhà SX phân phối, lắp đặt chính hãng.`,
  s: 'QT VCX 109/2025 – khoản 15.15; HD triển khai Quy tắc & Biểu phí XCG mới (T10/2025); PL.PTI.XCG.20.06 – mục III.1', r: ['qt-thaydoi', 'qt-loaitru'] },

{ id: 'gd-phutunglon', g: 'giamdinh',
  q: 'Thiết bị, phụ tùng giá trị lớn (từ 20 triệu) giám định thế nào?',
  k: ['phụ tùng giá trị lớn', 'phụ tùng từ 20 triệu', 'thiết bị đặc biệt', 'catalog', 'máy chẩn đoán'],
  a: `Thiết bị, phụ tùng đặc biệt giá trị **từ 20 triệu trở lên**:
- In **catalog** nhà SX để kiểm tra, đối chiếu; chụp ảnh chi tiết, chụp **mã, ký hiệu** trên thiết bị.
- Cần thiết thì phối hợp gara kiểm tra bằng **thiết bị chuyên dùng** và chụp ảnh.
- Lập **biên bản ghi nhận tình trạng thiệt hại**.`,
  s: 'PL.PTI.XCG.20.06 – mục III.1', r: ['gd-chupanh', 'gd-bienban'] },

{ id: 'gd-chupanh', g: 'giamdinh',
  q: 'Chụp ảnh giám định chi tiết thiệt hại xe theo quy định nào?',
  k: ['chụp ảnh giám định', 'ảnh thiệt hại', '4 góc', 'xoáy ốc', 'số máy', 'số khung', 'tem đăng kiểm', 'ảnh không qua app'],
  a: `- Ưu tiên GĐ qua **App PTI SOS**. Không qua App → ảnh phải thể hiện rõ **thời gian** (giờ, ngày, tháng, năm), vị trí, địa điểm và theo thứ tự hạng mục trong biên bản GĐ.
- **Ảnh tổng thể:** 4 góc xe, thấy biển số, **tem đăng kiểm**, số khung hoặc số máy.
- **Ảnh chi tiết:** chụp theo **hình xoáy ốc** (một chiều, từ ngoài vào trong); cận cảnh hạng mục, vị trí, mức độ; khoanh vùng bằng phấn/bút; dùng thước thể hiện xô lệch, biến dạng; chi tiết bên trong phải chụp khi tháo rời.
- Tổn thất lớn: chụp suốt quá trình tháo dỡ; chụp theo **cụm chi tiết** (vd hệ thống túi khí: hết túi khí, taplo, dây đai… rồi mới sang cụm khác).
!! Hỏng máy phải cẩu hạ máy và/hoặc tổn thất toàn bộ → **bắt buộc chụp số máy**.`,
  s: 'PL.PTI.XCG.20.06 – mục IV', r: ['ht-chupanh', 'gd-bienban'] },

{ id: 'gd-bienban', g: 'giamdinh',
  q: 'Yêu cầu khi lập Biên bản giám định thiệt hại?',
  k: ['biên bản giám định', 'BM 20.15', 'BM 20.15A', 'lập biên bản', 'gạch chéo', 'tẩy xoá', 'hạng mục kiểm tra sau', 'chữ ký biên bản'],
  a: `Lập qua **App PTI SOS** hoặc theo **BM.PTI.XCG.20.15** (xe cơ giới) / **20.15A** (tài sản, hàng hoá không phải xe). Yêu cầu:
- **Bắt buộc có chữ ký GĐV PTI** và chữ ký các bên liên quan; đại diện chủ xe không ký → ghi rõ lý do.
- Ghi rõ ràng, **không tẩy xoá**; dòng hạng mục còn trống → **gạch chéo**; thông tin chưa rõ → ghi "chưa rõ".
- Khách quan, trung thực; thể hiện **tất cả** hạng mục và phương pháp khắc phục.
- Hạng mục chưa đánh giá được → ghi nhận "kiểm tra sau" trên biên bản; thu hồi lưu giữ hoặc ký xác nhận trên hạng mục đó rồi gửi lại gara.
- Ghi ý kiến chuyên gia kỹ thuật (nếu có).
- Thiệt hại xe thuộc trách nhiệm NT3 → sau GĐ thu thập chứng từ theo PL.20.04.`,
  s: 'PL.PTI.XCG.20.06 – mục VI', r: ['gd-chupanh', 'nt3-buoc'] },

{ id: 'gd-thuegd', g: 'giamdinh',
  q: 'Khi nào thuê giám định độc lập? Ai chịu chi phí?',
  k: ['giám định độc lập', 'thuê giám định', 'BM 20.12', 'chứng thư giám định', 'trưng cầu giám định', 'không thống nhất kết quả', 'chi phí giám định độc lập'],
  a: `**Khi nào:** tổn thất lớn, phức tạp vượt năng lực GĐ của PTI; NĐBH/lái xe không thống nhất nguyên nhân, mức độ tổn thất do PTI xác định.
- GĐV đề xuất theo **BM.PTI.XCG.20.12** trong ≤ 02 ngày sau tổn thất; TP giám định check, LĐ VP Miền validate trong 04 – 06 giờ.
- Thoả thuận trước với đơn vị GĐ: phạm vi công việc, thời gian, phí, thanh toán.
- Đơn có **tái bảo hiểm** → báo Ban Tái BH lấy ý kiến nhà tái BH **trước** khi thuê.
- Theo dõi, giám sát; hàng hoá VCTX thì GĐV trực tiếp chứng kiến. Nhận chứng thư → kiểm tra, yêu cầu sửa/bổ sung nếu sai sót.
**Chi phí:** kết luận GĐ độc lập **khác** kết luận PTI → PTI trả; **trùng** kết luận PTI → NĐBH/BMBH trả (phải thông báo rõ cho NĐBH trước khi thuê). Không thoả thuận được thì một bên có quyền đề nghị Toà án trưng cầu; kết luận có giá trị bắt buộc.
- Chứng từ thanh toán: chứng thư, HĐ (bắt buộc nếu > 50 triệu chưa thuế), BB thanh lý, hoá đơn, báo giá.`,
  s: 'QT PTI.XCG.20 – mục 3.2; PL.PTI.XCG.20.06 – Phần B; PL.PTI.XCG.20.02 – mục 2.3; QT VCX 109/2025 – Điều 9', r: ['ht-baocao', 'ct-hoadon'] },

{ id: 'gd-trucloi', g: 'giamdinh',
  q: 'Phát hiện dấu hiệu trục lợi hoặc chứng từ bất hợp lý thì làm gì?',
  k: ['trục lợi', 'gian lận', 'nghi ngờ', 'dựng hiện trường', 'chứng từ giả', 'bất hợp lý', 'không khớp'],
  a: `- Tài liệu bất hợp pháp, bất hợp lý, không khớp sự kiện BH hoặc có dấu hiệu trục lợi → **báo cáo lãnh đạo có thẩm quyền** để điều tra xác minh và/hoặc phối hợp bộ phận chức năng.
- Nghi dựng hiện trường → ra hiện trường ngay hoặc xác minh lại; có thể trưng cầu công an/GĐ chuyên ngành (BM 20.10, 20.11).
- Dấu hiệu trục lợi là trường hợp **bắt buộc thu thập hồ sơ CQCN** và lập **Báo cáo GĐ BM 20.09**.
- HĐBH/GCNBH nghi giả → báo bộ phận An ninh nội bộ.
!! Không trung thực trong cung cấp thông tin, chứng từ → giảm trừ 50% – 100% STBT (QT VCX 2025, 12.1.3).`,
  s: 'PL.PTI.XCG.20.06 – mục II (lưu ý); PL.PTI.XCG.20.02 – mục 1, 2.3; PL.PTI.XCG.20.05; QT VCX 109/2025 – khoản 12.1.3', r: ['ht-cqcn', 'ht-baocao', 'dg-giamtru', 'gd-anhcapdon'] }
);
/* ─── 3. DUYỆT GIÁ & PHƯƠNG ÁN (Bước 4) ─── */
TL_KB.push(
{ id: 'dg-thoihan', g: 'duyetgia',
  q: 'Thời hạn trình và duyệt phương án bồi thường, duyệt giá theo số tiền là bao lâu?',
  k: ['thời hạn duyệt giá', 'thời gian duyệt giá', 'duyệt giá bao lâu', 'trình duyệt', 'phương án bồi thường', 'check validate', 'công nhận giá', 'SLA', 'giờ làm việc'],
  a: `Áp dụng cả khi **chưa xác định** phạm vi BH (ghi nhận giá) và khi **thuộc** phạm vi BH (duyệt phương án) — tính theo số tiền báo giá, **giờ làm việc**:
|Số tiền|GĐV lập & trình|Người thẩm quyền check & validate|
|Dưới 20 triệu|4 giờ|4 giờ|
|20 – 50 triệu|10 giờ|06 giờ|
|50 – 100 triệu|24 giờ|08 giờ|
|Trên 100 triệu|32 giờ|16 giờ|
- Hồ sơ trình gồm Tờ trình phương án GQBT (BM 20.25/25A/25B/25C) và Bảo lãnh thanh toán BM 20.35 (nếu có).
- Lập bảng kê đề xuất: ≤ 01 ngày kể từ khi kết thúc GĐ thiệt hại.
- Trường hợp **từ chối**: GĐV ≤ 03 ngày; check ≤ 02 ngày; validate ≤ 01 ngày.`,
  s: 'QT PTI.XCG.20 – mục 4.1, 4.2.3.1 – 4.2.3.3', r: ['dg-bangke', 'dg-chuaxd', 'dg-tuchoi', 'dl-trangthai', 'cl-duyetgia'] },

{ id: 'dg-bangke', g: 'duyetgia',
  q: 'Lập bảng kê thiệt hại dùng mẫu nào, căn cứ vào đâu?',
  k: ['bảng kê', 'bảng kê thiệt hại', 'BM 20.22', 'lập bảng kê', 'bảng kê cứu hộ', 'thiệt hại về người'],
  a: `Lập trong ≤ **01 ngày** kể từ khi kết thúc GĐ thiệt hại. Căn cứ: kết quả GĐ; quy định chào giá cạnh tranh & HĐ sửa chữa (PL.20.07); quy định **giảm giá gara liên kết** hiện hành; quy định **khấu hao** (PL.20.08); bảng giá chi phí **cứu hộ**.
|Mẫu|Dùng cho|
|BM 20.22|Thiệt hại xe cơ giới|
|BM 20.22A|Tài sản khác (không phải xe)|
|BM 20.22B|Hàng hoá vận chuyển trên xe|
|BM 20.22C|Chi phí cứu hộ|
|BM 20.22D|Thiệt hại về người|
|BM 20.22E|Thiệt hại về người (tạm ứng)|
|BM 20.22F|Thù lao giám định|
|BM 20.22G|Chi phí giám định/chi phí khác|`,
  s: 'QT PTI.XCG.20 – mục 4.1', r: ['dg-thoihan', 'dg-chaogia', 'dg-khauhao'] },

{ id: 'dg-chaogia', g: 'duyetgia',
  q: 'Quy định chào giá cạnh tranh, khảo sát giá sửa chữa theo số tiền?',
  k: ['chào giá cạnh tranh', 'khảo sát giá', 'mấy báo giá', 'bao nhiêu báo giá', 'lấy báo giá', 'số lượng báo giá', 'chỉ định trực tiếp', 'kho giá', 'gara liên kết', 'garage liên kết', 'báo giá', 'nhiều báo giá', '100 triệu', '200 triệu'],
  a: `Nguyên tắc: PTI chỉ định sửa chữa thì phải tại **hệ thống gara liên kết**; giá duyệt phải khảo sát từ **kho giá** Tổng công ty; mọi số tiền là **chưa gồm thuế**.
|Giá trị thiệt hại ước|Cách thức|
|≤ 100 triệu|Chỉ định trực tiếp (cả khi sửa tại đại lý hãng, hoặc tài sản NT3 do cơ quan nhà nước/nhà SX báo giá)|
|> 100 – ≤ 200 triệu|Khảo sát giá thực tế ít nhất **02** cơ sở, lưu báo giá trong hồ sơ|
|> 200 triệu|Khảo sát ít nhất **03** cơ sở, lưu báo giá|
|> 100 triệu, khó xác nhận giá|Có thể tổ chức **chào giá cạnh tranh** (tối thiểu 02 cơ sở)|
- Không đủ số báo giá → giải trình lý do trong tờ trình phương án.
- Chào giá: mỗi đơn vị gửi **một** báo giá mỗi lần; báo giá tách 3 phần: phụ tùng, tiền công sửa chữa, thuế GTGT; bảo mật báo giá. Các báo giá bằng nhau → đàm phán giảm giá, chọn giá thấp nhất.
- GĐV chủ động khảo sát lại giá phụ tùng, đàm phán chi phí hợp lý nhất trước khi trình.`,
  s: 'PL.PTI.XCG.20.07', r: ['dg-hopdongsc'] },

{ id: 'dg-hopdongsc', g: 'duyetgia',
  q: 'Khi nào bắt buộc ký hợp đồng sửa chữa với gara?',
  k: ['hợp đồng sửa chữa', 'BM 20.40', '50 triệu', 'báo giá thay hợp đồng', 'báo giá cuối cùng', 'ký hợp đồng'],
  a: `- Giá sửa chữa **> 50.000.000đ (chưa thuế)**: PTI phối hợp chủ xe và gara ký **Hợp đồng sửa chữa BM.PTI.XCG.20.40**.
- **≤ 50 triệu:** không bắt buộc HĐ; **báo giá cuối cùng** coi như hợp đồng, phải đủ: đối tượng sửa chữa; hạng mục sửa chữa/thay thế; số lượng; đơn giá; giảm giá, khấu trừ, giảm trừ; số tiền thanh toán của các bên; **thời gian sửa chữa**; **điều khoản bảo hành**.
- Người giám sát kỹ thuật, nghiệm thu sau sửa chữa phải là chủ xe/NĐBH hoặc đại diện hợp pháp.
- HĐ cứu hộ và HĐ thuê giám định độc lập cũng bắt buộc khi > 50 triệu chưa thuế.`,
  s: 'PL.PTI.XCG.20.07 – mục 3.3 (B3); PL.PTI.XCG.20.15 – mục III', r: ['ct-suachua', 'ct-nghiemthu'] },

{ id: 'dg-khauhao', g: 'duyetgia',
  q: 'Tỷ lệ khấu hao phụ tùng thay mới tính thế nào?',
  k: ['khấu hao', 'tỷ lệ khấu hao', 'hao mòn', 'thay mới', 'năm sử dụng', 'săm lốp', 'ắc quy', 'lốp', 'đầu kéo', 'taxi', 'thời gian sử dụng xe'],
  a: `**Quy tắc VCX 2025 (QĐ 109) — khoản 17.1.2c** (trừ vào chi phí thay mới phụ tùng):
|Thời gian sử dụng xe|Xe không kinh doanh|Xe kinh doanh|
|Dưới 3 năm|0%|0%|
|3 – dưới 6 năm|15%|25%|
|6 – dưới 10 năm|25%|35%|
|10 – 15 năm|35%|45%|
|Trên 15 năm|50%|60%|
- Xe chuyên dùng, xe tải tính như **xe kinh doanh**. Đầu kéo, taxi, xe cho thuê tự lái, xe khách liên tỉnh: **150%** mức xe kinh doanh.
- **Săm lốp, ắc quy, bạt phủ thùng, lọc gió, lọc dầu, lọc xăng, dầu máy:** tính % giá trị đã sử dụng, tối đa **50%** — kể cả khi có BS02.
- Phụ tùng đã thay mới một lần (có chứng từ) → tính khấu hao từ lần thay gần nhất.
- Có **BS02 (thay thế mới)**: không trừ khấu hao (trừ nhóm vật tư kể trên).
- Thời gian sử dụng: từ tháng đăng ký lần đầu đến tháng giao kết HĐBH (xe nhập khẩu đã qua sử dụng: từ tháng 6 năm SX).
!! Áp dụng theo Quy tắc ghi trên GCNBH/HĐBH của hồ sơ. Quy định nội bộ PL.20.08 (12/2024, cho cả TNDS tài sản) dùng bảng xe thông dụng 0/15/25/35/50% và **không khấu hao tài sản NT3** với KH kênh VNP, môi giới, xe thương mại, VIP.`,
  s: 'QT VCX 109/2025 – Điều 1, khoản 17.1.2; PL.PTI.XCG.20.08', r: ['qt-bs02', 'dg-congthuc'] },

{ id: 'dg-khautru', g: 'duyetgia',
  q: 'Mức khấu trừ áp dụng thế nào? Thứ tự áp dụng khấu trừ và giảm trừ?',
  k: ['mức khấu trừ', 'khấu trừ', 'MKT', '500.000', '500 nghìn', 'khấu trừ bậc thang', 'thứ tự áp dụng', 'khách VIP khấu trừ'],
  a: `- Mức khấu trừ **tối thiểu 500.000đ/vụ** (mức cao hơn ghi trên HĐBH/GCNBH).
- **Thứ tự áp dụng:** khấu trừ riêng của điều khoản bổ sung → giảm trừ bồi thường → khấu trừ chung. Rủi ro đã áp khấu trừ riêng của ĐKBS thì **không** áp khấu trừ chung.
|Điều khoản|Khấu trừ riêng|
|BS04 mất cắp bộ phận|20% STBT, tối thiểu 2 triệu/vụ|
|BS06 động cơ ngập nước|20% STBT, tối thiểu 3 triệu/vụ|
|BS14 mất chìa khoá|20% STBT, tối thiểu 2 triệu/vụ|
|BS25 hàng hoá gây hư xe|10% STBT, tối thiểu 2 triệu/vụ|
|BS27 đầu kéo lắp thuỷ lực|3 triệu/vụ (tổn thất khi nâng/hạ ben)|
|BS08 bậc thang (gồm VAT)|Lần 1: 0,5tr · lần 2: 1tr · lần 3: 1,5tr · lần 4: 2tr · từ lần 5: 2,5tr|
!! Cam kết CLDV (CV 4406/2021): hỗ trợ chi phí miễn thường có khấu trừ 500.000đ/vụ cho **KH VIP** (xe thương mại: theo HĐBH) — kiểm tra nhóm khách hàng trước khi thu khấu trừ.`,
  s: 'QT VCX 109/2025 – Điều 18, Điều 21 – 30; CV 4406/PTI-BHXCG – PL01 mục IV.1', r: ['dg-giamtru', 'qt-dkbs', 'cl-camket'] },

{ id: 'dg-giamtru', g: 'duyetgia',
  q: 'Các mức giảm trừ bồi thường (chế tài) khi chủ xe vi phạm?',
  k: ['giảm trừ', 'giảm trừ bồi thường', 'chế tài', 'không thông báo', 'tự ý sửa chữa', 'tự ý di chuyển', 'không trung thực', 'vượt biển cấm vượt', 'tỷ lệ giảm trừ'],
  a: `**Quy tắc VCX 2025 – Điều 12:**
|Mức giảm|Trường hợp|
|10% – 30%|Không báo ngay PTI; không gửi thông báo tổn thất bằng văn bản trong **05 ngày**; không báo công an/chính quyền gần nhất; lái xe tự ý rời hiện trường; không cứu chữa, không giữ nguyên hiện trường; **vượt tại nơi có biển cấm vượt**|
|30% – 50%|Tự ý **tháo dỡ hoặc sửa chữa** khi chưa có ý kiến PTI|
|50% – 100%|Không trung thực về thông tin, chứng từ; lái xe **không chịu xét nghiệm** nồng độ cồn/chất kích thích theo yêu cầu PTI; cản trở PTI xác minh|
|Tối đa 100% (theo mức lỗi NT3)|Không bảo lưu & chuyển quyền đòi NT3; không hợp tác đòi NT3; tự thoả thuận với NT3|
|Theo tỷ lệ %|Quá tải/quá số người, quá tốc độ (trên 20% – 50%); thiếu phí|
- Trừ trường hợp bất khả kháng, đảm bảo an toàn hoặc theo yêu cầu cơ quan có thẩm quyền.
- Nhiều vi phạm → áp **một** mức cao nhất. GĐV căn cứ tính chất vụ việc, mức độ thiệt hại, lịch sử tổn thất, đối tượng KH để đề xuất mức hợp lý.
!! BB TNDS: DNBH chỉ được giảm trừ **tối đa 5%** STBT thiệt hại tài sản (NĐ 67/2023).`,
  s: 'QT VCX 109/2025 – Điều 12; PL.PTI.XCG.20.10 – mục 7.2; PL.PTI.XCG.20.12 – mục 7.7', r: ['dg-quatai', 'dg-thuphi', 'nt3-khongbaoluu'] },

{ id: 'dg-quatai', g: 'duyetgia',
  q: 'Tính giảm trừ khi xe chở quá tải, quá số người, chạy quá tốc độ?',
  k: ['quá tải', 'chở quá tải', 'quá số người', 'quá tốc độ', 'vượt tốc độ', 'tải trọng', 'ví dụ quá tải', 'giảm trừ theo tỷ lệ'],
  a: `- Áp dụng khi vượt **trên 20% đến 50%**; vượt **trên 50%** → **loại trừ** (từ chối) theo khoản 15.11.
- Tải trọng, số chỗ theo **đăng kiểm có hiệu lực**; số người gồm cả lái xe, phụ xe, trẻ em. Không giảm trừ với xe tải chở quá số người.
**Ví dụ quá tải:** đăng kiểm 5 tấn, chở 6,5 tấn; tổng thiệt hại 30 triệu (gồm cứu hộ) → quá tải (6,5 − 5)/5 = 30% → STBT = 30 × (100% − 30%) = **21 triệu**.
**Ví dụ quá số người:** được chở 40, chở 50 → 25% → STBT = 100 × 75% = **75 triệu**.
**Ví dụ quá tốc độ:** cho phép 60 km/h, đi 75 km/h → (75 − 60)/60 = 25%; thiệt hại 90 triệu → STBT = **67,5 triệu**.`,
  s: 'QT VCX 109/2025 – khoản 12.1.5, 15.11; PL.PTI.XCG.20.10 – mục 7.1.5 (ví dụ)', r: ['dg-giamtru', 'qt-loaitru'] },

{ id: 'dg-thuphi', g: 'duyetgia',
  q: 'Xe kê khai sai mục đích sử dụng, thiếu phí, hoán cải không báo thì bồi thường thế nào?',
  k: ['kê khai sai', 'sai mục đích sử dụng', 'kinh doanh', 'taxi', 'thiếu phí', 'hoán cải', 'thay đổi mục đích', 'tỷ lệ phí', 'giảm trừ theo phí'],
  a: `STBT giảm theo **tỷ lệ phí thực nộp / phí phải nộp** theo quy định (khoản 12.1.6):
- Kê khai giấy yêu cầu sai dẫn đến thu thiếu phí.
- Không báo PTI khi tăng rủi ro (đổi mục đích sử dụng, hoán cải, nâng cấp…). NĐBH phải báo PTI chậm nhất **15 ngày** khi có thay đổi yếu tố tính phí.
**Ví dụ:** xe 5 chỗ 500 triệu chạy taxi nhưng khai không kinh doanh: phí đã đóng 1,5% = 7,5 triệu; phí taxi 2,7% = 13,5 triệu; thiệt hại 100 triệu → STBT = 100 × 7,5/13,5.
- Hoán cải giữa kỳ (vd thùng thường → đông lạnh): phí phải nộp tính theo số ngày BH còn lại từ thời điểm hoán cải.`,
  s: 'QT VCX 109/2025 – khoản 7.2, 12.1.6; PL.PTI.XCG.20.10 – mục 7.1.6 (ví dụ)', r: ['gd-xmp', 'dg-giamtru'] },

{ id: 'dg-congthuc', g: 'duyetgia',
  q: 'Công thức tính số tiền bồi thường tổn thất bộ phận?',
  k: ['công thức', 'cách tính bồi thường', 'số tiền bồi thường', 'tổn thất bộ phận', 'dưới giá trị', 'bảo hiểm dưới giá trị', 'sơn toàn bộ', 'sơn lại toàn bộ', 'sơn lại'],
  a: `**STBT tổn thất bộ phận** = {[Chi phí sửa chữa + chi phí thay mới phụ tùng − (% khấu hao × chi phí thay mới) + chi phí cứu hộ + chi phí hạn chế tổn thất] × (STBH / giá trị thực tế)} − mức khấu trừ − mức giảm trừ.
- Tổng chi phí sửa chữa, thay thế, bảo vệ hiện trường, cứu hộ không vượt STBH.
- BH **dưới giá trị** → nhân tỷ lệ STBH/giá thị trường tại thời điểm giao kết HĐ. Bằng/trên giá trị → chi phí hợp lý để phục hồi.
- PTI toàn quyền chọn: thanh toán chi phí sửa chữa/thay thế, hoặc trả tiền.
- Sơn lại **toàn bộ xe** khi **trên 50%** diện tích sơn hư hỏng do tổn thất.`,
  s: 'PL.PTI.XCG.20.10 – mục II; QT VCX 109/2025 – khoản 17.1', r: ['dg-khauhao', 'dg-khautru'] },

{ id: 'dg-toanbo', g: 'duyetgia',
  q: 'Khi nào là tổn thất toàn bộ và bồi thường thế nào?',
  k: ['tổn thất toàn bộ', 'toàn bộ', '75%', 'xác xe', 'thanh lý xe', 'mất trộm toàn bộ', 'mất cắp xe', 'bồi thường toàn bộ', 'BS07'],
  a: `- **Tổn thất toàn bộ** khi thiệt hại **trên 75%** giá thị trường, hoặc chi phí sửa chữa **bằng/trên 75%** giá thị trường tại thời điểm, nơi xảy ra tổn thất.
- STBT = giá thị trường của xe tại thời điểm tổn thất, **không vượt STBH**.
- **Mất trộm/cướp toàn bộ:** chỉ bồi thường khi có kết luận công an **đình chỉ điều tra**, quyết định đình chỉ vụ án hoặc bản án có hiệu lực. NĐBH phải báo công an ngay và thông báo PTI bằng văn bản trong **24 giờ**.
- Sau BT, xác xe thuộc PTI (BH dưới giá trị → theo tỷ lệ). Khách muốn giữ xác → giảm STBT tương đương giá trị thu hồi theo định giá PTI. Xe mất cắp tìm lại được sau BT → thuộc PTI.
- **BS07:** xe dùng ≤ 1 năm tổn thất toàn bộ → chi trả chi phí thay xe mới cùng loại (≤ STBH).
!! Ngay khi nhận định tổn thất toàn bộ: báo bộ phận **thanh lý xác xe** để được hướng dẫn; BT bằng tiền mà HĐBH còn hiệu lực → thông báo chấm dứt HĐBH.`,
  s: 'QT VCX 109/2025 – khoản 7.2.7, 17.2, 17.3, Điều 24; PL.PTI.XCG.20.15 – mục II.3', r: ['ct-toanbo', 'sb-viecsau'] },

{ id: 'dg-trung', g: 'duyetgia',
  q: 'Bảo hiểm trùng (xe mua bảo hiểm ở nhiều công ty) bồi thường thế nào?',
  k: ['bảo hiểm trùng', 'trùng bảo hiểm', 'nhiều hợp đồng', 'hai công ty bảo hiểm', 'nhiều doanh nghiệp bảo hiểm'],
  a: `- VCX: nhiều HĐ cùng đối tượng, tổng STBH lớn hơn giá thị trường → PTI chỉ bồi thường theo **tỷ lệ STBH của PTI / tổng STBH** các HĐ còn hiệu lực. Điều kiện không trùng → PTI giải quyết độc lập theo HĐ của mình.
**Ví dụ:** PTI 370 triệu, DN khác 400 triệu, thiệt hại 120 triệu → PTI bồi thường 120 × 370/(370 + 400).
- **BB TNDS:** nhiều HĐ cho cùng một xe → chỉ giải quyết theo HĐ giao kết **đầu tiên**; hoàn 100% phí các HĐ còn lại.`,
  s: 'QT VCX 109/2025 – Điều 11; PL.PTI.XCG.20.10 – mục 3 (ví dụ); PL.PTI.XCG.20.12 – mục 7.9', r: ['dg-congthuc'] },

{ id: 'dg-cuuho', g: 'duyetgia',
  q: 'Chi phí cứu hộ, kéo xe, hạn chế tổn thất được chấp nhận thế nào?',
  k: ['cứu hộ', 'chi phí cứu hộ', 'kéo xe', 'cẩu xe', 'chi phí hạn chế tổn thất', 'cứu hộ liên kết', '10% số tiền bảo hiểm'],
  a: `- VCX bồi thường chi phí cần thiết, hợp lý theo yêu cầu/chỉ dẫn của PTI: ngăn ngừa, hạn chế tổn thất phát sinh thêm; **cứu hộ, vận chuyển xe tới nơi sửa chữa gần nhất** hoặc theo hướng dẫn PTI.
- Các chi phí này tối đa **10% STBH** (QT 2025); tổng bồi thường một vụ không vượt STBH.
- GĐV phân tích địa hình, thời gian cứu hộ, số lượng/tải trọng cẩu, quãng đường kéo, việc phụ trợ (đổ đất, chặt cây, làm đường dẫn…) để đề xuất mức hợp lý; lập bảng kê **BM 20.22C**.
- Chứng từ: hoá đơn cứu hộ; HĐ cứu hộ (bắt buộc nếu > 50 triệu chưa thuế); báo giá; phiếu thu; uỷ quyền BM 20.29 nếu hoá đơn mang tên NĐBH.
- Ưu tiên đơn vị **cứu hộ liên kết** (TT SOS đang mở rộng mạng lưới toàn quốc) và khung giá cứu hộ của Tổng công ty.`,
  s: 'QT VCX 109/2025 – khoản 14.2; PL.PTI.XCG.20.10 – mục 5; PL.PTI.XCG.20.15 – mục II.4', r: ['dg-bangke', 'ct-suachua'] },

{ id: 'dg-tuchoi', g: 'duyetgia',
  q: 'Thủ tục từ chối bồi thường như thế nào?',
  k: ['từ chối bồi thường', 'từ chối', 'không thuộc phạm vi', 'loại trừ', 'BM 20.24', 'BM 20.30', 'tờ trình từ chối', 'thông báo từ chối', 'ước bằng 0'],
  a: `1. Tập hợp tài liệu, chứng cứ; **viện dẫn điểm loại trừ** trong Quy tắc và pháp luật.
2. Lấy ý kiến (email/văn bản) **Ban Pháp chế** và nhà tái BH qua **Ban Tái BH** (nếu có tái BH).
3. Lập **Tờ trình từ chối BM.PTI.XCG.20.24** + **Thông báo từ chối BM 20.30**, trình check & validate. Thời hạn: GĐV ≤ 03 ngày sau khi kết thúc GĐ; check ≤ 02 ngày; validate ≤ 01 ngày.
4. Gửi thông báo từ chối (kèm bảng ghi nhận chi phí BM 20.28) tới NĐBH, người thụ hưởng, Ban TBH/đồng BH (nếu có) — gửi **bưu điện có báo phát**, đồng thời **nhắn tin** cho NĐBH.
5. Cập nhật **ước BT = 0** trong 02 ngày và nhập **bồi thường = 0** trong 30 ngày kể từ khi gửi thông báo.
!! Theo Quy tắc, PTI phải giải thích lý do từ chối bằng văn bản trong 15 ngày kể từ khi nhận đủ hồ sơ hợp lệ.`,
  s: 'QT PTI.XCG.20 – mục 4.2.3.1, 5.1.1; QT VCX 109/2025 – khoản 8.2.5', r: ['qt-loaitru', 'sb-khieunai'] },

{ id: 'dg-chuaxd', g: 'duyetgia',
  q: 'Hồ sơ chưa xác định được phạm vi bảo hiểm (ghi nhận giá) xử lý thế nào?',
  k: ['chưa xác định phạm vi', 'ghi nhận giá', 'ghi nhận chi phí', 'BM 20.27', 'BM 20.28', 'thiếu chứng từ', 'công nhận giá', 'tự khắc phục'],
  a: `- Tập hợp thông tin, chỉ rõ tài liệu còn thiếu; lập **Tờ trình phương án** (VCX BM 20.25; TNDS NT3 & HK 25A; hàng hoá 25B; lái phụ xe & NNTX 25C), trình check & validate theo thời hạn Bước 4.
- Sau khi duyệt: gửi **Thông báo phương án ghi nhận giá BM 20.27** kèm **bảng kê BM 20.28** tới NĐBH, người thụ hưởng, gara.
- NĐBH **tự khắc phục** → hướng dẫn thu thập chứng từ theo PL.20.15 (hoá đơn, uỷ quyền BM 20.29 để PTI khấu trừ thuế).
- Hướng dẫn NĐBH **lưu giữ vật tư thu hồi** và bàn giao cho PTI trước khi bồi thường.
- Tiếp tục thu thập chứng từ để xét phạm vi → khi đủ căn cứ quay lại Bước 4 đề xuất phương án chính thức.`,
  s: 'QT PTI.XCG.20 – mục 4.2.3.2, 5.1.2, 5.3', r: ['dg-thoihan', 'ct-thue'] },

{ id: 'dg-tamung-tn', g: 'duyetgia',
  q: 'Tạm ứng bồi thường bảo hiểm tự nguyện (VCX) cho khách hàng/gara thế nào?',
  k: ['tạm ứng', 'tạm ứng tự nguyện', 'tạm ứng VCX', 'tạm ứng gara', 'BM 20.26', '50%'],
  a: `- **Điều kiện:** đã xác định vụ việc **thuộc phạm vi BH** + có **văn bản đề nghị tạm ứng** của NĐBH.
- Mức: **tối đa 50%** giá trị tổn thất/mức độ thiệt hại thuộc trách nhiệm của PTI.
- GĐV lập **Tờ trình tạm ứng BM.PTI.XCG.20.26** trong ≤ 01 ngày sau khi nhận đề nghị (và sau khi duyệt phạm vi); check & validate ≤ 01 ngày.
- Sau khi duyệt: gửi **Thông báo chi tạm ứng BM 20.06**, lập đề nghị chi tạm ứng BM 20.07.
- Tạm ứng thiệt hại **người** của BB TNDS là quy định riêng (xem mục TNDS).`,
  s: 'QT PTI.XCG.20 – mục 4.3, 5.1.3; QT VCX 109/2025 – khoản 8.2.7', r: ['td-tamung'] }
);
/* ─── 4. CHỨNG TỪ & THANH TOÁN (Bước 5–6) ─── */
TL_KB.push(
{ id: 'ct-thongbao', g: 'chungtu',
  q: 'Sau khi phương án được duyệt phải gửi thông báo gì, trong bao lâu?',
  k: ['thông báo phương án', 'gửi thông báo', 'BM 20.34', 'bảo lãnh thanh toán', 'BM 20.35', 'sau khi duyệt', 'thông báo chi tạm ứng'],
  a: `Gửi trong ≤ **04 giờ** sau khi được phê duyệt, tới NĐBH, gara/đối tác, người thụ hưởng, Ban Tái BH/nhà đồng BH (nếu có):
|Kết quả duyệt|Văn bản gửi|
|Thuộc phạm vi BH|Thông báo phương án GQBT **BM 20.34** + bảng kê **BM 20.28**; Bảo lãnh thanh toán **BM 20.35** (nếu duyệt bảo lãnh); Thông báo chi tạm ứng BM 20.06 (nếu có)|
|Chưa xác định phạm vi|Thông báo ghi nhận giá **BM 20.27** + bảng kê BM 20.28|
|Không thuộc phạm vi|Thông báo từ chối **BM 20.30** + BM 20.28 — gửi có báo phát + nhắn tin|`,
  s: 'QT PTI.XCG.20 – mục 5.1', r: ['ct-giamsat', 'dg-tuchoi'] },

{ id: 'ct-giamsat', g: 'chungtu',
  q: 'Giám sát sửa chữa và xử lý hạng mục phát sinh thế nào?',
  k: ['giám sát sửa chữa', 'phát sinh', 'hạng mục phát sinh', 'báo giá phát sinh', 'trong quá trình sửa chữa'],
  a: `- Ngay sau khi gửi thông báo phương án: xác lập HĐ sửa chữa BM 20.40 (nếu > 50 triệu chưa thuế) theo PL.20.07.
- Phối hợp chủ xe/NĐBH giám sát quá trình sửa chữa.
- Phát sinh hạng mục thiệt hại được xác định **có nguyên nhân từ vụ tai nạn** → lập biên bản GĐ chi tiết thiệt hại phát sinh và bổ sung chi phí theo Bước 3 → 4 → 5.`,
  s: 'QT PTI.XCG.20 – mục 5.2; PL.PTI.XCG.20.10 – mục 2.6', r: ['dg-hopdongsc', 'ct-thuhoi'] },

{ id: 'ct-thuhoi', g: 'chungtu',
  q: 'Thu hồi vật tư, phụ tùng thay thế sau sửa chữa thế nào?',
  k: ['thu hồi vật tư', 'thu hồi phụ tùng', 'vật tư thu hồi', 'BM 20.45', 'ký gửi', 'BM 20.58', 'lưu bãi', 'xác xe'],
  a: `Thời hạn: ≤ **02 ngày** sau khi nghiệm thu sửa chữa.
- **Đã xác định phạm vi BH, tổn thất bộ phận:** thu hồi vật tư đã thay thế theo **BM 20.45** (Biên bản thu hồi & ký gửi tài sản). Bộ phận thay mới — kể cả khi đã trừ khấu hao — thuộc sở hữu PTI.
- **Tổn thất toàn bộ:** xác định chi phí lưu bãi/lưu kho, trình lãnh đạo; bàn giao ký gửi xác xe với đơn vị lưu kho theo **BM 20.58**.
- **Chưa xác định phạm vi (ghi nhận giá):** hướng dẫn NĐBH lưu giữ, bảo quản vật tư và bàn giao cho PTI trước khi bồi thường.
- Sau bồi thường: bàn giao tài sản thu hồi cho bộ phận **thanh lý**.`,
  s: 'QT PTI.XCG.20 – mục 5.3, 7.1.5; QT VCX 109/2025 – khoản 17.3', r: ['sb-viecsau', 'dg-toanbo'] },

{ id: 'ct-suachua', g: 'chungtu',
  q: 'Bộ chứng từ bồi thường bằng hình thức sửa chữa gồm những gì?',
  k: ['chứng từ sửa chữa', 'bộ chứng từ', 'hồ sơ thanh toán', 'chứng từ thanh toán', 'hồ sơ gara', 'giấy tờ thanh toán gara'],
  a: `**Chung (bản gốc):** Giấy xác nhận phương án BT **BM 20.44**; chứng từ xác nhận/chuyển quyền thụ hưởng (nếu có).
**Sửa chữa (bản chính):**
- HĐ sửa chữa & phụ lục (nếu > 50 triệu chưa thuế) hoặc báo giá cuối cùng (thay HĐ).
- Biên bản thanh lý HĐ (nếu HĐ không tự động thanh lý).
- **Biên bản nghiệm thu.**
- **Hoá đơn điện tử**; chứng từ thanh toán (phần chủ xe đã trả).
- Uỷ quyền sửa chữa **BM 20.29** (khi hoá đơn mang tên NĐBH, để PTI khấu trừ thuế).
- Biên bản thu hồi & ký gửi tài sản BM 20.45; BM 20.58 (nếu có).
**Có cứu hộ:** hoá đơn, HĐ (nếu có), báo giá, phiếu thu.
- GĐV thu thập, kiểm tra tính đầy đủ, logic, hợp lệ và **upload** trong ≤ 01 ngày kể từ khi nhận.`,
  s: 'PL.PTI.XCG.20.15 – mục II; QT PTI.XCG.20 – mục 5.4', r: ['ct-hoadon', 'ct-nghiemthu', 'ct-dntt'] },

{ id: 'ct-hoadon', g: 'chungtu',
  q: 'Kiểm tra hoá đơn sửa chữa, cứu hộ như thế nào?',
  k: ['hoá đơn', 'hóa đơn', 'hóa đơn điện tử', 'phần mềm đọc hóa đơn', 'kiểm tra hóa đơn', 'hóa đơn hợp lệ'],
  a: `- **100% hoá đơn** phải upload vào **phần mềm đọc hoá đơn**; kết quả phải là **hợp lệ**.
- Hoá đơn ghi rõ đối tượng sửa chữa/cứu hộ (số khung và/hoặc biển số).
- Hạng mục & số tiền từng hạng mục khớp nội dung đã duyệt trong Tờ trình phương án.
- Xuất hoá đơn điện tử **chi tiết theo hạng mục** sửa chữa/thay thế thực tế.
- Hoá đơn giao PTI (trường hợp NĐBH tự sửa) phải là hoá đơn điện tử kèm mã tra cứu.`,
  s: 'PL.PTI.XCG.20.15 – mục I, III', r: ['ct-thue', 'ct-suachua'] },

{ id: 'ct-thue', g: 'chungtu',
  q: 'Hoá đơn sửa chữa xuất cho PTI hay khách hàng? Khấu trừ thuế GTGT thế nào?',
  k: ['xuất hóa đơn', 'hóa đơn xuất cho', 'xuất cho PTI', 'xuất cho khách', 'hóa đơn mang tên', 'khấu trừ thuế', 'thuế GTGT', 'VAT', 'ủy quyền sửa chữa', 'BM 20.29', 'hóa đơn cho PTI'],
  a: `Nguyên tắc: nghĩa vụ thanh toán cho nhà cung cấp thuộc ai thì **hoá đơn xuất cho người đó**.
- **PTI chịu trách nhiệm khắc phục** (PTI ký HĐ, thanh toán cho gara): hoá đơn **xuất cho PTI** → PTI được khấu trừ thuế GTGT đầu vào.
- **NĐBH tự khắc phục** (NĐBH ký HĐ, thanh toán): hoá đơn xuất cho NĐBH; để PTI khấu trừ thuế cần văn bản **uỷ quyền sửa chữa BM 20.29** (phần chênh lệch NĐBH tự chịu); thuế khấu trừ tương ứng phần trách nhiệm của PTI; hoá đơn điện tử có mã tra cứu.
- Hoá đơn sửa tài sản **NT3 mang tên NT3** → PTI **không** được khấu trừ, bồi thường **cả thuế**.
- **Bồi thường bằng tiền:** PTI bồi thường giá trị thiệt hại **trước thuế**; người nhận tiền lập chứng từ thu, không phải xuất hoá đơn.
!! Dữ liệu dashboard: Tiền ước/duyệt BT là số **chưa VAT**; Tiền đã trả KH/GR là số thực chi **đã gồm VAT**.`,
  s: 'PL.PTI.XCG.20.15 – mục I (TT 219/2013/TT-BTC, TT 09/2011/TT-BTC)', r: ['ct-hoadon', 'ct-bangtien'] },

{ id: 'ct-bangtien', g: 'chungtu',
  q: 'Khách hàng yêu cầu bồi thường bằng tiền cần chứng từ gì?',
  k: ['bồi thường bằng tiền', 'trả tiền mặt', 'không sửa chữa', 'BM 20.23', 'giấy yêu cầu bồi thường bằng tiền', 'nhận tiền'],
  a: `- **Giấy yêu cầu bồi thường bằng tiền BM.PTI.XCG.20.23** + biên bản bàn giao chứng từ liên quan (nếu có).
- Giấy xác nhận phương án BT BM 20.44 (bản gốc); chứng từ thụ hưởng (nếu có).
- PTI bồi thường giá trị thiệt hại **trước thuế** tương ứng phạm vi trách nhiệm.
!! Sau khi bồi thường bằng tiền (toàn bộ hoặc bộ phận không có chứng từ sửa chữa) mà HĐBH còn hiệu lực → trong ≤ 02 ngày GĐV thông báo KTV/đầu mối cấp đơn làm thủ tục **chấm dứt HĐBH/GCNBH** (email).`,
  s: 'PL.PTI.XCG.20.10 – mục 2.3; PL.PTI.XCG.20.15 – mục I.2; QT PTI.XCG.20 – mục 7.1.1', r: ['sb-viecsau', 'ct-thue'] },

{ id: 'ct-xacnhanpa', g: 'chungtu',
  q: 'Giấy xác nhận phương án bồi thường (BM 20.44) cần kiểm tra gì?',
  k: ['xác nhận phương án', 'BM 20.44', 'giấy xác nhận', 'chữ ký khách hàng', 'thông tin thụ hưởng', 'số tài khoản'],
  a: `Đối chiếu phương án đã duyệt với Giấy xác nhận phương án BT (mẫu PTI, **bản gốc**) do NĐBH xác nhận:
- Thẩm quyền người/đơn vị ký; chữ ký, con dấu.
- Đối tượng (số khung/số máy), ngày tổn thất.
- Người thụ hưởng, chủ tài khoản, **số tài khoản**, ngân hàng, số tiền, ngày ký.
!! NĐBH là cá nhân **uỷ quyền** cho cá nhân/pháp nhân khác thụ hưởng → giấy xác nhận/uỷ quyền phải được **chứng thực chữ ký**.
- Mẫu có 3 dạng: bản đủ, VCX rút gọn, VCX + cứu hộ.
- Giấy xác nhận phương án là mốc tính thời gian lưu hồ sơ 05 năm.`,
  s: 'PL.PTI.XCG.20.15 – mục II.1, III; QT PTI.XCG.20 – mục 7.3', r: ['gd-thuhuong', 'ct-dntt'] },

{ id: 'ct-nghiemthu', g: 'chungtu',
  q: 'Biên bản nghiệm thu sau sửa chữa cần đáp ứng gì?',
  k: ['nghiệm thu', 'biên bản nghiệm thu', 'nhận xe', 'bãi nại', 'nghiệm thu tài sản người thứ ba'],
  a: `- Thành phần (tên, địa chỉ, chức danh) đúng thẩm quyền; chữ ký, con dấu đúng người ký hồ sơ.
- Đối tượng nghiệm thu (biển số, số khung/số máy) khớp hồ sơ; nội dung đúng phương án đã duyệt.
- **VCX:** người giám sát & nghiệm thu là **NĐBH/chủ xe** hoặc đại diện hợp pháp.
- **TNDS tài sản:** NĐBH/PTI sửa tài sản cho NT3 → biên bản nghiệm thu phải có **chữ ký NT3**; NT3 không ký → phải có chứng từ **bãi nại** của NT3.`,
  s: 'PL.PTI.XCG.20.15 – mục III; PL.PTI.XCG.20.07', r: ['ct-suachua'] },

{ id: 'ct-dntt', g: 'chungtu',
  q: 'Lập đề nghị thanh toán và thời hạn chi trả bồi thường là bao lâu?',
  k: ['đề nghị thanh toán', 'ĐNTT', 'BM 20.46', 'thanh toán bồi thường', 'thời hạn thanh toán', 'trả tiền', '15 ngày', 'chi tiền'],
  a: `|Việc|Thời hạn|
|GĐV lập **Đề nghị thanh toán BM 20.46** (sau khi chứng từ đúng, đủ, đã upload)|≤ 03 ngày|
|Check & validate đề nghị thanh toán|≤ 02 ngày từ khi nhận đề xuất|
|Trung tâm thanh toán chi tiền|Tự động theo ngày hạn thanh toán; trường hợp khác ≤ 02 ngày làm việc|
- Check tập trung vào thông tin thụ hưởng: đối tượng, số tiền, chủ tài khoản, số tài khoản, hình thức nhận tiền.
!! Cam kết với khách theo Quy tắc VCX 2025: trả tiền BT trong **15 ngày làm việc** kể từ khi nhận đủ hồ sơ hợp lệ; phải xác minh thì không quá **30 ngày làm việc**; đã đề nghị CQCN xác minh quá **90 ngày** chưa có kết quả → PTI chủ động giải quyết trên tài liệu đã có.`,
  s: 'QT PTI.XCG.20 – mục 6.1.1, 6.1.2; PL.PTI.XCG.20.16; QT VCX 109/2025 – khoản 8.2.4', r: ['ct-xacnhanpa', 'dl-trangthai'] },

{ id: 'ct-toanbo', g: 'chungtu',
  q: 'Chứng từ bồi thường tổn thất toàn bộ (xác xe) gồm những gì?',
  k: ['chứng từ tổn thất toàn bộ', 'hồ sơ tổn thất toàn bộ', 'giấy tờ tổn thất toàn bộ', 'tổn thất toàn bộ cần giấy tờ', 'chứng từ xác xe', 'giấy chuyển giao quyền sở hữu', 'BM 20.42', 'BM 20.43', 'thu hồi đăng ký biển số', 'giải chấp', 'bản chà số khung'],
  a: `**Chủ xe cá nhân:**
- Giấy chuyển giao quyền sở hữu xác xe **BM 20.42** (bản gốc) — chữ ký chủ xe **và vợ/chồng**, chứng thực của công chứng hoặc chính quyền địa phương.
- Biên bản bàn giao xe & giấy tờ **BM 20.43** (bản gốc).
- Giấy chứng nhận **thu hồi đăng ký, biển số** (bản gốc, có dán bản chà số máy, số khung, dấu giáp lai của cơ quan đăng ký).
- Bản sao chứng thực: đăng ký xe; CCCD chủ xe và vợ/chồng; đăng ký kết hôn hoặc xác nhận độc thân.
- Văn bản xác nhận đã **giải chấp** (nếu xe đang thế chấp).
**Chủ xe tổ chức:** BM 20.42, BM 20.43, giấy thu hồi đăng ký biển số (bản gốc); đăng ký xe (sao chứng thực); văn bản giải chấp (nếu có).
!! Ngay khi nhận định tổn thất toàn bộ, liên hệ bộ phận **thanh lý xác xe** để được hướng dẫn chi tiết.`,
  s: 'PL.PTI.XCG.20.15 – mục II.3, III', r: ['dg-toanbo'] }
);

/* ─── 5. SAU BỒI THƯỜNG & HỆ THỐNG (Bước 7) ─── */
TL_KB.push(
{ id: 'sb-viecsau', g: 'saubt',
  q: 'Sau khi bồi thường xong GĐV còn phải làm gì?',
  k: ['sau bồi thường', 'bước 7', 'chấm dứt hợp đồng', 'thu đòi', 'đòi người thứ ba', 'tái bảo hiểm', 'đồng bảo hiểm', 'thanh lý tài sản', 'đóng hồ sơ'],
  a: `|Việc|Thời hạn|
|BT bằng tiền mà HĐBH còn hiệu lực → báo KTV/đầu mối cấp đơn **chấm dứt HĐBH/GCNBH** (email)|≤ 02 ngày sau GQBT|
|Thu đòi **tái/đồng BH** (PL.20.17)|≤ 02 ngày sau khi BT|
|**Đòi NT3** theo Bước 5 PL.20.04 (thế quyền)|≤ 02 ngày sau khi BT|
|Thu **hoàn ứng** từ Quỹ BH XCG (TNDS người, nếu không thuộc phạm vi)|Theo PL.20.03 (gửi hồ sơ ngày 05 hằng tháng)|
|Bàn giao tài sản thu hồi cho bộ phận **thanh lý**|Theo quy trình thu hồi & thanh lý tài sản|
- Sau cùng: đóng hồ sơ, lưu bản scan trên phần mềm và bản cứng tại đơn vị (05 năm).`,
  s: 'QT PTI.XCG.20 – mục 7.1, 7.3', r: ['sb-luutru', 'nt3-buoc', 'td-hoanung', 'sb-taibh'] },

{ id: 'sb-luutru', g: 'saubt',
  q: 'Lưu trữ hồ sơ bồi thường theo quy định nào, bao lâu?',
  k: ['lưu trữ', 'lưu hồ sơ', 'bản cứng', 'bản gốc', 'bản scan', '5 năm', 'OM', 'mất hồ sơ'],
  a: `- Lưu **bản scan/chụp** đính kèm phần mềm; lưu **bản cứng** tại đơn vị giải quyết hồ sơ. Đầu mối tiếp nhận hồ sơ lưu trữ: **OM** tại đơn vị.
- Thời gian lưu bản cứng: **05 năm** kể từ ngày kết thúc GQBT và có Giấy xác nhận phương án BT của NĐBH.
- **Phải lưu bản cứng:** tài liệu PTI lập có chữ ký KH (TBTN & YCBT, biên bản GĐ hiện trường & sơ đồ…), công văn đến của các bên, công văn gửi CQCN, chứng từ thanh toán, tài liệu CQCN làm căn cứ phạm vi/số tiền BT, xác nhận thụ hưởng của TCTD, giấy uỷ quyền thụ hưởng, CV phản hồi của cơ quan cấp bằng lái.
- Chỉ cần bản scan: đăng ký, đăng kiểm, GPLX, HĐBH/GCNBH, xác minh phí, chứng từ nộp phí…
!! Mất hồ sơ do không tuân thủ quy định → cán bộ đó chịu trách nhiệm.`,
  s: 'QT PTI.XCG.20 – mục 7.3; PL.PTI.XCG.20.18', r: ['sb-viecsau'] },

{ id: 'sb-khieunai', g: 'saubt',
  q: 'Khách hàng khiếu nại kết quả bồi thường thì xử lý và thời hạn thế nào?',
  k: ['khiếu nại', 'không đồng ý', 'khách phàn nàn', 'khởi kiện', 'tranh chấp', '90 ngày', 'thời hiệu'],
  a: `- NĐBH khiếu nại kết quả GQBT → thực hiện theo **Quy trình giải quyết khiếu nại** của Tổng công ty.
- Theo Quy tắc VCX 2025: thời hạn khiếu nại quyết định BT là **90 ngày** kể từ khi NĐBH nhận Thông báo BT (quá hạn PTI không giải quyết, trừ trở ngại khách quan).
- Thời hiệu **khởi kiện** về HĐBH: **03 năm** kể từ ngày biết/phải biết quyền lợi bị xâm phạm; tranh chấp không thương lượng được → Toà án tại Việt Nam.
- Thời hạn nộp hồ sơ YCBT: **01 năm** kể từ ngày xảy ra sự kiện BH.`,
  s: 'QT PTI.XCG.20 – mục 7.2; QT VCX 109/2025 – Điều 13', r: ['qt-thoihan', 'dg-tuchoi'] },

{ id: 'sb-huyhs', g: 'saubt',
  q: 'Hủy hồ sơ bồi thường, yêu cầu trả hồ sơ làm thế nào?',
  k: ['hủy hồ sơ', 'huỷ hồ sơ', 'trả hồ sơ', 'yêu cầu trả hồ sơ', 'hồ sơ trùng'],
  a: `**Hủy HSBT (luồng SOS)** — tại màn **3 - Báo giá**, chọn kiểu duyệt "Hủy hồ sơ":
- Hồ sơ **chưa có báo giá**: chọn lý do hủy + người Check, gửi yêu cầu.
- Hồ sơ **đã có báo giá**: nhập **Giảm trừ bồi thường = 100%** và lý do, rồi chọn lý do hủy + người Check, gửi yêu cầu.
- Check/Validate duyệt hoặc từ chối hủy tại màn 3 - Báo giá.
**Yêu cầu trả hồ sơ:** Make chọn "Yêu cầu trả hồ sơ" tại mục Tiện ích; hồ sơ đang ở Check → Check chọn hủy nhận Maker; đang ở Validate → Validate hủy nhận (đã duyệt thì hủy duyệt trước).`,
  s: 'PP – Luồng hủy HS SOS & yêu cầu trả hồ sơ', r: ['dl-trangthai'] },

{ id: 'sb-thulao', g: 'saubt',
  q: 'Thù lao giám định hiện trường và chi phí giám định được tính thế nào?',
  k: ['thù lao', 'thù lao giám định', 'thù lao hiện trường', 'chi phí giám định', 'thẻ taxi', 'công tác phí', '30km', 'ngoài giờ'],
  a: `**Thù lao GĐ hiện trường** (trả cho GĐV trực tiếp GĐ hiện trường, kể cả hồ sơ từ chối) — theo khoảng cách **một chiều** từ văn phòng khu vực đến nơi tổn thất:
|Khoảng cách|Trong giờ hành chính|
|≤ 30 km|150.000đ/vụ|
|30 – 100 km|300.000đ/vụ|
|100 – 150 km|400.000đ/vụ|
|> 150 km|500.000đ/vụ|
- Ngoài giờ (18h – 08h hôm sau): **x2**, tối đa 600.000đ/vụ. Thứ Bảy, Chủ nhật, ngày lễ: **x3**, tối đa 1.000.000đ/vụ.
- Chứng từ: **Biên bản giám định hiện trường**.
**Chi phí giám định** (hạch toán theo hồ sơ): trong phạm vi 30 km GĐV tự túc phương tiện; ngoài 30 km, ngoài giờ, trường hợp đặc biệt (cao tốc) hoặc được phê duyệt → ưu tiên **thẻ taxi** của TCT. Gồm cả khách sạn, cân đo đong đếm, sao chụp hồ sơ CQCN, thuê chuyên gia/GĐ, chuyển phát. Chứng từ: hoá đơn hợp lệ.`,
  s: 'PL.PTI.XCG.20.09', r: ['ht-bienban', 'dg-bangke'] },

{ id: 'sb-mologic', g: 'saubt',
  q: 'Trình mở logic hồ sơ bồi thường trên iLead làm thế nào, ai duyệt?',
  k: ['mở logic', 'mo logic', 'trình mở logic', 'iLead', 'ilead', 'phân quyền mở logic', 'điều chuyển ước quá hạn', 'gỡ ngày quyết định', 'chưa phát sinh doanh thu thực thu', 'không duyet hs khi chua phat sinh doanh thu', 'đã bảo lãnh sang trạng thái khác', 'check 1 check 2'],
  a: `Mở logic là thao tác xin mở khoá trạng thái hồ sơ trên phần mềm, trình qua **iLead** (Service Desk → My Request → Thêm yêu cầu).
**Bước 1 – GĐV thụ lý trình:** chọn Công ty PTI → Chi nhánh (VP ĐD giám định bồi thường PTI tại Hà Nội với GĐV Miền Bắc) → Loại dịch vụ **CG** → Quy trình **[CG] Trình chủ trương/Quy chế/chính sách/PA nhân sự…**
Thông tin **bắt buộc**: Số hồ sơ · Biển kiểm soát · Lý do yêu cầu (ghi chi tiết) · chọn User Check 1 (mọi trường hợp) · chọn User Check 2 (chỉ khi mở logic thay đổi Đề nghị thanh toán / gỡ ngày Quyết định) · User Validate · User tiếp nhận thực thi.
**Bước 2 – Check:** Checker 1 kiểm tra số hồ sơ, biển số, lý do có đúng thực tế, có tuân thủ quy định và không phát sinh rủi ro không. Checker 2 (trường hợp trên) xác nhận **đã trả hồ sơ trên cổng thanh toán**.
**Bước 3 – Validate:** kiểm tra đã check đủ và xét duyệt nội dung.
**Phân quyền mở logic điều chuyển ước quá hạn (số tiền chưa VAT):**
|Số tiền|Make|Check|Validate|
|≤ 30 trđ|GĐV|TP KV của GĐV thụ lý|TP thẩm định KV Miền|
|Trên 30 – 100 trđ|GĐV|TP KV của GĐV thụ lý|GĐ VP Miền|
|Trên 100 trđ|GĐV|TP KV của GĐV thụ lý|GĐ VP Miền (thực thi: GĐ TT SOS)|
- Mở logic từ **Đề nghị thanh toán → trạng thái khác** (gỡ ngày Quyết định): Make GĐV · Check 1 TP KV · Check 2 user phụ trách cổng thanh toán tự động · Validate & thực thi GĐ VP Miền.
- Mở logic từ **Đã bảo lãnh → trạng thái khác** và **các loại logic khác**: Make GĐV · Check TP KV · Validate & thực thi TP thẩm định KV Miền.
**Mở logic hồ sơ chưa phát sinh doanh thu thực thu** (lỗi *"Không DUYET HS khi chưa phát sinh doanh thu thực thu"* — tổn thất khi chưa đóng/đóng thiếu phí, có sửa đổi phí sau ngày tổn thất):
- Tên yêu cầu: *Mở logic HSBT chưa phát sinh doanh thu thực thu*; lý do chọn theo mẫu (tổn thất trong hạn thanh toán phí / kênh bán đã thu phí của KH chưa đến hạn nộp cho PTI / hợp đồng chia kỳ đã thanh toán kỳ trước / có SĐBS về phí sau ngày tổn thất…).
- Đính kèm: **phiếu xác minh phí**, hợp đồng bảo hiểm/đại lý/thoả thuận hợp tác, danh sách đối soát – xác nhận cấp đơn, phiếu thu của kênh/đại lý, uỷ nhiệm chi, báo có ngân hàng, chuyển quyền thụ hưởng… Đơn cấp qua kênh phải có **biên bản đối soát ký và đóng dấu hai bên**.
- Thời gian mở hạn cho GĐV thực hiện: **từ ngày mở đến ngày cuối của tháng tiếp theo**. Ban Vận hành xử lý trong **24 giờ** kể từ khi nhận yêu cầu.
!! Chứng từ chứng minh nộp phí đã trình trên iLead vẫn **phải upload vào hồ sơ trên PMNV** để phục vụ hậu kiểm.`,
  s: 'Hướng dẫn trình mở logic HSBT NV XCG & Bảng phân quyền mở logic (docs/Kho tri thức — Tiện ích tra cứu CV)', r: ['gd-thanhtoanphi', 'gd-xmp', 'sb-ktnb'] },

{ id: 'sb-ktnb', g: 'saubt',
  q: 'Kiểm toán nội bộ lưu ý những lỗi nào trong hồ sơ bồi thường XCG?',
  k: ['KTNB', 'kiểm toán nội bộ', 'lỗi hồ sơ', 'upload chứng từ PMNV', 'thẩm quyền Make', 'vượt thẩm quyền', 'đóng hồ sơ bằng 0', 'nhập bồi thường bằng 0', 'công văn từ chối', 'hậu kiểm', 'khuyến nghị kiểm toán'],
  a: `Kết quả kiểm tra hồ sơ bồi thường XCG của Kiểm toán nội bộ — các nội dung bắt buộc thực hiện:
- **Hồ sơ TNDS / hồ sơ 2 bước:** người **Make** phải upload **đầy đủ chứng từ** vào hồ sơ trên PMNV. Người **Check/Validate** phải kiểm tra hồ sơ trên PMNV trước khi duyệt (mail hoặc bản cứng) và **chỉ duyệt khi chứng từ đã đủ**.
- **Thẩm quyền Make:** trường hợp **vượt thẩm quyền Make** phải có người đủ thẩm quyền hướng dẫn, đồng hành; việc đồng hành thể hiện bằng **chữ ký của người đồng hành trên Biên bản giám định**. GĐV phải báo Trưởng nhóm/người đủ thẩm quyền để cùng thực hiện.
- **Hồ sơ từ chối bồi thường:** bắt buộc cập nhật/**upload Công văn từ chối** vào hồ sơ trên PMNV.
- **Hồ sơ đóng / nhập bồi thường bằng 0:** bắt buộc **nhập đầy đủ lý do đóng hồ sơ** trên PMNV. Người Validate chỉ duyệt đóng khi đã đáp ứng đủ.
- **Hồ sơ mở logic về phí:** chứng từ chứng minh việc nộp phí đã thể hiện trên iLead vẫn phải **upload vào hồ sơ trên PMNV**.
- **Gửi thống kê sai phạm cho Đơn vị kinh doanh:** phải **CC bộ phận SAS** để phối hợp theo dõi, kiểm soát.
!! Trưởng nhóm/FCM phải tăng cường kiểm soát ngay từ bước **Make** để hạn chế sai sót lặp lại.`,
  s: 'Thông báo TTSOS về thực hiện khuyến nghị của Kiểm toán nội bộ nghiệp vụ XCG (docs/Kho tri thức — Tiện ích tra cứu CV)', r: ['sb-mologic', 'dg-tuchoi', 'sb-saipham'] },

{ id: 'sb-saipham', g: 'saubt',
  q: 'Phát hiện sai phạm cấp đơn khi giải quyết bồi thường thì báo cho ai?',
  k: ['sai phạm cấp đơn', 'báo cáo sai phạm', 'CC SAS', 'bộ phận SAS', 'thông tư 50', 'ảnh khai thác', 'nhập sai kênh khai thác', 'đóng phí không đúng quy định', 'hồ sơ lỗi ngày quyết định', 'KPI xử phạt'],
  a: `**Báo cáo sai phạm cấp đơn:** khi tiếp nhận, xử lý hồ sơ bồi thường mà phát hiện sai phạm liên quan đến cấp đơn, GĐV lập báo cáo gửi bộ phận Kinh doanh và **bắt buộc CC đầu mối bộ phận SAS**. Các sai phạm thường gặp (không giới hạn):
- Đóng phí không đúng quy định, dẫn đến phải bổ sung/cung cấp **Thông tư 50** (tiềm ẩn rủi ro bị chỉnh sửa, can thiệp nội dung).
- **Không có ảnh khai thác** hoặc ảnh khai thác không đúng quy định.
- **Nhập sai kênh khai thác**.
- Các sai sót nghiệp vụ khác có liên quan.
**Hồ sơ lỗi đã có ngày quyết định** (nhập liệu sai dẫn đến hồ sơ lỗi): luồng trình gồm **M** (GĐV gây lỗi) → **C1** (SM Khu vực) → **C2** (Trung tâm kế toán nghiệp vụ) → **C3** (BP Vận hành) → **V** (TM hoặc SM Miền). Thực thi: lỗi 1 — mở bổ sung vùng chờ hồ sơ mới; lỗi 2 — kiểm soát thu hồi hồ sơ cũ rồi mới mở vùng chờ hồ sơ mới.
!! Từ kỳ KPIs **tháng 10/2025** trở đi, vi phạm nhập liệu dẫn đến hồ sơ lỗi có ngày quyết định **bị xử phạt nghiêm** (trước đó kỳ 09/2025 được đề xuất không hạ bậc KPIs). GĐV phải nhập liệu cẩn thận, đúng chuẩn mực.`,
  s: 'Thông báo TT PTI SOS về báo cáo sai phạm cấp đơn và luồng trình hồ sơ lỗi đã có ngày quyết định (docs/Kho tri thức — Tiện ích tra cứu CV)', r: ['sb-ktnb', 'gd-trucloi'] },

{ id: 'sb-19072024', g: 'saubt',
  q: 'Hồ sơ mở trước và từ 19/07/2024 khác nhau thế nào về quy trình, biểu mẫu?',
  k: ['19/07/2024', '19-07-2024', 'hồ sơ mở trước', 'ký tay', 'ký số', 'tờ trình bồi thường', 'thông báo phương án giải quyết', 'đề nghị thanh toán', 'hệ thống tự sinh', 'giao thoa quy trình', 'make check validate trên web'],
  a: `Chứng từ nghiệp vụ đính kèm khi trình thanh toán bồi thường chia **2 nhóm theo ngày mở hồ sơ**:
|Nội dung|Hồ sơ mở **trước 19/07/2024**|Hồ sơ mở **từ 19/07/2024**|
|Quy trình|GĐV làm tờ trình duyệt giá và bồi thường **ký tay**, nhập liệu trên web|GĐV làm **hoàn toàn trên web**, Make – Check – Validate trên hệ thống|
|Biểu mẫu|Tờ trình bồi thường (ký tay) · Thông báo bồi thường (ký tay)|**Thông báo phương án giải quyết yêu cầu bồi thường** và **Đề nghị thanh toán** — hệ thống tự sinh sau khi Validate|
- Biểu mẫu của hồ sơ từ 19/07/2024 **chỉ sinh ra sau khi Validate** và **không có chữ ký tay**: Thông báo phương án giải quyết bồi thường mang **hình ảnh ký số và tên người Validate**; Đề nghị thanh toán hiển thị ngày duyệt tại mục "Ngày đề nghị thanh toán" cùng tên – vai trò những người giải quyết hồ sơ.
- Khi trình thanh toán trên iLead: người **Make là GĐV**, người **Check là Trưởng phòng khu vực**; chứng từ đính kèm gồm hoá đơn, bảng kê danh sách (nếu có) và chứng từ nghiệp vụ theo bảng trên.
- Chọn chi nhánh luồng thanh toán: GĐV Miền Bắc chọn **"VP ĐD Giám định Bồi thường PTI tại Hà Nội" (090)**; Miền Nam chọn mã **091**. Mỗi hồ sơ chỉ chọn đúng **01 luồng thanh toán**.`,
  s: 'Hướng dẫn trình thanh toán bồi thường trên iLead giai đoạn giao thoa quy trình (docs/Kho tri thức — Tiện ích tra cứu CV)', r: ['ct-dntt', 'sb-mologic'] },

{ id: 'sb-thanhly', g: 'saubt',
  q: 'Thu hồi và thanh lý tài sản sau bồi thường (xác xe, phụ tùng) làm thế nào?',
  k: ['thu hồi tài sản', 'thanh lý tài sản', 'xác xe', 'bán thanh lý', 'hội đồng thanh lý', 'chào giá cạnh tranh xác xe', 'tiêu hủy phụ tùng', 'giá khởi điểm', 'niêm yết công khai', 'quyền sở hữu xác xe', 'khấu trừ giá trị thu hồi'],
  a: `Quy trình thu hồi và thanh lý tài sản sau bồi thường NV BH XCG (ban hành **01/07/2025**).
**Nguyên tắc thu hồi:**
- Tài sản **không có giá trị bán thanh lý** nhưng dễ bị trục lợi (ảnh khó thể hiện thiệt hại, garage dễ chuyển từ thay thế sang sửa chữa…) vẫn **phải thu hồi hoặc tiêu huỷ**.
- Tài sản thu hồi phải được quản lý chặt chẽ **từ khâu tháo dỡ giám định đến khi tổ chức bán thanh lý**; phải kiểm kê, lập hồ sơ lưu trữ và bảo quản đầy đủ.
- Mọi hoạt động thanh lý phải lập **văn bản bàn giao** có chữ ký xác nhận các bên, ghi rõ thông tin xe, tình trạng, thời điểm giao nhận. Hồ sơ thu hồi phải lưu đầy đủ, tra cứu được.
**Nguyên tắc thanh lý:**
- Trước khi thanh lý phải xác định rõ **quyền định đoạt**: (i) đã bồi thường cho KH và tài sản thuộc sở hữu PTI; hoặc (ii) đang trong quá trình xét duyệt, PTI và NĐBH **thống nhất bằng văn bản** thanh lý trước bồi thường, **khấu trừ trực tiếp vào tiền bồi thường** và PTI **không nhận quyền sở hữu**.
- Phải kiểm tra hiện trạng bằng hình ảnh, mô tả, đánh giá; có **biên bản định giá** (nội bộ hoặc thuê định giá độc lập) và đủ hồ sơ giấy tờ trước khi bán.
- Giá bán và quyết định thanh lý phải khách quan, dựa trên tình trạng thực tế và giá thị trường/tổ chức giám định độc lập, và do **Hội đồng thanh lý** phê duyệt.
- Thông tin chào bán phải **niêm yết công khai trên ít nhất một kênh chính thức của PTI** (ví dụ website), gồm: mô tả tài sản, tình trạng thực tế, ảnh chụp, **giá khởi điểm**, phương thức chào giá, thời hạn nhận đề nghị mua, phương thức lựa chọn.
- **Thành viên Hội đồng thanh lý không được mua** tài sản thanh lý, không nhờ người khác mua hộ, không dành ưu ái cho đối tác.
**Bước 2 – Xét duyệt tài sản thu hồi:** người có thẩm quyền duyệt hồ sơ có thể điều chỉnh danh mục phải thu hồi/không thu hồi so với đề xuất của GĐV, xác nhận tại **biên bản giám định**.
- **Không thu hồi, tài sản không có giá trị** → tổ chức **tiêu huỷ** đúng quy định môi trường, an toàn, có chứng kiến của đại diện các bên (PTI và đơn vị sửa chữa/lưu trữ); lập **biên bản tiêu huỷ kèm hình ảnh** và lưu hồ sơ.
- **Xác xe, PTI đồng thuận với chủ xe:** quy trình chào giá và thanh lý xác xe chạy **song song** với giải quyết bồi thường tổn thất toàn bộ; lập **Biên bản làm việc uỷ quyền chào giá thanh lý xác xe** (mẫu NVXE039.03.01) và **Biên bản xác định số tiền bồi thường còn lại** (mẫu NVXE039.03.02).
- Toàn bộ chào giá, xác định người mua, ký hợp đồng và xử lý thanh lý xác xe phải hoàn tất trong **20 ngày làm việc** kể từ ngày Hội đồng thanh lý xác định giá khởi điểm (được gia hạn tương ứng nếu phải bổ sung hồ sơ chào giá hoặc xin phê duyệt lại giá khởi điểm).
!! Việc thanh lý/định đoạt xác xe phải phù hợp Luật KDBH, Bộ luật Dân sự, quy định nội bộ PTI và điều khoản HĐBH đã ký, và **không làm ảnh hưởng quyền, lợi ích hợp pháp của người được bảo hiểm**.`,
  s: 'QĐ ban hành Quy trình thu hồi và thanh lý tài sản sau bồi thường NV BH XCG, 01/07/2025 – mục 4.1, 4.2, Bước 2', r: ['ct-thuhoi', 'dg-toanbo', 'ct-toanbo'] }
);
/* ─── 6. QUY TẮC VCX 2025 (QĐ 109/QĐ-PTI) ─── */
TL_KB.push(
{ id: 'qt-phamvi', g: 'quytac',
  q: 'Phạm vi bảo hiểm vật chất xe ô tô gồm những rủi ro nào?',
  k: ['phạm vi bảo hiểm', 'được bồi thường', 'rủi ro được bảo hiểm', 'thiên tai', 'đâm va', 'lật đổ', 'hỏa hoạn', 'mưa đá', 'lũ lụt', 'vật thể rơi'],
  a: `PTI bồi thường thiệt hại vật chất xe do thiên tai, tai nạn **bất ngờ, không lường trước**:
- Đâm, va; lật, đổ, chìm, rơi toàn bộ xe.
- Vật thể khác từ bên ngoài rơi vào, va chạm vào xe.
- Hoả hoạn, cháy, nổ.
- Thiên tai: giông, bão, sóng thần, gió lốc, mưa đá, lụt, triều cường; động đất, sụt lở đất; sét đánh.
- Mất **toàn bộ** xe do trộm, cướp.
- Chi phí cần thiết, hợp lý theo chỉ dẫn PTI: hạn chế tổn thất phát sinh; cứu hộ, vận chuyển xe tới nơi sửa chữa — tối đa **10% STBH**.
- Tổng bồi thường một sự kiện không vượt STBH. Quy tắc chỉ áp dụng cho **xe ô tô** (không áp dụng xe máy, xe máy điện…).`,
  s: 'QT VCX 109/2025 – Điều 2, Điều 14', r: ['qt-loaitru', 'qt-dkbs'] },

{ id: 'qt-loaitru', g: 'quytac',
  q: 'Các điểm loại trừ bảo hiểm vật chất xe (không bồi thường) là gì?',
  k: ['loại trừ', 'điểm loại trừ', 'không bồi thường', 'không được bảo hiểm', 'không chi trả', 'từ chối vì', 'ngoài phạm vi'],
  a: `Quy tắc VCX 2025 – Điều 15 (tóm tắt):
- 15.1 **Cố ý** gây thiệt hại. 15.2 Không có **đăng kiểm** hợp lệ, còn hiệu lực/đăng kiểm không còn giá trị (trừ xe mới chờ đăng ký ≤ 30 ngày, xe lưu hành tạm thời, xe hoạt động nội bộ có ghi trong HĐ).
- 15.3 Thông số kỹ thuật không khớp đăng kiểm (trừ la-zăng/lốp; thùng hàng có ghi trong HĐ).
- 15.4 Không có **GPLX**/GPLX không phù hợp/hết hạn; bị tước bằng. 15.5 **Nồng độ cồn** từ 50 mg/100 ml máu hoặc 0,25 mg/lít khí thở; ma tuý, chất kích thích cấm.
- 15.6 Đi đêm không đèn; đi vào đường cấm; rẽ, quay đầu nơi cấm; **đi ngược chiều**; dừng đỗ nơi cấm; **vượt đèn đỏ**, không chấp hành hiệu lệnh.
- 15.7 Đua xe, kéo xe trái quy định, chạy thử sau sửa chữa. 15.8 Chở hàng cháy nổ trái phép. 15.9 Ngoài lãnh thổ VN. 15.10 Chiến tranh, khủng bố.
- 15.11 Quá tải/quá số người **trên 50%**; quá tốc độ **trên 50%**.
- 15.12 Hao mòn tự nhiên, giảm giá trị thương mại, khuyết tật, hỏng thêm do sửa chữa, ăn mòn, ô xi hoá.
- 15.13 **Động cơ hư do nước** khi xe hoạt động vùng ngập (trừ BS06). 15.14 Thiệt hại riêng động cơ không do đâm va, lật đổ.
- 15.15 Pin xe điện không chính hãng/lỗi nhà SX/hao mòn. 15.16 Thiệt hại **riêng** săm lốp, bạt phủ, nhãn mác, logo, chắn bùn, chụp trục bánh, ắc quy.
- 15.17 Mất **bộ phận** do trộm cướp (trừ BS04). 15.18 Mất xe do lừa đảo, lạm dụng tín nhiệm. 15.19 Thiết bị điện hư do quá tải, chập, rò điện.
- 15.20 Thiết bị lắp thêm (trừ thiết bị bảo vệ hoặc có ghi trong HĐ). 15.21 Hàng hoá trên xe gây hư xe không do đâm va, lật đổ (trừ BS25).`,
  s: 'QT VCX 109/2025 – Điều 15', r: ['qt-con', 'gd-gplx', 'gd-dangkiem', 'dg-tuchoi'] },

{ id: 'qt-con', g: 'quytac',
  q: 'Lái xe có nồng độ cồn, ma tuý thì bồi thường thế nào?',
  k: ['nồng độ cồn', 'rượu bia', 'say rượu', 'cồn', 'ma túy', 'chất kích thích', 'xét nghiệm cồn', 'không thổi nồng độ cồn'],
  a: `- **VCX:** loại trừ khi lái xe có nồng độ cồn **từ 50 mg/100 ml máu hoặc 0,25 mg/1 lít khí thở** trở lên; sử dụng ma tuý, chất kích thích bị cấm (15.5).
- Lái xe **không thực hiện yêu cầu xét nghiệm** nồng độ cồn/chất kích thích tại cơ quan y tế/chức năng theo yêu cầu PTI → bị coi là không phối hợp, **giảm trừ 50% – 100%** STBT (12.1.3).
- **BB TNDS:** loại trừ thiệt hại **tài sản** do lái xe có nồng độ cồn vượt trị số bình thường theo hướng dẫn Bộ Y tế, ma tuý, chất kích thích cấm. Thiệt hại về **người** (sức khoẻ, tính mạng) của NT3, hành khách không thuộc điểm loại trừ này.
- Căn cứ: kết quả của CQCN (biên bản đo, xét nghiệm) — thu thập trong hồ sơ công an.`,
  s: 'QT VCX 109/2025 – khoản 7.2.7, 12.1.3, 15.5; NĐ 67/2023 – Điều 7 (theo PL.PTI.XCG.20.12)', r: ['qt-loaitru', 'td-loaitru'] },

{ id: 'qt-nghiavu', g: 'quytac',
  q: 'Nghĩa vụ của chủ xe, lái xe khi xảy ra tai nạn theo Quy tắc?',
  k: ['nghĩa vụ chủ xe', 'nghĩa vụ khách hàng', 'khách phải làm gì', 'thông báo 5 ngày', 'mất trộm 24 giờ', 'không phối hợp', 'bàn giao phụ tùng'],
  a: `- Tích cực cứu chữa, hạn chế thiệt hại, bảo vệ hiện trường; **báo ngay PTI (1900 54 54 75)** và công an/chính quyền gần nhất.
- Gửi **thông báo tai nạn bằng văn bản** (mẫu PTI) trong **05 ngày** kể từ ngày TN (trừ bất khả kháng).
- **Mất trộm, cướp toàn bộ xe:** báo ngay công an; thông báo PTI bằng văn bản trong **24 giờ** kể từ khi phát hiện.
- Không tự ý rời/di chuyển hiện trường; không tự **tháo dỡ, sửa chữa** khi chưa có ý kiến PTI (trừ an toàn, theo yêu cầu cơ quan thẩm quyền).
- Phối hợp GĐ và **ký biên bản** (không đồng ý thì ghi ý kiến và ký dưới ý kiến).
- Liên quan NT3: bảo lưu quyền khiếu nại, **chuyển giao quyền đòi** NT3 cho PTI kèm hồ sơ.
- Bàn giao cho PTI bộ phận đã được bồi thường thay thế; trả chi phí tháo dỡ, sửa chữa nếu tổn thất không thuộc phạm vi BH.
!! Coi là **không phối hợp**: không ký biên bản GĐ/xác minh, không cung cấp tài liệu theo yêu cầu, lái xe không chịu xét nghiệm nồng độ cồn/chất kích thích.`,
  s: 'QT VCX 109/2025 – khoản 7.2.7 – 7.2.12', r: ['dg-giamtru', 'tn-khonglienlac'] },

{ id: 'qt-hoso', g: 'quytac',
  q: 'Hồ sơ bồi thường VCX theo Quy tắc gồm những gì?',
  k: ['hồ sơ bồi thường', 'hồ sơ yêu cầu bồi thường', 'giấy tờ bồi thường', 'hồ sơ VCX', 'mất trộm cần giấy tờ gì'],
  a: `**Khách hàng cung cấp:**
- Thông báo tổn thất & yêu cầu BT (mẫu PTI).
- Tài liệu xe & lái xe (bản sao có xác nhận cơ quan thẩm quyền hoặc bản sao có ký xác nhận của nhân viên PTI sau khi đối chiếu bản chính): GCNBH/HĐBH; đăng ký xe; GPLX người lái; giấy tờ mua bán, chuyển nhượng, uỷ quyền (nếu có); GCN kiểm định (trừ xe lưu hành tạm thời/đang đăng ký lần đầu).
- Chứng minh thiệt hại: hoá đơn, chứng từ sửa chữa/thay mới; chứng từ chi phí hạn chế tổn thất.
- **Mất trộm/cướp toàn bộ:** đơn trình báo mất xe có xác nhận công an; đơn trình báo mất giấy tờ để trên xe; quyết định khởi tố (nếu có); kết luận điều tra hoặc quyết định đình chỉ điều tra/vụ án.
- Biên bản thoả thuận/hoà giải; bản án (nếu có); tài liệu chuyển quyền đòi NT3.
**PTI phối hợp thu thập:** hồ sơ công an (khám nghiệm hiện trường, phương tiện, sơ đồ, kết luận điều tra…), tài liệu về lỗi NT3, biên bản GĐ có chữ ký các bên.`,
  s: 'QT VCX 109/2025 – Điều 10; PL.PTI.XCG.20.10 – mục 2', r: ['ht-thuthapct', 'ht-cqcn'] },

{ id: 'qt-thoihan', g: 'quytac',
  q: 'Các thời hạn theo Quy tắc: thông báo, nộp hồ sơ, trả tiền, từ chối, khiếu nại?',
  k: ['thời hạn', 'thời hạn bồi thường', 'thời hạn khởi kiện', 'thời hạn khiếu nại', 'thời hạn nộp hồ sơ', 'bao nhiêu ngày', 'thời hạn trả tiền', '15 ngày làm việc', '1 năm', '90 ngày', '3 năm', 'thời hiệu'],
  a: `|Việc|Thời hạn|
|Khách gửi thông báo tai nạn bằng văn bản|05 ngày kể từ ngày TN|
|Mất trộm, cướp toàn bộ — thông báo PTI bằng văn bản|24 giờ kể từ khi phát hiện|
|Báo PTI khi thay đổi yếu tố tính phí (mục đích sử dụng, hoán cải…)|Chậm nhất 15 ngày; PTI trả lời trong 05 ngày|
|Nộp hồ sơ yêu cầu bồi thường|01 năm kể từ ngày xảy ra sự kiện BH|
|PTI trả tiền bồi thường|15 ngày làm việc từ khi đủ hồ sơ hợp lệ; cần xác minh ≤ 30 ngày làm việc|
|Chờ CQCN xác minh quá hạn|Sau 90 ngày kể từ khi PTI có văn bản đề nghị → PTI chủ động giải quyết|
|PTI từ chối — giải thích bằng văn bản|15 ngày từ khi đủ hồ sơ (cần xác minh ≤ 30 ngày làm việc)|
|Khách khiếu nại quyết định bồi thường|90 ngày từ khi nhận thông báo BT|
|Khởi kiện về HĐBH|03 năm|`,
  s: 'QT VCX 109/2025 – khoản 7.2, 8.2, Điều 13', r: ['ct-dntt', 'sb-khieunai'] },

{ id: 'qt-dkbs', g: 'quytac',
  q: 'Các điều khoản bổ sung (BS) của bảo hiểm vật chất xe và khấu trừ riêng?',
  k: ['điều khoản bổ sung', 'ĐKBS', 'BS01', 'BS02', 'BS04', 'BS05', 'BS06', 'BS07', 'BS08', 'BS09', 'BS13', 'BS14', 'BS15', 'BS17', 'BS25', 'BS26', 'BS27', 'mã điều khoản', 'ngoài lãnh thổ', 'đi Lào', 'Trung Quốc', 'khấu trừ bậc thang', 'thiết bị lắp thêm', 'tăng giảm xe', 'gia hạn bảo hiểm'],
  a: `ĐKBS chỉ có hiệu lực khi **ghi rõ tên + mã số** trên GCNBH/HĐBH và đã đóng phụ phí (nếu có).
|Mã|Nội dung|Ghi chú|
|BS01|Xe ngoài lãnh thổ VN (Lào, Trung Quốc)|Không BT mất xe ngoài VN|
|BS02|Thay thế mới — không trừ khấu hao|Trừ lốp, ắc quy, bạt, lọc, dầu (≤ 50%)|
|BS04|Mất trộm, cướp bộ phận|≤ 02 vụ/năm; HĐ ≥ 12 tháng; KT 20%, min 2tr|
|BS05|Lựa chọn cơ sở sửa chữa chính hãng|Giá phải hợp lý, so sánh cơ sở cùng địa bàn|
|BS06|Động cơ hư khi xe hoạt động vùng ngập|KT 20%, min 3tr|
|BS07|Thay xe mới năm đầu tiên (xe ≤ 1 năm)|Khi tổn thất toàn bộ|
|BS08|Khấu trừ bậc thang|0,5 → 2,5 triệu theo số lần BT|
|BS09|Chi phí thuê xe khi sửa chữa|Khoán/ngày; ≤ 30 ngày/năm; KT 5/4/3 ngày theo gói|
|BS13|Thiết bị lắp thêm|Phụ phí 0%, cộng giá trị vào giá xe|
|BS14|Mất chìa khoá xe|01 lần/năm; KT 20%, min 2tr|
|BS15|Tự động BH xe tăng/giảm|Khai báo trong 07 ngày làm việc|
|BS17|Mở rộng thời hạn BH 30 ngày|Phí theo tỷ lệ thời gian|
|BS25|Hàng hoá trên xe gây hư xe|KT 10%, min 2tr|
|BS26|Thay phụ tùng chính hãng|Đơn giá ≤ giá niêm yết của xưởng chính hãng|
|BS27|Đầu kéo lắp thêm thuỷ lực|KT 3tr/vụ, chỉ tổn thất khi nâng/hạ ben|
- Bỏ từ Quy tắc 2025: BS10 (lưu hành tạm thời → bảo hiểm mặc định), BS22 (pin → mặc định); BS11, BS19 → trình theo từng sự vụ.`,
  s: 'QT VCX 109/2025 – Phần C (Điều 19 – 32); HD triển khai Quy tắc & Biểu phí XCG mới (T10/2025)', r: ['dg-khautru', 'qt-bs06', 'qt-bs02', 'qt-bs05'] },

{ id: 'qt-bs06', g: 'quytac',
  q: 'Xe đi vào vùng ngập nước hư động cơ có được bồi thường không?',
  k: ['ngập nước động cơ', 'BS06', 'thủy kích có được bồi thường', 'nước vào máy', 'đi vào vùng ngập', 'chết máy do nước'],
  a: `- **Không có BS06:** thiệt hại **động cơ** do nước lọt vào khi xe hoạt động trong khu vực ngập bị **loại trừ** (15.13); thiệt hại riêng động cơ không do đâm va, lật đổ cũng loại trừ (15.14). Các bộ phận khác hư do sự kiện thuộc phạm vi (vd lũ lụt) vẫn xem xét theo Quy tắc.
- **Có BS06:** PTI bồi thường chi phí sửa chữa, thay thế thiệt hại thực tế của động cơ do nước lọt vào khi xe hoạt động vùng ngập; khấu trừ **20% STBT, tối thiểu 3.000.000đ/vụ** (lấy số lớn hơn).
- Giám định: xem mục "Giám định xe ngập nước, thuỷ kích".`,
  s: 'QT VCX 109/2025 – khoản 15.13, 15.14, Điều 23; PL.PTI.XCG.20.10 – mục 6.2', r: ['gd-ngapnuoc', 'qt-dkbs'] },

{ id: 'qt-bs02', g: 'quytac',
  q: 'Điều khoản BS02 bảo hiểm thay thế mới được hưởng gì?',
  k: ['BS02', 'thay thế mới', 'không khấu hao', 'bảo hiểm thay mới'],
  a: `- Không áp dụng trừ hao mòn/khấu hao với bộ phận thay thế; PTI bồi thường chi phí thay mới thực tế.
- **Không áp dụng** cho: săm lốp, ắc quy, bạt phủ thùng xe tải, lọc gió, lọc dầu, lọc xăng, dầu máy — các bộ phận này vẫn tính % giá trị đã sử dụng, tối đa 50% giá trị thay mới.
- Xe không mua BS02 hoặc sử dụng trên 15 năm → áp dụng bảng khấu hao.`,
  s: 'QT VCX 109/2025 – Điều 20, khoản 17.1.2', r: ['dg-khauhao'] },

{ id: 'qt-bs05', g: 'quytac',
  q: 'Điều khoản BS05 sửa chữa chính hãng và BS26 phụ tùng chính hãng khác nhau thế nào?',
  k: ['BS05', 'BS26', 'sửa chữa chính hãng', 'gara chính hãng', 'phụ tùng chính hãng', 'lựa chọn cơ sở sửa chữa', 'xưởng hãng'],
  a: `- **BS05 – Lựa chọn cơ sở sửa chữa:** xe có hệ thống xưởng chính hãng/được hãng uỷ quyền tại VN; khách được chọn sửa tại xưởng chính hãng. Không có nghĩa PTI chấp nhận mọi mức giá — chi phí chỉ chấp nhận khi hợp lý, phù hợp giá thị trường, so sánh với cơ sở cùng địa bàn, quy mô tương tự.
- **BS26 – Thay phụ tùng chính hãng:** khách được yêu cầu thay phụ tùng chính hãng tại cơ sở sửa chữa bất kỳ (chính hãng hay không). Không phải thay phụ tùng → chi phí sửa chữa tối đa theo giá cơ sở **không chính hãng có liên kết với PTI**; phải thay → đơn giá phụ tùng tối đa bằng giá niêm yết của xưởng chính hãng.`,
  s: 'QT VCX 109/2025 – Điều 22, Điều 31', r: ['qt-dkbs', 'dg-chaogia'] },

{ id: 'qt-thaydoi', g: 'quytac',
  q: 'Quy tắc bảo hiểm xe 2025 (QĐ 109) thay đổi gì so với trước?',
  k: ['quy tắc mới', 'QĐ 109', 'thay đổi quy tắc', 'quy tắc 2025', 'điểm mới', 'QĐ 136', 'QĐ 110', 'biểu phí mới'],
  a: `Quy tắc VCX ô tô **QĐ 109/QĐ-PTI ngày 23/09/2025** (hiệu lực **14/10/2025**) thay QĐ 136/2024. Điểm thay đổi chính:
- 15.2: bổ sung loại trừ "đăng kiểm **không còn giá trị**"; không áp dụng với xe lưu hành tạm thời di chuyển từ nơi SX/cảng/cửa khẩu đến điểm phân phối.
- 15.3: không loại trừ khi chỉ thay la-zăng/lốp; thùng hàng thay đổi kết cấu nếu ghi rõ trong HĐBH.
- Bỏ **BS10** (lưu hành tạm thời) và **BS22** (pin xe điện) → đưa vào bảo hiểm mặc định, pin không còn khấu trừ 10%. BS11, BS19 không còn quy định → trình theo sự vụ.
- Bổ sung **BS27** (đầu kéo lắp thêm thuỷ lực).
- Loại hình "tai nạn lái, phụ xe và người ngồi trên xe" đổi thành **BH trách nhiệm của chủ xe/lái xe đối với phụ xe, người ngồi trên xe** (QĐ 110/2025).
- Biểu phí: dùng **phí sàn** của PTI thay phí thuần BTC; bổ sung giảm phí cho KH doanh nghiệp, xe đoàn; phí ngắn hạn/dài hạn tính mới.
!! Hồ sơ nào áp dụng Quy tắc ghi trên GCNBH/HĐBH của hồ sơ đó (đơn cấp trước 14/10/2025 có thể theo QĐ 136/2024).`,
  s: 'HD triển khai Quy tắc & Biểu phí BH tự nguyện XCG mới (T10/2025); QĐ 109/QĐ-PTI', r: ['qt-dkbs', 'gd-xedien', 'td-nntx'] },

{ id: 'qt-chamdut', g: 'quytac',
  q: 'Chấm dứt hợp đồng bảo hiểm trước hạn và hoàn phí thế nào?',
  k: ['chấm dứt hợp đồng', 'hủy hợp đồng', 'hoàn phí', 'hủy đơn', 'thu hồi biển số', 'bán xe'],
  a: `- **Khách đơn phương chấm dứt (VCX):** thông báo bằng văn bản; trong **15 ngày làm việc** PTI hoàn **70%** phí tương ứng thời gian còn lại (nếu đã đóng đủ, đúng hạn). **Không hoàn phí** nếu đã xảy ra sự kiện BH (HĐ nhóm xe: xét từng xe).
- **PTI đơn phương chấm dứt:** hoàn phí tương ứng thời gian còn lại trong 15 ngày làm việc.
- **Sau khi bồi thường bằng tiền** (toàn bộ hoặc bộ phận không có chứng từ sửa chữa) mà HĐ còn hiệu lực → GĐV báo KTV/đầu mối cấp đơn làm thủ tục chấm dứt (≤ 02 ngày).
- **BB TNDS:** xe bị **thu hồi đăng ký, biển số** → HĐ chấm dứt từ thời điểm thu hồi; hoàn phí thời gian còn lại.`,
  s: 'QT VCX 109/2025 – Điều 6; QT PTI.XCG.20 – mục 7.1.1; NĐ 67/2023 – Điều 11 (theo PL.PTI.XCG.20.12)', r: ['ct-bangtien'] },

{ id: 'qt-xemay', g: 'quytac',
  q: 'Bảo hiểm vật chất mô tô, xe máy có phạm vi và loại trừ thế nào?',
  k: ['vật chất xe máy', 'VCX mô tô', 'bảo hiểm xe máy', 'mô tô', 'mất cắp xe máy', 'mất cướp xe máy', 'PL 20.14', 'cháy nổ xe máy', 'dưới 300.000', 'bãi giữ xe có phiếu', '60 ngày không tìm được xe', 'tìm lại được xe sau bồi thường'],
  a: `Bảo hiểm vật chất mô tô, xe máy theo **QĐ 08/2013/QĐ-PTI ngày 10/01/2013**, gồm **3 nhóm rủi ro**:
**I. Bảo hiểm cháy nổ** — thiệt hại vật chất xe do hoả hoạn, cháy, nổ. Không thuộc phạm vi: các loại trừ chung; tai nạn ngoài phạm vi bảo hiểm; **tổn thất dưới 300.000 đồng** (chưa VAT).
**II. Bảo hiểm mất cắp, mất cướp toàn bộ xe** — chỉ thuộc phạm vi khi:
- Mất cắp tại **điểm trông giữ xe của trường học, bệnh viện, cơ quan nhà nước và toà nhà**, hoặc **bãi giữ xe công cộng có giấy phép** của cơ quan nhà nước có thẩm quyền **và có phát phiếu giữ xe**;
- Nhà, nơi cư trú bị **trộm cướp đột nhập, cạy phá có dấu vết để lại** và/hoặc bị tấn công, đe doạ tấn công bằng vũ lực;
- Bị **cướp**.
**Không thuộc phạm vi mất cắp:** trộm đột nhập **không để lại dấu vết** cạy/đập/phá, dùng **chìa khoá giả**, tổn thất **không có bằng chứng / không lý giải được / do sự bất cẩn**; hành vi lừa đảo, lợi dụng lòng tin, gian lận, thông đồng với kẻ gian của NĐBH.
**Thủ tục và bồi thường mất cắp/mất cướp:**
- Báo **ngay** cơ quan Công an, chính quyền địa phương nơi xảy ra sự việc và PTI; trong vòng **24 giờ** kể từ lúc phát hiện, NĐBH phải **thông báo bằng văn bản** cho PTI.
- PTI **không chịu trách nhiệm** với tổn thất mà NĐBH **không thông báo bằng văn bản trong 30 ngày** kể từ ngày xảy ra sự kiện mất cắp, bị cướp.
- Sau **60 ngày** không tìm được xe: STBH **bằng hoặc thấp hơn** giá trị thực tế lúc tham gia → bồi thường **toàn bộ STBH** ghi trên GCNBH; STBH **cao hơn** giá trị thực tế → bồi thường theo **giá trị thực tế của xe**.
- **Tìm lại được xe sau khi bồi thường:** PTI có quyền định đoạt xe đó, hoặc yêu cầu NĐBH hoàn trả đầy đủ số tiền bồi thường đã nhận.
- Xe tham gia **dưới giá trị**: PTI thu hồi giá trị còn lại (sau khi trừ chi phí thu hồi xe) theo **tỷ lệ giữa STBH và giá trị thực tế** lúc tham gia bảo hiểm.
**III. Bảo hiểm do các nguyên nhân khác** — thiệt hại vật chất xe do **tai nạn bất ngờ, ngoài sự kiểm soát** của chủ xe/NĐBH/lái xe.
**Loại trừ chung cho cả 3 nhóm:** hành động **cố ý** gây tai nạn của NĐBH/chủ xe/lái xe/người được giao sử dụng xe · chiến tranh và các lý do tương tự (nội chiến, đình công, bạo động dân sự, khủng bố) · tai nạn xảy ra **ngoài lãnh thổ Việt Nam** (trừ khi có thoả thuận khác bằng văn bản).
!! Đây là nghiệp vụ riêng cho **mô tô, xe máy** — không dùng Quy tắc VCX ô tô (QĐ 109/2025) cho hồ sơ xe máy.`,
  s: 'PL.PTI.XCG.20.14 – Hướng dẫn xác định phạm vi TNBH vật chất mô tô, xe máy (theo QĐ 08/2013/QĐ-PTI ngày 10/01/2013)', r: ['qt-phamvi', 'qt-loaitru', 'qt-bs04'] }
);

TL_KB.push(
{ id: 'qt-bs04', g: 'quytac',
  q: 'Xe bị mất trộm bộ phận (gương, đèn, logo, lốp dự phòng…) có được bồi thường không?',
  k: ['mất cắp bộ phận', 'mất trộm bộ phận', 'mất gương', 'mất đèn', 'mất logo', 'bị tháo trộm', 'trộm phụ tùng', 'BS04'],
  a: `- **Không có BS04:** mất bộ phận do trộm, cướp bị **loại trừ** (khoản 15.17).
- **Có BS04:** PTI bồi thường bộ phận gắn liền trên xe theo thiết kế nhà SX bị mất cắp, mất cướp (**không gồm chìa khoá, remote**).
- Giới hạn **02 vụ/năm** BH; không nhận BS04 với HĐ dưới 12 tháng.
- Khấu trừ **20% STBT, tối thiểu 2.000.000đ/vụ** (lấy số lớn hơn).
- Cần trình báo công an nơi xảy ra mất cắp; hồ sơ mất cắp thuộc diện phải thu thập hồ sơ CQCN.`,
  s: 'QT VCX 109/2025 – khoản 15.17, Điều 21; PL.PTI.XCG.20.05 – mục I', r: ['qt-dkbs', 'ht-cqcn'] },

{ id: 'qt-bs09', g: 'quytac',
  q: 'Chi phí thuê xe trong thời gian xe sửa chữa (BS09) được trả thế nào?',
  k: ['thuê xe', 'chi phí thuê xe', 'thuê xe trong thời gian sửa chữa', 'gián đoạn sử dụng', 'BS09', 'xe thay thế'],
  a: `- Chỉ áp dụng khi GCNBH/HĐBH có **BS09**: PTI trả chi phí thuê xe trong thời gian xe phải sửa chữa do tai nạn thuộc phạm vi BH.
- Trả theo hình thức **khoán**, mức/ngày ghi trên HĐBH/GCNBH, tính theo số ngày sửa chữa; tối đa **30 ngày/năm** BH; tổng bồi thường không vượt STBH.
- Khấu trừ theo gói: gói 1 trừ **5 ngày**/vụ, gói 2 trừ **4 ngày**, gói 3 trừ **3 ngày**.
- Số ngày tính từ ngày xe được **tháo dỡ giám định chi tiết** đến ngày gara/PTI báo hoàn thành sửa chữa hoặc ngày bàn giao xe (mốc nào đến trước).
- Không áp dụng cho thời gian xe bị CQCN giữ/tạm giữ.`,
  s: 'QT VCX 109/2025 – Điều 26', r: ['qt-dkbs'] },

{ id: 'qt-bs14', g: 'quytac',
  q: 'Mất chìa khoá xe có được bồi thường không (BS14)?',
  k: ['chìa khóa', 'chìa khoá', 'mất chìa khóa', 'remote', 'smartkey', 'BS14'],
  a: `- Chìa khoá, remote **không** thuộc BS04 (mất cắp bộ phận).
- Chỉ bồi thường khi có **BS14**: chi phí thực tế, hợp lý để thay chìa khoá xe bị mất, mất trộm, bị cướp.
- Giới hạn **01 lần/năm** BH; khấu trừ **20% STBT, tối thiểu 2.000.000đ/vụ** (lấy số lớn hơn).`,
  s: 'QT VCX 109/2025 – Điều 21, Điều 27', r: ['qt-dkbs', 'qt-bs04'] },

{ id: 'qt-bs25', g: 'quytac',
  q: 'Hàng hoá chở trên xe làm hư hỏng chính chiếc xe có được bồi thường không?',
  k: ['hàng hóa làm hỏng xe', 'hàng làm hỏng thùng', 'hàng đổ đè', 'hàng xô lệch', 'hàng hóa gây thiệt hại cho xe', 'làm hỏng thùng', 'hỏng thùng xe', 'làm hỏng xe', 'BS25'],
  a: `- Thiệt hại xe do **hàng hoá chở trên xe/kéo theo** gây ra mà **không** xuất phát từ đâm, va, lật, đổ xe → **loại trừ** (khoản 15.21).
- Có **BS25**: PTI bồi thường cả trường hợp này; khấu trừ **10% STBT, tối thiểu 2.000.000đ/vụ** (lấy số lớn hơn).
- Nếu hàng hoá hư hỏng do xe gây tai nạn → xem BH TNDS của chủ xe đối với hàng hoá.`,
  s: 'QT VCX 109/2025 – khoản 15.21, Điều 30', r: ['qt-loaitru', 'td-hanghoa'] },

{ id: 'qt-taituc', g: 'quytac',
  q: 'Phí bảo hiểm tái tục vật chất xe ô tô tính theo nguyên tắc nào?',
  k: ['tái tục', 'phí tái tục', 'tính phí tái tục', 'tái tục vật chất xe', 'tái tục liên tục', 'tái tục ngắt quãng', 'CV 3770', '3770', 'CV 25', 'phí sàn', 'phí bảo hiểm thuần', 'phí tối thiểu 5,5 triệu', 'tỷ lệ bồi thường tái tục', 'TLBT tái tục', 'xe đoàn', 'xe lẻ', 'đổi mục đích sử dụng xe tái tục', 'khách hỏi phí năm sau'],
  a: `**Định nghĩa** (CV 3770/PTI-BHXCG ngày 11/10/2024, áp dụng từ 14/10/2024):
- **Tái tục liên tục:** đơn mới bắt đầu hiệu lực **không muộn hơn** thời điểm kết thúc đơn cũ tại PTI.
- **Tái tục ngắt quãng:** đơn mới bắt đầu sau khi đơn cũ đã hết hiệu lực — chia **đến 365 ngày** và **trên 365 ngày**.
**Áp phí:**
|Trường hợp|Biểu phí áp dụng|
|Tái tục liên tục hoặc ngắt quãng ≤ 365 ngày|Biểu phí **tái tục** hiện hành; xe có **TLBT < 30%** được áp phí tối thiểu **5,5 triệu đồng/xe**|
|Tái tục ngắt quãng > 365 ngày|Biểu phí **xe tham gia lần đầu** tại PTI|
**Tỷ lệ bồi thường khi chào phí tái tục** = (số tiền **đã bồi thường** + **ước bồi thường**) / phí bảo hiểm vật chất xe.
- **Xe lẻ:** TLBT của HĐBH/GCNBH **năm trước liền kề**.
- **Xe đoàn** (HĐBH từ 02 xe trở lên): TLBT nghiệp vụ VCX (**XO.4**) theo năm nghiệp vụ, **bình quân gia quyền 02 năm liền kề** theo mã khách hàng.
- Thời điểm tính: tại thời điểm chào phí, **không sớm hơn 30 ngày** trước ngày hết hạn đơn hiện hữu.
**Sàn phí — đã đổi từ 25/11/2025** (CV 25/PTI-BHXCG): sau khi tính xong phí tái tục, phí **không được thấp hơn phí bảo hiểm thuần của PTI** cài trên Portal (trước đây là "phí bảo hiểm sàn" Mục 1.4 PL01 CV 2896). Phí thuần PTI **luôn thấp hơn** phí sàn cũ → phí tái tục chào cho khách **giảm đi** so với cách tính cũ. Nhập đơn dạng **T – Tái tục** trên Portal, nếu nhập thấp hơn phí thuần hệ thống sẽ cảnh báo và không cho duyệt đơn.
- **Thêm/bớt điều khoản bổ sung** năm tái tục: phí tăng/giảm tương ứng **phụ phí ĐKBS × STBH năm tái tục**.
- **Đổi mục đích sử dụng:** kinh doanh → không kinh doanh: áp tỷ lệ phí như **xe tham gia lần đầu**; không kinh doanh → kinh doanh: lấy **số lớn hơn** giữa phí tái tục và tỷ lệ phí xe lần đầu.
!! Đây là quy định **khai thác/cấp đơn**, GĐV chỉ dùng để trả lời khách hỏi phí năm sau — mọi trường hợp phí sau giảm **không thấp hơn tỷ lệ phí thuần của Bộ Tài chính**. Số liệu ước bồi thường trong hồ sơ đang xử lý **ảnh hưởng trực tiếp** tới TLBT chào phí tái tục của khách.`,
  s: 'CV 3770/PTI-BHXCG ngày 11/10/2024 – mục 1, 2 (áp dụng 14/10/2024); CV 25/PTI-BHXCG ngày 25/11/2025 – mục 1, 3; CV 2896/PTI-BHXCG ngày 23/09/2025 – PL01', r: ['qt-thaydoi', 'gd-thanhtoanphi', 'dg-thuphi', 'pl-tt67'] }
);

/* ─── 7. TNDS & TẠM ỨNG (NĐ 67/2023) ─── */
TL_KB.push(
{ id: 'td-mtn', g: 'tnds',
  q: 'Mức trách nhiệm bảo hiểm bắt buộc TNDS chủ xe là bao nhiêu?',
  k: ['mức trách nhiệm', 'giới hạn trách nhiệm', '150 triệu', '100 triệu', 'TNDS bắt buộc', 'bảo hiểm bắt buộc', 'hạn mức TNDS', 'mức bồi thường tối đa'],
  a: `|Thiệt hại|Giới hạn trách nhiệm|
|Sức khoẻ, tính mạng (NT3, hành khách)|**150 triệu đồng/1 người/1 vụ**|
|Tài sản do xe ô tô, máy kéo, rơ moóc/sơ mi rơ moóc được kéo gây ra|**100 triệu đồng/1 vụ**|
|Tài sản do mô tô, xe gắn máy (kể cả xe máy điện) gây ra|**50 triệu đồng/1 vụ**|
- DNBH không bồi thường phần vượt giới hạn, trừ khi chủ xe có tham gia **BH TNDS tự nguyện**.
- Mức BT sức khoẻ, tính mạng theo **Bảng Phụ lục VI** NĐ 67/2023 (hoặc thoả thuận, không vượt Phụ lục VI).`,
  s: 'NĐ 67/2023/NĐ-CP (theo PL.PTI.XCG.20.12 – mục 3, 7.6, 7.8)', r: ['td-nguyentac', 'td-nt3'] },

{ id: 'td-nt3', g: 'tnds',
  q: 'Ai là người thứ ba trong bảo hiểm TNDS? Ai không được bồi thường?',
  k: ['người thứ ba', 'NT3 là ai', 'định nghĩa người thứ ba', 'hành khách', 'người trên xe', 'chủ sở hữu xe'],
  a: `- **NT3 (TNDS):** người bị thiệt hại về sức khoẻ, tính mạng, tài sản do xe gây ra, **trừ**: người lái xe, người trên xe, hành khách trên chính xe đó; chủ sở hữu xe (trừ khi chủ sở hữu đã giao xe cho tổ chức, cá nhân khác chiếm hữu, sử dụng).
- **Hành khách** trên xe được bảo hiểm BB TNDS về sức khoẻ, tính mạng (không phải NT3 nhưng thuộc phạm vi riêng).
- Lái xe, phụ xe, người ngồi trên xe (không phải hành khách) → thuộc BH trách nhiệm chủ xe/lái xe đối với phụ xe, người ngồi trên xe (tự nguyện).
- **NT3 (VCX):** cá nhân, tổ chức có trách nhiệm bồi thường do hành vi gây thiệt hại cho xe được BH → đối tượng PTI thế quyền đòi.`,
  s: 'NĐ 67/2023 – Điều 6 (theo PL.PTI.XCG.20.12); QT PTI.XCG.20 – Giải thích từ ngữ', r: ['td-mtn', 'nt3-thequyen'] },

{ id: 'td-loaitru', g: 'tnds',
  q: 'Các trường hợp loại trừ bảo hiểm bắt buộc TNDS?',
  k: ['loại trừ TNDS', 'không bồi thường TNDS', 'bỏ chạy', 'không đủ tuổi', 'tài sản đặc biệt', 'mất cắp trong tai nạn', 'thiệt hại gián tiếp'],
  a: `DNBH không bồi thường (NĐ 67/2023 – Điều 7):
- Hành động **cố ý** của chủ xe, lái xe hoặc người bị thiệt hại.
- Lái xe gây TN **cố ý bỏ chạy** không thực hiện TNDS (bỏ chạy nhưng đã thực hiện TNDS thì không loại trừ).
- Lái xe không đủ tuổi; không có GPLX, GPLX không hợp lệ, bị tẩy xoá, hết hạn, không phù hợp; bị tước/thu hồi = không có GPLX.
- Thiệt hại **gián tiếp**: giảm giá trị thương mại, thiệt hại gắn với việc sử dụng, khai thác tài sản.
- Thiệt hại **tài sản** do lái xe có nồng độ cồn vượt trị số bình thường, ma tuý, chất kích thích cấm.
- Tài sản bị **mất cắp, bị cướp** trong tai nạn.
- Tài sản đặc biệt: vàng, bạc, đá quý, giấy tờ có giá, đồ cổ, tranh ảnh quý hiếm, thi hài, hài cốt.
- Chiến tranh, khủng bố, động đất.`,
  s: 'NĐ 67/2023 – Điều 7 (theo PL.PTI.XCG.20.12 – mục 4.2)', r: ['td-mtn', 'qt-con'] },

{ id: 'td-nguyentac', g: 'tnds',
  q: 'Nguyên tắc và thời hạn giải quyết bồi thường TNDS bắt buộc?',
  k: ['nguyên tắc bồi thường TNDS', 'thời hạn TNDS', '1 giờ', '24 giờ', '3 ngày làm việc', 'phụ lục VI', 'lỗi hoàn toàn người thứ ba', '50% mức bồi thường', 'giảm trừ 5%'],
  a: `- Nhận thông báo TN: trong **1 giờ** DNBH hướng dẫn biện pháp an toàn, hồ sơ, thủ tục; trong **24 giờ** phối hợp các bên tổ chức **giám định**.
- Trong **3 ngày làm việc** từ khi nhận thông báo: **tạm ứng** thiệt hại sức khoẻ, tính mạng (xem mục tạm ứng).
- NĐBH gửi thông báo TN bằng văn bản/điện tử trong **5 ngày làm việc** kể từ ngày TN.
- Mức BT về người theo **Phụ lục VI** NĐ 67/2023 (hoặc thoả thuận/quyết định Toà, không vượt Phụ lục VI). Nhiều xe gây TN → theo mức độ lỗi từng chủ xe, tổng không vượt giới hạn.
- Cơ quan có thẩm quyền xác định **lỗi hoàn toàn của NT3** → mức BT sức khoẻ, tính mạng cho NT3 = **50%** mức Phụ lục VI.
- Tài sản: theo thiệt hại thực tế và **mức độ lỗi** của chủ xe, trong giới hạn.
- Giảm trừ tối đa **5%** STBT tài sản khi không thông báo TN hoặc không báo thay đổi làm tăng rủi ro.
- BT cho NĐBH số tiền NĐBH đã/sẽ phải bồi thường; NĐBH chết/mất năng lực hành vi → trả trực tiếp người bị thiệt hại/người thừa kế/đại diện.`,
  s: 'NĐ 67/2023 – Điều 12 (theo PL.PTI.XCG.20.12 – mục 7)', r: ['td-tamung', 'td-mtn', 'td-hoso'] },

{ id: 'td-tamung', g: 'tnds',
  q: 'Tạm ứng bồi thường thiệt hại về người (TNDS bắt buộc) tính thế nào?',
  k: ['tạm ứng', 'tạm ứng TNDS', 'tạm ứng tử vong', 'tạm ứng thương tật', '70%', '30%', '10%', 'tỷ lệ tổn thương', 'BM 20.05', 'tạm ứng người', 'không tạm ứng', 'thương tật'],
  a: `|Tình huống|Tử vong|Tổn thương|
|Đã xác định thuộc phạm vi BT|70% mức BT ước tính/người/vụ|50% mức BT ước tính/người/vụ|
|Chưa xác định thuộc phạm vi|30% giới hạn TNBH/người/vụ|≥ 81%: 30%; 31% – dưới 81%: 10% giới hạn/người/vụ|
- **Không tạm ứng** khi ước tỷ lệ tổn thương **< 31%** (kể cả nhiều vết thương cộng lại < 31%).
- Đã xác định **không thuộc** phạm vi → hướng dẫn gia đình liên hệ Văn phòng **Quỹ BH XCG** làm thủ tục hỗ trợ nhân đạo.
!! Chưa xác định phạm vi: ước tỷ lệ tổn thương ở **mức thấp nhất** trong khung Phụ lục VI NĐ 67 — tránh tạm ứng vượt mức, sau này không hoàn ứng được từ Quỹ.
**Thời hạn nội bộ:** GĐ/xác minh ≤ 24h từ khi nhận tin; xác định thông tin ≤ 04h; trình tờ trình **BM 20.05** + bảng kê người ≤ 02h; check & validate ≤ 02h; gửi thông báo chi tạm ứng ≤ 02h; chi tiền ≤ 02h.
- Người nhận: **nạn nhân/đại diện gia đình**. NĐBH nhận thay → cần chứng từ chứng minh NĐBH đã tạm ứng/bồi thường cho nạn nhân.
- Chứng từ bắt buộc: TBTN & YCBT + Phụ lục (mẫu PTI), đăng ký xe, BB GĐ hiện trường/xác minh, GCNBH, xác minh phí. GĐV tự đến cơ sở y tế/CQCN xác minh nếu khách chưa có chứng từ.`,
  s: 'PL.PTI.XCG.20.03 – mục I; NĐ 67/2023 – Điều 12 (theo PL.PTI.XCG.20.12 – mục 7.3)', r: ['td-hoanung', 'td-nguyentac'] },

{ id: 'td-hoanung', g: 'tnds',
  q: 'Hoàn ứng tiền tạm ứng từ Quỹ bảo hiểm xe cơ giới làm thế nào?',
  k: ['hoàn ứng', 'hoàn trả tạm ứng', 'Quỹ bảo hiểm xe cơ giới', 'quỹ BH XCG', 'BM 20.54', 'ngày 05 hàng tháng', 'hỗ trợ nhân đạo'],
  a: `Áp dụng khi hồ sơ đã tạm ứng nhưng sau đó xác định thuộc **loại trừ/không thuộc phạm vi** BH.
- VP ĐD CH&GĐ Miền lập hồ sơ gửi **Phòng CS&QLCL** định kỳ **ngày 05 hằng tháng** (bản cứng + bản mềm): văn bản từ chối (bản gốc); bảng kê BM 20.54; trích lục khai tử/giấy báo tử/xác nhận công an/kết quả pháp y (tử vong) hoặc hồ sơ bệnh án, giấy chứng nhận thương tích (tổn thương); tài liệu công an (kết luận điều tra, xác minh…); biên bản GĐ/xác minh của PTI; quyết định Toà (nếu có); chứng từ đã chi tạm ứng (UNC/sao kê).
- Phòng CS&QLCL làm đầu mối với Quỹ: tổng hợp BM 20.55, đơn đề nghị BM 20.56 (≤ 02 ngày); theo dõi, đôn đốc; phân bổ tiền hoàn về từng hồ sơ; khiếu nại nếu Quỹ từ chối/thiếu.`,
  s: 'PL.PTI.XCG.20.03 – mục II; QT PTI.XCG.20 – mục 7.1.4', r: ['td-tamung', 'sb-viecsau'] },

{ id: 'td-hoso', g: 'tnds',
  q: 'Hồ sơ bồi thường bảo hiểm bắt buộc TNDS gồm những gì?',
  k: ['hồ sơ TNDS', 'hồ sơ bồi thường TNDS', 'giấy tờ TNDS', 'chứng từ thiệt hại người', 'giấy chứng nhận thương tích', 'bệnh án', 'giấy chứng tử'],
  a: `**Khách hàng cung cấp:**
- Văn bản yêu cầu bồi thường.
- Tài liệu xe, lái xe (bản sao chứng thực hoặc bản sao có xác nhận của DNBH sau khi đối chiếu): đăng ký xe (xe thế chấp: bản sao chứng thực + giấy biên nhận của TCTD); GPLX; CCCD/hộ chiếu lái xe; GCNBH.
- Chứng minh thiệt hại **người**: giấy chứng nhận thương tích, hồ sơ bệnh án, trích lục khai tử/giấy báo tử/xác nhận công an hoặc kết quả GĐ pháp y.
- Chứng minh thiệt hại **tài sản**: hoá đơn, chứng từ sửa chữa/thay mới (PTI sửa chữa thì PTI thu thập); chi phí hạn chế tổn thất.
- Quyết định của Toà án (nếu có).
**DNBH thu thập:** tài liệu công an (vụ tử vong NT3/hành khách hoặc cần xác minh lỗi hoàn toàn của NT3); biên bản giám định của DNBH.
- GĐV dùng mẫu hướng dẫn **BM 20.01C** (NT3 & hành khách) hoặc **BM 20.01** (tạm ứng thiệt hại người).`,
  s: 'NĐ 67/2023 – Điều 13 (theo PL.PTI.XCG.20.12 – mục 6)', r: ['td-nguyentac', 'ht-thuthapct'] },

{ id: 'td-taisan', g: 'tnds',
  q: 'Giám định thiệt hại tài sản của người thứ ba (xe, nhà, hàng quán…) thế nào?',
  k: ['tài sản người thứ ba', 'thiệt hại tài sản NT3', 'nhà dân', 'tông vào nhà', 'đâm vào nhà', 'hàng rào', 'quán hàng', 'tài sản bên thứ ba', 'xe người thứ ba', 'nhà cửa', 'tài sản không phải xe', 'BM 20.15A', 'khấu hao tài sản NT3'],
  a: `- **Xe cơ giới của NT3:** thu giấy tờ xe NT3 (đăng ký, đăng kiểm), xác định loại xe, giám định sơ bộ rồi chi tiết như xe cơ giới.
- **Tài sản không phải xe:** đo đạc, ghi nhận chi tiết (tên, chủng loại, số lượng, kích thước, tình trạng hư hỏng, năm SX, chất liệu, diện tích…) → **Biên bản GĐ thiệt hại BM 20.15A**; chụp bao quát rồi cận cảnh, khoanh vùng, dùng thước đo.
- Nghiệm thu sửa chữa tài sản NT3 phải có chữ ký NT3 (hoặc giấy bãi nại).
- Hoá đơn sửa chữa mang tên NT3 → PTI không khấu trừ thuế, bồi thường cả thuế.
!! Không áp khấu hao tài sản NT3 với KH một số kênh (VNP, môi giới, xe thương mại, VIP) theo chính sách PTI từng thời điểm.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.2.3; PL.PTI.XCG.20.15; PL.PTI.XCG.20.08', r: ['ct-nghiemthu', 'dg-khauhao'] },

{ id: 'td-hanghoa', g: 'tnds',
  q: 'Tai nạn có hàng hoá trên xe (TNDS đối với hàng hoá) giám định thế nào?',
  k: ['hàng hóa', 'hàng hoá trên xe', 'TNDS hàng hóa', 'container', 'kẹp chì', 'thanh lý hàng', 'tiêu hủy hàng', 'chủ hàng'],
  a: `- Xác định trọng tải hàng thực tế lúc TN, tên chủng loại, hàng XNK, trọng lượng, kích thước, cách đóng gói, xếp hàng.
- Phân loại: không tổn thất / hư toàn bộ / hư, giảm giá trị một phần / mất cắp. Còn niêm phong → ghi số container, số kẹp chì.
- Chụp ảnh chi tiết, đánh số khu vực; lập **Biên bản ghi nhận thiệt hại hàng hoá BM 20.15A**.
- Căn cứ hoá đơn, phiếu giao hàng, HĐ vận chuyển, phiếu xuất kho, lời khai chủ xe, lái xe, người giao nhận. Hàng XNK bổ sung: commercial invoice, vận đơn, packing list, tờ khai hải quan.
- Chủ xe **bán thanh lý** hàng → GĐV tham gia ký biên bản thanh lý. Hàng phải **tiêu huỷ** → chụp ảnh, lập biên bản huỷ.
- Mẫu hướng dẫn chứng từ: **BM 20.01B**; tờ trình: **BM 20.25B**.`,
  s: 'PL.PTI.XCG.20.02 – mục 2.2.4; PL.PTI.XCG.20.04 – Bước 3', r: ['ht-dacthu', 'gd-thuegd'] },

{ id: 'td-nntx', g: 'tnds',
  q: 'Bảo hiểm lái xe, phụ xe và người ngồi trên xe (QĐ 110/2025) bồi thường thế nào?',
  k: ['người ngồi trên xe', 'lái phụ xe', 'phụ xe', 'NNTX', 'LPX', 'tai nạn người ngồi trên xe', 'trách nhiệm chủ xe đối với người ngồi trên xe', 'tỷ lệ thương tật', 'chi phí trợ cấp', '180 ngày', 'thực vật'],
  a: `Theo **Quy tắc QĐ 110/QĐ-PTI ngày 23/09/2025**, loại hình là **BH trách nhiệm của chủ xe/lái xe đối với phụ xe, người ngồi trên xe**: PTI BT cho chủ xe/lái xe số tiền họ phải BT cho thiệt hại sức khoẻ, tính mạng của người ngồi trên xe và phụ xe do tai nạn khi **đang ở trong xe hoặc lên/xuống xe** trong quá trình tham gia giao thông; **mở rộng cho lái xe** như người ngồi trên xe (15.3).
|Trường hợp|Số tiền chi trả|
|Tử vong hoặc tổn thương não di chứng sống kiểu thực vật|**Toàn bộ số tiền BH**/người|
|Thương tật, STBH đến 100 triệu|Tỷ lệ % theo Bảng tỷ lệ trả tiền thiệt hại về người (PL01) × STBH|
|Thương tật, STBH trên 100 triệu|Tỷ lệ % PL01 × 100 triệu + **chi phí trợ cấp** (STBH × 0,1% × số ngày điều trị, tối đa 2 triệu/ngày)|
- Số ngày điều trị = nội trú + sau xuất viện theo chỉ định bác sĩ, tối đa **180 ngày/vụ**. Đa vết thương cùng bộ phận: tổng không vượt tỷ lệ mất bộ phận đó.
- Tổng chi trả không vượt STBH tương ứng số chỗ tham gia BH; tổng thiệt hại của mọi người vượt tổng STBH → chia theo tỷ lệ. Trả cho người bị thiệt hại hoặc người đại diện/thừa kế hợp pháp.
- **Chở quá số người** tham gia BH (không tính trẻ dưới 6 tuổi): BT theo tỷ lệ số người tham gia BH / số người thực tế.
- **Hồ sơ:** TBTN & YCBT; GCN/HĐBH; đăng ký xe, GPLX, đăng kiểm; chứng từ y tế (giấy ra viện, bệnh án, giấy chứng nhận thương tật); tử vong: giấy chứng tử hoặc BB khám nghiệm tử thi/kết luận điều tra/bản án ghi nhận tử vong + giấy tờ thừa kế; tài liệu công an (nếu có); BBGĐ thiệt hại.
- Giám định: vụ không còn hiện trường phải **xác minh**; xác định số người trên xe, số người bị thương, tử vong. Mẫu hướng dẫn **BM 20.01C**, tờ trình **BM 20.25C**.
!! HĐ cấp theo Quy tắc cũ QĐ 370/2018 (tai nạn lái, phụ xe và người ngồi trên xe) → hướng dẫn PL.PTI.XCG.20.13: trẻ em dưới 7 tuổi được trả 50% STBH, chở quá số người giảm theo tỷ lệ.`,
  s: 'Quy tắc QĐ 110/QĐ-PTI ngày 23/09/2025 – Điều 10, 11, 13, 15; PL.PTI.XCG.20.13; QT PTI.XCG.20 – mục 2.2, 4.2.3; PL.PTI.XCG.20.02 – mục 2.2.3', r: ['qt-110', 'qt-thaydoi', 'td-nt3'] },

{ id: 'td-tyle-nguoi', g: 'tnds',
  q: 'Bảng tỷ lệ trả tiền bồi thường thiệt hại về người dùng thế nào?',
  k: ['bảng tỷ lệ thương tật', 'tỷ lệ tổn thương cơ thể', 'phụ lục 01 QĐ 110', 'trả tiền thiệt hại về người', 'mất chi', 'cụt ngón', 'liệt tứ chi', 'nhiều thương tật', 'thương tật không có trong bảng', 'hội đồng giám định y khoa', 'nạn nhân chết không xác định tung tích'],
  a: `**Phụ lục 01 ban hành kèm QĐ 110/QĐ-PTI ngày 23/09/2025** — Bảng tỷ lệ trả tiền bồi thường thiệt hại về người, dùng cho bảo hiểm trách nhiệm của chủ xe/lái xe đối với phụ xe, người ngồi trên xe.
- Bảng chia theo hệ cơ quan: tổn thương **xương sọ và hệ thần kinh**, mắt, tai – mũi – họng, hàm mặt, hệ hô hấp, hệ tim mạch, hệ tiêu hoá, hệ tiết niệu – sinh dục, cơ – xương – khớp, phần mềm, bỏng… Mỗi mục cho **khoảng tỷ lệ %** (ví dụ chạm sọ 6–10%, mẻ sọ dưới 3 cm 11–15%, liệt hoàn toàn tứ chi 99%, tổn thương não gây di chứng sống kiểu thực vật 100%).
- Số tiền chi trả = **tỷ lệ % × mức trách nhiệm bảo hiểm/người/vụ** ghi trên GCNBH/HĐBH.
**Những trường hợp đặc biệt (cuối Phụ lục 01):**
- **Dính các khớp ngón tay** (trừ ngón cái và ngón trỏ) và **khớp ngón chân** (trừ ngón cái) → chỉ bằng **50%** số tiền của trường hợp cụt ngón đó.
- **Mất hẳn chức năng** của từng bộ phận hoặc **hỏng vĩnh viễn** → coi như **mất bộ phận đó hoặc mất chi**.
- Trước tai nạn nạn nhân **chỉ còn một mắt**, nay mất nốt mắt lành → coi như **mất hoàn toàn hai mắt**.
- **Nhiều loại thương tật** → cộng số tiền của từng loại, nhưng **không vượt quá giới hạn trách nhiệm bảo hiểm**.
- **Thương tật không có trong bảng** → bồi thường theo tỷ lệ trên cơ sở **so sánh tính nghiêm trọng** với trường hợp tương tự có trong bảng, hoặc căn cứ **kết luận của Hội đồng giám định y khoa**.
- Nạn nhân **chết nhưng không xác định được tung tích hoặc không có người thừa kế hợp pháp** → bồi thường căn cứ **chi phí thực tế cần thiết để mai táng và phục vụ việc lưu trữ tìm tung tích**, không vượt quá giới hạn trách nhiệm.
!! Bảng này là của **sản phẩm tự nguyện QĐ 110/2025**. Bồi thường **TNDS bắt buộc** về người áp dụng bảng tỷ lệ tại **NĐ 67/2023** — không dùng lẫn hai bảng.`,
  s: 'Phụ lục 01 kèm QĐ 110/QĐ-PTI ngày 23/09/2025 – Bảng tỷ lệ trả tiền bồi thường thiệt hại về người (mục "Những trường hợp đặc biệt")', r: ['td-nntx', 'qt-110', 'td-mtn'] },

{ id: 'td-taisan-ct', g: 'tnds',
  q: 'Chứng từ chứng minh thiệt hại tài sản của bên thứ ba gồm những gì?',
  k: ['chứng từ thiệt hại tài sản', 'tài sản người thứ ba', 'giấy nhận tiền bồi thường', 'bãi nại', 'dưới 10 triệu', 'trên 10 triệu', 'hoa màu cây trồng gia súc', 'công trình giao thông', 'hàng hóa để bên đường', 'chứng minh đã chi trả cho bên thứ ba', 'hợp đồng sửa chữa 20 triệu'],
  a: `Hồ sơ chứng minh thiệt hại tài sản bên thứ ba trong bồi thường TNDS — chia theo **ai trực tiếp khắc phục**:
**A. NĐBH bồi thường bằng tiền cho bên thứ ba** (hoặc tài sản không thể sửa chữa):
- Báo giá tham khảo giá thị trường / báo giá tại gara liên kết PTI (bản chính hoặc bản sao có GĐV PTI xác nhận); với xe cơ giới thêm **đăng ký, đăng kiểm của bên thứ ba** (photo có GĐV ký xác nhận).
- Hoá đơn, chứng từ hợp lệ hoặc bằng chứng về việc sửa chữa, thay mới tài sản.
- **Biên bản thoả thuận bồi thường thiệt hại tài sản bằng tiền** giữa NĐBH và bên thứ ba.
- **Chứng từ chứng minh NĐBH đã chi trả** cho bên thứ ba:
|Giá trị thiệt hại|Yêu cầu|
|**≤ 10 triệu**|Giấy nhận tiền bồi thường kèm bãi nại (bản chính, **có ký xác nhận của GĐV PTI**)|
|**> 10 triệu**|Giấy nhận tiền bồi thường kèm bãi nại (bản chính/bản sao **có xác nhận của cơ quan chức năng có thẩm quyền**)|
|Chuyển khoản|Sao kê chuyển khoản ngân hàng (bản chính hoặc bản sao có GĐV PTI xác nhận)|
**B. PTI hoặc NĐBH trực tiếp sửa chữa/thay mới:** biên bản thoả thuận bồi thường **bằng sửa chữa, thay mới** · báo giá/dự toán (bản chính) · **hợp đồng sửa chữa/mua bán khi từ 20 triệu trở lên** · hoá đơn sửa chữa/mua bán · **nghiệm thu sửa chữa và bãi nại của bên thứ ba** (bản chính) · phiếu thu/sao kê/thanh lý HĐSC chứng minh đã thanh toán · biên bản thu hồi tài sản bị thiệt hại (nếu có).
**Theo loại tài sản:** hoa màu, cây trồng, gia súc, gia cầm, nông sản, nhà ở và đồ dùng gia dụng tư nhân → báo giá thị trường; công trình giao thông/xây dựng và tài sản của cơ quan, tổ chức, doanh nghiệp → **dự toán sửa chữa của cơ sở hợp pháp lập**; hàng hoá, máy móc, thiết bị, vật tư → hoá đơn/hợp đồng mua bán, **trừ** nông sản, hải sản, thực phẩm, thủ công mỹ nghệ, đất cát đá sỏi do cá thể tự sản xuất – tiêu thụ, hàng cũ hỏng thu gom, máy móc cũ không còn giao bán trên thị trường (không nhất thiết phải có hoá đơn).
!! **GĐV ký xác nhận** trên biên bản thoả thuận bồi thường dân sự, giao nhận tiền bồi thường phải là GĐV **được lãnh đạo phân công giám định hiện trường** hoặc **trực tiếp chứng kiến** việc thoả thuận, trả tiền giữa các bên.`,
  s: 'Hướng dẫn thu thập tài liệu chứng minh thiệt hại tài sản, kèm Hướng dẫn bồi thường BH BB TNDS của chủ xe PL.PTI.XCG.03.01 (docs/Kho tri thức — Tiện ích tra cứu CV)', r: ['td-taisan', 'td-hoso', 'nt3-buoc'] },

{ id: 'td-hanghoa-giamtru', g: 'tnds',
  q: 'Mức giảm trừ bồi thường TNDS đối với hàng hoá vận chuyển trên xe là bao nhiêu?',
  k: ['giảm trừ TNDS hàng hóa', 'giảm trừ bồi thường hàng hóa', 'giảm trừ hàng hoá', 'chế tài hàng hóa', 'PL 20.11', 'QT.XO.370/2018', 'không thông báo 05 ngày', 'vượt biển cấm vượt', 'tự ý di chuyển khỏi hiện trường', 'không tạo điều kiện xác minh', 'không bảo lưu quyền đòi'],
  a: `Áp dụng cho hồ sơ TNDS của chủ xe **đối với hàng hoá vận chuyển trên xe** (Quy tắc BH tự nguyện XCG số **370/2018/QĐ-PTI ngày 26/12/2018**, cho đơn cấp từ 01/01/2019 trong thời hạn hiệu lực của quy tắc này):
|Mức giảm trừ|Trường hợp|
|**10% – 30%**|Không thông báo ngay cho PTI và **không gửi thông báo tổn thất bằng văn bản trong 05 ngày** kể từ ngày tai nạn; không báo ngay cơ quan công an/chính quyền địa phương nơi gần nhất (trừ **bất khả kháng**) · không thực hiện đầy đủ biện pháp cứu chữa, hạn chế thiệt hại về người và tài sản, bảo vệ hiện trường · **xe vượt tại khu vực có biển cấm vượt** (khi có kết luận CSGT hoặc đủ cơ sở xác định)|
|**30% – 50%**|Chủ xe **tự ý di chuyển khỏi hiện trường**, tự ý tháo gỡ hoặc sửa chữa tài sản khi chưa có ý kiến chấp thuận của PTI (trừ khi cần thiết để bảo đảm an toàn, đề phòng hạn chế thiệt hại, hoặc phải thi hành theo yêu cầu cơ quan có thẩm quyền)|
|**50% – 99%**|Chủ xe **không tạo điều kiện thuận lợi** cho PTI xác minh tính chân thực của thông tin, tài liệu, chứng từ trong hồ sơ bồi thường|
|**50% – 100%**|Không bảo lưu quyền khiếu nại và chuyển quyền đòi người thứ ba cho PTI kèm hồ sơ, căn cứ cần thiết; không hợp tác chặt chẽ với PTI để đòi người thứ ba; **tự động thoả thuận bồi thường với người thứ ba** gây thiệt hại cho PTI · chủ xe **không trung thực**|
- *Bất khả kháng* được hiểu là sự cố nằm ngoài khả năng dự đoán và kiểm soát của chủ xe, xảy ra không do lỗi của chủ xe, khiến chủ xe không thể thực hiện đúng hoặc đầy đủ nghĩa vụ của mình.
!! Đây là thang giảm trừ của **nghiệp vụ TNDS hàng hoá theo quy tắc 370/2018**. Với **vật chất xe** dùng thang giảm trừ của Quy tắc VCX hiện hành (QĐ 109/2025 – Điều 12); với **TNDS bắt buộc** mức giảm trừ thiệt hại tài sản **tối đa 5%** theo NĐ 67/2023. Luôn xác định hồ sơ áp dụng quy tắc nào trước khi tính giảm trừ.`,
  s: 'PL.PTI.XCG.20.11 – Hướng dẫn xác định phạm vi TNBH TNDS của chủ xe đối với hàng hoá, mục 5.1 (dẫn Điều 13 QT.XO.370/2018)', r: ['td-hanghoa', 'dg-giamtru', 'nt3-khongbaoluu'] }
);
/* ─── 8. PHÂN LỖI & ĐÒI NGƯỜI THỨ BA ─── */
TL_KB.push(
{ id: 'nt3-nguyentac', g: 'nt3',
  q: 'Nguyên tắc phân lỗi và tỷ lệ chia lỗi giữa các xe?',
  k: ['phân lỗi', 'tỷ lệ lỗi', 'chia lỗi', 'xác định lỗi', 'lỗi chính lỗi phụ', 'lỗi hỗn hợp', 'lỗi hoàn toàn', 'bảng phân lỗi'],
  a: `**Lỗi** = nguyên nhân trực tiếp gây TNGT, xác định theo hành vi sai phạm khi điều khiển phương tiện; căn cứ kết luận CQCN, luật giao thông và cơ sở pháp lý liên quan.
|Loại lỗi|Tỷ lệ chia|
|Lỗi chính/phụ|80/20 · 70/30 · 60/40|
|Lỗi hỗn hợp|50/50|
|Lỗi hoàn toàn|100%|
- Bảng tham khảo PL.20.05 có 40 tình huống (xe X gây lỗi chính, xe Y còn lại). Hỏi trợ lý theo tình huống: đâm đuôi, ngã tư, rẽ trái, chuyển làn, vượt xe, quay đầu, bãi đỗ, vòng xuyến, xuống dốc…
- Các bên không thống nhất lỗi → thu thập hồ sơ CQCN, có thể trưng cầu GĐ độc lập.
!! Điều luật trong bảng trích theo Luật GTĐB 2008 (như PL.20.05). Quy tắc giao thông hiện hành quy định tại Luật Trật tự, an toàn giao thông đường bộ 2024 — khi viện dẫn trong văn bản cần đối chiếu điều khoản hiện hành.`,
  s: 'PL.PTI.XCG.20.05 – mục II', r: ['nt3-damduoi', 'nt3-giaonhau', 'nt3-chuyenlan', 'ht-cqcn'] },

{ id: 'nt3-damduoi', g: 'nt3',
  q: 'Đâm vào đuôi xe phía trước, đâm liên hoàn, đâm xe đang đỗ thì lỗi thế nào?',
  k: ['đâm đuôi', 'đâm vào đuôi', 'đâm phía sau', 'tông đuôi', 'khoảng cách an toàn', 'đâm liên hoàn', 'dồn toa', 'xe đang đỗ', 'dừng đỗ trên cầu'],
  a: `|Tình huống|Tỷ lệ lỗi|
|X chạy sau đâm Y chạy thẳng phía trước (TH25)|X 100% — không giữ khoảng cách an toàn|
|Liên hoàn Y ← X ← Z (TH37)|X và Z mỗi xe chịu lỗi với xe liền trước (không giữ khoảng cách)|
|X đi thẳng đâm Y đang đỗ đúng quy định (TH20)|X 100% — thiếu chú ý quan sát|
|X dừng, đỗ trên cầu; Y đi thẳng đâm vào (TH39)|X 70% (dừng đỗ sai) – Y 30% (thiếu quan sát, không giữ khoảng cách)|
!! Đâm đuôi xe phía trước khi đang lưu thông: vụ nhỏ (xước, móp thân vỏ < 20 triệu, không phải xe sang) được GĐ từ xa; còn lại GĐ trực tiếp (PL.20.02).`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH20, 25, 37, 39); PL.PTI.XCG.20.02 – mục 1', r: ['nt3-nguyentac', 'ht-khinao'] },

{ id: 'nt3-giaonhau', g: 'nt3',
  q: 'Va chạm tại ngã tư, đường giao nhau, xe rẽ trái rẽ phải thì phân lỗi thế nào?',
  k: ['ngã tư', 'giao nhau', 'đường giao nhau', 'rẽ trái', 'rẽ phải', 'nhường đường', 'bên phải tới', 'đồng cấp', 'ngã ba'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X đi thẳng, Y đi thẳng từ **bên phải** tới, Y đã giảm tốc (TH4)|100 – 0 (X không nhường xe bên phải); Y không giảm tốc: 80 – 20|
|X **rẽ trái**, Y đi thẳng ngược chiều đã giảm tốc (TH5)|100 – 0; Y không giảm tốc: 80 – 20|
|X rẽ trái, Y rẽ phải từ hướng đối diện (TH6)|100 – 0|
|X rẽ phải, Y rẽ trái từ bên phải X (TH7)|60 – 40 (X không nhường xe bên phải; Y sai làn)|
|Đường đồng cấp: X rẽ phải, Y đi thẳng (TH8)|50 – 50|
|X rẽ trái, Y đi thẳng từ bên phải (TH27) / ngược chiều (TH28)|80 – 20|
|X rẽ trái, Y rẽ phải từ bên phải tới (TH29)|100 – 0|
|X quay đầu, Y rẽ phải (TH26)|100 – 0|`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH4 – 8, 26 – 29)', r: ['nt3-nhanh', 'nt3-nguyentac'] },

{ id: 'nt3-nhanh', g: 'nt3',
  q: 'Xe từ đường nhánh, đường bên cạnh đi ra đường chính va chạm thì lỗi ai?',
  k: ['đường nhánh', 'đường phụ', 'ra đường chính', 'từ ngõ ra', 'đường bên cạnh', 'nhập làn'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X từ đường nhánh ra đường chính, Y đi thẳng **đã giảm tốc** (TH1, TH9)|100 – 0 (X không nhường đường)|
|Như trên nhưng Y **không giảm tốc** khi qua nơi giao nhau|80 – 20|
|X từ đường bên cạnh rẽ trái, Y đi thẳng đã giảm tốc (TH2)|100 – 0; Y không giảm tốc: 80 – 20|`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH1, 2, 9)', r: ['nt3-giaonhau'] },

{ id: 'nt3-chuyenlan', g: 'nt3',
  q: 'Chuyển làn, lấn làn, va quẹt hông, mất lái sang làn khác thì phân lỗi thế nào?',
  k: ['chuyển làn', 'lấn làn', 'lấn đường', 'va quẹt', 'va hông', 'sát vạch', 'mất lái', 'đổi làn', 'chuyển dịch khỏi chỗ đỗ'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X chạy làn thẳng định rẽ vào nhánh, Y đang ở làn rẽ (TH3)|100 – 0|
|X rời vị trí đang đỗ ra đường, Y đi thẳng (TH12)|100 – 0|
|X chuyển làn, Y chạy đúng làn (TH13)|100 – 0|
|X lấn sang làn ngược chiều, Y đúng làn (TH14)|100 – 0|
|Hai xe ngược chiều cùng chạy sát vạch (TH15)|50 – 50|
|Hai xe cùng áp sát vạch làn chung (TH16)|50 – 50|
|Hai xe cùng chuyển làn (TH17)|50 – 50|
|Va hông, cả hai chạy trong làn (TH18)|50 – 50|
|X mất lái lấn sang đường xe khác, Y kiểm soát được (TH19)|100 – 0|`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH3, 12 – 19)', r: ['nt3-vuot', 'nt3-nguyentac'] },

{ id: 'nt3-vuot', g: 'nt3',
  q: 'Va chạm khi vượt xe thì lỗi thế nào?',
  k: ['vượt xe', 'vượt phải', 'xin nhan rẽ phải', 'vượt ẩu', 'cấm vượt', 'đường cong', 'vượt tại đường vòng'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X vượt phải, Y xin nhan rẽ phải (TH30)|50 – 50|
|X vượt Y sai quy định, Y đi thẳng (TH31)|100 – 0|
|X vượt phải rồi đâm vào sau Y (TH32)|100 – 0|
|Va thành xe khi vượt ở đường vòng, cong — X ngoài làn (TH34)|100 – 0 (vượt nơi cấm vượt)|
!! VCX của chính xe khách hàng: **vượt tại khu vực có biển cấm vượt** → giảm trừ 10% – 30% STBT.`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH30 – 32, 34); QT VCX 109/2025 – khoản 12.1.1', r: ['dg-giamtru', 'nt3-chuyenlan'] },

{ id: 'nt3-quaydau', g: 'nt3',
  q: 'Xe quay đầu gây va chạm thì lỗi thế nào?',
  k: ['quay đầu', 'quay xe', 'quay đầu xe', 'quay đầu sai quy định'],
  a: `|Tình huống|Tỷ lệ X – Y|
|Trong khu dân cư, X quay đầu, Y đi thẳng (TH10)|100 – 0 (quay đầu sai quy định)|
|X quay đầu, Y rẽ phải (TH26)|100 – 0 (phải nhường xe rẽ phải)|
|X quay đầu trên đường, Y đi thẳng ngược chiều (TH36)|100 – 0|
!! VCX: quay đầu **tại nơi bị cấm** thuộc điểm loại trừ 15.6 của Quy tắc 2025.`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH10, 26, 36); QT VCX 109/2025 – khoản 15.6', r: ['qt-loaitru'] },

{ id: 'nt3-dodoxe', g: 'nt3',
  q: 'Va chạm trong bãi đỗ, khi lùi xe hoặc mở cửa xe thì lỗi thế nào?',
  k: ['bãi đỗ', 'lùi xe', 'đỗ xe', 'mở cửa xe', 'mở cửa', 'ô đỗ', 'tiến lùi', 'hầm xe'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X tiến/lùi trong ô để xe, đâm Y đang đỗ (TH21)|100 – 0|
|X tiến/lùi ra khỏi ô đỗ, Y đi thẳng trên lối (TH22)|100 – 0 (lùi thiếu quan sát)|
|Cả X và Y cùng tiến/lùi trong ô đỗ (TH23)|50 – 50|
|Lái xe/hành khách X **mở cửa** vào đường Y đang chạy (TH24)|100 – 0|
|X đi thẳng đâm Y đang đỗ (TH20)|100 – 0|`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH20 – 24)', r: ['nt3-guixe'] },

{ id: 'nt3-vongxuyen', g: 'nt3',
  q: 'Va chạm tại vòng xuyến thì lỗi thế nào?',
  k: ['vòng xuyến', 'bùng binh', 'đảo giao thông'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X đi vào vòng xuyến, Y đang chạy trong vòng xuyến (TH11)|100 – 0 (vào vòng xuyến phải nhường xe bên trái tới)|
|X rẽ phải, Y đang đi theo vòng xuyến (TH33)|100 – 0|`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH11, 33)', r: ['nt3-giaonhau'] },

{ id: 'nt3-khac', g: 'nt3',
  q: 'Phân lỗi khi xuống dốc, có chướng ngại vật, qua đường sắt?',
  k: ['xuống dốc', 'lên dốc', 'chướng ngại vật', 'đường hẹp', 'đường sắt', 'tàu hỏa', 'đâm tàu', 'tránh xe'],
  a: `|Tình huống|Tỷ lệ X – Y|
|X xuống dốc, Y lên dốc (TH38)|100 – 0 (xe xuống dốc nhường xe lên dốc)|
|X có chướng ngại vật phía trước lấn sang, Y ngược chiều đi thẳng (TH35)|100 – 0 (không nhường xe ngược chiều)|
|Giao cắt đường sắt **có đủ biển báo, đèn tín hiệu** (không rào chắn), X đâm tàu (TH40-1)|Lỗi X — **từ chối**|
|Giao cắt đường sắt có biển báo nhưng **không có đèn, rào chắn**, X đâm tàu (TH40-2)|X 100%|`,
  s: 'PL.PTI.XCG.20.05 – mục II (TH35, 38, 40)', r: ['nt3-nguyentac'] },

{ id: 'nt3-thequyen', g: 'nt3',
  q: 'Điều kiện để PTI nhận thế quyền đòi người thứ ba là gì?',
  k: ['thế quyền', 'đòi người thứ ba', 'đòi NT3', 'bồi hoàn', 'nhận thế quyền', 'chuyển quyền đòi', 'điều kiện thế quyền'],
  a: `**Áp dụng khi:** xe bị thiệt hại do lỗi NT3; xe cháy/tổn thất thuộc trách nhiệm **bảo hành** của nhà SX; xe mất trộm/ngập/cháy/phá hoại khi **gửi có trông coi, thu tiền** (hầm, bãi, chung cư…); xe **cho thuê** bị tổn thất; hàng hoá trên xe bị thiệt hại do NT3/mất cùng xe khi gửi; trường hợp khác theo luật.
**PTI chỉ nhận thế quyền khi đủ 5 điều kiện:**
1. NĐBH và NT3 **chưa thoả thuận** bằng văn bản về bồi thường — hoặc đã thoả thuận nhưng vẫn bảo lưu quyền đòi/không làm giảm quyền đòi của PTI/được PTI chấp thuận.
2. Vụ tổn thất **thuộc phạm vi BH**, không thuộc loại trừ.
3. Có kết luận CQCN/GĐ độc lập về nguyên nhân, lỗi và/hoặc biên bản làm việc các bên (có NT3)/biên bản GĐ hiện trường xác định trách nhiệm NT3.
4. Có thiệt hại xe (VCX) hoặc hàng hoá (TNDS hàng hoá).
5. Có **Giấy chuyển giao quyền yêu cầu NT3 bồi hoàn** kèm thông báo cho các bên liên quan (NVXE039.01.57).`,
  s: 'PL.PTI.XCG.20.04 – mục II, III', r: ['nt3-buoc', 'nt3-khongbaoluu'] },

{ id: 'nt3-buoc', g: 'nt3',
  q: 'Các bước đòi người thứ ba bồi hoàn thực hiện thế nào?',
  k: ['các bước đòi', 'quy trình đòi NT3', 'đòi bồi hoàn', 'thu đòi', 'khởi kiện NT3', 'năng lực tài chính', 'thương thảo'],
  a: `1. **Tiếp nhận:** báo NĐBH phối hợp; dặn không tự thoả thuận với NT3, bảo lưu quyền đòi cho PTI; hướng dẫn NT3 báo DNBH TNDS của họ; thu giấy tờ xe, GPLX, CCCD, GCNBH của cả NT3 và NĐBH.
2. **Giám định & xác định trách nhiệm:** biên bản GĐ ghi rõ thông tin NT3. NT3 không có mặt → mời GĐ bằng văn bản (NVXE039.01.12), gửi kết quả GĐ (01.19) — **thư bảo đảm có báo phát**. Biên bản làm việc (01.20); thống nhất được → biên bản thoả thuận (01.21). Không thống nhất → văn bản NĐBH yêu cầu NT3 bồi thường (01.56) + **Giấy chuyển giao quyền** (01.57) + thông báo chi phí đã ghi nhận giá (01.47). Vụ bị khởi tố hình sự → báo Ban Pháp chế để PTI tham gia tố tụng (01.58).
3. **Thu thập hồ sơ** thiệt hại & thế quyền (hồ sơ CQCN, chứng từ giá trị…).
4. **Trình phương án** GQBT kèm phương án thu đòi. Không đủ hồ sơ đòi (khách quan) → báo cáo, được LĐ Miền duyệt trước khi trình BT.
5. **Sau khi thanh toán BT** (≤ 02 ngày): gửi CV yêu cầu NT3 bồi hoàn (01.59, ghi rõ thời hạn), không phản hồi → nhắc lần 2. Chưa xác định NT3 → gửi CQCN văn bản cho PTI nhận lại tài sản (01.60), nhắc hằng tháng.
6. NT3 chỉ trả một phần/không trả → **đánh giá năng lực tài chính** (01.62), tờ trình phương án thu đòi (01.65) có ý kiến Ban Pháp chế; thương thảo (01.63, 01.64).
7. NT3 không hợp tác → bàn giao hồ sơ Ban Pháp chế **khởi kiện**.`,
  s: 'PL.PTI.XCG.20.04 – mục IV; QT PTI.XCG.20 – mục 7.1.3', r: ['nt3-thequyen', 'sb-viecsau'] },

{ id: 'nt3-khongbaoluu', g: 'nt3',
  q: 'Khách tự thoả thuận với người thứ ba, không bảo lưu quyền đòi thì bồi thường thế nào?',
  k: ['tự thỏa thuận', 'tự thoả thuận', 'không bảo lưu', 'đã nhận tiền người thứ ba', 'bên kia đã đền', 'không chuyển quyền đòi', 'giảm trừ NT3'],
  a: `- Quy tắc VCX 2025 (12.1.4): PTI giảm **tối đa 100%** STBT tương ứng **mức độ lỗi của NT3** khi NĐBH/lái xe: (i) không bảo lưu quyền khiếu nại và chuyển giao quyền đòi NT3 cho PTI kèm hồ sơ; (ii) không hợp tác với PTI đòi NT3; (iii) tự thoả thuận bồi thường với NT3 không theo hướng dẫn/chưa có ý kiến PTI.
- Căn cứ xác định: hồ sơ CQCN hoặc kết quả điều tra xác minh của PTI.
- Khách không cung cấp đủ: hồ sơ xác định trách nhiệm NT3, giá trị thiệt hại, tài liệu làm việc với NT3, giấy tờ pháp lý của NĐBH → cũng bị áp giảm trừ.
!! Luôn dặn khách ngay từ đầu: **không tự thoả thuận** với NT3 khi chưa có ý kiến PTI.`,
  s: 'QT VCX 109/2025 – khoản 12.1.4; PL.PTI.XCG.20.10 – mục 7.1.4; PL.PTI.XCG.20.01', r: ['nt3-thequyen', 'dg-giamtru'] },

{ id: 'nt3-guixe', g: 'nt3',
  q: 'Xe bị hư hỏng, mất cắp khi gửi ở bãi, hầm chung cư hoặc xe cho thuê thì thu thập gì để đòi?',
  k: ['gửi xe', 'bãi gửi xe', 'hầm chung cư', 'trông giữ xe', 'vé gửi xe', 'mất xe ở bãi', 'xe cho thuê', 'ban quản lý tòa nhà'],
  a: `**Ngoài hồ sơ chung, thu thêm:**
- **Gửi có trông coi** (hầm, bãi, sân nhà gửi, chung cư…) bị ngập/cháy/hư hỏng (không do thiên tai): HĐ trông coi xe/vé gửi xe; chứng từ thanh toán tiền gửi; biên bản khám nghiệm hiện trường của CQCN (nếu có); kết luận điều tra nguyên nhân của công an/cơ quan thẩm quyền/GĐ độc lập.
- **Mất toàn bộ xe/hàng do trộm cướp:** xác nhận công an tiếp nhận điều tra; biên bản khám nghiệm hiện trường; quyết định khởi tố (nếu có); kết luận điều tra hoặc quyết định đình chỉ; đơn trình báo mất xe, mất giấy tờ có xác nhận công an; ảnh dấu vết cạy phá, video camera; nếu gửi trông giữ thêm HĐ/vé gửi xe và chứng từ trả tiền.
- **Xe cho thuê:** HĐ cho thuê xe; biên bản giao nhận xe & giấy tờ; chứng từ thanh toán tiền thuê.
- Đã xét xử: bản án có hiệu lực, quyết định thi hành án.
!! VCX không bồi thường mất xe do **lừa đảo, lạm dụng tín nhiệm** (xe cho thuê, cho mượn, siết nợ, cầm cố, tranh chấp) — loại trừ 15.18.`,
  s: 'PL.PTI.XCG.20.04 – mục II, Bước 3 (c, d, e, f); QT VCX 109/2025 – khoản 15.18', r: ['nt3-thequyen', 'dg-toanbo'] }
);

/* ─── 9. BIỂU MẪU ─── */
TL_KB.push(
{ id: 'bm-danhmuc', g: 'bieumau', x: 'forms',
  q: 'Danh mục biểu mẫu BM.PTI.XCG.20 theo từng bước quy trình?',
  k: ['biểu mẫu', 'danh mục biểu mẫu', 'mẫu biểu', 'các mẫu', 'BM.PTI.XCG', 'form', 'mẫu văn bản'],
  a: `Danh mục mẫu áp dụng Quy trình PTI.XCG.20, xếp theo bước (gõ mã để tra nhanh, vd **"20.35"** hoặc **"mẫu bảo lãnh"**).`,
  s: 'Bộ biểu mẫu áp dụng Quy trình giải quyết BT NV XCG (docs/Quy trinh XCG -bieu mau 2026; docs/Quy trinh GQ BT NVXCG-2024/Bieu mau BM.PTI.XCG)', r: ['bm-thumuc'] },

{ id: 'bm-thumuc', g: 'bieumau',
  q: 'File biểu mẫu Word lưu ở đâu, dùng bản nào?',
  k: ['file biểu mẫu', 'tải biểu mẫu', 'mẫu word', 'bản mới nhất', 'biểu mẫu 2026', 'thư mục biểu mẫu'],
  a: `- **Bản 2026 (ưu tiên dùng):** thư mục docs/Quy trinh XCG -bieu mau 2026 — biểu mẫu áp dụng quy trình, biểu mẫu tạm ứng/hoàn trả tạm ứng, biểu mẫu thế quyền đòi NT3 (NVXE039.01.xx).
- **Bộ BM.PTI.XCG.20 đầy đủ (12/2024):** docs/Quy trinh GQ BT NVXCG-2024/Bieu mau BM.PTI.XCG (có thêm bản BB GĐ rút gọn, xác nhận phương án rút gọn, VCX + cứu hộ).
!! Thư mục docs chỉ có trên máy lưu dự án, không kèm theo trang web.`,
  s: 'Cấu trúc thư mục docs/ của dự án', r: ['bm-danhmuc'] }
);

/* ─── 10. TRA CỨU HỒ SƠ TRONG DỮ LIỆU ─── */
TL_KB.push(
{ id: 'dl-huongdan', g: 'dulieu',
  q: 'Trợ lý tra cứu hồ sơ trong dữ liệu dashboard như thế nào?',
  k: ['hướng dẫn sử dụng', 'cách dùng trợ lý', 'tra cứu hồ sơ', 'tra biển số', 'tìm hồ sơ', 'trợ lý làm được gì', 'giúp'],
  a: `Trợ lý đọc trực tiếp dữ liệu đang tải trên dashboard (Google Drive/Dulieu.xlsx):
- Gõ **biển số** (vd **14A-123.45** hoặc 14A12345) hoặc **số HSBT** (vd 0041172) → xem trạng thái, số ngày tồn, bước quy trình hiện tại, việc cần làm tiếp và thời hạn chuẩn.
- Gõ **"hồ sơ tồn của TUNGHX"**, **"hồ sơ tồn ≥90 ngày"**, **"hồ sơ của tôi"** → danh sách hồ sơ tồn lâu nhất.
- Gõ **"tổng quan tồn"** → bảng hồ sơ tồn theo từng GĐV.
- Gõ mã mẫu **"20.35"** → tên và bước dùng biểu mẫu.
- Hỏi quy trình bằng lời thường: "khi nào phải ra hiện trường", "khấu hao lốp", "tạm ứng tử vong"…
!! Câu trả lời quy trình là **tóm tắt**; khi lập văn bản, trình duyệt cần đối chiếu nguồn ghi ở cuối mỗi câu trả lời.`,
  s: 'Trợ lý GĐV – hướng dẫn sử dụng', r: ['dl-trangthai', 'dl-ton', 'dl-gdvtoi'] },

{ id: 'dl-trangthai', g: 'dulieu', x: 'status',
  q: 'Các trạng thái hồ sơ trên phần mềm tương ứng bước nào của quy trình?',
  k: ['trạng thái hồ sơ', 'trạng thái', 'ý nghĩa trạng thái', 'giám định chi tiết', 'trình duyệt giá', 'check duyệt giá', 'đã bảo lãnh', 'chờ thanh toán', 'đã thanh toán', 'công nhận giá', 'bước nào'],
  a: `Luồng trạng thái trên phần mềm: Giám định chi tiết → Trình/Check/Chờ duyệt/Đã duyệt **công nhận giá** → Trình/Check/Chờ duyệt/Đã duyệt **duyệt giá** → Trình bảo lãnh/Đã bảo lãnh → Trình/Check/Chờ duyệt/Đã duyệt **đề nghị thanh toán** → Chờ thanh toán → Đã thanh toán. Đối chiếu với các bước quy trình:`,
  s: 'Cột Trạng thái hồ sơ trong dữ liệu phần mềm; QT PTI.XCG.20 – Bước 3 – 7 (trợ lý đối chiếu)', r: ['dg-thoihan', 'ct-dntt'] },

{ id: 'dl-ton', g: 'dulieu',
  q: 'Số ngày tồn, hồ sơ tồn trên 45 ngày, từ 90 ngày được tính thế nào?',
  k: ['số ngày tồn', 'hồ sơ tồn', 'tồn 45 ngày', 'tồn 90 ngày', 'quá hạn', 'đã giải quyết', 'cách tính tồn'],
  a: `**Quy ước của dashboard này:**
- **Đã giải quyết** ⇔ Số ngày tồn = 0. Số ngày tồn > 0 → đang tồn; ô trống/"-" → chưa giải quyết (chưa có số ngày).
|Nhóm|Điều kiện|
|1 – 30 ngày|1 ≤ n ≤ 30|
|31 – 45 ngày|30 < n ≤ 45|
|46 – 89 ngày|45 < n < 90|
|Từ 90 ngày (cảnh báo)|n ≥ 90|`,
  s: 'Quy ước Dashboard PTISOS QN (CLAUDE.md)', r: ['dl-huongdan'] },

{ id: 'dl-gdvtoi', g: 'dulieu', x: 'setgdv',
  q: 'Chọn "GĐV của tôi" để xem nhanh hồ sơ tồn của mình?',
  k: ['GĐV của tôi', 'tôi là', 'chọn GĐV', 'hồ sơ của tôi', 'của em', 'của mình'],
  a: `Chọn mã GĐV của bạn bên dưới. Trợ lý nhớ lựa chọn này trên trình duyệt này; sau đó gõ **"hồ sơ của tôi"** hoặc **"tồn của tôi"** để xem nhanh.`,
  s: 'Trợ lý GĐV', r: ['dl-huongdan'] }
);
/* ─── 11. CAM KẾT CLDV & CÔNG VĂN PTI ─── */
TL_KB.push(
{ id: 'cl-camket', g: 'cldv',
  q: 'Các cam kết chất lượng dịch vụ (CLDV) nghiệp vụ XCG theo CV 4406 gồm những gì?',
  k: ['cam kết CLDV', 'chất lượng dịch vụ', 'CV 4406', '4406', 'cam kết dịch vụ', 'khách hàng VIP', 'xe thương mại', 'kênh Banca', 'kênh Vnpost', 'khách hàng phổ thông', 'môi giới', 'kính gương đèn', 'nhóm Zalo', 'SMS'],
  a: `CV **4406/PTI-BHXCG ngày 22/10/2021** (hiệu lực đến khi có văn bản thay thế). Cột nhóm KH theo phụ lục: Phổ thông · Banca · Vnpost · "KH xe TM" · Xe thương mại · VIP.
|Cam kết|Áp dụng|
|Xử lý thông tin, phản hồi khiếu nại trong **60 phút** từ mọi nguồn (email, mạng xã hội, điện thoại, đánh giá App, văn bản)|Tất cả|
|GĐV tới hiện trường 24/7: **30 phút** nội thành, **60 phút** ngoại thành tỉnh có đơn vị PTI; chia sẻ vị trí, hành trình GĐV|Tất cả|
|Hướng dẫn thu thập hồ sơ **1 lần** bằng văn bản/tin nhắn hệ thống; hỗ trợ đàm phán BT TNDS với bên thứ 3|Tất cả|
|Không bắt buộc thông báo hiện trường với tổn thất do **xước trong quá trình sử dụng** và tổn thất **dưới 10 triệu**|KH xe TM, xe thương mại, VIP|
|GĐ tại địa điểm KH yêu cầu; GĐ chi tiết, duyệt giá, bảo lãnh **7/7** (cả T7, CN, lễ); gửi bảo lãnh chậm nhất **trước 1 giờ** khi xe ra xưởng|Tất cả|
|Thay thế nhanh phụ tùng **kính, gương, đèn**|KH xe TM, xe thương mại, VIP|
|Hỗ trợ chi phí miễn thường có khấu trừ 500.000đ/vụ|VIP (xe thương mại: theo HĐBH)|
|Áp dụng mức giảm trừ thấp nhất trong khung|Tất cả trừ KH phổ thông|
|Không khấu hao tài sản bên thứ 3 trong HS TNDS bắt buộc|Vnpost, KH xe TM, xe thương mại, VIP|
|Không giảm trừ BT tổn thất xước quanh xe khi yêu cầu BT đến **lần thứ 2** trong năm BH|KH xe TM, xe thương mại, VIP|
|SMS nhắc hạn đăng kiểm; SMS số tiền BT & thời gian nhận tiền; SMS giá sửa chữa & dự kiến ra xưởng; KH đánh giá CLDV của GĐV|Tất cả|
|Cập nhật tiến độ & nguyên nhân HS tồn cho kênh bán|Banca, Vnpost|
|Nhóm Zalo/Viber riêng theo KH: doanh thu 300–500 triệu (KTV/GĐV/LĐ phòng/CQ), 500 triệu–2 tỷ (+ LĐ Ban XCG), từ 2 tỷ (+ PTGĐ)|KH xe TM, xe thương mại, VIP|
- Cứu hộ PAN khi xe sự cố kỹ thuật + bảo lãnh tại Hà Nội, HCM, Đà Nẵng: tất cả; ngoài 3 địa bàn này KH trả trước, PTI thanh toán **500.000đ/chuyến** khi có chứng từ: kênh Vnpost (xe thương mại, VIP theo HĐBH).
!! Vi phạm cam kết xử lý theo quy chế xử phạt hiện hành. Phòng GĐBT đào tạo toàn bộ GĐV/BTV; P.CLDV khách hàng theo dõi, kiểm tra.`,
  s: 'CV 4406/PTI-BHXCG ngày 22/10/2021 – Phụ lục 01', r: ['cl-duyetgia', 'ht-thoigian', 'dg-khautru'] },

{ id: 'cl-duyetgia', g: 'cldv',
  q: 'Cam kết thời gian duyệt giá sửa chữa với khách hàng theo nhóm khách hàng?',
  k: ['cam kết duyệt giá', 'thời gian duyệt giá cam kết', 'duyệt giá mấy giờ', 'duyệt giá mở rộng', 'báo giá dưới 20 triệu', '8 giờ', '4 giờ', 'khách VIP duyệt giá'],
  a: `Cam kết CLDV với khách hàng (CV 4406, Phụ lục 01 mục III.5 – III.6), tính theo giá trị **báo giá**:
|Báo giá|KH phổ thông, Banca, Vnpost|KH xe TM, xe thương mại, VIP (mở rộng)|
|Dưới 20 triệu|tối đa 8 giờ|tối đa 4 giờ|
|20 – dưới 50 triệu|tối đa 2 ngày|tối đa 1 ngày|
|50 – dưới 100 triệu|tối đa 4 ngày|tối đa 2 ngày|
|Trên 100 triệu|tối đa 6 ngày|tối đa 3 ngày|
- GĐ chi tiết, duyệt giá, bảo lãnh thực hiện **7/7**; bảo lãnh gửi chậm nhất trước 1 giờ khi xe ra xưởng.
!! Đây là cam kết với khách hàng. Thời hạn nội bộ từng khâu (GĐV trình, check, validate) theo QT PTI.XCG.20 Bước 4 — xem mục "Thời hạn duyệt giá theo số tiền".`,
  s: 'CV 4406/PTI-BHXCG ngày 22/10/2021 – Phụ lục 01 mục III', r: ['dg-thoihan', 'cl-camket'] },

{ id: 'gd-anhcapdon', g: 'cldv',
  q: 'Quy định chụp ảnh đánh giá rủi ro trước khi cấp đơn VCX (CV 3653) để GĐV đối chiếu?',
  k: ['ảnh cấp đơn', 'chụp ảnh trước khi cấp đơn', 'đánh giá rủi ro', 'ảnh khai thác', 'ảnh đánh giá rủi ro', 'CV 3653', 'tổn thất sát ngày cấp đơn', '08 số cuối số khung', 'nhập liệu GCN'],
  a: `CV **3653/PTI-BHXCG ngày 03/10/2024** (hiệu lực 05/10/2024):
- **Mọi xe tham gia VCX** phải đánh giá rủi ro & chụp ảnh trước khi cấp đơn, trừ: xe **tái tục liên tục** tại PTI; xe chuyển từ DNBH khác **không gián đoạn** hiệu lực (thay bằng ảnh HĐBH/GCN cũ); xe mới 100% cấp trước khi showroom bàn giao (thay bằng hoá đơn mua xe — hiệu lực ≤ 01 ngày từ ngày xuất hoá đơn, hoặc BB bàn giao xe — không muộn hơn ngày bàn giao); xe tải, đầu kéo, romooc cấp qua Banca trước khi giải ngân (thay bằng BB định giá, ảnh thẩm định của NH, giấy biên nhận thế chấp, HĐ tín dụng…). Đơn cấp sau **30 ngày** kể từ ngày lập các tài liệu đó → vẫn phải chụp ảnh.
- **Bắt buộc chụp lại ảnh:** HĐ đã tự động mất hiệu lực do nộp phí quá hạn nay khôi phục; tham gia thêm điều khoản bổ sung khi HĐ đang hiệu lực (chụp trước khi cấp SĐBS).
- **Ảnh:** ít nhất **05 ảnh** = 04 ảnh 4 góc bao quát + 01 ảnh cận **tem đăng kiểm** rõ thông số (khuyến khích có thời gian chụp, ảnh số khung/số máy). Chụp trước khi cấp GCN và **không sớm hơn 48 giờ**; HĐ khôi phục hiệu lực: không muộn hơn 48 giờ từ khi PTI nhận phí. Đoàn xe từ 10 xe (trừ taxi, xe khách liên tỉnh) có lý do khách quan: trong 15 ngày từ ngày bắt đầu hiệu lực.
- **Ghi trên GCN ô tô:** đủ ký tự biển số + **08 số cuối số khung**; xe chưa có biển phải ghi thêm số máy. Nhập liệu GCN cấp giấy: ô tô ≤ 24 giờ, xe máy ≤ 15 ngày.
!! Khi giám định tổn thất xảy ra sát ngày cấp đơn: đối chiếu ảnh cấp đơn với hiện trạng và hư hỏng (vết cũ, hạng mục đã hư từ trước).`,
  s: 'CV 3653/PTI-BHXCG ngày 03/10/2024', r: ['gd-tailieu', 'gd-xmp', 'gd-trucloi'] },

{ id: 'gd-thanhtoanphi', g: 'giamdinh',
  q: 'Thời hạn thanh toán phí bảo hiểm XCG được nợ bao nhiêu ngày? Chưa đóng phí có được bồi thường không?',
  k: ['thời hạn thanh toán phí', 'nợ phí', 'nợ phí bảo hiểm', 'nợ phí bao nhiêu ngày', 'được nợ phí mấy ngày', 'được nợ phí', 'hạn nộp phí', 'CV 1959', '1959', 'chia kỳ thanh toán phí', 'khách hàng doanh nghiệp nợ phí', 'hợp đồng dưới 1 năm', 'chưa đóng phí có được bồi thường', 'gia hạn thanh toán phí', 'banca nợ phí', 'môi giới nợ phí', 'tái tục liên tục', 'phí tối thiểu kỳ 1', 'tài khoản chuyên thu'],
  a: `**CV 1959/PC-PTI ngày 22/05/2025** — Hướng dẫn quy định thanh toán phí bảo hiểm.
**Nguyên tắc chung:** bên mua bảo hiểm thanh toán phí khi giao kết HĐBH. Nếu có thoả thuận về thời hạn:
- **Đóng một lần:** không quá **30 ngày** kể từ ngày bắt đầu thời hạn bảo hiểm. Thời hạn bảo hiểm dưới 30 ngày → chậm nhất vào **ngày kết thúc thời hạn bảo hiểm**.
- **Đóng theo kỳ:** tối đa **04 kỳ** trong suốt thời hạn bảo hiểm. Kỳ đầu không quá **30 ngày** kể từ ngày bắt đầu thời hạn bảo hiểm; các kỳ sau theo thoả thuận **tại HĐBH đã giao kết ban đầu**, các bên **không được thoả thuận thay đổi** trong quá trình thực hiện. Mọi trường hợp **không vượt quá thời hạn bảo hiểm**.
- **Gia hạn thanh toán phí** phải được quy định trong HĐBH và **chỉ áp dụng khi bên mua có tài sản bảo đảm hoặc bảo lãnh** thanh toán phí.
**Riêng nghiệp vụ xe cơ giới** (xét theo tổng phí của tất cả loại hình trên HĐBH/GCNBH):
|HĐBH/GCNBH|KH Doanh nghiệp/Tổ chức/HCSN|KH Cá nhân|
|GCNBH **cấp lẻ không lập hợp đồng**|Thu phí **01 lần** khi cấp GCNBH — **không được nợ phí**|Thu phí **01 lần** khi cấp — **không được nợ phí**|
|HĐBH thời hạn **dưới 01 năm**|Không quá **15 ngày** kể từ ngày bắt đầu thời hạn BH|Thu 01 lần khi cấp, không được nợ. Qua **môi giới**: HĐ đến 30 ngày → nợ không quá thời hạn BH; HĐ trên 30 ngày–dưới 1 năm → nợ tối đa **30 ngày**|
|HĐBH **từ 01 năm**, tổng phí **≤ 7 triệu**|Không quá **15 ngày**|Thu 01 lần khi cấp. Xem các ngoại lệ bên dưới|
|HĐBH **từ 01 năm**, tổng phí **trên 7 – 20 triệu**|Thu 01 lần, không quá **15 ngày**|Thu 01 lần khi cấp. Xem các ngoại lệ bên dưới|
|HĐBH **từ 01 năm**, tổng phí **trên 20 – 100 triệu**|Tối đa **02 kỳ**: kỳ 1 **không dưới 60%** tổng phí, không quá **30 ngày**; kỳ 2 toàn bộ phần còn lại, không quá **90 ngày**|Thu 01 lần khi cấp. Xem các ngoại lệ bên dưới|
**Ngoại lệ cho khách hàng cá nhân** (HĐBH từ 01 năm):
- **Xe tái tục liên tục** tại PTI hoặc DNBH khác, cấp GCNBH **trước** ngày bắt đầu thời hạn bảo hiểm → được nợ phí với thời hạn **không vượt quá ngày bắt đầu thời hạn bảo hiểm**. Tái tục từ DNBH khác: đơn vị phải **đính kèm bản chụp GCNBH cũ ngay tại ngày cấp đơn** trên phần mềm nghiệp vụ.
- **Kênh Banca**: nợ tối đa **15 ngày** kể từ ngày bắt đầu thời hạn BH nếu thoả mãn một trong hai điều kiện: (a) có nội dung **chuyển quyền thụ hưởng cho Ngân hàng/Tổ chức tài chính** (thể hiện trên HĐBH/GCNBH/giấy xác nhận chuyển quyền thụ hưởng), hoặc (b) **thanh toán qua tài khoản chuyên thu của PTI**.
- **Kênh môi giới**: nợ tối đa **30 ngày** kể từ ngày bắt đầu thời hạn bảo hiểm.
!! Khi giám định, **in phiếu xác minh phí** để kiểm tra tỷ lệ phí và hạn nộp phí. Tổn thất xảy ra khi hợp đồng **chưa phát sinh doanh thu thực thu** → phần mềm chặn duyệt hồ sơ, phải **trình mở logic** kèm chứng từ chứng minh.`,
  s: 'CV 1959/PC-PTI ngày 22/05/2025 – Hướng dẫn quy định thanh toán phí bảo hiểm, mục I.1 (1.1 và 1.2.1 nghiệp vụ xe cơ giới)', r: ['gd-xmp', 'gd-tailieu', 'sb-mologic'] },

{ id: 'gd-gplx-ca', g: 'giamdinh',
  q: 'Giấy phép lái xe do Công an, Quân đội cấp có hợp lệ khi lái xe dân sự không?',
  k: ['GPLX công an', 'bằng lái công an', 'bằng lái quân đội', 'GPLX quân sự', 'giấy phép lái xe quân đội', 'lái xe dân sự', 'CV 5884', 'xe quân sự', 'Cục Xe Máy'],
  a: `CV **5884/PTI-BHXCG ngày 24/12/2020**:
- GPLX do ngành **Công an, Quân đội** cấp, **phù hợp loại xe** điều khiển, **còn hiệu lực**, **không bị tước** quyền sử dụng (có thời hạn/vô thời hạn) → được coi là **hợp lệ** khi điều khiển xe dân sự.
- Ngược lại, người điều khiển **xe ô tô quân sự** (biển số do Cục Xe – Máy cấp) phải có **GPLX quân sự** hợp lệ.
- Căn cứ tham vấn: Luật Giao thông đường bộ; TT 12/2017/TT-BGTVT; TT 93/2016/TT-BQP (Điều 23); TT 57/2017/TT-BCA hợp nhất TT 53/2015/TT-BCA (Điều 20).
!! Văn bản pháp luật dẫn trong CV có thể đã được thay thế (Luật TTATGT đường bộ 2024) — nguyên tắc "phù hợp loại xe, còn hiệu lực, không bị tước" vẫn là điều kiện kiểm tra GPLX.`,
  s: 'CV 5884/PTI-BHXCG ngày 24/12/2020 – mục I', r: ['gd-gplx'] },

{ id: 'dg-dinhgia', g: 'duyetgia',
  q: 'Giá sửa chữa PTI xác định chênh lệch với kết luận định giá của cơ quan chức năng thì xử lý thế nào?',
  k: ['định giá', 'kết luận định giá', 'hội đồng định giá', 'định giá tài sản', 'tố tụng hình sự', 'chênh lệch định giá', 'trưng cầu định giá', 'CV 5884'],
  a: `CV **5884/PTI-BHXCG ngày 24/12/2020 – mục II**:
- Theo Bộ luật Tố tụng hình sự (Điều 215), kết luận định giá trong tố tụng hình sự chỉ có giá trị giải quyết **vụ án hình sự**; phần dân sự thực hiện theo tố tụng dân sự/thoả thuận các bên → **BT của PTI không bắt buộc theo kết luận định giá** trong tố tụng hình sự.
- GĐ, xác định thiệt hại theo **quy định chào giá cạnh tranh**. Tờ trình duyệt giá/BT nêu rõ căn cứ: biên bản GĐ, tham khảo giá thị trường, điều khoản HĐ/GCNBH (sửa chính hãng, không trừ khấu hao… với VCX), mức trách nhiệm và số tiền chủ xe đã BT cho bên thứ ba (với TNDS).
- **Bỏ** khâu gửi công văn đến cơ quan định giá/CQCN để trưng cầu phần chênh lệch.
- Chỉ trưng cầu **giám định độc lập** khi KH **không chấp nhận** kết quả GĐ của PTI.
- BT trên giá trị thiệt hại do PTI/GĐ độc lập xác định + điều kiện HĐBH, giảm trừ/khấu hao/khấu trừ, mức trách nhiệm, thoả thuận BT với bên thứ ba.`,
  s: 'CV 5884/PTI-BHXCG ngày 24/12/2020 – mục II', r: ['dg-chaogia', 'gd-thuegd'] },

{ id: 'sb-taibh', g: 'saubt',
  q: 'Tổn thất đơn có tái bảo hiểm, đồng bảo hiểm: thông báo và thu đòi thế nào?',
  k: ['tái bảo hiểm', 'tái BH', 'đồng bảo hiểm', 'đồng BH', 'thu đòi tái', 'fronting', 'nhà bảo hiểm đứng đầu', '100.000 USD', 'Ban Tái bảo hiểm', 'PL.20.17', 'thu đòi đồng bảo hiểm', 'thu đòi tái bảo hiểm', 'PTI đứng đầu', 'đóng góp bồi thường', 'hồ sơ đòi tái'],
  a: `**Thông báo cho Ban Tái bảo hiểm** (GĐV gửi email; tổn thất thuộc đơn tái tạm thời/fronting hoặc tái cố định — hệ thống gửi email tự động):
|Trường hợp|Thời hạn|
|Phát sinh tổn thất thuộc đơn tái (đối tượng, địa điểm, thời gian, ước tổn thất, diễn biến)|≤ 01 ngày làm việc từ khi nhận thông tin|
|Thuê giám định độc lập (tên đơn vị, chi phí dự kiến)|Trước khi thuê|
|Trình phương án từ chối (căn cứ từ chối)|Khi trình|
|Thông báo phương án GQBT / từ chối (số tiền, phương án)|Sau khi phát hành thông báo|
|Thu đòi tái|≤ **07 ngày** sau khi giải quyết xong BT|
**Hồ sơ đòi tái (GĐV email Ban Tái BH – VP Tổng công ty):** HĐBH; TBTN & YCBT; BB hiện trường, BBGĐ, bản ảnh, báo cáo GĐ, sơ đồ hiện trường; báo giá, hoá đơn; thông báo BT; giấy xác nhận BT, giấy chuyển quyền yêu cầu NT3 bồi hoàn (nếu có); chứng từ đã chuyển tiền (UNC, phiếu chi); chứng từ khác theo yêu cầu nhà tái.
**Đồng bảo hiểm:**
- PTI **đứng đầu**: sau khi BT, soạn công văn thu đòi đồng BH, báo Trung tâm thanh toán xuất hoá đơn theo tỷ lệ, gửi chứng từ cho các nhà đồng BH — ≤ **02 ngày** sau khi BT.
- PTI **không đứng đầu**: nhận công văn đề nghị đóng góp + hồ sơ → mở HSBT trên PMNV, kiểm tra, trình duyệt theo thẩm quyền, đề nghị nhà đứng đầu xuất hoá đơn phần của PTI, lập ĐNTT (Bước 6).
- Đồng BH không có nhà chính/phụ (mỗi DN tự thu phí, tự BT theo tỷ lệ) → không phát sinh đóng góp/thu đòi.`,
  s: 'PL.PTI.XCG.20.17 – mục I, II', r: ['sb-viecsau', 'gd-thuegd'] },

{ id: 'qt-110', g: 'quytac',
  q: 'Quy tắc 110/2025 (trách nhiệm chủ xe/lái xe với phụ xe, người ngồi trên xe): loại trừ và thời hạn?',
  k: ['QĐ 110', 'quy tắc 110', 'loại trừ người ngồi trên xe', 'loại trừ phụ xe', 'trẻ em dưới 6 tuổi', 'chở quá số người', 'số người thực tế', 'cảm đột ngột', 'ngộ độc', 'trúng gió'],
  a: `**Quy tắc QĐ 110/QĐ-PTI ngày 23/09/2025** — đối tượng BH: trách nhiệm BT thiệt hại tính mạng, sức khoẻ của chủ xe/lái xe đối với **người ngồi trên xe** (trừ lái xe, phụ xe; trừ chủ xe nếu không giao xe cho người khác) và **phụ xe**.
**Loại trừ chung (14.1):** cố ý gây thiệt hại; đua xe, kéo xe trái quy định, chạy thử sau sửa chữa; ngoài lãnh thổ VN; chiến tranh, khủng bố; đánh nhau (trừ tự vệ); **cảm đột ngột, trúng gió, bệnh tật**; ngộ độc thức ăn, đồ uống, dùng thuốc sai chỉ dẫn.
**Loại trừ riêng lái xe, phụ xe (14.2):** không có/hết hiệu lực đăng kiểm (trừ xe mới chờ đăng ký ≤ 30 ngày, xe lưu hành tạm thời, xe hoạt động khu vực nội bộ ghi trong HĐ); thông số kỹ thuật không khớp đăng kiểm (trừ la-zăng/lốp; thay đổi thùng nếu ghi trong HĐ); không có GPLX hợp lệ/bị tước; nồng độ cồn từ 50mg/100ml máu hoặc 0,25mg/1 lít khí thở, ma tuý; vi phạm đi đêm không đèn, đường cấm, ngược chiều, vượt đèn đỏ…; chở hàng/chất cháy nổ trái phép; quá tải, quá số người hoặc quá tốc độ **trên 50%**.
**Giảm trừ (Điều 11):** số người ngồi thực tế (không tính trẻ em dưới **6 tuổi**) lớn hơn số người tham gia BH → BT theo tỷ lệ số người tham gia BH / số người thực tế (không tính vị trí lái xe).
**Thời hạn:** nộp hồ sơ YCBT **01 năm** từ ngày xảy ra sự kiện; khiếu nại **90 ngày** từ khi nhận thông báo BT; khởi kiện **03 năm**.
**Giám định:** không thống nhất nguyên nhân, mức thiệt hại → giám định độc lập; kết luận khác PTI thì PTI trả phí GĐ, trùng thì NĐBH trả.`,
  s: 'Quy tắc BH trách nhiệm của chủ xe/lái xe đối với phụ xe, người ngồi trên xe ô tô — QĐ 110/QĐ-PTI ngày 23/09/2025 – Điều 1, 2, 9, 11, 12, 14', r: ['td-nntx', 'qt-thaydoi'] }
);

/* ─── 12. KHUNG PHÁP LÝ (Luật KDBH, NĐ 67/2023 & NĐ 220/2026, BLDS) ─── */
TL_KB.push(
{ id: 'pl-vanban', g: 'phaply',
  q: 'Nghiệp vụ bồi thường XCG hiện đang áp dụng những văn bản pháp luật nào?',
  k: ['văn bản pháp luật', 'căn cứ pháp lý', 'luật nào', 'nghị định nào', 'thông tư nào', 'danh mục văn bản', 'hệ thống văn bản', 'cơ sở pháp lý bồi thường'],
  a: `Các văn bản pháp luật nền cho nghiệp vụ giám định – bồi thường xe cơ giới:
|Văn bản|Nội dung|Hiệu lực|
|**Luật KDBH 08/2022/QH15**|Hợp đồng bảo hiểm, quyền & nghĩa vụ các bên, thời hạn bồi thường|01/01/2023|
|**Luật 139/2025/QH15** sửa đổi Luật KDBH|Chủ yếu về tổ chức, hoạt động DNBH|01/01/2026 (khoản 6 & 8 Điều 2: 01/07/2026)|
|**Văn bản hợp nhất 31/VBHN-VPQH**|Bản hợp nhất Luật KDBH 2022 + Luật 139/2025 — **dùng bản này để tra điều luật**|—|
|**NĐ 67/2023/NĐ-CP**|BH bắt buộc TNDS chủ xe cơ giới, BH cháy nổ bắt buộc, BH bắt buộc trong xây dựng|06/09/2023|
|**NĐ 220/2026/NĐ-CP**|Sửa đổi NĐ 67/2023 (phần xây dựng + đổi thuật ngữ)|01/07/2026|
|**NĐ 46/2023/NĐ-CP**|Quy định chi tiết thi hành một số điều Luật KDBH (tổ chức, hoạt động DNBH; BH xe cơ giới là nghiệp vụ phi nhân thọ)|01/07/2023|
|**TT 67/2023/TT-BTC**|Hướng dẫn Luật KDBH và NĐ 46/2023 — trả tiền bảo hiểm, thanh toán phí, cơ sở tính phí XCG|02/11/2023|
|**Bộ luật Dân sự 91/2015/QH13**|Bồi thường thiệt hại ngoài hợp đồng, nguồn nguy hiểm cao độ (Điều 601)|01/01/2017|
- Văn bản **nội bộ PTI** (QT PTI.XCG.20, Quy tắc QĐ 109/2025, QĐ 110/2025 và các phụ lục) chi tiết hoá pháp luật để áp dụng — khi giải quyết hồ sơ **ưu tiên quy trình và quy tắc PTI**, đối chiếu luật khi có tranh chấp hoặc khi quy trình chưa quy định.
!! **Bảo hiểm bắt buộc TNDS chủ xe cơ giới** là 1 trong các loại bảo hiểm bắt buộc theo **Điều 8 Luật KDBH** — không được thoả thuận khác so với NĐ 67/2023.`,
  s: 'Văn bản hợp nhất 31/VBHN-VPQH (Luật KDBH) – Điều 8; NĐ 67/2023/NĐ-CP; NĐ 220/2026/NĐ-CP; NĐ 46/2023/NĐ-CP; TT 67/2023/TT-BTC; BLDS 91/2015/QH13', r: ['pl-lkdbh', 'pl-nd220', 'pl-tt67', 'pl-blds601'] },

{ id: 'pl-lkdbh', g: 'phaply',
  q: 'Luật Kinh doanh bảo hiểm có những điều nào giám định viên phải nhớ?',
  k: ['luật kinh doanh bảo hiểm', 'LKDBH', 'luật 08/2022', 'điều 19', 'điều 30', 'điều 31', 'điều 46', 'thời hạn nộp hồ sơ yêu cầu bồi thường', 'nộp hồ sơ yêu cầu bồi thường trong bao lâu', 'nộp hồ sơ bồi thường muộn nhất', 'thời hiệu yêu cầu bồi thường', '01 năm kể từ ngày xảy ra sự kiện bảo hiểm', 'bao lâu phải trả tiền bảo hiểm', 'chậm trả phải trả lãi', 'loại trừ phải giải thích', 'bằng chứng giải thích loại trừ', 'chậm thông báo tổn thất'],
  a: `4 điều của Luật KDBH mà GĐV hay phải viện dẫn (theo VBHN 31/VBHN-VPQH):
**Điều 19 – Điều khoản loại trừ trách nhiệm bảo hiểm**
- DNBH phải quy định rõ trong HĐBH, phải **giải thích rõ ràng, đầy đủ** và **có bằng chứng xác nhận** bên mua đã được giải thích và hiểu rõ khi giao kết.
- Có **sự kiện bất khả kháng hoặc trở ngại khách quan** dẫn đến bên mua chậm thông báo sự kiện bảo hiểm → DNBH **không được áp dụng** điều khoản loại trừ về việc chậm thông báo.
**Điều 30 – Thời hạn nộp hồ sơ yêu cầu bồi thường**: **01 năm** kể từ ngày xảy ra sự kiện bảo hiểm; không tính thời gian bất khả kháng/trở ngại khách quan. Nếu NĐBH/người thụ hưởng chứng minh được **không biết** thời điểm xảy ra sự kiện → tính từ ngày biết. Nếu **bên thứ ba yêu cầu bên mua BH bồi thường** → tính từ ngày bên thứ ba yêu cầu.
**Điều 31 – Thời hạn bồi thường, trả tiền bảo hiểm**: theo thời hạn thoả thuận trong HĐBH; **không có thoả thuận** thì **15 ngày** kể từ ngày nhận đủ hồ sơ hợp lệ. **Chậm trả phải trả lãi** trên số tiền chậm trả tương ứng thời gian chậm, lãi suất theo thoả thuận và quy định Bộ luật Dân sự.
**Điều 46 – Thông báo khi sự kiện bảo hiểm xảy ra**: bên mua không thực hiện/chậm thực hiện nghĩa vụ thông báo → DNBH có quyền **giảm trừ số tiền bồi thường tương ứng với thiệt hại DNBH phải chịu**, trừ bất khả kháng/trở ngại khách quan. **Không được áp dụng** nếu HĐBH **không có thoả thuận** về trách nhiệm thông báo và chế tài.
!! Luật KDBH **không quy định "thời hiệu 3 năm"** cho yêu cầu bồi thường — mốc trong Luật là **01 năm nộp hồ sơ (Điều 30)**. Thời hiệu khởi kiện là quy định của Bộ luật Dân sự / Quy tắc bảo hiểm, đừng nhầm hai mốc này.`,
  s: 'Văn bản hợp nhất 31/VBHN-VPQH (Luật KDBH 08/2022/QH15, sửa đổi bởi Luật 139/2025/QH15) – Điều 19, 30, 31, 46', r: ['pl-vanban', 'qt-thoihan', 'dg-giamtru', 'sb-khieunai'] },

{ id: 'pl-nd220', g: 'phaply',
  q: 'Nghị định 220/2026/NĐ-CP sửa Nghị định 67/2023 có ảnh hưởng đến bồi thường TNDS xe cơ giới không?',
  k: ['nghị định 220', 'NĐ 220/2026', '220/2026', 'sửa nghị định 67', 'nghị định 67 còn hiệu lực', 'bên thứ ba', 'người thứ ba đổi tên', 'bên thứ ba hay người thứ ba', 'gọi là bên thứ ba', 'đổi thuật ngữ người thứ ba', 'mức trách nhiệm có thay đổi', 'hiệu lực 01/07/2026'],
  a: `**NĐ 220/2026/NĐ-CP ngày 22/06/2026**, hiệu lực **01/07/2026**, sửa đổi – bổ sung một số điều của NĐ 67/2023/NĐ-CP.
**Phần nội dung được sửa (Điều 1–8) chỉ liên quan bảo hiểm bắt buộc công trình trong hoạt động xây dựng**: Điều 32 (đối tượng BH), 33 (số tiền BH tối thiểu), 34 (bổ sung loại trừ mục rữa, kết tạo vảy cứng), 37 (mức phí & mức khấu trừ, giới hạn tăng/giảm phí tối đa 25%), 38 (trách nhiệm mua BH), 45, 58, cùng Phụ lục III và Mẫu số 3 Phụ lục X.
**Phần ảnh hưởng đến nghiệp vụ xe cơ giới — chỉ là thuật ngữ:** Điều 9 thay cụm từ **"người thứ ba" → "bên thứ ba"** tại nhiều điều của NĐ 67/2023, trong đó có các điều thuộc chương TNDS chủ xe cơ giới: khoản 5 Điều 3, Điều 5, điểm a khoản 1 Điều 7, điểm d khoản 2 Điều 10, khoản 2 và điểm a khoản 6 Điều 12, khoản 5 Điều 13.
|Nội dung|Sau 01/07/2026|
|Mức trách nhiệm BH bắt buộc TNDS (150 triệu/người/vụ về người; 100 triệu/vụ về tài sản)|**Không thay đổi**|
|Phạm vi, loại trừ, tạm ứng, hồ sơ bồi thường TNDS (Điều 7, 12, 13 NĐ 67)|**Không thay đổi nội dung**, chỉ đổi cách gọi bên thứ ba|
|Thời hạn, thủ tục giải quyết bồi thường TNDS|**Không thay đổi**|
- HĐBH đã giao kết **trước 01/07/2026** và còn thời hạn → tiếp tục thực hiện theo thoả thuận trong HĐBH, trừ khi các bên thoả thuận sửa đổi, bổ sung.
!! Văn bản, biểu mẫu nội bộ PTI vẫn dùng "người thứ ba"/"NT3". Khi **trích dẫn NĐ 67/2023 trong công văn, tờ trình từ 01/07/2026** nên dùng đúng thuật ngữ **"bên thứ ba"** của văn bản hiện hành.`,
  s: 'NĐ 220/2026/NĐ-CP ngày 22/06/2026 – Điều 1–9 và Điều 10 (điều khoản thi hành)', r: ['td-mtn', 'td-nt3', 'pl-vanban'] },

{ id: 'pl-blds601', g: 'phaply',
  q: 'Nguồn nguy hiểm cao độ là gì? Chủ xe phải bồi thường cả khi không có lỗi đúng không?',
  k: ['nguồn nguy hiểm cao độ', 'điều 601', 'BLDS', 'bộ luật dân sự', 'bồi thường khi không có lỗi', 'trách nhiệm chủ xe không lỗi', 'phương tiện giao thông vận tải cơ giới', 'lỗi cố ý của người bị thiệt hại', 'bất khả kháng tình thế cấp thiết'],
  a: `**Điều 601 Bộ luật Dân sự 2015** — cơ sở pháp lý của trách nhiệm dân sự chủ xe cơ giới:
- **Nguồn nguy hiểm cao độ** bao gồm **phương tiện giao thông vận tải cơ giới**, hệ thống tải điện, nhà máy công nghiệp đang hoạt động, vũ khí, chất nổ, chất cháy, chất độc, chất phóng xạ, thú dữ và các nguồn khác do pháp luật quy định. Chủ sở hữu phải vận hành, sử dụng, bảo quản, trông giữ, vận chuyển đúng quy định.
- **Chủ sở hữu** phải bồi thường thiệt hại do nguồn nguy hiểm cao độ gây ra; nếu đã **giao cho người khác chiếm hữu, sử dụng** thì **người đó** phải bồi thường, trừ trường hợp có thoả thuận khác.
- Chủ sở hữu, người chiếm hữu, sử dụng phải bồi thường **cả khi không có lỗi**, trừ hai trường hợp:
  a) Thiệt hại xảy ra **hoàn toàn do lỗi cố ý của người bị thiệt hại**;
  b) Thiệt hại xảy ra trong trường hợp **bất khả kháng hoặc tình thế cấp thiết**, trừ khi pháp luật có quy định khác.
- Nguồn nguy hiểm cao độ bị **chiếm hữu, sử dụng trái pháp luật** → người đang chiếm hữu, sử dụng trái pháp luật phải bồi thường; nếu chủ sở hữu/người chiếm hữu **có lỗi trong việc để bị chiếm hữu, sử dụng trái pháp luật** thì **liên đới** bồi thường.
!! Đây là lý do một vụ tai nạn vẫn phát sinh trách nhiệm bồi thường TNDS cho bên thứ ba **kể cả khi lái xe không có lỗi** — khác với bảo hiểm vật chất xe (xét theo phạm vi và loại trừ của Quy tắc). Khi phân lỗi, hai chuyện cần tách: **lỗi vi phạm giao thông** và **trách nhiệm bồi thường dân sự**.`,
  s: 'Bộ luật Dân sự 91/2015/QH13 – Điều 601 (Bồi thường thiệt hại do nguồn nguy hiểm cao độ gây ra)', r: ['nt3-nguyentac', 'td-nt3', 'pl-vanban'] },

{ id: 'pl-tt67', g: 'phaply',
  q: 'Thông tư 67/2023/TT-BTC và Nghị định 46/2023 quy định gì liên quan đến giải quyết bồi thường xe cơ giới?',
  k: ['thông tư 67', 'TT 67/2023', '67/2023/TT-BTC', 'nghị định 46', 'NĐ 46/2023', '46/2023/NĐ-CP', 'hướng dẫn luật kinh doanh bảo hiểm', 'chi phí thu thập tài liệu', 'yêu cầu khách hàng cung cấp giấy tờ', 'không được yêu cầu bằng chứng', 'từ chối phải nêu lý do bằng văn bản', 'thời điểm hiệu lực hợp đồng phi nhân thọ', 'cơ sở tính phí xe cơ giới', 'căn cứ tăng giảm phí'],
  a: `**NĐ 46/2023/NĐ-CP ngày 01/07/2023** — quy định chi tiết thi hành một số điều của Luật KDBH (chủ yếu về tổ chức, hoạt động, tài chính của DNBH, đại lý, môi giới, dịch vụ phụ trợ). Điều GĐV cần nhớ: **bảo hiểm xe cơ giới là nghiệp vụ bảo hiểm phi nhân thọ** (khoản 4 Điều 4); Điều 6, 7 lập **Cơ sở dữ liệu về hoạt động kinh doanh bảo hiểm** do Bộ Tài chính quản lý tập trung.
**TT 67/2023/TT-BTC ngày 02/11/2023** hướng dẫn Luật KDBH và NĐ 46/2023. Các điều chạm trực tiếp tới nghiệp vụ giám định – bồi thường:
|Điều|Nội dung GĐV cần biết|
|**Điều 18** – Trả tiền bảo hiểm|Thời hạn nộp hồ sơ & trả tiền theo Điều 30, 31 Luật KDBH. **Từ chối chi trả phải nêu rõ lý do bằng văn bản**. HĐBH phải nêu rõ tài liệu khách phải cung cấp; DNBH **không được yêu cầu bằng chứng mà bên mua không thể tiếp cận/thu thập** theo pháp luật. Tài liệu **thu thập thêm** ngoài danh mục trong HĐBH → **chi phí do DNBH chịu**|
|**Điều 26** – Thanh toán phí (phi nhân thọ)|Đóng một lần: không quá **30 ngày** kể từ ngày bắt đầu thời hạn BH; đóng theo kỳ: kỳ đầu không quá 30 ngày, các kỳ sau theo HĐBH ban đầu và **không được thoả thuận thay đổi**; **gia hạn** thanh toán phí chỉ khi bên mua có **tài sản bảo đảm hoặc bảo lãnh thanh toán phí** — đây là gốc pháp lý của CV 1959|
|**Điều 25** – Cơ sở tính phí BH xe cơ giới|Yếu tố tính phí bắt buộc: loại xe, mục đích kinh doanh, mục đích sử dụng, năm sản xuất. **Giảm phí** phải căn cứ quy mô đội xe, mức khấu trừ/miễn thường, **lịch sử bồi thường**, kênh phân phối… và **không thấp hơn phí thuần**|
|**Điều 16, 17**|HĐBH phi nhân thọ **có hiệu lực từ thời điểm giao kết**; hợp đồng phải ghi rõ mức phí, kỳ đóng, ngày đến hạn, thời gian gia hạn|
|**Điều 12, 19**|Quy tắc – điều kiện – điều khoản BH là **một bộ phận của HĐBH**; giải quyết tranh chấp theo Điều 32 Luật KDBH|
!! Khi khách phàn nàn "PTI đòi quá nhiều giấy tờ": đối chiếu **Điều 18 khoản 2, 3 TT 67** — chỉ được yêu cầu tài liệu đã nêu trong HĐBH/quy tắc, tài liệu ngoài danh mục thì PTI tự thu thập và tự chịu chi phí.`,
  s: 'TT 67/2023/TT-BTC ngày 02/11/2023 – Điều 12, 16, 17, 18, 19, 25, 26; NĐ 46/2023/NĐ-CP ngày 01/07/2023 – Điều 1, 2, 4, 6', r: ['pl-vanban', 'pl-lkdbh', 'gd-thanhtoanphi', 'qt-taituc'] }
);

/* ─── 13. TÌNH HUỐNG THỰC TẾ (sổ tay thực hành — tham khảo, v: 0) ─── */
TL_KB.push(
{ id: 'th-tiepnhan', g: 'tinhhuong',
  q: 'Khách báo tổn thất chậm, xe đã sửa hoặc đã tháo rã trước giám định thì xử lý thế nào?',
  k: ['báo chậm', 'báo tổn thất muộn', 'xe đã sửa trước giám định', 'tháo rã trước giám định', 'tai nạn trước ngày hiệu lực', 'hết hạn bảo hiểm', 'chưa giám định đã sửa'],
  a: `|Tình huống|Kiểm tra|Hướng xử lý|
|Báo tổn thất chậm|Thời gian báo · lý do chậm · ảnh/video · lịch sử sửa chữa · nhân chứng · khả năng kiểm chứng hiện trường|Vẫn tiếp nhận và giám định. **Không tự động từ chối chỉ vì báo chậm** — đối chiếu nghĩa vụ thông báo trong HĐBH và xét mức giảm trừ|
|Xe đã sửa trước khi giám định|Ảnh/video trước sửa · phụ tùng tháo ra · hoá đơn, báo giá · hồ sơ và lịch sửa của garage|Chỉ xem xét phần **có đủ căn cứ** về nguyên nhân và mức độ; ghi rõ phần không thể xác minh|
|Chủ xe tự tháo rã xe|Ai tháo, thời điểm, mục đích · ảnh trước tháo · phụ tùng đã tháo|Ghi nhận hiện trạng sau tháo rã, yêu cầu garage **bảo quản phụ tùng**. Không mặc nhiên chấp nhận toàn bộ báo giá tháo rã|
|Tai nạn xảy ra **trước ngày hiệu lực**|Thời điểm sự kiện bảo hiểm thực tế so với thời điểm bắt đầu trách nhiệm bảo hiểm|Tổn thất trước khi trách nhiệm phát sinh → **không thuộc trách nhiệm** của hợp đồng đó|
|Xe đã hết hạn bảo hiểm|Thời điểm tai nạn · thời điểm hết hạn · thời điểm cấp/tái tục|Xác định bằng chứng cứ, **không căn cứ đơn thuần vào thời điểm khách khai báo**|
!! Nguyên tắc chung: không kết luận chỉ từ lời khai hoặc báo giá — luôn đối chiếu hợp đồng, chứng cứ vật chất, nguyên nhân và quy định áp dụng.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 01) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['ht-xacminh', 'dg-giamtru', 'gd-tailieu'], v: 0 },

{ id: 'th-nguyennhan', g: 'tinhhuong',
  q: 'Xác định nguyên nhân tai nạn: xe đâm đuôi, mất lái, nổ lốp, cây đổ vào xe?',
  k: ['nguyên nhân tai nạn', 'đâm đuôi xe trước', 'mất lái', 'nổ lốp', 'cây đổ vào xe', 'tự đâm vào tường', 'dựng lại diễn biến', 'quan hệ nhân quả'],
  a: `|Tình huống|Phải làm rõ|
|Xe đâm vào xe phía trước|Khoảng cách · tốc độ · hướng di chuyển · trạng thái dừng/chạy của xe trước · tín hiệu chuyển hướng · camera · dấu vết phanh · vị trí va chạm · lời khai · hồ sơ CQCN. **Không mặc nhiên kết luận xe sau sai hoàn toàn** chỉ dựa vào vị trí va chạm|
|Xe tự đâm vào tường, vật cố định|Có thuộc rủi ro đâm va/lật/đổ trong HĐBH không; có thuộc loại trừ không; **loại trừ khả năng cố ý** gây thiệt hại|
|Xe mất lái|Nguyên nhân mất lái: lỗi kỹ thuật · nổ lốp · mặt đường · người điều khiển · tác động của phương tiện khác. **Không kết luận "tai nạn giao thông" chỉ từ lời khai lái xe**|
|Nổ lốp gây tai nạn|Giám định lốp: tuổi lốp · độ mòn · áp suất · dấu va đập · vết thủng · tình trạng thành lốp. Sau đó mới đánh giá **quan hệ nhân quả** giữa lốp và tai nạn|
|Cây đổ vào xe đang chạy|Xác định **rủi ro thực tế gây tổn thất** và đối chiếu phạm vi bảo hiểm, không chỉ dựa vào việc xe có đang tham gia giao thông hay không|
|Một xe có **hai vùng va chạm** trước và sau|Không mặc nhiên coi cả hai thuộc cùng một tai nạn — xác định diễn biến và thời điểm từng va chạm|
|Tai nạn liên hoàn A → B → C|Dựng lại diễn biến và gán tổn thất của từng xe tương ứng **từng lần tác động**|`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 03) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['nt3-nguyentac', 'nt3-damduoi', 'ht-kiemtra'], v: 0 },

{ id: 'th-ngapnuoc', g: 'tinhhuong',
  q: 'Tình huống xe ngập nước, thuỷ kích cần kiểm tra và kết luận thế nào?',
  k: ['ngập nước tình huống', 'thủy kích', 'thuỷ kích', 'cố đề máy', 'khởi động lại khi ngập', 'ngập đến nóc', 'cứu hộ kéo ra khỏi vùng ngập', 'dầu động cơ có nước', 'tháo lọc gió'],
  a: `|Tình huống|Kiểm tra|Kết luận|
|Xe đi vào vùng ngập rồi chết máy|Mức nước ngập · vị trí xe chết máy · **có tiếp tục đề máy không** · dấu nước khoang máy · tháo lọc gió · dầu động cơ có nước không · hư hỏng có phù hợp diễn biến không|Xác định ngập nước đơn thuần hay **thuỷ kích do khởi động lại**|
|Chủ xe **cố đề máy nhiều lần** sau khi ngập|Hành vi đề máy có làm **phát sinh hoặc gia tăng** thiệt hại không|Đối chiếu điều khoản về **nghĩa vụ hạn chế tổn thất** và loại trừ liên quan|
|Xe bị thuỷ kích|Quy tắc/điều khoản cụ thể của hồ sơ · nguyên nhân · diễn biến tổn thất|**Không mặc nhiên từ chối**; PTI có ĐKBS về ngập nước (xem BS06)|
|Xe ngập đến nóc nhưng động cơ vẫn hoạt động|ECU · giắc điện · mô tơ điện · hộp số · dầu máy · dầu hộp số · hệ thống điện · dấu nước trong cabin|Kiểm tra thực tế, **không chỉ dựa vào lời khai**|
|Đã cứu hộ kéo ra khỏi vùng ngập rồi mới báo|Quá trình cứu hộ · vị trí ban đầu · mực nước · tình trạng xe trước/sau cứu hộ|Vẫn phải giám định; ghi nhận chứng cứ có được|
- Tại hiện trường: ghi nhận **mực nước, thời điểm, vị trí đậu xe**; chụp vết nước trên thân xe, nội thất, khoang máy; **nhắc chủ xe không khởi động lại**, kéo xe về gara.
- Xe có ECU, hộp số, hệ thống điện: đánh giá **khả năng phục hồi** trước khi quyết định thay thế.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 04) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['gd-ngapnuoc', 'qt-bs06'], v: 0 },

{ id: 'th-chayno', g: 'tinhhuong',
  q: 'Xe cháy khi đang đỗ, cháy sau khi độ điện, cháy toàn bộ thì giám định thế nào?',
  k: ['cháy khi đang đỗ', 'cháy sau khi độ điện', 'độ thiết bị điện', 'điểm phát cháy', 'PCCC', 'cháy toàn bộ còn VIN', 'nguyên nhân cháy'],
  a: `|Tình huống|Kiểm tra|Kết luận|
|Xe cháy khi đang đỗ|Điểm phát cháy · nguyên nhân · hệ thống điện · nhiên liệu · nguồn nhiệt bên ngoài · lịch sử sửa chữa · can thiệp hệ thống điện · camera|Đề nghị biên bản của **công an PCCC** hoặc cơ quan chức năng về nguyên nhân cháy|
|Xe cháy sau khi **độ thêm thiết bị điện**|Mối **quan hệ nhân quả** giữa thiết bị độ và đám cháy|**Không phải cứ "độ điện" là loại trừ toàn bộ** — phải chứng minh nhân quả|
|Xe cháy toàn bộ, còn xác định được VIN|VIN · số máy · đăng ký · ảnh trước cháy · hồ sơ bảo hiểm · hiện trường · kết luận nguyên nhân cháy|Đủ căn cứ xác định đối tượng bảo hiểm để xét tổn thất toàn bộ|
- Phân biệt: cháy do **sự cố điện** · cháy do **va chạm** · cháy do **tự huỷ hoặc cố ý**.
- Chụp ảnh **vết cháy và điểm khởi phát**; thu thập hồ sơ bảo dưỡng gần nhất và phụ kiện độ thêm có liên quan.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 05) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['gd-chay', 'dg-toanbo'], v: 0 },

{ id: 'th-suachua', g: 'tinhhuong',
  q: 'Khi nào sửa chữa, khi nào thay mới? Garage đề nghị thay cả cụm thì sao?',
  k: ['sửa hay thay', 'thay mới phụ tùng', 'móp có phải thay không', 'cản trước xước nhẹ', 'đèn pha nứt', 'túi khí bung', 'cảm biến ADAS', 'thay cả cụm', 'gãy ngàm cản'],
  a: `Nguyên tắc: **ưu tiên sửa chữa** khi khả thi về kỹ thuật, an toàn và chi phí hợp lý so với thay mới. Chỉ thay mới khi **không thể sửa**, **sửa không bảo đảm kỹ thuật**, **ảnh hưởng an toàn** (khung xương, hệ thống lái, phanh, túi khí), **chi phí sửa gần bằng thay mới**, hoặc hợp đồng/điều khoản quy định khác.
|Tình huống|Kiểm tra|
|Chi tiết bị móp|Khả năng nắn, gò, phục hồi đạt yêu cầu kỹ thuật|
|Cản trước xước nhẹ, garage đề nghị thay cả cản|Đánh giá khả năng sửa chữa thực tế — **không mặc nhiên chấp nhận báo giá garage**|
|Xước cản nhựa, gãy ngàm cản|Biến dạng · khả năng phục hồi · khả năng sửa ngàm và độ chắc chắn. Thay khi không bảo đảm kỹ thuật|
|Đèn pha nứt nhưng vẫn sáng|Vị trí và mức độ nứt · khả năng chống nước · kết cấu · chức năng · hướng dẫn của nhà sản xuất · điều khoản bảo hiểm|
|Túi khí bung|**Không kết luận theo "combo" cố định** — kiểm tra hệ thống SRS, xác định bộ phận thực tế bị kích hoạt/hư hỏng|
|Va chạm nhẹ, garage báo thay cảm biến ADAS|Vị trí cảm biến · mã lỗi · dữ liệu chẩn đoán · giá trị hiệu chuẩn · hướng dẫn sửa chữa của hãng · khả năng ảnh hưởng sau va chạm|
|Garage yêu cầu thay cả cụm|Kiểm tra khả năng sửa hoặc thay **từng chi tiết** trong cụm|
- Ghi rõ **lý do từng hạng mục** trong biên bản giám định để có căn cứ duyệt giá.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 06) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['gd-bienban', 'dg-bangke', 'dg-chaogia'], v: 0 },

{ id: 'th-phutung', g: 'tinhhuong',
  q: 'Chủ xe đòi phụ tùng chính hãng, xe cũ đòi thay mới toàn bộ thì trả lời thế nào?',
  k: ['phụ tùng chính hãng', 'OEM', 'aftermarket', 'phụ tùng tương đương', 'xe 8 năm', 'giá phụ tùng mới', 'garage báo giá cao', 'đối chiếu giá thị trường'],
  a: `|Tình huống|Căn cứ trả lời|
|Chủ xe yêu cầu **tất cả phụ tùng chính hãng**|Không trả lời "có/không" chung chung — căn cứ HĐBH, quy tắc, thoả thuận về phụ tùng, tình trạng xe, chính sách doanh nghiệp, khả năng cung ứng, nguyên tắc bồi thường. Ở PTI: xem **BS05** (sửa chữa chính hãng) và **BS26** (phụ tùng chính hãng)|
|Phụ tùng thay thế có được tính **100% giá mới**|Căn cứ phương thức tính bồi thường và điều khoản khấu hao — **không mặc nhiên lấy giá niêm yết phụ tùng mới** làm số tiền bồi thường. Xem **BS02** (thay thế mới)|
|Xe đã dùng 8 năm, chủ xe đòi thay mới toàn bộ|Kiểm tra điều khoản về **khấu hao/thay mới** và nguyên tắc bồi thường — đây là điểm rất dễ tranh chấp, phải giải thích trước khi sửa|
|Garage báo giá cao hơn thị trường|Đối chiếu **giá phụ tùng · công sửa chữa · vật tư · thời gian sửa · chính sách hãng · nguồn báo giá · giá tại khu vực**. **Không chỉ lấy một báo giá duy nhất**|
|Xe còn trong thời gian bảo hành|Thường được thay chính hãng theo điều khoản; xe cũ có thể thoả thuận phụ tùng tương đương|
- Phụ tùng thay thế phải có **hoá đơn, chứng từ nguồn gốc**.
- Ghi nhận chênh lệch giá và cách thống nhất với garage, chủ xe **trước khi sửa chữa**.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 06) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['qt-bs02', 'qt-bs05', 'dg-khauhao', 'dg-chaogia'], v: 0 },

{ id: 'th-dongson', g: 'tinhhuong',
  q: 'Sơn chuyển vùng, sơn cả bên xe, vật tư phụ tính thế nào?',
  k: ['đồng sơn', 'sơn chuyển vùng', 'sơn cả bên xe', 'màu xe khó pha', 'sơn dặm', 'vật tư phụ', 'nóc xe xước nhẹ', 'đánh bóng', 'tính trùng công sơn'],
  a: `|Tình huống|Kiểm tra|Kết luận|
|Một cánh cửa móp nhẹ, garage đề nghị **sơn cả bên xe**|Vùng ảnh hưởng thực tế · kỹ thuật sơn · yêu cầu chuyển màu|Chỉ chấp nhận sơn chuyển vùng khi **có căn cứ kỹ thuật/thẩm mỹ**, không mặc nhiên sơn toàn bên|
|Garage tính **sơn toàn bộ xe** vì màu khó pha|Yêu cầu kỹ thuật thực tế · khả năng pha màu · phương án chuyển vùng|Chọn phương án kỹ thuật phù hợp, không mặc nhiên chấp nhận|
|Sơn dặm không đồng màu|Khả năng pha màu và kỹ thuật chuyển vùng|Xác định lại phương án sơn|
|Nóc xe xước nhẹ|Độ sâu vết xước · khả năng **đánh bóng hoặc sơn cục bộ**|Không thay mới nếu chỉ cần xử lý bề mặt|
|Thay nắp capo cần sơn|Mã phụ tùng · chi phí sơn hợp lý|**Không tính trùng công sơn** (phụ tùng đã sơn sẵn)|
|Chi phí **vật tư phụ** tính riêng|Có thuộc phương án sửa chữa và được HĐBH/quy tắc, quy trình cho phép không|Có thể chấp nhận nhưng phải **tránh tính trùng** với đơn giá công sơn/sửa chữa|
- Kiểm tra **định mức công** (giờ công sửa chữa, sơn theo diện tích và loại sơn), loại bỏ hạng mục trùng lặp hoặc không liên quan đến vụ tổn thất.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 07) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['dg-bangke', 'dg-chaogia'], v: 0 },

{ id: 'th-tonthatcu', g: 'tinhhuong',
  q: 'Tổn thất cũ nằm cạnh tổn thất mới, tổn thất ẩn sau khi tháo thì xử lý ra sao?',
  k: ['tổn thất cũ', 'tổn thất ẩn', 'vết xước mới đè vết cũ', 'móp cũ cạnh vết mới', 'phát sinh sau khi tháo cản', 'giám định bổ sung', 'hạng mục phát sinh'],
  a: `|Tình huống|Cách xử lý|
|Vết móp cũ ngay cạnh vết tai nạn mới|**Phân tách** tổn thất mới ↔ tổn thất đã tồn tại trước tai nạn; chỉ đưa phần phù hợp với sự kiện bảo hiểm vào phạm vi xem xét|
|Vết xước mới **đè lên** vết xước cũ|Phân tích: màu · độ sâu · hướng · lớp sơn · biến dạng · dấu ma sát · vị trí tương quan. Nếu cần, dùng phương pháp giám định/chẩn đoán chuyên môn|
|Phát hiện **tổn thất ẩn** sau khi tháo cản|Có thể giám định bổ sung, nhưng phải chứng minh tổn thất ẩn: **nằm trong vùng va chạm · phù hợp lực va chạm · chưa tồn tại trước đó · có quan hệ nhân quả** với sự kiện bảo hiểm|
|Garage sửa thêm nhiều hạng mục sau giám định lần đầu|Lập **hồ sơ bổ sung**: hạng mục do tai nạn → có căn cứ bảo hiểm; hạng mục phát sinh khác → **không mặc nhiên** đưa vào hồ sơ|
|Garage tháo xe **không thông báo** giám định viên|Yêu cầu bảo quản phụ tùng và hình ảnh quá trình tháo rã; ghi rõ phần **không đủ căn cứ** xác định nguyên nhân/mức độ|
- Garage phải **báo ngay** khi phát sinh; GĐV kiểm tra lại và **chụp ảnh trước khi sửa tiếp**; lập biên bản giám định bổ sung. **Không chấp nhận hạng mục phát sinh đã sửa xong mà chưa được xác nhận.**`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 08) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['ct-giamsat', 'gd-bienban'], v: 0 },

{ id: 'th-tndsbb', g: 'tinhhuong',
  q: 'Tình huống hay gặp khi giải quyết TNDS bắt buộc của chủ xe?',
  k: ['tình huống TNDS', 'chưa có biên bản công an', 'hồ sơ TNDS thiếu giấy tờ', 'nhiều bên cùng có lỗi', 'hành khách trên xe', 'xe kinh doanh vận tải TNDS', 'quỹ bảo hiểm xe cơ giới'],
  a: `|Tình huống|Hướng xử lý|
|**Chưa có biên bản công an**, có giám định được không|Vẫn nên giám định thiệt hại ngay để không bỏ lỡ hiện trường, nhưng **ghi rõ trong biên bản** rằng nguyên nhân và lỗi **chưa được xác định**. Vụ có người chết hoặc bị thương: **bắt buộc** phối hợp và lấy kết luận/biên bản của công an trước khi chốt số tiền|
|Hồ sơ thiếu giấy tờ|Thông báo **bằng văn bản** danh mục còn thiếu, nêu rõ hạn bổ sung, **lưu bằng chứng ngày gửi**. Thời hạn giải quyết tính từ khi nhận **đủ hồ sơ hợp lệ**. Không từ chối chỉ vì thiếu giấy tờ khi có thể xác minh bằng nguồn khác đáng tin cậy|
|Tai nạn liên hoàn, **nhiều bên cùng có lỗi**|Xác định tỷ lệ lỗi theo biên bản công an; mỗi DNBH chỉ bồi thường phần thuộc trách nhiệm của xe mình bảo hiểm. Vật chất xe vẫn bồi thường cho xe mình rồi **thế quyền** đòi bên có lỗi. Phối hợp với DNBH khác để **tránh bồi thường trùng**|
|Xe **kinh doanh vận tải** (taxi, xe công nghệ, chở khách, chở hàng)|Phải đúng **mục đích sử dụng** ghi trên GCNBH — xe cá nhân chạy dịch vụ không khai báo có thể bị từ chối vì **thay đổi rủi ro**. Kiểm tra phù hiệu, hợp đồng vận chuyển, số khách thực tế, tải trọng thực tế|
|Tạm ứng rồi mới xác định thuộc loại trừ|Khoản đã tạm ứng được **Quỹ bảo hiểm xe cơ giới hoàn trả** cho doanh nghiệp bảo hiểm|
!! Mức trách nhiệm, phạm vi, loại trừ và hồ sơ TNDS bắt buộc phải lấy theo **NĐ 67/2023/NĐ-CP** (từ 01/07/2026 dùng thuật ngữ "bên thứ ba" theo NĐ 220/2026) — không lấy quy định của bảo hiểm vật chất xe áp sang.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 09) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI; mức và thủ tục theo NĐ 67/2023', r: ['td-mtn', 'td-hoso', 'td-hoanung', 'pl-nd220'], v: 0 },

{ id: 'th-nguoilai', g: 'tinhhuong',
  q: 'Nồng độ cồn, ma tuý, không có hoặc hết hạn GPLX thì kết luận thế nào?',
  k: ['nồng độ cồn tình huống', 'ma túy', 'chất kích thích', 'không có GPLX', 'GPLX hết hạn', 'bằng không phù hợp hạng xe', 'vi phạm người lái'],
  a: `Đây là nhóm **phải tách rõ bảo hiểm vật chất xe và TNDS bắt buộc** — không trả lời chung cho cả hai.
|Tình huống|Vật chất xe (tự nguyện)|TNDS bắt buộc|
|Lái xe có **nồng độ cồn**|Phần lớn quy tắc loại trừ khi nồng độ cồn vượt mức luật định và liên quan đến tai nạn; cần **biên bản công an hoặc kết quả đo** làm căn cứ. Kiểm tra đúng điều khoản loại trừ của **hợp đồng đang giải quyết**|Không tự suy ra loại trừ — phải kiểm tra danh mục loại trừ hiện hành tại NĐ 67/2023|
|Lái xe **không có GPLX**|Xác định loại xe · GPLX cần thiết · người lái có GPLX không · GPLX có phù hợp hạng xe · còn hiệu lực · tình trạng pháp lý **tại thời điểm tai nạn**|Thuộc nhóm loại trừ của NĐ 67/2023 — đối chiếu điều khoản trước khi từ chối|
|**GPLX hết hạn**|Kiểm tra riêng điều khoản bảo hiểm và quy định pháp luật **áp dụng tại thời điểm tai nạn**|Như trên|
- Ở PTI, lái xe **không chịu xét nghiệm** nồng độ cồn/chất kích thích theo yêu cầu thuộc nhóm bị **giảm trừ 50–100%** theo Quy tắc VCX (Điều 12).
!! Không kết luận loại trừ chỉ từ lời khai hoặc từ việc có nồng độ cồn — phải có **căn cứ đo/biên bản** và phải xét **quan hệ với tai nạn** theo đúng câu chữ điều khoản.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 10) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['qt-con', 'gd-gplx', 'td-loaitru', 'dg-giamtru'], v: 0 },

{ id: 'th-matcap', g: 'tinhhuong',
  q: 'Xe bị mất trộm, mất cả hai chìa khoá, tổn thất toàn bộ thì xử lý thế nào?',
  k: ['mất trộm xe', 'mất cắp ô tô', 'mất hai chìa khóa', 'tổn thất toàn bộ khi nào', 'chi phí sửa gần bằng giá trị xe', 'giá trị thu hồi', '75% giá trị xe', 'xác xe'],
  a: `|Tình huống|Kiểm tra|Kết luận|
|Xe bị mất trộm|Thời điểm mất · chìa khoá · hệ thống khoá · camera · GPS · trình báo công an · giấy tờ xe · lịch sử sử dụng xe|Chỉ bồi thường khi HĐBH có rủi ro **mất cắp/mất toàn bộ** phù hợp|
|Chủ xe mất **cả hai chìa khoá**|Nguyên nhân mất xe và khả năng kiểm soát chìa khoá|**Không vì mất chìa khoá mà kết luận gian lận**, nhưng là tình tiết cần xác minh|
|Khi nào là **tổn thất toàn bộ**|Căn cứ điều khoản HĐBH/quy tắc và phương pháp xác định tổn thất toàn bộ của doanh nghiệp|**Không dùng một tỷ lệ cố định cho mọi hợp đồng** — nhiều nơi dùng mức 75% giá trị xe nhưng phải đối chiếu từng hợp đồng|
|Chi phí sửa gần bằng giá trị xe|So sánh **chi phí sửa chữa hợp lý** với giá trị bảo hiểm/giá trị thị trường/giới hạn trách nhiệm theo hợp đồng|Áp dụng đúng quy tắc bảo hiểm đang áp dụng cho hồ sơ|
- Hồ sơ mất cắp/mất cướp: **giấy trình báo, giấy xác nhận tiếp nhận tin báo của công an**, thông báo xe chưa tìm thấy sau thời hạn điều tra; chìa khoá, đăng ký xe bản gốc, giấy tờ chứng minh quyền sở hữu.
- Bồi thường toàn bộ: chủ xe **chuyển quyền sở hữu** (hoặc quyền đòi lại) cho DNBH; xác xe thuộc DNBH sau khi bồi thường, phải **lập biên bản bàn giao và định giá xác**.
- Cẩn trọng với vụ mất xe do **người quen, xe cho thuê**, hoặc xảy ra **gần thời điểm mở hợp đồng**.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 11) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['dg-toanbo', 'ct-toanbo', 'sb-thanhly', 'nt3-guixe'], v: 0 },

{ id: 'th-gianlan', g: 'tinhhuong',
  q: 'Dấu hiệu nghi vấn trục lợi bảo hiểm và cách xử lý khi nghi ngờ?',
  k: ['dấu hiệu gian lận', 'trục lợi bảo hiểm', 'nghi ngờ gian lận', 'ảnh chỉnh sửa', 'dấu hiệu chỉnh sửa', 'ảnh photoshop', 'metadata ảnh', 'lời khai thay đổi', 'biển số không khớp', 'VIN không rõ', 'tai nạn ngay sau khi mua bảo hiểm'],
  a: `**Dấu hiệu cần nghi ngờ:**
- Tai nạn xảy ra **ngay sau khi mở hợp đồng** hoặc ngay trước khi hợp đồng hết hạn.
- Vết hư hỏng **không khớp lời khai**: góc va chạm, chiều lực, vận tốc, thời điểm, chiều cao va chạm.
- Vết cũ cộng vết mới; hạng mục cũ được đưa vào đòi bồi thường.
- **Nhiều vụ liên tiếp** cùng một xe, một garage hoặc một người lái.
- Chủ xe thiếu hợp tác, không cho chụp ảnh, không cung cấp hồ sơ; báo giá phóng đại với chi tiết không liên quan.
|Tình huống|Cách xử lý|
|Khai một vụ nhưng camera/dấu vết cho thấy hai vụ|Đối chiếu camera · GPS · hình ảnh · nhân chứng · hồ sơ công an · lịch sử sửa chữa · dấu vết trên xe. **Tách từng sự kiện**|
|Hai bên khai giống nhau nhưng hiện trường không phù hợp|Ưu tiên **dấu vết vật chất và chứng cứ độc lập** thay vì lời khai|
|Ảnh có dấu hiệu chỉnh sửa|Bảo lưu chứng cứ gốc, kiểm tra **metadata**, yêu cầu **file/video gốc** và xác minh nguồn ảnh. Không kết luận chỉ từ ảnh nén|
|Biển số trong ảnh không khớp / VIN không rõ|Kiểm tra **VIN và vị trí VIN**, đối chiếu hồ sơ xe. **Không xác định đối tượng bảo hiểm chỉ từ biển số**|
|Lời khai thay đổi nhiều lần|Lập **bảng diễn biến từng phiên bản** lời khai và đối chiếu chứng cứ|
**Khi nghi ngờ:** không kết luận vội; thu thập thêm chứng cứ (camera, dữ liệu xe, nhân chứng, lịch sử bảo dưỡng); ghi chép **khách quan** trong biên bản; báo cáo cấp quản lý và bộ phận kiểm soát nội bộ theo quy trình; có thể **tạm dừng thanh toán phần nghi vấn** đến khi xác minh xong nhưng vẫn **thông báo khách hàng bằng văn bản**.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 12) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['gd-trucloi', 'sb-saipham', 'th-tonthatcu'], v: 0 },

{ id: 'th-garage', g: 'tinhhuong',
  q: 'Garage không thống nhất giá, sửa trước khi duyệt, không trả phụ tùng cũ thì sao?',
  k: ['garage không thống nhất giá', 'garage sửa trước khi duyệt', 'garage không cho giám định bổ sung', 'garage không trả phụ tùng cũ', 'chủ xe muốn sửa tại hãng', 'chỉ định garage', 'xe sửa nhiều nơi'],
  a: `|Tình huống|Cách xử lý|
|Garage và giám định **không thống nhất giá**|**Tách từng hạng mục** và nêu căn cứ giá cho mỗi hạng mục — thống nhất bằng căn cứ, không bằng cảm tính|
|Garage yêu cầu **thay cả cụm**|Kiểm tra khả năng sửa hoặc thay từng chi tiết; chỉ chấp nhận phương án hợp lý|
|Garage yêu cầu **phụ tùng chính hãng**|Đối chiếu điều khoản HĐBH và tình trạng xe — không mặc nhiên đáp ứng nếu hợp đồng không quy định|
|Garage **không cho giám định bổ sung**|**Lập biên bản** và bảo lưu quyền xác minh; không kết luận với phần không tiếp cận được|
|Garage **sửa trước khi duyệt giá**|Xác định ai phê duyệt và phạm vi đã thống nhất; chỉ xem xét phần **có căn cứ**|
|Garage **không trả phụ tùng cũ**|Yêu cầu bảo quản theo quy trình thu hồi — thiếu phụ tùng làm **giảm khả năng kiểm chứng** và có thể bị trừ giá trị thu hồi|
|Chủ xe muốn sửa **tại hãng**, PTI chỉ định garage khác|Kiểm tra **quyền lựa chọn cơ sở sửa chữa** theo hợp đồng/quy tắc và thoả thuận dịch vụ (xem BS05)|
|Xe sửa **nhiều nơi**|Tách hạng mục và thời điểm từng nơi sửa để **tránh thanh toán trùng**|
- Phụ tùng thay ra còn giá trị (lốp, ắc quy, phiên cùng…) có thể **thu hồi hoặc trừ giá trị** theo quy tắc bảo hiểm.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 13) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['ct-thuhoi', 'ct-giamsat', 'qt-bs05', 'dg-hopdongsc'], v: 0 },

{ id: 'th-xedien', g: 'tinhhuong',
  q: 'Giám định xe điện, xe hybrid và hệ thống ADAS cần lưu ý gì?',
  k: ['xe điện tình huống', 'EV', 'hybrid', 'ADAS', 'hệ thống cao áp', 'báo lỗi cao áp', 'lỗi HV', 'HV', 'cách điện cao áp', 'BMS', 'pin pack', 'cổng sạc', 'EVSE', 'inverter', 'hiệu chuẩn cảm biến', 'cháy khi sạc'],
  a: `**An toàn cao áp (HV) là ưu tiên số một** — không tự thao tác nếu chưa được huấn luyện.
|Tình huống|Kiểm tra|Kết luận|
|EV va chạm nhẹ nhưng **báo lỗi HV**|Scan mã lỗi và kiểm tra **cách điện hệ thống cao áp**|**Không đánh giá chỉ bằng ngoại quan**|
|EV bị **móp pin**|Vỏ pack · module · **BMS**|Cần kỹ thuật viên HV đủ năng lực đánh giá|
|**EV ngập nước**|**Cô lập cao áp**, không vận hành lại khi chưa kiểm tra|An toàn cao áp trước, giám định sau|
|EV bị đâm **cổng sạc**|Cổng sạc · khoá · dây · bộ sạc|**Tách tổn thất điện và tổn thất thân vỏ**|
|**EV cháy khi sạc**|Xác định nguồn cháy: **xe · EVSE (bộ sạc) · hay nguồn điện**|Cần chuyên môn về cháy điện, phối hợp cơ quan chức năng|
|**Hybrid** va chạm đầu xe|**Inverter** · hệ thống làm mát · cảm biến|Không chỉ kiểm tra động cơ xăng|
|Hybrid ngập nước|Kiểm tra **cả hệ thống HV và động cơ đốt trong**|Tách các nguồn tổn thất|
|Cảm biến/camera **ADAS** sau va chạm|Vị trí cảm biến · mã lỗi · dữ liệu chẩn đoán · **giá trị hiệu chuẩn** · hướng dẫn sửa chữa của hãng|Chi phí **hiệu chuẩn (calibration)** phải có căn cứ kỹ thuật, không tính tuỳ tiện|
!! Tại PTI, **pin gắn trên xe điện** đã được đưa vào bảo hiểm mặc định trong đơn gốc theo Quy tắc VCX QĐ 109/2025 (khoản 15.15) và **không còn khấu trừ 10%** riêng cho tổn thất pin.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 14) — sổ tay thực hành, không phải văn bản PTI; phần pin xe điện theo Quy tắc VCX QĐ 109/QĐ-PTI ngày 23/09/2025', r: ['gd-xedien', 'qt-thaydoi'], v: 0 },

{ id: 'th-ketluan', g: 'tinhhuong',
  q: 'Chưa đủ chứng cứ, khách không đồng ý kết luận, đòi tiền mặt thay sửa chữa thì sao?',
  k: ['chưa đủ chứng cứ', 'khách không đồng ý kết luận', 'đòi tiền mặt thay sửa chữa', 'tự sửa tại nhà', 'bên thứ ba không có chứng từ', 'giám định lại', 'tranh chấp kết luận', 'khởi kiện'],
  a: `|Tình huống|Cách xử lý|
|**Chưa đủ chứng cứ** để kết luận|Chuyển trạng thái **cần xác minh bổ sung**, nêu rõ chứng cứ còn thiếu. **Không kết luận có/không bồi thường khi dữ liệu chưa đủ**|
|Khách hàng **không đồng ý kết luận**|Giải thích **căn cứ từng hạng mục bằng văn bản**, hướng dẫn quy trình khiếu nại/giám định lại theo hợp đồng. Giữ lập trường dựa trên chứng cứ|
|Garage không đồng ý phương án sửa|Trao đổi **trên từng hạng mục kỹ thuật**, không giải quyết bằng cảm tính|
|Bên thứ ba đòi chi phí **không có chứng từ**|Yêu cầu chứng cứ phù hợp hoặc áp dụng **phương pháp định giá hợp lý**. Không mặc nhiên chấp nhận|
|Chủ xe đòi **tiền mặt thay sửa chữa**|Kiểm tra **hình thức bồi thường theo hợp đồng** — GĐV không tự ý đổi hình thức bồi thường|
|Chủ xe **tự sửa tại nhà**|Xác định chi phí thực tế và khả năng chứng minh; chỉ xem xét theo phương thức bồi thường được quy định|
**Khi từ chối bồi thường:** thông báo **bằng văn bản**, nêu rõ lý do và **điều khoản áp dụng**; không vượt thời hạn trả lời theo quy định; có ý kiến của bộ phận pháp chế hoặc cấp quản lý với vụ giá trị lớn hoặc đang tranh cãi.
**Tranh chấp:** thương lượng, hoà giải; không đạt thì bên bị thiệt hại có thể **khởi kiện tại toà án** hoặc dùng trọng tài theo thoả thuận. Với **giám định độc lập**, hai bên thống nhất đơn vị và chi phí **trước khi thực hiện**.`,
  s: 'Bộ Q&A 300 tình huống giám định – bồi thường XCG (nhóm 15) và tài liệu Nhóm tình huống thực tế GĐBT bảo hiểm xe cơ giới — sổ tay thực hành, không phải văn bản PTI', r: ['dg-tuchoi', 'sb-khieunai', 'gd-thuegd', 'dg-chuaxd'], v: 0 }
);
/* @@KB-END@@ */
