export const RAW_BITMAP_OFFSET_FLAG_OFFSET: number = 0xA;
export const RAW_BITMAP_OFFSET_FLAG_LENGTH: number = 4;
export const WIDTH_FLAG_OFFSET: number = 0x12;
export const WIDTH_FLAG_LENGTH: number = 4;
export const HEIGHT_FLAG_OFFSET: number = 0x16;
export const HEIGHT_FLAG_LENGTH: number = 4;
export const COLOR_DEPTH_FLAG_OFFSET: number = 0x1C;
export const COLOR_DEPTH_FLAG_LENGTH: number = 2;
export const RAW_BITMAP_DATA_SIZE_FLAG_OFFSET: number = 0x22;
export const RAW_BITMAP_DATA_SIZE_FLAG_LENGTH: number = 0x4;
export const COLOR_DEPTH_24BPP_BYTES: number = 3;


// 54 bytes
export const BITMAP_HEADER_24BPP: number[] = [
    0x42, 0x4D, 0x78, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x36, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, // Width LE
    0x00, 0x00, 0x00, 0x00, // Height LE
    0x01, 0x00,
    0x18, 0x00, // Color depth (24bpp)
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, // Size of the raw bitmap data (including padding)
    0x23, 0x2E,
    0x00, 0x00, 0x23, 0x2E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
];

export function getHeaderForDimension(width: number, height: number): Buffer {
    const buffer = Buffer.from(BITMAP_HEADER_24BPP);
    buffer.writeUIntLE(width, WIDTH_FLAG_OFFSET, WIDTH_FLAG_LENGTH);
    buffer.writeUIntLE(height, HEIGHT_FLAG_OFFSET, WIDTH_FLAG_LENGTH);
    buffer.writeUIntLE(getTotalBytesForDimension(width, height), RAW_BITMAP_DATA_SIZE_FLAG_OFFSET, RAW_BITMAP_DATA_SIZE_FLAG_LENGTH);
    return buffer;
}

export function getTotalBytesForDimension(width: number, height: number): number {
    return getBytesPerRowForWidth(width) * height;
}

export function getBytesPerRowForWidth(width: number): number {
    return (width * COLOR_DEPTH_24BPP_BYTES) + (width * COLOR_DEPTH_24BPP_BYTES) % 4; //Align 4
}
