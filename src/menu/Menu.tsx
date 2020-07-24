import React, {useContext, useEffect, useRef} from 'react';
import {
    classNames,
    HOTKEY,
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
import {Keys} from '../utils/Keys';
import {MenuBarContext} from "./MenubarContext";

const alt = Keys.alt;
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
    closeOnSelect?: boolean,
}

export const Menu: React.FC<MenuProps> = ({onSelect, menuId, label, icon, hotKeys, focusKey, show = true, disabled = false, checked, children, closeOnSelect}) => {
    const menuBar = useContext(MenuBarContext);
    const longestSiblingHotkey = useContext(MenuContext);
    const ref = useRef<HTMLLIElement>(null);

    const isRootMenu = longestSiblingHotkey === null;
    if (children || isRootMenu) {
        hotKeys = undefined;
    }

    const hotKeysEnabled = menuBar?.hotKeysEnabled;
    const hotKeyActive = hotKeys && !disabled && show;

    useEffect(function registerHotKey() {
        hotKeysEnabled && hotKeyActive && onSelect && menuBar?.registerHotKey(hotKeys!, onSelect);
        hotKeysEnabled && hotKeyActive && !onSelect && menuId && menuBar?.registerHotKey(hotKeys!, () => menuBar?.onSelect && menuBar?.onSelect(menuId));

        hotKeysEnabled && focusKey && menuBar?.registerHotKey(alt(focusKey), () => ref.current?.focus());

        return function unRegister() {
            hotKeysEnabled && hotKeyActive && hotKeyActive && menuBar?.unregisterHotKey(hotKeys!);
            hotKeysEnabled && focusKey && menuBar?.unregisterHotKey(Keys.alt(focusKey));
        };
    }, [menuId, focusKey, onSelect, hotKeys, hotKeysEnabled, hotKeyActive]);


    if (!show || !menuBar) {
        return null;
    } else if (isRootMenu) {
        return (
            <li ref={ref} tabIndex={0}
                className={classNames(`reactAppMenubar--menu`, MENU_ROOT, {[`reactAppMenubar--menu-isDisabled`]: disabled})}>
                <div className={`reactAppMenubar--menu--labelContainer`}>
                    {icon && <span className={classNames(`reactAppMenubar--menu--icon`, ICON_ROOT)}>{icon}</span>}
                    <span className={`reactAppMenubar--menu--label`}>{focusKey && label.includes(focusKey) ?
                        <>
                            <span>{label.substr(0, label.indexOf(focusKey))}</span>
                            <span className={LABEL_EM}>{focusKey}</span>
                            <span>{label.substr(label.indexOf(focusKey) + 1)}</span>
                        </>
                        : label}
                    </span>
                </div>
                {children && !disabled && (<ul className={`reactAppMenubar--menu--submenus`}>
                        <MenuContext.Provider value={getLongestHotkeyInChildren(children)}>
                            {children}
                        </MenuContext.Provider>
                    </ul>
                )}
            </li>);
    } else {
        const clickHandler = children || disabled ? undefined : () => {
            selectMenu();
        };

        const keyDownHandler: React.KeyboardEventHandler | undefined = children || disabled ? undefined : (e) => {
            if (e.key === "Enter") {
                selectMenu();
            }
        }

        const selectMenu = () => {
            if ((typeof menuBar.disableMenubar === "boolean" && menuBar.disableMenubar) || (typeof menuBar.disableMenubar === "function" && menuBar.disableMenubar() === true)) {
                return;
            }

            if (closeOnSelect === false) {
            } else {
                document.activeElement && (document.activeElement as HTMLElement).blur();
            }
            if (onSelect) {
                onSelect();
            } else if (menuId && menuBar.onSelect) {
                menuBar.onSelect(menuId);
            } else {
                console.warn(`No handlers found for menu ${label}`);
            }
        }

        return (
            <li ref={ref} tabIndex={-1} className={classNames(MENU, {[MENU_DISABLED]: disabled})}
                onKeyDown={keyDownHandler}>
                <div className={LABEL_CONTAINER} onClick={clickHandler}>
                    <span className={classNames(ICON, ICON_LEFT)}>{checked ? menuBar.checkedIcon : icon}</span>
                    <span className={LABEL}>{label}</span>
                    {hotKeysEnabled && hotKeys && <span className={HOTKEY}>{hotKeys.join('+')}</span>}
                    {hotKeysEnabled && !hotKeys && longestSiblingHotkey &&
                    <span className={classNames(HOTKEY, HOTKEY_INVISIBLE)}>{longestSiblingHotkey}</span>}
                    {children && <span className={classNames(ICON, ICON_RIGHT)}>{menuBar.expandIcon}</span>}
                </div>
                {children && !disabled && (
                    <ul className={SUBMENUS}>
                        <MenuContext.Provider value={hotKeysEnabled ? getLongestHotkeyInChildren(children) : ''}>
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
