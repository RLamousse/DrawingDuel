import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { GameListComponent } from "./game-list.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Game } from "../../../../common/Object/game";
describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  const mockGameList: Game[] = [{
    gameName: "mockedName",
    originalImage: "oriName",
    modifiedImage: "modName",
    bestSoloTimes: [{ name: "mockedUser1", time: 25 }],
    bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
  }];

  beforeEach((async () => {
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test ConvertScoresObject
  it("should return a Game type Object", () => {
    expect(typeof (mockGameList)).toBe(typeof (component.convertScoresObject(mockGameList)));
  });
});
