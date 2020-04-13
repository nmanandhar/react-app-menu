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


export const isNotHotkey = (event: KeyboardEvent): boolean => {
    if (event.key === "Control" || event.key === "Alt" || event.key === "Shift") {
        return true; //it's not hot key when user just presses the modifiers
    } else if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
        return true; //and it's not hot key either when no modifiers are pressed
    }
    return false; //could be  a hotkey
};

export const hotKeyString = (event: KeyboardEvent) => {
    let hotKeys = [];
    event.ctrlKey && hotKeys.push("ctrl");
    event.altKey && hotKeys.push("alt");
    event.shiftKey && hotKeys.push("shift");
    hotKeys.push(event.key.toLowerCase());
    return hotKeys.join("-");
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
    return [...modifierKeys, keys[0]].join('-');
};
