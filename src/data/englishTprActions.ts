export type TprActionId = 'hands-up' | 'touch-head' | 'clap' | 'open-arms' | 'sleepy' | 'surprised';

export interface EnglishTprAction {
  id: TprActionId;
  prompt: string;
  label: string;
  joints: readonly number[];
}

export const ENGLISH_TPR_ACTIONS: readonly EnglishTprAction[] = [
  { id: 'hands-up', prompt: 'Hands up!', label: 'Giơ hai tay', joints: [7, 8, 11, 12, 15, 16] },
  { id: 'touch-head', prompt: 'Touch your head!', label: 'Chạm tay lên đầu', joints: [0, 11, 12] },
  { id: 'clap', prompt: 'Clap your hands!', label: 'Chắp hai tay trước ngực', joints: [11, 12, 15, 16] },
  { id: 'open-arms', prompt: 'Open your arms!', label: 'Dang hai tay ngang vai', joints: [11, 12, 13, 14, 15, 16] },
  { id: 'sleepy', prompt: 'Sleepy!', label: 'Nghiêng đầu, tựa tay bên má', joints: [2, 5, 7, 8, 11, 12] },
  { id: 'surprised', prompt: 'Surprised!', label: 'Đặt hai tay bên má', joints: [7, 8, 11, 12, 15, 16] },
];

export const TPR_ROUND_COUNT = 5;
export const TPR_DWELL_MS = 900;
export const TPR_ROUND_MS = 7000;