import type { TrashCategory } from '../types';

export interface HeadTiltTrashItem {
  id: string;
  category: TrashCategory;
  image: string;
}

// Keep the shared direction/category IDs; this game's right-hand group means Vô cơ.
const imageGroup = (folder: string, count: number, category: TrashCategory): HeadTiltTrashItem[] =>
  Array.from({ length: count }, (_, index) => {
    const id = `${folder}_${String(index + 1).padStart(2, '0')}`;
    return { id, category, image: `./images/camera/${folder}/${id}.png` };
  });

export const HEAD_TILT_TRASH_ITEMS: readonly HeadTiltTrashItem[] = [
  ...imageGroup('huu_co', 70, 'organic'),
  ...imageGroup('vo_co', 90, 'recyclable'),
];
