import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { UNListService } from "../username.service";
import { InitialViewComponent } from "./initial-view.component";

describe("Initial View Component tests", () => {
  let component: InitialViewComponent;
  let fixture: ComponentFixture<InitialViewComponent>;
  let unListSpyService: jasmine.SpyObj<UNListService>;

  beforeEach(async(() => {
    unListSpyService = jasmine.createSpyObj("UNListService", ["checkAvailability"]);
    TestBed.configureTestingModule({
      declarations: [InitialViewComponent],
      imports: [FormsModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: UNListService, useValue: unListSpyService },
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
        ],
    });
    fixture = TestBed.createComponent(InitialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test updateUsername

  it("should not update username (service and component) if validate name return false", async () => {
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
});
