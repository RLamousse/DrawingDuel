//import { Request } from "express";
import "reflect-metadata";
import { injectable } from "inversify";

@injectable()
export class UserNameService {
    private userNameList: string[] = [];
    private available: boolean = true;

    public async checkAvailability(user: string): Promise<boolean> {
        if (this.userNameList.find(name))
            return !this.available;
        else {
            this.userNameList.push(user);
            return true;
        }
    }
}
