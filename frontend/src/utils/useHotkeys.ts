/* eslint-disable no-bitwise, no-underscore-dangle */
import { useEffect } from 'react';

type ModifiersSet = {
  meta: boolean;
  control: boolean;
  alt: boolean;
  shift: boolean;
};

const _modifiers = ['Control', 'Alt', 'Meta', 'Shift'];

const getActiveModifiers = (ev: KeyboardEvent): ModifiersSet => ({
  meta: ev.metaKey,
  control: ev.ctrlKey,
  alt: ev.altKey,
  shift: ev.shiftKey,
});

const parseModifier = (
  mod: 'meta' | 'control' | 'alt' | 'shift',
  arr: string[],
) => {
  const index = arr.indexOf(mod);
  if (~index) arr.splice(index, 1);
  return !!~index;
};

const parseKey = (key: string): { keys: string[]; modifiers: ModifiersSet } => {
  const entries = key.toLowerCase().split('+');

  const meta = parseModifier('meta', entries);
  const control = parseModifier('control', entries);
  const alt = parseModifier('alt', entries);
  const shift = parseModifier('shift', entries);

  return {
    keys: entries,
    modifiers: {
      meta,
      control,
      alt,
      shift,
    },
  };
};

const getModifiersMatch = (actual: ModifiersSet, required: ModifiersSet) =>
  Object.entries(actual).every(([key, value]) => required[key] === value);

const getKeysMatch = (actual: string[], required: string[]) =>
  actual.length === required.length &&
  required.every((key) => !!~actual.indexOf(key));

const getKeyFromCode = (code: string | undefined) => {
  if (!code) return '';

  if (code.startsWith('Key')) {
    return code[3].toLowerCase();
  }
  return code;
};

const isModifier = (ev: KeyboardEvent) => _modifiers.includes(ev.key);

const useHotkeys = (
  requiredKey: string,
  listener: (...args: any) => void,
  doc: Document = document,
) => {
  const { keys, modifiers } = parseKey(requiredKey);
  const pressedKeys: Set<string> = new Set();

  const callback = (ev: KeyboardEvent) => {
    ev.preventDefault();
    const actualKey = getKeyFromCode(ev.code);
    if (!isModifier(ev)) {
      pressedKeys.add(actualKey);
    }
    console.log(pressedKeys);
    const activeModifiers = getActiveModifiers(ev);
    const modifiersMatch = getModifiersMatch(activeModifiers, modifiers);
    if (!modifiersMatch) return;

    const keysMatch = getKeysMatch([...pressedKeys], keys);
    if (keysMatch) {
      listener();
    }
  };

  const cleanup = (ev: KeyboardEvent) => {
    const actualKey = getKeyFromCode(ev.code);
    if (pressedKeys.has(actualKey)) {
      pressedKeys.delete(actualKey);
    }
    if (actualKey === 'MetaLeft' || actualKey === 'MetaRight') {
      pressedKeys.clear(); // MacOS does not fire keyup event if meta is pressed
    }
  };

  useEffect(() => {
    doc.addEventListener('keydown', callback);
    doc.addEventListener('keyup', cleanup);

    return () => {
      doc.removeEventListener('keydown', callback);
      doc.removeEventListener('keyup', cleanup);
    };
  });
};

export default useHotkeys;
