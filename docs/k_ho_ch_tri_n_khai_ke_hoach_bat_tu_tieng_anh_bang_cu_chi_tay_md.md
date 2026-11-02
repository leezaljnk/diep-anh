# Kế hoạch Triển khai: Học Tiếng Anh Tương Tác Qua Camera (Camera English Fun)

## Kết quả review và triển khai V1 (02/11/2026)

**Các vấn đề đã điều chỉnh:**

1. **Pose Landmarker không đo mí mắt hoặc khẩu hình.** V1 nhận diện tư thế thay thế: Sleepy là nghiêng đầu trên 25 độ kèm một tay tựa má; Surprised là hai tay gần hai má. Không tuyên bố nhận diện cảm xúc, nhắm mắt, miệng chữ O, Smile hoặc Jump.
2. **SVG ban đầu chỉ chứa chữ cái/tên từ, không phải tranh minh họa**, và đường dẫn `/images/english/` không khớp vị trí file. Giữ nguyên nguồn dữ liệu/ảnh ban đầu; catalogue chơi V1 chọn 28 từ thuộc school/animals/food, dùng PNG Twemoji lưu cục bộ tại `public/english/images/illustrated/`. Nguồn và giấy phép CC BY 4.0 nằm trong `public/english/ATTRIBUTION.md`. Các từ còn lại chờ có tranh phù hợp.
3. **Không nhập mã TypeScript như tài nguyên tĩnh qua HTTP.** `src/data/englishVocab.ts` nhập catalogue gốc lúc bundle và chuẩn hóa đường dẫn tương đối theo `BASE_URL`, dùng được khi deploy vào thư mục con.
4. **Ngưỡng hình học cần tính theo kích thước cơ thể và tỉ lệ video.** Luật TPR dùng chiều rộng vai, confidence tối thiểu 0.6, kiểm tra khớp trong khung hình và dwell 900 ms liên tục. Mất frame trên 250 ms hoặc mất dấu sẽ reset dwell. Clap V1 nhận hai bàn tay chắp gần nhau dưới 30% chiều rộng vai, không đếm số lần vỗ.
5. **Web Speech API không luôn có giọng tiếng Anh và có thể dùng dịch vụ từ xa.** Chỉ chọn voice tiếng Anh với `localService = true`; đọc chậm 0.8. Nếu chưa có voice cục bộ, hiện thông báo và giữ nội dung chữ/tranh, không tự gọi dịch vụ phát âm online. Muốn nghiệm thu âm thanh đầy đủ cần cài giọng tiếng Anh trên thiết bị.
6. **Vòng đời camera phải xử lý cả race bất đồng bộ.** Hook dùng session token, đóng model trả về muộn và dừng track trả về sau khi đã thoát. Ẩn tab, tắt camera, ngắt camera, đổi mode hoặc unmount đều dọn tài nguyên; bật lại giữ lượt hiện tại và reset tracking. Phím lớp học được tạm dừng khi đang mở tiếng Anh.
7. **Hết giờ không đồng nghĩa làm sai.** Sau 7 giây TPR chuyển sang cùng làm mẫu không giới hạn thời gian; có thể làm đúng để nhận sao hoặc chuyển động tác mà không trừ sao. Ván gồm 5 động tác không lặp, chọn từ 6 động tác. Catch gồm 15 từ mục tiêu không lặp, mỗi lượt 3 tranh cùng chủ đề; thả sai hoặc mất tay trả bóng về vị trí cũ.

**Mã triển khai:** `EnglishGameHub.tsx` chứa hub và màn chơi dùng chung hai mode; `EnglishGame.css` chứa bố cục responsive. `useEnglishCamera.ts` dùng chung vòng đời camera, chỉ tạo Hand/Pose Landmarker cần thiết sau khi bấm bắt đầu. Luật nằm ở `englishHandCatch.ts` và `englishTprLogic.ts`, không nằm trong JSX. Không thêm scene vào union lớp/sân vì các mini-game hiện có được mở bằng trạng thái riêng và lazy component.

**Kiểm chứng tự động:** `node --import tsx --test tests/englishGames.test.ts` kiểm tra 28 ảnh thật, 15 từ không lặp, nhiễu cùng chủ đề, chuyển trạng thái bắt/thả, giọng cục bộ, 6 luật TPR, confidence/tỉ lệ video và dwell. Playwright với stream/model/landmark giả lập đã kiểm tra lỗi quyền camera, bắt đúng sang lượt, timeout TPR không mất sao, giữ đúng cộng sao, đổi mode đóng model và dừng track. Đây không phải phép đo độ chính xác model trên người thật.

**Còn cần nghiệm thu thực tế:** thử webcam với trẻ ở nhiều khoảng cách/ánh sáng, xác nhận đạt ít nhất 4/5 động tác; thử giọng tiếng Anh trên thiết bị đích và hiệu năng CPU máy tính bảng. Các màn camera không được bật trong bản HTML mở bằng `file:`.

**Kết quả kiểm tra mã:** TypeScript và build production đã qua. Có 9 test tiếng Anh riêng đều qua. Bộ test toàn dự án còn hai lỗi được xác nhận có sẵn ở HEAD: `trashSpawn.test.ts` yêu cầu `MAX_SCORE = 10` nhưng ứng dụng dùng `20`; `voicePrompts.test.ts` yêu cầu màn nghiêng đầu có call `triggerSpeech/showFeedback` trong khi màn đó không dùng các hàm này. Không sửa các hợp đồng ngoài phạm vi tính năng tiếng Anh.

Tài liệu này định hình kế hoạch phát triển màn chơi học tiếng Anh tương tác không chạm qua webcam/camera dành cho trẻ em, tích hợp **hai chế độ chơi bổ trợ lẫn nhau**:
1. **Mode A — Hand Gesture Catch (Bắt từ bằng bàn tay):** Rèn luyện nhận diện mặt chữ, tranh ảnh và kỹ năng kéo-thả vật phẩm.
2. **Mode B — Total Physical Response (TPR - Vận động & Cảm xúc):** Rèn luyện phản xạ nghe hiểu mệnh lệnh hành động cơ thể và biểu cảm cảm xúc theo phương pháp TPR.

---

## 1. Mục tiêu dự án

* Xây dựng không gian học tiếng Anh vận động (Kinesthetic Learning), kết hợp phản xạ nghe - nhìn - vận động cơ thể (TPR) nhằm giúp trẻ tiếp thu từ vựng tự nhiên, không áp lực.
* Ứng dụng công nghệ thị giác máy tính (Computer Vision) xử lý 100% cục bộ trên thiết bị của người dùng, đảm bảo quyền riêng tư và tốc độ phản hồi nhanh.
* Tận dụng tối đa tập dữ liệu tĩnh mở (Icons, QuickDraw SVG, Web Speech API) để hệ thống tự vận hành mà không tốn chi phí máy chủ hay phát sinh API trả phí.

---

## 2. Chi tiết 2 Chế độ chơi (Game Modes)

### 2.1 Mode A: Bắt từ bằng cử chỉ tay (Hand Gesture Catch)

* **Thiết bị nhận diện:** MediaPipe Hand Landmarker (`@mediapipe/tasks-vision`).
* **Quy cách ván:** 15 lượt/ván.
* **Luồng chơi:**
  1. TopBar phát âm từ mục tiêu (*"Apple!"*), hiển thị chữ và nút Loa nghe lại.
  2. Xuất hiện 2–3 bóng bong bóng lơ lửng (1 đúng, 1–2 sai cùng chủ đề: Trái cây, Con vật, Đồ vật học tập).
  3. Bé di chuyển bàn tay ảo (con trỏ găng tay robot) đến bóng đúng.
  4. **Nắm tay lại (Closed Fist):** Quả bóng dính theo bàn tay.
  5. Giữ tay nắm và di chuyển bóng về **Giỏ thu thập / Hộp ma thuật** ở đáy màn hình.
  6. **Mở tay ra (Open Hand):** Thả bóng vào giỏ.
* **Phản hồi:** Thả đúng thì nổ hoa tuyết/confetti và cộng sao; thả sai bóng bật lại vị trí cũ để bé thử lại không phạt điểm.

---

### 2.2 Mode B: Phản xạ hành động & Cảm xúc (TPR Movement & Emotions)

* **Thiết bị nhận diện:** MediaPipe Pose Landmarker (`@mediapipe/tasks-vision`) kết hợp phân tích góc các khớp cơ thể & mốc khuôn mặt.
* **Quy cách ván:** 5 lượt/ván.
* **Luồng chơi:**
  1. Mascot Kiến Sáng phát âm thanh và hiển thị khẩu lệnh tiếng Anh to rõ ở trung tâm (ví dụ: *"Hands up!"*, *"Jump!"*, *"Touch your head!"*, *"Smile!"*).
  2. Màn hình kích hoạt đồng hồ đếm ngược thân thiện (5–7 giây) khuyến khích bé làm theo.
  3. Camera quét khung hình toàn thân/nửa thân của bé.
  4. Khi bé thực hiện đúng tư thế và giữ ổn định trong khoảng **0.8 – 1.0 giây (Dwell Time)**:
     * Mascot thực hiện hành động ăn mừng cùng bé.
     * Phát âm thanh khen ngợi (*"Super! You did it!"*), cộng điểm sao và chuyển sang động tác kế tiếp.
  5. Nếu hết giờ chưa nhận diện được: Mascot làm mẫu động tác trên màn hình và động viên bé cùng làm theo, không trừ điểm.

#### Danh mục động tác TPR phiên bản đầu (V1 Catalog):

| Nhóm | Khẩu lệnh (Prompt) | Landmark & Luật nhận diện | Tiêu chí hoàn thành |
|---|---|---|---|
| **Vận động** | **"Hands up!"** | Cổ tay (15, 16) & Tai (7, 8) | Cả 2 cổ tay nằm cao hơn 2 tai |
| **Vận động** | **"Touch your head!"** | Cổ tay (15 hoặc 16) & Mũi (0) | Cổ tay cách đỉnh đầu/mũi dưới một bán kính $\Delta d$ |
| **Vận động** | **"Clap your hands!"** | Cổ tay trái (15) & Cổ tay phải (16) | Khoảng cách giữa 2 cổ tay $< 15\%$ chiều rộng vai |
| **Vận động** | **"T-Pose / Open arms!"** | Cổ tay, Khuỷu tay, Vai (11..16) | Hai cánh tay giơ ngang vai, góc khuỷu $> 150^\circ$ |
| **Tư thế thay cảm xúc** | **"Sleepy!"** | Góc nghiêng đầu (Roll 2D từ mắt 2, 5), cổ tay & tai | Nghiêng đầu $> 25^\circ$ và một tay tựa má; không đo mắt nhắm |
| **Tư thế thay cảm xúc** | **"Surprised!"** | Hai cổ tay và hai tai | Hai tay áp sát hai bên má; không đo khẩu hình |

---

## 3. Kiến trúc Kỹ thuật & Cấu trúc Dự án

### 3.1 Cấu trúc thư mục mã nguồn

```text
src/data/englishVocab.ts             # Catalogue chơi đã chuẩn hóa đường dẫn
src/data/englishTprActions.ts        # Catalogue động tác
src/utils/englishHandCatch.ts        # Luật bắt/thả
src/utils/englishTprLogic.ts         # Hình học, confidence và dwell
src/utils/useEnglishCamera.ts        # Vòng đời Hand/Pose Landmarker
src/utils/speech.ts                  # Giọng tiếng Anh cục bộ
src/components/EnglishGameHub.tsx    # Hub và hai màn chơi
src/components/EnglishGame.css       # Giao diện responsive
public/english/data/englishVocab.ts  # Nguồn từ vựng gốc được giữ nguyên
public/english/images/illustrated/   # PNG minh họa dùng trong game
public/english/ATTRIBUTION.md        # Nguồn và giấy phép ảnh
```

### 3.2 Tối ưu hóa tải Model MediaPipe

* Cả hai mode đều dùng thư viện `@mediapipe/tasks-vision`, nhưng dùng 2 model task khác nhau:
  * Mode A: `hand_landmarker.task` (~8 MB).
  * Mode B: `pose_landmarker_lite.task` (~6 MB) - phiên bản Lite nhẹ, chạy mượt trên CPU máy tính bảng.
* **Cơ chế nạp Lazy:** Chỉ nạp model tương ứng khi người chơi chọn vào chế độ đó. Nếu chuyển đổi giữa 2 mode, tự động hủy stream và giải phóng bộ nhớ của model trước đó.

---

## 4. Thiết kế Giao diện & Trải nghiệm (UI/UX)

### 4.1 Màn hình Hub chọn chế độ (English Game Hub)

* Tiêu đề vui nhộn: **"Vui Học Tiếng Anh Cùng Kiến Sáng"**.
* 2 Thẻ chọn chế độ lớn, màu sắc rực rỡ:
  1. **"Bàn Tay Bắt Chữ" (Hand Catch):** Minh họa bàn tay robot bắt quả táo.
  2. **"Bé Cùng Vận Động" (TPR Action):** Minh họa Kiến Sáng giơ tay nhảy múa.
* Nút Thoát quay lại màn hình chọn scene chính của ứng dụng.

### 4.2 Giao diện Mode TPR (In-Game Layout)

1. **Top HUD:**
   * Nút Thoát (X) và nút Tắt/Bật tiếng.
   * Thanh tiến trình 5 ngôi sao tương ứng 5 động tác.
2. **Khu vực Trực quan (Camera & Hướng dẫn):**
   * Camera preview kích thước lớn (chiếm 60–70% màn hình), lật gương (mirror) để bé thấy trọn cơ thể như đang soi gương.
   * Khung viền camera có hiệu ứng phát sáng trạng thái:
     * **Xanh lam:** Đang quan sát tư thế của bé.
     * **Xanh lá + Vòng xoay tiến trình:** Đang nhận diện đúng tư thế (đang đếm dwell-time giữ 1 giây).
     * **Vàng cam:** Nhắc bé đứng lùi lại nếu cơ thể ra khỏi khung hình.
3. **Mascot & Lời thoại:**
   * Bạn Robot Kiến Sáng ở góc thực hiện ảnh động mẫu tương ứng với khẩu lệnh để hỗ trợ trẻ chưa rành mặt chữ tiếng Anh.

---

## 5. Lộ trình Triển khai (Step-by-Step)

### Giai đoạn 1: Chuẩn bị Dữ liệu & Tiện ích nền tảng
* [x] Tạo `src/data/englishVocab.ts` (Mode Catch) và `src/data/englishTprActions.ts` (Mode TPR).
* [x] Xây dựng `src/utils/speech.ts` bọc `window.speechSynthesis` (giọng tiếng Anh cục bộ, tốc độ 0.8).
* [x] Viết hàm tính toán hình học trong `src/utils/englishTprLogic.ts` (khoảng cách, góc khớp, confidence và dwell).

### Giai đoạn 2: Module AI & Camera Hooks
* [x] Dùng `useEnglishCamera.ts` với Hand Landmarker và bộ nhận diện nắm/mở có debounce trong `handPickup.ts`.
* [x] Dùng `useEnglishCamera.ts` với Pose Landmarker và `PoseDwellTracker` trong `englishTprLogic.ts`.
* [x] Kiểm tra cleanup `MediaStream` và model khi đổi mode/unmount bằng stream/model giả lập.

### Giai đoạn 3: Xây dựng Giao diện 2 Màn chơi
* [x] Xây dựng UI Catch trong `EnglishGameHub.tsx` (bắt/thả bóng vào giỏ, 15 lượt).
* [x] Xây dựng UI TPR trong `EnglishGameHub.tsx` (khẩu lệnh, robot mẫu, camera gương, 5 lượt).
* [x] Xây dựng `EnglishGameHub.tsx` điều phối giữa hai chế độ.

### Giai đoạn 4: Đăng ký Scene & Kiểm thử tổng thể
* [x] Đăng ký mini-game lazy trong `src/App.tsx` và nút trên `TopBar.tsx` theo mẫu các game hiện có.
* [ ] Kiểm thử phản xạ TPR trong các điều kiện: đứng gần/xa camera, ánh sáng phòng khách, trẻ mặc áo dài tay/ngắn tay.
* [x] Chạy `npm run lint` và `npm run build` để kiểm tra độ tương thích deploy GitHub Pages.

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

* [x] Người chơi có thể lựa chọn chơi 1 trong 2 mode từ màn hình Hub tiếng Anh.
* [ ] **Mode Hand Catch:** Di chuyển mượt mà, nắm tay giữ bóng chắc chắn, thả tay bóng rơi chính xác vào vùng nhận diện giỏ.
* [ ] **Mode TPR:** Nhận diện đúng ít nhất 4/5 tư thế chuẩn xác mà không cần người lớn hỗ trợ căn chỉnh camera quá phức tạp.
* [ ] Cơ chế âm thanh: Mỗi khẩu lệnh/từ mới đều được phát âm tự động và cho phép bấm nút Loa để nghe lại bất kỳ lúc nào.
* [x] Không phạt điểm khi làm sai hoặc hết giờ; đã kiểm tra bằng luật và luồng giả lập, có mẫu để trẻ làm theo.
* [x] Xử lý landmark/khung hình hoàn toàn phía máy khách, không có mã lưu hoặc gửi ảnh/video.
* [x] Kiểm tra giải phóng camera/model khi thoát và khi quyền camera trả về muộn bằng stream/model giả lập; cần thử lại với thiết bị thật.