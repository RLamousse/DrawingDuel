import {ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {createWebsocketMessage} from "../../../../common/communication/messages/message";
import {RoomService} from "../room.service";
import {SocketService} from "../socket.service";
import { AwaitViewComponent } from "./await-view.component";
import {GameDeletionNotifComponent} from "./game-deletion-notif/game-deletion-notif.component";

describe("AwaitViewComponent", () => {
  let component: AwaitViewComponent;
  let fixture: ComponentFixture<AwaitViewComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule(
      {
        declarations: [
          AwaitViewComponent,
          GameDeletionNotifComponent,
        ],
        imports: [MatDialogModule],
        providers: [
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }, },
        {
          provide: ActivatedRoute,
          useValue: {queryParams: {
            subscribe: (fn: (queryParams: string ) => void) => fn(
              // tslint:disable-next-line:max-line-length
              "play-view?gameName=numbers&originalImage=https:%2F%2Fi.imgur.com%2Fvc0cKmB.png&modifiedImage=https:%2F%2Fi.imgur.com%2F5lei5Nb.png"
              ,
            ),
        }, } , },
        SocketService,
        RoomService,
      ],
    });
    done();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should notify this game deletion", () => {
    spyOn(component["dialog"], "open");
    component["gameName"] = "numbers";
    component["notifyGameDeletion"](createWebsocketMessage<[string, boolean]>(["numbers", true]));
    expect(component["dialog"].open).toHaveBeenCalled();
  });

  it("should not notify of other game deletion", () => {
    spyOn(component["dialog"], "open");
    component["notifyGameDeletion"](createWebsocketMessage<[string, boolean]>(["maxime", false]));
    expect(component["dialog"].open).not.toHaveBeenCalled();
  });

  it("should have a on game start subscription", () => {
    expect(component["gameStartSub"].closed).toBeFalsy();
  });
});

afterEach(() => {
  TestBed.resetTestingModule();
});
