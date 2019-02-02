import { HttpClientModule } from "@angular/common/http";
import {CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
<<<<<<< HEAD
//import { UserValidationMessage } from "../../../../common/communication/UserValidationMessage";
=======
<<<<<<< HEAD
import {CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { UNListService } from "../username.service";
import { HttpClientModule } from "@angular/common/http";
=======
import { UserValidationMessage } from "../../../../common/communication/UserValidationMessage";
>>>>>>> 9af4a71d2e2131c7ec972d85b053224cfd2496b8
import { UNListService } from "../username.service";
import { VueComponent } from "./vue.component";
import createSpyObj = jasmine.createSpyObj;
>>>>>>> 81926880c5a48c31c774dbf2849580800b8a927e

// IMPORTANT : Since some tests add usernames to the database, please restart the database before launching tests.
describe("VueComponent", () => {
  let component: VueComponent;
  let fixture: ComponentFixture<VueComponent>;
<<<<<<< HEAD
  //let unListSpy: jasmine.SpyObj<UNListService>;
=======
  let unListSpyService: jasmine.SpyObj<UNListService>;
>>>>>>> 9af4a71d2e2131c7ec972d85b053224cfd2496b8

  beforeEach(async(() => {
    unListSpyService = jasmine.createSpyObj("UNListService", ["validateName"]);
    TestBed.configureTestingModule({
      declarations: [VueComponent],
      imports: [FormsModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
<<<<<<< HEAD
      providers: [{ provide: UNListService, useValue: unListSpyService }],
=======
      providers: [UNListService],
>>>>>>> 81926880c5a48c31c774dbf2849580800b8a927e
    });
<<<<<<< HEAD
    //unListSpy = jasmine.createSpyObj("UNListService", ["sendUserRequest", "sendReleaseRequest"]);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //unListSpy = jasmine.createSpyObj("UNListService", ["sendUserRequest", "sendReleaseRequest"]);
=======
    fixture = TestBed.createComponent(VueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
>>>>>>> 9af4a71d2e2131c7ec972d85b053224cfd2496b8
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test updateUsername

  it("should not update username (service and component) if validate name return false", () => {
    component.username = "perry24";
    UNListService.username = "perry24";
    component.newUsername = "nop";
    unListSpyService.validateName.and.callFake(() => { return false });
    component.updateUsername().then((response: boolean) => {
      expect(component.username).toBe("perry24");
      expect(UNListService.username).toBe("perry24");
      expect(response).toBe(false);
    });
  });

  it("should have an error message if validateName return false", () => {
    component.username = "phineas";
    component.newUsername = "123";
    component.userService.message = "error message send";
    unListSpyService.validateName.and.callFake(() => { return false });
    component.updateUsername().then((response: boolean) => {
      expect(component.errorMessage.length).not.toEqual(0);
      expect(response).toBe(false);
    });
  });

  it("should update username (service and component) if a valid one is enter", () => {
    component.username = "ferb123";
    unListSpyService.username = "ferb123";
    component.newUsername = "Candice";
    unListSpyService.validateName.and.callFake(() => { return true });
    component.updateUsername().then((response: boolean) => {
      expect(component.username).toBe("Candice");
      expect(UNListService.username).toBe("Candice");
      expect(response).toBe(true);
    });
  });
});
