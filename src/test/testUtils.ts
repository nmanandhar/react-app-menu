import Enzyme, {ReactWrapper} from 'enzyme';
import {ICON, LABEL, LABEL_CONTAINER} from "../utils/classNames";

const _mountedComponents: Enzyme.ReactWrapper[] = [];

export const mount = (component: React.ReactElement) => {
    let wrapper = Enzyme.mount(component);
    _mountedComponents.push(wrapper);
    return wrapper;
};

export const cleanUp = () => {
    let wrapper = _mountedComponents.pop();
    while (wrapper) {
        try {
            wrapper.unmount();
        } catch (e) {
        }
        wrapper = _mountedComponents.pop();
    }
};




export const getIcon = (wrapper: ReactWrapper, menu: string) => {
    let menuLabel = getMenuLabelContainer(wrapper, menu);
    if (menuLabel) {
        return menuLabel.find(`.${ICON}`);
    }
    return null;
};


export const getMenuLabelContainer = (wrapper: ReactWrapper, menu: string) => {
    let menuLabelWrapper: ReactWrapper | undefined;
    wrapper.find(`.${LABEL_CONTAINER}`).forEach(labelContainer => {
        if (labelContainer.find(`.${LABEL}`).text() === menu) {
            menuLabelWrapper = labelContainer;
        }
    });
    return menuLabelWrapper;
};

