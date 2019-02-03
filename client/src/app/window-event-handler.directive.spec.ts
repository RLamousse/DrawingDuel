import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { UNListService } from "./username.service";
import { WindowEventHandlerDirective } from "./window-event-handler.directive";

@Component({
  template: `<input type="text" id="input" appUnloadEvent>`,
})
class TestWindowEventHandlerComponent {
}

describe("Directive: WindowEventHandler", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestWindowEventHandlerComponent, WindowEventHandlerDirective],
      providers: [UNListService],
      imports: [HttpClientModule],
    });
  });

});
