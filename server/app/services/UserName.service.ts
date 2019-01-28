﻿//import { Request } from "express";
import "reflect-metadata";
import { injectable } from "inversify";
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";
@injectable()
export class UserNameService {
    private list: string[] = [];
    public async checkAvailability(user: UserValidationMessage): Promise<UserValidationMessage> {
        if (this.list.find(takenUser => takenUser === user.username )) {
            user.available = false;
            return user;
        }
        this.list.push(user.username);
        user.available = true;
        return user;
    }
}
