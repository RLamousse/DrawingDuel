import {injectable} from "inversify";
import "reflect-metadata";
import {IBitmapImage} from "../../../../common/model/IBitmapImage";
import {CollectionService} from "./collection.service";

@injectable()
export class ImagesCollectionService extends CollectionService<IBitmapImage> {

}
