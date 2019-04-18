import { injectable } from "inversify";
import { UserValidationMessage } from "../../../common/communication/messages/user-validation-message";
import {TwoWayMap} from "../util/twoWayMap";

@injectable()
export class UsernameService {
    // first user name, second socketId
    private list: TwoWayMap<string, string>;

    public constructor () {
        this.list = new TwoWayMap<string, string>();
    }

    public checkAvailability(user: UserValidationMessage, socketId: string): UserValidationMessage {
        if (this.list.get(user.username)) {
            user.available = false;

            return user;
        }
        this.list.set(user.username, socketId);
        user.available = true;

        return user;
    }

    public releaseUsername(user: string): UserValidationMessage {
        if (this.list.get(user)) {
            this.list.delete(user);

            return {
                username: user, available: true,
            };
        }

        return { username: user, available: false };
    }

    public getUsernameBySocketId(socketId: string): string {
        return this.list.revGet(socketId) as string;
    }
}
