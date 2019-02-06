import { BITMAP_HEADER_24BPP, HEADER_SIZE_BYTES } from "../../../common/image/bitmap/bitmap-utils";
import FakeControl from "./fakeControl";
import FileValidator from "./file.validator";

describe("FileValidator", () => {

  it("should return file isn't a bitmap", async (done) => {
    const fakeControl: FakeControl = {
      value: {
        files: [new File([""], "maxime", { type: "text/html" })],
      },
    };

    return FileValidator.fileValidator(fakeControl).then((value) => {
      expect(value).toEqual({ imageType: "L'image doit être de type bmp" });
      done();
    });
  });

  it("should return file is too big", async (done) => {
    const fakeControl: FakeControl = {
      value: {
        files: [new File(new Array(FileValidator.MAX_IMAGE_SIZE + 1).fill(0), "maxime", { type: "image/bmp" })],
      },
    };

    return FileValidator.fileValidator(fakeControl).then((value) => {
      expect(value).toEqual({imageSize: `L'image est invalide (taille maximale de ${FileValidator.MAX_IMAGE_SIZE})`});
      done();
    });
  });

  it("should return file isn't the right dimensions", async (done) => {
    // tslint:disable-next-line:no-any
    const fakeHeader: any[] = new Array(HEADER_SIZE_BYTES);
    fakeHeader.unshift(...BITMAP_HEADER_24BPP);
    const fakeControl: FakeControl = {
      value: {
        files: [new File(fakeHeader, "maxime", { type: "image/bmp" })],
      },
    };

    return FileValidator.fileValidator(fakeControl).then((value) => {
      expect(value).toEqual({imageDimension: "L'image n'est pas de la bonne dimension"});
      done();
    });
  });
});
