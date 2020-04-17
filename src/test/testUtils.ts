import Enzyme, {MountRendererProps, ReactWrapper} from 'enzyme';
import {ICON, LABEL, LABEL_CONTAINER, MENU} from "../utils/classNames";

const _mountedComponents: Enzyme.ReactWrapper[] = [];

export const mount = (component: React.ReactElement, options?: MountRendererProps) => {
    let wrapper = Enzyme.mount(component, options);
    _mountedComponents.push(wrapper);
    return wrapper;
};

export const cleanUp = () => {
    let mountedComponent = _mountedComponents.pop();
    while (mountedComponent) {
        try {
            mountedComponent.unmount();
        } catch (e) {
        }
        mountedComponent = _mountedComponents.pop();
    }
};

/**
 * Get the text of current active (focussed) menu
 */
export const activeMenu = () => {
    if (document.activeElement && document.activeElement.classList.contains(MENU)) {
        let label = document.activeElement.querySelector(`.${LABEL}`);
        if (label) {
            return label.textContent;
        }
    }
    return null;
};

export const getIconElement = (wrapper: ReactWrapper, menu: string): ReactWrapper | null => {
    let menuLabel = getLabelContainerElement(wrapper, menu);
    if (menuLabel) {
        return menuLabel.find(`.${ICON}`);
    }
    return null;
};


export const getLabelContainerElement = (wrapper: ReactWrapper, menu: string) => {
   return  wrapper.find(`Menu[label='${menu}']`).find(`.${LABEL_CONTAINER}`).first();
};

export const tryFocus = (el: Element | null) => {
    if (el) {
        (el as HTMLElement).focus();
    }
};


export const selectorRootMenu = (pos: number) => {
    return `.reactAppMenubar >.reactAppMenubar--menu:nth-child(${pos})`;
};
export const selectorSubMenu = (pos: number) => {
    return `  > .reactAppMenubar--menu--submenus > .reactAppMenubar--menu:nth-child(${pos})`;
};
