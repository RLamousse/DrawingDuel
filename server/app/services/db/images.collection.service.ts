import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {IBitmapImage} from "../../../../common/model/IBitmapImage";
import {CollectionService} from "./collection.service";

export const IMAGE_NAME_FIELD: string = "name";
export const ALREADY_EXISTING_IMAGE_MESSAGE_ERROR: string = "ERROR: an image with the same name already exists!";
export const NOT_EXISTING_IMAGE_MESSAGE_ERROR: string = "ERROR: the specified image does not exist!";

@injectable()
export class ImagesCollectionService extends CollectionService<IBitmapImage> {

    public async create(data: IBitmapImage): Promise<Message> {
        if (await this.contains(data.name)) {
            throw new Error(ALREADY_EXISTING_IMAGE_MESSAGE_ERROR);
        } else {
            return this.createDocument(data);
        }
    }

    public async delete(id: string): Promise<Message> {
        CollectionService.assertId(id);
        if (!(await this.contains(id))) {
            throw new Error(NOT_EXISTING_IMAGE_MESSAGE_ERROR);
        } else {
            return this.deleteDocument(id);
        }
    }

    public async getFromId(id: string): Promise<IBitmapImage> {
        CollectionService.assertId(id);

        return this.getDocument(id, NOT_EXISTING_IMAGE_MESSAGE_ERROR);
    }

    public creationSuccessMessage(data: IBitmapImage): Message {
        return {
            title: "Image added",
            body: "Image " + data.name + " successfully added",
        };
    }

    public deletionSuccessMessage(id: string): Message {
        return {
            title: "Image deleted",
            body: "Image " + id + " successfully deleted!",
        };
    }

    protected get idFieldName(): string {
        return IMAGE_NAME_FIELD;
    }

}
