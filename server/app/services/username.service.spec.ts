import { expect } from "chai";
import { UserValidationMessage } from "../../../common/communication/messages/user-validation-message";
import { UsernameService } from "./username.service";

describe("UserNameService", () => {

    let service: UsernameService;
    beforeEach(() => {
        service = new UsernameService();
    });

    // Test checkAvailability
    it("should return the entry user with available at true when new user", async () => {
        return service.checkAvailability({ username: "zack1", available: false }).then((response: UserValidationMessage) => {
            expect(response).to.eql({ username: "zack1", available: true });
        });
    });

    it("should return the entry user with available at false when username already taken", async () => {
        await service.checkAvailability({ username: "cody2", available: false });

        return service.checkAvailability({ username: "cody2", available: false }).then((response: UserValidationMessage) => {
            expect(response).to.deep.equal({ username: "cody2", available: false });
        });
    });

    // Test releaseUsername
    it("should send a UserValidationMessage with false as available (emptyList)", async () => {
        return service.releaseUsername("LondonTipton").then((response: UserValidationMessage) => {
            expect(response).to.eql({ username: "LondonTipton", available: false });
        });
    });

    it("should send a UserValidationMessage with false as available (not in the list)", async () => {
        await service.checkAvailability({ username: "Maddie", available: false });

        return service.releaseUsername("Maddie").then((response: UserValidationMessage) => {
            expect(response).to.eql({ username: "Maddie", available: false });
        });
    });

    it("should send a UserValidationMessage with true as available (succesfully release)", async () => {
        await service.checkAvailability({ username: "Mosby3", available: false });

        return service.releaseUsername("Moseby3").then((response: UserValidationMessage) => {
            expect(response).to.eql({ username: "Moseby3", available: true });
        });
    });

});
