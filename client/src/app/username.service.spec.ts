import {async, TestBed} from "@angular/core/testing";
import {SocketService} from "./socket.service";
import {UNListService} from "./username.service";
import {SocketEvent} from "../../../common/communication/socket-events";
import {WebsocketMessage} from "../../../common/communication/messages/message";

describe("UNListService", () => {

  let service: UNListService;
  let spyService: jasmine.SpyObj<UNListService>;
  beforeEach(() => {
    spyService = jasmine.createSpyObj("UNListService", ["checkAvailability", "sendUserRequest", "isTooShort", "isAlphanumeric"]);
    TestBed.configureTestingModule({
      providers: [{provide: UNListService, useValue: spyService}, SocketService],
    });
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [UNListService, SocketService],
    });
  }));

  it("should be created", () => {
    service = TestBed.get(UNListService);
    expect(service).toBeTruthy();
  });

  // Test isAlphanumeric
  it("should return false if name contain non-valid char with associate errMessage", () => {
    service = TestBed.get(UNListService);
    spyService.isAlphanumeric.and.callThrough();
    expect(service.isAlphanumeric("-Bubbles-")).toBe(false);
    expect(service.message).toBe("Tu dois utiliser seulement des caractères alphanumériques!");
  });

  it("should return true if a valid username is enter", () => {
    service = TestBed.get(UNListService);
    spyService.isAlphanumeric.and.callThrough();
    expect(service.isAlphanumeric("ButterCup2")).toBe(true);
  });

  // Test isTooShort
  it("should return true is username.lenght is = 3", () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();
    expect(service.isTooShort("Uto")).toBe(true);
  });

  it("should return true is username.lenght is < 3", () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();
    expect(service.isTooShort("U2")).toBe(true);
  });

  it("should return false is username.lenght is > 3", () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();
    expect(service.isTooShort("Utonium")).toBe(false);
  });

  it("should return false if tooShort and avec a specific errMessage", () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();
    service.isTooShort("Ace");
    expect(service.message).toBe("Ton identifiant est trop court!");
  });

  it("should return false if a invalid username is used (too short)", async () => {
    service = TestBed.get(UNListService);

    return expect(service.checkAvailability("Sar", () => {/**/})).toBeFalsy();
  });

  it("should return false if a invalid username is used (not alphanumeric)", async () => {
    service = TestBed.get(UNListService);
    spyService.isAlphanumeric.and.returnValue(false);
    spyService.isTooShort.and.returnValue(false);
    spyService.checkAvailability.and.callThrough();

    return expect(service.checkAvailability("SaraBellum!", () => {/**/})).toBe(false);
  });

  it("should return true if a valid username is used", async () => {
    service = TestBed.get(UNListService);
    spyService.checkAvailability.and.callThrough();

    return expect(service.checkAvailability("SaraBellum", () => {/**/
    })).toBe(true);
  });

  it("should return false and callback if username used", async () => {
    service = TestBed.get(UNListService);
    const message: WebsocketMessage<boolean> = {
      title: SocketEvent.DUMMY,
      body: false,
    };
    let called: boolean = false;

    const returnVal: boolean = (service as any).handleUserNameCheck(message, () => {
      called = true
    });
    expect(called).toBeTruthy();
    expect(returnVal).toBeFalsy()
  });

  it("should return true and callback if username used", async () => {
    service = TestBed.get(UNListService);
    const message: WebsocketMessage<boolean> = {
      title: SocketEvent.DUMMY,
      body: true,
    };
    let called: boolean = false;

    const returnVal: boolean = (service as any).handleUserNameCheck(message, () => {
      called = true
    });
    expect(called).toBeTruthy();
    expect(returnVal).toBeTruthy()
  });
});
