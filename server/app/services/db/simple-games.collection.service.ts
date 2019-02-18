import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import ISimpleGame from "../../../../common/model/game/simple-game";
import {CollectionService} from "./collection.service";

export const NON_EXISTING_GAME_ERROR_MESSAGE: string = "ERROR: the specified game does not exist!";
export const GAME_NAME_FIELD: string = "gameName";
export const GAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game has the wrong format!";
export const ALREADY_EXISTING_GAME_MESSAGE_ERROR: string = "ERROR: a game with the same name already exists!";

@injectable()
export class SimpleGamesCollectionService extends CollectionService<ISimpleGame> {

    public static validate(game: ISimpleGame): boolean {
        return game.diffData !== undefined &&
            game.originalImage !== "" &&
            game.modifiedImage !== "" &&
            game.gameName !== "";
    }

    public async create(data: ISimpleGame): Promise<Message> {
        if (!SimpleGamesCollectionService.validate(data)) {
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

    public async getFromId(id: string): Promise<ISimpleGame> {
        CollectionService.assertId(id);

        return this.getDocument(id, NON_EXISTING_GAME_ERROR_MESSAGE);
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
