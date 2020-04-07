import React, {ReactNode} from 'react';
import {Menu} from './Menu';
import {firstChildMenu, isRootMenu, lastChildMenu, nextMenu, nextRootMenu, parentMenu} from "../utils/menuTraversal";
import {hotKeyString, isNotHotkey, Key} from "../utils/hotKeys";
import {classNames} from "../utils/classNames";
import {CLASS_MENUBAR} from "../utils/constants";
import { MenuBarContext } from './MenubarContext';

type HotKeyCallback = () => void;


type MenuBarProps = {
    onSelect?: (menuItem: string) => void,
    className?: string;
    expandIcon?: string | ReactNode;
    checkedIcon?: string | ReactNode;
    keyboard?: boolean;
}

export class MenuBar extends React.PureComponent<MenuBarProps, {}> {
    static Menu = Menu;

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
        let currentMenu = event.target as HTMLElement;
        if (event.key === Key.ESC) {
            (document.activeElement as HTMLElement).blur();
        } else if (event.key === Key.DOWN) {
            isRootMenu(currentMenu) ? firstChildMenu(currentMenu)?.focus() : nextMenu(currentMenu, 'DOWN')?.focus();
        } else if (event.key === Key.UP) {
            isRootMenu(currentMenu) ? lastChildMenu(currentMenu)?.focus() : nextMenu(currentMenu, 'UP')?.focus();
        } else if (event.key === Key.RIGHT) {
            let childMenu = firstChildMenu(currentMenu);
            childMenu ? childMenu.focus() : nextRootMenu(currentMenu, 'RIGHT')?.focus();
        } else if (event.key === Key.LEFT) {
            let parent = parentMenu(currentMenu);
            parent ? parent.focus() : nextRootMenu(currentMenu, 'LEFT')?.focus();
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

    registerCallback(hotKey: string, callback: HotKeyCallback) {
        this.hotkeyCallbacks[hotKey] = callback;
    }

    registerMenuKey(hotKey: string, menuKey: string) {
        this.hotkeyCallbacks[hotKey] = () => {
            if (this.props.onSelect) {
                this.props.onSelect(menuKey);
            }
        };
    }

    unregister(key: string) {
        delete this.hotkeyCallbacks[key];
    }
}