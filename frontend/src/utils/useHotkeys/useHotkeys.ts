import { useEffect } from 'react';
import {
  parseShortcut,
  getKeyFromCode,
  getActiveModifiers,
  getModifiersMatch,
  getKeysMatch,
  isModifier,
  parseShortcutString,
} from './utils';

/**
 * Define a modifiers key using a 'meta', 'control', 'shift' or 'alt'.
 * Define a key using it's sign on a keyboard with english layout.
 * For keys without signs use their names ('space', 'tab', 'delete', 'backspace', 'arrowLeft' etc.)
 * Use a '+' sign as a splitting character
 * There are some restrictions: '+' and ',' can not be used as shortcuts
 * @param shortcutString Here you can set the key stroke you want the hook to listen to.
 * @param listener Gets executed when the defined keystroke gets hit by the user.
 * @param doc Here you can provide a document to add listener to. (e.g. iframe's contentDocument)
 */
const useHotkeys = (
  shortcutString: string,
  listener: (ev: KeyboardEvent) => void,
  doc: Document = document,
) => {
  const shortcuts = parseShortcutString(shortcutString);

  const handlers = shortcuts.map((shortcut) => {
    const { keys: requiredKeys, modifiers: requiredModifiers } =
      parseShortcut(shortcut);
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
      if (actualKey === 'metaleft' || actualKey === 'metaright') {
        pressedKeys.clear(); // MacOS does not fire keyup event if meta is pressed
      }
    };

    return [callback, cleanup];
  });

  useEffect(() => {
    handlers.forEach(([callback, cleanup]) => {
      doc.addEventListener('keydown', callback);
      doc.addEventListener('keyup', cleanup);
    });

    return () => {
      handlers.forEach(([callback, cleanup]) => {
        doc.removeEventListener('keydown', callback);
        doc.removeEventListener('keyup', cleanup);
      });
    };
  });
};

export default useHotkeys;
