# LibreBooking có những chức năng gì?

Tài liệu này giải thích LibreBooking theo góc nhìn nghiệp vụ để đội THEHEGEO biết
phần nào có thể kế thừa từ backend và phần nào phải tự xây thêm. Đây là tài liệu
tóm lược từ phiên bản LibreBooking đang có trong repository, không phải mô tả UI
Next.js của công ty.

## 1. LibreBooking giải quyết bài toán gì?

LibreBooking là hệ thống **đăng ký sử dụng tài nguyên theo thời gian**. Tài
nguyên có thể là phòng họp, thiết bị, xe, bàn làm việc, sân, con người hoặc bất
kỳ thứ gì cần tránh bị đặt trùng.

Mô hình cốt lõi:

```text
Schedule (khung lịch)
└── Resource (thứ được đặt)
    └── Reservation (lượt đăng ký sử dụng)
        └── Accessory (thiết bị/số lượng đăng ký kèm)
```

## 2. Chức năng dành cho nhân viên

### Xem lịch và tình trạng tài nguyên

- Xem tài nguyên còn trống hoặc đã được đặt theo ngày/lịch.
- Lọc tài nguyên theo lịch, nhóm hoặc loại tài nguyên.
- Xem thông tin, hình ảnh, sức chứa và thuộc tính riêng của tài nguyên.
- Xem lịch cá nhân và các reservation liên quan đến mình.
- Có thể cung cấp lịch ở dạng iCalendar/ICS để dùng với Outlook hoặc Thunderbird.

### Tạo và quản lý reservation

- Chọn một hoặc nhiều tài nguyên trong cùng reservation.
- Chọn ngày, giờ bắt đầu và kết thúc.
- Thêm tiêu đề, mô tả và thuộc tính tùy chỉnh.
- Tạo lịch lặp theo ngày, tuần, tháng hoặc năm.
- Sửa hoặc xóa một lần, các lần tương lai hoặc toàn bộ chuỗi lặp.
- Mời người dùng, thêm người tham gia và khách bên ngoài bằng email.
- Đính kèm tệp nếu quản trị viên cho phép.
- Đặt lời nhắc trước khi bắt đầu hoặc kết thúc.
- Tham gia danh sách chờ khi tài nguyên chưa khả dụng.
- Theo dõi trạng thái chờ phê duyệt hoặc đã được duyệt.

### Check-in và check-out

- Người dùng có thể xác nhận đã đến và bắt đầu sử dụng tài nguyên.
- Có thể check-out khi kết thúc sớm.
- Hệ thống có thể tự giải phóng reservation nếu quá thời hạn mà không check-in.

### Đăng ký thiết bị đi kèm

- Chọn accessory như micro, webcam, máy chiếu hoặc ghế.
- Kiểm soát số lượng còn lại trên các reservation diễn ra đồng thời.
- Giới hạn accessory theo từng resource.
- Đặt số lượng tối thiểu và tối đa được lấy trong một reservation.

## 3. Quản lý lịch — Schedule

Schedule quyết định tài nguyên được đặt vào thời điểm nào:

- Giờ mở/đóng cửa và độ dài từng time slot.
- Ngày bắt đầu tuần và số ngày hiển thị.
- Slot được phép đặt và slot bị khóa.
- Layout tiêu chuẩn theo chu kỳ hoặc layout riêng cho từng ngày cụ thể.
- Khoảng ngày hoạt động, ví dụ theo mùa hoặc học kỳ.
- Múi giờ của lịch.
- Cho phép hoặc chặn nhiều reservation đồng thời.
- Giới hạn tổng tài nguyên đang được dùng cùng lúc.
- Giới hạn số tài nguyên trong một reservation.
- Cho phép xem lịch công khai ở chế độ chỉ đọc.
- Thiết lập giờ cao điểm để tính credit khác giờ bình thường.

Mỗi Resource phải thuộc một Schedule thì mới đặt được.

## 4. Quản lý tài nguyên — Resource

Quản trị viên có thể:

- Tạo, sửa, ẩn hoặc xóa tài nguyên.
- Thiết lập tên, vị trí, liên hệ, mô tả, ghi chú, màu và hình ảnh.
- Đặt sức chứa tối đa.
- Giới hạn thời lượng reservation tối thiểu/tối đa.
- Yêu cầu đặt trước một khoảng thời gian hoặc không cho đặt quá xa.
- Thêm buffer time giữa hai lượt sử dụng.
- Cho phép hoặc cấm reservation kéo dài nhiều ngày.
- Yêu cầu phê duyệt trước khi reservation có hiệu lực.
- Yêu cầu check-in và cấu hình tự giải phóng.
- Giới hạn số reservation đồng thời của riêng resource.
- Gán trạng thái Available, Unavailable, Hidden và lý do trạng thái.
- Phân nhóm tài nguyên theo cây phân cấp.
- Tạo Resource Type để dùng chung một bộ thuộc tính.
- Cấp quyền truy cập resource cho user hoặc group.
- Công khai RSS, iCalendar, màn hình tablet hoặc lịch nhúng website.

Quan hệ giữa các resource cũng được hỗ trợ:

- Bắt buộc phải đặt cùng nhau.
- Không được nằm trong cùng một reservation.
- Không được sử dụng đồng thời dù nằm ở reservation khác nhau.

## 5. Người dùng, nhóm và phân quyền

### Tài khoản người dùng

- Tạo, sửa, kích hoạt, vô hiệu hóa hoặc xóa tài khoản.
- Đổi/reset mật khẩu và chỉnh hồ sơ.
- Tự đăng ký tài khoản nếu cấu hình cho phép.
- Import/export người dùng bằng CSV ở khu vực quản trị.
- Gán người dùng vào nhiều group và cấp thêm quyền riêng.

### Nhóm và vai trò

- Group dùng để gom nhân viên và cấp quyền truy cập resource hàng loạt.
- User thừa hưởng quyền từ tất cả group mà họ tham gia.
- Có các vai trò chính:
  - **Application Administrator:** quản trị toàn hệ thống.
  - **Group Administrator:** quản lý reservation và thành viên thuộc group.
  - **Resource Administrator:** quản lý resource được giao.
  - **Schedule Administrator:** quản lý schedule và resource thuộc schedule.

## 6. Quy tắc kiểm soát sử dụng

### Phê duyệt

- Có thể yêu cầu quản trị viên duyệt reservation của một resource.
- Có thể bắt reservation quay lại trạng thái chờ duyệt sau khi chỉnh sửa.
- Quản trị viên có thể nhận thông báo yêu cầu phê duyệt.

### Quota

Quota giới hạn mức sử dụng theo số lần hoặc tổng thời lượng, ví dụ:

- Tối đa 2 reservation mỗi ngày.
- Tối đa 5 giờ sử dụng mỗi tuần.
- Áp dụng theo user, group, resource, loại resource hoặc schedule.
- Nhiều quota có thể cùng được áp dụng.

### Credit và thanh toán

- Gán số credit cho từng người dùng.
- Resource/accessory có thể tiêu hao credit theo slot hoặc theo reservation.
- Giá credit có thể khác giữa giờ cao điểm và thấp điểm.
- Từ chối reservation nếu người dùng không đủ credit.
- Có tùy chọn bán credit qua Stripe hoặc PayPal.

Credit là cơ chế định mức sử dụng nội bộ; nó không phải hệ thống kế toán chi phí
tài sản của doanh nghiệp.

### Blackout time

- Khóa tài nguyên trong một khoảng thời gian hoặc theo chu kỳ.
- Dùng cho bảo trì, ngày nghỉ hoặc thời gian không phục vụ.
- Có thể xử lý các reservation đang xung đột khi tạo blackout.

## 7. Vận hành và báo cáo

- Quản trị và lọc reservation của nhiều người dùng.
- Phê duyệt, chỉnh sửa hoặc xóa reservation trong phạm vi được phân quyền.
- Xuất danh sách reservation sang CSV.
- Báo cáo lịch sử sử dụng và hiệu suất resource.
- Báo cáo dựng sẵn hoặc báo cáo tùy chọn.
- Hiển thị dạng bảng, biểu đồ, bản in hoặc CSV.
- Lưu báo cáo để dùng lại và gửi báo cáo qua email.
- Tô màu reservation theo user, resource hoặc custom attribute.
- Tạo announcement trên dashboard, hẹn thời gian hiển thị và giới hạn đối tượng.

## 8. Màn hình và tích hợp có sẵn

- **Tablet View:** gắn tablet trước phòng để xem trạng thái, đặt nhanh và check-in.
- **Monitor View:** màn hình lớn hiển thị tình trạng nhiều resource.
- **ICS/iCalendar:** đồng bộ hoặc đăng ký lịch từ ứng dụng lịch khác.
- **RSS và lịch nhúng:** công khai lịch resource khi được phép.
- **Slack:** bắt đầu yêu cầu đặt tài nguyên bằng slash command.
- **Email:** thông báo reservation, thay đổi, nhắc lịch và phê duyệt.
- **Authentication plugin:** database, LDAP, Active Directory/SSO, OAuth2 và SAML
  tùy cấu hình/plugin.
- **Plugin system:** mở rộng authentication, authorization, notification và các
  hành vi khác mà không sửa trực tiếp lõi.
- **Terms of Service:** yêu cầu chấp nhận điều khoản khi đăng ký hoặc khi đặt lịch.
- **reCAPTCHA:** bảo vệ các luồng công khai nếu được cấu hình.

## 9. Custom attributes

LibreBooking cho phép thêm trường riêng cho:

- Reservation.
- Resource.
- Resource Type.
- User.

Kiểu trường gồm text một dòng, text nhiều dòng, danh sách chọn, ngày giờ và
checkbox. Có thể bắt buộc nhập, kiểm tra bằng biểu thức, chỉ áp dụng cho một số
đối tượng và giới hạn quyền xem.

Ví dụ cho THEHEGEO:

- Resource: tầng, sức chứa, TV, bảng trắng, mã tài sản.
- Reservation: mã dự án, phòng ban, mục đích sử dụng.
- User: mã nhân viên, đơn vị, cost center.

## 10. REST API hiện có

API chính nằm dưới `/Web/Services/index.php` và dùng session token/user ID. Các
nhóm endpoint được tài liệu hóa trong phiên bản hiện tại:

| Nhóm API | Nghiệp vụ chính |
|---|---|
| Authentication | Đăng nhập và đăng xuất |
| Accounts | Đọc/cập nhật tài khoản và mật khẩu |
| Users | Tạo, đọc, cập nhật, xóa người dùng |
| Groups | Group, role, permission và thành viên |
| Resources | Resource, trạng thái, loại, nhóm và availability |
| Schedules | Danh sách schedule và time slot |
| Accessories | Danh sách thiết bị và liên kết với resource |
| Reservations | Tạo, sửa, đọc, xóa, duyệt, check-in/check-out |
| Attributes | Tạo và quản lý custom attribute |

Lưu ý: giao diện PHP có một số chức năng quản trị rộng hơn phạm vi REST API được
tài liệu hóa. Khi làm UI Next.js, cần kiểm tra endpoint thực tế trước khi cam kết
một màn hình; thiếu endpoint thì bổ sung Web Service ở backend PHP thay vì gọi
thẳng database từ trình duyệt.

## 11. LibreBooking không cung cấp sẵn cho dự án này

Những phần sau phải xây thành module riêng hoặc tích hợp hệ thống khác:

- Quy trình yêu cầu mua sắm, báo giá, duyệt mua và nhập kho tài sản.
- Khấu hao, bảo hành, bảo trì tài sản đầy đủ như một hệ thống asset management.
- Theo dõi Claude/OpenAI usage theo nhân viên, token, model và ngân sách.
- Agent AI/MCP hiểu ngôn ngữ tự nhiên và tự gọi các API nghiệp vụ.
- Dashboard quản trị chi phí tổng hợp theo phòng ban/cost center.

Không nên biến “mua dụng cụ mới” thành reservation. LibreBooking chỉ quản lý việc
sử dụng tài nguyên công ty **đã có**.

## 12. Phạm vi đề xuất cho UI THEHEGEO

### Giai đoạn demo

- Đăng nhập.
- Dashboard tổng quan.
- Xem phòng và lịch trống.
- Tạo reservation, chọn tiện nghi/accessory theo phòng.
- Lịch sử dụng cá nhân.
- GEO Assistant mô phỏng.
- Debug log lỗi real-time.

### Giai đoạn kết nối LibreBooking thật

- Authentication và session qua BFF.
- Resources, Accessories, Schedules và Reservations API.
- Availability và chống đặt trùng.
- Sửa/hủy, recurrence, participant, approval và check-in/out.
- Permission theo user/group.

### Module mở rộng của công ty

- AI Usage và kiểm soát ngân sách.
- MCP server gọi API LibreBooking bằng quyền của người dùng.
- Yêu cầu mua sắm/cấp phát tài sản.
- Báo cáo chi phí theo nhân viên và phòng ban.

## Nguồn trong repository

- `README.md`: giới thiệu và danh sách feature chính.
- `docs/source/ADMINISTRATION.rst`: nghiệp vụ quản trị đầy đủ.
- `docs/source/API.rst`: endpoint và payload REST API.
- `docs/source/BASIC-CONFIGURATION.rst`: cấu hình cơ bản.
- `docs/source/ADVANCED-CONFIGURATION.rst`: plugin, tích hợp và cấu hình nâng cao.

