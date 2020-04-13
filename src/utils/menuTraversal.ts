import {ancestor, firstChild, hasClass, lastChild, nextSibling, prevSibling} from "./domTraversal";
import {MENU, MENU_DISABLED, MENU_ROOT, SUBMENUS} from "./classNames";

export const isRootMenu = (target: Element | null): boolean => hasClass(target, MENU_ROOT);

export const lastChildMenu = (target: Element | null): Element | null => {
    let childMenus = firstChild(target, SUBMENUS);
    return lastChild(childMenus, MENU, MENU_DISABLED);
};

export const firstChildMenu = (currentMenu: Element | null): Element | null => {
    let childMenus = firstChild(currentMenu, SUBMENUS);
    return firstChild(childMenus, MENU, MENU_DISABLED);
};

export const nextRootMenu = (currentMenu: Element | null, direction: 'LEFT' | 'RIGHT'): Element | null => {
    let thisRootMenu = isRootMenu(currentMenu) ? currentMenu : ancestor(currentMenu, MENU_ROOT, 10);
    if (thisRootMenu) {
        return direction === 'RIGHT' ? nextSibling(thisRootMenu, MENU_ROOT, MENU_DISABLED) :
            prevSibling(thisRootMenu, MENU_ROOT, MENU_DISABLED);
    }
    return null;
};

export const parentMenu = (activeMenu: Element | null): Element | null => {
    return ancestor(activeMenu, MENU);
};

export const nextMenu = (activeMenu: Element | null, direction: 'UP' | 'DOWN'): Element | null => {
    if (!activeMenu) {
        return null;
    }
    let nextMenu = direction === 'DOWN' ? nextSibling(activeMenu, MENU, MENU_DISABLED) : prevSibling(activeMenu, MENU, MENU_DISABLED);
    if (nextMenu) {
        return nextMenu;
    } else {
        let subMenus = ancestor(activeMenu, SUBMENUS);
        return direction === 'DOWN' ? firstChild(subMenus, MENU, MENU_DISABLED) : lastChild(subMenus, MENU, MENU_DISABLED);
    }
};
