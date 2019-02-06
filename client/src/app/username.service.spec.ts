import { HttpClientModule } from "@angular/common/http";
import { async, TestBed } from "@angular/core/testing";
import { UNListService } from "./username.service";

describe("UNListService", () => {

  let service: UNListService;
  let spyService: jasmine.SpyObj<UNListService>;
  beforeEach(() => {
    spyService = jasmine.createSpyObj("UNListService", ["validateName", "sendUserRequest", "isTooShort", "isAlphanumeric"]);
    TestBed.configureTestingModule({
      providers: [{ provide: UNListService, useValue: spyService }],
      imports: [HttpClientModule],
    });
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UNListService],
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

  // Test validateName
  it("should return true if a valid username is used", () => {
    service = TestBed.get(UNListService);
    spyService.validateName.and.callThrough();
    spyService.sendUserRequest.and.callFake(() => {
      service.response = { available: true, username: "SaraBellum" };

      return { available: true, username: "SaraBellum" };
    });
    spyService.isAlphanumeric.and.returnValue(true);
    spyService.isTooShort.and.returnValue(false);
    service.validateName("SaraBellum").then((response: boolean) => {
      expect(response).toBe(true);
    }).catch();
  });

  it("should return false if an invalid username is used + have an errorMessage(already used)", () => {
    service = TestBed.get(UNListService);
    spyService.sendUserRequest.and.callFake(() => {
      service.response = { available: false, username: "SaraBellum" };

      return { available: false, username: "SaraBellum" };
    });
    spyService.isAlphanumeric.and.callThrough();
    spyService.isTooShort.and.callThrough();
    service.validateName("SaraBellum").then((response: boolean) => {
      expect(response).toBe(false);
      expect(service.message).toBe("Cet identifiant est deja pris! Essaie un nouvel identifiant");
    }).catch();
  });

  it("should return false if a invalid username is used (too short)", () => {
    service = TestBed.get(UNListService);
    spyService.isTooShort.and.returnValue(true);
    spyService.isAlphanumeric.and.returnValue(true);
    spyService.validateName.and.callFake(() => {
      service.response = { available: false, username: "Sar" };

      return { available: false, username: "Sar" };
    });
    service.validateName("Sar").then((response: boolean) => {
      expect(response).toBe(false);
    }).catch();
  });

  it("should return false if a invalid username is used (not alphanumeric)", () => {
    service = TestBed.get(UNListService);
    spyService.sendUserRequest.and.callFake(() => {
      service.response = { available: false, username: "SaraBellum!" };

      return { available: false, username: "SarraBellum!" };
    }).and.throwError("have been called");
    spyService.isAlphanumeric.and.returnValue(false);
    spyService.isTooShort.and.returnValue(false);
    spyService.validateName.and.callThrough();
    service.validateName("SaraBellum!").then((response: boolean) => {
      expect(response).toBe(false);
    }).catch();
  });
});
