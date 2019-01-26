export const FILE_SIZE_FLAG_OFFSET: number = 0x2;
export const FILE_SIZE_FLAG_LENGTH: number = 4;
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
export const HEADER_SIZE_BYTES: number = 54;

export const BITMAP_FILE_EXTENSION: string = ".bmp";

// 54 bytes
export const BITMAP_HEADER_24BPP: number[] = [
    // BMP HEADER
    0x42, 0x4D, // ID (0x42, 0x4D)
    0x78, 0x01, 0x00, 0x00, // Size of BMP file
    0x00, 0x00, 0x00, 0x00, // Unused
    0x36, 0x00, 0x00, 0x00, // Offset of pixel array
    // DIB HEADER
    0x28, 0x00, 0x00, 0x00, // DIB header size
    0x00, 0x00, 0x00, 0x00, // Width
    0x00, 0x00, 0x00, 0x00, // Height
    0x01, 0x00, // # color planes
    0x18, 0x00, // Color depth (24bpp)
    0x00, 0x00, 0x00, 0x00, // Compression
    0x00, 0x00, 0x00, 0x00, // Size of the raw bitmap data (including padding)
    0x23, 0x2E, 0x00, 0x00, // Print resolution horizontal
    0x23, 0x2E, 0x00, 0x00, // Print resolution vertical
    0x00, 0x00, 0x00, 0x00, // Colors in palette
    0x00, 0x00, 0x00, 0x00 // Important colors
];

export function getHeaderForDimension(width: number, height: number): Buffer {
    const buffer = Buffer.from(BITMAP_HEADER_24BPP);
    const pixelArrayBytesCount = getTotalBytesForDimension(width, height);
    buffer.writeUIntLE(HEADER_SIZE_BYTES + pixelArrayBytesCount, FILE_SIZE_FLAG_OFFSET, FILE_SIZE_FLAG_LENGTH);
    buffer.writeUIntLE(width, WIDTH_FLAG_OFFSET, WIDTH_FLAG_LENGTH);
    buffer.writeUIntLE(height, HEIGHT_FLAG_OFFSET, WIDTH_FLAG_LENGTH);
    buffer.writeUIntLE(pixelArrayBytesCount, RAW_BITMAP_DATA_SIZE_FLAG_OFFSET, RAW_BITMAP_DATA_SIZE_FLAG_LENGTH);
    return buffer;
}

export function getTotalBytesForDimension(width: number, height: number): number {
    return getBytesPerRowForWidth(width) * height;
}

export function getBytesPerRowForWidth(width: number): number {
    return (width * COLOR_DEPTH_24BPP_BYTES) + (width * COLOR_DEPTH_24BPP_BYTES) % 4; //Align 4
}
