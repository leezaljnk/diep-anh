import { writeFileSync } from 'node:fs';
import { VOICE_PROMPTS } from '../src/data/voicePrompts';

const groups = [
  { title: 'Câu chung cho lớp học / sân trường', matches: (id: string) => !/^(selected_(?!unknown)|picked_(?!unknown)|garden_|sorting_)/.test(id) },
  { title: 'Lớp học — chọn và nhặt 15 món rác', matches: (id: string) => /^(selected|picked)_/.test(id) && !/_(yard_|unknown)/.test(id) },
  { title: 'Sân trường — chọn và nhặt 10 món rác', matches: (id: string) => /^(selected|picked)_yard_/.test(id) },
  { title: 'Khu vườn', matches: (id: string) => id.startsWith('garden_') },
  { title: 'Thử tài phân loại', matches: (id: string) => id.startsWith('sorting_') },
];

const introduction = `# Danh sách ID và lời thoại cho cả 4 màn chơi

Có **${VOICE_PROMPTS.length} ID**. Nguồn chuẩn: [voicePrompts.ts](../src/data/voicePrompts.ts).
Tạo lại danh sách bằng \`node --import tsx scripts/generate_voice_catalog.ts\`.

- Mỗi lệnh gọi \`triggerSpeech(text, voiceId)\` truyền ID tường minh; không dò ID theo nội dung khi phát hoặc nghe lại.
- Đặt bản thu tại \`public/voice/<ID>.mp3\`, hoặc upload vào \`voice/<ID>\` trong editor. Phòng thu, JSON và HTML offline dùng chung danh mục này.
- Thiếu bản thu hoặc phát lỗi: dùng giọng đọc trình duyệt. Trình duyệt vẫn có thể chặn autoplay khi chưa có tương tác.
- Chạy lại [supabase/setup.sql](../supabase/setup.sql) để cho phép các ID mới trên hệ thống đã triển khai.
- Phải thu lại \`victory.mp3\` theo mốc **20 sao** và các câu đã đổi nội dung (đặc biệt \`batch_complete.mp3\`, \`approach_bin.mp3\`, \`approach_trash.mp3\`); file cũ không tự đổi tiếng nói.
- Ba câu khen đúng dùng ba ID riêng để bản thu khớp văn bản; không dùng chung \`correct.mp3\` cho câu khác nữa.
- Khu vườn đọc kết quả cố định bằng \`garden_victory\`; số điểm biến thiên vẫn hiển thị riêng trên màn hình, không nằm trong bản thu.
- Thử tài phân loại tự đọc hướng dẫn, phản hồi nối/gỡ/kiểm tra, chuyển lượt và hoàn thành. Lời nhắc an toàn có nút bấm để nghe. Giữ phản hồi hoàn thành lượt 4,5 giây trước khi chuyển lượt để hạn chế ngắt câu.
- \`continue_sorting\` và \`play_area_small\` là trạng thái lời nhắc thụ động ở màn chính: có ID lưu cùng lời thoại nhưng không tự phát. Bong bóng và nút nghe lại của robot màn chính hiện đang ẩn; callback nghe lại đã giữ ID tường minh, không thay đổi bố cục để bật lại nút. \`selected_unknown\` / \`picked_unknown\` là dự phòng khi thiếu định nghĩa món rác.
- Danh mục là **lời nói/hướng dẫn/phản hồi**, không phải mọi nhãn nút, tên vật phẩm, văn bản mô tả ảnh, thẻ gợi ý tái sử dụng hoặc hiệu ứng âm thanh.

`;

const sections = groups.map(group => {
  const prompts = VOICE_PROMPTS.filter(prompt => group.matches(prompt.id));
  const rows = prompts.map(prompt => `| \`${prompt.id}\` | \`${prompt.id}.mp3\` | ${prompt.text} |`).join('\n');
  return `## ${group.title} (${prompts.length} ID)\n\n| ID | Tên file | Lời thoại cần thu |\n|---|---|---|\n${rows}\n`;
});

writeFileSync(new URL('../docs/voice-prompts.md', import.meta.url), introduction + sections.join('\n'));
console.log(`Đã ghi ${VOICE_PROMPTS.length} ID vào docs/voice-prompts.md`);
