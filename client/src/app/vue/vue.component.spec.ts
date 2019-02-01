import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { VueComponent } from "./vue.component";
import { FormsModule } from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { UserValidationMessage } from "../../../../common/communication/UserValidationMessage";
import { UNListService } from "../username.service";
import { HttpClientModule } from "@angular/common/http";

// IMPORTANT : Since some tests add usernames to the database, please restart the database before launching tests.
describe("VueComponent", () => {
  let component: VueComponent;
  let fixture: ComponentFixture<VueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VueComponent],
      imports: [FormsModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [UNListService],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // test isAlphanumeric()

  it("check if numbers and letters are alphanumeric", () => {
    expect(component.isAlphanumeric("AA55ss")).toBe(true);
  });

  it("checks if an non-alphanumeric chain makes it return false", () => {
    expect(component.isAlphanumeric("er-%:")).toBe(false);
  });

  // test validateName
  it("checks if the emtpy string is rejected", () => {
    component.validateName("").then((response: boolean) => { expect(response).toBe(false); });
  });

  it("checks if a too short string is rejected, only character", () => {
    component.validateName("Jo").then((response: boolean) => { expect(response).toBe(false); });
  });

  it("checks if a too short string is rejected, char and number", () => {
    component.validateName("Bo3").then((response: boolean) => { expect(response).toBe(false); });
  });

  it("checks if a too short string is rejected, only number", () => {
    component.validateName("123").then((response: boolean) => { expect(response).toBe(false); });
  });

  it("checks if an alphanumeric string from 4 to 11 caracters is accepted", () => {
    component.validateName("Darksolo4x").then((response: boolean) => { expect(response).toBe(true); });
  });

  it("checks if a chain from 4 to 11 caracters but not alphanumeric is rejected", () => {
    component.validateName("Dark*-!").then((response: boolean) => { expect(response).toBe(false); });
  });

  // test updateUsername
  it("checks if it overwrites username when a new valid one is entered", () => {
    component.username = "oldUsername";
    component.newUsername = "newUsername";
    component.updateUsername().then(() => { expect(component.username).toBe("newUsername"); });
  });

  it("checks if it does not overwrites a userName when a new non-valid one is entered, verification if not updated", () => {
    component.username = "oldUsername2";
    component.newUsername = "notValidUsername";
    component.updateUsername();
    expect(component.username).not.toBe("notValidUsername");
  });

  it("checks if it does not overwrites a userName when a new non-valid one is entered,verification if old one is still there", () => {
    component.username = "oldUsername2";
    component.newUsername = "notValidUsername";
    component.updateUsername();
    expect(component.username).toBe("oldUsername2");
  });

  // Test isAvailable
  it("checks if the entry username is available at first request", () => {
    component.isAvailable("patate").then((response: UserValidationMessage) =>
      expect(response.available).toBe(true)
    );
  });

  it("checks if the entry username is already taken at second request", () => {
    component.isAvailable("cooler").then();
    component.isAvailable("cooler").then((response: UserValidationMessage) =>
      expect(response.available).toBe(false)
    );
  });

  it("checks if the entry username is available at first request, alphanumeric", () => {
    component.isAvailable("patate123").then((response: UserValidationMessage) =>
      expect(response.available).toBe(true)
    );
  });

  it("checks if the entry username is already taken at second request, alphanumeric", () => {
    component.isAvailable("Dark123").then();
    component.isAvailable("Dark123").then((response: UserValidationMessage) =>
      expect(response.available).toBe(false)
      );
  });

  it("multiple username with different alphanumeric should pass", () => {
    component.isAvailable("slow123").then();
    component.isAvailable("123slow").then();
    component.isAvailable("sl123ow").then((response: UserValidationMessage) =>
      expect(response.available).toBe(true)
    );
  });

});
