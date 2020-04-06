import React, {ReactNode} from "react";
import {MenuBarContext} from './context'
import {normalizeKey} from "./utils/hotKeys";
import {classNames} from "./utils/classNames";
import {Key} from "./keyboard";
import {
    CLASS_MENU,
    CLASS_MENU_DISABLED, CLASS_MENU_HOTKEY,
    CLASS_MENU_ICON, CLASS_MENU_ICON_EXPAND, CLASS_MENU_LABEL,
    CLASS_MENU_LABEL_CONTAINER,
    CLASS_MENU_ROOT, CLASS_MENU_SUBMENUS
} from "./constants";

type MenuProps = {
    label: string | ReactNode;
    menuKey?: string;      //optional key that will be passed when menu is selected,
    icon?: React.ReactNode;
    hotKeys?: string[];
    focusKey?: string;
    show?: boolean;
    disabled?: boolean;
    checked?: boolean;
    onSelect?: () => void,
    root?: boolean;
}

export default class Menu extends React.Component<MenuProps, any> {
    static contextType = MenuBarContext;
    context!: React.ContextType<typeof MenuBarContext>;
    private ref = React.createRef<HTMLLIElement>();

    static defaultProps = {
        disabled: false,
        show: true,
    };

    constructor(props: MenuProps) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    render() {
        if (!this.props.show) {
            return false;
        }

        let {disabled, checked, label, icon, hotKeys, focusKey, children, root} = this.props;
        let clickHandler = children || disabled ? undefined : this.handleMenuClick;
        let className = classNames(CLASS_MENU, {[CLASS_MENU_DISABLED]: disabled, [CLASS_MENU_ROOT]: root});

        return (
            <li ref={this.ref} tabIndex={root ? 0 : -1} className={className} onKeyDown={this.handleKeyDown}>
                <div className={CLASS_MENU_LABEL_CONTAINER} onClick={clickHandler}>
                    {checked && <span className={CLASS_MENU_ICON}>{this.checkedIcon}</span>}
                    {icon && checked !== true && <span className={CLASS_MENU_ICON}>{icon}</span>}

                    <span className={CLASS_MENU_LABEL}>{
                        focusKey && typeof label === "string" && label.includes(focusKey) ?
                            <>
                                <span>{label.substr(0, label.indexOf(focusKey))}</span>
                                <span className={"focus"}>{focusKey}</span>
                                <span>{label.substr(label.indexOf(focusKey) + 1)}</span>
                            </>
                            : label
                    }</span>

                    {hotKeys && <span className={CLASS_MENU_HOTKEY}>{hotKeys.join(' ')}</span>}
                    {!root && children && <span className={CLASS_MENU_ICON_EXPAND}>{this.expandIcon}</span>}
                </div>
                {children && !disabled &&
                <ul className={CLASS_MENU_SUBMENUS}>
                    {children}
                </ul>
                }
            </li>);
    }


    handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === Key.ENTER) {
            if (!this.props.disabled && !this.props.children) {
                this.handleMenuClick();
            }
        }
    }

    componentDidMount(): void {
        if (!this.props.disabled && this.props.show && this.context) {
            //register hot key if any
            if (this.props.hotKeys) {
                let hotKey = normalizeKey(this.props.hotKeys);
                if (hotKey && this.props.onSelect) {
                    this.context.registerHotKey(hotKey, this.props.onSelect);
                } else if (hotKey && this.props.menuKey) {
                    this.context.registerMenuHotKey(hotKey, this.props.menuKey);
                } else if (hotKey) {
                    console.warn(`Could not register hotkey ${hotKey}. Provide a onSelect method on Menu or its parent MenuBar to register hotkey`);
                }
            }

            //register focus hotkeys
            if (this.props.focusKey) {
                let hotKey = normalizeKey(['alt', this.props.focusKey]);
                if (hotKey) {
                    this.context.registerHotKey(hotKey, () => {
                        this.ref.current && this.ref.current.focus();
                    })
                }
            }
        }
    }

    handleMenuClick() {
        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
        if (this.props.onSelect) {
            this.props.onSelect();

        } else if (this.props.menuKey) {
            if (this.context && this.context.props.onSelect) {
                this.context.props.onSelect(this.props.menuKey);
            } else {
                console.log(`No handlers found for menu ${this.props.label}. Define a onSelect method on Menu or globally on the MenuBar`);
            }
        } else {
            console.log(`No handlers found for menu ${this.props.label} click. Define a onSelect method on Menu or provide a menuKey so that MenuBar can handle the event`);
        }
    }

    get checkedIcon() {
        return this.context?.props.checkedIcon;
    }

    get expandIcon() {
        return this.context?.props.expandIcon;
    }
}
