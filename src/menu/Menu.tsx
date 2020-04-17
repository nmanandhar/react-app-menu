import React, {useContext, useEffect, useRef} from 'react';
import {
    classNames,
    HOTKEY,
    HOTKEY_DISABLED,
    HOTKEY_INVISIBLE,
    ICON,
    ICON_LEFT,
    ICON_RIGHT,
    ICON_ROOT,
    LABEL,
    LABEL_CONTAINER,
    LABEL_EM,
    MENU,
    MENU_DISABLED,
    MENU_ROOT,
    SUBMENUS,
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
    const menuBar = useContext(MenuBarContext);
    const longestHotkeyInSiblingMenus = useContext(MenuContext);
    const ref = useRef<HTMLLIElement>(null);

    const isRootMenu = longestHotkeyInSiblingMenus === null;

    const isHotKeyDisabled = !hotKeys || !menuBar?.hotKeysEnabled || isRootMenu || children || disabled || !show || (!onSelect && (!menuId || !menuBar?.onSelect));

    useEffect(() => {
        if (hotKeys && !isHotKeyDisabled) {
            if (onSelect) {
                menuBar?.registerHotKey(hotKeys, onSelect);
            } else if (menuId && menuBar?.onSelect) {
                menuBar.registerHotKey(hotKeys, () => {
                    menuBar?.onSelect && menuBar?.onSelect(menuId);
                });
            }
        }

        focusKey && menuBar?.registerHotKey(['alt', focusKey], () => {
            ref.current?.focus();
        });

        return () => {
            hotKeys && menuBar?.unregisterHotKey(hotKeys);
            focusKey && menuBar?.unregisterHotKey(['alt', focusKey]);
        };
    }, [menuId, focusKey, onSelect, hotKeys, isHotKeyDisabled]);



    if (!show || !menuBar) {
        return null;
    } else if (isRootMenu) {
        return (
            <li ref={ref} tabIndex={0} className={classNames(MENU, MENU_ROOT, {[MENU_DISABLED]: disabled})}>
                <div className={LABEL_CONTAINER}>
                    {icon && <span className={classNames(ICON, ICON_ROOT)}>{icon}</span>}
                    <span className={LABEL}>{focusKey && label.includes(focusKey) ?
                        <>
                            <span>{label.substr(0, label.indexOf(focusKey))}</span>
                            <span className={LABEL_EM}>{focusKey}</span>
                            <span>{label.substr(label.indexOf(focusKey) + 1)}</span>
                        </>
                        : label}
                    </span>
                </div>
                {children && !disabled && (<ul className={SUBMENUS}>
                        <MenuContext.Provider value={getLongestHotkeyInChildren(children)}>
                            {children}
                        </MenuContext.Provider>
                    </ul>
                )}
            </li>);
    } else {
        const clickHandler = children || disabled ? undefined : () => {
            document.activeElement && (document.activeElement as HTMLElement).blur();
            if (onSelect) {
                onSelect();
            } else if (menuId && menuBar.onSelect) {
                menuBar.onSelect(menuId);
            } else {
                console.warn(`No handlers found for menu ${label}`);
            }
        };
        const hotKeysEnabled = menuBar.hotKeysEnabled;
        return (
            <li ref={ref} tabIndex={-1} className={classNames(MENU, {[MENU_DISABLED]: disabled})}>
                <div className={LABEL_CONTAINER} onClick={clickHandler}>
                    <span className={classNames(ICON, ICON_LEFT)}>{checked ? menuBar.checkedIcon : icon}</span>
                    <span className={LABEL}>{label}</span>
                    {hotKeysEnabled && hotKeys && !children && <span
                        className={classNames(HOTKEY, {[HOTKEY_DISABLED]: isHotKeyDisabled})}>{hotKeys.join('+')}</span>}
                    {hotKeysEnabled && !hotKeys && longestHotkeyInSiblingMenus &&
                    <span className={classNames(HOTKEY, HOTKEY_INVISIBLE)}>{longestHotkeyInSiblingMenus}</span>}
                    {children && <span className={classNames(ICON, ICON_RIGHT)}>{menuBar.expandIcon}</span>}
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
    }
};

const getLongestHotkeyInChildren = (children: React.ReactNode): string => {
    let longestSubmenuHotKey = '';
    React.Children.toArray(children).forEach((child) => {
        const menuChild = (child as React.ReactElement<MenuProps>);
        if (menuChild.props.hotKeys) {
            const hotKeyStr = menuChild.props.hotKeys.join('+');
            if (hotKeyStr.length > longestSubmenuHotKey.length) {
                longestSubmenuHotKey = hotKeyStr;
            }
        }
    });
    return longestSubmenuHotKey;
};
