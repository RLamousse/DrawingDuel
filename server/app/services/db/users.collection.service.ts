import {injectable} from "inversify";
import "reflect-metadata";
import {IUser} from "../../../../common/model/IUser";
import {CollectionService} from "./collection.service";

@injectable()
export class UsersCollectionService extends CollectionService<IUser> {

}
