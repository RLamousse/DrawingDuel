import {ComponentFixture, TestBed} from "@angular/core/testing";
import { MatListModule } from "@angular/material";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {DiffCounterComponent} from "../diff-counter/diff-counter.component";
import { MessageBoxComponent } from "../message-box/message-box.component";
import {SceneDiffValidator} from "../scene-creator/scene-diff-validator.service";
import {SimpleGameCanvasComponent} from "../simple-game/simple-game-canvas/simple-game-canvas.component";
import {SimpleGameContainerComponent} from "../simple-game/simple-game-container/simple-game-container.component";
import { SocketService } from "../socket.service";
import {TimerComponent} from "../timer/timer.component";
import {PlayViewComponent} from "./play-view.component";

describe("PlayViewComponent", () => {
  let component: PlayViewComponent;
  let fixture: ComponentFixture<PlayViewComponent>;

  // TestBed takes lot of space
  // tslint:disable-next-line:max-func-body-length
  beforeEach((done) => {
    TestBed.configureTestingModule(
      {
        declarations: [
          PlayViewComponent,
          DiffCounterComponent,
          SimpleGameContainerComponent,
          SimpleGameCanvasComponent,
          TimerComponent,
          MessageBoxComponent,
        ],
        imports: [
          MatListModule, MatDialogModule,
        ],
        providers: [
          SocketService,
          {
            provide: Router, useClass: class {
              public navigate: jasmine.Spy = jasmine.createSpy("navigate");
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: {
                subscribe: (fn: (queryParams: object) => void) => fn(
                  {
                    gameName: "numbers",
                    originalImage: "https:%2F%2Fi.imgur.com%2Fvc0cKmB.png",
                    modifiedImage: "https:%2F%2Fi.imgur.com%2F5lei5Nb.png",
                    gameType: "0",
                  }),
              },
            },
          },
          {provide: MatDialogRef, useValue: {}},
          {provide: MAT_DIALOG_DATA, useValue: {}},
          {provide: SceneDiffValidator, useValue: {}},

        ],
    });
    done();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
