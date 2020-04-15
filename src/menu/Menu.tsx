import React, {useContext, useEffect, useRef} from 'react';
import {normalizeKey} from '../utils/hotKeys';
import {
    classNames, HOTKEY, HOTKEY_DISABLED, HOTKEY_INVISIBLE,
    ICON, ICON_LEFT, ICON_RIGHT, ICON_ROOT,
    LABEL, LABEL_CONTAINER, LABEL_EM,
    MENU, MENU_DISABLED, MENU_ROOT, SUBMENUS,
} from '../utils/classNames';
import {MenuBarContext} from "./MenubarContext";

const MenuContext = React.createContext<string | null>(null);

type MenuProps = {
    menuId?: string;
    label: string;
    icon?: string | React.ReactNode;
    hotKeys?: string[];
    focusKey?: string;
    show?: boolean;
    disabled?: boolean;
    checked?: boolean;
    onSelect?: () => void,
}

export const Menu: React.FC<MenuProps> = ({onSelect, menuId, label, icon, hotKeys, focusKey, show = true, disabled = false, checked, children}) => {
    const menuBarContext = useContext(MenuBarContext);
    const longestHotkeyInSiblingMenus = useContext(MenuContext);
    const ref = useRef<HTMLLIElement>(null);


    const isHotkeyDisabled = !menuBarContext?.hotKeysEnabled || children || disabled || !show || (!onSelect && (!hotKeys || !menuBarContext?.onSelect));

    const hotKey = isHotkeyDisabled || !hotKeys ? null : normalizeKey(hotKeys);

    useEffect(() => {
        if (hotKey) {
            if (onSelect) {
                menuBarContext?.registerHotKey(hotKey, onSelect);
            } else if (menuId && menuBarContext?.onSelect) {
                menuBarContext.registerHotKey(hotKey, () => {
                    menuBarContext?.onSelect && menuBarContext?.onSelect(menuId);
                });
            }
        }

        const hotKeyFocus: string | null = focusKey ? normalizeKey(['alt', focusKey]) : null;
        hotKeyFocus && menuBarContext?.registerHotKey(hotKeyFocus, () => {
            ref.current?.focus();
        });

        return () => {
            hotKey && menuBarContext?.unregisterHotKey(hotKey);
            hotKeyFocus && menuBarContext?.unregisterHotKey(hotKeyFocus);
        };
        //context change should not fire this effect
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuId, focusKey, onSelect, hotKey]);


    if (!show) {
        return null;
    }

    const isRootMenu = longestHotkeyInSiblingMenus === null;
    const clickHandler = children || disabled ? undefined : () => {
        document.activeElement && (document.activeElement as HTMLElement).blur();

        if (onSelect) {
            onSelect();
        } else if (menuId && menuBarContext?.onSelect) {
            menuBarContext.onSelect(menuId);
        } else {
            console.log(`No handlers found for menu ${label}`);
        }
    };


    return (
        <li ref={ref} tabIndex={isRootMenu ? 0 : disabled ? undefined : -1}
            className={classNames(MENU, {[MENU_DISABLED]: disabled, [MENU_ROOT]: isRootMenu})}>
            <div className={LABEL_CONTAINER} onClick={clickHandler}>
                {isRootMenu && icon && <span className={classNames(ICON, ICON_ROOT)}>{icon}</span>}
                {!isRootMenu
                && <span className={classNames(ICON, ICON_LEFT)}>{checked ? menuBarContext?.checkedIcon : icon}</span>}

                <span className={LABEL}>
          {focusKey && label.includes(focusKey) ? <>
                  <span>{label.substr(0, label.indexOf(focusKey))}</span>
                  <span className={LABEL_EM}>{focusKey}</span>
                  <span>{label.substr(label.indexOf(focusKey) + 1)}</span>
              </>
              : label}
        </span>

                {hotKeys && !children && <span className={classNames(HOTKEY, {[HOTKEY_DISABLED]: isHotkeyDisabled})}>{normalizeKey(hotKeys)}</span>}
                {!isRootMenu && !hotKeys && longestHotkeyInSiblingMenus &&
                <span className={classNames(HOTKEY, HOTKEY_INVISIBLE)}>{longestHotkeyInSiblingMenus}</span>}
                {!isRootMenu && children
                && <span className={classNames(ICON, ICON_RIGHT)}>{menuBarContext?.expandIcon}</span>}
            </div>
            {children && !disabled && (
                <ul className={SUBMENUS}>
                    <MenuContext.Provider value={getLongestHotkeyInChildren(children)}>
                        {children}
                    </MenuContext.Provider>
                </ul>
            )}
        </li>
    );
};


const getLongestHotkeyInChildren = (children: React.ReactNode): string => {
    let longestSubmenuHotKey = '';
    React.Children.toArray(children).forEach((child) => {
        const menuChild = (child as React.ReactElement<MenuProps>);
        if (menuChild.props.hotKeys) {
            const hotKeyStr = menuChild.props.hotKeys.join('-');
            if (hotKeyStr.length > longestSubmenuHotKey.length) {
                longestSubmenuHotKey = hotKeyStr;
            }
        }
    });
    return longestSubmenuHotKey;
};
