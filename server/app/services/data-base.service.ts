import * as config from "config";
import { injectable } from "inversify";
import {Db, FilterQuery, MongoClient} from "mongodb";
import "reflect-metadata";
import {IGame} from "../../../common/model/game/game";
import { FreeGamesCollectionService } from "./db/free-games.collection.service";
import { SimpleGamesCollectionService } from "./db/simple-games.collection.service";

export const SIMPLE_GAMES_COLLECTION: string = "simpleGames";
export const FREE_GAMES_COLLECTION: string = "freeGames";
export const NOT_TO_BE_DELETED_FILTER_QUERY: FilterQuery<IGame> = {["toBeDeleted"]: {$eq: false}};

@injectable()
export class DataBaseService {

    private readonly DB_EXIT_CODE: number = -42;
    private readonly DB_USER: string = config.get("mongo.user");
    private readonly DB_PASSWORD: string = config.get("mongo.password");
    private readonly DB_HOST: string = config.get("mongo.host");
    private readonly DB_URL: string = `mongodb+srv://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}`;
    private readonly DB_DB: string = config.get("mongo.database");

    private _dataBase: Db;
    private _simpleGames: SimpleGamesCollectionService;
    private _freeGames: FreeGamesCollectionService;

    public constructor() {
        MongoClient.connect(this.DB_URL, {useNewUrlParser: true})
            .then((client: MongoClient) => {
                this._dataBase = client.db(this.DB_DB);
                this._simpleGames = new SimpleGamesCollectionService(this._dataBase.collection(SIMPLE_GAMES_COLLECTION));
                this._freeGames = new FreeGamesCollectionService(this._dataBase.collection(FREE_GAMES_COLLECTION));
            })
            .catch(() => {
                console.error("Unable to connect to the database!");
                console.error(`URL ${this.DB_URL}`);
                console.error("Exiting...");

                process.exit(this.DB_EXIT_CODE);
            });
    }

    public get simpleGames(): SimpleGamesCollectionService {
        return this._simpleGames;
    }

    public get freeGames(): FreeGamesCollectionService {
        return this._freeGames;
    }
}
