import { useEffect } from 'react';
import {
  parseKey,
  getKeyFromCode,
  getActiveModifiers,
  getModifiersMatch,
  getKeysMatch,
  isModifier,
} from './utils';

/**
 * Define a modifiers key using a 'meta', 'control', 'shift' or 'alt'.
 * Define a key using it's sign on a keyboard with english layout.
 * For keys without signs use their names ('space', 'tab', 'delete', 'backspace', 'arrowLeft' etc.)
 * Use a '+' sign as a splitting character
 * @param key Here you can set the key stroke you want the hook to listen to.
 * @param listener Gets executed when the defined keystroke gets hit by the user.
 * @param doc Here you can provide a document to add listener to. (e.g. iframe's contentDocument)
 */
const useHotkeys = (
  key: string,
  listener: (ev: KeyboardEvent) => void,
  doc: Document = document,
) => {
  const { keys: requiredKeys, modifiers: requiredModifiers } = parseKey(key);
  const pressedKeys: Set<string> = new Set();

  const callback = (ev: KeyboardEvent) => {
    if (ev.repeat) return;
    if (isModifier(ev)) return; // no need to handle modifier keydown

    const actualKey = getKeyFromCode(ev.code);

    pressedKeys.add(actualKey);

    const actualModifiers = getActiveModifiers(ev);

    if (!getModifiersMatch(actualModifiers, requiredModifiers)) return; // required and actual modifiers do not match

    if (getKeysMatch([...pressedKeys], requiredKeys)) {
      // required and actual keys match
      listener(ev);
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
