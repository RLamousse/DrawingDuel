import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {
    AlreadyExistentGameError,
    InvalidGameError,
    NonExistentGameError,
    NoElementFoundError
} from "../../../../common/errors/database.errors";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {CollectionService} from "./collection.service";
import {GAME_NAME_FIELD} from "./simple-games.collection.service";

@injectable()
export class FreeGamesCollectionService extends CollectionService<IFreeGame> {

    private static validate(game: IFreeGame): boolean {
        // we want to assert for everytype of undefines, not just for null
        // tslint:disable-next-line:triple-equals
        return game != undefined &&
            game.scenes !== undefined &&
            game.gameName !== "";
    }

    public async create(data: IFreeGame): Promise<Message> {
        if (!FreeGamesCollectionService.validate(data)) {
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

    public async getFromId(id: string): Promise<IFreeGame> {
        CollectionService.assertId(id);

        return this.getDocument(id)
            .then((game: IFreeGame) => {
                return game;
            })
            .catch((error: Error) => {
                if (error.message === NoElementFoundError.NO_ELEMENT_FOUND_ERROR_MESSAGE) {
                    throw new NonExistentGameError();
                }

                throw error;
            });
    }

    protected creationSuccessMessage(data: IFreeGame): Message {
        return {
            title: "Free game added",
            body: "Free game " + data.gameName + " successfully added",
        };
    }

    protected deletionSuccessMessage(id: string): Message {
        return {
            title: "Free game deleted",
            body: "Free game " + id + " successfully deleted!",
        };
    }

    protected get idFieldName(): string {
        return GAME_NAME_FIELD;
    }

}
