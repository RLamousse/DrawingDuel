import { injectable } from "inversify";
import {Collection, Db, InsertOneWriteOpResult, MongoClient, MongoError} from "mongodb";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {IBitmapImage} from "../../../common/model/IBitmapImage";
import {IGame} from "../../../common/model/IGame";
import {GAME_FORMAT_ERROR_MESSAGE, USERNAME_FORMAT_ERROR_MESSAGE} from "../controllers/data-base.controller";

export const ALREADY_EXISTING_USER_MESSAGE_ERROR: string = "ERROR: the specified usename already exists!";
export const ALREADY_EXISTING_GAME_MESSAGE_ERROR: string = "ERROR: a game with the same name already exists!";
export const ALREADY_EXISTING_IMAGE_MESSAGE_ERROR: string = "ERROR: an image with the same name already exists!";
export const NOT_EXISTING_USER_MESSAGE_ERROR: string = "ERROR: the specified usename does no exist!";
export const NOT_EXISTING_GAME_MESSAGE_ERROR: string = "ERROR: the specified game does no exist!";
export const DATA_BASE_MESSAGE_ERROR: string = "ERROR: something went wrong with the database!";
export const USER_NAME_FIELD: string = "userName";
export const GAME_FIELD: string = "game";
export const GAME_NAME_FIELD: string = "gameName";

@injectable()
export class DataBaseService {

    private readonly DB_USER: string = "server";
    private readonly DB_PASSWORD: string = "RZDpcD8vqu8hmjX";
    private readonly DB_DB: string = "projet";
    private readonly DB_HOST: string = "ds145289.mlab.com";
    private readonly DB_PORT: string = "45289";
    private readonly DB_URL: string = "mongodb://" + this.DB_USER + ":" + this.DB_PASSWORD + "@"
        + this.DB_HOST + ":" + this.DB_PORT + "/" + this.DB_DB;

    private _dataBase: Db;
    private _users: Collection<string>;
    private _games: Collection<IGame>;
    private _images: Collection<IBitmapImage>;

    public constructor() {
        MongoClient.connect(this.DB_URL, {useNewUrlParser : true}, (err: MongoError, client: MongoClient) => {
            if (!err) {
                this._dataBase = client.db(this.DB_DB);
                this._users = this._dataBase.collection("users");
                this._games = this._dataBase.collection("games");
                this._images = this._dataBase.collection("images");
            } else {
                throw(err);
            }
        });
    }

    public async addUser(userName: string): Promise<Message> {
        if (typeof userName !== "string" || userName === "") {
            throw new Error(USERNAME_FORMAT_ERROR_MESSAGE);
        }
        if (await this.containsUser(userName)) {
            throw new Error(ALREADY_EXISTING_USER_MESSAGE_ERROR);
        } else {
            return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {
                // @ts-ignore
                this._users.insertOne( {[USER_NAME_FIELD]: userName}, (error: MongoError, res: InsertOneWriteOpResult) => {
                    if (error) {
                        reject( new Error(DATA_BASE_MESSAGE_ERROR));
                    }
                    resolve({title: "User added", body: "user " + userName + " successfully added!"});
                });
            });
        }
    }

    public async deleteUser(userName: string): Promise<Message> {
        if (typeof userName !== "string" || userName === "") {
            throw new Error(USERNAME_FORMAT_ERROR_MESSAGE);
        }
        if (!(await this.containsUser(userName))) {
            throw new Error(NOT_EXISTING_USER_MESSAGE_ERROR);
        } else {

            return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {
                this._users.deleteOne( {[USER_NAME_FIELD]: {$eq : userName}}, (error: MongoError, res: InsertOneWriteOpResult) => {
                    if (error) {
                        reject( new Error(DATA_BASE_MESSAGE_ERROR));
                    }
                    resolve({title: "User deleted", body: "user " + userName + " successfully deleted!"});
                });
            });
        }
    }

    public async deleteGame(gameName: string): Promise<Message> {
        if (typeof gameName !== "string" || gameName === "") {
            throw new Error(GAME_FORMAT_ERROR_MESSAGE);
        }
        if (!(await this.containsGame(gameName))) {
            throw new Error(NOT_EXISTING_GAME_MESSAGE_ERROR);
        } else {

            return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {
                this._games.deleteOne( {[GAME_NAME_FIELD]: {$eq : gameName}}, (error: MongoError, res: InsertOneWriteOpResult) => {
                    if (error) {
                        reject( new Error(DATA_BASE_MESSAGE_ERROR));
                    }
                    resolve({title: "Game deleted", body: "game " + gameName + " successfully deleted!"});
                });
            });
        }
    }

    private async containsUser(userName: string): Promise<boolean> {
        try {
            return ((await this._users.countDocuments( {[USER_NAME_FIELD] : {$eq : userName}})) !== 0);
        } catch (error) {
            throw new Error(DATA_BASE_MESSAGE_ERROR);
        }
    }

    public async addGame(game: IGame): Promise<Message> {
        this.testGameStructure(game);
        if (await this.containsGame(game.gameName)) {
            throw new Error(ALREADY_EXISTING_GAME_MESSAGE_ERROR);
        } else {
            return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {

                this._games.insertOne( game, (error: MongoError, res: InsertOneWriteOpResult) => {
                    if (error) {
                        reject( new Error(DATA_BASE_MESSAGE_ERROR));
                    }
                    resolve({title: "game added", body: "game " + game.gameName + " successfully added"});
                });
            });
        }
    }

    private async containsGame(gameName: string): Promise<boolean> {
        try {
            return ((await this._games.countDocuments( {[GAME_NAME_FIELD] : {$eq : gameName}})) !== 0);
        } catch (error) {
            throw new Error(DATA_BASE_MESSAGE_ERROR);
        }
    }

    private async containsImage(imageName: string): Promise<boolean> {
        try {
            return ((await this._images.countDocuments( {[GAME_NAME_FIELD] : {$eq : imageName}})) !== 0);
        } catch (error) {
            throw new Error(DATA_BASE_MESSAGE_ERROR);
        }
    }

    public async getGames(): Promise<IGame[]> {
        return new Promise<IGame[]>((resolve: (value?: IGame[] | PromiseLike<IGame[]>) => void, reject: (reason?: Error) => void) => {
            this._games.find().toArray((error: MongoError, res: IGame[]) => {
                if (error) {
                    reject( new Error(DATA_BASE_MESSAGE_ERROR));
                }
                resolve(res);
            });
        });
    }

    public async getGame(gameName: string): Promise<IGame> {
        if (typeof gameName !== "string" || gameName === "") {
            throw new Error(USERNAME_FORMAT_ERROR_MESSAGE);
        }

        return new Promise<IGame>((resolve: (value?: IGame | PromiseLike<IGame>) => void, reject: (reason?: Error) => void) => {
            this._games.find({[GAME_NAME_FIELD] : {$eq : gameName}}).toArray((error: MongoError, res: IGame[]) => {
                if (error) {
                    reject( new Error(DATA_BASE_MESSAGE_ERROR));
                } else if (res.length === 0) {
                    reject(new Error(NOT_EXISTING_GAME_MESSAGE_ERROR));
                }
                resolve(res[0]);
            });
        });
    }

    public testGameStructure(game: IGame): void {
        try {
            game.gameName = game.gameName;
        } catch (error) {
            throw new Error(GAME_FORMAT_ERROR_MESSAGE);
        }
        if (typeof game.gameName !== "string" || game.gameName === "") {
            throw new Error(GAME_FORMAT_ERROR_MESSAGE);
        }
        // @ts-ignore
        if (typeof game.originalImage !== "string" || game.originalImage === "") {
            throw new Error(GAME_FORMAT_ERROR_MESSAGE);
        }
        if (typeof game.modifiedImage !== "string" || game.modifiedImage === "") {
            throw new Error(GAME_FORMAT_ERROR_MESSAGE);
        }

    }

    public async addImage(image: IBitmapImage) {
        if (await this.containsImage(image.name)) {
            throw new Error(ALREADY_EXISTING_IMAGE_MESSAGE_ERROR);
        } else {
            return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {

                this._images.insertOne( image, (error: MongoError, res: InsertOneWriteOpResult) => {
                    if (error) {
                        reject( new Error(DATA_BASE_MESSAGE_ERROR));
                    }
                    resolve({title: "Image added", body: "Image " + image.name + " successfully added"});
                });
            });
        }
    }
}
