import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import {
  createSortingGameRounds,
  evaluateSortingGameChoices,
  shuffleArray,
  SORTING_GAME_WASTES,
  sortingGameImageUrl,
} from '../src/data/sortingGame';

test('the content manifest has ten waste groups with three distinct answers and decoys each', () => {
  assert.equal(SORTING_GAME_WASTES.length, 10);
  for (const waste of SORTING_GAME_WASTES) {
    assert.equal(waste.products.length, 3, `${waste.id} correct ideas`);
    assert.equal(waste.distractors.length, 3, `${waste.id} distractors`);
    const allOptions = [...waste.products, ...waste.distractors];
    assert.equal(new Set(allOptions.map(({ id }) => id)).size, 6, `${waste.id} unique options`);
    for (const item of allOptions) {
      assert(item.name);
      assert(item.alt);
      assert(existsSync(new URL(`../public/images/${item.image}`, import.meta.url)), item.image);
    }
    assert(waste.name);
    assert(waste.alt);
    assert(existsSync(new URL(`../public/images/${waste.image}`, import.meta.url)), waste.image);
  }
});

test('each new game selects five unique waste groups and shuffles six unique options', () => {
  let seed = 47;
  const random = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  const rounds = createSortingGameRounds(random);

  assert.equal(rounds.length, 5);
  assert.equal(new Set(rounds.map(({ waste }) => waste.id)).size, 5);
  for (const round of rounds) {
    assert.equal(round.options.length, 6);
    assert.equal(round.correctIds.length, 3);
    assert.equal(new Set(round.options.map(({ id }) => id)).size, 6);
    assert.equal(new Set(round.options.map(({ row, column }) => `${row},${column}`)).size, 6);
    assert(round.options.every(({ row, column }) =>
      row >= 1 && row <= 3 && column >= 1 && column <= 3 && !(row === 2 && column === 2)
    ));
    assert.equal(round.options.filter(({ isCorrect }) => isCorrect).length, 3);
    assert.deepEqual(
      round.options.filter(({ isCorrect }) => isCorrect).map(({ id }) => id).sort(),
      round.correctIds.slice().sort()
    );
  }
});

test('shuffling does not mutate the content source and offline asset URLs take priority', () => {
  const source = [1, 2, 3, 4];
  shuffleArray(source, () => 0.5);
  assert.deepEqual(source, [1, 2, 3, 4]);
  assert.equal(
    sortingGameImageUrl('thu-tai-phan-loai/rac-chinh/cd_chinh.svg', {
      'thu-tai-phan-loai/rac-chinh/cd_chinh.svg': 'data:image/svg+xml;base64,offline',
    }),
    'data:image/svg+xml;base64,offline'
  );
  assert.equal(
    sortingGameImageUrl('thu-tai-phan-loai/rac-chinh/cd_chinh.svg', {}),
    './images/thu-tai-phan-loai/rac-chinh/cd_chinh.svg'
  );
});

test('checking keeps selected correct answers, marks decoys, and completes only with all answers and no decoys', () => {
  const round = createSortingGameRounds(() => 0.42)[0];
  const [firstCorrect, secondCorrect, thirdCorrect] = round.correctIds;
  const decoyId = round.options.find(({ isCorrect }) => !isCorrect)!.id;

  assert.deepEqual(evaluateSortingGameChoices(round, [firstCorrect]), {
    correctIds: [firstCorrect],
    wrongIds: [],
    isComplete: false,
  });
  assert.deepEqual(evaluateSortingGameChoices(round, [firstCorrect, decoyId]), {
    correctIds: [firstCorrect],
    wrongIds: [decoyId],
    isComplete: false,
  });
  assert.deepEqual(evaluateSortingGameChoices(round, [firstCorrect, secondCorrect, thirdCorrect, decoyId]), {
    correctIds: [firstCorrect, secondCorrect, thirdCorrect],
    wrongIds: [decoyId],
    isComplete: false,
  });
  assert.deepEqual(evaluateSortingGameChoices(round, [firstCorrect, secondCorrect, thirdCorrect]), {
    correctIds: [firstCorrect, secondCorrect, thirdCorrect],
    wrongIds: [],
    isComplete: true,
  });
});
