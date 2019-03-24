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
        const response: UserValidationMessage =  service.checkAvailability({ username: "zack1", available: false });
        expect(response).to.eql({ username: "zack1", available: true });
    });

    it("should return the entry user with available at false when username already taken", async () => {
        service.checkAvailability({ username: "cody2", available: false });

        const response: UserValidationMessage =  service.checkAvailability({ username: "cody2", available: false });
        expect(response).to.deep.equal({ username: "cody2", available: false });
    });

    // Test releaseUsername
    it("should send a UserValidationMessage with false as available (emptyList)", async () => {
        const response: UserValidationMessage =  service.releaseUsername("LondonTipton");
        expect(response).to.eql({ username: "LondonTipton", available: false });
    });

    it("should send a UserValidationMessage with false as available (not in the list)", async () => {
        service.checkAvailability({ username: "Maddie", available: false });

        const response: UserValidationMessage =  service.releaseUsername("Maddie");
        expect(response).to.eql({ username: "Maddie", available: true });
    });

    it("should send a UserValidationMessage with true as available (succesfully release)", async () => {
        service.checkAvailability({ username: "Moseby3", available: false });

        const response: UserValidationMessage = service.releaseUsername("Moseby3");
        expect(response).to.eql({ username: "Moseby3", available: true });
    });

});
