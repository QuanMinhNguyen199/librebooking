# Đánh giá LibreBooking cho hệ thống THG

## Kết luận ngắn

LibreBooking phù hợp để làm backend cho nghiệp vụ đặt phòng của THG, gồm:

- Quản lý phòng và lịch phòng.
- Kiểm tra phòng trống.
- Tạo, sửa và hủy reservation.
- Chặn đặt trùng.
- Phê duyệt reservation.
- Giới hạn người dùng theo phòng, nhóm và phạm vi quản lý.

LibreBooking đáp ứng tốt quyền liên quan đến **phòng và reservation**, nhưng
không có đầy đủ role doanh nghiệp và quyền theo feature như Dashboard, Chi phí
hay Báo cáo sử dụng. THG cần bổ sung một lớp phân quyền riêng cho các phần này.

## Mapping role

| Role THG | Role phù hợp trong LibreBooking | Phạm vi chính |
|---|---|---|
| Nhân viên | User | Xem và đặt các phòng được cấp quyền |
| Manager/Lead | Group Admin | Quản lý thành viên và reservation của nhóm |
| Admin tài nguyên | Resource Admin | Quản lý, duyệt và theo dõi các phòng phụ trách |
| System Admin | Application Admin | Quản trị toàn bộ LibreBooking |
| CEO | Không có role tương ứng | THG cấp quyền xem báo cáo toàn công ty |

Manager hoặc Lead vẫn là một người dùng, nhưng được cấp thêm quyền quản lý trong
phạm vi nhóm. CEO không nên trở thành Application Admin chỉ để xem báo cáo.

## LibreBooking kiểm soát được gì?

LibreBooking có ba mức quyền trên từng tài nguyên:

- `Full`: được xem và đặt.
- `View`: chỉ được xem.
- `None`: không được truy cập.

Backend LibreBooking tiếp tục kiểm tra quyền khi nhận request. Việc chỉ ẩn nút
trên giao diện Next.js không thể thay thế bước kiểm tra này.

Ví dụ:

- Nhân viên chỉ đặt được các phòng đã được cấp quyền.
- Resource Admin chỉ quản lý và duyệt reservation của phòng mình phụ trách.
- Group Admin chỉ quản lý người dùng trong nhóm của mình.
- Application Admin có quyền quản trị toàn hệ thống.

## Phần THG cần xây thêm

LibreBooking không quản lý trực tiếp các quyền sau:

- Xem Dashboard dành cho CEO, Manager hoặc nhân viên.
- Xem chi phí theo công ty, văn phòng hoặc phòng ban.
- Xem báo cáo sử dụng theo scope tổ chức.
- Quyền bật/tắt từng feature trên giao diện THG.
- Dữ liệu điện, bảo trì, khấu hao và ngân sách.

Các quyền này nên được kiểm tra tại backend/BFF của THG, không chỉ ở Frontend.

## Kiến trúc đề xuất

```text
Next.js UI
    ↓
THG BFF: quyền theo feature và scope doanh nghiệp
    ↓
LibreBooking API: quyền phòng, lịch và reservation
```

Hai lớp có trách nhiệm khác nhau:

| Lớp | Trách nhiệm |
|---|---|
| LibreBooking | Bảo vệ phòng, lịch, reservation và phê duyệt |
| THG BFF | Bảo vệ Dashboard, Usage, Chi phí và phạm vi doanh nghiệp |

Không nên xóa hoặc thay thế cơ chế quyền của LibreBooking. THG chỉ bổ sung phần
phân quyền mà LibreBooking không phục vụ.

## API có thể sử dụng

| Nghiệp vụ | API LibreBooking |
|---|---|
| Đăng nhập | Authentication |
| Lấy người dùng | Users |
| Quản lý nhóm | Groups |
| Cập nhật role nhóm | Groups Roles |
| Cấp quyền phòng cho nhóm | Groups Permissions |
| Lấy phòng | Resources |
| Kiểm tra phòng trống | Resource Availability |
| Tạo và xem lịch đặt | Reservations |
| Phê duyệt | Reservation Approval |

Các API thay đổi role và permission chỉ được gọi bởi tài khoản có quyền quản
trị phù hợp.

## Cách chứng minh bằng POC

POC không cần hoàn thiện toàn bộ Dashboard. Chỉ cần chứng minh các trường hợp:

1. Nhân viên đặt được phòng đã được cấp quyền.
2. Nhân viên không đặt được phòng ngoài quyền.
3. Hai người đặt cùng giờ, backend chỉ chấp nhận một reservation.
4. Phòng cần duyệt tạo trạng thái chờ.
5. Resource Admin chỉ thấy và duyệt phòng mình phụ trách.
6. Manager chỉ thấy dữ liệu trong nhóm.
7. CEO xem được báo cáo nhưng không có quyền quản trị hệ thống.

POC đạt khi các giới hạn trên được backend thực thi bằng tài khoản và dữ liệu
LibreBooking thật, không phải chỉ mô phỏng trên UI.

## Đề xuất quyết định

Có thể tiếp tục sử dụng LibreBooking làm nền tảng booking cho THG.

Phạm vi phát triển nên được chia như sau:

- Giữ LibreBooking cho resource, availability, reservation và approval.
- Dùng Next.js để xây giao diện riêng theo nhận diện THG.
- Xây THG BFF cho feature RBAC, scope doanh nghiệp và báo cáo.
- Chỉ phát triển Dashboard chi phí sau khi chốt được nguồn dữ liệu vận hành.

