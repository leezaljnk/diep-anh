import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BUON_IDS, CAM_GIO_IDS, getPrimaryMascotImage, PICKUP_IDS, TIM_RAC_IDS, VUI_IDS } from '../src/data/mascotCostumes';
import { RobotKienSang } from '../src/components/RobotKienSang';
import { TrashItemView } from '../src/components/TrashItemView';
import { TRASH_ITEMS } from '../src/data/trashItems';
import type { CustomCostumesMap } from '../src/types';

test('trash keeps a visible pickup state until it transfers to the mascot', () => {
  const definition = TRASH_ITEMS[0];
  const html = renderToStaticMarkup(React.createElement(TrashItemView, {
    definition,
    item: { instanceId: 'pickup-test', defId: definition.id, xPercent: 50, yPercent: 75, rotation: 0 },
    isPickingUp: true,
  }));
  assert.match(html, /data-trash-instance-id="pickup-test"/);
  assert.match(html, /data-picking-up="true"/);
  assert.match(html, /trash-pickup/);
  assert.ok(html.includes(definition.nameVi));
});

test('picking uses crouching images before switching to carried trash images', () => {
  const customCostumes = Object.fromEntries(
    [...PICKUP_IDS, ...TIM_RAC_IDS, 'cam_banh_mi_01'].map(id => [id, `${id}.png`])
  );
  const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
    mood: 'picking', carriedTrashId: 'banh_mi', customCostumes,
  }));
  assert.match(html, /src="tim_rac_13.png"/);
  assert.doesNotMatch(html, /src="cam_banh_mi_01.png"/);
  assert.equal(TIM_RAC_IDS.length, 12);
  assert.equal(getPrimaryMascotImage({ tim_rac_13: 'pickup.png' }, 'pickup.png'), null);
});

test('new action frames fall back within their own group when early frames are missing', () => {
  for (const [mood, id] of [['picking', PICKUP_IDS[2]], ['happy', VUI_IDS[3]], ['sad', BUON_IDS[3]]] as const) {
    const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
      mood, isMoving: true, customCostumes: { [id]: `${id}.png` },
    }));
    assert.ok(html.includes(`src="${id}.png"`));
  }
});

test('garden uses all basket frames without changing classroom walking frames', () => {
  const customCostumes = Object.fromEntries(
    [...CAM_GIO_IDS, ...TIM_RAC_IDS].map(id => [id, `${id}.png`])
  );
  for (let step = 0; step < 12; step++) {
    for (const mood of ['walking', 'happy', 'sad'] as const) {
      const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
        mood, carryingBasket: true, isMoving: true, walkStepTick: step, customCostumes,
      }));
      assert.match(html, new RegExp(`src="${CAM_GIO_IDS[step]}\\.png"`));
    }
    const classroom = renderToStaticMarkup(React.createElement(RobotKienSang, {
      mood: 'walking', isMoving: true, walkStepTick: step, customCostumes,
    }));
    assert.match(classroom, new RegExp(`src="${TIM_RAC_IDS[step]}\\.png"`));
  }
});

test('basket frames stay visible at rest and when a frame is missing', () => {
  for (const isMoving of [false, true]) {
    const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
      mood: 'idle', carryingBasket: true, isMoving, walkStepTick: 7,
      customCostumes: { cam_gio_01: 'basket.png', tim_rac_01: 'walk.png' },
    }));
    assert.match(html, /src="basket.png"/);
  }
  const fallback = renderToStaticMarkup(React.createElement(RobotKienSang, {
    mood: 'walking', carryingBasket: true, isMoving: true,
    customCostumes: { tim_rac_01: 'walk.png' },
  }));
  assert.match(fallback, /src="walk.png"/);
  assert.equal(getPrimaryMascotImage({ cam_gio_01: 'basket.png' }, 'basket.png'), null);
});

test('base mascot never selects a carrying/emotion frame, including old aliases', () => {
  const costumes = {
    cam_banh_mi_01: 'bread.png',
    vui_01: 'happy.png',
    'k-v-2': 'bread.png',
  };
  assert.equal(getPrimaryMascotImage(costumes, 'bread.png'), null);
  assert.equal(getPrimaryMascotImage(costumes, 'bread.png', 'base.png'), 'base.png');
  assert.equal(getPrimaryMascotImage({ ...costumes, tim_rac_05: 'walk.png' }), 'walk.png');
});

test('all walking steps use walking images when one frame is missing', () => {
  const costumes: CustomCostumesMap = { cam_banh_mi_01: 'bread.png' };
  for (const id of TIM_RAC_IDS.slice(1)) costumes[id] = `${id}.png`;
  for (let step = 0; step < 12; step++) {
    const html = renderToStaticMarkup(React.createElement(RobotKienSang, {
      mood: 'walking', isMoving: true, walkStepTick: step,
      customCostumes: costumes, customMascotUrl: 'bread.png',
    }));
    assert.doesNotMatch(html, /src="bread.png"/);
    assert.match(html, /src="tim_rac_\d{2}.png"/);
  }
});

test('bread carrying images remain available only when actually carrying bread', () => {
  const customCostumes = { cam_banh_mi_01: 'bread.png', 'k-v-2': 'bread.png' };
  const render = (carriedTrashId?: string) => renderToStaticMarkup(
    React.createElement(RobotKienSang, {
      mood: 'walking', isMoving: true, carriedTrashId, customCostumes,
      customMascotUrl: 'bread.png',
    })
  );
  assert.doesNotMatch(render(), /src="bread.png"/);
  assert.match(render(), /<svg/);
  assert.match(render('banh_mi'), /src="bread.png"/);
});
