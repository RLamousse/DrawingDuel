import {Dimension} from './IDimension';

export const BMP_ID_FIELD_OFFSET: number = 0x0;
export const BMP_ID_FIELD_LENGTH: number = 2;
export const BMP_ID_FIELD: number = 0x4D42;
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
export const BITMAP_MEME_TYPE: string = "image/bmp";

export var BITS_PER_BYTE = 8;

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

// 54 bytes
// For testing purposes I need it to be any
export const VALID_640x480_BITMAP_HEADER_24BPP: any[] = [
    // BMP HEADER
    0x42, 0x4D, // ID (0x42, 0x4D)
    0x38, 0x10, 0x0E, 0x20, // Size of BMP file
    0x20, 0x20, 0x20, 0x20, // Unused
    0x36, 0x20, 0x20, 0x20, // Offset of pixel array
    // DIB HEADER
    0x28, 0x20, 0x20, 0x20, // DIB header size
    0x80, 0x02, 0x00, 0x00, // Width
    0xE0, 0x01, 0x00, 0x00, // Height
    0x01, 0x20, // # color planes
    0x18, 0x20, // Color depth (24bpp)
    0x20, 0x20, 0x20, 0x20, // Compression
    0x02, 0x10, 0x0E, 0x20, // Size of the raw bitmap data (including padding)
    0x5D, 0x9F, 0x20, 0x20, // Print resolution horizontal
    0x5D, 0x9F, 0x20, 0x20, // Print resolution vertical
    0x20, 0x20, 0x20, 0x20, // Colors in palette
    0x20, 0x20, 0x20, 0x20 // Important colors
];

export function getDimensionsFromBuffer(buffer: ArrayBuffer): Dimension {
    const dataView = new DataView(buffer);
    return {
        width: dataView.getUint32(WIDTH_FLAG_OFFSET, true),
        height: dataView.getUint32(HEIGHT_FLAG_OFFSET, true),
    }
}

export function getHeaderForDimension(dimension: Dimension): Uint8Array {
    const pixelArrayBytesCount = getTotalBytesForDimension(dimension);

    const buffer: DataView = new DataView(new Uint8Array(BITMAP_HEADER_24BPP).buffer);
    buffer.setUint32(FILE_SIZE_FLAG_OFFSET, HEADER_SIZE_BYTES + pixelArrayBytesCount, true);
    buffer.setUint32(WIDTH_FLAG_OFFSET, dimension.width, true);
    buffer.setUint32(HEIGHT_FLAG_OFFSET, dimension.height, true);
    buffer.setUint32(RAW_BITMAP_DATA_SIZE_FLAG_OFFSET, pixelArrayBytesCount, true);

    return new Uint8Array(buffer.buffer);
}

export function getTotalBytesForDimension(dimension: Dimension): number {
    return getBytesPerRowForWidth(dimension.width) * dimension.height;
}

export function getBytesPerRowForWidth(width: number): number {
    return (width * COLOR_DEPTH_24BPP_BYTES) + (width * COLOR_DEPTH_24BPP_BYTES) % 4; //Align 4
}
