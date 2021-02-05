export function withInstall(...components) {
    components.forEach((comp) => {
        comp.install = (app) => {
            app.component(comp.displayName || comp.name, comp);
        };
    });
}
export function convertToUnit(str, unit = 'px') {
    if (str == null || str === '') {
        return undefined;
    }
    else if (isNaN(+str)) {
        return String(str);
    }
    else {
        return `${Number(str)}${unit}`;
    }
}
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
export const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
export function wrapInArray(v) {
    return v != null ? (Array.isArray(v) ? v : [v]) : [];
}
const pattern = {
    styleList: /;(?![^(]*\))/g,
    styleProp: /:(.*)/,
};
function parseStyle(style) {
    const styleMap = {};
    for (const s of style.split(pattern.styleList)) {
        let [key, val] = s.split(pattern.styleProp);
        key = key.trim();
        if (!key) {
            continue;
        }
        // May be undefined if the `key: value` pair is incomplete.
        if (typeof val === 'string') {
            val = val.trim();
        }
        styleMap[camelize(key)] = val;
    }
    return styleMap;
}
export function mergeData(...args) {
    const mergeTarget = {};
    let i = args.length;
    let prop;
    // Allow for variadic argument length.
    while (i--) {
        // Iterate through the data properties and execute merge strategies
        // Object.keys eliminates need for hasOwnProperty call
        for (prop of Object.keys(args[i])) {
            switch (prop) {
                // Array merge strategy (array concatenation)
                case 'class':
                case 'directives':
                    if (args[i][prop]) {
                        mergeTarget[prop] = mergeClasses(mergeTarget[prop], args[i][prop]);
                    }
                    break;
                case 'style':
                    if (args[i][prop]) {
                        mergeTarget[prop] = mergeStyles(mergeTarget[prop], args[i][prop]);
                    }
                    break;
                // Space delimited string concatenation strategy
                case 'staticClass':
                    if (!args[i][prop]) {
                        break;
                    }
                    if (mergeTarget[prop] === undefined) {
                        mergeTarget[prop] = '';
                    }
                    if (mergeTarget[prop]) {
                        // Not an empty string, so concatenate
                        mergeTarget[prop] += ' ';
                    }
                    mergeTarget[prop] += args[i][prop].trim();
                    break;
                // Object, the properties of which to merge via array merge strategy (array concatenation).
                // Callback merge strategy merges callbacks to the beginning of the array,
                // so that the last defined callback will be invoked first.
                // This is done since to mimic how Object.assign merging
                // uses the last given value to assign.
                case 'on':
                case 'nativeOn':
                    if (args[i][prop]) {
                        mergeTarget[prop] = mergeListeners(mergeTarget[prop], args[i][prop]);
                    }
                    break;
                // Object merge strategy
                case 'attrs':
                case 'props':
                case 'domProps':
                case 'scopedSlots':
                case 'staticStyle':
                case 'hook':
                case 'transition':
                    if (!args[i][prop]) {
                        break;
                    }
                    if (!mergeTarget[prop]) {
                        mergeTarget[prop] = {};
                    }
                    mergeTarget[prop] = { ...args[i][prop], ...mergeTarget[prop] };
                    break;
                // Reassignment strategy (no merge)
                default:
                    // slot, key, ref, tag, show, keepAlive
                    if (!mergeTarget[prop]) {
                        mergeTarget[prop] = args[i][prop];
                    }
            }
        }
    }
    return mergeTarget;
}
export function mergeStyles(target, source) {
    if (!target)
        return source;
    if (!source)
        return target;
    target = wrapInArray(typeof target === 'string' ? parseStyle(target) : target);
    return target.concat(typeof source === 'string' ? parseStyle(source) : source);
}
export function mergeClasses(target, source) {
    if (!source)
        return target;
    if (!target)
        return source;
    return target ? wrapInArray(target).concat(source) : source;
}
export function mergeListeners(target, source) {
    if (!target)
        return source;
    if (!source)
        return target;
    let event;
    for (event of Object.keys(source)) {
        // Concat function to array of functions if callback present.
        if (target[event]) {
            // Insert current iteration data in beginning of merged array.
            target[event] = wrapInArray(target[event]);
            target[event].push(...wrapInArray(source[event]));
        }
        else {
            // Straight assign.
            target[event] = source[event];
        }
    }
    return target;
}
//# sourceMappingURL=util.jsx.map