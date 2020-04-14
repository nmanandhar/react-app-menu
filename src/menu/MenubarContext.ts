import React, {ReactNode} from "react";

export type Callback = () => void

export interface IMenubarContext {
    onSelect?: (menuId: string) => void
    expandIcon: string | ReactNode;
    checkedIcon: string | ReactNode;
    hotKeysEnabled: boolean;
    registerHotKey: (hotKey: string, callback: Callback) => void
    unregisterHotKey: (hotKey: string) => void
}

export const MenuBarContext = React.createContext<IMenubarContext | null>(null);
