/**
 * Utility class to help create hotKeys array
 */
export class Keys {
    static ctrl(key: string) {
        return ["ctrl", key.trim()];
    }

    static alt(key: string) {
        return ["alt", key.trim()]
    }

    static shift(key: string) {
        return ["shift", key.trim()];
    }

    static ctrlAlt(key: string) {
        return ["ctrl", "alt", key];
    }

    static ctrlShift(key: string) {
        return ["ctrl", "shift", key.trim()];
    }

    static altShift(key: string) {
        return ["alt", "shift", key.trim()];
    }

    static ctrlAltShift(key: string) {
        return ["ctrl","alt", "shift", key.trim()];
    }
}
