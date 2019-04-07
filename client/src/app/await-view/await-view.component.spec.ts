import {ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {SocketService} from "../socket.service";
import { AwaitViewComponent } from "./await-view.component";
import {GameDeletionNotifComponent} from "./game-deletion-notif/game-deletion-notif.component";

describe("AwaitViewComponent", () => {
  let component: AwaitViewComponent;
  let fixture: ComponentFixture<AwaitViewComponent>;
  const MOCKSOKETMESSAGE: WebsocketMessage<[string, boolean]> = { title: SocketEvent.DELETE,
                                                                  body: ["mockname", true], };

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

  it("should call notifyGameDeletion", () => {
    // tslint:disable-next-line:no-any
    spyOn<any>(component, "notifyGameDeletion").and.callThrough();
    component["notifyGameDeletion"](MOCKSOKETMESSAGE);
    expect(component["notifyGameDeletion"]).toHaveBeenCalled();
  });

});

afterEach(() => {
  TestBed.resetTestingModule();
});
