import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {AlreadyExistentGameError, InvalidGameError, NonExistentGameError} from "../../../../common/errors/database.errors";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {CollectionService} from "./collection.service";

export const GAME_NAME_FIELD: string = "gameName";

@injectable()
export class SimpleGamesCollectionService extends CollectionService<ISimpleGame> {

    private static validate(game: ISimpleGame): boolean {
        return game.diffData !== undefined &&
            game.originalImage !== "" &&
            game.modifiedImage !== "" &&
            game.gameName !== "";
    }

    public async create(data: ISimpleGame): Promise<Message> {
        if (!SimpleGamesCollectionService.validate(data)) {
            throw new InvalidGameError();
        }

        if (await this.contains(data.gameName)) {
            throw new AlreadyExistentGameError();
        } else {
            return this.createDocument(data);
        }
    }

    public async delete(id: string): Promise<Message> {
        CollectionService.assertId(id);
        if (!(await this.contains(id))) {
            throw new NonExistentGameError();
        } else {
            return this.deleteDocument(id);
        }
    }

    public async getFromId(id: string): Promise<ISimpleGame> {
        CollectionService.assertId(id);

        return this.getDocument(id, NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
    }

    public creationSuccessMessage(data: ISimpleGame): Message {
        return {
            title: "Simple game added",
            body: "Simple game " + data.gameName + " successfully added",
        };
    }

    public deletionSuccessMessage(id: string): Message {
        return {
            title: "Simple game deleted",
            body: "Simple game " + id + " successfully deleted!",
        };
    }

    protected get idFieldName(): string {
        return GAME_NAME_FIELD;
    }

}
