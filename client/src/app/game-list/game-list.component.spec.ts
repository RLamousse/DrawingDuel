import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GameService } from "../game.service";
import { GameListComponent } from "./game-list.component";
import { FormsModule } from "@angular/forms";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  class MockGameService {
    public getGames():boolean {
      return true;
    }
  }

  const mockedGameService: MockGameService = new MockGameService();

  beforeEach((async () => {
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
      imports: [HttpClientModule, FormsModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: GameService, useValue: mockedGameService} ],
    });
   // gameServiceSpy.getGames.and.callFake(()=>{console.log("bobby");});
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
