# Chia tiền xăng

Web app tính và chia chi phí nhiên liệu khi đi chung xe, tạo mã VietQR để thu tiền.

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
- Quãng đường đang ước lượng theo tọa độ 32 thành phố nhân hệ số 1.25. Để đo đường thật, thay `legKm` trong `js/route.js` bằng OSRM hoặc Google Directions, và `findCity` bằng geocoding (Nominatim).
- Giá nhiên liệu và mức tiêu hao trong `js/data.js` là số tham khảo, cần cập nhật định kỳ hoặc lấy từ API.
- Phí BOT chưa tự tính theo tuyến, hiện nhập tay.
