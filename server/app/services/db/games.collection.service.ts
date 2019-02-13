import {injectable} from "inversify";
import "reflect-metadata";
import {IGame} from "../../../../common/model/IGame";
import {CollectionService} from "./collection.service";

@injectable()
export class GamesCollectionService extends CollectionService<IGame> {

}
