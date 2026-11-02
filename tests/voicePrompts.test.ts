import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { VOICE_PROMPTS, voiceIdForText } from '../src/data/voicePrompts';
import { TRASH_ITEMS } from '../src/data/trashItems';
import { YARD_TRASH_ITEMS } from '../src/data/yardTrashItems';
import { SORTING_GAME_WASTES } from '../src/data/sortingGame';
import { sharedAssetsToState } from '../src/utils/sharedAssets';
import { embedOfflineAssets } from '../src/utils/offlineAssets';
import { parseSettingsFile } from '../src/utils/settingsTransfer';
import { speakKienSang } from '../src/utils/audio';

test('98 unique recording IDs cover all scenes and have exact scripts documented', () => {
  const catalog = readFileSync(new URL('../docs/voice-prompts.md', import.meta.url), 'utf8');
  assert.equal(VOICE_PROMPTS.length, 98);
  assert.equal(new Set(VOICE_PROMPTS.map(p => p.id)).size, VOICE_PROMPTS.length);
  for (const prompt of VOICE_PROMPTS) {
    assert.match(prompt.id, /^[a-z0-9_]+$/);
    assert.equal(voiceIdForText(prompt.text), prompt.id);
    assert(catalog.includes(`| \`${prompt.id}\` | \`${prompt.id}.mp3\` | ${prompt.text} |`), prompt.id);
  }
  for (const item of [...TRASH_ITEMS, ...YARD_TRASH_ITEMS]) {
    assert.equal(voiceIdForText(`Bé đã chọn "${item.nameVi}"! Hãy bấm vào thùng rác muốn bỏ nhé!`), `selected_${item.id}`);
    assert.equal(voiceIdForText(`Kiến Sáng đã nhặt "${item.nameVi}"! Hãy đưa tới thùng rác thích hợp nhé!`), `picked_${item.id}`);
  }
  for (const waste of SORTING_GAME_WASTES) {
    assert.equal(voiceIdForText(`Đã chọn ${waste.name}. Bé chạm vào những ý tưởng phù hợp nhé!`), `sorting_selected_${waste.id}`);
  }
  assert.equal(voiceIdForText('Tuyệt vời quá! Bé giỏi lắm!'), 'correct_great');
  assert.equal(voiceIdForText('unknown'), undefined);
});

test('every speech/feedback call passes an explicit ID, and literal text matches that ID', () => {
  for (const path of ['App.tsx', 'components/SunlitGardenGame.tsx', 'components/ReuseSortingGame.tsx']) {
    const source = readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
    const calls = [...source.matchAll(/\b(?:triggerSpeech|showFeedback)\(/g)];
    assert(calls.length > 0, path);
    for (const call of calls) {
      const args: string[] = [];
      let start = call.index! + call[0].length;
      let depth = 0;
      let quote = '';
      for (let index = start; index < source.length; index++) {
        const char = source[index];
        if (quote) {
          if (char === '\\') index++;
          else if (char === quote) quote = '';
          continue;
        }
        if (char === "'" || char === '"' || char === '`') {
          quote = char;
        } else if ('([{'.includes(char)) {
          depth++;
        } else if (char === ')' && depth === 0) {
          args.push(source.slice(start, index).trim());
          break;
        } else if (')]}'.includes(char)) {
          depth--;
        } else if (char === ',' && depth === 0) {
          args.push(source.slice(start, index).trim());
          start = index + 1;
        }
      }
      assert.equal(args.filter(Boolean).length, 2, `${path}: ${args.join(', ')}`);
      const text = args[0].match(/^'([^']*)'$/)?.[1];
      const id = args[1].match(/^'([^']*)'$/)?.[1];
      if (text && id) {
        assert.equal(VOICE_PROMPTS.find(prompt => prompt.id === id)?.text, text, `${path}: ${id}`);
      }
    }
    assert(!source.includes('voiceIdForText('), 'Playback must not infer recording IDs from text');
  }
});

test('Supabase upload policy allows every catalog ID, including dynamic scene IDs', () => {
  const sql = readFileSync(new URL('../supabase/setup.sql', import.meta.url), 'utf8');
  const patterns = [...sql.matchAll(/asset_id ~ '([^']+)'/g)].map(match => new RegExp(match[1]));
  for (const prompt of VOICE_PROMPTS) {
    const id = `voice/${prompt.id}`;
    assert(sql.includes(`'${id}'`) || patterns.some(pattern => pattern.test(id)), `Upload denied: ${id}`);
  }
});

test('victory scripts follow the actual star goal', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const goal = Number(app.match(/const MAX_SCORE = (\d+);/)?.[1]);
  assert.equal(voiceIdForText(`Yeah, ${goal} sao rồi, lớp mình sạch quá!`), 'victory');
  assert.equal(voiceIdForText(`Yeah, ${goal} sao rồi, sân trường sạch quá!`), 'yard_victory');
});

test('recordings play for all IDs and missing/failed recordings fall back to Vietnamese TTS', async () => {
  const keys = ['window', 'Audio', 'SpeechSynthesisUtterance'] as const;
  const descriptors = keys.map(key => Object.getOwnPropertyDescriptor(globalThis, key));
  const played: string[] = [];
  const spoken: string[] = [];
  let failPlayback = false;
  class FakeUtterance {
    lang = '';
    constructor(public text: string) {}
  }
  Object.assign(globalThis, {
    window: {
      speechSynthesis: {
        cancel() {},
        getVoices: () => [],
        speak: (utterance: FakeUtterance) => {
          assert.equal(utterance.lang, 'vi-VN');
          spoken.push(utterance.text);
        },
      },
    },
    Audio: class {
      constructor(private url: string) {}
      pause() {}
      play() {
        if (failPlayback) return Promise.reject(new Error('Recording unavailable'));
        played.push(this.url);
        return Promise.resolve();
      }
    },
    SpeechSynthesisUtterance: FakeUtterance,
  });
  try {
    for (const prompt of VOICE_PROMPTS) {
      const url = `voice/${prompt.id}.mp3`;
      speakKienSang(prompt.text, url);
      assert.equal(played.at(-1), url);
    }
    assert.equal(spoken.length, 0);
    speakKienSang('Không có bản thu', null);
    assert.equal(spoken.at(-1), 'Không có bản thu');
    failPlayback = true;
    speakKienSang('Bản thu bị lỗi', 'voice/missing.mp3');
    await Promise.resolve();
    assert.equal(spoken.at(-1), 'Bản thu bị lỗi');
  } finally {
    keys.forEach((key, index) => {
      const descriptor = descriptors[index];
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});

test('shared voices, offline embedding and JSON roundtrip preserve all prompts and older files', async () => {
  const shared = sharedAssetsToState(VOICE_PROMPTS.map(p => ({ id: `voice/${p.id}`, revision: 'v1' })));
  for (const prompt of VOICE_PROMPTS) assert.match(shared.voiceClips![prompt.id] || '', new RegExp(`voice/${prompt.id}\\?v=v1$`));
  const clips = Object.fromEntries(VOICE_PROMPTS.map(p => [p.id, 'data:audio/mpeg;base64,YQ==']));
  const embedded = await embedOfflineAssets({
    customCostumes: {}, customTrashImages: {}, mascotScale: 1, binScale: 0.85,
    voiceClips: { correct: null, incorrect: null, victory: null, ...clips },
  });
  const parsed = parseSettingsFile(JSON.stringify({ format: 'kien-sang-settings', version: 1, settings: embedded }));
  assert.deepEqual(parsed.voiceClips, clips);
  embedded.voiceClips = { correct: null, incorrect: null, victory: null };
  assert.doesNotThrow(() => parseSettingsFile(JSON.stringify({ format: 'kien-sang-settings', version: 1, settings: embedded })));
});
