import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createMascotPosition, type MascotPositionStore } from '../utils/mascotPosition';
import { CustomCostumesMap, KienSangMood, TrashItemDef } from '../types';
import { Volume2, Shirt } from 'lucide-react';
import {
  getCostumeSvg,
  TIM_RAC_IDS,
  CAM_GIO_IDS,
  PICKUP_IDS,
  PICKUP_FRAME_MS,
  VUI_IDS,
  BUON_IDS,
  getCarryCostumeIdsForTrash,
  getPrimaryMascotImage,
} from '../data/mascotCostumes';
import { YardTrashGraphic } from './YardTrashGraphic';

interface RobotKienSangProps {
  className?: string;
  mood: KienSangMood;
  carriedTrashId?: string | null;
  carryingBasket?: boolean;
  speechText?: string;
  xPercent?: number; // 0 to 100% position across classroom
  yPercent?: number;
  positionStore?: MascotPositionStore;
  onReplaySpeech?: () => void;
  isMoving?: boolean;
  walkStepTick?: number;
  customMascotUrl?: string | null;
  customCostumes?: CustomCostumesMap;
  mascotScale?: number;
  facingDirection?: 'left' | 'right';
  carriedItemDef?: TrashItemDef | null;
  carriedItemVariant?: number;
  onOpenMascotModal?: () => void;
}

export const RobotKienSang: React.FC<RobotKienSangProps> = ({
  className,
  mood,
  carriedTrashId = null,
  carryingBasket = false,
  speechText = 'Chào bạn nhỏ! Cùng Kiến Sáng dọn sạch lớp học nhé!',
  xPercent = 50,
  yPercent = 75,
  positionStore,
  onReplaySpeech,
  isMoving = false,
  walkStepTick = 0,
  customMascotUrl,
  customCostumes = {},
  mascotScale = 1.0,
  facingDirection = 'right',
  carriedItemDef = null,
  carriedItemVariant = 0,
  onOpenMascotModal,
}) => {
  const fallbackPosition = useMemo(() => createMascotPosition(xPercent, yPercent), [xPercent, yPercent]);
  const positions = positionStore || fallbackPosition;
  const position = useSyncExternalStore(positions.subscribe, positions.getSnapshot, positions.getSnapshot);
  const [idlePose, setIdlePose] = useState(true);
  const [actionFrame, setActionFrame] = useState({ mood, index: 0 });
  const actionFrameIds = mood === 'picking' ? PICKUP_IDS
    : mood === 'sad' ? BUON_IDS
    : mood === 'happy' || mood === 'victory' ? VUI_IDS : null;
  const actionFrameIndex = actionFrame.mood === mood ? actionFrame.index : 0;
  const previousPickupImage = mood === 'picking' && actionFrameIndex > 0
    ? customCostumes[PICKUP_IDS[actionFrameIndex - 1]] : null;

  const carryFrameIds = useMemo(() => carriedTrashId ? getCarryCostumeIdsForTrash(carriedTrashId) : [], [carriedTrashId]);
  const preloadFrameIds = carryingBasket ? CAM_GIO_IDS : actionFrameIds || (carriedTrashId ? carryFrameIds : TIM_RAC_IDS);
  useEffect(() => {
    let cancelled = false;
    const sources = [...new Set([...preloadFrameIds, ...PICKUP_IDS].map(id => customCostumes[id]).filter((source): source is string => Boolean(source)))];
    const images: HTMLImageElement[] = [];
    let next = 0;
    const warm = async () => {
      while (!cancelled && next < sources.length) {
        const image = new Image();
        images.push(image);
        image.src = sources[next++];
        await image.decode().catch(() => {});
      }
    };
    // Warm only the current animation, with bounded parallel downloads.
    void Promise.all(Array.from({ length: 3 }, warm));
    return () => { cancelled = true; images.length = 0; };
  }, [customCostumes, preloadFrameIds]);

  useEffect(() => {
    if (isMoving) {
      setIdlePose(false);
    } else {
      const timer = setTimeout(() => setIdlePose(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isMoving, walkStepTick]);

  const stepIndex = idlePose && !isMoving ? 0 : Math.abs(walkStepTick) % 12;

  useEffect(() => {
    setActionFrame({ mood, index: 0 });
    if (!actionFrameIds) return;

    const timer = setInterval(() => {
      setActionFrame(current => {
        const index = mood === 'picking'
          ? Math.min(current.index + 1, actionFrameIds.length - 1)
          : (current.index + 1) % actionFrameIds.length;
        return index === current.index ? current : { mood, index };
      });
    }, mood === 'picking' ? PICKUP_FRAME_MS : 220);

    return () => clearInterval(timer);
  }, [mood, actionFrameIds]);

  // XÁC ĐỊNH COSTUME ID ĐANG HIỂN THỊ
  let currentCostumeId = 'tim_rac_01';

  const basketFallback = carryingBasket
    ? CAM_GIO_IDS.map(id => customCostumes[id]).find(Boolean)
    : null;

  if (basketFallback) {
    currentCostumeId = CAM_GIO_IDS[stepIndex];
  } else if (actionFrameIds) {
    currentCostumeId = actionFrameIds[actionFrameIndex];
  } else if (carriedTrashId) {
    // ĐANG CẦM RÁC: sử dụng nhóm 12 ảnh cam_[trashId]_01..12 tương ứng với bước chân hiện tại
    const carryFrames = getCarryCostumeIdsForTrash(carriedTrashId);
    currentCostumeId = carryFrames[stepIndex % 12] || carryFrames[0];
  } else {
    // CHƯA CẦM RÁC: sử dụng nhóm 12 ảnh tim_rac_01..12 tương ứng với bước chân hiện tại
    currentCostumeId = TIM_RAC_IDS[stepIndex % 12] || 'tim_rac_01';
  }

  const primaryCustomMascot = getPrimaryMascotImage(customCostumes, customMascotUrl);

  // Nguồn ảnh: Ảnh custom tải lên hoặc Vector SVG
  let customFrameImage: string | null = customCostumes[currentCostumeId] || null;

  if (currentCostumeId.startsWith('cam_gio_')) {
    customFrameImage ||= basketFallback || null;
  }

  if (!customFrameImage && actionFrameIds && !basketFallback) {
    customFrameImage = actionFrameIds.map(id => customCostumes[id]).find(Boolean) || null;
  }

  // Nếu frame hiện tại chưa có ảnh riêng nhưng người dùng đã tải bộ trang phục bạn Kiến:
  // Tự động ưu tiên lấy đúng pha bước chân (tim_rac_01..12) hoặc ảnh custom chính để giữ nguyên nhân vật và chuyển động mượt mà
  if (!customFrameImage && primaryCustomMascot) {
    const walkFallbackId = TIM_RAC_IDS[stepIndex % 12] || 'tim_rac_01';
    if (currentCostumeId.startsWith('cam_') || currentCostumeId.startsWith('tim_rac_')) {
      customFrameImage = customCostumes[walkFallbackId] || primaryCustomMascot;
    } else if (currentCostumeId.startsWith('vui_')) {
      customFrameImage = VUI_IDS.map(id => customCostumes[id]).find(Boolean) || primaryCustomMascot;
    } else if (currentCostumeId.startsWith('buon_')) {
      customFrameImage = BUON_IDS.map(id => customCostumes[id]).find(Boolean) || primaryCustomMascot;
    } else {
      customFrameImage = primaryCustomMascot;
    }
  }

  // Without walking images, animate the vector frames rather than a static emotion image.
  if (isMoving && TIM_RAC_IDS.includes(currentCostumeId) &&
      !TIM_RAC_IDS.some(id => customCostumes[id])) {
    customFrameImage = null;
  }

  return (
    <div
      className={`absolute inset-0 z-30 select-none pointer-events-none will-change-transform ${className || ''}`}
      style={{ transform: `translate3d(${position.x}%, ${position.y}%, 0)` }}
    >
      <div className="absolute left-0 top-0 flex flex-col items-center group" style={{ transform: 'translate(-50%, -100%)' }}>
      {/* Bong bóng lời nói của Bạn Kiến Sáng */}
      {speechText && (
        <div className="relative mb-2 max-w-xs sm:max-w-sm pointer-events-auto">
          <div
            className={`py-2 px-3.5 rounded-2xl shadow-xl border-3 flex items-center gap-2 ${
              mood === 'sad'
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : mood === 'happy' || mood === 'victory'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-white border-orange-400 text-slate-900'
            }`}
          >
            <div className="text-sm font-extrabold leading-snug">
              {mood === 'happy' && <span className="mr-1">🎉</span>}
              {mood === 'sad' && <span className="mr-1">🥺</span>}
              {mood === 'victory' && <span className="mr-1">🏆</span>}
              {speechText}
            </div>

            {onReplaySpeech && (
              <button
                onClick={onReplaySpeech}
                title="Nghe lại lời nói"
                className="shrink-0 p-1.5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 transition active:scale-90"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Đuôi bong bóng */}
          <div
            className={`w-3.5 h-3.5 rotate-45 mx-auto -mt-2 border-r-3 border-b-3 ${
              mood === 'sad'
                ? 'bg-amber-50 border-amber-400'
                : mood === 'happy' || mood === 'victory'
                ? 'bg-emerald-50 border-emerald-400'
                : 'bg-white border-orange-400'
            }`}
          />
        </div>
      )}

      {/* CONTAINER HIỂN THỊ TRANG PHỤC BẠN KIẾN SÁNG */}
      <div
        data-robot-sprite
        className="relative flex items-center justify-center will-change-transform"
        style={{ transform: `scale(${mascotScale})` }}
      >
        {/* Nút bấm nhanh mở Xưởng Trang Phục */}
        {onOpenMascotModal && (
          <button
            onClick={onOpenMascotModal}
            title="Mở Xưởng Trang Phục Scratch của Bạn Kiến Sáng"
            className="pointer-events-auto absolute -top-3 -right-3 z-40 p-1.5 rounded-full bg-white/95 text-orange-600 hover:bg-orange-500 hover:text-white shadow-lg border-2 border-orange-300 transition-transform active:scale-90 flex items-center gap-1 text-[11px] font-black group-hover:scale-105"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span className="hidden group-hover:inline pr-1 font-sans">Trang Phục</span>
          </button>
        )}

        {/* Khung nhân vật lật trái/phải theo hướng di chuyển (bỏ transition-transform 75ms để tránh giật khi RAF 60fps) */}
        <div
          className="relative flex items-center justify-center will-change-transform"
          style={{
            transform: facingDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          {customFrameImage ? (
            <div className="relative w-28 h-36 flex items-center justify-center">
              <img
                src={customFrameImage}
                alt={`Bạn Kiến Sáng - ${currentCostumeId}`}
                className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
              />
              {previousPickupImage && (
                <img
                  key={currentCostumeId}
                  src={previousPickupImage}
                  alt=""
                  aria-hidden="true"
                  className="mascot-pickup-previous pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-md"
                />
              )}
              {/* Nếu đang cầm rác nhưng dùng ảnh bước đi chung, hiển thị món rác ôm trước ngực */}
              {mood !== 'picking' && carriedTrashId && carriedItemDef && !customCostumes[currentCostumeId] && (
                <div
                  className="absolute bottom-6 right-1 w-10 h-10 bg-white/95 rounded-xl p-1 shadow-md border-2 border-orange-400 flex items-center justify-center pointer-events-none animate-bounce"
                  style={{ transform: facingDirection === 'left' ? 'scaleX(-1)' : 'none' }}
                >
                  {carriedItemDef.customImageUrl ? (
                    <img
                      src={carriedItemDef.customImageUrl}
                      alt={carriedItemDef.nameVi}
                      className="w-full h-full object-contain"
                    />
                  ) : carriedItemDef.id.startsWith('yard_') ? (
                    <YardTrashGraphic
                      iconType={carriedItemDef.iconType}
                      visualVariant={carriedItemVariant}
                      className="w-full h-full"
                    />
                  ) : (
                    <span className="text-xl">
                      {carriedItemDef.category === 'organic' ? '🌱' : '♻️'}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-28 h-36 flex items-center justify-center">
              <div
                className="flex items-center justify-center drop-shadow-md select-none pointer-events-none"
                dangerouslySetInnerHTML={{
                  __html: getCostumeSvg(currentCostumeId),
                }}
              />
              {mood !== 'picking' && carriedTrashId && carriedItemDef?.id.startsWith('yard_') && (
                <div
                  className="absolute bottom-6 right-1 w-10 h-10 rounded-xl bg-white/95 p-1 shadow-md border-2 border-orange-400 flex items-center justify-center pointer-events-none animate-bounce"
                  style={{ transform: facingDirection === 'left' ? 'scaleX(-1)' : 'none' }}
                >
                  <YardTrashGraphic
                    iconType={carriedItemDef.iconType}
                    visualVariant={carriedItemVariant}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

      </div>
      </div>
    </div>
  );
};
