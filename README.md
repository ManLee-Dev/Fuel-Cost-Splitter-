# Chia tiền xăng

Web app tính và chia chi phí nhiên liệu khi đi chung xe, mở lộ trình lái xe bằng Google Maps và tạo mã VietQR để thu tiền.

## Chạy
- Cách nhanh: mở `index.html` bằng trình duyệt (cần mạng để tải thư viện QR từ CDN).
- Máy chủ cục bộ (nên dùng để Geolocation hoạt động): `npm start`, rồi mở địa chỉ hiện ra.
- Kiểm thử: `npm test` (Node 18 trở lên, không cần cài thêm gói).

## Cấu trúc
| Tệp | Vai trò |
|---|---|
| `index.html` | Khung giao diện |
| `css/styles.css` | Giao diện, hỗ trợ chế độ sáng và tối |
| `js/data.js` | Danh sách xe, nhiên liệu, thành phố, ngân hàng |
| `js/route.js` | Nhận diện địa danh và ước lượng quãng đường |
| `js/cost.js` | Công thức tính và chia tiền (thuần logic, có test) |
| `js/vietqr.js` | Sinh chuỗi VietQR chuẩn EMVCo, CRC16 |
| `js/app.js` | Xử lý sự kiện, hiển thị |
| `test/` | Kiểm thử bằng `node:test` |

## Hạn chế và hướng phát triển
- Nút Google Maps mở lộ trình lái xe với điểm xuất phát, điểm dừng và điểm đến. Tính năng này dùng liên kết chỉ đường, không cần API key.
- Quãng đường dùng trong phép tính hiện vẫn là ước lượng theo tọa độ 32 thành phố nhân hệ số 1.25, không được lấy tự động từ Google Maps. Để có dữ liệu đường thực tế trong ứng dụng, cần tích hợp dịch vụ Directions API cùng API key và cấu hình thanh toán; hiện có thể xem quãng đường trên Google Maps rồi nhập thủ công.
- Giá nhiên liệu và mức tiêu hao trong `js/data.js` là số tham khảo, cần cập nhật định kỳ hoặc lấy từ API.
- Phí BOT chưa tự tính theo tuyến, hiện nhập tay.
