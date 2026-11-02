# Danh sách ID và lời thoại cho cả 4 màn chơi

Có **98 ID**. Nguồn chuẩn: [voicePrompts.ts](../src/data/voicePrompts.ts).
Tạo lại danh sách bằng `node --import tsx scripts/generate_voice_catalog.ts`.

- Mỗi lệnh gọi `triggerSpeech(text, voiceId)` truyền ID tường minh; không dò ID theo nội dung khi phát hoặc nghe lại.
- Đặt bản thu tại `public/voice/<ID>.mp3`, hoặc upload vào `voice/<ID>` trong editor. Phòng thu, JSON và HTML offline dùng chung danh mục này.
- Thiếu bản thu hoặc phát lỗi: dùng giọng đọc trình duyệt. Trình duyệt vẫn có thể chặn autoplay khi chưa có tương tác.
- Chạy lại [supabase/setup.sql](../supabase/setup.sql) để cho phép các ID mới trên hệ thống đã triển khai.
- Phải thu lại `victory.mp3` theo mốc **20 sao** và các câu đã đổi nội dung (đặc biệt `batch_complete.mp3`, `approach_bin.mp3`, `approach_trash.mp3`); file cũ không tự đổi tiếng nói.
- Ba câu khen đúng dùng ba ID riêng để bản thu khớp văn bản; không dùng chung `correct.mp3` cho câu khác nữa.
- Khu vườn đọc kết quả cố định bằng `garden_victory`; số điểm biến thiên vẫn hiển thị riêng trên màn hình, không nằm trong bản thu.
- Thử tài phân loại tự đọc hướng dẫn, phản hồi nối/gỡ/kiểm tra, chuyển lượt và hoàn thành. Lời nhắc an toàn có nút bấm để nghe. Giữ phản hồi hoàn thành lượt 4,5 giây trước khi chuyển lượt để hạn chế ngắt câu.
- `continue_sorting` và `play_area_small` là trạng thái lời nhắc thụ động ở màn chính: có ID lưu cùng lời thoại nhưng không tự phát. Bong bóng và nút nghe lại của robot màn chính hiện đang ẩn; callback nghe lại đã giữ ID tường minh, không thay đổi bố cục để bật lại nút. `selected_unknown` / `picked_unknown` là dự phòng khi thiếu định nghĩa món rác.
- Danh mục là **lời nói/hướng dẫn/phản hồi**, không phải mọi nhãn nút, tên vật phẩm, văn bản mô tả ảnh, thẻ gợi ý tái sử dụng hoặc hiệu ứng âm thanh.

## Câu chung cho lớp học / sân trường (21 ID)

| ID | Tên file | Lời thoại cần thu |
|---|---|---|
| `correct` | `correct.mp3` | Hoan hô! Đúng rồi bạn ơi! |
| `incorrect` | `incorrect.mp3` | Ôi nhầm rồi, bạn thử lại nhé! |
| `correct_great` | `correct_great.mp3` | Tuyệt vời quá! Bé giỏi lắm! |
| `correct_thanks` | `correct_thanks.mp3` | Đúng rồi! Cảm ơn bé nhiều nhé! |
| `victory` | `victory.mp3` | Yeah, 20 sao rồi, lớp mình sạch quá! |
| `yard_welcome` | `yard_welcome.mp3` | Chào bạn nhỏ! Cùng Kiến Sáng dọn sạch sân trường nhé! |
| `yard_victory` | `yard_victory.mp3` | Yeah, 20 sao rồi, sân trường sạch quá! |
| `scene_busy` | `scene_busy.mp3` | Kiến Sáng đang nhặt rác rồi. Hãy hoàn thành lượt này trước khi đổi cảnh nhé! |
| `play_area_small` | `play_area_small.mp3` | Vùng chơi quá nhỏ. Hãy phóng to cửa sổ hoặc giảm kích thước thùng rác rồi chơi lại nhé! |
| `welcome` | `welcome.mp3` | Chào bạn nhỏ! Cùng Kiến Sáng dọn sạch lớp học nhé! |
| `continue_sorting` | `continue_sorting.mp3` | Bé tiếp tục phân loại rác nhé! |
| `batch_complete` | `batch_complete.mp3` | Hoan hô! Đã dọn sạch rác! Cùng tiếp tục nhé! |
| `approach_bin` | `approach_bin.mp3` | Kiến Sáng hãy đi lại gần Thùng Xanh (bên trái) hoặc Thùng Cam (bên phải) rồi nhấn Phím Cách nhé! |
| `approach_trash` | `approach_trash.mp3` | Hãy dùng phím mũi tên ⬅️ ➡️ đi lại gần món rác trên sàn rồi nhấn Phím Cách để nhặt nhé! |
| `select_trash` | `select_trash.mp3` | Bé hãy bấm chọn một món rác trên sàn trước nhé! |
| `bin_unavailable` | `bin_unavailable.mp3` | Chưa xác định được vị trí thùng rác, bạn hãy chọn lại nhé! |
| `mode_drag` | `mode_drag.mp3` | Chế độ: Bé chạm và kéo rác vào thùng, hoặc nhấn giữ chuột để kéo nhé! |
| `mode_command` | `mode_command.mp3` | Chế độ: Bé chạm chọn rác rồi chạm thùng để tớ chạy lại nhặt nhé! |
| `mascot_updated` | `mascot_updated.mp3` | A! Đã nhận đúng ảnh kien-sang-main.png rồi! Cùng dọn lớp với bạn Kiến Sáng nhé! |
| `selected_unknown` | `selected_unknown.mp3` | Bé đã chọn "món rác"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_unknown` | `picked_unknown.mp3` | Kiến Sáng đã nhặt "món rác"! Hãy đưa tới thùng rác thích hợp nhé! |

## Lớp học — chọn và nhặt 15 món rác (30 ID)

| ID | Tên file | Lời thoại cần thu |
|---|---|---|
| `selected_vo_hop_sua` | `selected_vo_hop_sua.mp3` | Bé đã chọn "Vỏ hộp sữa"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_hop_sua` | `picked_vo_hop_sua.mp3` | Kiến Sáng đã nhặt "Vỏ hộp sữa"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_hop_giay` | `selected_vo_hop_giay.mp3` | Bé đã chọn "Vỏ hộp giấy"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_hop_giay` | `picked_vo_hop_giay.mp3` | Kiến Sáng đã nhặt "Vỏ hộp giấy"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_giay_cu` | `selected_giay_cu.mp3` | Bé đã chọn "Giầy cũ"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_giay_cu` | `picked_giay_cu.mp3` | Kiến Sáng đã nhặt "Giầy cũ"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_chai` | `selected_vo_chai.mp3` | Bé đã chọn "Vỏ chai thủy tinh"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_chai` | `picked_vo_chai.mp3` | Kiến Sáng đã nhặt "Vỏ chai thủy tinh"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_ong_nhua` | `selected_ong_nhua.mp3` | Bé đã chọn "Ống nhựa (ống hút)"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_ong_nhua` | `picked_ong_nhua.mp3` | Kiến Sáng đã nhặt "Ống nhựa (ống hút)"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_keo` | `selected_vo_keo.mp3` | Bé đã chọn "Vỏ kẹo (túi nilon)"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_keo` | `picked_vo_keo.mp3` | Kiến Sáng đã nhặt "Vỏ kẹo (túi nilon)"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_lon` | `selected_vo_lon.mp3` | Bé đã chọn "Vỏ lon nước ngọt"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_lon` | `picked_vo_lon.mp3` | Kiến Sáng đã nhặt "Vỏ lon nước ngọt"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_chai_nhua` | `selected_vo_chai_nhua.mp3` | Bé đã chọn "Vỏ chai nhựa"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_chai_nhua` | `picked_vo_chai_nhua.mp3` | Kiến Sáng đã nhặt "Vỏ chai nhựa"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_xuong_ca` | `selected_xuong_ca.mp3` | Bé đã chọn "Xương cá"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_xuong_ca` | `picked_xuong_ca.mp3` | Kiến Sáng đã nhặt "Xương cá"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_dui_ga` | `selected_dui_ga.mp3` | Bé đã chọn "Xương đùi gà"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_dui_ga` | `picked_dui_ga.mp3` | Kiến Sáng đã nhặt "Xương đùi gà"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_dua_hau` | `selected_vo_dua_hau.mp3` | Bé đã chọn "Vỏ dưa hấu"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_dua_hau` | `picked_vo_dua_hau.mp3` | Kiến Sáng đã nhặt "Vỏ dưa hấu"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_banh_mi` | `selected_banh_mi.mp3` | Bé đã chọn "Mẩu bánh mì"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_banh_mi` | `picked_banh_mi.mp3` | Kiến Sáng đã nhặt "Mẩu bánh mì"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_la_cay` | `selected_la_cay.mp3` | Bé đã chọn "Lá cây"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_la_cay` | `picked_la_cay.mp3` | Kiến Sáng đã nhặt "Lá cây"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_chuoi` | `selected_vo_chuoi.mp3` | Bé đã chọn "Vỏ chuối"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_chuoi` | `picked_vo_chuoi.mp3` | Kiến Sáng đã nhặt "Vỏ chuối"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_vo_tao` | `selected_vo_tao.mp3` | Bé đã chọn "Lõi / Vỏ táo"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_vo_tao` | `picked_vo_tao.mp3` | Kiến Sáng đã nhặt "Lõi / Vỏ táo"! Hãy đưa tới thùng rác thích hợp nhé! |

## Sân trường — chọn và nhặt 10 món rác (20 ID)

| ID | Tên file | Lời thoại cần thu |
|---|---|---|
| `selected_yard_flower_petals` | `selected_yard_flower_petals.mp3` | Bé đã chọn "Cánh hoa rụng"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_flower_petals` | `picked_yard_flower_petals.mp3` | Kiến Sáng đã nhặt "Cánh hoa rụng"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_twig` | `selected_yard_twig.mp3` | Bé đã chọn "Cành cây nhỏ"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_twig` | `picked_yard_twig.mp3` | Kiến Sáng đã nhặt "Cành cây nhỏ"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_grass` | `selected_yard_grass.mp3` | Bé đã chọn "Cỏ vừa cắt"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_grass` | `picked_yard_grass.mp3` | Kiến Sáng đã nhặt "Cỏ vừa cắt"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_pine_cone` | `selected_yard_pine_cone.mp3` | Bé đã chọn "Quả thông khô"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_pine_cone` | `picked_yard_pine_cone.mp3` | Kiến Sáng đã nhặt "Quả thông khô"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_acorn` | `selected_yard_acorn.mp3` | Bé đã chọn "Quả sồi khô"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_acorn` | `picked_yard_acorn.mp3` | Kiến Sáng đã nhặt "Quả sồi khô"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_plastic_cup` | `selected_yard_plastic_cup.mp3` | Bé đã chọn "Cốc nhựa"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_plastic_cup` | `picked_yard_plastic_cup.mp3` | Kiến Sáng đã nhặt "Cốc nhựa"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_plastic_lid` | `selected_yard_plastic_lid.mp3` | Bé đã chọn "Nắp hộp nhựa"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_plastic_lid` | `picked_yard_plastic_lid.mp3` | Kiến Sáng đã nhặt "Nắp hộp nhựa"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_plastic_spoon` | `selected_yard_plastic_spoon.mp3` | Bé đã chọn "Thìa nhựa"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_plastic_spoon` | `picked_yard_plastic_spoon.mp3` | Kiến Sáng đã nhặt "Thìa nhựa"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_broken_ruler` | `selected_yard_broken_ruler.mp3` | Bé đã chọn "Thước nhựa gãy"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_broken_ruler` | `picked_yard_broken_ruler.mp3` | Kiến Sáng đã nhặt "Thước nhựa gãy"! Hãy đưa tới thùng rác thích hợp nhé! |
| `selected_yard_food_container` | `selected_yard_food_container.mp3` | Bé đã chọn "Hộp đựng thức ăn nhựa"! Hãy bấm vào thùng rác muốn bỏ nhé! |
| `picked_yard_food_container` | `picked_yard_food_container.mp3` | Kiến Sáng đã nhặt "Hộp đựng thức ăn nhựa"! Hãy đưa tới thùng rác thích hợp nhé! |

## Khu vườn (6 ID)

| ID | Tên file | Lời thoại cần thu |
|---|---|---|
| `garden_intro` | `garden_intro.mp3` | Dùng phím mũi tên, các nút điều khiển hoặc kéo chuột/chạm để đón bánh kẹo, trái cây lấy điểm và né gạch, đá, cành cây nhé! |
| `garden_free` | `garden_free.mp3` | Cùng Kiến Sáng đón món ngon nhé! |
| `garden_challenge` | `garden_challenge.mp3` | Đón đủ 10 món ngon để nhận huy hiệu |
| `garden_hazard` | `garden_hazard.mp3` | Ối! Cẩn thận nhé! |
| `garden_game_over` | `garden_game_over.mp3` | Nghỉ một chút nhé! Lần sau mình nhớ né gạch, đá và cành cây nhé! |
| `garden_victory` | `garden_victory.mp3` | Tuyệt vời, bạn nhỏ! Bạn đã đón đủ món ngon. Tuyệt lắm! |

## Thử tài phân loại (21 ID)

| ID | Tên file | Lời thoại cần thu |
|---|---|---|
| `sorting_intro` | `sorting_intro.mp3` | Mỗi lượt có một món đồ và sáu bức tranh. Bé hãy tìm ba ý tưởng phù hợp nhé. |
| `sorting_start` | `sorting_start.mp3` | Kéo từ món rác đến hình phù hợp, hoặc chạm vào hình để nối. |
| `sorting_removed` | `sorting_removed.mp3` | Đã gỡ lựa chọn. Bé có thể nối hình khác rồi kiểm tra nhé! |
| `sorting_connected` | `sorting_connected.mp3` | Đã nối hình. Bé có thể chọn thêm rồi bấm Kiểm tra. |
| `sorting_select` | `sorting_select.mp3` | Bé hãy nối một hay nhiều hình phù hợp trước nhé! |
| `sorting_retry` | `sorting_retry.mp3` | Bé thử gỡ đường nối có dấu X rồi kiểm tra lại nhé! |
| `sorting_round_complete` | `sorting_round_complete.mp3` | Bé giỏi lắm! Cả ba ý tưởng phù hợp đã được tìm thấy. |
| `sorting_more` | `sorting_more.mp3` | Tốt lắm! Còn ý tưởng phù hợp nữa, bé tìm tiếp nhé! |
| `sorting_continue` | `sorting_continue.mp3` | Bé hãy nối một hay nhiều hình rồi kiểm tra nhé! |
| `sorting_safety` | `sorting_safety.mp3` | Một số ý tưởng cần người lớn hỗ trợ. Mình chỉ quan sát tranh và nhờ người lớn giúp nhé! |
| `sorting_victory` | `sorting_victory.mp3` | Bé giỏi quá! Bé đã tìm được nhiều cách sáng tạo để dùng lại đồ cũ. Nhớ nhờ người lớn giúp với những ý tưởng cần làm thủ công nhé! |
| `sorting_selected_cd` | `sorting_selected_cd.mp3` | Đã chọn Đĩa CD cũ. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_chai_nhua` | `sorting_selected_chai_nhua.mp3` | Đã chọn Chai nhựa. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_cuon_giay` | `sorting_selected_cuon_giay.mp3` | Đã chọn Lõi giấy. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_giay_vun` | `sorting_selected_giay_vun.mp3` | Đã chọn Giấy vụn. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_hop_giay` | `sorting_selected_hop_giay.mp3` | Đã chọn Hộp giấy. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_tat_cu` | `sorting_selected_tat_cu.mp3` | Đã chọn Tất cũ. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_vo_chai` | `sorting_selected_vo_chai.mp3` | Đã chọn Chai thủy tinh. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_vo_hop` | `sorting_selected_vo_hop.mp3` | Đã chọn Vỏ hộp giấy. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_vo_lon` | `sorting_selected_vo_lon.mp3` | Đã chọn Vỏ lon. Bé chạm vào những ý tưởng phù hợp nhé! |
| `sorting_selected_vo_lop` | `sorting_selected_vo_lop.mp3` | Đã chọn Lốp xe cũ. Bé chạm vào những ý tưởng phù hợp nhé! |
