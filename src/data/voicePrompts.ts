import { TRASH_ITEMS } from './trashItems';
import { YARD_TRASH_ITEMS } from './yardTrashItems';
import { SORTING_GAME_WASTES } from './sortingGame';

export type TriggerSpeech = (text: string, voiceId: string) => void;

export const VOICE_PROMPTS = [
  { id: 'correct', text: 'Hoan hô! Đúng rồi bạn ơi!' },
  { id: 'incorrect', text: 'Ôi nhầm rồi, bạn thử lại nhé!' },
  { id: 'correct_great', text: 'Tuyệt vời quá! Bé giỏi lắm!' },
  { id: 'correct_thanks', text: 'Đúng rồi! Cảm ơn bé nhiều nhé!' },
  { id: 'victory', text: 'Yeah, 20 sao rồi, lớp mình sạch quá!' },
  { id: 'yard_welcome', text: 'Chào bạn nhỏ! Cùng Kiến Sáng dọn sạch sân trường nhé!' },
  { id: 'yard_victory', text: 'Yeah, 20 sao rồi, sân trường sạch quá!' },
  { id: 'scene_busy', text: 'Kiến Sáng đang nhặt rác rồi. Hãy hoàn thành lượt này trước khi đổi cảnh nhé!' },
  { id: 'play_area_small', text: 'Vùng chơi quá nhỏ. Hãy phóng to cửa sổ hoặc giảm kích thước thùng rác rồi chơi lại nhé!' },
  { id: 'welcome', text: 'Chào bạn nhỏ! Cùng Kiến Sáng dọn sạch lớp học nhé!' },
  { id: 'continue_sorting', text: 'Bé tiếp tục phân loại rác nhé!' },
  { id: 'batch_complete', text: 'Hoan hô! Đã dọn sạch rác! Cùng tiếp tục nhé!' },
  { id: 'approach_bin', text: 'Kiến Sáng hãy đi lại gần Thùng Xanh (bên trái) hoặc Thùng Cam (bên phải) rồi nhấn Phím Cách nhé!' },
  { id: 'approach_trash', text: 'Hãy dùng phím mũi tên ⬅️ ➡️ đi lại gần món rác trên sàn rồi nhấn Phím Cách để nhặt nhé!' },
  { id: 'select_trash', text: 'Bé hãy bấm chọn một món rác trên sàn trước nhé!' },
  { id: 'bin_unavailable', text: 'Chưa xác định được vị trí thùng rác, bạn hãy chọn lại nhé!' },
  { id: 'mode_drag', text: 'Chế độ: Bé chạm và kéo rác vào thùng, hoặc nhấn giữ chuột để kéo nhé!' },
  { id: 'mode_command', text: 'Chế độ: Bé chạm chọn rác rồi chạm thùng để tớ chạy lại nhặt nhé!' },
  { id: 'mascot_updated', text: 'A! Đã nhận đúng ảnh kien-sang-main.png rồi! Cùng dọn lớp với bạn Kiến Sáng nhé!' },
  { id: 'selected_unknown', text: 'Bé đã chọn "món rác"! Hãy bấm vào thùng rác muốn bỏ nhé!' },
  { id: 'picked_unknown', text: 'Kiến Sáng đã nhặt "món rác"! Hãy đưa tới thùng rác thích hợp nhé!' },
  { id: 'garden_intro', text: 'Dùng phím mũi tên, các nút điều khiển hoặc kéo chuột/chạm để đón bánh kẹo, trái cây lấy điểm và né gạch, đá, cành cây nhé!' },
  { id: 'garden_free', text: 'Cùng Kiến Sáng đón món ngon nhé!' },
  { id: 'garden_challenge', text: 'Đón đủ 10 món ngon để nhận huy hiệu' },
  { id: 'garden_hazard', text: 'Ối! Cẩn thận nhé!' },
  { id: 'garden_game_over', text: 'Nghỉ một chút nhé! Lần sau mình nhớ né gạch, đá và cành cây nhé!' },
  { id: 'garden_victory', text: 'Tuyệt vời, bạn nhỏ! Bạn đã đón đủ món ngon. Tuyệt lắm!' },
  { id: 'sorting_intro', text: 'Mỗi lượt có một món đồ và sáu bức tranh. Bé hãy tìm ba ý tưởng phù hợp nhé.' },
  { id: 'sorting_start', text: 'Kéo từ món rác đến hình phù hợp, hoặc chạm vào hình để nối.' },
  { id: 'sorting_removed', text: 'Đã gỡ lựa chọn. Bé có thể nối hình khác rồi kiểm tra nhé!' },
  { id: 'sorting_connected', text: 'Đã nối hình. Bé có thể chọn thêm rồi bấm Kiểm tra.' },
  { id: 'sorting_select', text: 'Bé hãy nối một hay nhiều hình phù hợp trước nhé!' },
  { id: 'sorting_retry', text: 'Bé thử gỡ đường nối có dấu X rồi kiểm tra lại nhé!' },
  { id: 'sorting_round_complete', text: 'Bé giỏi lắm! Cả ba ý tưởng phù hợp đã được tìm thấy.' },
  { id: 'sorting_more', text: 'Tốt lắm! Còn ý tưởng phù hợp nữa, bé tìm tiếp nhé!' },
  { id: 'sorting_continue', text: 'Bé hãy nối một hay nhiều hình rồi kiểm tra nhé!' },
  { id: 'sorting_safety', text: 'Một số ý tưởng cần người lớn hỗ trợ. Mình chỉ quan sát tranh và nhờ người lớn giúp nhé!' },
  { id: 'sorting_victory', text: 'Bé giỏi quá! Bé đã tìm được nhiều cách sáng tạo để dùng lại đồ cũ. Nhớ nhờ người lớn giúp với những ý tưởng cần làm thủ công nhé!' },
  ...SORTING_GAME_WASTES.map(waste => ({
    id: `sorting_selected_${waste.id}`,
    text: `Đã chọn ${waste.name}. Bé chạm vào những ý tưởng phù hợp nhé!`,
  })),
  ...[...TRASH_ITEMS, ...YARD_TRASH_ITEMS].flatMap(item => [
    { id: `selected_${item.id}`, text: `Bé đã chọn "${item.nameVi}"! Hãy bấm vào thùng rác muốn bỏ nhé!` },
    { id: `picked_${item.id}`, text: `Kiến Sáng đã nhặt "${item.nameVi}"! Hãy đưa tới thùng rác thích hợp nhé!` },
  ]),
];

export function voiceIdForText(text: string): string | undefined {
  return VOICE_PROMPTS.find(prompt => prompt.text === text)?.id;
}
