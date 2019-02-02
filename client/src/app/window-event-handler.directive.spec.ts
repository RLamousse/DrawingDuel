import { TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import { WindowEventHandlerDirective } from "./window-event-handler.directive";
import { UNListService } from "./username.service";
import { HttpClientModule } from "@angular/common/http";

@Component({
  template: `<input type="text" id="input" appUnloadEvent>`
})
class TestWindowEventHandlerComponent {
}

describe("Directive: WindowEventHandler", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestWindowEventHandlerComponent, WindowEventHandlerDirective],
      providers: [UNListService],
      imports: [HttpClientModule]
    });
  });

});
