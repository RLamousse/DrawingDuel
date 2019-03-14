import { injectable } from "inversify";
import { Db, MongoClient, MongoError } from "mongodb";
import "reflect-metadata";
import { FreeGamesCollectionService } from "./db/free-games.collection.service";
import { SimpleGamesCollectionService } from "./db/simple-games.collection.service";

@injectable()
export class DataBaseService {

    private readonly DB_EXIT_CODE: number = -1;
    private readonly DB_USER: string = "server";
    private readonly DB_PASSWORD: string = "RZDpcD8vqu8hmjX";
    private readonly DB_DB: string = "projet";
    private readonly DB_HOST: string = "ds145289.mlab.com";
    private readonly DB_PORT: string = "45289";
    private readonly DB_URL: string = "mongodb://" + this.DB_USER + ":" + this.DB_PASSWORD + "@"
        + this.DB_HOST + ":" + this.DB_PORT + "/" + this.DB_DB;

    private _dataBase: Db;
    private _simpleGames: SimpleGamesCollectionService;
    private _freeGames: FreeGamesCollectionService;

    public constructor() {
        MongoClient.connect(this.DB_URL, {useNewUrlParser : true}, (err: MongoError, client: MongoClient) => {
            if (!err) {
                this._dataBase = client.db(this.DB_DB);
                this._simpleGames = new SimpleGamesCollectionService(this._dataBase.collection("simpleGames"));
                this._freeGames = new FreeGamesCollectionService(this._dataBase.collection("freeGames"));
            } else {
                process.exit(this.DB_EXIT_CODE);
            }
        });
    }

    public get simpleGames(): SimpleGamesCollectionService {
        return this._simpleGames;
    }

    public get freeGames(): FreeGamesCollectionService {
        return this._freeGames;
    }
}
