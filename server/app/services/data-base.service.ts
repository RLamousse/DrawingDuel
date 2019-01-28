import { injectable } from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/message";

@injectable()
export class DataBaseService {

    public async post(argument: string): Promise<Message> {
        return{title: "post", body: argument};
    }

    public async get(argument: string): Promise<Message> {
        return{title: "get", body: argument};
    }
}
