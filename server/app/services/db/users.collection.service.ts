import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {AlreadyExistentUserError, NonExistentUserError} from "../../../../common/errors/database.errors";
import {IUser} from "../../../../common/model/user";
import {CollectionService} from "./collection.service";

export const USER_NAME_FIELD: string = "name";

@injectable()
export class UsersCollectionService extends CollectionService<IUser> {

    public async create(data: IUser): Promise<Message> {
        CollectionService.assertId(data.userName);
        if (await this.contains(data.userName)) {
            throw new AlreadyExistentUserError();
        } else {
            return this.createDocument(data);
        }
    }

    public creationSuccessMessage(data: IUser): Message {
        return {
            title: "User added",
            body: "User " + data.userName + " successfully added!",
        };
    }

    public async delete(id: string): Promise<Message> {
        CollectionService.assertId(id);
        if (!(await this.contains(id))) {
            throw new NonExistentUserError();
        } else {

            return this.deleteDocument(id);
        }
    }

    public deletionSuccessMessage(id: string): Message {
        return {
            title: "User deleted",
            body: "User " + id + " successfully deleted!",
        };
    }

    public async getFromId(id: string): Promise<IUser> {
        CollectionService.assertId(id);

        return this.getDocument(id, NonExistentUserError.NON_EXISTENT_USER_ERROR_MESSAGE);
    }

    protected get idFieldName(): string {
        return USER_NAME_FIELD;
    }

}
