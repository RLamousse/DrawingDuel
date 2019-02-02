import { TestBed, async } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { UNListService } from "./username.service";
//import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";

describe("UNListService", () => {

  let service: UNListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UNListService],
      imports: [HttpClientModule]
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UNListService]
    });
  }));

  it("should be created", () => {
    service = TestBed.get(UNListService);
    expect(service).toBeTruthy();
  });

  // Test isAlphanumeric

  it("should return false if name contain non-valid char with associate errMessage", () => {
    service = TestBed.get(UNListService);
    expect(service.isAlphanumeric("-Bubbles-")).toBe(false);
    expect(service.message).toBe("Tu dois utiliser seulement des caractères alphanumériques!");
  });

  it("should return true if a valid username is enter", () => {
    service = TestBed.get(UNListService);
    expect(service.isAlphanumeric("ButterCup2")).toBe(true);
  });

  //Test isTooShort
  it("should return true is username.lenght is = 3", () => {
    service = TestBed.get(UNListService);
    expect(service.isTooShort("Uto")).toBe(true);
  });

  it("should return true is username.lenght is < 3", () => {
    service = TestBed.get(UNListService);
    expect(service.isTooShort("U2")).toBe(true);
  });

  it("should return false is username.lenght is > 3", () => {
    service = TestBed.get(UNListService);
    expect(service.isTooShort("Utonium")).toBe(false);
  });

  it("should return false if tooShort and avec a specific errMessage", () => {
    service = TestBed.get(UNListService);
    service.isTooShort("Ace");
    expect(service.message).toBe("Ton identifiant est trop court!");
  });

  // Test validateName
  it("should return true if a valid username is used", () => {
    service = TestBed.get(UNListService);
    spyOn<UNListService>(service, "sendUserRequest").and.callFake(() => {
      service.response = { available: true, username: "SaraBellum" };
      return { available: true, username: "SaraBellum" };
    });
    service.validateName("SaraBellum").then((response: boolean) => {
      expect(response).toBe(true);
      console.log(service.response);
    });
  });

  it("should return false if a invalid username is used + have an errorMessage(already used)", () => {
    service = TestBed.get(UNListService);
    spyOn<UNListService>(service, "sendUserRequest").and.callFake(() => {
      service.response = { available: false, username: "SaraBellum" };
      return { available: false, username: "SaraBellum" };
    });
    service.validateName("SaraBellum").then((response: boolean) => {
      expect(response).toBe(false);
      expect(service.message).toBe("Cet identifiant est deja pris! Essaie un nouvel identifiant");
    });
  });

  it("should return false if a invalid username is used (too short)", () => {
    service = TestBed.get(UNListService);
    spyOn<UNListService>(service, "sendUserRequest").and.callFake(() => {
      service.response = { available: false, username: "Sar" };
      return { available: false, username: "Sar" };
    });
    service.validateName("Sar").then((response: boolean) => {
      expect(response).toBe(false);
    });
  });

  it("should return false if a invalid username is used (not alphanumeric)", () => {
    service = TestBed.get(UNListService);
    spyOn<UNListService>(service, "sendUserRequest").and.callFake(() => {
      service.response = { available: false, username: "SaraBellum!" };
      return { available: false, username: "SaraBellum!" };
    });
    service.validateName("SaraBellum!").then((response: boolean) => {
      expect(response).toBe(false);
    });
  });
});
