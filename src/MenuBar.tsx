import React, {ReactNode} from 'react';
import Menu from './Menu';
import {MenuBarContext} from './context';
import {Key} from "./keyboard";
import {firstChildMenu, isRootMenu, lastChildMenu, nextMenu, nextRootMenu, parentMenu} from "./utils/menuNavigation";
import {hotKeyString, isNotHotkey} from "./utils/hotKeys";
import {classNames} from "./utils/classNames";
import {CLASS_MENU_SEPARATOR, CLASS_MENUBAR} from "./constants";

export const Separator = () => <div className={CLASS_MENU_SEPARATOR}/>;

type MenuBarProps = {
    onSelect?: (menuItem: string) => void,
    className?: string;
    expandIcon?: string | ReactNode;
    checkedIcon?: string | ReactNode;
    keyboard?: boolean;
}

export type HotKeyCallback = () => void;

export default class MenuBar extends React.Component<MenuBarProps, {}> {
    static Menu = Menu;
    static Separator = Separator;

    static defaultProps = {
        checkedIcon: "☑",
        expandIcon: "▶",
        keyboard: true
    };

    // a mapping of hotkeys to their callback functions
    hotkeyCallbacks: { [key: string]: HotKeyCallback } = {};

    constructor(props: MenuBarProps) {
        super(props);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        this.handleHotKeys = this.handleHotKeys.bind(this);
    }

    render() {
        return <MenuBarContext.Provider value={this}>
            <ul className={classNames(CLASS_MENUBAR, this.props.className)} onKeyDown={this.handleKeyboardNavigation}>
                {React.Children.map(this.props.children, (child) => {
                    // @ts-ignore
                    return React.cloneElement(child, {root: true});
                })}
            </ul>
        </MenuBarContext.Provider>
    }

    componentDidMount(): void {
        if (this.props.keyboard) {
            document.addEventListener('keydown', this.handleHotKeys);
        }
    }

    componentWillUnmount(): void {
        document.removeEventListener('keydown', this.handleHotKeys);
    }

    handleKeyboardNavigation(event: React.KeyboardEvent) {
        let target = event.target as HTMLElement;
        if (event.key === Key.ESC) {
            (document.activeElement as HTMLElement).blur();
        } else if (event.key === Key.DOWN) {
            if (isRootMenu(target)) {
                let firstMenu = firstChildMenu(target);
                firstMenu && firstMenu.focus();
            } else {
                let next = nextMenu(target, 'DOWN');
                next && next.focus();
            }
        } else if (event.key === Key.UP) {
            if (isRootMenu(target)) {
                let lastMenu = lastChildMenu(target);
                lastMenu && lastMenu.focus();
            } else {
                let next = nextMenu(target, 'UP');
                next && next.focus();
            }
        } else if (event.key === Key.RIGHT) {
            let childMenu = firstChildMenu(target);
            if (childMenu) {
                childMenu.focus();
            } else {
                nextRootMenu(target, 'RIGHT')?.focus();
            }
        } else if (event.key === Key.LEFT) {
            let parent = parentMenu(target);
            if (parent) {
                parent.focus();
            } else {
                nextRootMenu(target, 'LEFT')?.focus();
            }
        }
    }

    handleHotKeys(event: KeyboardEvent): void {
        if (isNotHotkey(event)) {
            return;
        }
        const hotKey = hotKeyString(event);
        if (this.hotkeyCallbacks[hotKey]) {
            event.stopPropagation();
            event.preventDefault();
            this.hotkeyCallbacks[hotKey]();
        }
    };

    registerHotKey(hotKey: string, callback: HotKeyCallback) {
        this.hotkeyCallbacks[hotKey] = callback;
    }

    registerMenuHotKey(hotKey: string, menuKey: string) {
        this.hotkeyCallbacks[hotKey] = () => {
            if (this.props.onSelect) {
                this.props.onSelect(menuKey);
            }
        };
    }

    unregisterHotKey(key: string) {
        let result = delete this.hotkeyCallbacks[key];
        if (!result) {
            console.warn('could not find any hotkeys registered for ', key);
        }
    }
}