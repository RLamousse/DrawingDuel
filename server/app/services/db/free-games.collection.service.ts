import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../../common/communication/messages/message";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { CollectionService } from "./collection.service";
import {
    ALREADY_EXISTING_GAME_MESSAGE_ERROR,
    GAME_FORMAT_ERROR_MESSAGE, GAME_NAME_FIELD,
    NON_EXISTING_GAME_ERROR_MESSAGE
} from "./simple-games.collection.service";

@injectable()
export class FreeGamesCollectionService extends CollectionService<IFreeGame> {

    private static validate(game: IFreeGame): boolean {
        return game.scenes !== undefined &&
            game.gameName !== "";
    }

    public async create(data: IFreeGame): Promise<Message> {
        if (!FreeGamesCollectionService.validate(data)) {
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

    public async getFromId(id: string): Promise<IFreeGame> {
        CollectionService.assertId(id);

        return this.getDocument(id, NON_EXISTING_GAME_ERROR_MESSAGE);
    }

    public creationSuccessMessage(data: IFreeGame): Message {
        return {
            title: "Free game added",
            body: "Free game " + data.gameName + " successfully added",
        };
    }

    public deletionSuccessMessage(id: string): Message {
        return {
            title: "Free game deleted",
            body: "Free game " + id + " successfully deleted!",
        };
    }

    protected get idFieldName(): string {
        return GAME_NAME_FIELD;
    }

}
