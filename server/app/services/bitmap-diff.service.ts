import {injectable} from "inversify";
import {Bitmap} from "../../../common/image/Bitmap";

@injectable()
export class BitmapDiffService {

    public getDiff(sourceImage: Bitmap, modifiedImage: Bitmap): Bitmap {
        return new Bitmap();
    }

}
