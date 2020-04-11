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