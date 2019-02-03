import { expect } from "chai";
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";
import { UserNameService } from "./UserName.service";

describe("UserNameService", () => {

    let service: UserNameService;
    beforeEach(() => {
        service = new UserNameService();
    });

    // Test checkAvailability
    it("should return the entry user with available at true when new user", async () => {
        service.checkAvailability({ username: "zack1", available: false }).then((response: UserValidationMessage) => {
            expect(response.available).to.deep.equal(true);
            expect(response.username).to.deep.equal("zack1");
        }).catch();
    });

    it("should return the entry user with available at false when username already taken", async () => {
        await service.checkAvailability({ username: "cody2", available: false });
        service.checkAvailability({ username: "cody2", available: false }).then((response: UserValidationMessage) => {
            expect(response.available).to.deep.equal(false);
            expect(response.username).to.deep.equal("cody2");
        }).catch();
    });

    // Test releaseUsername
    it("should send a UserValidationMessage with false as available (emptyList)", async () => {
        service.releaseUsername("LondonTipton").then((response: UserValidationMessage) => {
            expect(response.available).to.deep.equal(false);
            expect(response.username).to.deep.equal("LondonTipton");
        }).catch();
    });

    it("should send a UserValidationMessage with false as available (not in the list)", async () => {
        await service.checkAvailability({ username: "Maddie", available: false });
        service.releaseUsername("Arwin3").then((response: UserValidationMessage) => {
            expect(response.available).to.deep.equal(false);
            expect(response.username).to.deep.equal("Arwin3");
        }).catch();
    });

    it("should send a UserValidationMessage with true as available (succesfully release)", async () => {
        await service.checkAvailability({ username: "Mosby3", available: false });
        service.releaseUsername("Moseby3").then((response: UserValidationMessage) => {
            expect(response.available).to.deep.equal(true);
            expect(response.username).to.deep.equal("Moseby3");
        }).catch();
    });

});
