export interface MascotPosition {
  x: number;
  y: number;
}

export function createMascotPosition(x: number, y: number) {
  let position: MascotPosition = { x, y };
  const listeners = new Set<() => void>();
  const moveTo = (nextX: number, nextY: number) => {
    if (position.x === nextX && position.y === nextY) return;
    position = { x: nextX, y: nextY };
    listeners.forEach(listener => listener());
  };
  return {
    getSnapshot: () => position,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    moveTo,
    setX: (value: number | ((previous: number) => number)) =>
      moveTo(typeof value === 'function' ? value(position.x) : value, position.y),
    setY: (value: number | ((previous: number) => number)) =>
      moveTo(position.x, typeof value === 'function' ? value(position.y) : value),
  };
}

export type MascotPositionStore = ReturnType<typeof createMascotPosition>;
