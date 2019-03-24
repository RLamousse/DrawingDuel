import {ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "../socket.service";
import { AwaitViewComponent } from "./await-view.component";
import {GameDeletionNotifComponent} from "./game-deletion-notif/game-deletion-notif.component";

describe("AwaitViewComponent", () => {

describe('AwaitViewComponent', () => {
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
      ],
    });
    done();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
