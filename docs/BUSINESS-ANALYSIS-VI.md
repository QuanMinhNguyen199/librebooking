# Phân tích nghiệp vụ — THG Resource

Tài liệu này mô tả cách hệ thống nên hoạt động ở mức dễ hiểu. Các tên kỹ thuật
của LibreBooking chỉ được nhắc khi cần làm rõ cách kết nối backend.

## 1. THG đang giải quyết vấn đề gì?

Nhân viên cần một nơi để biết phòng nào trống, trong phòng có thiết bị gì và đặt
phòng mà không phải hỏi nhiều người. Người quản lý cần nhìn được tình hình trong
phạm vi mình phụ trách. Người quản trị cần kiểm soát phòng, lịch bảo trì và các
yêu cầu phải duyệt.

Vì vậy sản phẩm không chỉ là một Calendar. Nó gồm ba việc liên quan với nhau:

- Xem lịch để biết thời gian trống.
- Xem phòng để biết nơi nào phù hợp.
- Đặt tài nguyên để giữ chỗ trong khoảng thời gian đã chọn.

## 2. LibreBooking đóng vai trò gì?

THG tái sử dụng API, data model và cách mapping nghiệp vụ của LibreBooking cho
tài nguyên, lịch trống, xung đột, đặt chỗ, phụ kiện và phê duyệt. Giao diện cũ
của LibreBooking không được sử dụng. Next.js là UI riêng theo phong cách
THEHEGEO và gọi API qua BFF/adapter, không truy cập database trực tiếp.

Lịch cá nhân, lịch công ty và ngày lễ Việt Nam cần được THG tự xây hoặc tích hợp
thêm. AI Usage và MCP không thuộc luồng đặt lịch cốt lõi nên được đưa ra khỏi
bản demo hiện tại.

## 3. Ai được làm gì?

### Nhân viên

Nhân viên xem lịch, xem thông tin phòng và đặt tài nguyên. Dashboard của họ chỉ
nên ưu tiên thông báo, nhắc nhở và trạng thái yêu cầu liên quan đến chính họ.

### Lead / Manager

Manager vẫn là một người dùng cá nhân nhưng có thêm quyền trong team hoặc phòng
ban mình phụ trách. Họ chỉ được xem nhân sự, mức sử dụng và chi phí vận hành
trong phạm vi được cấp. Họ không mặc nhiên được xem số liệu toàn công ty.

### Admin tài nguyên

Admin tài nguyên quản lý phòng, thiết bị, lịch bảo trì và yêu cầu đặt chỗ của
những tài nguyên được giao. Dashboard của họ hiển thị tình trạng phòng, thiết bị
cần xử lý và chi phí vận hành chi tiết trong phạm vi phụ trách. Họ không quản
trị toàn bộ nhân sự.

### Admin hệ thống

Admin hệ thống quản lý tài khoản, nhóm và quyền truy cập. Đây là vai trò kỹ
thuật, không đồng nghĩa với quyền xem mọi dữ liệu kinh doanh.

### CEO / Lãnh đạo

Lãnh đạo xem số liệu tổng hợp toàn công ty như tỷ lệ phòng khả dụng, mức sử
dụng, chi phí vận hành và chi phí bảo trì. Họ không cần xem danh sách sự cố hoặc
xử lý các yêu cầu đặt phòng hằng ngày.

## 4. Dashboard nên khác nhau theo vai trò như thế nào?

Dashboard không phải nơi gom tất cả chức năng. Nó chỉ nên trả lời những câu hỏi
quan trọng nhất của người đang đăng nhập.

| Vai trò | Dashboard cần trả lời |
|---|---|
| Nhân viên | Hôm nay tôi có lịch gì, yêu cầu nào đang chờ và có thông báo nào cần đọc? |
| Manager | Team đang dùng phòng ra sao, có yêu cầu nào cần duyệt và có dấu hiệu lãng phí không? |
| Admin tài nguyên | Phòng hoặc thiết bị nào cần xử lý ngay và chi phí phát sinh ở đâu? |
| Admin hệ thống | Tài khoản, quyền hoặc kết nối nào đang có lỗi? |
| CEO | Công ty đang sử dụng không gian hiệu quả không và chi phí có hợp lý không? |

### Vì sao CEO cần biết phòng dùng nhiều nhất và ít nhất?

Mục đích không phải để CEO theo dõi một phòng đang trống ở thời điểm hiện tại.
Các chỉ số này giúp đánh giá hiệu quả sử dụng tài sản và lên kế hoạch tái thiết
kế không gian:

- Phòng thường xuyên quá tải có thể cần mở rộng hoặc tách thêm phòng nhỏ.
- Phòng ít dùng có thể sai công năng, thiếu thiết bị hoặc nằm ở vị trí bất tiện.
- Thiết bị có thể được điều chuyển từ phòng ít dùng sang phòng có nhu cầu cao.
- Công ty có cơ sở để quyết định thuê thêm, thu hẹp hoặc cải tạo văn phòng.

Không nên xếp hạng chỉ bằng số lượt đặt. Chỉ số phù hợp hơn là:

```text
Mức sử dụng = thời gian thực tế sử dụng / tổng thời gian phòng khả dụng
```

Nếu chưa triển khai check-in/out thì hệ thống chỉ biết **thời gian đã đặt**, chưa
biết thời gian sử dụng thực tế. Dashboard phải ghi rõ nguồn tính để tránh quản lý
hiểu sai.

CEO nên xem tối thiểu: phòng dùng nhiều nhất, phòng dùng ít nhất, mức sử dụng,
chi phí trên mỗi giờ sử dụng, tỷ lệ hủy và tỷ lệ đặt nhưng không đến.

## 5. Calendar nên hiển thị gì?

Màn **Kiểm tra lịch** gộp nhiều nguồn trong một giao diện: lịch cá nhân, phòng,
công ty, nhóm và ngày lễ Việt Nam. Một đặt chỗ có thể liên quan nhiều nguồn
nhưng chỉ được hiển thị một lần.

Bản demo mặc định dùng tuần làm việc T2–T6 vì T7 và Chủ nhật là ngày linh hoạt.
Lịch riêng tư của người khác chỉ hiện “Bận”, không lộ tiêu đề hoặc nội dung.

## 6. Danh mục phòng và Đặt tài nguyên khác nhau thế nào?

**Danh mục phòng** dùng để tìm hiểu: phòng ở đâu, chứa bao nhiêu người, có tiện
nghi và thiết bị gì. Trang này không hiển thị Usage trên từng card vì thông tin
đó không giúp nhân viên chọn phòng.

**Đặt tài nguyên** là một quy trình riêng để tạo đặt chỗ. Người dùng có thể mở
nó từ sidebar, từ Calendar hoặc từ một card phòng. Dù bắt đầu ở đâu, frontend
vẫn dùng chung một form và một service gọi API.

Nếu đi từ card phòng, form tự điền phòng đã chọn và highlight nhẹ ô đó để người
dùng biết dữ liệu được mang sang ở đâu.

## 7. Khi nào một đặt chỗ cần được duyệt?

Việc duyệt phụ thuộc chính sách của tài nguyên, không phụ thuộc nó được nhìn thấy
trong lịch cá nhân, lịch nhóm hay lịch công ty.

- Tài nguyên không cần duyệt: xác nhận ngay nếu còn trống.
- Tài nguyên cần duyệt: tạo yêu cầu chờ Admin tài nguyên hoặc người được giao
  quyền xử lý.
- Trùng chính tài nguyên hoặc thời gian bảo trì: không cho đặt.
- Trùng lịch cá nhân hoặc nhóm: cảnh báo để người dùng tự quyết định.

## 8. Có cần trang “Đặt chỗ của tôi” riêng không?

Chưa cần cho bản demo. Đặt chỗ của người dùng đã xuất hiện trong **Kiểm tra
lịch** qua nguồn **Lịch của tôi**. Sau khi đặt thành công, hệ thống quay về
Calendar và highlight đúng kết quả vừa tạo.

Chỉ nên tách thành trang riêng khi sản phẩm hỗ trợ nhiều thao tác quản lý như
sửa, hủy, check-in/out, đặt định kỳ hoặc tra cứu lịch sử dài.

## 9. Highlight được dùng khi nào?

Highlight chỉ dùng để giúp người dùng tìm một kết quả cụ thể:

- Phòng được truyền sang form đặt tài nguyên.
- Đặt chỗ vừa tạo trên Calendar.
- Sự kiện được mở từ phần Nhắc nhở.

Không highlight khi người dùng chỉ chuyển tab hoặc bấm xem chi tiết. Hiệu ứng
phải nhẹ và tự biến mất; nó không thay thế trạng thái chọn lâu dài.

## 10. Luồng sử dụng chính

```text
Đăng nhập
→ Kiểm tra lịch hoặc chọn một phòng
→ Mở form Đặt tài nguyên
→ Chọn thời gian và thiết bị đi kèm
→ Hệ thống kiểm tra lịch trống
→ Xác nhận ngay hoặc gửi yêu cầu duyệt
→ Quay về Calendar và chỉ ra kết quả vừa tạo
```

## 11. Những việc cần chốt trước khi làm sản phẩm thật

- THG đồng bộ lịch từ Google Calendar hay Microsoft 365?
- Dữ liệu nào của lịch riêng tư được phép hiển thị?
- Manager nào được xem chi phí vận hành của team?
- Phòng nào cần duyệt và ai là người duyệt?
- Trùng lịch cá nhân chỉ cảnh báo hay có trường hợp phải chặn?
- MVP chỉ đặt phòng hay hỗ trợ cả xe và thiết bị độc lập?
- Có cần check-in/out trong giai đoạn đầu không?

Bản demo hiện dùng dữ liệu mẫu để kiểm tra ý tưởng và luồng thao tác. Quyền và
phạm vi dữ liệu phải được backend kiểm tra lại trước khi triển khai thật.
