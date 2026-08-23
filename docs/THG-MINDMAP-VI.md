# Mindmap tổng thể — THG Resource

Mindmap này giúp nhìn nhanh hệ thống phục vụ ai, người dùng làm gì và phần nào
do LibreBooking xử lý.

```text
THG RESOURCE
│
├── Người dùng
│   ├── Nhân viên
│   │   ├── Kiểm tra lịch
│   │   ├── Xem phòng và thiết bị trong phòng
│   │   └── Đặt tài nguyên
│   ├── Lead / Manager
│   │   ├── Có các quyền của nhân viên
│   │   ├── Xem thành viên và số liệu trong team mình
│   │   └── Duyệt yêu cầu khi được giao quyền
│   ├── Admin tài nguyên
│   │   ├── Quản lý phòng, thiết bị và lịch bảo trì
│   │   └── Duyệt đặt chỗ thuộc tài nguyên mình phụ trách
│   ├── Admin hệ thống
│   │   └── Quản lý tài khoản, nhóm và quyền
│   └── CEO / Lãnh đạo
│       └── Xem số liệu tổng hợp toàn công ty
│
├── Tổng quan theo vai trò
│   ├── Nhân viên
│   │   ├── Đặt chỗ sắp tới và yêu cầu chờ duyệt
│   │   ├── Thông báo công ty / nhóm
│   │   └── Phòng yêu thích hoặc thường dùng
│   ├── Manager
│   │   ├── Yêu cầu cần duyệt trong team
│   │   ├── Mức sử dụng và tỷ lệ hủy / không sử dụng trong team
│   │   └── Chi phí team nếu được cấp quyền
│   ├── Admin tài nguyên
│   │   ├── Phòng đang dùng, trống, bảo trì hoặc có sự cố
│   │   ├── Thiết bị chờ sửa chữa
│   │   ├── Yêu cầu chờ xử lý
│   │   └── Chi phí vận hành chi tiết trong phạm vi phụ trách
│   ├── Admin hệ thống
│   │   ├── Lỗi tích hợp và trạng thái dịch vụ
│   │   └── Tài khoản / quyền cần xử lý
│   └── CEO
│       ├── Tỷ lệ phòng khả dụng và mức sử dụng toàn công ty
│       ├── Tổng chi phí vận hành và bảo trì
│       ├── Phòng dùng nhiều nhất / ít nhất
│       ├── Chi phí trên mỗi giờ sử dụng
│       ├── Tỷ lệ hủy và đặt nhưng không sử dụng
│       └── Xu hướng tổng hợp, không hiển thị việc vận hành chi tiết
│
├── Kiểm tra lịch
│   ├── Chế độ Ngày / Tuần làm việc / Tháng
│   ├── Tuần mặc định chỉ hiện T2–T6
│   ├── Nguồn lịch
│   │   ├── Lịch của tôi
│   │   ├── Phòng và thiết bị
│   │   ├── Lịch công ty
│   │   ├── Nhóm của tôi
│   │   └── Ngày lễ Việt Nam
│   ├── Lịch riêng tư của người khác chỉ hiện “Bận”
│   └── Một đặt chỗ chỉ xuất hiện một lần
│
├── Danh mục phòng
│   ├── Chỉ hiển thị các phòng
│   ├── Chọn phòng → xem chi tiết
│   │   ├── Vị trí và sức chứa
│   │   ├── Tiện nghi cố định
│   │   └── Thiết bị có thể đăng ký thêm
│   └── Chọn “Đặt phòng này” → sang form với phòng đã điền sẵn
│
├── Đặt tài nguyên
│   ├── Chọn mục đích, tài nguyên, ngày và giờ
│   ├── Chọn thiết bị bổ sung nếu có
│   ├── Kiểm tra lịch trống
│   ├── Trùng cùng tài nguyên → không cho đặt
│   ├── Trùng lịch cá nhân / nhóm → cảnh báo
│   └── Kết quả
│       ├── Không cần duyệt → xác nhận ngay
│       └── Cần duyệt → gửi yêu cầu
│
├── Sau khi đặt
│   ├── Quay về Kiểm tra lịch
│   ├── Highlight đúng đặt chỗ vừa tạo
│   └── Không cần tab “Đặt chỗ của tôi” trong bản demo
│
├── Phê duyệt
│   ├── Phụ thuộc chính sách của tài nguyên
│   ├── Không phụ thuộc sự kiện nằm ở lịch cá nhân hay lịch công ty
│   ├── Người duyệt: Admin tài nguyên hoặc người được giao quyền
│   └── Hệ thống gửi thông báo kết quả
│
├── Quyền và phạm vi dữ liệu
│   ├── Chức danh không tự động tạo quyền
│   ├── Manager chỉ thấy dữ liệu trong team
│   ├── Admin tài nguyên xem chi phí vận hành trong phạm vi được giao
│   ├── CEO xem tổng hợp, không xử lý vận hành
│   └── Backend phải lọc dữ liệu; ẩn menu không phải là bảo mật
│
├── Highlight định hướng
│   ├── Có: dữ liệu được điền sẵn, kết quả vừa tạo, nhắc nhở mở đúng sự kiện
│   └── Không có: chuyển tab hoặc mở nội dung để xem
│
└── Kiến trúc
    ├── Next.js: UI/UX riêng theo phong cách THEHEGEO
    ├── BFF/Mapper: đổi dữ liệu LibreBooking sang model của UI
    ├── LibreBooking: API, data model và nghiệp vụ đặt chỗ
    ├── Calendar provider: lịch cá nhân / công ty
    └── AI Usage và MCP: ngoài phạm vi demo đặt lịch hiện tại
```

## Luồng chính

```text
Đăng nhập
→ Kiểm tra lịch hoặc xem Danh mục phòng
→ Mở Đặt tài nguyên với thông tin đã chọn
→ Kiểm tra lịch trống
→ Xác nhận hoặc gửi yêu cầu duyệt
→ Quay về lịch và highlight kết quả
```

## Cách hiểu các thuật ngữ

```text
Kiểm tra lịch  = xem lúc nào trống hoặc bận
Đặt tài nguyên = hành động người dùng thực hiện
Reservation    = bản ghi đặt chỗ ở backend LibreBooking
Resource       = phòng hoặc thiết bị có thể đặt
Scope          = phạm vi dữ liệu một người được phép xem
```
