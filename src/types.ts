/**
 * Types for "Robot Kiến Sáng – Thử tài Phân loại Rác"
 */

export type TrashCategory = 'organic' | 'recyclable';

export interface TrashItemDef {
  id: string;
  nameVi: string;
  category: TrashCategory;
  categoryNameVi: string;
  iconType: string;
  hint: string;
  explanationVi: string;
  color: string;
  customImageUrl?: string | null;
}

export interface ActiveTrashItem {
  instanceId: string;
  defId: string;
  xPercent: number; // 0 to 100% position on classroom floor
  yPercent: number;
  rotation: number;
  isDragging?: boolean;
  isTargeted?: boolean; // Selected in mode 2 (Nhờ Kiến Sáng)
  isReturning?: boolean;
  visualVariant?: number;
}

export type GameMode = 'drag' | 'command';

export type CostumeId =
  // Nhóm di chuyển tìm rác: tim_rac_01 .. tim_rac_12
  | 'tim_rac_01'
  | 'tim_rac_02'
  | 'tim_rac_03'
  | 'tim_rac_04'
  | 'tim_rac_05'
  | 'tim_rac_06'
  | 'tim_rac_07'
  | 'tim_rac_08'
  | 'tim_rac_09'
  | 'tim_rac_10'
  | 'tim_rac_11'
  | 'tim_rac_12'
  | 'tim_rac_13'
  | 'tim_rac_14'
  | 'tim_rac_15'
  // Cảm xúc vui mừng / buồn
  | 'vui_01'
  | 'vui_02'
  | 'vui_03'
  | 'vui_04'
  | 'buon_01'
  | 'buon_02'
  | 'buon_03'
  | 'buon_04'
  // Hỗ trợ linh hoạt cho các nhóm cầm rác và legacy
  | (string & {});

export type KienSangMood =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'walking'
  | 'picking'
  | 'carrying'
  | 'dropping'
  | 'victory';

export type CustomCostumesMap = Partial<Record<string, string | null>>;

export interface VoiceClips {
  [id: string]: string | null;
  correct: string | null;     // Audio blob URL or null
  incorrect: string | null;
  victory: string | null;
}

export interface PreloadedOfflineState {
  customCostumes?: CustomCostumesMap;
  customMascotUrl?: string | null;
  mascotScale?: number;
  customOrganicUrl?: string | null;
  customRecyclableUrl?: string | null;
  binScale?: number;
  customTrashImages?: Record<string, string>;
  sortingGameAssets?: Record<string, string>;
  voiceClips?: VoiceClips;
}

declare global {
  interface Window {
    __KIEN_SANG_PRELOADED_STATE__?: PreloadedOfflineState;
  }
}
