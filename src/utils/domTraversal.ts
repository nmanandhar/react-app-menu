export const firstChild = (element: HTMLElement | null, withClass?: string, excludeClass?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let firstChild = element.firstElementChild as HTMLElement;
    if ((withClass === undefined || hasClass(firstChild, withClass)) && (excludeClass === undefined || !hasClass(firstChild, excludeClass))) {
        return firstChild;
    }
    return sibling(firstChild, withClass, excludeClass);
};

export const lastChild = (element: HTMLElement | null, className?: string, excludeClassName?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let lastChild = element.lastElementChild as HTMLElement;
    if ((className === undefined || hasClass(lastChild, className)) && (excludeClassName === undefined || !hasClass(lastChild, excludeClassName))) {
        return lastChild;
    } else {
        return prevSibling(lastChild, className, excludeClassName);
    }
};

export const sibling = (element: HTMLElement | null, withClass?: string, excludeClass?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let sibling: HTMLElement | null = element.nextElementSibling as HTMLElement;
    while (sibling) {
        if ((withClass === undefined || hasClass(sibling, withClass)) && (excludeClass === undefined || !hasClass(sibling, excludeClass))) {
            return sibling;
        }
        sibling = sibling.nextElementSibling as HTMLElement;
    }
    return null;
};


export const prevSibling = (element: HTMLElement | null, withClass?: string, excludeClass?: string): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let sibling: HTMLElement | null = element.previousElementSibling as HTMLElement;
    while (sibling) {
        if ((withClass === undefined || hasClass(sibling, withClass)) && (excludeClass === undefined || !hasClass(sibling, excludeClass))) {
            return sibling;
        }
        sibling = sibling.previousElementSibling as HTMLElement;
    }
    return null;
};


export const ancestor = (element: HTMLElement | null, ancestorClass: string, maxLevels: number = 5): HTMLElement | null => {
    if (!element) {
        return null;
    }
    let parent: HTMLElement | null = element;
    for (let i = 1; i <= maxLevels; i++) {
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