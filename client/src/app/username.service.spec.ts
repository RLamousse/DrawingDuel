// tslint:disable: no-floating-promises
import {async, TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";
import {createWebsocketMessage, WebsocketMessage} from "../../../common/communication/messages/message";
import {HOME_ROUTE} from "../../../common/communication/routes";
import {SocketService} from "./socket.service";
import {UNListService} from "./username.service";

describe("UNListService", () => {

  let mockRouter: Router;
  let service: UNListService;
  let spyService: jasmine.SpyObj<UNListService>;
  beforeEach(() => {
    // @ts-ignore
    mockRouter = { navigate: null };
    spyService = jasmine.createSpyObj("UNListService", ["checkAvailability",
                                                        "sendUserRequest",
                                                        "isTooShort",
                                                        "isAlphanumeric",
                                                        "canActivate"]);
    TestBed.configureTestingModule({
      providers: [{provide: UNListService, useValue: spyService}, SocketService, {provide: Router, useValue: mockRouter}],
    });
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [UNListService, SocketService],
    });
  }));

  it("should be created", async () => {
    service = TestBed.get(UNListService);

    return expect(service).toBeTruthy();
  });

  // Test isAlphanumeric
  it("should return false if name contain non-valid char with associate errMessage", () => {
    service = TestBed.get(UNListService);
    spyService.isAlphanumeric.and.callThrough();
    expect(service.isAlphanumeric("-Bubbles-")).toBe(false);
    expect(service.message).toBe("Caractères alphanumériques seulement!");
  });

  it("should return true if a valid username is enter", async () => {
    service = TestBed.get(UNListService);
    spyService.isAlphanumeric.and.callThrough();

    return expect(service.isAlphanumeric("ButterCup2")).toBe(true);
  });

  // Test isTooShort
  it("should return true is username.lenght is = 3", async () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();

    return expect(service.isTooShort("Uto")).toBe(true);
  });

  it("should return true is username.lenght is < 3", async () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();

    return expect(service.isTooShort("U2")).toBe(true);
  });

  it("should return false is username.lenght is > 3", async () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();

    return expect(service.isTooShort("Utonium")).toBe(false);
  });

  it("should return false if tooShort and avec a specific errMessage", async () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.callThrough();
    service.isTooShort("Ace");

    return expect(service.message).toBe("Ton identifiant est trop court!");
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
    const message: WebsocketMessage<boolean> = createWebsocketMessage(false);
    let called: boolean = false;
    // Accessing private members
    // tslint:disable-next-line: no-any
    const returnVal: boolean = (service as any).handleUserNameCheck(message, () => {
      called = true;
    });
    expect(called).toBeTruthy();
    expect(returnVal).toBeFalsy();
  });

  it("should return true and callback if username used", async () => {
    service = TestBed.get(UNListService);
    const message: WebsocketMessage<boolean> = createWebsocketMessage(true);
    let called: boolean = false;
    // Accessing private members
    // tslint:disable-next-line: no-any
    const returnVal: boolean = (service as any).handleUserNameCheck(message, () => {
      called = true;
    });
    expect(called).toBeTruthy();
    expect(returnVal).toBeTruthy();
  });

  describe("canActivate", () => {

    it("it should return true and not navigate to home if username is defined", () => {
      mockRouter.navigate = jasmine.createSpy("navigate").and.returnValue(Promise.resolve());
      service = TestBed.get(UNListService);
      UNListService.username = "someUser";
      expect(service.canActivate()).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it("it should return false and navigate to home on canActivate if username is empty", () => {
      mockRouter.navigate = jasmine.createSpy("navigate").and.returnValue(Promise.resolve());
      service = TestBed.get(UNListService);
      UNListService.username = "";
      expect(service.canActivate()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith([HOME_ROUTE]);
    });

    it("it should throw if there is a userName error", () => {
      mockRouter.navigate = jasmine.createSpy("navigate").and.throwError("error");
      service = TestBed.get(UNListService);
      UNListService.username = "";
      expect(service.canActivate).toThrow();
    });
  });
});
