import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../common/image/Bitmap";

@injectable()
export class BitmapDiffService {

    public getDiff(sourceImage: Bitmap, modifiedImage: Bitmap) {

        if (sourceImage.width !== modifiedImage.width || sourceImage.height !== modifiedImage.height) {
            throw new Error("Cannot generate the difference if the images does not have the same dimensions");
        }
    }

}
