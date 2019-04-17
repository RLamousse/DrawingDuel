import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {BACKGROUND_IMAGE_TEST} from "../../../../common/communication/routes";
import { UNListService } from "../username.service";
import { InitialViewComponent } from "./initial-view.component";
import {SocketService} from "../socket.service";

describe("Initial View Component tests", () => {
  let component: InitialViewComponent;
  let fixture: ComponentFixture<InitialViewComponent>;
  let unListSpyService: jasmine.SpyObj<UNListService>;

  // @ts-ignore
  let mockSocketService: SocketService = {send: null};

  const initComponent: () => void = (): void => {
    fixture = TestBed.createComponent(InitialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    unListSpyService = jasmine.createSpyObj("UNListService", ["checkAvailability"]);
    TestBed.configureTestingModule({
      declarations: [InitialViewComponent],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SocketService, useValue: mockSocketService },
        { provide: UNListService, useValue: unListSpyService },
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
        ],
    });
  }));

  it("should create", () => {
    UNListService.username = "";
    initComponent();
    expect(component).toBeTruthy();
  });

  // Test updateUsername

  it("should not update username (service and component) if validate name return false", async () => {
    UNListService.username = "";
    initComponent();
    component.username = "perry24";
    UNListService.username = "perry24";
    component.newUsername = "nop";
    component.updateUsername();
    // Here we want to test a private method since it is the callback
    // tslint:disable-next-line: no-any
    (component as any).handleUsernameAvailability(false);
    expect(component.username).toBe("perry24");
    expect(UNListService.username).toBe("perry24");
  });

  it("should have an error message if validateName return false", async () => {
    UNListService.username = "";
    initComponent();
    component.username = "phineas";
    component.newUsername = "123";
    component.userService.message = "error message send";
    component.updateUsername();
    // Here we want to test a private method since it is the callback
    // tslint:disable-next-line: no-any
    (component as any).handleUsernameAvailability(false);
    expect(component.errorMessage.length).not.toEqual(0);
  });

  it("should update username (service and component) if a valid one is enter", async () => {
    spyOn(mockSocketService, "send").and.callThrough();
    initComponent();
    component.username = "ferb123";
    unListSpyService.username = "ferb123";
    component.newUsername = "Candice";
    component.updateUsername();
    // Here we want to test a private method since it is the callback
    // tslint:disable-next-line: no-any
    (component as any).handleUsernameAvailability(true);
    expect(component.username).toBe("Candice");
    expect(UNListService.username).toBe("Candice");
  });

  it("should update the background when changeBackground() is called", () => {
    spyOn(mockSocketService, "send").and.callThrough();
    initComponent();
    expect(document.body.style.backgroundImage).toBe("");
    component["changeBackground"]();
    expect(document.body.style.backgroundImage).toBe("none");
    component["changeBackground"]();
    expect(document.body.style.backgroundImage).toBe(BACKGROUND_IMAGE_TEST);
  });

  it("should updates message and username according to username availability", () => {
    spyOn(mockSocketService, "send").and.callThrough();
    initComponent();
    component.newUsername = "tom";
    component["handleUsernameAvailability"](true).then().catch();
    expect(component.username).toBe("tom");
    component["handleUsernameAvailability"](false).then().catch();
    expect(component.errorMessage).toBe(unListSpyService.message);
  });

  it("should check if username is available when called", () => {
    spyOn(mockSocketService, "send").and.callThrough();
    initComponent();
    component.updateUsername();
    expect(unListSpyService.checkAvailability).toHaveBeenCalled();
  });
});
