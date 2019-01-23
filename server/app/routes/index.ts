import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";

export module Route {

    @injectable()
    export class Index {

        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = {
                title: "Hello",
                body: "World"
            };
            res.send(JSON.stringify(message));
        }
    }

    export class UserIndex {
        private activeUserList: string[] = [];
        public getActiveUser(req: Request, res: Response, next: NextFunction): string[] {
            return this.activeUserList;
        }
        public addUser(str: string): void {
            this.activeUserList.push(str);
               
        }
        public removeUser(str: string): void {
            //not finished
            this.activeUserList.splice(this.activeUserList.indexOf(str));
        }
    }
}
