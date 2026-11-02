# Kế hoạch: Trò chơi Tự tay nhặt rác (Phiên bản Cử chỉ tay Camera)

## 1. Mục tiêu

Tạo một màn chơi phân loại rác chuyên biệt, trong đó người chơi sử dụng bàn tay trước camera để điều khiển bàn tay ảo trên màn hình: đưa tay đến món rác, nắm tay để nhặt, di chuyển đến thùng phù hợp và mở tay để thả. Trò chơi thiết kế tối ưu riêng cho thao tác tương tác không chạm qua cử chỉ tay.

## 2. Phạm vi phiên bản đầu

- Mỗi ván xuất hiện năm món rác, trộn giữa hữu cơ và vô cơ và bảo đảm có đủ cả hai nhóm.
- Màn chơi luôn hiển thị hai thùng: **Hữu cơ** và **Vô cơ**. (\public\images\camera\thung_rac_huu_co.png,\public\images\camera\thung_rac_vo_co.png,)
- Người chơi di chuyển bàn tay ảo theo tay thật qua camera. Khi tay ở gần món rác và nắm lại, món rác được nhặt và gắn theo bàn tay ảo.
- Giữ tay nắm để đưa món rác đến thùng. Khi mở tay ra, món rác được thả.
- Thả đúng thùng: món rác biến mất vào thùng, phát phản hồi tích cực và cộng điểm.
- Thả sai thùng: phát gợi ý nhẹ nhàng, không trừ điểm; món rác quay lại vị trí ban đầu để thử lại.
- Hình ảnh camera và nhận diện được xử lý hoàn toàn cục bộ; không lưu hoặc tải hình ảnh, video hay dữ liệu nhận diện lên máy chủ.

## 3. Tích hợp với ứng dụng
- Tái sử dụng danh mục hình ảnh rác hiện có trong \public\images\camera\huu_co,\public\images\camera\vo_co (HEAD_TILT_TRASH_ITEMS), kiểm tra ánh xạ ảnh theo ID và có fallback nếu thiếu ảnh.
- Tái sử dụng phong cách giao diện, âm thanh, lời thoại, mascot và quy ước điều hướng hiện hành khi phù hợp.
- Giữ lazy-loading cho mode và model nhận diện để không tăng thời gian tải ban đầu của các màn khác.

## 4. Kế hoạch kỹ thuật

### Giai đoạn 1 — Chốt luồng chơi và dữ liệu

1. Xác nhận tập 5 món mỗi ván được chọn từ hai nhóm, không lặp món trong cùng ván và có ít nhất một món thuộc mỗi nhóm.
2. Xác định vùng tương tác của món rác và hai thùng theo tọa độ chuẩn hóa của màn chơi, tích hợp thêm vùng đệm an toàn (drop zone buffer) giúp việc thả rác mượt mà hơn khi thao tác qua tay.
3. Tách luật chọn món, kiểm tra vùng chạm, nhặt, giữ, thả và chấm điểm thành tiện ích thuần có thể kiểm thử.

### Giai đoạn 2 — Nhận diện tay và camera

1. Tích hợp MediaPipe Hand Landmarker qua dependency `@mediapipe/tasks-vision`; bổ sung model bàn tay và tải động khi người dùng bắt đầu chơi.
2. Xin quyền camera và hiển thị màn hình hướng dẫn/chờ tải model trước khi vào game.
3. Ánh xạ tọa độ bàn tay lên vùng chơi, xử lý ảnh gương nhất quán với preview, làm mượt chuyển động và giới hạn tần suất nhận diện để tránh giật.
4. Nhận diện trạng thái nắm/mở từ các điểm mốc bàn tay với ngưỡng hysteresis/debounce để tránh nhấp nháy liên tục ở ranh giới.
5. Giải phóng model, animation frame và các track camera khi dừng, thoát mode hoặc xảy ra lỗi.
6. Xử lý rõ các tình huống lỗi camera (từ chối quyền, bận, không có camera, không thấy tay) với thông báo thân thiện và hướng dẫn khắc phục.

### Giai đoạn 3 — Màn hình chơi và UI/UX phản hồi

1. Dựng khu vực chơi với camera preview (ẩn/thu nhỏ tinh tế), hai thùng phân biệt rõ màu sắc, biểu tượng và hiệu ứng mở nắp/phát sáng khi đưa rác đến gần.
2. Hiển thị bàn tay điều khiển rõ ràng với trạng thái mở, nắm, đang giữ rác; làm nổi bật món rác khi tay đủ gần để nhặt.
3. Triển khai vòng đời lượt: chờ nhặt → đang giữ → phản hồi kết quả → món tiếp theo → tổng kết.
4. Thêm hiệu ứng/âm thanh/lời thoại phù hợp, cơ chế gợi ý tự động (idle timeout hint) nếu người chơi loay quá lâu, và nút chơi lại/thoát.

### Giai đoạn 4 — Kiểm thử và hoàn thiện

1. Viết unit test cho tạo ván 5 món, cân bằng nhóm, ánh xạ tọa độ, nhận diện trạng thái tay và kết quả đúng/sai.
2. Kiểm tra tích hợp trên các thiết bị, xử lý cấp quyền/từ chối quyền camera, mất camera giữa ván và thoát mode an toàn.
3. Chạy `npm run lint`, test liên quan và `npm run build`; kiểm tra model được tải đúng theo yêu cầu production.

## 5. Rủi ro và cách giảm thiểu

| Rủi ro | Cách giảm thiểu |
|---|---|
| Ánh sáng yếu, tay bị che hoặc ngoài khung hình | Hiển thị trạng thái nhận diện trực quan, khung hướng dẫn đưa tay vào tâm màn hình |
| Trạng thái nắm/mở nhấp nháy ở ranh giới | Dùng thuật toán lọc tín hiệu, hysteresis threshold và debounce trạng thái |
| Bàn tay ảo lệch hướng so với thực tế | Kiểm tra ánh xạ gương và chuẩn hóa tọa độ theo tỷ lệ màn hình |
| Model làm chậm trên thiết bị yếu | Lazy loading, giới hạn tần suất xử lý khung hình (throttling) |

## 6. Tiêu chí hoàn thành

- Chơi trọn vẹn 5 lượt bằng cử chỉ tay qua camera với cả rác hữu cơ và vô cơ.
- Bàn tay ảo phản hồi chính xác trạng thái mở/nắm để nhặt và thả rác vào đúng thùng.
- Xử lý mượt mà các tình huống thả sai thùng (hoàn tác về vị trí cũ) và thả đúng (cộng điểm).
- Camera và tài nguyên được dọn dẹp sạch sẽ khi thoát trò chơi.
- Thông báo lỗi camera rõ ràng, không làm đơ ứng dụng.

## 7. Dưới đây là các đề xuất chi tiết về UI/UX dành riêng cho trò chơi "Tự tay nhặt rác" (Chế độ điều khiển bằng cử chỉ tay qua camera), được thiết kế theo phong cách trực quan, thân thiện và tối ưu trải nghiệm cho trẻ em:

I. Màn hình Chào mừng & Hướng dẫn (Welcome Screen)
Khi bé mở chế độ này, thay vì vào game ngay, màn hình chào xuất hiện để chuẩn bị sẵn sàng cho camera:

Giao diện trực quan:

Tiêu đề trò chơi vui nhộn kèm mascot hướng dẫn (ví dụ: "Cùng Robot Kiến Sáng dọn rác nào!").

Biểu tượng động (animated icon) minh họa cử chỉ: Bàn tay mở (để tìm rác) và Bàn tay nắm (để cầm rác).

Nút bấm chính:

Một nút "Bật Camera & Bắt đầu" to rõ, màu sắc bắt mắt (cam/xanh lá kèm hiệu ứng phóng to nhẹ thu hút).

Trạng thái quyền camera:

Ngay khi bấm, nếu trình duyệt hỏi quyền, có một khung popup thân thiện giải thích ngắn gọn: "Trò chơi cần camera để nhận diện bàn tay của bạn. Hình ảnh được xử lý trực tiếp trên máy và không bao giờ lưu lại."

II. Bố cục Giao diện Trò chơi trong ván (In-Game Layout)
Màn hình chơi được chia thành 3 khu vực chính, sắp xếp thoáng mắt, không gây rối:

1. Thanh thông tin trên cùng (Top HUD)
Góc trái: Nút Thoát (X) gọn gàng, có hỏi lại nếu bé vô tình bấm nhầm.

Chính giữa: Thanh tiến trình ván chơi (Ví dụ: 5 ngôi sao tương ứng với 5 lượt chơi; lượt nào hoàn thành sẽ sáng lên hoặc đổi màu vui nhộn).

Góc phải: Điểm số (Score) hiển thị kèm icon lá cây hoặc phần thưởng tích lũy.

2. Khu vực trung tâm & Camera Preview (Play Area)
Camera Preview (Nền ẩn hoặc thu nhỏ tinh tế):

Khung hình camera được lật gương (mirror) để chuyển động tay thuận theo mắt nhìn của bé.

Có thể đặt khung camera ẩn phía sau làm nền mờ hoặc thu nhỏ thành một góc bo tròn ở góc màn hình, viền khung chuyển màu (Xanh lá: Đã nhận diện được bàn tay | Vàng: Đang tìm bàn tay trong khung hình).

Món rác hiện tại:

Xuất hiện ở giữa màn hình với hiệu ứng lơ lửng nhẹ (floating animation).

Khi bàn tay ảo (vị trí tay người chơi trên màn hình) di chuyển lại gần món rác (trong bán kính tương tác), món rác sẽ phát sáng viền hoặc rung nhẹ để báo hiệu "Có thể nhặt!".

3. Hai Thùng rác ở phía dưới (Drop Zones)
Thùng Hữu cơ (Organic): Nằm bên trái, tông màu xanh lá/nâu đất ấm áp, hình vẽ biểu trưng vỏ chuối/lá cây và nhãn chữ to rõ.

Thùng Vô cơ (Inorganic): Nằm bên phải, tông màu xanh dương/cam năng động, hình vẽ biểu trưng chai nhựa/hộp giấy và nhãn chữ to.

Hiệu ứng "Hút rác" (Magnet / Drop Zone Buffer): Khi bé cầm món rác bay đến gần miệng thùng nào, miệng thùng đó sẽ mở nắp ra và phát sáng to hơn để mời gọi, giúp bé dễ thả trúng ngay cả khi tay hơi lệch một chút.

III. Phản hồi Cử chỉ & Tương tác (Gestures & Visual Feedback)
Vì dùng cử chỉ tay qua camera, phản hồi thị giác cực kỳ quan trọng để bé biết tay mình đang làm gì:

Bàn tay ảo (Cursor / Hand Pointer):

Trạng thái Mở tay (Open Hand): Hiển thị icon bàn tay mở màu xanh nhạt hoặc găng tay robot mở.

Trạng thái Nắm tay (Closed Fist): Khi thuật toán nhận diện ngón tay co lại, icon chuyển thành bàn tay nắm chặt, đồng thời món rác "dính" vào tâm bàn tay và thu nhỏ nhẹ theo tay.

Phản hồi kết quả (Feedback):

Thả đúng thùng: Món rác lao thẳng vào miệng thùng kèm hiệu ứng hoa giấy (confetti), âm thanh "Blop!" vui tai và điểm số bay lên.

Thả sai thùng: Món rác bật ngược ra ngoài (hoặc có hiệu ứng lắc đầu nhẹ từ mascot), kèm âm thanh "Boop!" nhắc nhở để bé nhặt lại và thử đưa sang thùng kia.