import { injectable } from "inversify";
import {Collection, Db, MongoClient, MongoError} from "mongodb";
import "reflect-metadata";
import {Message} from "../../../common/communication/message";
import {Game} from "../../../common/Object/game";
// import {Client} from "socket.io";

@injectable()
export class DataBaseService {

    private readonly DB_USER: string = "server";
    private readonly DB_PASSWORD: string = "RZDpcD8vqu8hmjX";
    private readonly DB_DB: string = "projet";
    private readonly DB_HOST: string = "ds145289.mlab.com";
    private readonly DB_PORT: string = "45289";
    private readonly DB_URL: string = "mongodb://" + this.DB_USER + ":" + this.DB_PASSWORD + "@"
        + this.DB_HOST + ":" + this.DB_PORT + "/" + this.DB_DB;

    private dataBase: Db;
    private users: Collection<string>;
    private games: Collection<Game>;

    public constructor() {
        MongoClient.connect(this.DB_URL, {useNewUrlParser : true}, (err: MongoError, client: any) => {
            if (!err) {
                this.dataBase = client.db(this.DB_DB);
                this.users = this.dataBase.collection("users");
                this.games = this.dataBase.collection("games");
            } else {
                console.dir(err);
                // TODO exit program
            }
        });
    }

    public async post(argument: string): Promise<Message> {
        return{title: "post", body: argument};
    }

    public async get(argument: string): Promise<Message> {
        return{title: "get", body: argument};
    }
}
