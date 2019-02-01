import { HttpClientModule } from "@angular/common/http";
import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { UNListService } from "./username.service";
import { WindowEventHandlerDirective } from "./window-event-handler.directive";

@Component({
  template: `<input type="text" appUnloadEvent>`,
})
class TestWindowEventHandlerComponent {
}

describe("Directive: WindowEventHandler", () => {
  // let component: TestWindowEventHandler;
  let fixture: ComponentFixture<TestWindowEventHandlerComponent>;
  let inputElement: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestWindowEventHandlerComponent, WindowEventHandlerDirective],
      providers: [UNListService],
      imports: [HttpClientModule],
    });
    fixture = TestBed.createComponent(TestWindowEventHandlerComponent);
    // component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css("input"));
  });

  it("beforeUnload over input, test with emptyString as username in UNListService", () => {
    UNListService.username = "";
    inputElement.triggerEventHandler("window:beforeunload", null);
    expect(WindowEventHandlerDirective.beforeUnloadMessage).toBe("empty username passed");
  });

  it("beforeUnload over input, test with username not empty in UNListService", () => {
    UNListService.username = "CoolFire43";
    inputElement.triggerEventHandler("window:beforeunload", null);
    expect(WindowEventHandlerDirective.beforeUnloadMessage).toBe("username released");
  });
});
