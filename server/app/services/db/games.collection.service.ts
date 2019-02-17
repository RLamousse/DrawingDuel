import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {Game} from "../../../../common/model/game/game";
import SimpleGame from "../../../../common/model/game/simple-game";
import {CollectionService} from "./collection.service";

export const NON_EXISTING_GAME_ERROR_MESSAGE: string = "ERROR: the specified game does not exist!";
export const GAME_NAME_FIELD: string = "gameName";
export const GAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game has the wrong format!";
export const ALREADY_EXISTING_GAME_MESSAGE_ERROR: string = "ERROR: a game with the same name already exists!";

@injectable()
export class GamesCollectionService extends CollectionService<Game> {

    public async create(data: Game): Promise<Message> {
        if (!SimpleGame.validate(data)) {
            throw new Error(GAME_FORMAT_ERROR_MESSAGE);
        }

        if (await this.contains(data.gameName)) {
            throw new Error(ALREADY_EXISTING_GAME_MESSAGE_ERROR);
        } else {
            return this.createDocument(data);
        }
    }

    public async delete(id: string): Promise<Message> {
        CollectionService.assertId(id);
        if (!(await this.contains(id))) {
            throw new Error(NON_EXISTING_GAME_ERROR_MESSAGE);
        } else {
            return this.deleteDocument(id);
        }
    }

    public async getFromId(id: string): Promise<Game> {
        CollectionService.assertId(id);

        return this.getDocument(id, NON_EXISTING_GAME_ERROR_MESSAGE);
    }

    public creationSuccessMessage(data: Game): Message {
        return {
            title: "Game added",
            body: "Game " + data.gameName + " successfully added",
        };
    }

    public deletionSuccessMessage(id: string): Message {
        return {
            title: "Game deleted",
            body: "Game " + id + " successfully deleted!",
        };
    }

    protected get idFieldName(): string {
        return GAME_NAME_FIELD;
    }

}
