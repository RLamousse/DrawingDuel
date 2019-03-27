import {injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../../common/communication/messages/message";
import {
    AlreadyExistentGameError,
    InvalidGameError,
    InvalidGameInfoError,
    NonExistentGameError, NoElementFoundError
} from "../../../../common/errors/database.errors";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {CollectionService} from "./collection.service";

export const GAME_NAME_FIELD: string = "gameName";

@injectable()
export class SimpleGamesCollectionService extends CollectionService<ISimpleGame> {

    private static validate(game: ISimpleGame): boolean {
        // we want to assert for every type of undefined, not just for null
        // tslint:disable-next-line:triple-equals
        return game != undefined &&
            game.diffData !== undefined &&
            game.originalImage !== "" &&
            game.modifiedImage !== "" &&
            game.gameName !== "";
    }

    private static validateUpdate(game: Partial<ISimpleGame>): boolean {
        return !!(game || ({} as Partial<ISimpleGame>)).gameName ||
            !!(game || ({} as Partial<ISimpleGame>)).bestSoloTimes ||
            !!(game || ({} as Partial<ISimpleGame>)).bestMultiTimes ||
            !!(game || ({} as Partial<ISimpleGame>)).originalImage ||
            !!(game || ({} as Partial<ISimpleGame>)).modifiedImage ||
            !!(game || ({} as Partial<ISimpleGame>)).diffData ||
            typeof (game || ({} as Partial<ISimpleGame>)).toBeDeleted !== "undefined";
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

    public async update(id: string, data: Partial<ISimpleGame>): Promise<Message> {
        if (!SimpleGamesCollectionService.validateUpdate(data)) {
            throw new InvalidGameInfoError();
        }

        if (!(await this.contains(id))) {
            throw new NonExistentGameError();
        } else {
            return this.updateDocument(id, data);
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

        return this.getDocument(id)
            .then((game: ISimpleGame) => {
                return game;
            })
            .catch((error: Error) => {
                if (error.message === NoElementFoundError.NO_ELEMENT_FOUND_ERROR_MESSAGE) {
                    throw new NonExistentGameError();
                }

                throw error;
            });
    }

    protected creationSuccessMessage(data: ISimpleGame): Message {
        return {
            title: "Simple game added",
            body: "Simple game " + data.gameName + " successfully added",
        };
    }

    protected updateSuccessMessage(id: string): Message {
        return {
            title: "Simple game updated",
            body: "Simple game " + id + " successfully updated",
        };
    }

    protected deletionSuccessMessage(id: string): Message {
        return {
            title: "Simple game deleted",
            body: "Simple game " + id + " successfully deleted!",
        };
    }

    protected get idFieldName(): string {
        return GAME_NAME_FIELD;
    }

}
