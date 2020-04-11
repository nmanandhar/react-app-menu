import {ancestor, firstChild, hasClass, lastChild, nextSibling, prevSibling} from "./domTraversal";
import {CLASS_MENU, CLASS_MENU_DISABLED, CLASS_MENU_ROOT, CLASS_MENU_SUBMENUS} from "./constants";

export const isRootMenu = (target: Element | null): boolean => hasClass(target, CLASS_MENU_ROOT);

export const lastChildMenu = (target: Element | null): Element | null => {
    let childMenus = firstChild(target, CLASS_MENU_SUBMENUS);
    return lastChild(childMenus, CLASS_MENU, CLASS_MENU_DISABLED);
};

export const firstChildMenu = (currentMenu: Element | null): Element | null => {
    let childMenus = firstChild(currentMenu, CLASS_MENU_SUBMENUS);
    return firstChild(childMenus, CLASS_MENU, CLASS_MENU_DISABLED);
};

export const nextRootMenu = (currentMenu: Element | null, direction: 'LEFT' | 'RIGHT'): Element | null => {
    let thisRootMenu = isRootMenu(currentMenu) ? currentMenu : ancestor(currentMenu, CLASS_MENU_ROOT, 10);
    if (thisRootMenu) {
        return direction === 'RIGHT' ? nextSibling(thisRootMenu, CLASS_MENU_ROOT, CLASS_MENU_DISABLED) :
            prevSibling(thisRootMenu, CLASS_MENU_ROOT, CLASS_MENU_DISABLED);
    }
    return null;
};

export const parentMenu = (activeMenu: Element | null): Element | null => {
    return ancestor(activeMenu, CLASS_MENU);
};

export const nextMenu = (activeMenu: Element | null, direction: 'UP' | 'DOWN'): Element | null => {
    if (!activeMenu) {
        return null;
    }
    let nextMenu = direction === 'DOWN' ? nextSibling(activeMenu, CLASS_MENU, CLASS_MENU_DISABLED) : prevSibling(activeMenu, CLASS_MENU, CLASS_MENU_DISABLED);
    if (nextMenu) {
        return nextMenu;
    } else {
        let subMenus = ancestor(activeMenu, CLASS_MENU_SUBMENUS);
        return direction === 'DOWN' ? firstChild(subMenus, CLASS_MENU, CLASS_MENU_DISABLED) : lastChild(subMenus, CLASS_MENU, CLASS_MENU_DISABLED);
    }
};
