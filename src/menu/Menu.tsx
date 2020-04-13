import React, {ReactNode} from "react";
import {Key, normalizeKey} from "../utils/hotKeys";
import {
    classNames,
    HOTKEY,
    HOTKEY_DISABLED, HOTKEY_INVISIBLE,
    ICON,
    ICON_LEFT,
    ICON_RIGHT, ICON_ROOT,
    LABEL,
    LABEL_CONTAINER,
    LABEL_EM,
    MENU,
    MENU_DISABLED,
    MENU_ROOT,
    SUBMENUS
} from "../utils/classNames";
import {Separator} from "./Separator";
import {MenuBarContext} from "./MenubarContext";


type MenuProps = {
    menuId?: string;
    label: string | ReactNode;
    icon?: string |React.ReactNode;
    hotKeys?: string[];
    focusKey?: string;
    show?: boolean;
    disabled?: boolean;
    checked?: boolean;
    onSelect?: () => void,
    root?: boolean;
    longestSubmenuHotKey?: string;
}

export class Menu extends React.PureComponent<MenuProps, any> {
    static Separator = Separator;

    static defaultProps = {
        disabled: false,
        show: true,
    };

    static contextType = MenuBarContext;
    context!: React.ContextType<typeof MenuBarContext>;
    private ref = React.createRef<HTMLLIElement>();

    constructor(props: MenuProps) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.activateMenuOnEnter = this.activateMenuOnEnter.bind(this);
    }

    render() {
        if (!this.props.show) {
            return false;
        }

        let {disabled, checked, label, icon, hotKeys, focusKey, children, root} = this.props;
        let clickHandler = children || disabled ? undefined : this.handleMenuClick;
        let className = classNames(MENU, {[MENU_DISABLED]: disabled, [MENU_ROOT]: root});

        let longestSubmenuHotKey: string | undefined = undefined;
        if (!disabled) {
            React.Children.toArray(this.props.children).forEach(child => {
                let menuChild = (child as React.ReactElement<MenuProps>);
                if (menuChild.props.hotKeys) {
                    let hotKeyStr = menuChild.props.hotKeys.join('-');
                    if (!longestSubmenuHotKey) {
                        longestSubmenuHotKey = hotKeyStr;
                    } else if (hotKeyStr.length > longestSubmenuHotKey.length) {
                        longestSubmenuHotKey = hotKeyStr;
                    }
                }
            });
        }


        return (
            <li ref={this.ref} tabIndex={root ? 0 : disabled ? undefined : -1} onKeyDown={this.activateMenuOnEnter}
                className={classNames(MENU, {[MENU_DISABLED]: disabled, [MENU_ROOT]: root})}>
                <div className={LABEL_CONTAINER} onClick={clickHandler}>
                    {root && icon && <span className={classNames(ICON, ICON_ROOT)}>{icon}</span>}
                    {!root && <span className={classNames(ICON, ICON_LEFT)}>{checked ? this.checkedIcon : icon}</span>}

                    <span className={LABEL}>{focusKey && typeof label === "string" && label.includes(focusKey) ?
                        <>
                            <span>{label.substr(0, label.indexOf(focusKey))}</span>
                            <span className={LABEL_EM}>{focusKey}</span>
                            <span>{label.substr(label.indexOf(focusKey) + 1)}</span>
                        </>
                        : label
                    }</span>

                    {hotKeys && !children && <span
                        className={classNames(HOTKEY, {[HOTKEY_DISABLED]: this.hotKeyDisabled()})}>{hotKeys.join(' ')}</span>}
                    {!root && !hotKeys && this.props.longestSubmenuHotKey &&
                    <span className={classNames(HOTKEY, HOTKEY_INVISIBLE)}>{this.props.longestSubmenuHotKey}</span>}

                    {!root && children && <span className={classNames(ICON, ICON_RIGHT)}>{this.expandIcon}</span>}
                </div>
                {children && !disabled && <ul className={SUBMENUS}>{React.Children.map(this.props.children, (child) => {
                    // @ts-ignore
                    return React.cloneElement(child, {longestSubmenuHotKey});
                })}</ul>}
            </li>);
    }

    componentDidMount(): void {
        this.registerHotKeys();
    }


    private hotKeyDisabled() {
        return this.props.disabled || (!this.props.onSelect && (!this.props.hotKeys || !this.context?.props.onSelect));
    }

    private hotKeyClasses() {
        let isHotKeyDisabled = this.props.disabled || (!this.props.onSelect && (!this.props.hotKeys || !this.context?.props.onSelect));
        return classNames(HOTKEY, {[HOTKEY_DISABLED]: isHotKeyDisabled});
    }

    componentDidUpdate(prevProps: Readonly<MenuProps>, prevState: Readonly<any>, snapshot?: any): void {
        this.unregisterHotKeys(prevProps);
        this.registerHotKeys();
    }

    private unregisterHotKeys(oldProps: MenuProps) {
        if (oldProps.hotKeys) {
            let hotKey = normalizeKey(oldProps.hotKeys);
            if (hotKey) {
                this.context?.unregister(hotKey);
            }
        }
    }

    private registerHotKeys() {
        let {disabled, show, menuId, hotKeys, focusKey, onSelect} = this.props;
        if (!disabled && show && this.context) {
            //register hot key if any
            if (hotKeys) {
                let hotKey = normalizeKey(hotKeys);
                if (hotKey && onSelect) {
                    this.context.registerCallback(hotKey, onSelect);
                } else if (hotKey && menuId) {
                    this.context.registerMenuId(hotKey, menuId);
                } else if (hotKey) {
                    console.warn(`Could not register hotkey ${hotKey}. Provide a onSelect method on Menu or its parent MenuBar to register hotkey`);
                }
            }

            //register focus hotkeys
            if (focusKey) {
                let focusHotKey = normalizeKey(['alt', focusKey]);
                if (focusHotKey) {
                    this.context.registerCallback(focusHotKey, () => {
                        this.ref.current && this.ref.current.focus();
                    })
                }
            }
        }
    }

    activateMenuOnEnter(event: React.KeyboardEvent) {
        if (event.key === Key.ENTER) {
            if (!this.props.disabled && !this.props.children) {
                this.handleMenuClick();
            }
        }
    }

    handleMenuClick() {
        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
        if (this.props.onSelect) {
            this.props.onSelect();

        } else if (this.props.menuId) {
            if (this.context && this.context.props.onSelect) {
                this.context.props.onSelect(this.props.menuId);
            } else {
                console.log(`No handlers found for menu ${this.props.label}. Define a onSelect method on Menu or globally on the MenuBar`);
            }
        } else {
            console.log(`No handlers found for menu ${this.props.label} click. Define a onSelect method on Menu or provide a menuId so that MenuBar can handle the event`);
        }
    }

    get checkedIcon() {
        return this.context?.props.checkedIcon;
    }

    get expandIcon() {
        return this.context?.props.expandIcon;
    }
}
