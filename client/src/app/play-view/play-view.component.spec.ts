import {ComponentFixture, TestBed} from "@angular/core/testing";
import { MatListModule } from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {DiffCounterComponent} from "../diff-counter/diff-counter.component";
import { MessageBoxComponent } from "../message-box/message-box.component";
import {SimpleGameCanvasComponent} from "../simple-game/simple-game-canvas/simple-game-canvas.component";
import {SimpleGameContainerComponent} from "../simple-game/simple-game-container/simple-game-container.component";
import { SocketService } from "../socket.service";
import {TimerComponent} from "../timer/timer.component";
import {PlayViewComponent} from "./play-view.component";

describe("PlayViewComponent", () => {
  let component: PlayViewComponent;
  let fixture: ComponentFixture<PlayViewComponent>;

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
          MatListModule,
        ],
        providers: [SocketService,
                    { provide: Router,
                      useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); },   },
                    {
          provide: ActivatedRoute,
          useValue: {queryParams: {
            subscribe: (fn: (queryParams: string ) => void) => fn(
              // tslint:disable-next-line:max-line-length
              "play-view?gameName=numbers&originalImage=https:%2F%2Fi.imgur.com%2Fvc0cKmB.png&modifiedImage=https:%2F%2Fi.imgur.com%2F5lei5Nb.png"
              ,
            ),
        }, } , },

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
