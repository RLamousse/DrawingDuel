import {
  getDimensionsFromBuffer, BITMAP_HEADER_24BPP,
  HEADER_SIZE_BYTES, VALID_640x480_BITMAP_HEADER_24BPP
} from "../../../common/image/bitmap/bitmap-utils";
import FakeControl from "./Interfaces/fakeControl";
import FileValidator from "./file.validator";

describe("FileValidator", () => {

  it("should return file isn't a bitmap", () => {
    const fakeControl: FakeControl = {
      value: {
        files: [new File([""], "maxime", { type: "text/html" })],
      },
    };
    expect(FileValidator.typeValidator(fakeControl)).toEqual({ imageType: "L'image doit être de type bmp" });
  });

  it("should return file is too big", () => {
    const fakeControl: FakeControl = {
      value: {
        files: [new File(new Array(FileValidator.MAX_IMAGE_SIZE + 1).fill(0), "maxime", { type: "image/bmp" })],
      },
    };
    expect(FileValidator.sizeValidator(fakeControl))
      .toEqual({ imageSize: `L'image est invalide (taille maximale de ${FileValidator.MAX_IMAGE_SIZE})` });
  });

  it("should return file isn't the right dimensions", async () => {
    // tslint:disable-next-line:no-any
    const fakeHeader: any[] = new Array(HEADER_SIZE_BYTES);
    fakeHeader.unshift(...BITMAP_HEADER_24BPP);
    const buf: Uint8Array = new Uint8Array(fakeHeader);

    const REQUIRED_WIDTH: number = 640;
    const REQUIRED_HEIGHT: number = 480;
    expect(getDimensionsFromBuffer(buf.buffer as ArrayBuffer)).not.toEqual({ width: REQUIRED_WIDTH, height: REQUIRED_HEIGHT });
  });

  it("should return all is fine with a 640x480 header", async () => {
    // tslint:disable-next-line:no-any
    const fakeHeader: any[] = new Array(HEADER_SIZE_BYTES);
    fakeHeader.unshift(...VALID_640x480_BITMAP_HEADER_24BPP);
    const buf: Uint8Array = new Uint8Array(fakeHeader);

    const REQUIRED_WIDTH: number = 640;
    const REQUIRED_HEIGHT: number = 480;
    expect(getDimensionsFromBuffer(buf.buffer as ArrayBuffer)).toEqual({ width: REQUIRED_WIDTH, height: REQUIRED_HEIGHT });
  });
});
