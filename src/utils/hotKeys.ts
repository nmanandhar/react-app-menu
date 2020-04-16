export enum Key {
    UP = 'ArrowUp',
    DOWN = 'ArrowDown',
    LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight',
    ESC = 'Escape',
    CTRL = 'Control',
    ALT = 'Alt',
    SHIFT = 'Shift',
    ENTER = 'Enter'
}


/**
 * Returns true if the keypress is a combination of modifier key (ctrl alt shift ) and any other key
 * @param event KeyboardEvent
 */
const isHotKey = (event: KeyboardEvent): boolean => {
    if (event.key === "Control" || event.key === "Alt" || event.key === "Shift") {
        return false; //it's not hot key when user just presses the modifiers
    } else if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
        return false; //and it's not hot key either when no modifiers are pressed
    }
    return true; //could be  a hotkey
};

/**
 * returns an array containing key pressed along with modifiers
 * returns null if the key itself is a modifier or no modifiers was present
 * @param event
 */
export const keyWithModifiers = (event: KeyboardEvent): string[] | null => {
    if (isHotKey(event)) {
        let keys = [];
        event.ctrlKey && keys.push("ctrl");
        event.altKey && keys.push("alt");
        event.shiftKey && keys.push("shift");
        keys.push(event.key);
        return keys;
    }
    return null;
};

/**
 * Given an array of hot keys like [Ctrl Shift Alt D] returns a normalized hotKey string ctrl-alt-shift-d
 * @param hotKeys
 */
export const normalizeKey = (hotKeys: string[]): string | null => {
    if (!hotKeys) {
        return null;
    }
    let keys = hotKeys.slice().map(key => key.toLowerCase());
    let modifierKeys = [];

    keys.indexOf("ctrl") > -1 && modifierKeys.push("ctrl");
    keys.indexOf("alt") > -1 && modifierKeys.push("alt");
    keys.indexOf("shift") > -1 && modifierKeys.push("shift");

    keys = keys.filter(k => ["ctrl", "alt", "shift"].indexOf(k) < 0);
    if (keys.length !== 1) {
        return null;
    }
    return [...modifierKeys, keys[0]].join('+');
};
