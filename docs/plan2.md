# Kế hoạch tích hợp chế độ phân loại rác bằng cử động đầu

## Cập nhật yêu cầu hiện tại

Các yêu cầu sau thay thế mô tả dữ liệu, thời gian và phản hồi trong kế hoạch ban đầu bên dưới:

- Hai lựa chọn là **Hữu cơ / Vô cơ**. Giữ ID nội bộ `organic | recyclable` để không ảnh hưởng mode khác; riêng mode camera, `recyclable` ánh xạ sang nhãn Vô cơ.
- Dữ liệu riêng tại `src/data/headTiltTrashItems.ts`: 70 ảnh trong `public/images/camera/huu_co`, 90 ảnh trong `public/images/camera/vo_co`. Xáo trộn toàn bộ kho, không lặp trước khi hết kho; ván dài bắt đầu chu kỳ mới, tránh trùng ảnh liên tiếp ở ranh giới chu kỳ.
- Mặc định **20 câu**; nhập số nguyên dương tại màn bắt đầu, cùng màn **Bật camera**. Câu hỏi dùng “Rác trong hình thuộc nhóm nào?” vì tên file ảnh chỉ là số thứ tự.
- Câu hiện tại, điểm/ngôi sao, thanh hành trình và đồng hồ được gom lên **Header chung**, giữ nguyên vị trí trong cả lúc chơi và phản hồi. Cột trái không căn giữa toàn bộ bằng `my-auto`: câu hỏi nằm ngay dưới Header, tranh rác lớn trong thẻ nội dung, hai đáp án liền bên dưới; mobile vẫn giữ câu hỏi, camera và đáp án cùng viewport.
- Đồng hồ là **huy hiệu cam/vàng ấm**, kích thước 64 px trên mobile, 80 px trên màn rộng; vòng vạch đứt lấy cảm hứng từ mẫu `watch.html`, dùng SVG mask riêng cho mỗi đồng hồ. Vạch giảm dần theo thời gian, chuyển hồng san hô và nhịp tim nhẹ khi còn 1–5 giây; tắt hiệu ứng khi đồng hồ dừng hoặc bật `prefers-reduced-motion`. Tại 0 giây, đồng hồ tĩnh màu cam, lời nhắc “Bé cứ chọn nhé, không cần vội!” nằm bên dưới thanh hành trình, không mang hình dáng nút bấm.
- Đồng hồ trên Header đếm từ **10 xuống 0 giây** khi camera đã sẵn sàng. Từ **5 giây**, phát âm báo nhẹ **mỗi giây một lần**, kể cả sau khi về 0 và trong phản hồi, cho đến khi chuyển câu; nút tắt âm thanh áp dụng cả âm báo. Hết giờ vẫn chờ bé trả lời, không tự tính sai hay chuyển câu.
- Tạm dừng, camera tắt/lỗi hoặc đang hiệu chỉnh thì dừng đồng hồ và âm báo. Tiếp tục giữ thời gian câu hiện tại; sang câu mới hoặc chơi lại reset về 10 giây.
- Sau khi chọn, chỉ hiện phản hồi đúng/sai khích lệ trong **1,2 giây**, bỏ giải thích và đáp án chi tiết rồi tự chuyển câu.

## 1. Mục tiêu và ý tưởng

Thêm một chế độ chơi mới để trẻ chọn thùng rác bằng cách nghiêng hoặc di chuyển đầu sang trái/phải. Đây là một màn chơi ngang hàng với **Lớp học**, **Sân trường**, **Khu vườn** và **Thử tài phân loại**, không phải modal/game phụ phủ lên màn chơi đang hoạt động. Trò chơi hiển thị lần lượt một món rác, hai lựa chọn **Hữu cơ** và **Tái chế**, phản hồi đáp án đúng/sai bằng hiệu ứng hình ảnh và âm thanh vui nhộn, rồi tự chuyển sang hình rác mới để chơi lượt tiếp theo.

Đây là một cách điều khiển bổ sung cho ứng dụng hiện tại, không thay thế thao tác kéo-thả, chế độ “Nhờ Kiến Sáng” hoặc trò chơi tái sử dụng. Mode này yêu cầu camera hoạt động và hiệu chỉnh xong trước khi nhận đáp án. Trẻ có thể nghiêng đầu hoặc chạm đáp án khi camera sẵn sàng; không có chế độ chơi khi camera tắt và không dùng bàn phím để chọn đáp án. Việc vào màn giới thiệu không tự xin quyền camera.

### Phạm vi phiên bản đầu

- Một món rác mỗi lượt; nghiêng/di chuyển đầu trái hoặc phải để chọn một trong hai nhóm.
- Chơi theo lượt có điểm và kết quả cuối ván; sau mỗi lựa chọn (đúng hoặc sai), phát âm thanh phản hồi phù hợp rồi chuyển sang hình rác mới.
- Dùng `playSuccessSfx` / `playErrorSfx` trong `src/utils/audio.ts` làm âm thanh nền tảng; có thể bổ sung âm thanh vui nhộn riêng nếu âm thanh hiện có chưa đạt trải nghiệm mong muốn.
- Camera và nhận diện chạy hoàn toàn trên thiết bị; không lưu, tải lên hoặc phát trực tuyến hình ảnh.
- Có hai đáp án hỗ trợ chạm khi camera sẵn sàng; khóa đáp án khi camera tắt, đang kết nối, đang hiệu chỉnh hoặc gặp lỗi.
- Không thêm tài khoản, máy chủ, bảng xếp hạng hoặc thu thập dữ liệu camera.

## 2. Bối cảnh dự án và quyết định tích hợp

Dự án hiện là ứng dụng React + TypeScript + Vite, không phải trang HTML/JavaScript độc lập:

- `src/App.tsx` điều phối màn chơi; Lớp học/Sân trường hiện dùng `scene`, Khu vườn và Thử tài phân loại có state/màn riêng.
- `src/components/TopBar.tsx` hiện có nút mở game phụ, nhưng mode mới cần được thêm vào luồng chọn/chuyển màn cấp cao thay vì đặt như một tiện ích trong thanh công cụ.
- `src/components/ReuseSortingGame.tsx` là game tìm ý tưởng tái sử dụng đồ cũ, **không phải** game chọn thùng hữu cơ/tái chế.
- `src/data/trashItems.ts` và `src/types.ts` là nguồn dữ liệu, kiểu danh mục rác hiện có.
- `src/data/voicePrompts.ts` và `src/utils/audio.ts` quản lý lời thoại/âm thanh.
- `scripts/generate_offline_html.cjs` và `src/utils/offlineAssets.ts` hỗ trợ bản HTML chạy offline.

**Quyết định:** xây dựng một mode mới (ví dụ component `src/components/HeadTiltSortingGame.tsx`) và đăng ký trong điều phối màn chơi của `App.tsx`. Thêm mode vào giao diện chọn/chuyển màn như một lựa chọn ngang hàng với Lớp học, Sân trường, Khu vườn và Thử tài phân loại; không mở từ nút tiện ích trong TopBar dưới dạng modal. Tái sử dụng dữ liệu, danh mục, mascot, lời thoại và phong cách UI sẵn có; không tạo một `index.html` riêng, không cài lại React/Tailwind, và không thay đổi ý nghĩa của game tái sử dụng. Tên tệp và cách tổ chức scene/mode cụ thể có thể chốt khi triển khai.

## 3. Tổng quan kiến trúc và công nghệ

```text
Giao diện chọn/chuyển mode cấp cao
  └─ chọn mode mới
      └─ App.tsx (scene/mode hiện tại, vào/thoát)
          └─ HeadTiltSortingGame.tsx (UI + vòng đời ván chơi)
              ├─ dữ liệu/ảnh: trashItems.ts + manifest asset
              ├─ luật chơi thuần: utils/headTiltSorting.ts
              ├─ nhận diện: hook hoặc module useHeadTiltInput
              │   └─ camera + pose landmarker chạy local
              └─ phản hồi: audio.ts + voicePrompts.ts
```

Màn chơi mới cần được biểu diễn như một giá trị scene/mode riêng trong điều phối ở `src/App.tsx`, với thao tác vào/thoát tương tự các khu vực chơi hiện có. Không gắn trạng thái game này với `isSortingGameOpen`: biến đó hiện mở `ReuseSortingGame`, một trò chơi khác. Khi đang ở mode mới, ẩn UI lớp học/sân trường và các điều khiển chỉ dành cho màn chính; khi thoát, quay lại màn hình chính theo quy ước của các mode hiện có.

### Lựa chọn triển khai

- **UI:** React, TypeScript, Tailwind CSS và `lucide-react` theo quy ước hiện tại.
- **Computer vision:** ưu tiên đánh giá `@mediapipe/tasks-vision` (Pose Landmarker) như dependency được Vite đóng gói. Chốt dependency và model sau khi đo kích thước bundle, độ trễ và độ ổn định trên thiết bị mục tiêu. Không triển khai đồng thời MediaPipe và MoveNet.
- **Dữ liệu và hình ảnh:** dùng `src/data/trashItems.ts` làm nguồn category và ánh xạ hình theo ID. Ưu tiên ảnh rác tương ứng trong `public/images/trash/`; với các vật phẩm có minh họa phù hợp, dùng ảnh trong `public/images/thu-tai-phan-loai/rac-chinh/`. Không giả định hai thư mục có cùng tập ID: cần lập manifest ánh xạ rõ ràng, kiểm tra file tồn tại và chọn fallback hợp lý khi thiếu ảnh.
- **Luật chơi:** tách chọn câu hỏi, phân loại câu trả lời, chuẩn hóa tín hiệu và debounce thành hàm thuần để có thể kiểm thử không cần webcam.
- **Vòng đời camera:** một hook/module chuyên trách xin quyền, tạo model, đọc khung hình và phát tín hiệu đã chuẩn hóa; component game chỉ nhận trạng thái camera và lựa chọn trái/phải.
- **Lưu trữ:** không lưu video, ảnh, landmark hoặc lịch sử nhận diện vào storage. Không cần thay đổi Supabase.

### Rủi ro và điều kiện cần xác minh sớm

- Chế độ này chỉ được phân phối qua bản game deploy trên GitHub Pages; không yêu cầu hỗ trợ hoặc tích hợp vào luồng xuất HTML offline hiện có.
- `getUserMedia` yêu cầu quyền rõ ràng và secure context. GitHub Pages chạy HTTPS phù hợp cho camera trên trình duyệt hỗ trợ, nhưng vẫn cần xử lý quyền bị từ chối, trình duyệt không hỗ trợ và camera bận.
- Model và tài nguyên nhận diện phải được cung cấp qua deploy HTTPS của game. Không tải ảnh/video người chơi lên GitHub hay bất kỳ dịch vụ nào; kiểm tra model được đóng gói/phục vụ ổn định trong production và không làm tăng tải ban đầu của các mode khác.
- Máy yếu, ánh sáng kém, khuôn mặt ngoài khung hoặc camera bận phải có trạng thái dễ hiểu. Camera lỗi hoặc bị tắt phải khóa đáp án, cho phép bật lại hoặc về màn chính, không tự chuyển sang chơi không camera.
- Việc thêm model có thể ảnh hưởng thời gian tải game. Giữ game lazy-loaded; đo kích thước và thời gian tải trước khi quyết định giữ model trong chunk riêng hay tải theo yêu cầu.

## 4. Giao diện và trải nghiệm

### Màn hình vào mode mới

- Tiêu đề: **Nghiêng đầu phân loại rác**; mô tả ngắn: camera chỉ xử lý hình ảnh trên thiết bị.
- Một lựa chọn bắt đầu: **Bật camera**. Khi quyền bị từ chối hoặc camera không khả dụng, hiển thị lỗi và cho phép thử lại hoặc quay về màn chính.
- Trước khi xin quyền, nêu mục đích sử dụng camera và yêu cầu có người lớn hỗ trợ nếu cần.
- Có điều hướng quay về màn hình chính theo pattern chuyển mode hiện tại; không trình bày mode mới như một dialog/modal.

### Màn hình chơi

- Mobile dùng một viewport theo chiều cao động: câu hỏi và ảnh nhỏ ở trên, camera co giãn ở giữa, hai đáp án chạm ở dưới. Không cần cuộn để thấy camera và đáp án; các nút camera thu gọn thành biểu tượng. Màn hình ngang chuyển sang hai cột; desktop giữ khoảng 40% cho câu hỏi/đáp án và 60% cho camera.
- Phản hồi hiện tại của mode này không phát giọng nói: chỉ dùng `playSuccessSfx` khi đúng và `playErrorSfx` khi sai. Giữ đáp án cùng lời giải thích trên màn hình 4 giây rồi tự chuyển câu, kể cả câu cuối trước tổng kết.
- Trả lời đúng có hiệu ứng tung hoa; trả lời sai có mặt buồn và giọt nước mắt nhẹ kèm lời động viên. Tắt các chuyển động này khi người chơi bật `prefers-reduced-motion`; hiệu ứng không chặn điều khiển và được dọn khi chuyển câu hoặc thoát game.
- Khu vực chính hiển thị câu hỏi bằng chữ, rõ và đủ lớn để bé đọc trước khi chọn, ví dụ **“Vỏ chuối thuộc nhóm nào?”**; kèm tên/ảnh vật phẩm, số lượt và điểm. Câu hỏi phải nêu rõ yêu cầu phân loại, không chỉ đưa ảnh rác mà không có hướng dẫn.
- Hai vùng chọn có nhãn, màu sắc và biểu tượng: **Hữu cơ** và **Tái chế**. Không chỉ dựa vào màu để truyền tải đáp án.
- Hiển thị camera lớn nhất trong diện tích còn lại, giữ trọn hình gốc bằng `object-contain`, không cố định tỷ lệ khung hiển thị. Có thể ẩn preview; không cần vẽ skeleton trong phiên bản đầu.
- Hiển thị trạng thái dễ hiểu: “Đang tìm khuôn mặt”, “Hãy nhìn thẳng để bắt đầu”, “Đọc câu hỏi rồi nghiêng sang trái/phải”, “Đã chọn”. Camera chỉ nhận lựa chọn khi lượt chơi đã sẵn sàng; cần có khoảng dừng ngắn để bé đọc câu hỏi trước khi bắt đầu nhận cử động.
- Hai đáp án có nhãn, biểu tượng và vùng chạm rõ ràng; chỉ nhận chạm khi camera sẵn sàng. Bỏ hướng dẫn phím mũi tên, Enter/Space và đoạn hướng dẫn nghiêng đầu dài trên mobile; trạng thái camera ngắn gọn cho biết đang chuẩn bị, về giữa hoặc đang chọn.
- Đúng/sai có chữ, hiệu ứng hình ảnh và âm thanh vui nhộn riêng biệt; giảm chuyển động khi `prefers-reduced-motion` bật.
- Sau phản hồi cho từng lựa chọn, tự động hiện vật phẩm/hình ảnh mới để chọn tiếp bất kể đáp án vừa rồi đúng hay sai; thể hiện rõ lượt mới và không yêu cầu tải lại màn chơi.
- Phản hồi sai theo hướng khích lệ, không phạt điểm: nói/hiện đáp án đúng và một lời giải thích ngắn, tích cực trước khi sang hình tiếp theo. Ví dụ: “Chưa đúng rồi, vỏ chuối là rác hữu cơ vì có thể phân hủy nhé!”
- Khi chọn đúng, cho vật phẩm bay/nảy vào thùng đúng và để Kiến Sáng vui mừng; khi chọn sai, dùng hiệu ứng vui nhẹ, chỉ ra thùng đúng rồi khuyến khích thử câu kế tiếp. Tránh hiệu ứng đỏ gắt, còi báo động hoặc lời chê trách.
- Có nút bật/tắt âm thanh và cho phép chơi tiếp khi tắt tiếng; mọi âm thanh ngắn, không quá lớn và không chồng lặp khi chuyển lượt.
- Hiển thị tiến độ dễ hiểu (ví dụ “Câu 3/8”) và một lời chào mừng khi hoàn thành; không dùng bảng xếp hạng hoặc tạo áp lực phải đạt điểm cao.
- Có nút tắt camera, tạm dừng và thoát; khi game bị che khuất hoặc thoát, dừng camera.

### Trạng thái cần thiết

`intro` → `requesting-camera` → `calibrating` → `playing` → `feedback` → `complete`.

Lỗi quyền/model/thiết bị không hỗ trợ phải có trạng thái riêng kèm thao tác thử lại hoặc về màn chính. Không có phương án chơi không camera. Tạm dừng, tiếp tục và chơi lại đều phải bật camera thành công trước khi nhận đáp án.

## 5. Luồng xử lý Game & AI (Game Loop)

### 5.1 Khởi tạo

1. Người chơi chọn bật camera; chỉ lúc đó mới gọi `navigator.mediaDevices.getUserMedia`.
2. Kiểm tra API, secure context và khả năng truy cập camera; hiển thị lỗi/hướng dẫn cụ thể khi không đáp ứng.
3. Khởi tạo pose landmarker và video. Không xử lý khung hình khi game đã thoát, tạm dừng hoặc tab không hiển thị.
4. Chờ tín hiệu hợp lệ ổn định rồi lấy tư thế trung tính ban đầu. Chỉ mở khóa đáp án khi camera và hiệu chỉnh đã sẵn sàng; không bắt đầu ván mới khi chưa khởi động được camera.

### 5.2 Diễn giải cử động

Mục tiêu hiện tại là nhận **nghiêng đầu sang trái/phải tại chỗ** (roll trong mặt phẳng ảnh), thay cho dịch chuyển ngang mũi so với vai. Việc đổi phép đo này khắc phục trường hợp người chơi đã nghiêng đầu nhưng game không phản hồi. Không suy ra góc nghiêng 3D từ độ lệch mũi.

- Dùng hai landmark mắt của Pose Landmarker (2 và 5), sắp theo tọa độ ngang của ảnh. Tính roll 2D bằng `atan2(deltaY * videoHeight, deltaX * videoWidth)` để không làm sai góc với video khác tỷ lệ. Không yêu cầu mũi hoặc vai phải dịch chuyển.
- Loại frame có mắt thiếu, visibility thấp, nằm ngoài khung hoặc khoảng cách hai mắt quá nhỏ. Hiệu chỉnh bằng 20 khung ổn định liên tiếp; mất tín hiệu hoặc gián đoạn khung hình phải hủy các mẫu chưa đủ.
- Camera preview có thể được phản chiếu cho trải nghiệm quen thuộc; phải ánh xạ trái/phải trong tọa độ landmark nhất quán và kiểm thử trên camera thật. Không đảo hướng bằng phỏng đoán.
- Hiệu chỉnh tư thế trung tính sau khi người chơi ngồi/đứng thoải mái và nhìn thẳng. Ngưỡng vào hiện là 10 độ và ngưỡng về giữa là 5 độ, tính tương đối với roll đã hiệu chỉnh; đây là góc 2D trong ảnh, cần tiếp tục xác minh trên thiết bị mục tiêu.
- Làm mượt tín hiệu ngắn hạn; yêu cầu vượt ngưỡng liên tục trong một khoảng dwell-time trước khi chọn. Dùng ngưỡng vào/ra khác nhau (hysteresis), sau đó khóa lựa chọn cho tới khi trở về vùng trung tính.
- Chỉ phát tối đa một câu trả lời cho mỗi lượt. Sau feedback, yêu cầu trở về tư thế trung tính trước khi nhận lựa chọn tiếp theo.
- Trong khoảng đọc câu hỏi vẫn quan sát tư thế trung tính nhưng không cộng dwell-time hay chốt lựa chọn. Hiển thị tín hiệu nghiêng, hướng đang giữ, tiến độ giữ và yêu cầu về giữa để camera không chỉ báo chung chung là đã bật. Khi camera tắt do đổi tab, cho phép bật lại và hiệu chỉnh mà giữ nguyên câu hỏi và điểm.

### 5.3 Vòng chơi

1. Tạo bộ câu hỏi từ dữ liệu rác hiện có; trộn thứ tự, tránh lặp liên tiếp và cân bằng số câu hữu cơ/tái chế khi pool cho phép.
2. Hiển thị câu hỏi dạng chữ (ví dụ “Vỏ chuối thuộc nhóm nào?”), ảnh vật phẩm và hai lựa chọn. Cho bé khoảng dừng để đọc/nhìn câu hỏi trước khi kích hoạt nhận diện cử động; camera hoặc chạm đều gọi cùng một hàm `submitChoice(category)`, có kiểm tra camera sẵn sàng và stream còn hoạt động.
3. Khi có lựa chọn, khóa nhận diện, so sánh với `item.category`, cập nhật điểm/lượt đúng một lần và phát feedback hình ảnh cùng âm thanh vui nhộn phù hợp (đúng/sai). Câu đúng cho hiệu ứng đưa rác vào thùng phù hợp; câu sai nhẹ nhàng hé lộ đáp án và lý do ngắn, không trừ điểm.
4. Sau thời gian feedback ngắn, tự động chuyển sang hình rác mới để chọn tiếp bất kể đáp án đúng hay sai; hiển thị tiến độ và kết thúc ván ngắn với tổng kết tích cực, lời khen nỗ lực và nút chơi lại.
5. Khi tạm dừng, thoát, unmount hoặc gặp lỗi nghiêm trọng: hủy animation/frame callback, dừng mọi `MediaStreamTrack`, đóng model/task và giải phóng tài nguyên video.

### Ý tưởng tăng độ vui nhộn (ưu tiên theo phiên bản)

**Nên có trong phiên bản đầu**

- Tạo cảm giác “giúp Kiến Sáng dọn sạch”: sau đáp án đúng, vật phẩm bay vào đúng thùng và mascot có hoạt ảnh vui; dùng animation ngắn, không cản nhịp câu tiếp theo.
- Biến câu sai thành cơ hội học: hiện đáp án đúng cùng một câu giải thích rất ngắn, động viên bé tiếp tục; không trừ điểm, không đặt lại ván.
- Dùng lời khen nhỏ thay đổi theo tình huống (“Chính xác!”, “Giỏi lắm!”, “Mình thử câu tiếp nhé!”) và tổng kết khen sự cố gắng thay vì chỉ khen điểm.
- Giữ nhịp chơi trẻ em: số câu mỗi ván vừa phải, có tiến độ nhìn thấy được, chuyển câu nhanh nhưng đủ thời gian đọc và xem phản hồi; tránh timer đếm ngược gây áp lực.
- Cân bằng loại rác và tránh lặp hình liền nhau để mỗi lượt tạo cảm giác mới.

**Có thể làm sau khi bản chơi cơ bản ổn định**

- Chuỗi đúng liên tiếp có hiệu ứng nhỏ như sao/lấp lánh; không mất sao đã có khi trả lời sai và không biến chuỗi thành hình phạt.
- Thêm màn hướng dẫn/thử camera ngắn để bé tập nhìn thẳng rồi nghiêng hai bên, có thể bỏ qua hoặc chọn chơi bằng nút.
- Thêm lựa chọn nhân vật/giọng cổ vũ hoặc chủ đề âm thanh nếu có asset phù hợp; không cần thêm hệ thống phần thưởng/lưu tiến độ cho bản đầu.

### 5.4 Quyền riêng tư

- Chỉ yêu cầu quyền sau thao tác chủ động của người dùng.
- Xử lý khung hình trong bộ nhớ trên thiết bị; không chụp, ghi, lưu, upload hoặc gửi hình ảnh/landmark đến API.
- Hiển thị rõ camera đang bật; có nút tắt camera ngay trong game.
- Dừng stream khi rời game và thông báo khi quyền bị từ chối hoặc camera không khả dụng.

## 6. Kế hoạch Các bước Triển khai (Step-by-Step Implementation)

### Bước 1 — Chốt hành vi, mode và kiểm tra khả thi

- Xác nhận đây là mode cấp cao ngang hàng với Lớp học, Sân trường, Khu vườn và Thử tài phân loại; không thay thế các mode hiện tại và không phải modal.
- Chọn cách cử động chính xác (dịch đầu trái/phải), thiết bị mục tiêu, số lượt và luật tính điểm.
- Prototype MediaPipe Tasks Vision trong trang thử nghiệm nội bộ: đo bundle, FPS/độ trễ, quyền camera và hướng trái/phải.
- Xác minh điều kiện HTTPS trên GitHub Pages, trình duyệt và cách phục vụ model/tài nguyên trong production.

**Điều kiện qua bước:** nhận diện ổn định trên ít nhất một thiết bị mục tiêu, thao tác chạm hoạt động khi camera sẵn sàng và xác định được cách xử lý model.

### Bước 2 — Tách luật chơi và dữ liệu

- Đọc `TrashItemDef`/`TRASH_ITEMS`, dùng danh mục `organic | recyclable`.
- Tạo `src/utils/headTiltSorting.ts` cho chọn lượt, đánh giá đáp án và chuyển trạng thái thuần.
- Xác định fallback cho vật phẩm thiếu ảnh hoặc nội dung không phù hợp.
- Viết unit test cho đúng/sai, chọn lượt, không lặp liên tiếp và không tăng điểm hai lần.

### Bước 3 — Xây giao diện camera và thao tác chạm

- Tạo UI mode mới, các trạng thái intro/playing/feedback/complete/error.
- Thêm hai đáp án hữu cơ/tái chế có thể chạm khi camera sẵn sàng. Không thêm luồng chơi không camera hoặc điều khiển chọn đáp án bằng bàn phím. Mobile phải thấy câu hỏi, camera và đáp án trong cùng viewport.
- Tái sử dụng mascot, âm thanh/giọng nói và phong cách giao diện; giữ dữ liệu điểm của game mới độc lập với điểm game chính trừ khi có quyết định sản phẩm khác.
- Phát âm thanh vui nhộn khác nhau cho đúng và sai bằng tiện ích audio hiện có; nếu cần thêm SFX, tích hợp theo pattern asset/audio của dự án, tránh âm lượng đột ngột và không chặn chuyển lượt.
- Sau feedback ngắn, luôn thay ảnh/vật phẩm hiện tại bằng ảnh lượt kế tiếp cho cả đáp án đúng lẫn sai; khóa lựa chọn trong lúc feedback/chuyển lượt để không tính lặp.
- Kiểm tra bố cục trên màn hình nhỏ, focus bàn phím, nhãn truy cập và reduced-motion.

### Bước 4 — Tích hợp nhận diện cử động đầu

- Chỉ thêm dependency đã được đánh giá; tải model theo yêu cầu khi người dùng bật camera.
- Tạo hook/module có API hẹp: trạng thái camera, lỗi, lựa chọn đã ổn định, `start`, `stop`, `calibrate`.
- Triển khai lọc landmark, hiệu chỉnh neutral, ngưỡng chuẩn hóa, smoothing, dwell-time, hysteresis và khóa một lựa chọn mỗi lượt.
- Xác minh mapping trái/phải với preview phản chiếu và camera thực.
- Camera/model lỗi phải khóa đáp án và cho phép thử lại hoặc thoát; bật lại trong ván giữ nguyên câu và điểm, còn chơi lại phải khởi động camera thành công rồi mới tạo ván mới.

### Bước 5 — Tích hợp như một mode trong ứng dụng

- Mở rộng điều phối scene/mode trong `src/App.tsx` để mode mới ngang cấp với các khu vực chơi hiện tại; chọn một state/union rõ ràng thay vì lồng thêm boolean game phụ.
- Bổ sung lối vào mode mới ở giao diện chọn khu vực/chuyển mode hiện có; khảo sát `TopBar` và các background/điểm điều hướng để đặt nút đúng vị trí, không biến mode thành modal.
- Lazy-load phần game và model để tránh tăng tải màn chơi ban đầu; giữ trạng thái loading/thoát nhất quán.
- Bảo đảm camera được dừng khi đóng game, chuyển route/trạng thái hoặc unmount.
- Thêm lời thoại vào `src/data/voicePrompts.ts` chỉ khi thật sự cần ID prompt mới; cập nhật test/catalogue tương ứng nếu có.

### Bước 6 — Dùng đúng hình ảnh và kiểm tra deploy

- Tạo manifest map từng ID rác sang asset trong `public/images/trash/` hoặc `public/images/thu-tai-phan-loai/rac-chinh/`; ưu tiên hình khớp chính xác tên/vật phẩm.
- Không dùng tự động ảnh `gay_nhieu` hoặc ảnh sản phẩm tái sử dụng làm ảnh rác nếu ngữ cảnh không đúng. Với asset không có đối ứng, dùng icon/fallback hiện hành hoặc loại vật phẩm khỏi pool của mode.
- Kiểm tra đường dẫn có hoạt động với relative asset base của Vite/GitHub Pages và bản production; không nối đường dẫn gốc `/images/...` nếu sẽ làm hỏng deploy dưới project subpath.
- Không thêm mode này vào xuất HTML offline; không sửa luồng export nếu không cần thiết cho mode online.
- Kiểm thử quyền bị từ chối, không có camera, camera bận, tải model lỗi, mất landmark, tắt camera giữa lượt, đổi tab và thoát khi đang chạy.

### Bước 7 — Kiểm thử, đo và phát hành

- Unit test hàm luật chơi và bộ xử lý tín hiệu bằng landmark giả lập; không cần quyền camera trong CI.
- Chạy `npm run lint`, test liên quan và `npm run build`.
- Kiểm thử thủ công trên trình duyệt/thiết bị hỗ trợ: camera trước và sau nếu có, ánh sáng tốt/yếu, trái/phải, khoảng cách và người đeo kính.
- Đo tải ban đầu, thời gian tải model, độ phản hồi và kích thước bundle. Chỉ đưa vào mặc định khi không làm chậm các màn chơi khác đáng kể.

## 7. Tiêu chí nghiệm thu

- Có thể chọn mode mới từ luồng chọn/chuyển màn cấp cao và quay lại màn hình chính; các mode/luồng hiện tại không đổi hành vi.
- Không thể bắt đầu hoặc gửi đáp án khi không cấp quyền camera, camera tắt, đang khởi tạo hoặc đang hiệu chỉnh. Có thể chạm hoặc nghiêng đầu để trả lời sau khi camera sẵn sàng; không chọn bằng phím mũi tên/Enter/Space.
- Trên các viewport mobile mục tiêu, câu hỏi, camera và hai đáp án cùng nhìn thấy mà không cuộn; không có chữ hoặc nút bị cắt, cả chiều dọc và chiều ngang.
- Khi có camera, một cử động ổn định chỉ tạo tối đa một lựa chọn; không chọn liên tục khi giữ đầu lệch.
- Trái/phải đúng với hướng dẫn nhìn thấy trên màn hình; tín hiệu thiếu tin cậy không tính là đáp án.
- Mỗi lượt có câu hỏi bằng chữ dễ đọc, nêu rõ vật phẩm và yêu cầu chọn nhóm; bé có thời gian đọc trước khi đầu vào camera được kích hoạt.
- Đáp án dùng đúng nhóm `organic` hoặc `recyclable`; phản hồi và tổng điểm nhất quán.
- Đáp án đúng và sai đều phát âm thanh vui nhộn tương ứng; sau feedback, hình rác mới xuất hiện và có thể chọn tiếp trong cả hai trường hợp.
- Khi đúng, hiệu ứng trực quan củng cố lựa chọn; khi sai, hiện đáp án và giải thích ngắn một cách khích lệ, không trừ điểm hoặc làm trẻ phải bắt đầu lại.
- Mỗi câu trả lời chỉ phát một lần âm thanh, chỉ cập nhật điểm/lượt một lần và chuyển đúng một lần sang vật phẩm tiếp theo.
- Tiến độ ván hiển thị rõ; kết thúc có lời chúc mừng và lựa chọn chơi lại, không có timer gây áp lực hay bảng xếp hạng.
- Quyền bị từ chối/model lỗi/không có camera có thông báo, nút thử lại và điều hướng về màn chính; không có chế độ chơi thay thế không camera.
- Thoát game dừng video và giải phóng model/stream; không có ảnh hoặc landmark được lưu hay gửi đi.
- `npm run lint`, các test mục tiêu và `npm run build` chạy thành công.
- Game hoạt động trên bản deploy GitHub Pages HTTPS; không yêu cầu hoặc cam kết hỗ trợ mode này trong HTML offline xuất ra.
- Ảnh vật phẩm được map từ `public/images/trash/` và các ảnh rác phù hợp trong `public/images/thu-tai-phan-loai/`; asset thiếu đối ứng có fallback rõ ràng và đã kiểm thử.

## 8. Ngoài phạm vi phiên bản đầu

- Nhận diện tư thế toàn thân, cử chỉ tay, nhiều người chơi hoặc theo dõi người chơi liên tục.
- Gửi camera lên cloud, lưu video, phân tích hành vi hoặc bảng xếp hạng.
- Tự động dùng webcam ngay khi mở ứng dụng.
- Suy ra góc nghiêng đầu 3D hoặc góc cổ thực tế từ phép đo roll 2D trong ảnh.
- Thay thế/di chuyển game tái sử dụng hoặc thay đổi luật phân loại rác hiện có.

## 9. Prompt ban đầu chi tiết

Có thể dùng prompt sau để giao việc triển khai sau khi chốt các điều kiện ở Bước 1:

> Hãy triển khai một mode chơi mới **“Nghiêng đầu phân loại rác”** trong dự án Robot Kiến Sáng hiện tại. Mode này ngang hàng với Lớp học, Sân trường, Khu vườn và Thử tài phân loại; không phải modal/game phụ đè lên mode khác. Trước khi sửa, hãy đọc cấu trúc và quy ước dự án, đặc biệt `src/App.tsx`, `src/components/TopBar.tsx`, `src/components/ClassroomBackground.tsx`, `src/components/YardBackground.tsx`, `src/components/SunlitGardenGame.tsx`, `src/components/ReuseSortingGame.tsx`, `src/data/trashItems.ts`, `src/types.ts`, `src/data/voicePrompts.ts`, `src/utils/audio.ts` và các test liên quan. Đây là React + TypeScript + Vite; không tạo trang HTML độc lập, không viết lại framework và không làm thay đổi hành vi các mode hiện tại.
>
> ### Yêu cầu sản phẩm
>
> 1. Thêm một mode cấp cao có thể vào/thoát theo pattern chuyển màn hiện có. Không dùng `isSortingGameOpen` cho mode mới vì biến đó điều khiển game tái sử dụng.
> 2. Mỗi lượt hiển thị câu hỏi bằng chữ đủ lớn, dễ đọc (ví dụ **“Vỏ chuối thuộc nhóm nào?”**), ảnh/tên vật phẩm và hai lựa chọn **Hữu cơ** / **Tái chế**. Bé cần có thời gian đọc câu hỏi trước khi camera bắt đầu nhận cử động. Dùng đúng kiểu `TrashCategory` (`organic | recyclable`), không tạo category “inorganic”.
> 3. Có màn hình vào game với lựa chọn **Bật camera**. Không xin quyền trước thao tác chủ động. Mode này yêu cầu camera: lỗi hoặc chưa sẵn sàng phải khóa đáp án, cho phép thử lại hoặc thoát. Không có **Chơi bằng nút** khi camera tắt hoặc điều khiển chọn đáp án bằng bàn phím. Khi camera sẵn sàng, hai đáp án hỗ trợ chạm.
> 4. Nếu người chơi bật camera, nhận biết nghiêng đầu sang trái/phải tại chỗ bằng roll 2D trên thiết bị, không tải hình ảnh hoặc landmark lên server và không lưu video. Thể hiện rõ camera đang bật và tín hiệu đang nhận, cho phép tắt hoặc hiệu chỉnh camera bất kỳ lúc nào.
> 5. Dùng chung một hàm xử lý câu trả lời cho camera và thao tác chạm, kiểm tra camera sẵn sàng và stream còn hoạt động. Mỗi lượt chỉ được tính một lần; đáp án đúng/sai có hiệu ứng trực quan và âm thanh vui nhộn riêng biệt. Ưu tiên `playSuccessSfx` / `playErrorSfx` trong `src/utils/audio.ts`; không phát giọng nói. Có nút tắt âm thanh; hiệu ứng âm thanh không chồng lặp.
> 6. Chọn số lượt và luật điểm phù hợp với UI hiện có; giữ điểm mode mới độc lập với điểm game chính. Tránh lặp liên tiếp nếu ngân hàng câu hỏi cho phép.
> 7. Ảnh vật phẩm phải lấy từ `public/images/trash/` và `public/images/thu-tai-phan-loai/`. Tạo mapping rõ ràng theo ID, xác minh ảnh đúng nội dung; không mặc định mọi vật phẩm trong data đều có ảnh cùng tên ở cả hai thư mục. Dùng fallback an toàn nếu thiếu ảnh.
> 8. Sau khi người chơi chọn, khóa đầu vào, phát feedback đúng/sai trong thời gian ngắn, rồi tự động chuyển sang hình/vật phẩm mới để chọn tiếp bất kể câu vừa rồi đúng hay sai. Mỗi lượt chỉ phát một SFX, cập nhật điểm một lần và chuyển hình đúng một lần; kết thúc khi hết số lượt đã định.
> 9. Làm trải nghiệm vui và không gây áp lực: đúng thì vật phẩm bay vào thùng đúng và Kiến Sáng vui; sai thì nhẹ nhàng chỉ đáp án đúng kèm giải thích một câu, không trừ điểm/khởi động lại. Hiển thị tiến độ, cân bằng hai nhóm rác, tránh lặp vật phẩm liền nhau, kết thúc bằng lời khen nỗ lực và nút chơi lại; không dùng timer đếm ngược hoặc bảng xếp hạng.
> 10. Hiệu chỉnh camera trước khi mở khóa đáp án; có thể hiệu chỉnh lại mà không mất tiến độ. Trên mobile, đặt câu hỏi gọn phía trên, camera co giãn ở giữa, đáp án chạm ở dưới để không phải cuộn. Không hiện hướng dẫn bàn phím hoặc thêm chế độ chơi không camera.
>
> ### Yêu cầu kỹ thuật cho camera/AI
>
> - Đánh giá và chỉ dùng một giải pháp pose detection (ưu tiên `@mediapipe/tasks-vision` đóng gói qua Vite); không chèn script CDN tùy tiện, không thêm dependency trước khi kiểm tra bundle và browser support trên GitHub Pages.
> - Camera chỉ khởi tạo sau thao tác người dùng; kiểm tra API/secure context và trình bày lỗi rõ ràng khi quyền bị từ chối, camera bận, không có thiết bị hoặc model không tải được.
> - Tính roll 2D từ đường nối hai mắt, quy đổi tọa độ theo chiều rộng/cao video trước khi dùng `atan2`, rồi hiệu chỉnh tư thế neutral. Không dùng độ lệch mũi-vai hoặc mũi-tai thay cho nghiêng đầu; không tuyên bố đây là góc nghiêng 3D.
> - Bỏ qua landmark thiếu/độ tin cậy thấp; làm mượt; dùng dwell-time, hysteresis, vùng neutral và khóa một lựa chọn cho mỗi lượt. Dùng ngưỡng có thể hiệu chỉnh bằng kiểm thử thay vì mặc định một hằng số chưa đo.
> - Kiểm tra chiều trái/phải nếu preview bị mirror; dùng cùng một quy ước tọa độ cho AI và hướng dẫn UI.
> - Dừng mọi `MediaStreamTrack`, callback vòng lặp và model/task khi tắt camera, tạm dừng, thoát hoặc unmount. Không chạy nhận diện khi tab ẩn.
>
> ### Tích hợp và chất lượng
>
> - Đặt luật chơi thuần và xử lý tín hiệu vào utility dễ unit-test; component chỉ quản lý UI/vòng đời. Lazy-load game/model để không tăng tải ban đầu.
> - Đăng ký mode trong `App.tsx` và thêm lối điều hướng từ giao diện chọn mode/khu vực hiện tại. Mode mới phải hoạt động như một màn chơi độc lập, có luồng quay lại rõ ràng; không mở dưới dạng modal.
> - Dùng ảnh từ `public/images/trash/` và `public/images/thu-tai-phan-loai/` qua manifest có kiểm tra/fallback; xác minh relative URL khi deploy ở GitHub Pages project subpath.
> - Chỉ hỗ trợ deploy game qua GitHub Pages HTTPS cho mode này; không tích hợp hoặc cam kết hỗ trợ trong HTML offline export.
> - Viết test cho đáp án đúng/sai, lựa chọn câu hỏi, chống tăng điểm hai lần, lọc tín hiệu và trường hợp landmark không hợp lệ. Không yêu cầu camera thật trong CI.
> - Chạy `npm run lint`, các test mục tiêu và `npm run build`. Báo cáo file thay đổi, cách kiểm thử, giới hạn trình duyệt/GitHub Pages và số đo bundle/độ trễ nếu có.
>
> ### Giới hạn phạm vi
>
> Không gửi/lưu camera, không tự bật camera, không thêm backend/Supabase, không thay đổi game kéo-thả/ra lệnh/game tái sử dụng, không xây trang HTML độc lập, không tích hợp mode mới vào HTML offline export, và không thêm các tính năng AI khác ngoài nhận biết cử động trái/phải.
