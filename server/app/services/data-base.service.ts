import { injectable } from "inversify";
import {Collection, Db, MongoClient, MongoError} from "mongodb";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {IBitmapImage} from "../../../common/model/IBitmapImage";
import {IGame} from "../../../common/model/IGame";

export const USER_NAME_FIELD: string = "userName";

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
}
