export function create2dArray<T>(width: number, height: number, filledWith: T): T[][] {
    return new Array(height)
        .fill(filledWith)
        .map(() => new Array(width).fill(filledWith));
}

export function createArray<T>(size: number, filledWith: T): T[] {
    return new Array(size)
        .fill(filledWith);
}

export function customIndexOf<T>(array: T[], elementToFind: T, compareFunction: (elementToFind: T, elementInArray: T) => boolean): number  {
    for (let i: number = 0; i < array.length; i++) {
        if (compareFunction(elementToFind, array[i])) {
            return i;
        }
    }
    return -1;
}

// function taken from https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517
export function deepCompare(x: any, y: any): boolean {

    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) { return false; }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) { return x === y; }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) { return false; }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    // recursive object equality check
    const p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return deepCompare(x[i], y[i]); });
}

export async function sleep(timeMs: number): Promise<{}> {
    return new Promise<{}>(resolve => setTimeout(resolve, timeMs));
}
