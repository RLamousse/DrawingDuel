import { HttpClientModule } from "@angular/common/http";
import {CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { UserValidationMessage } from "../../../../common/communication/UserValidationMessage";
import { UNListService } from "../username.service";
import { VueComponent } from "./vue.component";
import createSpyObj = jasmine.createSpyObj;

// IMPORTANT : Since some tests add usernames to the database, please restart the database before launching tests.
describe("VueComponent", () => {
  let component: VueComponent;
  let fixture: ComponentFixture<VueComponent>;
  let unListSpy: jasmine.SpyObj<UNListService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VueComponent],
      imports: [FormsModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [UNListService],
    });
    unListSpy = jasmine.createSpyObj("UNListService", ["sendUserRequest", "sendReleaseRequest"]);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    unListSpy = jasmine.createSpyObj("UNListService", ["sendUserRequest", "sendReleaseRequest"]);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test updateUsername

  it("should not update if not valid username", () => {
    component.username = "perry24";
    component.newUsername = "nop";
    component.updateUsername();
    expect(component.username).toBe("perry24");
  });
});
