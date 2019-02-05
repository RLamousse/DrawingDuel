import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { GameListComponent } from "./game-list.component";

describe("GameListComponent", () => {
  let component: GameListComponent;

  beforeEach((async () => {
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
