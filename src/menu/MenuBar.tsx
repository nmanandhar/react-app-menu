import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {firstChildMenu, isRootMenu, lastChildMenu, nextMenu, nextRootMenu, parentMenu} from "../utils/menuTraversal";
import {Key, keyWithModifiers, normalizeKey} from "../utils/hotKeys";
import {classNames, MENUBAR, MENUBAR_HOVERABLE} from "../utils/classNames";
import {Callback, IMenubarContext, MenuBarContext} from "./MenubarContext";


type MenuBarProps = {
    onSelect?: (menuId: string) => void,
    className?: string;
    expandIcon?: string | ReactNode;
    checkedIcon?: string | ReactNode;
    enableHotKeys?: boolean;
    openMenusOnHover?: boolean;
}
export const MenuBar: React.FC<MenuBarProps> = ({onSelect, expandIcon = "⮞", checkedIcon = "✔", enableHotKeys = true, openMenusOnHover = false, className, children}) => {
    const [callbacks] = useState<{ [key: string]: Callback }>({});

    useEffect(() => {
        const hotKeyHandler = (keyboardEvent: KeyboardEvent): void => {
            let hotKeyPressed = keyWithModifiers(keyboardEvent);
            if (hotKeyPressed) {
                let key = normalizeKey(hotKeyPressed);
                if (key && callbacks[key]) {
                    keyboardEvent.stopPropagation();
                    keyboardEvent.preventDefault();
                    const callback = callbacks[key];
                    callback();
                }
            }
        };
        if (enableHotKeys) {
            document.addEventListener('keydown', hotKeyHandler);
        }
        return () => {
            document.removeEventListener('keydown', hotKeyHandler);
        }
    }, [enableHotKeys, callbacks]);


    const context: IMenubarContext = useMemo(() => ({
            onSelect,
            expandIcon,
            checkedIcon,
            hotKeysEnabled: enableHotKeys,
            registerHotKey: (hotkey: Array<string>, callback: Callback): void => {
                let key = normalizeKey(hotkey);
                if (key) {
                    if (callbacks[key]) {
                        console.warn(`Duplicate hotkey ${key}. One of your hotkeys might not trigger`);
                    }
                    callbacks[key] = callback;
                }
            },
            unregisterHotKey: (hotkey: Array<string>): void => {
                let key = normalizeKey(hotkey);
                if (key) {
                    delete callbacks[key];
                }
            }
        }
    ), [checkedIcon, expandIcon, enableHotKeys, onSelect, callbacks]);

    return (
        <ul className={classNames(MENUBAR, className, {[MENUBAR_HOVERABLE]: openMenusOnHover})}
            onKeyDown={handleKeyNavigation}>
            <MenuBarContext.Provider value={context}>
                {children}
            </MenuBarContext.Provider>
        </ul>
    );
};


const handleKeyNavigation = (event: React.KeyboardEvent) => {
    let currentMenu = document.activeElement;
    let nextFocusElement: Element | null = null;

    if (event.key === Key.ESC) {
        (document.activeElement as HTMLElement).blur();
    } else if (event.key === Key.DOWN) {
        nextFocusElement = isRootMenu(currentMenu) ? firstChildMenu(currentMenu) : nextMenu(currentMenu, 'DOWN');
    } else if (event.key === Key.UP) {
        nextFocusElement = isRootMenu(currentMenu) ? lastChildMenu(currentMenu) : nextMenu(currentMenu, 'UP');
    } else if (event.key === Key.RIGHT) {
        let childMenu = firstChildMenu(currentMenu);
        nextFocusElement = isRootMenu(currentMenu) || !childMenu ? nextRootMenu(currentMenu, 'RIGHT') : childMenu;
    } else if (event.key === Key.LEFT) {
        let parent = parentMenu(currentMenu);
        nextFocusElement = isRootMenu(parent) || !parent ? nextRootMenu(currentMenu, 'LEFT') : parent;
    }

    (nextFocusElement as HTMLLIElement)?.focus();
};
