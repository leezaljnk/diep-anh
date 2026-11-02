import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  X,
  Upload,
  Check,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  FolderUp,
  Gamepad2,
  Shirt,
  Hand,
} from 'lucide-react';
import { CustomCostumesMap } from '../types';
import {
  MASCOT_COSTUMES,
  TIM_RAC_IDS,
  CAM_GIO_IDS,
  PICKUP_IDS,
  PICKUP_FRAME_MS,
  VUI_IDS,
  BUON_IDS,
  CARRY_TRASH_GROUPS,
  getCarryCostumeIdsForTrash,
  getCostumeSvg,
  CostumeDef,
} from '../data/mascotCostumes';
import { ErrorBoundary } from './ErrorBoundary';
import { compressImageDataUrl } from '../utils/persistentStorage';

interface MascotCostumesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCostumes: CustomCostumesMap;
  onSaveCostumes: (costumes: CustomCostumesMap) => void;
  mascotScale: number;
  onUpdateScale: (scale: number) => void;
}

type TabFilter = 'tim_rac' | 'picking' | 'cam_gio' | 'cam_rac' | 'emotions' | 'all';

export const MascotCostumesModal: React.FC<MascotCostumesModalProps> = ({
  isOpen,
  onClose,
  customCostumes = {},
  onSaveCostumes,
  mascotScale = 1.0,
  onUpdateScale,
}) => {
  // Ensure localCostumes is always a valid object
  const [localCostumes, setLocalCostumes] = useState<CustomCostumesMap>(() => ({ ...(customCostumes || {}) }));
  // Default to 'tim_rac' for instant, lightweight rendering of 12 items
  const [activeTab, setActiveTab] = useState<TabFilter>('tim_rac');
  const [selectedCarryTrashId, setSelectedCarryTrashId] = useState<string>('banh_mi');
  const [dragActive, setDragActive] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Animation previewer state
  const [previewMode, setPreviewMode] = useState<'tim_rac' | 'picking' | 'cam_gio' | 'cam_rac' | 'vui' | 'buon'>('tim_rac');
  const [previewCarryTrashId, setPreviewCarryTrashId] = useState<string>('banh_mi');
  const [isPlayingPreview, setIsPlayingPreview] = useState(true);
  const [isKeyHoldSimulated, setIsKeyHoldSimulated] = useState(false);
  const [previewFrameIndex, setPreviewFrameIndex] = useState(0);

  const fileInputBatchRef = useRef<HTMLInputElement>(null);
  const fileInputFolderRef = useRef<HTMLInputElement>(null);
  const fileInputSingleRef = useRef<HTMLInputElement>(null);
  const targetSingleSlotRef = useRef<string | null>(null);

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCostumes({ ...(customCostumes || {}) });
      setUploadNotice(null);
      setPreviewFrameIndex(0);
    }
  }, [isOpen, customCostumes]);

  // Safely set webkitdirectory attribute on folder input ref
  useEffect(() => {
    if (fileInputFolderRef.current) {
      try {
        fileInputFolderRef.current.setAttribute('webkitdirectory', '');
      } catch {}
    }
  }, []);

  // Safe costumes dictionary
  const safeCostumes: CustomCostumesMap = useMemo(() => {
    return localCostumes && typeof localCostumes === 'object' ? localCostumes : {};
  }, [localCostumes]);

  // Safe SVG getter that never throws
  const getSafeCostumeSvg = (id: string): string => {
    try {
      return getCostumeSvg(id);
    } catch (e) {
      console.error('getCostumeSvg error for', id, e);
      return '';
    }
  };

  // Frame sequence for current preview mode
  const currentPreviewFrames = useMemo(() => {
    try {
      if (previewMode === 'tim_rac') return TIM_RAC_IDS || [];
      if (previewMode === 'cam_gio') return CAM_GIO_IDS;
      if (previewMode === 'picking') return PICKUP_IDS;
      if (previewMode === 'vui') return VUI_IDS;
      if (previewMode === 'buon') return BUON_IDS;
      if (previewMode === 'cam_rac') {
        const frames = getCarryCostumeIdsForTrash(previewCarryTrashId);
        return frames && frames.length > 0 ? frames : TIM_RAC_IDS;
      }
    } catch {
      // fallback
    }
    return TIM_RAC_IDS || [];
  }, [previewMode, previewCarryTrashId]);

  // Timer running Scratch costume cycle
  useEffect(() => {
    if (!isOpen) return;

    if (!isPlayingPreview && !isKeyHoldSimulated) {
      setPreviewFrameIndex(0);
      return;
    }

    const intervalMs =
      previewMode === 'tim_rac' || previewMode === 'cam_gio' || previewMode === 'cam_rac'
        ? 85
        : previewMode === 'picking' ? PICKUP_FRAME_MS : 220; // 85ms per step in walk cycle

    const timer = setInterval(() => {
      setPreviewFrameIndex((prev) => {
        const len = currentPreviewFrames.length;
        return len > 0 ? (prev + 1) % len : 0;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlayingPreview, isKeyHoldSimulated, previewMode, currentPreviewFrames]);

  // Count uploaded costumes safely
  const totalSlotsCount = MASCOT_COSTUMES.length;
  const uploadedCount = useMemo(() => {
    return Object.keys(safeCostumes).filter((k) => !!safeCostumes[k]).length;
  }, [safeCostumes]);

  const timRacUploadedCount = useMemo(() => {
    return TIM_RAC_IDS.filter((id) => !!safeCostumes[id]).length;
  }, [safeCostumes]);

  // Tự động nhận diện Costume ID từ tên file tải lên
  const detectCostumeIdFromFilename = (filename: string): string | null => {
    if (!filename || typeof filename !== 'string') return null;
    const raw = filename.toLowerCase().trim();
    const clean = raw.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');

    // 1. Nhóm Vui & Buồn
    if (clean === 'vui_01' || clean === 'vui01' || clean === 'vui_1' || clean === 'k-v-1') return 'vui_01';
    if (clean === 'vui_02' || clean === 'vui02' || clean === 'vui_2' || clean === 'k-v-2') return 'vui_02';
    if (clean === 'buon_01' || clean === 'buon01' || clean === 'buon_1' || clean === 'k-l-1') return 'buon_01';
    if (clean === 'buon_02' || clean === 'buon02' || clean === 'buon_2' || clean === 'k-l-2') return 'buon_02';

    const emotionMatch = clean.match(/^(vui|buon)[_-]?0?([1-4])$/);
    if (emotionMatch) return `${emotionMatch[1]}_0${emotionMatch[2]}`;

    // 2. Nhóm Tìm Rác (tim_rac_01 .. 12)
    const matchTimRac = clean.match(/tim[_-]?rac[_-]?(\d{1,2})/);
    if (matchTimRac) {
      const num = parseInt(matchTimRac[1], 10);
      if (num >= 1 && num <= 15) {
        return `tim_rac_${String(num).padStart(2, '0')}`;
      }
    }

    // Tương thích legacy k-1..10
    const matchK = clean.match(/^k[_-]?(\d{1,2})$/);
    if (matchK) {
      const num = parseInt(matchK[1], 10);
      if (num >= 1 && num <= 12) {
        return `tim_rac_${String(num).padStart(2, '0')}`;
      }
    }

    // 3. Nhóm Cầm Rác: cam_[prefix]_[01..12]
    for (const group of CARRY_TRASH_GROUPS) {
      const prefixes = [group.prefix, group.prefix.replace(/_/g, '')];
      for (const p of prefixes) {
        if (clean.includes(p)) {
          const numMatch = clean.match(/(\d{1,2})$/);
          if (numMatch) {
            const num = parseInt(numMatch[1], 10);
            if (num >= 1 && num <= 12) {
              return `${group.prefix}_${String(num).padStart(2, '0')}`;
            }
          }
        }
      }
    }

    // Khớp trực tiếp nếu tên file đúng chính xác bất kỳ ID nào trong MASCOT_COSTUMES
    const exact = MASCOT_COSTUMES.find((c) => c.id.toLowerCase() === clean);
    if (exact) return exact.id;

    return null;
  };

  // Handle single slot file selection
  const handleSingleUploadClick = (costumeId: string) => {
    targetSingleSlotRef.current = costumeId;
    fileInputSingleRef.current?.click();
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = targetSingleSlotRef.current;
    if (!file || !targetId) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rawDataUrl = ev.target?.result as string;
      if (rawDataUrl) {
        // Tối ưu nén ảnh về tỉ lệ chuẩn (giảm 90% dung lượng mà vẫn cực kỳ sắc nét)
        const compressed = await compressImageDataUrl(rawDataUrl, 360, 0.88);
        setLocalCostumes((prev) => ({
          ...(prev || {}),
          [targetId]: compressed,
        }));
        setUploadNotice(`Đã tải thành công ảnh cho trang phục "${targetId}"`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle batch file processing
  const processBatchFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    let matchedCount = 0;
    const updates: Record<string, string> = {};
    const unrecogNames: string[] = [];

    setUploadNotice(`Đang xử lý ${fileArray.length} ảnh...`);

    for (const file of fileArray) {
      const matchedId = detectCostumeIdFromFilename(file.name);
      if (matchedId) {
        matchedCount++;
        const rawDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve((ev.target?.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });

        if (rawDataUrl) {
          const compressed = await compressImageDataUrl(rawDataUrl, 360, 0.88);
          updates[matchedId] = compressed;
        }
      } else {
        unrecogNames.push(file.name);
      }
    }

    if (matchedCount > 0) {
      setLocalCostumes((prev) => ({ ...(prev || {}), ...updates }));
      setUploadNotice(
        `Đã tự động nhận diện và gán thành công ${matchedCount}/${fileArray.length} ảnh!`
      );
    } else {
      setUploadNotice(
        `Chưa nhận diện được file nào. Đặt tên mẫu: tim_rac_01.png .. 15, cam_gio_01.png .. 12, cam_banh_mi_01.png .. 12, vui_01.png .. 04, buon_01.png .. 04.`
      );
    }
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processBatchFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processBatchFiles(e.dataTransfer.files);
    }
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    setUploadNotice('Đang lưu trang phục vào hệ thống...');

    try {
      // 1. Đồng bộ lên server nếu có endpoint để ghi ra ổ đĩa
      const costumeEntries = Object.entries(safeCostumes);
      for (const [costumeId, dataUrl] of costumeEntries) {
        if (dataUrl && dataUrl.startsWith('data:image')) {
          try {
            fetch('/api/upload-costume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ costumeId, dataUrl }),
            }).catch(() => {});
          } catch {}
        }
      }

      // 2. Gọi hàm callback lưu vào client state & storage
      await onSaveCostumes(safeCostumes);
      setUploadNotice('✅ Đã lưu trang phục thành công!');

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } catch (err) {
      console.warn('Lỗi lưu trang phục:', err);
      setIsSaving(false);
      onClose();
    }
  };

  // Reset single slot
  const handleClearSlot = (costumeId: string) => {
    setLocalCostumes((prev) => {
      const next = { ...(prev || {}) };
      delete next[costumeId];
      return next;
    });
  };

  // Reset all custom costumes
  const handleResetAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ ảnh trang phục đã tải lên và dùng lại vector mẫu mặc định?')) {
      setLocalCostumes({});
      setUploadNotice('Đã khôi phục toàn bộ trang phục vector SVG mặc định!');
    }
  };

  // Filter costumes based on active tab and selected carry group
  const displayCostumes: CostumeDef[] = useMemo(() => {
    if (activeTab === 'picking') {
      return MASCOT_COSTUMES.filter((costume) => costume.actionGroup === 'picking');
    }
    if (activeTab === 'cam_gio') {
      return MASCOT_COSTUMES.filter((costume) => costume.actionGroup === 'cam_gio');
    }
    if (activeTab === 'tim_rac') {
      return MASCOT_COSTUMES.filter((c) => c.actionGroup === 'tim_rac');
    }
    if (activeTab === 'emotions') {
      return MASCOT_COSTUMES.filter((c) => c.actionGroup === 'vui' || c.actionGroup === 'buon');
    }
    if (activeTab === 'cam_rac') {
      if (selectedCarryTrashId === 'all') {
        return MASCOT_COSTUMES.filter((c) => c.actionGroup === 'cam_rac');
      }
      return MASCOT_COSTUMES.filter(
        (c) => c.actionGroup === 'cam_rac' && c.trashId === selectedCarryTrashId
      );
    }
    return MASCOT_COSTUMES;
  }, [activeTab, selectedCarryTrashId]);

  if (!isOpen) return null;

  const safeFramesLength = currentPreviewFrames.length;
  const safeFrameIdx = safeFramesLength > 0 ? ((previewFrameIndex % safeFramesLength) + safeFramesLength) % safeFramesLength : 0;
  const activePreviewCostumeId = currentPreviewFrames[safeFrameIdx] || 'tim_rac_01';
  const activePreviewImage = safeCostumes[activePreviewCostumeId] || null;

  return (
    <ErrorBoundary fallbackTitle="Lỗi hiển thị Xưởng Trang Phục Bạn Kiến">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
        {/* Hidden inputs */}
        <input
          ref={fileInputBatchRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleBatchFileChange}
        />
        <input
          ref={fileInputFolderRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleBatchFileChange}
        />
        <input
          ref={fileInputSingleRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleSingleFileChange}
        />

        <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-orange-300 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/30 text-2xl shadow-inner">
                🐜
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
                    Xưởng Trang Phục Bạn Kiến Sáng
                  </h2>
                  <span className="text-[11px] font-black bg-white/25 px-2 py-0.5 rounded-full border border-white/30">
                    {uploadedCount}/{totalSlotsCount} đã tải
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-yellow-100">
                  Tìm rác • Cúi nhặt • Cầm giỏ • 15 nhóm cầm rác • Vui & Buồn
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95 cursor-pointer"
              title="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* NOTIFICATION TOAST */}
          {uploadNotice && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs sm:text-sm text-amber-900 font-bold animate-fade-in shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadNotice}</span>
              </div>
              <button
                onClick={() => setUploadNotice(null)}
                className="text-amber-700 hover:text-amber-950 text-xs underline cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          )}

          {/* KHUNG ĐIỀU KHIỂN & BỘ MÔ PHỎNG HOẠT HỌA */}
          <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* SIMULATOR: LIVE SCRATCH PREVIEW */}
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border-2 border-orange-200 shadow-sm">
              {/* Mascot Avatar Preview */}
              <div className="relative w-16 h-20 bg-amber-50/80 rounded-xl border-2 border-orange-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {activePreviewImage ? (
                  <img
                    src={activePreviewImage}
                    alt={activePreviewCostumeId}
                    className="w-full h-full object-contain drop-shadow"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-0.5"
                    dangerouslySetInnerHTML={{
                      __html: getSafeCostumeSvg(activePreviewCostumeId),
                    }}
                  />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-black text-center py-0.5 truncate px-1">
                  {activePreviewCostumeId}
                </div>
              </div>

              {/* Điều khiển mô phỏng */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-800">Mô phỏng động:</span>
                  <select
                    value={previewMode}
                    onChange={(e) => {
                      setPreviewMode(e.target.value as any);
                      setPreviewFrameIndex(0);
                    }}
                    className="text-xs font-black bg-orange-50 border border-orange-300 text-orange-900 rounded-lg px-2 py-1 outline-none cursor-pointer"
                  >
                    <option value="tim_rac">🚶 12 bước tìm rác (tim_rac_01..12)</option>
                    <option value="picking">Cúi nhặt rác (tim_rac_13..15)</option>
                    <option value="cam_gio">Cầm giỏ (cam_gio_01..12)</option>
                    <option value="cam_rac">📦 Cầm rác di chuyển (12 bước)</option>
                    <option value="vui">🎉 Vui mừng đúng thùng (vui_01..04)</option>
                    <option value="buon">🥺 Buồn khi sai thùng (buon_01..04)</option>
                  </select>

                  {previewMode === 'cam_rac' && (
                    <select
                      value={previewCarryTrashId}
                      onChange={(e) => {
                        setPreviewCarryTrashId(e.target.value);
                        setPreviewFrameIndex(0);
                      }}
                      className="text-xs font-black bg-amber-50 border border-amber-300 text-amber-900 rounded-lg px-2 py-1 outline-none cursor-pointer"
                    >
                      {CARRY_TRASH_GROUPS.map((g) => (
                        <option key={g.trashId} value={g.trashId}>
                          {g.category === 'organic' ? '🌱' : '♻️'} Cầm {g.nameVi}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Nút kiểm tra giữ phím / phát tự động */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                      isPlayingPreview
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                    }`}
                    title="Bật/Tắt tự động đổi ảnh liên tục"
                  >
                    {isPlayingPreview ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Dừng lặp
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Chạy lặp
                      </>
                    )}
                  </button>

                  <button
                    onMouseDown={() => setIsKeyHoldSimulated(true)}
                    onMouseUp={() => setIsKeyHoldSimulated(false)}
                    onTouchStart={() => setIsKeyHoldSimulated(true)}
                    onTouchEnd={() => setIsKeyHoldSimulated(false)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border transition select-none cursor-pointer ${
                      isKeyHoldSimulated
                        ? 'bg-orange-600 text-white border-orange-700 scale-95 shadow-inner'
                        : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50'
                    }`}
                    title="Nhấn và giữ chuột để thử nghiệm: nhân vật chỉ bước đi khi bấm giữ phím"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Giữ phím để bước đi</span>
                  </button>

                  <span className="text-[10px] font-bold text-slate-500">
                    Khung {safeFrameIdx + 1}/{safeFramesLength}
                  </span>
                </div>
              </div>
            </div>

            {/* BỘ NÚT TẢI LÊN NHANH & HÀNG LOẠT */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fileInputBatchRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
                title="Chọn nhiều file ảnh PNG/SVG cùng lúc để tự động gán vào trang phục"
              >
                <Upload className="w-4 h-4" />
                <span>Tải nhiều ảnh</span>
              </button>

              <button
                onClick={() => fileInputFolderRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
                title="Tải nguyên một thư mục ảnh có chứa tim_rac_01..15, vui_01..04, buon_01..04, cam_gio_01..12, v.v."
              >
                <FolderUp className="w-4 h-4" />
                <span>Tải cả thư mục</span>
              </button>

              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black transition active:scale-95 cursor-pointer"
                title="Đặt lại toàn bộ về hình vector mẫu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục mẫu</span>
              </button>
            </div>
          </div>

          {/* TABS PHÂN LOẠI NHÓM TRANG PHỤC */}
          <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab('tim_rac')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === 'tim_rac'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-850 hover:bg-orange-100'
                }`}
              >
                <span>🚶 12 bước tìm rác (tim_rac_01..12)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/30">
                  {timRacUploadedCount}/12
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('picking');
                  setPreviewMode('picking');
                  setPreviewFrameIndex(0);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === 'picking'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Cúi nhặt</span>
                <span className="px-1.5 rounded-full text-[10px] bg-white/30">
                  {PICKUP_IDS.filter(id => !!safeCostumes[id]).length}/3
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('cam_gio');
                  setPreviewMode('cam_gio');
                  setPreviewFrameIndex(0);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === 'cam_gio'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Cầm giỏ</span>
                <span className="px-1.5 rounded-full text-[10px] bg-white/30">
                  {CAM_GIO_IDS.filter(id => !!safeCostumes[id]).length}/12
                </span>
              </button>

              <button
                onClick={() => setActiveTab('cam_rac')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === 'cam_rac'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <span>📦 15 nhóm cầm rác (12 bước/loại)</span>
              </button>

              <button
                onClick={() => setActiveTab('emotions')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === 'emotions'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                <span>🎉 Vui & 🥺 Buồn (8 ảnh)</span>
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả ({MASCOT_COSTUMES.length})
              </button>
            </div>

            {/* Nếu đang ở tab Cầm Rác: dropdown chọn từng loại rác */}
            {activeTab === 'cam_rac' && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-xl px-2 py-1">
                <span className="text-[11px] font-black text-amber-900">Xem rác:</span>
                <select
                  value={selectedCarryTrashId}
                  onChange={(e) => setSelectedCarryTrashId(e.target.value)}
                  className="text-xs font-black bg-white border border-amber-200 text-amber-950 rounded-lg px-2 py-0.5 outline-none cursor-pointer"
                >
                  <option value="banh_mi">🍞 Mẩu bánh mì (cam_banh_mi_01..12)</option>
                  <option value="vo_hop_sua">🥛 Vỏ hộp sữa (cam_hopsua_01..12)</option>
                  <option value="vo_chuoi">🍌 Vỏ chuối (cam_vochuoi_01..12)</option>
                  <option value="vo_tao">🍎 Vỏ táo (cam_votao_01..12)</option>
                  <option value="la_cay">🍃 Lá cây (cam_lacay_01..12)</option>
                  <option value="dui_ga">🍗 Đùi gà (cam_duiga_01..12)</option>
                  <option value="xuong_ca">🐟 Xương cá (cam_xuongca_01..12)</option>
                  <option value="vo_dua_hau">🍉 Vỏ dưa hấu (cam_voduahau_01..12)</option>
                  <option value="vo_chai_nhua">🥤 Vỏ chai nhựa (cam_vochainhua_01..12)</option>
                  <option value="vo_lon">🥫 Vỏ lon (cam_volon_01..12)</option>
                  <option value="vo_keo">🍬 Vỏ kẹo (cam_vokeo_01..12)</option>
                  <option value="ong_nhua">🥤 Ống nhựa (cam_ongnhua_01..12)</option>
                  <option value="vo_chai">🍾 Vỏ chai thủy tinh (cam_vochai_01..12)</option>
                  <option value="giay_cu">📄 Giầy cũ (cam_giaycu_01..12)</option>
                  <option value="vo_hop_giay">📦 Vỏ hộp giấy (cam_hopgiay_01..12)</option>
                  <option value="all">Tất cả 15 loại (180 slot)</option>
                </select>
              </div>
            )}
          </div>

          {/* DANH SÁCH THẺ TRANG PHỤC & KHUNG KÉO THẢ */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 overflow-y-auto p-4 sm:p-5 transition-colors relative ${
              dragActive ? 'bg-orange-50 ring-4 ring-orange-400 ring-inset' : 'bg-slate-100/70'
            }`}
          >
            {dragActive && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-orange-500/90 text-white font-black text-base sm:text-lg rounded-2xl gap-2 pointer-events-none">
                <Upload className="w-12 h-12 animate-bounce" />
                <span>Thả các file ảnh vào đây để tự động nhận diện theo tên!</span>
                <span className="text-xs font-normal text-yellow-100">
                  Hỗ trợ tim_rac_01..15, cam_gio_01..12, cam_banh_mi_01..12, vui_01..04, buon_01..04, v.v.
                </span>
              </div>
            )}

            {/* GRID TRANG PHỤC */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {displayCostumes.map((costume) => {
                const customImg = safeCostumes[costume.id] || null;

                return (
                  <div
                    key={costume.id}
                    className={`bg-white rounded-2xl border-2 p-2.5 flex flex-col items-center justify-between shadow-sm transition hover:shadow-md ${
                      customImg ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    {/* Mã ID & Badge trạng thái */}
                    <div className="w-full flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-black text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-md truncate max-w-[110px]">
                        {costume.id}
                      </span>
                      {customImg ? (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded-full flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Ảnh riêng
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-1 py-0.2 rounded-full">
                          Mẫu SVG
                        </span>
                      )}
                    </div>

                    {/* Khung hiển thị ảnh */}
                    <div
                      onClick={() => handleSingleUploadClick(costume.id)}
                      className="relative w-full aspect-square bg-amber-50/50 rounded-xl border border-orange-200 flex items-center justify-center p-2 cursor-pointer group overflow-hidden shadow-inner"
                      title={`Bấm để tải ảnh thay thế cho ${costume.id}`}
                    >
                      {customImg ? (
                        <img
                          src={customImg}
                          alt={costume.nameVi}
                          className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform"
                          dangerouslySetInnerHTML={{
                            __html: getSafeCostumeSvg(costume.id),
                          }}
                        />
                      )}

                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-black gap-1">
                        <Upload className="w-4 h-4" />
                        <span>Đổi ảnh</span>
                      </div>
                    </div>

                    {/* Tên & mô tả */}
                    <div className="w-full text-center mt-1.5">
                      <div className="text-[11px] font-black text-slate-900 truncate" title={costume.nameVi}>
                        {costume.nameVi}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 truncate" title={costume.sampleFileName}>
                        {costume.sampleFileName}
                      </div>
                    </div>

                    {/* Hành động tải / xóa */}
                    <div className="w-full flex items-center gap-1 mt-2">
                      <button
                        onClick={() => handleSingleUploadClick(costume.id)}
                        className="flex-1 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-850 text-[10px] font-black transition active:scale-95 cursor-pointer text-center"
                      >
                        {customImg ? 'Thay đổi' : 'Tải lên'}
                      </button>
                      {customImg && (
                        <button
                          onClick={() => handleClearSlot(costume.id)}
                          className="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition active:scale-90 cursor-pointer"
                          title="Xóa ảnh riêng, dùng lại vector mặc định"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Tùy chỉnh kích thước Mascot */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700">Kích thước bạn Kiến:</span>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={mascotScale}
                onChange={(e) => onUpdateScale(parseFloat(e.target.value))}
                className="w-24 sm:w-32 accent-orange-500 cursor-pointer"
              />
              <span className="text-xs font-black text-orange-600">{Math.round(mascotScale * 100)}%</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-black transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Lưu trang phục ({uploadedCount} ảnh)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
