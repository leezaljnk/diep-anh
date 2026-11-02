# Bộ mẫu cắt từ SVG tổng hợp

Bộ này thử tách hình trực tiếp từ [`thu-tai-phan-loai-image-full.svg`](../public/images/reuse-game-sample/thu-tai-phan-loai-image-full.svg). Chủ đề lượt mẫu là **vỏ hộp sữa**. Các crop SVG giữ nguyên nét vẽ gốc và nền trong suốt.

## Món rác và sáu lựa chọn

| Vỏ hộp sữa | Nhà đồ chơi | Chậu cây | Ống bút | Thớt | Thìa | Tất len |
|---|---|---|---|---|---|---|
| ![Vỏ hộp sữa](../public/images/reuse-game-sample/from-sheet/waste_milk_carton.svg) | ![Nhà đồ chơi](../public/images/reuse-game-sample/from-sheet/reuse_toy_house.svg) | ![Chậu cây](../public/images/reuse-game-sample/from-sheet/reuse_planter.svg) | ![Ống bút](../public/images/reuse-game-sample/from-sheet/reuse_pencil_cup.svg) | ![Thớt](../public/images/reuse-game-sample/from-sheet/distractor_cutting_board.svg) | ![Thìa](../public/images/reuse-game-sample/from-sheet/distractor_spoon.svg) | ![Tất len](../public/images/reuse-game-sample/from-sheet/distractor_socks.svg) |

### Ánh xạ đề xuất

- **Phù hợp:** nhà đồ chơi, chậu cây, ống bút. Đây là ý tưởng tái sử dụng vỏ hộp sạch; thao tác cắt cần người lớn hỗ trợ.
- **Gây nhiễu:** thớt, thìa, tất len.

Đây là ánh xạ mẫu để thử luật nối, không phải khẳng định rằng mọi hộp sữa đều có thể dùng theo cách này. Cần duyệt nội dung và kiểm tra khả năng nhận diện với trẻ trước khi đưa vào game.

## Cách tách

SVG gốc chứa 8 path rất lớn, không có nhóm hoặc ID riêng cho từng món. Các file mẫu này dùng `viewBox` để cắt theo vùng tọa độ và tham chiếu lại SVG gốc. Nhờ vậy hình không bị vẽ lại, nhưng các crop **phụ thuộc vào file SVG gốc**. Nếu cần từng ảnh độc lập để phân phối hoặc upload riêng, có thể xuất các vùng crop thành PNG/WebP hoặc nhúng lại vector đã cắt sau khi chốt bộ hình.
