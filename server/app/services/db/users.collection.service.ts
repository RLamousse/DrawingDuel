import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {IUser} from "../../../../common/model/user";
import {CollectionService} from "./collection.service";

export const USER_NAME_FIELD: string = "userName";
export const NON_EXISTING_USER_ERROR_MESSAGE: string = "ERROR: the specified usename does not exist!";
export const ALREADY_EXISTING_USER_MESSAGE_ERROR: string = "ERROR: the specified usename already exists!";

@injectable()
export class UsersCollectionService extends CollectionService<IUser> {

    public async create(data: IUser): Promise<Message> {
        CollectionService.assertId(data.userName);
        if (await this.contains(data.userName)) {
            throw new Error(ALREADY_EXISTING_USER_MESSAGE_ERROR);
        } else {
            return this.createDocument(data);
        }
    }

    protected creationSuccessMessage(data: IUser): Message {
        return {
            title: "User added",
            body: "User " + data.userName + " successfully added!",
        };
    }

    public async delete(id: string): Promise<Message> {
        CollectionService.assertId(id);
        if (!(await this.contains(id))) {
            throw new Error(NON_EXISTING_USER_ERROR_MESSAGE);
        } else {

            return this.deleteDocument(id);
        }
    }

    protected deletionSuccessMessage(id: string): Message {
        return {
            title: "User deleted",
            body: "User " + id + " successfully deleted!",
        };
    }

    public async getFromId(id: string): Promise<IUser> {
        CollectionService.assertId(id);

        return this.getDocument(id, NON_EXISTING_USER_ERROR_MESSAGE);
    }

    protected get idFieldName(): string {
        return USER_NAME_FIELD;
    }

}
