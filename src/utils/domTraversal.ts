type ElementOrNull = Element | null;

export const firstChild = (element: ElementOrNull, withClass?: string, excludeClass?: string): ElementOrNull => findMatchingChild(element, false, withClass, excludeClass);
export const lastChild = (element: ElementOrNull, withClass?: string, excludeClass?: string): ElementOrNull => findMatchingChild(element, true, withClass, excludeClass);

const findMatchingChild = (element: ElementOrNull, reverse: boolean, withClass?: string, excludeClass?: string): ElementOrNull => {
    if (!element) {
        return null;
    }
    let childElement = reverse ? element.lastElementChild : element.firstElementChild;
    if (isMatch(childElement, withClass, excludeClass)) {
        return childElement;
    } else {
        return reverse ? prevSibling(childElement, withClass, excludeClass) : nextSibling(childElement, withClass, excludeClass);
    }
};


export const nextSibling = (element: ElementOrNull, withClass?: string, excludeClass?: string): ElementOrNull => {
    return findMatchingSibling(element, (node) => node.nextElementSibling, withClass, excludeClass);
};

export const prevSibling = (element: ElementOrNull, withClass?: string, excludeClass?: string): ElementOrNull => {
    return findMatchingSibling(element, (node) => node.previousElementSibling, withClass, excludeClass);
};

const findMatchingSibling = (element: ElementOrNull, nextFn: (element: Element) => ElementOrNull, withClass?: string, excludeClass?: string): ElementOrNull => {
    if (!element) {
        return null;
    }
    let next = nextFn(element);
    while (next) {
        if (isMatch(next, withClass, excludeClass)) {
            return next;
        }
        next = nextFn(next);
    }
    return null;
};


export const ancestor = (element: ElementOrNull, ancestorClass: string, maxLevels: number = 5): ElementOrNull => {
    if (!element) {
        return null;
    }
    let parent: ElementOrNull = element;
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

const isMatch = (element: ElementOrNull, withClass?: string, excludeClass?: string): boolean => {
    return element !== null && (withClass === undefined || hasClass(element, withClass)) && (excludeClass === undefined || !hasClass(element, excludeClass));
};

export const hasClass = (element: ElementOrNull, className: string): boolean => {
    return element != null && element.classList.contains(className);
};