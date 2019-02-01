import { TestBed, async } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { UNListService } from "./username.service";
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";
describe("UNListService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [UNListService],
      imports: [HttpClientModule]
    }));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UNListService]
    });
  }));

  it("should be created", () => {
    const service: UNListService = TestBed.get(UNListService);
    expect(service).toBeTruthy();
  });

  // Test sendUserRequest()
  it("should receive a UserValidationMessage after sendUserRequest", () => {
    const service: UNListService = TestBed.get(UNListService);
    const messageTypeVariable: UserValidationMessage = {
      available: false,
      username: "Jonhny"
    };
    service.sendUserRequest(messageTypeVariable.username).toPromise().then((response: any) => expect(typeof (response)).toBe(typeof (messageTypeVariable)));
  });

  it("should receive a UserValidationMessage with the same username and available tobe true", () => {
    const service: UNListService = TestBed.get(UNListService);
    const messageTypeVariable: UserValidationMessage = {
      available: false,
      username: "Bobby96"
    };
    service.sendUserRequest(messageTypeVariable.username).toPromise().then((response: UserValidationMessage) => {
      expect(response.username).toEqual(messageTypeVariable.username);
      expect(response.available).toBe(true);
    });
  });

  it("should receive a UserValidationMessage with available as false and with the same username", () => {
    const service: UNListService = TestBed.get(UNListService);
    const messageTypeVariable: UserValidationMessage = {
      available: false,
      username: "cochon4"
    };
    service.sendUserRequest(messageTypeVariable.username).toPromise().then(() => {
      service.sendUserRequest(messageTypeVariable.username).toPromise().then((response: UserValidationMessage) => {
        expect(response.available).toBe(false)
        expect(response.username).toEqual(messageTypeVariable.username);
      });
    })
  });

  it("should receive an error", () => {
    const service: UNListService = TestBed.get(UNListService);
    const crashTest: any = 12;
    const messageTypeVariable: UserValidationMessage = {
      available: false,
      username: crashTest
    };
    service.sendUserRequest(crashTest).toPromise().then((response: UserValidationMessage) => {
      expect(response.username).toEqual(messageTypeVariable.username);
      expect(response.available).toBe(false);
    });
  });

  // Test sendReleaseRequest()
  it("should receive a UserValidationMessage after sendReleaseRequest", () => {
    const service: UNListService = TestBed.get(UNListService);
    UNListService.username = "spongebob";
    const messageTypeVariable: UserValidationMessage = {
      available: false,
      username: UNListService.username
    };
    service.sendReleaseRequest().then((response: any) => expect(typeof (response)).toBe(typeof (messageTypeVariable)));
  });

  it("should receive a UserValidationMessage with available as true", () => {
    const service: UNListService = TestBed.get(UNListService);
    UNListService.username = "carlos";
    service.sendUserRequest(UNListService.username);
    service.sendReleaseRequest().then((response: UserValidationMessage) => expect(response.available).toBe(true));
  });

  it("should receive a UserValidationMessage with available as false (username not in server)", () => {
    const service: UNListService = TestBed.get(UNListService);
    UNListService.username = "sandy";
    service.sendReleaseRequest().then((response: UserValidationMessage) => expect(response.available).toBe(false));
  });

});
