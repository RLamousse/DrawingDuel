import { injectable } from "inversify";
import {Db, MongoClient, MongoError} from "mongodb";
import "reflect-metadata";
import {GamesCollectionService} from "./db/games.collection.service";
import {ImagesCollectionService} from "./db/images.collection.service";
import {UsersCollectionService} from "./db/users.collection.service";

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
    private _users: UsersCollectionService;
    private _games: GamesCollectionService;
    private _images: ImagesCollectionService;

    public constructor() {
        MongoClient.connect(this.DB_URL, {useNewUrlParser : true}, (err: MongoError, client: MongoClient) => {
            if (!err) {
                this._dataBase = client.db(this.DB_DB);
                this._users = new UsersCollectionService(this._dataBase.collection("users"));
                this._games = new GamesCollectionService(this._dataBase.collection("games"));
                this._images = new ImagesCollectionService(this._dataBase.collection("images"));
            } else {
                throw(err);
            }
        });
    }

    public get users(): UsersCollectionService {
        return this._users;
    }

    public get games(): GamesCollectionService {
        return this._games;
    }

    public get images(): ImagesCollectionService {
        return this._images;
    }
}
