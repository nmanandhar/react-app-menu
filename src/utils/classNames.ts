export const MENUBAR = 'reactAppMenubar';
export const MENUBAR_HOVERABLE = 'reactAppMenubar-isHoverable';
export const MENU = `${MENUBAR}--menu`;
export const MENU_ROOT = `${MENUBAR}--menu-root`;
export const MENU_DISABLED = `${MENUBAR}--menu-isDisabled`;
export const MENU_SEPARATOR = `${MENUBAR}--menu-separator`;
export const LABEL_CONTAINER = `${MENUBAR}--menu--labelContainer`;
export const LABEL = `${MENUBAR}--menu--label`;
export const LABEL_EM = `${MENUBAR}--menu--label-em`;
export const ICON = `${MENUBAR}--menu--icon`;
export const ICON_ROOT = `${MENUBAR}--menu--icon-root`;
export const ICON_LEFT = `${MENUBAR}--menu--icon-left`;
export const ICON_RIGHT = `${MENUBAR}--menu--icon-right`;
export const HOTKEY = `${MENUBAR}--menu--hotKeys`;
export const HOTKEY_DISABLED = `${MENUBAR}--menu--hotKeys-disabled`;
export const HOTKEY_INVISIBLE = `${MENUBAR}--menu--hotKeys-invisible`;
export const SUBMENUS = `${MENUBAR}--menu--submenus`;

export function classNames(...args: any): string {
    const classes = [];
    for (let i = 0; i < arguments.length; i++) {
        let arg = arguments[i];
        if (typeof arg === "object") {
            for (let key of Object.keys(arg)) {
                arg[key] && classes.push(key);
            }
        } else if (typeof arg === "string") {
            classes.push(arg);
        }
    }
    return classes.join(' ');
}