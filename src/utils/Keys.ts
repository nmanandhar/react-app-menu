/**
 * Utility class to help create hotKeys array
 */
export class Keys {
    static ctrl(key: string) {
        return ["Ctrl", key];
    }

    static alt(key: string) {
        return ["Alt", key.trim()]
    }

    static shift(key: string) {
        return ["Shift", key.trim()];
    }

    static ctrlAlt(key: string) {
        return ["Ctrl", "Alt", key];
    }

    static ctrlShift(key: string) {
        return ["Ctrl", "Shift", key.trim()];
    }

    static altShift(key: string) {
        return ["Alt", "Shift", key.trim()];
    }

    static ctrlAltShift(key: string) {
        return ["Ctrl","Alt", "Shift", key.trim()];
    }
}
