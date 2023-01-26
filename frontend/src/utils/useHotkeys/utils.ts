/* eslint-disable no-bitwise, no-underscore-dangle */

export interface ModifiersSet {
  meta: boolean;
  control: boolean;
  alt: boolean;
  shift: boolean;
}

type Code = string; // ev.code
type Key = string; // just a string denoting key

const _keymap: Record<Code, Key> = {
  backquote: '`',
  minus: '-',
  equal: '=',
  bracketleft: '[',
  bracketright: ']',
  backslash: '\\',
  semicolon: ';',
  quote: "'",
  comma: ',',
  period: '.',
  slash: '/',
};

export const getKeyFromCode = (code: Code): Key => {
  const lowerCode = code.toLowerCase();
  if (lowerCode.startsWith('key')) {
    return lowerCode[3];
  }
  if (lowerCode.startsWith('digit')) {
    return lowerCode[5];
  }
  if (lowerCode in _keymap) {
    return _keymap[lowerCode];
  }
  return lowerCode;
};

const _modifiers = ['Control', 'Alt', 'Meta', 'Shift'];

export const getActiveModifiers = (ev: KeyboardEvent): ModifiersSet => ({
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

export const parseShortcutString = (keys: string) =>
  keys
    .toLowerCase()
    .split(',')
    .map((elem) => elem.trim());

export const parseShortcut = (
  key: string,
): { keys: Key[]; modifiers: ModifiersSet } => {
  const entries = key
    .toLowerCase()
    .split('+')
    .map((elem) => elem.trim());

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

export const getModifiersMatch = (
  actual: ModifiersSet,
  required: ModifiersSet,
) => {
  const actualArray = Object.entries(actual);
  const requiredArray = Object.entries(required);
  return (
    actualArray.length === requiredArray.length &&
    actualArray.every(([key, value]) => required[key] === value)
  );
};

export const getKeysMatch = (actual: Key[], required: Key[]) =>
  actual.length === required.length &&
  required.every((key) => !!~actual.indexOf(key));

export const isModifier = (ev: KeyboardEvent) => _modifiers.includes(ev.key);
