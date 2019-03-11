import { inject, injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { UserValidationMessage } from "../../../../common/communication/messages/user-validation-message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import types from "../../types";
import { UsernameService } from "../username.service";
import { WebsocketActionService } from "./websocket-action.service";

@injectable()
export class CheckUserWebsocketActionService extends WebsocketActionService {

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.USERNAME_CHECK;

    public constructor(@inject(types.UserNameService) private usernameService: UsernameService) {
        super();
    }

    public execute(data: WebsocketMessage<string>, socket: io.Socket): string {
        const userValid: UserValidationMessage = {
            username: data.body,
            available: false,
        };
        const value: UserValidationMessage = this.usernameService.checkAvailability(userValid);
        const message: WebsocketMessage<boolean> = {
            title: SocketEvent.USERNAME_CHECK,
            body: value.available,
        };
        socket.emit(this._EVENT_TYPE, message);

        return value.available ? value.username : "";
    }

    public removeUsername (username: string): void {
        this.usernameService.releaseUsername(username);
    }
}
