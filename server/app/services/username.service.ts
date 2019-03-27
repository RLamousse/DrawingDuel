import { injectable } from "inversify";
import { UserValidationMessage } from "../../../common/communication/messages/user-validation-message";

@injectable()
export class UsernameService {
    private list: Set<string>;

    public constructor () {
        this.list = new Set();
    }

    public checkAvailability(user: UserValidationMessage): UserValidationMessage {
        if (this.list.has(user.username)) {
            user.available = false;

            return user;
        }
        this.list.add(user.username);
        user.available = true;

        return user;
    }

    public releaseUsername(user: string): UserValidationMessage {
        if (this.list.has(user)) {
            this.list.delete(user);

            return {
                username: user, available: true,
            };
        }

        return { username: user, available: false };
    }
}
