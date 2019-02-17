export function create2dArray<T>(width: number, height: number, filledWith: T): T[][] {
    return new Array(height)
        .fill(filledWith)
        .map(() => new Array(width).fill(filledWith));
}
