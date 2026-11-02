# Đặc tả cải tiến: Tái sử dụng và thử tài phân loại rác

**Trạng thái:** Đã triển khai cả hai cải tiến; nên rà soát các ánh xạ sản phẩm cùng giáo viên/người lớn trước khi dùng rộng rãi
**Dự án:** Robot Kiến Sáng – Thử tài Phân loại Rác  
**Đối tượng chính:** Trẻ nhỏ, đặc biệt học sinh lớp 1, có thể tự chơi trên máy tính hoặc thiết bị cảm ứng.

Tài liệu này mô tả hai cải tiến đã thống nhất: thêm gợi ý tái sử dụng vào màn chơi lớp học hiện tại và bổ sung một màn chơi mới để bé nối rác với các sản phẩm có thể được sáng tạo từ rác đó.

## 1. Mục tiêu và nguyên tắc

### Mục tiêu

- Giúp bé không chỉ nhận biết nhóm rác mà còn nghĩ đến cách tận dụng một số vật liệu đã qua sử dụng.
- Giữ nhịp của màn chơi lớp học hiện tại; gợi ý là tùy chọn quan sát, không tạo thêm bước bắt buộc.
- Tạo một màn chơi riêng để bé suy nghĩ, nối lựa chọn và tự sửa đáp án.
- Bảo đảm hướng dẫn và phản hồi đủ rõ để bé có thể chơi mà không cần người lớn giải thích từng bước.

### Nguyên tắc nội dung

- Màn mới tập trung vào **tái sử dụng hoặc sáng tạo đồ mới từ vật đã qua sử dụng**, không mô tả quy trình tái chế công nghiệp bằng công nghệ, kỹ thuật hoặc hóa học.
- Dùng câu chữ chính xác, gần gũi với trẻ. Ví dụ: “Từ chai nhựa sạch, mình có thể làm chậu cây” thay vì gọi việc đó là tái chế.
- Một ý tưởng được đưa vào đáp án cần khả thi, an toàn khi diễn đạt cho trẻ và được người lớn/giáo viên rà soát.
- Các sản phẩm trong bộ đáp án là những ý tưởng minh họa, không hàm ý rằng đó là cách duy nhất để sử dụng vật liệu.
- Không dùng hình hoặc hướng dẫn khuyến khích trẻ tự cắt, đục, nung, dùng hóa chất, thao tác với cạnh sắc hay tự xử lý vật bẩn. Nếu ý tưởng cần người lớn hỗ trợ, phải thể hiện rõ điều đó.

## 2. Cải tiến 1: Gợi ý tái sử dụng trong màn chơi lớp học

### Mô tả

Trong màn chơi Lớp học: Khi bé bỏ **đúng một món thuộc nhóm rác tái chế** vào thùng tương ứng, màn chơi hiển thị thêm một thẻ gợi ý nhỏ gồm hình ảnh sản phẩm có thể được tạo ra hoặc tái sử dụng từ món rác vừa thả và một câu ngắn.

Ví dụ minh họa:

- Vỏ chai nhựa → hình chậu cây; câu: “Chai nhựa sạch có thể làm chậu cây.”
- Vỏ hộp giấy → hình hộp đựng đồ; câu: “Hộp giấy có thể dùng để đựng đồ.”

Đây là gợi ý về **tái sử dụng/sáng tạo**, không phải khẳng định về quy trình tái chế vật liệu.

### Hành vi và nhịp chơi

- Chỉ hiện gợi ý sau khi trả lời đúng với một món rác có nội dung gợi ý đã được duyệt.
- Không hiện gợi ý khi bé bỏ sai thùng, hoặc khi món rác không có ý tưởng tái sử dụng phù hợp.
- Không mở modal, không yêu cầu bé bấm nút để đóng và không tạm dừng hoặc trì hoãn việc chơi.
- Gợi ý tự biến mất sau vài giây. Thời gian ban đầu đề xuất khoảng 3 giây và cần được thử với trẻ để điều chỉnh.
- Không phát lời thoại mới cho thẻ gợi ý. Âm thanh khen đúng hiện có tiếp tục hoạt động như bình thường, tránh chồng thêm giọng nói.
- Không thay đổi điểm số, điều kiện thắng, thao tác kéo thả/ra lệnh hoặc thời gian chuyển lô rác hiện tại.
- Nếu có gợi ý mới trong lúc thẻ trước còn hiển thị, thẻ mới thay nội dung và bắt đầu lại thời gian tự ẩn; không xếp hàng các thẻ khiến thông tin kéo dài và che màn chơi.

### Trình bày

- Thẻ nhỏ, dễ đọc, có hình sản phẩm rõ ràng và một câu đơn giản.
- Đặt ở vùng bên phía trên thùng rác tái chế(thung_rac_cam) không che món rác tiếp theo, hai thùng, robot hoặc các nút điều khiển.
- Phong cách hình ảnh đồng nhất với ứng dụng, sáng rõ và thân thiện với trẻ.
- Không dựa riêng vào màu để truyền đạt ý nghĩa; câu chữ và hình phải giúp nhận biết nội dung.
- Có mô tả thay thế phù hợp cho ảnh để hỗ trợ công nghệ đọc màn hình.

### Dữ liệu gợi ý

Mỗi món rác có gợi ý nên có dữ liệu riêng, gồm tối thiểu:

- ID món rác hiện có.
- Tên sản phẩm/ý tưởng bằng tiếng Việt.
- Câu gợi ý ngắn.
- Đường dẫn ảnh sản phẩm.
- Văn bản thay thế cho ảnh.
- Ghi chú an toàn hoặc ghi chú cần người lớn hỗ trợ, nếu có.

Không suy ra gợi ý chỉ từ tên hoặc hình món rác. Món không có ánh xạ nội dung hợp lệ thì không hiển thị thẻ.

### Cải tiến 1 đã triển khai

- Dữ liệu ở [reuseHints.ts](../src/data/reuseHints.ts), thẻ ở [ReuseHintCard.tsx](../src/components/ReuseHintCard.tsx).
- Ánh xạ bảy ID: `giay_cu`, `ong_nhua`, `vo_chai_nhua`, `vo_chai`, `vo_hop_giay`, `vo_hop_sua`, `vo_lon`; dùng ảnh `<id>_taisudung.png` trong `public/images/tai-su-dung`.
- `giay_cu` ở đây là **giầy cũ**, theo nội dung và ảnh đã cung cấp, không phải giấy báo.
- Thẻ hiện 3 giây sau khi phân loại đúng trong lớp học, áp dụng cả kéo thả và nhờ Kiến Sáng. Gợi ý mới thay gợi ý cũ và tính lại 3 giây.
- Thẻ nằm bên phải, phía trên thùng cam; đáy thẻ cách chân tường 0,75 rem về phía trên, theo vùng sàn hiện tại (35% trên máy tính, 52% trên thiết bị cảm ứng), không neo vào mép trên màn chơi.
- Không thêm âm thanh, modal, điểm hoặc thời gian chờ. Gợi ý đang hiện vẫn tự ẩn đúng hạn nếu bé thả sai hoặc phân loại món không có gợi ý; không tạo gợi ý mới trong các trường hợp này.
- Xóa gợi ý khi chơi lại, đổi cảnh, vào/ra khu vườn hoặc mở màn chiến thắng.
- Hiển thị ghi chú nhờ người lớn hỗ trợ với các ý tưởng cần gia công hoặc có cạnh sắc; ảnh có văn bản thay thế.
- Bản HTML offline đóng gói cả bảy ảnh bằng [generate_offline_html.cjs](../scripts/generate_offline_html.cjs). Tạo lại bản offline sau khi cập nhật mã bằng `node scripts/generate_offline_html.cjs`.
- Kiểm thử: `node --import tsx --test tests/reuseHints.test.ts`.

## 3. Cải tiến 2: Màn chơi mới “Thử tài phân loại rác”

### Ý tưởng tổng quát

Đây là một màn chơi riêng, không thay thế màn chơi lớp học hiện tại. Màn chơi dùng bối cảnh **góc sáng tạo vui vẻ, sinh động và tươi sáng**; không sử dụng nhà máy làm hình nền vì nội dung tập trung vào tái sử dụng/sáng tạo đồ mới.

Mỗi lượt hiển thị một món rác và sáu hình sản phẩm. Bé nối món rác với bất kỳ sản phẩm nào bé cho là phù hợp, sau đó bấm **Kiểm tra**. Mỗi lượt có ba đáp án đúng và ba sản phẩm gây nhiễu đã được xác định trước. Bé có thể nối từ một đến cả sáu sản phẩm trước khi kiểm tra; không cần đoán đúng số lượng ngay từ đầu.

### Luồng chơi

1. Bé mở màn chơi “Thử tài phân loại rác” bằng nút bấm cùng hàng, bên cạnh nút Nhờ Kiến Sáng
2. Trò chơi hiển thị hướng dẫn ngắn bằng chữ và/hoặc hình minh họa thao tác.
3. Trò chơi chọn ngẫu nhiên năm nhóm khác nhau từ thư viện mười loại rác chính, rồi xáo thứ tự năm lượt; một nhóm không lặp lại trong cùng một ván.
4. Trên màn hình có một món rác chính, sáu sản phẩm lựa chọn và các đường nối.
5. Bé nối món rác với một hoặc nhiều sản phẩm mà bé cho là phù hợp.
6. Trước khi kiểm tra, bé có thể gỡ hoặc thay đổi đường nối.
7. Bé bấm **Kiểm tra** để nhận phản hồi cho các lựa chọn hiện tại.
8. Đáp án đúng được giữ lại. Lựa chọn sai được đánh dấu để bé sửa; bé có thể gỡ/nối lại rồi bấm **Kiểm tra** lần nữa.
9. Nếu còn đáp án đúng chưa được chọn, lượt chưa hoàn thành. Trò chơi nhắc ngắn gọn để bé tiếp tục tìm, nhưng không tự vẽ đáp án còn thiếu.
10. Lượt hoàn thành khi bé đã nối đủ cả ba sản phẩm đúng và không còn lựa chọn sai. Trò chơi chuyển sang loại rác tiếp theo.
11. Sau khi hoàn thành đủ năm lượt, trò chơi hiện màn kết thúc và cho bé chọn chơi lại hoặc quay về màn trước.

### Luật nối và chấm đáp án

- Mỗi lượt có đúng một món rác chính và sáu sản phẩm riêng biệt.
- Trong sáu sản phẩm có ba sản phẩm được xác định là phù hợp với món rác và ba sản phẩm gây nhiễu.
- Bé được nối số lượng tùy ý từ một đến sáu, rồi bấm **Kiểm tra**.
- Trước khi bấm kiểm tra, đường nối dùng trạng thái trung tính để thể hiện lựa chọn chưa được chấm.
- Sau khi kiểm tra:
  - Đường nối đúng chuyển màu xanh và được giữ lại.
  - Đường nối sai chuyển màu đỏ, kèm dấu hiệu/câu chữ để bé nhận ra cần sửa.
  - Đáp án đúng chưa được chọn không bị lộ bằng đường nối màu xanh hoặc chỉ dẫn trực tiếp.
- Đường nối sai có thể được gỡ và nối lại. Đáp án đúng đã xác nhận được giữ nguyên để tránh bắt bé làm lại phần đã đúng.
- Bé không bị trừ điểm hoặc loại khỏi lượt vì thử sai.
- Nút **Kiểm tra** chỉ chấm các đường nối hiện tại; thao tác sửa lựa chọn sau đó yêu cầu bé bấm lại nút.
- Khi bé đã nối đủ ba đáp án đúng và không có lựa chọn sai, lượt tự hoàn thành sau phản hồi ngắn; không bắt bé bấm thêm nút xác nhận nếu không cần thiết.

### Phản hồi bằng lời và hình ảnh

- Phản hồi đúng ngắn, tích cực, ví dụ: “Bé giỏi lắm!”
- Phản hồi khi có đáp án sai nhẹ nhàng, không chê bai, ví dụ: “Bé thử lại nhé!”
- Không phát một câu thoại lặp lại cho từng đường nối nếu bé chọn nhiều sản phẩm trong cùng một lần kiểm tra.
- Giới hạn âm thanh để nhiều phản hồi không phát chồng lên nhau.
- Màu xanh/đỏ luôn đi kèm hình dạng, biểu tượng hoặc lời nhắc, để trẻ không phải dựa riêng vào phân biệt màu sắc.
- Không dùng hiệu ứng nhấp nháy mạnh hoặc chuyển động làm bé khó theo dõi đường nối.

### Hướng dẫn tự chơi

Hướng dẫn đầu tiên cần nói rõ ba việc bằng từ ngữ đơn giản:

1. Nối món rác với các sản phẩm bé nghĩ có thể làm hoặc sử dụng từ món đó.
2. Bé có thể nối nhiều hình, rồi bấm **Kiểm tra**.
3. Nếu có đường nối đỏ, bé sửa lại rồi bấm **Kiểm tra** lần nữa.

Có thể dùng một lượt mẫu ngắn hoặc hình minh họa thao tác, nhưng không nên bắt bé đọc một đoạn hướng dẫn dài trước khi chơi.

### Bố cục và thao tác

- Một khu vực hiển thị món rác chính, đủ lớn để nhận biết.
- Một khu vực hiển thị sáu hình sản phẩm, không hiện tên/số thứ tự hoặc viền/nền riêng cho từng hình; bố trí rõ ràng, không chồng lấp.
- Món chính ở giữa với vị trí cố định; sáu hình lựa chọn tỏa xung quanh và được xáo vào các ô khác nhau, không đè lên nhau.
- Hình món chính và các hình lựa chọn được thu nhỏ để chừa khoảng thở; món chính có ánh sáng xanh nhẹ để dễ nhận diện.
- Đầu mũi tên kết thúc sát mép hình đích; dấu X/đánh dấu đúng nằm sát cạnh đường nối, không ở góc xa của hình.
- Nút **Kiểm tra** luôn hiển thị và có thể bấm bất cứ lúc nào trong lượt.
- Hiển thị tiến độ, ví dụ `2/5`, để bé biết đã chơi đến lượt nào.
- Bố cục đáp ứng cả màn hình máy tính và điện thoại/máy tính bảng.
- Trên máy tính, khi kéo từ món chính chỉ có mũi tên đi theo con trỏ; hình món chính đứng yên.
- Trên thiết bị cảm ứng, hỗ trợ thao tác chạm món rác rồi chạm sản phẩm, hoặc cách tương đương đủ dễ dùng; không yêu cầu thao tác kéo thật chính xác.
- Vùng bấm/chạm đủ lớn cho trẻ; văn bản nhãn không che hình.
- Nếu có nhiều đường nối, đường mới không che mất sản phẩm hay làm bé khó phân biệt điểm bắt đầu/kết thúc.

### Chọn lượt và tiến độ

- Thư viện có mười loại rác chính; mỗi ván chọn ngẫu nhiên năm loại khác nhau, không lặp.
- Thứ tự của năm loại được xáo trộn khi bắt đầu ván mới; chơi lại sẽ chọn và xáo lại.
- Sáu sản phẩm trong một lượt không trùng nhau.
- Ba sản phẩm đúng luôn thuộc bộ ý tưởng đã duyệt của món rác đó.
- Ba sản phẩm gây nhiễu của mỗi lượt được chọn từ bộ gây nhiễu đã duyệt, bảo đảm không hợp lý với món rác hiện tại và không trùng nhau trong lượt.
- Vị trí sáu sản phẩm nên được xáo trộn để đáp án không luôn ở cùng một vị trí.
- Khi bé chơi lại, thứ tự rác và vị trí sản phẩm nên được xáo trộn lại.
- Không áp dụng điểm số của màn lớp học cho màn mới trừ khi có yêu cầu riêng; màn mới có tiến độ riêng và kết thúc riêng.

### MVP đã triển khai

- Nút **Thử tài phân loại rác** mở màn chơi riêng cạnh các chế độ chơi lớp học.
- Màn hướng dẫn giải thích cách nối, kiểm tra và sửa; mỗi ván chọn ngẫu nhiên năm trong mười nhóm, không lặp.
- Mỗi lượt có sáu tranh đã xáo trộn: ba ý tưởng tái sử dụng và ba hình gây nhiễu. Bé có thể chạm để nối hoặc kéo từ món đồ; khi kéo, chỉ mũi tên đi theo con trỏ, hình món đồ đứng yên.
- Món đồ chính cố định ở giữa và có ánh sáng xanh nhẹ; sáu lựa chọn tỏa xung quanh, hình được thu nhỏ, chỉ hiển thị tranh, không có nhãn tên, số thứ tự, viền hoặc nền riêng. Vị trí được xáo trộn trong các ô riêng biệt, không chồng nhau.
- Đường nối kết thúc sát mép hình đích; dấu X đỏ và dấu đúng đặt cạnh đường nối để dễ thấy mối liên hệ với lựa chọn.
- Đáp án đúng được khóa lại sau khi kiểm tra; lựa chọn sai có thể gỡ và chọn lại. Lượt chỉ chuyển khi đủ ba đáp án đúng và không còn lựa chọn sai.
- Nút **Kiểm tra** luôn bật; nếu chưa nối hình, trò chơi nhắc bé chọn trước. Sau khi sửa lựa chọn, bé bấm kiểm tra lại để hoàn tất lượt.
- Màn có tiến độ riêng, phản hồi bằng chữ/biểu tượng, màn kết thúc, chơi lại và quay về màn chính; không dùng điểm của lớp học.
- Manifest tên, văn bản thay thế, ánh xạ tranh và lưu ý an toàn nằm trong `src/data/sortingGame.ts`; bố cục sáng được tạo bằng CSS.
- Ảnh SVG được nhúng vào bản HTML offline trong `scripts/generate_offline_html.cjs`.
- Kiểm thử dữ liệu: `node --import tsx --test tests/sortingGame.test.ts`. Vẫn nên thử trực tiếp trên máy tính/thiết bị cảm ứng và rà soát nội dung cùng người lớn.

## 4. Chuẩn bị nội dung và hình ảnh

### Bộ tài nguyên tối thiểu

- 5 hình món rác chính. Có thể tái sử dụng hình đang có trong ứng dụng nếu phù hợp, đủ rõ và có quyền sử dụng.
- 15 hình sản phẩm đúng: 3 ý tưởng cho mỗi món rác chính.
- 10 hình sản phẩm gây nhiễu.
- Bối cảnh góc sáng tạo vui tươi, có thể tạo bằng CSS thay vì ảnh nền riêng.
- Các biểu tượng/trạng thái cần thiết cho đường nối đúng, sai, chưa kiểm tra, nút kiểm tra và màn kết thúc; có thể dùng thành phần giao diện thay vì tạo ảnh riêng.
- Các ảnh gợi ý nhỏ cho màn chơi lớp học có thể dùng lại 15 hình sản phẩm đúng ở trên.

Thư viện đủ nội dung cho 10 nhóm cần 10 ảnh rác chính, 30 ảnh đáp án đúng (3 cho mỗi nhóm) và đủ ảnh gây nhiễu để chọn ba ảnh cho từng lượt. Mỗi ván chỉ dùng 5 ảnh rác chính, 15 đáp án đúng tương ứng và 15 ảnh gây nhiễu. Nếu cùng một sản phẩm được dùng làm đáp án cho nhiều loại rác, cần xác định rõ ID ảnh dùng chung và bảo đảm tính đúng của từng ánh xạ.

### Kiểm kê tài nguyên đã chuẩn bị

- Ảnh hiện nằm trong `public/images/thu-tai-phan-loai/`:
  - `rac-chinh/`: 10 ảnh món rác chính và 30 ảnh sản phẩm tái sử dụng.
  - `gay_nhieu/`: 66 ảnh gây nhiễu, tên từ `gay_nhieu_01.svg` đến `gay_nhieu_66.svg`.
- Đã có đủ 10 nhóm rác chính và ba sản phẩm tái sử dụng cho mỗi nhóm; mỗi ván dùng ngẫu nhiên 5 trong số 10 nhóm.
- Các nhóm chính hiện có: `cd`, `chai_nhua`, `cuon_giay`, `giay_vun`, `hop_giay`, `tat_cu`, `vo_chai`, `vo_hop`, `vo_lon`, `vo_lop`.
- Tên file và `id` bên trong SVG đã được chuẩn hóa cho .
- Các file `.svg` mẫu đã kiểm tra có `<image>` với PNG nhúng base64, không phải path vector. Trình duyệt tải và hiển thị trực tiếp được; chất lượng phóng lớn bị giới hạn bởi độ phân giải PNG nhúng. Có thể dùng nguyên file trong game, không cần chuyển thành path; nếu tối ưu sau này, cân nhắc lấy PNG nhúng làm asset trực tiếp và giữ tên/ID ổn định.
- Đã kiểm tra trực quan bộ ảnh món chính, ảnh tái sử dụng và ảnh gây nhiễu; màn chơi dùng trực tiếp các SVG này và tạo nền góc sáng tạo bằng CSS.

**Đánh giá sẵn sàng:** Màn chơi và manifest MVP đã có; bộ ảnh cung cấp 10 nhóm rác, 30 ý tưởng tái sử dụng và 66 hình gây nhiễu. Manifest gán ba hình gây nhiễu cụ thể cho từng nhóm để lượt chơi có sáu lựa chọn riêng biệt. Tên, văn bản thay thế và các lưu ý an toàn đã được thêm; giáo viên/người lớn nên rà soát tính phù hợp của từng ánh xạ trước khi sử dụng rộng rãi.

### Tiêu chí hình ảnh

- Cùng phong cách minh họa, bảng màu và mức độ chi tiết.
- Sản phẩm nhìn rõ ở kích thước nhỏ; nền ảnh đơn giản, không làm sản phẩm chìm.
- Các hình trong cùng lượt có tỷ lệ và kích thước hiển thị cân đối.
- Hình nền tạo cảm giác vui vẻ, sáng tạo; tránh chi tiết trang trí ở khu vực đặt sản phẩm và đường nối.
- Không dùng ảnh gây sợ hãi, vật nguy hiểm hoặc sản phẩm yêu cầu trẻ thao tác không an toàn.
- Ưu tiên tài sản do dự án sở hữu/tạo ra hoặc có giấy phép sử dụng rõ ràng.
- Tên file/ID ảnh ổn định, dễ liên kết với dữ liệu nội dung; lưu văn bản thay thế và nguồn tài sản nếu cần.

### Bảng nội dung cần lập trước khi vẽ đủ bộ

Mỗi loại rác chính cần có một dòng/nhóm dữ liệu với các trường:

| Trường | Mô tả |
|---|---|
| ID món rác | ID ổn định trong game |
| Tên hiển thị | Tên ngắn, thân thiện với trẻ |
| Ảnh món rác | Ảnh được dùng trong lượt |
| 3 sản phẩm đúng | Tên, ID ảnh, câu giải thích ngắn cho từng sản phẩm |
| Nguồn/đánh giá nội dung | Người rà soát hoặc ghi chú xác nhận tính phù hợp |
| Lưu ý an toàn | Ghi rõ nếu cần người lớn hỗ trợ; loại bỏ ý tưởng không an toàn |
| Bộ 30 sản phẩm gây nhiễu | ID/nhãn, bảo đảm không gây tranh cãi trong các lượt |
| Gợi ý lớp học | Ảnh và câu ngắn dùng sau khi bỏ đúng vào thùng tái chế |

Tên mười loại rác, tên sản phẩm đúng/gây nhiễu và văn bản thay thế hiện được khai báo trong manifest. Cần rà soát từng ý tưởng để tránh một sản phẩm bị xem là đúng cho quá nhiều loại rác hoặc khiến trẻ phải đoán ý người ra đề.

## 5. Gợi ý cấu trúc dữ liệu

Đây là định hướng nội dung, không phải yêu cầu tên kiểu dữ liệu cuối cùng.

- **Waste item:** ID, tên, ảnh và các thông tin hiển thị.
- **Reuse product:** ID, tên, ảnh, mô tả ngắn, văn bản thay thế và trạng thái an toàn/đã duyệt.
- **Reuse mapping:** ID món rác, danh sách đúng gồm ba sản phẩm, danh sách gây nhiễu hoặc quy tắc lấy gây nhiễu, cùng thông tin cần cho thẻ gợi ý lớp học.
- **Round state:** năm nhóm được chọn ngẫu nhiên từ thư viện mười nhóm, thứ tự đã xáo trộn, món hiện tại, các đường nối do bé tạo, trạng thái chấm gần nhất và tiến độ.

Dữ liệu nên tách khỏi phần vẽ giao diện để có thể rà soát, sửa tên/câu giải thích và thay ảnh mà không phải thay đổi luật chơi. Cần kiểm tra dữ liệu trước khi chạy để phát hiện món rác thiếu đáp án, ID ảnh không tồn tại, trùng sản phẩm trong một lượt hoặc không đủ sản phẩm gây nhiễu.

## 6. Phạm vi và tính tương thích

### Trong phạm vi

- Thẻ gợi ý tái sử dụng không chặn chơi ở màn lớp học.
- Màn chơi riêng “Thử tài phân loại rác”.
- Chọn ngẫu nhiên năm nhóm khác nhau từ mười nhóm; xáo thứ tự lượt và vị trí sản phẩm.
- Hỗ trợ nối, kiểm tra, sửa lựa chọn và thử lại.
- Giao diện tự chơi trên máy tính và thiết bị cảm ứng.
- Tài nguyên mới được đóng gói để dùng trong bản build và bản HTML offline hiện có.

### Ngoài phạm vi ở giai đoạn đầu

- Mô phỏng nhà máy hoặc quy trình tái chế công nghiệp.
- Chế tạo sản phẩm thực tế trong game bằng thao tác nhiều bước.
- Điểm số/phần thưởng liên kết với điểm của màn lớp học.
- Bảng xếp hạng, tài khoản, lưu tiến độ trực tuyến hoặc thu thập dữ liệu hành vi trẻ.
- Công cụ quản trị nội dung mới, trừ khi bộ tài nguyên cần được chỉnh sửa thường xuyên bởi người không sửa mã nguồn.

### Nguyên tắc không làm hỏng chức năng hiện tại

- Không thay đổi cách phân loại hữu cơ/tái chế, hai chế độ chơi, điểm, điều kiện chiến thắng hoặc luồng sân trường hiện có.
- Màn mới có trạng thái, tiến độ và điều kiện kết thúc riêng.
- Tài nguyên mới không được làm mất khả năng chơi offline.
- Nếu một ảnh hoặc dữ liệu gợi ý bị thiếu, màn lớp học vẫn chơi được; không để lỗi tài nguyên làm treo hoặc chặn game.

## 7. Tiêu chí nghiệm thu

### Màn lớp học

- Bỏ đúng món thuộc nhóm tái chế có gợi ý sẽ hiện đúng hình và câu gợi ý gắn với chính món rác đó.
- Gợi ý tự ẩn, không chặn thao tác và không trì hoãn lượt tiếp theo.
- Không có lời thoại mới từ riêng thẻ gợi ý; câu khen hiện có vẫn hoạt động bình thường.
- Bỏ sai hoặc bỏ rác hữu cơ không hiển thị gợi ý tái sử dụng của món khác.
- Thiếu ảnh/gợi ý không làm màn chơi lỗi.

### Màn “Thử tài phân loại rác”

- Bé có thể bắt đầu mà không cần cấu hình hoặc tài khoản.
- Mỗi lượt hiện đúng một món rác và sáu sản phẩm, trong đó có đúng ba đáp án đúng đã duyệt.
- Bé có thể nối một hoặc nhiều sản phẩm trước khi kiểm tra.
- Không chấm lựa chọn trước khi bé bấm **Kiểm tra**.
- Sau khi kiểm tra, đáp án đúng và sai có trạng thái khác nhau, dễ hiểu ngoài phân biệt màu.
- Bé có thể sửa lựa chọn sai và kiểm tra lại; đáp án đúng đã xác nhận không bị mất.
- Chưa nối đủ đáp án đúng thì không tự chuyển lượt và không tiết lộ trực tiếp đáp án còn thiếu.
- Đủ tất cả đáp án đúng, không có lựa chọn sai thì chuyển lượt.
- Mỗi ván có năm nhóm khác nhau được chọn từ mười nhóm; không nhóm nào lặp lại.
- Hoàn thành lượt thứ năm thì hiện kết thúc, có cách chơi lại hoặc quay về.
- Thao tác hoạt động trên máy tính và thiết bị cảm ứng; không có phần tử bị chồng lấp ở kích thước màn hình được hỗ trợ.
- Bản HTML offline vẫn tải được hình nền và toàn bộ hình sản phẩm.

## 8. Kiểm thử đề xuất

### Kiểm thử chức năng

- Mỗi ánh xạ rác-sản phẩm đúng/sai cho kết quả chấm chính xác.
- Chọn thiếu một đáp án đúng: chưa hoàn thành, không tiết lộ đáp án bị thiếu.
- Chọn cả ba đáp án đúng: chuyển lượt.
- Chọn đáp án đúng và đáp án nhiễu: đánh dấu đúng/sai, cho phép sửa và kiểm tra lại.
- Chọn cả sáu: ba đúng được giữ, ba sai có thể gỡ; lượt chỉ hoàn thành khi đã bỏ lựa chọn sai.
- Không tạo được hai đường nối trùng giữa cùng một cặp rác-sản phẩm.
- Không có sản phẩm trùng trong sáu lựa chọn.
- Kiểm tra trường hợp đổi lượt nhanh, âm thanh không phát chồng và gợi ý lớp học không khóa thao tác.
- Kiểm tra tài nguyên thiếu, đường dẫn sai và bản offline.

### Kiểm thử trải nghiệm

Cho trẻ thử không hướng dẫn trực tiếp và quan sát:

- Bé có hiểu cần nối từ món rác đến sản phẩm không?
- Bé có nhận ra mình cần bấm **Kiểm tra** không?
- Bé có hiểu màu/trạng thái đúng và sai, và biết cách sửa không?
- Tên và hình sản phẩm có đủ rõ để bé tự phân biệt không?
- Bé có đọc/quan sát kịp thẻ gợi ý lớp học trước khi nó tự ẩn không?
- Bé có thể thao tác trên màn hình cảm ứng mà không phải kéo quá chính xác không?
- Có hình nào khiến bé hiểu nhầm hoặc có thể xem là đáp án đúng theo cách hợp lý khác không?

Ưu tiên sửa các câu chữ, hình ảnh và luật gây nhầm trước khi thêm nhiều lượt mới.

## 9. Rà soát nội dung và trải nghiệm tiếp theo

1. Giáo viên/người lớn rà soát tính phù hợp của ba ý tưởng đúng và ba hình gây nhiễu trong từng nhóm.
2. Thử với trẻ xem tên và hình sản phẩm có rõ ở kích thước điện thoại hay không; điều chỉnh manifest nếu trẻ hiểu hình theo cách khác.
3. Kiểm tra các ý tưởng cần người lớn hỗ trợ và giữ lưu ý an toàn đi cùng sản phẩm.
4. Thử cách nối, sửa đáp án và phản hồi trên máy tính, điện thoại và máy tính bảng.
5. Thử thời gian tự ẩn thẻ gợi ý lớp học; giá trị hiện tại khoảng ba giây vẫn cần quan sát khi dùng thực tế.

## 10. Thứ tự triển khai đề xuất

1. Hoàn tất manifest nội dung cho mười loại rác và duyệt đáp án.
2. Chuẩn bị một bộ mẫu hoàn chỉnh cho một loại rác: món rác, ba sản phẩm đúng, ba sản phẩm gây nhiễu, câu chữ và hình nền tạm.
3. Làm thử luồng nối, kiểm tra, sửa và chuyển lượt trên một lượt mẫu; thử với trẻ để xác nhận luật tự giải thích được.
4. Hoàn thiện tương tác cảm ứng, trạng thái tiếp cận và kiểm tra màn hình nhỏ.
5. Hoàn thiện thư viện nội dung cho mười nhóm; mỗi ván chơi năm lượt được chọn ngẫu nhiên, xáo thứ tự và có màn kết thúc.
6. Tích hợp thẻ gợi ý lớp học bằng các ảnh sản phẩm đã duyệt.
7. Kiểm thử build, tài nguyên offline, hồi quy màn lớp học và trải nghiệm trên thiết bị mục tiêu.

## 11. ID ghi âm cho bốn màn chơi

Danh mục hiện tại có **98 ID** cho lớp học, sân trường, khu vườn và thử tài phân loại. Xem [đầy đủ ID, tên MP3 và lời thoại cần thu](voice-prompts.md); danh sách được sinh từ [voicePrompts.ts](../src/data/voicePrompts.ts).

Các màn dùng chung `triggerSpeech(text, voiceId)` với ID bắt buộc, kể cả lời chọn rác động. Thử tài phân loại đọc phản hồi nối/gỡ, kiểm tra đúng/sai và hoàn thành; giữ phản hồi hoàn thành lượt 4,5 giây trước khi chuyển lượt để hạn chế cắt câu. Nhấn lời nhắc an toàn để nghe bản thu. Khu vườn đọc hướng dẫn, chế độ, va chạm và kết quả; điểm số biến thiên chỉ hiển thị, không nằm trong bản thu kết quả cố định.

Phòng thu, tài nguyên dùng chung, nhập/xuất JSON và HTML offline đều nhận danh mục mới. Hệ thống Supabase đã triển khai cần chạy lại [setup.sql](../supabase/setup.sql) trước khi upload ID mới. Bản thu chiến thắng lớp học cần đổi thành **20 sao**. Thiếu bản thu hoặc phát lỗi sẽ dùng giọng đọc trình duyệt; các thẻ gợi ý hình ảnh và nhãn giao diện không được tự chuyển thành lời thoại.
