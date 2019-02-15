export function create2dArray<T>(width: number, height: number, filledWith: T): T[][] {
    return new Array(height)
        .fill(filledWith)
        .map(() => new Array(width).fill(filledWith));
}

export function bufferToNumberArray(buffer: Buffer): number[] {
    return Array.from(new Uint8Array(buffer.buffer))
}

export function bufferToBase64(buffer: Buffer): string {
    return buffer.toString("base64");
}
