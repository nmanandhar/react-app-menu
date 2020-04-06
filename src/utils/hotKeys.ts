

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
 * @param keys
 */
export const normalizeKey = (keys: string[]): string | null => {
    if (!keys) {
        return null;
    }
    let hotKeys = keys.slice();
    let temp = [];
    let filterdHotKeys: string[];


    filterdHotKeys = hotKeys.filter(key => key.toLowerCase() !== "ctrl");
    if (filterdHotKeys.length !== hotKeys.length) {
        temp.push("ctrl");
        hotKeys = filterdHotKeys;
    }

    filterdHotKeys = hotKeys.filter(key => key.toLowerCase() !== "alt");
    if (filterdHotKeys.length !== hotKeys.length) {
        temp.push("alt");
        hotKeys = filterdHotKeys;
    }

    filterdHotKeys = hotKeys.filter(key => key.toLowerCase() !== "shift");
    if (filterdHotKeys.length !== hotKeys.length) {
        temp.push("shift");
        hotKeys = filterdHotKeys;
    }


    if (hotKeys.length !== 1 || hotKeys[0].length !== 1 || temp.length < 1) {
        console.warn('Invalid hot key ', keys);
        return null;
    }

    temp.push(filterdHotKeys[0].toLowerCase());

    return temp.join('-');
};
