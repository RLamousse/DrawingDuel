import { injectable } from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/message";

@injectable()
export class DataBaseService {

    public post(argument: string): Message {
        return{title: "post", body: argument};
    }

    public get(argument: string): Message {
        return{title: "get", body: argument};
    }
}
