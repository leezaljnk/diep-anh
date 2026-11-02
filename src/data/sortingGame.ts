export interface SortingGameProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  safetyNote?: string;
}

export interface SortingGameWaste {
  id: string;
  name: string;
  image: string;
  alt: string;
  products: SortingGameProduct[];
  distractors: SortingGameProduct[];
}

export interface SortingGameOption extends SortingGameProduct {
  isCorrect: boolean;
  row: number;
  column: number;
}

export interface SortingGameRound {
  waste: SortingGameWaste;
  options: SortingGameOption[];
  correctIds: string[];
}

const OPTION_SLOTS = [
  { row: 1, column: 1 },
  { row: 1, column: 2 },
  { row: 1, column: 3 },
  { row: 2, column: 1 },
  { row: 2, column: 3 },
  { row: 3, column: 1 },
  { row: 3, column: 2 },
  { row: 3, column: 3 },
] as const;

const mainImage = (id: string) => `thu-tai-phan-loai/rac-chinh/${id}_chinh.svg`;
const reuseImage = (id: string, number: number) =>
  `thu-tai-phan-loai/rac-chinh/${id}_taisudung_0${number}.svg`;
const distractorImage = (number: number) =>
  `thu-tai-phan-loai/gay_nhieu/gay_nhieu_${String(number).padStart(2, '0')}.svg`;

const product = (
  id: string,
  name: string,
  image: string,
  alt: string,
  safetyNote?: string
): SortingGameProduct => ({ id, name, image, alt, ...(safetyNote ? { safetyNote } : {}) });

const reuse = (
  wasteId: string,
  number: number,
  name: string,
  alt: string,
  safetyNote?: string
) => product(`${wasteId}-reuse-${number}`, name, reuseImage(wasteId, number), alt, safetyNote);

const distractor = (number: number, id: string, name: string) =>
  product(id, name, distractorImage(number), name);

export const SORTING_GAME_WASTES: SortingGameWaste[] = [
  {
    id: 'cd',
    name: 'Đĩa CD cũ',
    image: mainImage('cd'),
    alt: 'Một chiếc đĩa CD cũ',
    products: [
      reuse('cd', 1, 'Cua trang trí', 'Con cua đồ chơi làm từ đĩa CD'),
      reuse('cd', 2, 'Đĩa CD trang trí', 'Đĩa CD được vẽ nhiều màu để trang trí'),
      reuse('cd', 3, 'Đồ treo lấp lánh', 'Đồ treo trang trí làm từ đĩa CD'),
    ],
    distractors: [
      distractor(1, 'pencil', 'Bút chì'),
      distractor(2, 'kettle', 'Ấm nước'),
      distractor(3, 'car', 'Ô tô'),
    ],
  },
  {
    id: 'chai_nhua',
    name: 'Chai nhựa',
    image: mainImage('chai_nhua'),
    alt: 'Một chai nước bằng nhựa',
    products: [
      reuse('chai_nhua', 1, 'Chậu cây hình mèo', 'Chậu cây hình chú mèo làm từ chai nhựa', 'Nhờ người lớn giúp nếu cần cắt hoặc dán.'),
      reuse('chai_nhua', 2, 'Tên lửa đồ chơi', 'Mô hình tên lửa làm từ chai nhựa', 'Nhờ người lớn giúp nếu cần cắt hoặc dán.'),
      reuse('chai_nhua', 3, 'Máy bay đồ chơi', 'Mô hình máy bay làm từ chai nhựa', 'Nhờ người lớn giúp nếu cần cắt hoặc dán.'),
    ],
    distractors: [
      distractor(10, 'book', 'Quyển sách'),
      distractor(2, 'kettle', 'Ấm nước'),
      distractor(34, 'watch', 'Đồng hồ đeo tay'),
    ],
  },
  {
    id: 'cuon_giay',
    name: 'Lõi giấy',
    image: mainImage('cuon_giay'),
    alt: 'Một lõi giấy hình ống',
    products: [
      reuse('cuon_giay', 1, 'Ống cắm bút', 'Ống cắm bút trang trí từ lõi giấy'),
      reuse('cuon_giay', 2, 'Chú khỉ đồ chơi', 'Chú khỉ đồ chơi làm từ lõi giấy'),
      reuse('cuon_giay', 3, 'Ống nhòm đồ chơi', 'Ống nhòm làm từ hai lõi giấy'),
    ],
    distractors: [
      distractor(12, 'umbrella', 'Ô che mưa'),
      distractor(29, 'stones', 'Những viên sỏi'),
      distractor(52, 'bowl', 'Chiếc bát'),
    ],
  },
  {
    id: 'giay_vun',
    name: 'Giấy vụn',
    image: mainImage('giay_vun'),
    alt: 'Những mảnh giấy vụn',
    products: [
      reuse('giay_vun', 1, 'Thuyền giấy', 'Những chiếc thuyền gấp từ giấy'),
      reuse('giay_vun', 2, 'Túi giấy', 'Một chiếc túi được làm từ giấy'),
      reuse('giay_vun', 3, 'Tranh trang trí', 'Khung tranh ghép từ những mảnh giấy'),
    ],
    distractors: [
      distractor(2, 'kettle', 'Ấm nước'),
      distractor(34, 'watch', 'Đồng hồ đeo tay'),
      distractor(14, 'utensils', 'Bộ thìa gỗ'),
    ],
  },
  {
    id: 'hop_giay',
    name: 'Hộp giấy',
    image: mainImage('hop_giay'),
    alt: 'Một chiếc hộp giấy',
    products: [
      reuse('hop_giay', 1, 'Ngôi nhà đồ chơi', 'Ngôi nhà đồ chơi làm từ hộp giấy'),
      reuse('hop_giay', 2, 'Xe đồ chơi', 'Chiếc xe đồ chơi làm từ hộp giấy'),
      reuse('hop_giay', 3, 'Kệ sách nhỏ', 'Kệ sách nhỏ làm từ những hộp giấy'),
    ],
    distractors: [
      distractor(12, 'umbrella', 'Ô che mưa'),
      distractor(25, 'bowls', 'Những chiếc bát'),
      distractor(61, 'helmet', 'Mũ bảo hiểm'),
    ],
  },
  {
    id: 'tat_cu',
    name: 'Tất cũ',
    image: mainImage('tat_cu'),
    alt: 'Một đôi tất cũ',
    products: [
      reuse('tat_cu', 1, 'Búp bê vải', 'Búp bê mềm làm từ tất cũ'),
      reuse('tat_cu', 2, 'Quả bóng mềm', 'Quả bóng mềm làm từ tất cũ'),
      reuse('tat_cu', 3, 'Chú sâu vải', 'Chú sâu đồ chơi làm từ tất cũ'),
    ],
    distractors: [
      distractor(2, 'kettle', 'Ấm nước'),
      distractor(5, 'fan', 'Quạt điện'),
      distractor(52, 'bowl', 'Chiếc bát'),
    ],
  },
  {
    id: 'vo_chai',
    name: 'Chai thủy tinh',
    image: mainImage('vo_chai'),
    alt: 'Một chai thủy tinh',
    products: [
      reuse('vo_chai', 1, 'Lọ trang trí quấn dây', 'Lọ thủy tinh được quấn dây để trang trí', 'Nhờ người lớn kiểm tra chai còn nguyên vẹn và hỗ trợ trang trí.'),
      reuse('vo_chai', 2, 'Lọ đèn trang trí', 'Chai thủy tinh được trang trí thành lọ đèn', 'Chỉ dùng đèn trang trí an toàn dưới sự giúp đỡ của người lớn.'),
      reuse('vo_chai', 3, 'Đồ treo trang trí', 'Chai thủy tinh được trang trí thành món đồ treo', 'Nhờ người lớn hỗ trợ treo và kiểm tra chai còn nguyên vẹn.'),
    ],
    distractors: [
      distractor(10, 'book', 'Quyển sách'),
      distractor(24, 'backpack', 'Ba lô'),
      distractor(3, 'car', 'Ô tô'),
    ],
  },
  {
    id: 'vo_hop',
    name: 'Vỏ hộp giấy',
    image: mainImage('vo_hop'),
    alt: 'Một chiếc vỏ hộp giấy',
    products: [
      reuse('vo_hop', 1, 'Ngôi nhà đồ chơi', 'Ngôi nhà đồ chơi làm từ vỏ hộp giấy'),
      reuse('vo_hop', 2, 'Ống cắm bút', 'Ống cắm bút làm từ vỏ hộp giấy'),
      reuse('vo_hop', 3, 'Chậu cây', 'Chậu cây được trang trí từ vỏ hộp giấy'),
    ],
    distractors: [
      distractor(2, 'kettle', 'Ấm nước'),
      distractor(34, 'watch', 'Đồng hồ đeo tay'),
      distractor(12, 'umbrella', 'Ô che mưa'),
    ],
  },
  {
    id: 'vo_lon',
    name: 'Vỏ lon',
    image: mainImage('vo_lon'),
    alt: 'Một chiếc vỏ lon nước ngọt',
    products: [
      reuse('vo_lon', 1, 'Ống cắm bút', 'Ống cắm bút được trang trí từ vỏ lon', 'Nhờ người lớn kiểm tra và che kín cạnh lon trước khi sử dụng.'),
      reuse('vo_lon', 2, 'Chậu hoa', 'Chậu hoa được làm từ vỏ lon', 'Nhờ người lớn kiểm tra và che kín cạnh lon trước khi sử dụng.'),
      reuse('vo_lon', 3, 'Điện thoại dây', 'Điện thoại đồ chơi làm từ hai chiếc lon và một sợi dây', 'Nhờ người lớn chuẩn bị lon an toàn, không còn cạnh sắc.'),
    ],
    distractors: [
      distractor(9, 'beanie', 'Mũ len'),
      distractor(10, 'book', 'Quyển sách'),
      distractor(52, 'bowl', 'Chiếc bát'),
    ],
  },
  {
    id: 'vo_lop',
    name: 'Lốp xe cũ',
    image: mainImage('vo_lop'),
    alt: 'Một chiếc lốp xe cũ',
    products: [
      reuse('vo_lop', 1, 'Xích đu lốp xe', 'Xích đu làm từ một chiếc lốp xe', 'Người lớn cần lắp đặt và kiểm tra xích đu.'),
      reuse('vo_lop', 2, 'Bồn hoa', 'Bồn hoa trang trí từ lốp xe', 'Nhờ người lớn giúp di chuyển lốp xe.'),
      reuse('vo_lop', 3, 'Ghế lốp xe', 'Một chiếc ghế làm từ lốp xe', 'Nhờ người lớn giúp làm và kiểm tra chiếc ghế.'),
    ],
    distractors: [
      distractor(2, 'kettle', 'Ấm nước'),
      distractor(10, 'book', 'Quyển sách'),
      distractor(11, 'clock', 'Đồng hồ báo thức'),
    ],
  },
];

export function shuffleArray<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createSortingGameRounds(random: () => number = Math.random): SortingGameRound[] {
  return shuffleArray(SORTING_GAME_WASTES, random).slice(0, 5).map((waste) => {
    const correctIds = waste.products.map(({ id }) => id);
    const shuffledOptions = shuffleArray([
      ...waste.products.map((item) => ({ ...item, isCorrect: true })),
      ...waste.distractors.map((item) => ({ ...item, isCorrect: false })),
    ], random);
    const optionSlots = shuffleArray(OPTION_SLOTS, random);
    const options = shuffledOptions.map((option, index) => ({
      ...option,
      ...optionSlots[index],
    }));
    return { waste, options, correctIds };
  });
}

export function evaluateSortingGameChoices(
  round: SortingGameRound,
  selectedIds: readonly string[]
): { correctIds: string[]; wrongIds: string[]; isComplete: boolean } {
  const correctIds = round.correctIds.filter((id) => selectedIds.includes(id));
  const wrongIds = selectedIds.filter((id) => !round.correctIds.includes(id));
  return {
    correctIds,
    wrongIds,
    isComplete: correctIds.length === round.correctIds.length && wrongIds.length === 0,
  };
}

export function sortingGameImageUrl(
  imagePath: string,
  offlineAssets = typeof window === 'undefined'
    ? undefined
    : window.__KIEN_SANG_PRELOADED_STATE__?.sortingGameAssets
): string {
  return offlineAssets?.[imagePath] || `./images/${imagePath}`;
}
