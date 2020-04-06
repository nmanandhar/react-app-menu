import {
    ancestor,
    hasClass,
    firstImmediateChild,
    sibling,
    lastImmediateChild,
    prevSibling
} from "./dom";

export const CLASS_MENU = 'reactAppMenubar--menu';
export const CLASS_MENU_ROOT = 'reactAppMenubar--menu-root';
export const CLASS_MENU_DISABLED = 'reactAppMenubar--menu-isDisabled';
export const CLASS_SUBMENUS = 'reactAppMenubar--menu--submenus';


export const isRootMenu = (target: HTMLElement | null): boolean => {
    return target != null && hasClass(target, CLASS_MENU_ROOT);
};

export const lastChildMenu = (target: HTMLElement): HTMLElement | null => {
    let childMenus = firstImmediateChild(target, CLASS_SUBMENUS);
    return lastImmediateChild(childMenus, CLASS_MENU, CLASS_MENU_DISABLED);
};

export const firstChildMenu = (target: HTMLElement): HTMLElement | null => {
    let childMenus = firstImmediateChild(target, CLASS_SUBMENUS);
    return firstImmediateChild(childMenus, CLASS_MENU, CLASS_MENU_DISABLED);
};

export const nextRootMenu = (target: HTMLElement, direction: 'LEFT' | 'RIGHT'): HTMLElement | null => {
    let thisRootMenu = isRootMenu(target) ? target : ancestor(target, CLASS_MENU_ROOT, 10);
    if (thisRootMenu) {
        return direction === 'RIGHT' ? sibling(thisRootMenu, CLASS_MENU_ROOT, CLASS_MENU_DISABLED) :
            prevSibling(thisRootMenu, CLASS_MENU_ROOT, CLASS_MENU_DISABLED);
    }
    return null;
};

export const parentMenu = (target: HTMLElement): HTMLElement | null => {
    return ancestor(target, CLASS_MENU);
};


export const nextMenu = (target: HTMLElement, direction: 'UP' | 'DOWN') => {
    if (!target) {
        return null;
    }
    let nextMenu = direction === 'DOWN' ? nextSiblingMenu(target) : previousSiblingMenu(target);
    if (nextMenu) {
        return nextMenu;
    } else {
        let subMenus = ancestor(target, CLASS_SUBMENUS);
        return direction === 'DOWN' ? firstImmediateChild(subMenus, CLASS_MENU, CLASS_MENU_DISABLED)
            : lastImmediateChild(subMenus, CLASS_MENU, CLASS_MENU_DISABLED);
    }
};

const nextSiblingMenu = (target: HTMLElement): HTMLElement | null => {
    return sibling(target, CLASS_MENU, CLASS_MENU_DISABLED);
};


const previousSiblingMenu = (target: HTMLElement): HTMLElement | null => {
    return prevSibling(target, CLASS_MENU, CLASS_MENU_DISABLED);
};


