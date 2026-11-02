import type { TrashCategory, TrashItemDef } from '../types';

export interface ReuseHint {
  productNameVi: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  safetyNote?: string;
}

export const REUSE_HINT_DURATION_MS = 3000;

export const REUSE_HINTS: Readonly<Record<string, ReuseHint>> = {
  giay_cu: {
    productNameVi: 'Chậu cây từ giầy cũ',
    text: 'Giầy cũ có thể trồng cây.',
    imageUrl: './images/tai-su-dung/giay_cu_taisudung.png',
    imageAlt: 'Giầy cũ được tận dụng làm chậu trồng cây.',
    safetyNote: 'Bé có đôi giầy cũ nào không!',
  },
  ong_nhua: {
    productNameVi: 'Hoa nhựa',
    text: 'Ống hút nhựa có thể làm hoa nhựa.',
    imageUrl: './images/tai-su-dung/ong_nhua_taisudung.png',
    imageAlt: 'Những bông hoa làm từ ống hút nhựa.',
    safetyNote: 'Bé hãy gom ống hút nhựa rồi thử làm nhé!',
  },
  vo_chai_nhua: {
    productNameVi: 'Lọ treo cây',
    text: 'Vỏ chai có thể làm lọ treo cây.',
    imageUrl: './images/tai-su-dung/vo_chai_nhua_taisudung.png',
    imageAlt: 'Vỏ chai nhựa được tận dụng làm lọ treo cây.',
    safetyNote: 'Nhờ người lớn giúp làm nhé!',
  },
  vo_chai: {
    productNameVi: 'Lọ cắm hoa',
    text: 'Vỏ chai có thể cắm hoa',
    imageUrl: './images/tai-su-dung/vo_chai_taisudung.png',
    imageAlt: 'Vỏ chai thủy tinh được dùng làm lọ cắm hoa.',
    safetyNote: 'Dùng chai sạch, nguyên vẹn cùng người lớn nhé!',
  },
  vo_hop_giay: {
    productNameVi: 'Hộp đựng đồ',
    text: 'Hộp giấy có thể dùng để đựng đồ.',
    imageUrl: './images/tai-su-dung/vo_hop_giay_taisudung.png',
    imageAlt: 'Hộp giấy được dùng để đựng đồ.',
  },
  vo_hop_sua: {
    productNameVi: 'Chậu cây từ hộp sữa',
    text: 'Vỏ hộp sữa có thể trồng cây.',
    imageUrl: './images/tai-su-dung/vo_hop_sua_taisudung.png',
    imageAlt: 'Vỏ hộp sữa được tận dụng làm chậu trồng cây.',
    safetyNote: 'Bé hãy nhờ người lớn giúp làm nhé!',
  },
  vo_lon: {
    productNameVi: 'Hộp bút',
    text: 'Vỏ lon có thể làm hộp bút.',
    imageUrl: './images/tai-su-dung/vo_lon_taisudung.png',
    imageAlt: 'Vỏ lon được tận dụng làm hộp đựng bút.',
    safetyNote: 'Bé hãy nhờ người lớn giúp che cạnh sắc nhé!',
  },
};

export function getReuseHint(
  scene: 'classroom' | 'yard',
  item: TrashItemDef,
  chosenCategory: TrashCategory
): ReuseHint | undefined {
  if (scene !== 'classroom' || item.category !== 'recyclable' || chosenCategory !== item.category) {
    return undefined;
  }
  return Object.hasOwn(REUSE_HINTS, item.id) ? REUSE_HINTS[item.id] : undefined;
}
