import React, {ReactNode} from 'react';
import {Menu} from './Menu';
import {firstChildMenu, isRootMenu, lastChildMenu, nextMenu, nextRootMenu, parentMenu} from "../utils/menuTraversal";
import {hotKeyString, isNotHotkey, Key} from "../utils/hotKeys";
import {MENUBAR, MENUBAR_HOVERABLE} from "../utils/classNames";
import {MenuBarContext} from './MenubarContext';
import {MdKeyboardArrowRight} from '../utils/icons/MdKeyboardArrowRight';
import {FaCheck} from "../utils/icons/FaCheck";
import {classNames} from "../utils/classNames";

type HotKeyCallback = () => void;


type MenuBarProps = {
    onSelect?: (menuItem: string) => void,
    className?: string;
    expandIcon?: string | ReactNode;
    checkedIcon?: string | ReactNode;
    keyboard?: boolean;
    openMenusOnHover?: boolean;
}

export class MenuBar extends React.PureComponent<MenuBarProps, {}> {
    static Menu = Menu;

    static defaultProps = {
        checkedIcon: <FaCheck/>,
        expandIcon: <MdKeyboardArrowRight/>,
        keyboard: true,
        openMenusOnHover: false
    };

    // a mapping of hotkeys to their callback functions
    hotkeyCallbacks: { [key: string]: HotKeyCallback } = {};

    constructor(props: MenuBarProps) {
        super(props);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        this.handleHotKeys = this.handleHotKeys.bind(this);
    }

    render() {
        let barClassName = `${MENUBAR}${this.props.className ? this.props.className : ''}`;

        return <MenuBarContext.Provider value={this}>
            <ul className={classNames(MENUBAR,this.props.className,{[MENUBAR_HOVERABLE]:this.props.openMenusOnHover})} onKeyDown={this.handleKeyboardNavigation}>
                {React.Children.map(this.props.children, (child) => {
                    // @ts-ignore
                    return React.cloneElement(child, {root: true});
                })}
            </ul>
        </MenuBarContext.Provider>;
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