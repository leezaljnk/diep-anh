/**
 * Quản lý danh mục Trang Phục và Vector SVG cho Bạn Kiến Sáng
 * 1. Nhóm di chuyển tới vị trí rác: tim_rac_01 .. tim_rac_12 (12 ảnh)
 * 2. Nhóm cầm rác (15 nhóm × 12 ảnh = 180 ảnh):
 *    - Vô cơ: vo_hop_sua, vo_hop_giay, giay_cu, vo_chai, ong_nhua, vo_keo, vo_lon, vo_chai_nhua
 *    - Hữu cơ: xuong_ca, dui_ga, vo_dua_hau, banh_mi, la_cay, vo_chuoi, vo_tao
 * 3. Nhóm vui mừng: vui_01 .. vui_04
 * 4. Nhóm buồn: buon_01 .. buon_04
 * 5. Nhóm cúi nhặt rác: tim_rac_13 .. tim_rac_15
 */

import type { CustomCostumesMap } from '../types';

export interface CostumeDef {
  id: string;
  nameVi: string;
  actionGroup: 'tim_rac' | 'picking' | 'cam_gio' | 'cam_rac' | 'vui' | 'buon';
  trashId?: string; // Nếu thuộc nhóm cầm rác
  groupNameVi: string;
  scratchRoleVi: string;
  descriptionVi: string;
  order: number;
  sampleFileName: string;
}

// 12 bước tìm rác
export const TIM_RAC_IDS: string[] = Array.from({ length: 12 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `tim_rac_${num}`;
});

export const CAM_GIO_IDS: string[] = Array.from({ length: 12 }, (_, index) =>
  `cam_gio_${String(index + 1).padStart(2, '0')}`
);

export const PICKUP_IDS = ['tim_rac_13', 'tim_rac_14', 'tim_rac_15'];
export const PICKUP_FRAME_MS = 180;
export const PICKUP_DURATION_MS = PICKUP_IDS.length * PICKUP_FRAME_MS;
export const VUI_IDS = ['vui_01', 'vui_02', 'vui_03', 'vui_04'];
export const BUON_IDS = ['buon_01', 'buon_02', 'buon_03', 'buon_04'];

export function getPrimaryMascotImage(
  costumes: CustomCostumesMap,
  ...baseImages: (string | null | undefined)[]
): string | null {
  const walkingImage = TIM_RAC_IDS.map(id => costumes[id]).find(Boolean);
  if (walkingImage) return walkingImage;

  // Older saves may have copied a carrying/emotion frame into the base mascot slot.
  const actionImages = new Set(Object.entries(costumes)
    .filter(([id, image]) => image && (/^(cam_|vui_|buon_)/.test(id) || PICKUP_IDS.includes(id)))
    .map(([, image]) => image));
  return [...baseImages, costumes['k-v-2']]
    .find(image => image && !actionImages.has(image)) || null;
}

// Cấu hình 15 nhóm rác
export interface CarryTrashGroupConfig {
  trashId: string;
  nameVi: string;
  prefix: string; // ví dụ "cam_hopsua" hoặc "cam_banh_mi"
  color: string;
  category: 'organic' | 'recyclable';
}

export const CARRY_TRASH_GROUPS: CarryTrashGroupConfig[] = [
  // 8 rác vô cơ
  { trashId: 'vo_hop_sua', nameVi: 'Vỏ hộp sữa', prefix: 'cam_hopsua', color: '#3B82F6', category: 'recyclable' },
  { trashId: 'vo_hop_giay', nameVi: 'Vỏ hộp giấy', prefix: 'cam_hopgiay', color: '#D97706', category: 'recyclable' },
  { trashId: 'giay_cu', nameVi: 'Giầy cũ', prefix: 'cam_giaycu', color: '#8B5CF6', category: 'recyclable' },
  { trashId: 'vo_chai', nameVi: 'Vỏ chai', prefix: 'cam_vochai', color: '#0D9488', category: 'recyclable' },
  { trashId: 'ong_nhua', nameVi: 'Ống nhựa', prefix: 'cam_ongnhua', color: '#06B6D4', category: 'recyclable' },
  { trashId: 'vo_keo', nameVi: 'Vỏ kẹo', prefix: 'cam_vokeo', color: '#A855F7', category: 'recyclable' },
  { trashId: 'vo_lon', nameVi: 'Vỏ lon', prefix: 'cam_volon', color: '#EC4899', category: 'recyclable' },
  { trashId: 'vo_chai_nhua', nameVi: 'Vỏ chai nhựa', prefix: 'cam_vochainhua', color: '#0284C7', category: 'recyclable' },

  // 7 rác hữu cơ
  { trashId: 'xuong_ca', nameVi: 'Xương cá', prefix: 'cam_xuongca', color: '#E2E8F0', category: 'organic' },
  { trashId: 'dui_ga', nameVi: 'Đùi gà', prefix: 'cam_duiga', color: '#D97706', category: 'organic' },
  { trashId: 'vo_dua_hau', nameVi: 'Vỏ dưa hấu', prefix: 'cam_voduahau', color: '#10B981', category: 'organic' },
  { trashId: 'banh_mi', nameVi: 'Bánh mì', prefix: 'cam_banh_mi', color: '#F59E0B', category: 'organic' },
  { trashId: 'la_cay', nameVi: 'Lá cây', prefix: 'cam_lacay', color: '#16A34A', category: 'organic' },
  { trashId: 'vo_chuoi', nameVi: 'Vỏ chuối', prefix: 'cam_vochuoi', color: '#FACC15', category: 'organic' },
  { trashId: 'vo_tao', nameVi: 'Vỏ táo', prefix: 'cam_votao', color: '#EF4444', category: 'organic' },
];

/**
 * Lấy danh sách 12 ID trang phục cầm rác cho một loại rác
 */
export function getCarryCostumeIdsForTrash(trashId: string): string[] {
  const group = CARRY_TRASH_GROUPS.find((g) => g.trashId === trashId);
  const prefix = group?.prefix || `cam_${trashId}`;
  return Array.from({ length: 12 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `${prefix}_${num}`;
  });
}

// Xây dựng danh sách tổng MASCOT_COSTUMES
export const MASCOT_COSTUMES: CostumeDef[] = (() => {
  const list: CostumeDef[] = [];
  let order = 1;

  // 1. Nhóm di chuyển tìm rác (12 ảnh)
  TIM_RAC_IDS.forEach((id, idx) => {
    const stepNum = idx + 1;
    list.push({
      id,
      nameVi: `Tìm rác bước ${stepNum}`,
      actionGroup: 'tim_rac',
      groupNameVi: '🚶 Di chuyển tìm rác (tim_rac_01..12)',
      scratchRoleVi: `Pha ${stepNum}/12 chu kỳ bước chân tìm rác`,
      descriptionVi: `Kiến Sáng bước nhịp nhàng pha ${stepNum} khi người chơi bấm phím điều khiển.`,
      order: order++,
      sampleFileName: `${id}.png`,
    });
  });

  PICKUP_IDS.forEach((id, index) => {
    list.push({
      id,
      nameVi: `Cúi nhặt rác bước ${index + 1}`,
      actionGroup: 'picking',
      groupNameVi: 'Cúi nhặt rác (tim_rac_13..15)',
      scratchRoleVi: `Cúi nhặt rác bước ${index + 1}/3`,
      descriptionVi: 'Kiến Sáng cúi xuống nhặt rác trước khi ôm rác tới thùng.',
      order: order++,
      sampleFileName: `${id}.png`,
    });
  });

  CAM_GIO_IDS.forEach((id, index) => {
    list.push({
      id,
      nameVi: `Cầm giỏ bước ${index + 1}`,
      actionGroup: 'cam_gio',
      groupNameVi: 'Cầm giỏ (cam_gio_01..12)',
      scratchRoleVi: `Cầm giỏ bước ${index + 1}/12`,
      descriptionVi: 'Kiến Sáng cầm giỏ đón món ngon trong khu vườn.',
      order: order++,
      sampleFileName: `${id}.png`,
    });
  });

  // 2. Nhóm cảm xúc Vui & Buồn (8 ảnh)
  list.push({
    id: 'vui_01',
    nameVi: 'Vui mừng 01 (Giơ tay chữ V)',
    actionGroup: 'vui',
    groupNameVi: '🎉 Vui mừng khi bỏ đúng (vui_01..04)',
    scratchRoleVi: 'Ăn mừng chiến thắng 1',
    descriptionVi: 'Giơ hai tay chữ V reo mừng bé bỏ rác đúng thùng!',
    order: order++,
    sampleFileName: 'vui_01.png',
  });
  list.push({
    id: 'vui_02',
    nameVi: 'Vui mừng 02 (Nhảy múa tít mắt)',
    actionGroup: 'vui',
    groupNameVi: '🎉 Vui mừng khi bỏ đúng (vui_01..04)',
    scratchRoleVi: 'Ăn mừng chiến thắng 2',
    descriptionVi: 'Nhảy múa cười tít mắt khen bé thật thông minh!',
    order: order++,
    sampleFileName: 'vui_02.png',
  });

  list.push({
    id: 'buon_01',
    nameVi: 'Buồn bã 01 (Gãi đầu áy náy)',
    actionGroup: 'buon',
    groupNameVi: '🥺 Buồn khi bỏ sai (buon_01..04)',
    scratchRoleVi: 'Tiếc nuối nhầm thùng 1',
    descriptionVi: 'Cúi đầu gãi tai áy náy: Ôi nhầm rồi bạn ơi!',
    order: order++,
    sampleFileName: 'buon_01.png',
  });
  list.push({
    id: 'buon_02',
    nameVi: 'Buồn bã 02 (Lau nước mắt tiếc nuối)',
    actionGroup: 'buon',
    groupNameVi: '🥺 Buồn khi bỏ sai (buon_01..04)',
    scratchRoleVi: 'Tiếc nuối nhầm thùng 2',
    descriptionVi: 'Lau nước mắt tiếc nuối và động viên bạn thử lại!',
    order: order++,
    sampleFileName: 'buon_02.png',
  });

  for (const actionGroup of ['vui', 'buon'] as const) {
    const ids = actionGroup === 'vui' ? VUI_IDS : BUON_IDS;
    ids.slice(2).forEach((id, index) => {
      const name = actionGroup === 'vui' ? 'Vui mừng' : 'Buồn bã';
      list.push({
        id,
        nameVi: `${name} ${index + 3}`,
        actionGroup,
        groupNameVi: actionGroup === 'vui'
          ? '🎉 Vui mừng khi bỏ đúng (vui_01..04)'
          : '🥺 Buồn khi bỏ sai (buon_01..04)',
        scratchRoleVi: `${name} bước ${index + 3}/4`,
        descriptionVi: `Biểu cảm ${name.toLowerCase()} của Kiến Sáng.`,
        order: order++,
        sampleFileName: `${id}.png`,
      });
    });
  }

  // 3. Nhóm Cầm rác (15 nhóm × 12 ảnh)
  CARRY_TRASH_GROUPS.forEach((group) => {
    for (let step = 1; step <= 12; step++) {
      const numStr = String(step).padStart(2, '0');
      const id = `${group.prefix}_${numStr}`;
      list.push({
        id,
        nameVi: `Cầm ${group.nameVi} (${numStr})`,
        actionGroup: 'cam_rac',
        trashId: group.trashId,
        groupNameVi: `📦 Cầm ${group.nameVi} (${group.prefix}_01..12)`,
        scratchRoleVi: `Cầm ${group.nameVi} bước ${step}/12`,
        descriptionVi: `Hai tay Kiến Sáng ôm ${group.nameVi} sải bước tới thùng rác.`,
        order: order++,
        sampleFileName: `${id}.png`,
      });
    }
  });

  return list;
})();

// ========================================================
// HỌA TIẾT MINI RÁC TRONG TAY KIẾN SÁNG CHO TỪNG LOẠI
// ========================================================
function getMiniTrashSvg(trashId: string): string {
  switch (trashId) {
    case 'banh_mi':
      return `<g transform="translate(68, 128)">
        <path d="M 4 22 C 2 8 22 4 28 22 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
        <line x1="10" y1="12" x2="13" y2="18" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" />
        <line x1="18" y1="12" x2="21" y2="18" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" />
      </g>`;
    case 'vo_hop_sua':
      return `<g transform="translate(68, 126)">
        <rect x="5" y="4" width="16" height="22" rx="2" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2" />
        <polygon points="5,4 13,0 21,4" fill="#93C5FD" stroke="#1D4ED8" stroke-width="1.5" />
        <path d="M 7 12 Q 13 16 19 12" stroke="#FFFFFF" stroke-width="2" fill="none" />
      </g>`;
    case 'vo_chuoi':
      return `<g transform="translate(68, 126)">
        <path d="M 6 10 Q 14 6 22 16 Q 25 24 16 28 Q 6 25 6 16 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="2" />
        <circle cx="6" cy="11" r="2" fill="#854D0E" />
      </g>`;
    case 'vo_tao':
      return `<g transform="translate(70, 128)">
        <circle cx="12" cy="14" r="10" fill="#EF4444" stroke="#B91C1C" stroke-width="2" />
        <path d="M 16 6 Q 19 12 16 20" fill="#FEF2F2" />
        <path d="M 12 4 Q 12 0 15 -1" stroke="#78350F" stroke-width="2" fill="none" />
      </g>`;
    case 'xuong_ca':
      return `<g transform="translate(66, 130)">
        <line x1="2" y1="12" x2="26" y2="12" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
        <line x1="8" y1="6" x2="8" y2="18" stroke="#E2E8F0" stroke-width="2" />
        <line x1="14" y1="6" x2="14" y2="18" stroke="#E2E8F0" stroke-width="2" />
        <line x1="20" y1="6" x2="20" y2="18" stroke="#E2E8F0" stroke-width="2" />
        <polygon points="26,12 30,6 30,18" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
      </g>`;
    case 'dui_ga':
      return `<g transform="translate(68, 126)">
        <ellipse cx="14" cy="12" rx="9" ry="7" fill="#D97706" stroke="#92400E" stroke-width="2" />
        <line x1="18" y1="16" x2="24" y2="22" stroke="#FEF3C7" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="24" cy="22" r="2" fill="#FEF3C7" />
      </g>`;
    case 'vo_dua_hau':
      return `<g transform="translate(68, 128)">
        <path d="M 2 12 Q 13 26 24 12 Z" fill="#EF4444" stroke="#047857" stroke-width="3" />
        <circle cx="8" cy="14" r="1" fill="#000000" />
        <circle cx="14" cy="16" r="1" fill="#000000" />
        <circle cx="18" cy="14" r="1" fill="#000000" />
      </g>`;
    case 'la_cay':
      return `<g transform="translate(68, 128)">
        <path d="M 4 20 Q 14 2 24 20 Q 14 26 4 20 Z" fill="#16A34A" stroke="#15803D" stroke-width="2" />
        <line x1="14" y1="4" x2="14" y2="22" stroke="#15803D" stroke-width="1.5" />
      </g>`;
    case 'vo_lon':
      return `<g transform="translate(70, 126)">
        <rect x="4" y="4" width="14" height="22" rx="3" fill="#EC4899" stroke="#BE185D" stroke-width="2" />
        <ellipse cx="11" cy="4" rx="7" ry="2.5" fill="#FCE7F3" stroke="#BE185D" stroke-width="1" />
      </g>`;
    case 'vo_chai':
    case 'vo_chai_nhua':
      return `<g transform="translate(70, 124)">
        <rect x="5" y="8" width="12" height="20" rx="3" fill="#06B6D4" opacity="0.85" stroke="#0E7490" stroke-width="2" />
        <rect x="8" y="2" width="6" height="6" fill="#0E7490" />
      </g>`;
    case 'ong_nhua':
      return `<g transform="translate(70, 124)">
        <line x1="4" y1="26" x2="16" y2="4" stroke="#06B6D4" stroke-width="4.5" stroke-linecap="round" />
        <line x1="16" y1="4" x2="22" y2="8" stroke="#06B6D4" stroke-width="4.5" stroke-linecap="round" />
      </g>`;
    case 'vo_keo':
      return `<g transform="translate(68, 128)">
        <circle cx="13" cy="14" r="7" fill="#A855F7" stroke="#7E22CE" stroke-width="2" />
        <polygon points="6,14 0,9 0,19" fill="#C084FC" />
        <polygon points="20,14 26,9 26,19" fill="#C084FC" />
      </g>`;
    case 'vo_hop_giay':
      return `<g transform="translate(68, 128)">
        <rect x="4" y="4" width="18" height="18" rx="2" fill="#D97706" stroke="#92400E" stroke-width="2" />
        <line x1="4" y1="13" x2="22" y2="13" stroke="#92400E" stroke-width="1.5" />
      </g>`;
    case 'giay_cu':
    default:
      return `<g transform="translate(70, 128)">
        <rect x="4" y="3" width="15" height="20" rx="1" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
        <line x1="7" y1="8" x2="16" y2="8" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="7" y1="13" x2="16" y2="13" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="7" y1="18" x2="14" y2="18" stroke="#94A3B8" stroke-width="1.5" />
      </g>`;
  }
}

// ========================================================
// 12 PHA HOẠT ẢNH BƯỚC ĐI TIÊU CHUẨN (Walk Cycle 12 Phases)
// ========================================================
const WALK_12_PHASES = [
  // 0: Step 1 (Contact 1: Chân trái chạm gót, tay phải vung trước)
  { legL: 'M 74 150 Q 64 175 54 195 L 44 198', legR: 'M 86 150 Q 98 172 108 192 L 118 194', tilt: 2, headY: 0, armL: 'M 65 118 Q 48 135 42 148', armR: 'M 95 118 Q 112 135 120 148' },
  // 1: Step 2 (Down 1: Bàn chân trái áp sàn, gối chùng nhẹ)
  { legL: 'M 74 152 Q 62 176 50 196 L 40 198', legR: 'M 86 152 Q 95 174 104 193 L 114 195', tilt: 4, headY: 2, armL: 'M 65 120 Q 50 136 44 149', armR: 'M 95 120 Q 110 136 118 149' },
  // 2: Step 3 (Mid-Stance 1: Đứng vững chân trái, chân phải rời sàn)
  { legL: 'M 74 150 Q 68 174 62 195 L 52 198', legR: 'M 86 150 Q 94 170 98 190 L 105 186', tilt: 3, headY: 1, armL: 'M 65 118 Q 56 135 50 148', armR: 'M 95 118 Q 106 135 112 148' },
  // 3: Step 4 (Passing 1: Chân phải co gối lướt qua chân trái)
  { legL: 'M 74 148 Q 72 172 70 195 L 60 198', legR: 'M 86 148 Q 96 160 92 178 L 98 174', tilt: 1, headY: -2, armL: 'M 65 116 Q 62 134 60 148', armR: 'M 95 116 Q 98 134 100 148' },
  // 4: Step 5 (Up 1: Nhón người, chân phải vươn sải)
  { legL: 'M 74 146 Q 66 172 58 193 L 52 189', legR: 'M 86 146 Q 102 168 116 190 L 126 188', tilt: -1, headY: -4, armL: 'M 65 114 Q 72 133 78 146', armR: 'M 95 114 Q 88 133 82 146' },
  // 5: Step 6 (Pre-Contact 1: Chân phải chuẩn bị tiếp sàn)
  { legL: 'M 74 148 Q 64 170 56 191 L 48 193', legR: 'M 86 148 Q 100 172 112 192 L 122 194', tilt: -2, headY: -2, armL: 'M 65 116 Q 78 134 84 147', armR: 'M 95 116 Q 82 134 76 147' },
  // 6: Step 7 (Contact 2: Chân phải chạm gót, tay trái vung trước)
  { legL: 'M 74 150 Q 62 172 52 192 L 42 194', legR: 'M 86 150 Q 96 175 106 195 L 116 198', tilt: -2, headY: 0, armL: 'M 65 118 Q 84 135 92 148', armR: 'M 95 118 Q 78 135 70 148' },
  // 7: Step 8 (Down 2: Bàn chân phải áp sàn, gối phải chùng nhẹ)
  { legL: 'M 74 152 Q 65 174 56 193 L 46 195', legR: 'M 86 152 Q 98 176 110 196 L 120 198', tilt: -4, headY: 2, armL: 'M 65 120 Q 82 136 90 149', armR: 'M 95 120 Q 80 136 72 149' },
  // 8: Step 9 (Mid-Stance 2: Đứng vững chân phải, chân trái rời sàn)
  { legL: 'M 74 150 Q 66 170 62 190 L 55 186', legR: 'M 86 150 Q 92 174 98 195 L 108 198', tilt: -3, headY: 1, armL: 'M 65 118 Q 76 135 70 148', armR: 'M 95 118 Q 86 135 94 148' },
  // 9: Step 10 (Passing 2: Chân trái co gối lướt qua chân phải)
  { legL: 'M 74 148 Q 64 160 68 178 L 62 174', legR: 'M 86 148 Q 88 172 90 195 L 100 198', tilt: -1, headY: -2, armL: 'M 65 116 Q 64 134 62 148', armR: 'M 95 116 Q 96 134 98 148' },
  // 10: Step 11 (Up 2: Nhón người, chân trái vươn sải)
  { legL: 'M 74 146 Q 58 168 44 190 L 34 188', legR: 'M 86 146 Q 94 172 102 193 L 108 189', tilt: 1, headY: -4, armL: 'M 65 114 Q 52 133 46 146', armR: 'M 95 114 Q 108 133 116 146' },
  // 11: Step 12 (Pre-Contact 2: Hoàn tất chu kỳ 12 bước)
  { legL: 'M 74 148 Q 60 172 48 193 L 38 195', legR: 'M 86 148 Q 96 172 104 192 L 112 194', tilt: 2, headY: -2, armL: 'M 65 116 Q 50 134 44 147', armR: 'M 95 116 Q 110 134 118 147' },
];

/**
 * Tạo SVG cho nhóm Tìm rác (tim_rac_01..12)
 */
function createTimRacSvg(stepIndex: number): string {
  const safeIdx = ((Math.floor(stepIndex || 0) % 12) + 12) % 12;
  const p = WALK_12_PHASES[safeIdx] || WALK_12_PHASES[0];
  const stepNum = String(safeIdx + 1).padStart(2, '0');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 210" width="160" height="210">
  <defs>
    <radialGradient id="gradHeadTR${stepNum}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="60%" stop-color="#FB923C" />
      <stop offset="100%" stop-color="#EA580C" />
    </radialGradient>
    <radialGradient id="gradBodyTR${stepNum}" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="50%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#C2410C" />
    </radialGradient>
  </defs>

  <!-- Bóng chân sàn -->
  <ellipse cx="80" cy="200" rx="${36 + (stepIndex % 2) * 4}" ry="8" fill="#CBD5E1" opacity="0.6" />

  <g transform="rotate(${p.tilt} 80 150)">
    <!-- Chân trái -->
    <path d="${p.legL}" stroke="#9A3412" stroke-width="8" stroke-linecap="round" fill="none" />
    <!-- Chân phải -->
    <path d="${p.legR}" stroke="#7C2D12" stroke-width="8" stroke-linecap="round" fill="none" />
    <ellipse cx="${p.legL.split('L ')[1]?.split(' ')[0] || 50}" cy="${p.legL.split('L ')[1]?.split(' ')[1] || 196}" rx="9" ry="5.5" fill="#1E293B" />
    <ellipse cx="${p.legR.split('L ')[1]?.split(' ')[0] || 110}" cy="${p.legR.split('L ')[1]?.split(' ')[1] || 196}" rx="9" ry="5.5" fill="#0F172A" />

    <!-- Bụng kiến -->
    <ellipse cx="80" cy="155" rx="30" ry="24" fill="url(#gradBodyTR${stepNum})" />
    <!-- Thân / Áo gi-lê -->
    <ellipse cx="80" cy="128" rx="24" ry="20" fill="#EA580C" />
    <!-- Huy hiệu bảo vệ môi trường -->
    <circle cx="80" cy="128" r="10.5" fill="#FFFFFF" />
    <circle cx="80" cy="128" r="9" fill="#10B981" />
    <path d="M 77 132 C 77 128 80 125 84 124 C 83 128 80 130 77 132 Z" fill="#FFFFFF" />

    <!-- Tay vung nhịp nhàng khi tìm rác -->
    <path d="${p.armL}" stroke="#9A3412" stroke-width="6.5" stroke-linecap="round" fill="none" />
    <circle cx="${p.armL.split(' ')[p.armL.split(' ').length - 2]}" cy="${p.armL.split(' ')[p.armL.split(' ').length - 1]}" r="5.5" fill="#FB923C" stroke="#9A3412" stroke-width="2" />
    <path d="${p.armR}" stroke="#7C2D12" stroke-width="6.5" stroke-linecap="round" fill="none" />
    <circle cx="${p.armR.split(' ')[p.armR.split(' ').length - 2]}" cy="${p.armR.split(' ')[p.armR.split(' ').length - 1]}" r="5.5" fill="#F97316" stroke="#7C2D12" stroke-width="2" />
  </g>

  <!-- Đầu kiến nhún theo bước đi -->
  <g transform="translate(0, ${p.headY})">
    <path d="M 66 52 Q 52 24 44 26" stroke="#C2410C" stroke-width="3.5" stroke-linecap="round" fill="none" />
    <circle cx="44" cy="26" r="6" fill="#FBBF24" stroke="#EA580C" stroke-width="2" />
    <path d="M 94 52 Q 108 24 116 26" stroke="#C2410C" stroke-width="3.5" stroke-linecap="round" fill="none" />
    <circle cx="116" cy="26" r="6" fill="#FBBF24" stroke="#EA580C" stroke-width="2" />

    <ellipse cx="80" cy="74" rx="34" ry="30" fill="url(#gradHeadTR${stepNum})" />
    <path d="M 48 64 C 48 48 112 48 112 64 Z" fill="#2563EB" />
    <path d="M 46 64 Q 80 67 114 64 Q 124 72 110 74 Q 80 72 46 64 Z" fill="#1D4ED8" />

    <ellipse cx="69" cy="76" rx="8" ry="10" fill="#FFFFFF" />
    <ellipse cx="71" cy="76" rx="5" ry="6.5" fill="#1E293B" />
    <ellipse cx="91" cy="76" rx="8" ry="10" fill="#FFFFFF" />
    <ellipse cx="93" cy="76" rx="5" ry="6.5" fill="#1E293B" />
    <path d="M 72 88 Q 80 95 88 88" stroke="#7C2D12" stroke-width="3" stroke-linecap="round" fill="none" />
  </g>

  <!-- Tag số bước -->
  <rect x="6" y="6" width="68" height="20" rx="6" fill="#1E293B" opacity="0.85" />
  <text x="40" y="20" font-family="sans-serif" font-size="10" font-weight="900" fill="#FDE047" text-anchor="middle">tim_rac_${stepNum}</text>
</svg>`;
}

/**
 * Tạo SVG cho nhóm Cầm rác (cam_[trashId]_[step])
 * Kiến Sáng hai tay ôm món rác cụ thể trước ngực và sải bước 12 pha!
 */
function createCamRacSvg(trashId: string, stepIndex: number): string {
  const safeIdx = ((Math.floor(stepIndex || 0) % 12) + 12) % 12;
  const p = WALK_12_PHASES[safeIdx] || WALK_12_PHASES[0];
  const stepNum = String(safeIdx + 1).padStart(2, '0');
  const group = CARRY_TRASH_GROUPS.find((g) => g.trashId === trashId);
  const prefix = group?.prefix || `cam_${trashId}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 210" width="160" height="210">
  <defs>
    <radialGradient id="gradHeadCR${stepNum}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="60%" stop-color="#FB923C" />
      <stop offset="100%" stop-color="#EA580C" />
    </radialGradient>
    <radialGradient id="gradBodyCR${stepNum}" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="50%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#C2410C" />
    </radialGradient>
  </defs>

  <ellipse cx="80" cy="200" rx="${36 + (stepIndex % 2) * 4}" ry="8" fill="#CBD5E1" opacity="0.6" />

  <g transform="rotate(${p.tilt} 80 150)">
    <!-- Chân bước đi khi đang ôm rác -->
    <path d="${p.legL}" stroke="#9A3412" stroke-width="8" stroke-linecap="round" fill="none" />
    <path d="${p.legR}" stroke="#7C2D12" stroke-width="8" stroke-linecap="round" fill="none" />
    <ellipse cx="${p.legL.split('L ')[1]?.split(' ')[0] || 50}" cy="${p.legL.split('L ')[1]?.split(' ')[1] || 196}" rx="9" ry="5.5" fill="#1E293B" />
    <ellipse cx="${p.legR.split('L ')[1]?.split(' ')[0] || 110}" cy="${p.legR.split('L ')[1]?.split(' ')[1] || 196}" rx="9" ry="5.5" fill="#0F172A" />

    <!-- Thân kiến -->
    <ellipse cx="80" cy="155" rx="30" ry="24" fill="url(#gradBodyCR${stepNum})" />
    <ellipse cx="80" cy="128" rx="24" ry="20" fill="#EA580C" />

    <!-- Món rác đang được ôm trước ngực -->
    ${getMiniTrashSvg(trashId)}

    <!-- Hai tay kiến ôm chặt món rác trước ngực -->
    <path d="M 58 122 Q 54 138 68 144" stroke="#9A3412" stroke-width="6.5" stroke-linecap="round" fill="none" />
    <circle cx="68" cy="144" r="5.5" fill="#FB923C" stroke="#9A3412" stroke-width="2" />
    <path d="M 102 122 Q 106 138 92 144" stroke="#7C2D12" stroke-width="6.5" stroke-linecap="round" fill="none" />
    <circle cx="92" cy="144" r="5.5" fill="#F97316" stroke="#7C2D12" stroke-width="2" />
  </g>

  <!-- Đầu kiến -->
  <g transform="translate(0, ${p.headY})">
    <path d="M 66 52 Q 52 24 44 26" stroke="#C2410C" stroke-width="3.5" stroke-linecap="round" fill="none" />
    <circle cx="44" cy="26" r="6" fill="#FBBF24" stroke="#EA580C" stroke-width="2" />
    <path d="M 94 52 Q 108 24 116 26" stroke="#C2410C" stroke-width="3.5" stroke-linecap="round" fill="none" />
    <circle cx="116" cy="26" r="6" fill="#FBBF24" stroke="#EA580C" stroke-width="2" />

    <ellipse cx="80" cy="74" rx="34" ry="30" fill="url(#gradHeadCR${stepNum})" />
    <path d="M 48 64 C 48 48 112 48 112 64 Z" fill="#2563EB" />
    <path d="M 46 64 Q 80 67 114 64 Q 124 72 110 74 Q 80 72 46 64 Z" fill="#1D4ED8" />

    <ellipse cx="69" cy="76" rx="8" ry="10" fill="#FFFFFF" />
    <ellipse cx="71" cy="76" rx="5" ry="6.5" fill="#1E293B" />
    <ellipse cx="91" cy="76" rx="8" ry="10" fill="#FFFFFF" />
    <ellipse cx="93" cy="76" rx="5" ry="6.5" fill="#1E293B" />
    <path d="M 72 88 Q 80 94 88 88" stroke="#7C2D12" stroke-width="3" stroke-linecap="round" fill="none" />
  </g>

  <!-- Tag số bước & loại rác -->
  <rect x="6" y="6" width="98" height="20" rx="6" fill="#0D9488" opacity="0.9" />
  <text x="55" y="20" font-family="sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle">${prefix}_${stepNum}</text>
</svg>`;
}

/**
 * Tạo SVG cho nhóm Vui mừng (vui_01, vui_02)
 */
function createVuiSvg(num: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 210" width="160" height="210">
  <defs>
    <radialGradient id="gradVuiH${num}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="60%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#EA580C" />
    </radialGradient>
  </defs>

  <ellipse cx="80" cy="202" rx="34" ry="7" fill="#CBD5E1" opacity="0.5" />

  <!-- Chân nhảy múa ăn mừng -->
  <path d="M 72 150 Q 60 170 54 192 L 44 194" stroke="#9A3412" stroke-width="8" stroke-linecap="round" fill="none" />
  <path d="M 88 150 Q 100 170 106 192 L 116 194" stroke="#7C2D12" stroke-width="8" stroke-linecap="round" fill="none" />
  <ellipse cx="48" cy="193" rx="8" ry="5" fill="#1E293B" />
  <ellipse cx="112" cy="193" rx="8" ry="5" fill="#0F172A" />

  <!-- Thân nhún nhảy -->
  <ellipse cx="80" cy="150" rx="28" ry="23" fill="#F97316" />
  <ellipse cx="80" cy="124" rx="24" ry="19" fill="#EA580C" />

  <!-- Hai tay giơ cao chiến thắng -->
  <path d="M 60 118 Q 42 90 32 70" stroke="#9A3412" stroke-width="7" stroke-linecap="round" fill="none" />
  <path d="M 100 118 Q 118 90 128 70" stroke="#7C2D12" stroke-width="7" stroke-linecap="round" fill="none" />
  <circle cx="32" cy="70" r="6" fill="#FDE047" stroke="#EA580C" stroke-width="2" />
  <circle cx="128" cy="70" r="6" fill="#FDE047" stroke="#EA580C" stroke-width="2" />

  <!-- Đầu kiến cười tít mắt -->
  <ellipse cx="80" cy="70" rx="34" ry="30" fill="url(#gradVuiH${num})" />
  <path d="M 48 58 C 48 42 112 42 112 58 Z" fill="#2563EB" />
  <path d="M 46 58 Q 80 61 114 58 Q 124 66 110 68 Q 80 66 46 58 Z" fill="#1D4ED8" />

  <!-- Mắt híp cười ^_^ -->
  <path d="M 62 72 Q 70 65 78 72" stroke="#7C2D12" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <path d="M 82 72 Q 90 65 98 72" stroke="#7C2D12" stroke-width="3.5" stroke-linecap="round" fill="none" />

  <circle cx="56" cy="80" r="5" fill="#F43F5E" opacity="0.6" />
  <circle cx="104" cy="80" r="5" fill="#F43F5E" opacity="0.6" />

  <path d="M 68 82 Q 80 96 92 82 Z" fill="#DC2626" />
  <path d="M 72 82 Q 80 87 88 82" stroke="#FFFFFF" stroke-width="2.5" fill="#FFFFFF" />

  <!-- Sao lấp lánh -->
  <polygon points="24,38 26,44 32,44 27,48 29,54 24,50 19,54 21,48 16,44 22,44" fill="#FBBF24" />
  <polygon points="136,38 138,44 144,44 139,48 141,54 136,50 131,54 133,48 128,44 134,44" fill="#FBBF24" />

  <rect x="6" y="6" width="46" height="20" rx="6" fill="#10B981" opacity="0.9" />
  <text x="29" y="20" font-family="sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">vui_0${num}</text>
</svg>`;
}

/**
 * Tạo SVG cho nhóm Buồn bã (buon_01, buon_02)
 */
function createBuonSvg(num: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 210" width="160" height="210">
  <ellipse cx="80" cy="202" rx="36" ry="7" fill="#CBD5E1" opacity="0.5" />

  <path d="M 72 152 L 68 195 L 60 198" stroke="#9A3412" stroke-width="8" stroke-linecap="round" fill="none" />
  <path d="M 88 152 L 92 195 L 100 198" stroke="#7C2D12" stroke-width="8" stroke-linecap="round" fill="none" />
  <ellipse cx="64" cy="196" rx="8" ry="5.5" fill="#1E293B" />
  <ellipse cx="96" cy="196" rx="8" ry="5.5" fill="#0F172A" />

  <ellipse cx="80" cy="156" rx="28" ry="23" fill="#EA580C" opacity="0.9" />
  <ellipse cx="80" cy="130" rx="23" ry="19" fill="#C2410C" />

  ${
    num === 1
      ? `<!-- Tay gãi đầu bối rối -->
         <path d="M 60 124 Q 46 142 50 152" stroke="#9A3412" stroke-width="6.5" stroke-linecap="round" fill="none" />
         <path d="M 100 124 Q 120 100 106 72" stroke="#7C2D12" stroke-width="6.5" stroke-linecap="round" fill="none" />
         <circle cx="106" cy="72" r="5.5" fill="#FB923C" stroke="#7C2D12" stroke-width="2" />`
      : `<!-- Tay lau nước mắt tiếc nuối -->
         <path d="M 60 124 Q 56 100 68 84" stroke="#9A3412" stroke-width="6.5" stroke-linecap="round" fill="none" />
         <circle cx="68" cy="84" r="5.5" fill="#FB923C" />
         <path d="M 100 124 Q 106 142 102 152" stroke="#7C2D12" stroke-width="6.5" stroke-linecap="round" fill="none" />`
  }

  <ellipse cx="80" cy="76" rx="33" ry="29" fill="#FB923C" />
  <path d="M 48 66 C 48 52 112 52 112 66 Z" fill="#475569" />

  <!-- Mắt buồn rơm rớm -->
  <ellipse cx="69" cy="78" rx="7" ry="8" fill="#FFFFFF" />
  <ellipse cx="69" cy="80" rx="4.5" ry="5" fill="#1E293B" />
  <ellipse cx="91" cy="78" rx="7" ry="8" fill="#FFFFFF" />
  <ellipse cx="91" cy="80" rx="4.5" ry="5" fill="#1E293B" />
  <path d="M 62 82 C 60 84 60 87 62 89 C 64 89 64 87 63 85 Z" fill="#38BDF8" />

  <path d="M 74 94 Q 80 88 86 94" stroke="#7C2D12" stroke-width="3" stroke-linecap="round" fill="none" />

  <rect x="6" y="6" width="52" height="20" rx="6" fill="#EF4444" opacity="0.9" />
  <text x="32" y="20" font-family="sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">buon_0${num}</text>
</svg>`;
}

/**
 * Trả về Vector SVG cho bất kỳ CostumeId nào
 */
export function getCostumeSvg(costumeId?: string | null): string {
  if (!costumeId || typeof costumeId !== 'string') {
    return createTimRacSvg(0);
  }

  // 1. Nhóm tim_rac_01 .. tim_rac_12
  if (costumeId.startsWith('tim_rac_')) {
    const num = parseInt(costumeId.replace('tim_rac_', ''), 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return createTimRacSvg(num - 1);
    }
  }

  // Tương thích legacy k-1..10
  if (costumeId.startsWith('k-') && !costumeId.includes('v') && !costumeId.includes('l') && !costumeId.includes('carry')) {
    const num = parseInt(costumeId.replace('k-', ''), 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return createTimRacSvg(num - 1);
    }
  }

  // 2. Nhóm Vui / Buồn
  if (costumeId === 'vui_01' || costumeId === 'vui_03' || costumeId === 'k-v-1') return createVuiSvg(1);
  if (costumeId === 'vui_02' || costumeId === 'vui_04' || costumeId === 'k-v-2' || costumeId === 'k-v-3') return createVuiSvg(2);
  if (costumeId === 'buon_01' || costumeId === 'buon_03' || costumeId === 'k-l-1') return createBuonSvg(1);
  if (costumeId === 'buon_02' || costumeId === 'buon_04' || costumeId === 'k-l-2') return createBuonSvg(2);

  // 3. Nhóm Cầm rác (cam_[trashId]_[01..12])
  if (costumeId.startsWith('cam_')) {
    // Tìm trash group khớp với prefix
    for (const group of CARRY_TRASH_GROUPS) {
      if (costumeId.startsWith(group.prefix)) {
        const stepPart = costumeId.replace(`${group.prefix}_`, '').replace('step_', '');
        const stepNum = parseInt(stepPart, 10);
        return createCamRacSvg(group.trashId, isNaN(stepNum) ? 0 : stepNum - 1);
      }
    }

    // Nếu là cam_banhmi_ (không gạch dưới banh_mi)
    if (costumeId.startsWith('cam_banhmi')) {
      const stepPart = costumeId.replace('cam_banhmi_', '');
      const stepNum = parseInt(stepPart, 10);
      return createCamRacSvg('banh_mi', isNaN(stepNum) ? 0 : stepNum - 1);
    }
  }

  // Mặc định
  return createTimRacSvg(0);
}
