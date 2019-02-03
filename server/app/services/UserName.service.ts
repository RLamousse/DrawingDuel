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

    public async releaseUsername(user: string): Promise<UserValidationMessage> {
        let index = this.list.indexOf(user);
        if (index !== undefined && this.list.length !==0) {
            this.list.splice(index, 1);
            return {
                username: user, available: true
            };
        }

        return { username: user, available: false };
    }
}
