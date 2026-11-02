# Bộ prompt tạo trò chơi Robot Kiến Sáng

Tài liệu này tổng hợp các prompt mẫu theo từng giai đoạn: lên ý tưởng và tạo hình ảnh, chuẩn bị hoạt ảnh, dựng trò chơi bằng GitHub Copilot, chỉnh sửa nội dung và thu giọng lồng tiếng. Có thể sao chép prompt rồi thay phần trong dấu `[ngoặc vuông]`.

## 1. Lên ý tưởng trò chơi và chọn hình ảnh với Gemini

**Prompt:**

> Bạn là chuyên gia thiết kế trò chơi giáo dục cho học sinh lớp 1. Hãy cùng tôi phát triển ý tưởng trò chơi có tên **“Robot Kiến Sáng – Thử tài Phân loại Rác”**.
>
> Mục tiêu: giúp trẻ nhận biết rác hữu cơ và rác có thể tái chế thông qua việc giúp một chú kiến robot dọn lớp học hoặc sân trường. Trò chơi cần đơn giản, vui vẻ, chữ tiếng Việt ngắn gọn, thao tác dễ hiểu và có phản hồi tích cực khi trẻ trả lời sai.
>
> Hãy đề xuất:
> 1. Cốt truyện ngắn, mục tiêu và cách chơi phù hợp với trẻ lớp 1.
> 2. Danh sách vật phẩm rác chia thành hai nhóm: **rác hữu cơ – Thùng Xanh** và **rác tái chế – Thùng Cam**. Chọn những vật quen thuộc, phân loại rõ ràng và giải thích ngắn vì sao.
> 3. Phong cách hình ảnh thống nhất cho Kiến Sáng, vật phẩm rác, hai thùng rác và bối cảnh. Ưu tiên hình minh họa 2D thân thiện, màu sắc tươi sáng, hình dáng rõ khi thu nhỏ.
> 4. Danh sách hình cần tạo, chia thành từng tệp: nhân vật đứng yên; các tư thế/khung hình di chuyển; tư thế cúi nhặt; nhân vật cầm từng món rác; vật phẩm rác riêng lẻ; hai thùng rác; nền lớp học và sân trường.
> 5. Với từng hình, ghi tên tệp đề xuất, kích thước/tỉ lệ, nền trong suốt hay không, góc nhìn, màu sắc và các chi tiết phải giữ nhất quán.
>
> Không tạo chữ, nhãn hoặc logo bên trong hình minh họa. Trước tiên hãy trình bày ý tưởng và bảng danh sách hình để tôi chọn; chưa tạo ảnh cho đến khi tôi xác nhận.

**Sau khi chọn ý tưởng:** chốt một bảng tên tệp và không đổi tên giữa các lần tạo. Ví dụ: `kien-sang-main.png`, `tim_rac_01.png` đến `tim_rac_12.png`, `tim_rac_13.png` đến `tim_rac_15.png`, `cam_banh_mi_01.png` đến `cam_banh_mi_12.png`, `banh_mi.png`, `thung_rac_xanh.png`, `thung_rac_cam.png`.

## 2. Tạo hình Kiến Sáng cúi nhặt rác và hình kết quả

**Chuẩn bị:** gửi Gemini hình Kiến Sáng đã chọn làm ảnh tham chiếu và hình món rác cụ thể, chẳng hạn mẩu bánh mì. Tạo từng tư thế thành tệp riêng, không ghép tất cả vào một bức tranh.

**Prompt:**

> Dùng hai ảnh tham chiếu đã gửi: ảnh thứ nhất là nhân vật **Robot Kiến Sáng**, ảnh thứ hai là **[tên món rác]**. Hãy tạo một bộ 3 hình liên tiếp thể hiện Kiến Sáng cúi xuống nhặt chính món rác đó.
>
> Giữ nguyên nhận diện nhân vật trong ảnh tham chiếu: màu sắc, hình dáng đầu, mắt, râu, thân, tay chân, trang phục và tỉ lệ. Món rác phải giữ đúng màu sắc và hình dáng của ảnh tham chiếu, không thay bằng vật khác.
>
> Ba tư thế theo thứ tự:
> 1. Kiến Sáng phát hiện món rác và bắt đầu cúi xuống.
> 2. Kiến Sáng cúi người, đưa tay chạm và nhặt món rác.
> 3. Kiến Sáng đứng lên, ôm món rác trước người.
>
> Mỗi hình là một ảnh PNG riêng, cùng kích thước khung hình, cùng góc nhìn, nhân vật nằm giữa và có khoảng trống quanh cơ thể để dễ làm hoạt ảnh. Nền trong suốt; không đổ bóng nền, không thêm vật thể, chữ, ký hiệu hoặc viền khung. Tư thế chuyển tiếp nhẹ nhàng, dễ nhìn ở kích thước nhỏ.
>
> Trả kết quả thành 3 ảnh riêng theo thứ tự, đặt tên lần lượt: `[ten_nhan_vat]_nhat_01.png`, `[ten_nhan_vat]_nhat_02.png`, `[ten_nhan_vat]_nhat_03.png`. Không ghép ảnh thành sprite sheet.

**Ảnh kết quả cần kiểm tra:** ba khung hình dùng đúng cùng một nhân vật và món rác; món rác chỉ xuất hiện trong tay ở khung cuối. Nếu tạo khung cuối có sẵn rác trong tay, dùng làm ảnh tham chiếu cho bộ hoạt ảnh cầm rác ở prompt tiếp theo.

## 3. Tạo bộ hình Kiến Sáng cầm rác và đi lại

**Chuẩn bị:** gửi ảnh Kiến Sáng chuẩn và ảnh kết quả Kiến Sáng cầm `[tên món rác]` làm tham chiếu.

**Prompt:**

> Tạo hoạt ảnh đi bộ cho nhân vật Robot Kiến Sáng đang cầm **đúng món [tên món rác]** ở phía trước thân. Dùng các ảnh tham chiếu để giữ nguyên thiết kế nhân vật, trang phục, màu sắc, kích thước và hình dáng món rác.
>
> Tạo **12 khung hình PNG riêng biệt** cho một chu kỳ bước đi mượt, có chuyển động luân phiên của chân và tay. Kiến Sáng giữ món rác chắc chắn trong tất cả các khung; món rác không biến mất, không đổi hình, không đổi tay cầm và không che khuất mặt. Hướng nhìn chếch chính diện; không đổi góc camera. Khung đầu và khung cuối cần nối chu kỳ tự nhiên.
>
> Yêu cầu kỹ thuật: 12 ảnh cùng kích thước và cùng vị trí căn giữa; nền trong suốt; không có bóng nền, chữ, số thứ tự, đường lưới hoặc nhiều bản sao nhân vật trong cùng một ảnh. Mỗi khung hình là một tệp riêng, đặt tên theo thứ tự từ `[prefix]_01.png` đến `[prefix]_12.png`. Ví dụ món bánh mì dùng `cam_banh_mi_01.png` đến `cam_banh_mi_12.png`.
>
> Trước khi xuất, kiểm tra nhanh đủ 12 ảnh, cùng tỉ lệ nhân vật và không có khung nào làm rơi món rác. Nếu không thể xuất thành nhiều tệp, hãy nói rõ thay vì tự ghép thành một ảnh duy nhất.

**Lưu ý:** game sử dụng nhóm `tim_rac_01`–`tim_rac_12` cho hoạt ảnh đi tìm rác, `tim_rac_13`–`tim_rac_15` cho động tác cúi nhặt, và nhóm `cam_[món_rác]_01`–`cam_[món_rác]_12` cho chuyển động khi đang cầm món đó. Cần kiểm tra tên tệp với danh mục trang phục trước khi đưa ảnh vào project.

## 4. Prompt hoàn chỉnh để nhập vào GitHub Copilot dựng trò chơi

**Prompt:**

> Hãy xây dựng một trò chơi web giáo dục bằng tiếng Việt có tên **“Robot Kiến Sáng – Thử tài Phân loại Rác”**, dành cho học sinh lớp 1. Người chơi giúp chú kiến robot nhặt rác trong lớp học và phân loại vào đúng thùng.
>
> **Trước khi sửa mã:** kiểm tra cấu trúc project, thư viện và các thành phần hiện có. Nếu project đã có ứng dụng, hãy tích hợp vào kiến trúc hiện tại, không tạo một ứng dụng thứ hai và không thay thế hàng loạt mã đang hoạt động.
>
> **Yêu cầu gameplay**
> - Có hai nhóm vật phẩm: rác hữu cơ vào **Thùng Xanh**, rác tái chế vào **Thùng Cam**. Mỗi vật phẩm có tên, hình minh họa, nhóm phân loại và lời giải thích ngắn bằng tiếng Việt.
> - Có hai cách chơi: kéo thả rác vào thùng; hoặc chọn món rác và chọn thùng để Kiến Sáng đi nhặt rồi mang rác tới.
> - Hoạt ảnh của Kiến Sáng có các trạng thái đứng yên, đi tìm rác, cúi nhặt, cầm rác đi lại, vui khi trả lời đúng và buồn nhẹ khi trả lời sai. Khi thiếu một khung hình, dùng hình dự phòng phù hợp, không làm mất nhân vật hoặc món rác.
> - Báo đúng/sai bằng âm thanh và phản hồi thân thiện. Không phạt nặng trẻ khi trả lời sai; cho phép thử lại.
> - Có điểm số và trạng thái hoàn thành; hiển thị hướng dẫn ngắn, nút chơi lại và điều khiển dễ dùng trên máy tính bảng/điện thoại.
>
> **Yêu cầu giao diện**
> - Phong cách minh họa 2D vui tươi, tương phản tốt, chữ tiếng Việt lớn, nút dễ chạm, bố cục không che nhân vật hoặc vật phẩm.
> - Có thể dùng nền lớp học và thêm khu vực sân trường nếu phù hợp với cấu trúc project.
> - Hình nhân vật, rác và thùng cần tách riêng để có thể thay ảnh; ưu tiên tài nguyên trong `public/` hoặc cơ chế quản lý asset hiện có.
>
> **Yêu cầu kỹ thuật**
> - Dùng đúng framework, quy ước, công cụ kiểm tra và cấu trúc thư mục của project.
> - Tách dữ liệu vật phẩm và quy tắc game khỏi phần giao diện khi project có sẵn các module tương ứng.
> - Bảo đảm giao diện hoạt động khi thiếu tài nguyên âm thanh hoặc hình ảnh tùy chỉnh; không để lỗi làm treo game.
> - Giữ các tính năng và cách lưu dữ liệu hiện có. Không thêm dịch vụ, API key hoặc dependency mới nếu chưa cần thiết.
> - Sau khi hoàn tất, chạy kiểm tra TypeScript/lint, test phù hợp và build hiện có; sửa lỗi do thay đổi gây ra. Nêu rõ file đã đổi, cách chạy và kết quả kiểm tra.
>
> Hãy triển khai một phiên bản đầu tiên có thể chơi được, sau đó mở trò chơi ở trình duyệt và chụp ảnh màn hình toàn bộ giao diện đầu tiên. Lưu ảnh vào `[đường_dẫn_ảnh_màn_hình]` nếu môi trường hỗ trợ; nếu không, hướng dẫn tôi cách chụp và không khẳng định đã tạo ảnh.

**Ảnh màn hình kết quả ban đầu:** chèn ảnh chụp trang đầu tiên có nhân vật, khu vực chơi, các món rác và hai thùng vào đây sau khi chạy game. Gợi ý tên tệp: `docs/images/man-hinh-ban-dau.png`. Ảnh này là tư liệu ghi nhận kết quả thực tế; không dùng hình do AI tưởng tượng thay cho ảnh chụp ứng dụng đang chạy.

## 5. Ba prompt chỉnh sửa giao diện và nội dung bằng Copilot

### 5.1. Thêm mây vào khu vườn

> Hãy bổ sung các đám mây trang trí chuyển động chậm ở nền trời của màn chơi **Khu Vườn nắng ấm**. Trước khi sửa, tìm đúng component nền và cách bố trí cảnh hiện tại. Mây cần có kích thước/vị trí đa dạng, chuyển động nhẹ, tự co giãn trên màn hình nhỏ và không chặn thao tác chạm, kéo hoặc điều khiển Kiến Sáng. Không làm thay đổi luật chơi, tốc độ nhân vật hay vùng va chạm. Tận dụng CSS và tài nguyên có sẵn; tránh thêm dependency. Kiểm tra TypeScript và test phù hợp, rồi mô tả ngắn phần đã đổi.

### 5.2. Làm rõ hướng dẫn và phản hồi cho trẻ

> Hãy cải thiện phần hướng dẫn trong màn chơi để học sinh lớp 1 hiểu ngay cách chơi. Viết lại câu chữ bằng tiếng Việt ngắn, thân thiện; làm nổi bật thao tác **chọn rác → chọn thùng** hoặc **kéo rác vào thùng**, cùng ý nghĩa Thùng Xanh/Thùng Cam. Khi trả lời sai, khuyến khích bé thử lại và đưa gợi ý phân loại phù hợp. Giữ nguyên logic và các ID giọng nói/asset đang được sử dụng; nếu cần đổi câu thoại, kiểm tra cập nhật đồng bộ dữ liệu, giao diện và kiểm thử liên quan. Đảm bảo hướng dẫn không che khu vực chơi trên điện thoại.

### 5.3. Bổ sung một món rác mới

> Hãy thêm món rác **[tên món]** vào trò chơi và xếp vào nhóm **[hữu cơ / tái chế]**. Giải thích bằng một câu ngắn, chính xác và phù hợp với học sinh lớp 1; gợi ý tên tệp ảnh ổn định theo quy ước hiện tại. Trước khi sửa, kiểm tra danh mục rác, cách chọn rác, lời thoại, hình dự phòng và các kiểm thử hợp đồng đang có. Cập nhật mọi nơi bắt buộc nhưng không đổi ID cũ, không làm sai số lượng hoặc chu kỳ rác hiện hành, và không đưa món mới vào cảnh khác nếu cảnh đó có danh mục riêng. Chạy test liên quan và báo cáo các file đã cập nhật.

## 6. Prompt thu và ghép giọng các bạn cho Kiến Sáng

**Prompt chuẩn bị lời thoại:**

> Hãy biên tập lời thoại lồng tiếng cho nhân vật **Robot Kiến Sáng** trong trò chơi phân loại rác dành cho học sinh lớp 1. Dùng tiếng Việt tự nhiên, câu ngắn, phát âm rõ, thân thiện và động viên. Tạo danh sách theo tình huống: chào bé, hướng dẫn cách chơi, bé chọn rác, Kiến Sáng nhặt rác, trả lời đúng, trả lời sai và thử lại, chiến thắng. Mỗi câu nên đọc được trong khoảng 2–5 giây. Giữ lời giải thích phân loại chính xác; không chê trách trẻ. Trình bày thành bảng gồm mã câu thoại, tình huống, câu đọc và tên tệp âm thanh đề xuất. Không tạo giọng giả mạo người thật.

**Prompt tổ chức buổi thu:**

> Hãy tạo hướng dẫn thu âm cho nhóm học sinh tình nguyện lồng tiếng Kiến Sáng. Chia lời thoại thành từng câu riêng, ghi rõ mã câu và cảm xúc cần thể hiện (vui, bình tĩnh, khích lệ). Hướng dẫn các bạn đọc rõ, tốc độ vừa phải, giữ khoảng cách ổn định với micro, thu ở nơi yên tĩnh và thu lại nếu vấp. Không ghép nhiều câu vào một tệp vì game cần âm thanh riêng cho từng tình huống. Không dùng hoặc chia sẻ bản ghi của bạn nào nếu chưa có sự đồng ý của bạn đó và phụ huynh/người giám hộ.

**Cách thực hiện trong game:** mở **Phòng Thu Lồng Tiếng Bạn Kiến Sáng**, chọn tình huống/câu thoại, bấm thu, đọc câu trên màn hình, nghe thử và lưu áp dụng. Có thể thu lại từng câu; lưu cấu hình giọng trên thiết bị. Nếu đưa tệp âm thanh lên bản chia sẻ công khai, chỉ dùng bản ghi đã được đồng ý rõ ràng và tránh thông tin cá nhân.

**Mẫu 6 câu đọc thử:**

| Tình huống | Câu thoại mẫu |
|---|---|
| Chào bé | “Chào bạn nhỏ! Cùng Kiến Sáng dọn sạch lớp học nhé!” |
| Hướng dẫn | “Bé chọn một món rác rồi chọn chiếc thùng phù hợp nhé!” |
| Nhặt rác | “Kiến Sáng đang nhặt món rác này đây!” |
| Trả lời đúng | “Hoan hô! Đúng rồi bạn ơi!” |
| Trả lời sai | “Ôi, chưa đúng rồi. Bé thử lại nhé!” |
| Chiến thắng | “Tuyệt vời! Mình đã cùng nhau dọn sạch rồi!” |

## 7. Danh sách kiểm tra trước khi dùng prompt

- Đã chọn một ảnh tham chiếu chuẩn của Kiến Sáng và giữ nhất quán giữa các lần tạo.
- Mỗi khung hoạt ảnh là một tệp riêng, cùng kích thước, căn giữa và có nền trong suốt.
- Tên tệp khớp với ID trong game; ảnh món rác cầm tay khớp chính xác với món rác được chọn.
- Prompt Copilot yêu cầu xem cấu trúc project trước khi sửa, bảo toàn tính năng hiện có và chạy kiểm tra sau thay đổi.
- Ảnh màn hình trong tài liệu là ảnh chụp ứng dụng thực tế sau khi chạy, không phải ảnh minh họa được AI dựng.
- Chỉ thu âm và công khai giọng nói của trẻ khi có sự đồng ý phù hợp; không đưa bản ghi riêng tư lên kho tài nguyên chia sẻ công khai.
