import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { GameListComponent } from "./game-list.component";
import { GameService } from "../game.service";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let gameServiceSpy: jasmine.SpyObj<GameService>;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach((async () => {
    gameServiceSpy = jasmine.createSpyObj("GameService", ["getGames", "convertScoresObject"]);
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: GameService, useValue: gameServiceSpy }],
    });
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    gameServiceSpy.convertScoresObject.and.callFake(() => {
      return true;
    });
  });

});
