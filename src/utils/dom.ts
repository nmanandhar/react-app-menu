export const firstImmediateChild = (element: HTMLElement | null, className: string, excludeClassName?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let firstChild = element.firstElementChild as HTMLElement;
    if (!firstChild) {
        return null;
    }
    if (hasClass(firstChild, className) && (excludeClassName===undefined || !hasClass(firstChild, excludeClassName))) {
        return firstChild;
    } else {
        return sibling(firstChild, className, excludeClassName);
    }
};

export const lastImmediateChild = (element: HTMLElement | null, className: string, excludeClassName?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let lastChild = element.lastElementChild as HTMLElement;
    if (!lastChild) {
        return null;
    }
    if (hasClass(lastChild, className) && (excludeClassName===undefined || !hasClass(lastChild, excludeClassName))) {
        return lastChild;
    } else {
        return prevSibling(lastChild, className, excludeClassName);
    }
};


export const sibling = (element: HTMLElement | null, className: string, excludeClassName?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let sibling: HTMLElement | null = element.nextElementSibling as HTMLElement;
    while (sibling) {
        if (hasClass(sibling, className) && (excludeClassName === undefined || !hasClass(sibling, excludeClassName))) {
            return sibling;
        }
        sibling = sibling.nextElementSibling as HTMLElement;
    }
    return null;
};


export const prevSibling = (element: HTMLElement | null, className: string, excludeClassName?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let sibling: HTMLElement | null = element.previousElementSibling as HTMLElement;
    while (sibling) {
        if (hasClass(sibling, className) && (excludeClassName === undefined || !hasClass(sibling, excludeClassName))) {
            return sibling;
        }
        sibling = sibling.previousElementSibling as HTMLElement;
    }
    return null;
};



export const ancestor = (elm: HTMLElement | null, ancestorClass: string, levels: number = 3): HTMLElement | null => {
    if (!elm) {
        return null;
    }
    let parent: HTMLElement | null = elm;
    for (let i = 1; i <= levels; i++) {
        parent = parent.parentElement;
        if (parent === null) {
            return null;
        } else if (hasClass(parent, ancestorClass)) {
            return parent;
        }
    }
    return null;
};

export const hasClass = (element: Element | null, className: string): boolean => {
    return element != null && element.classList.contains(className);
};

