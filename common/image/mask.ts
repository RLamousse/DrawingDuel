export interface Mask {
    width: number,
    height: number,
    maskLayout: boolean[][],
}

export const SAME_PIXEL_COLOR: number = 0xFFFFFF;
export const DIFFERENT_PIXEL_COLOR: number = 0x0;

export const DIFFERENCE_MASK = {
    width: 7,
    height: 7,
    maskLayout: [
        [false, false, true, true, true, false, false],
        [false, true, true, true, true, true, false],
        [true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true],
        [false, true, true, true, true, true, false],
        [false, false, true, true, true, false, false],
    ]
};
