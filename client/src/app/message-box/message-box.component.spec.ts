// tslint:disable: no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatListModule } from "@angular/material";
import {SocketEvent} from "../../../../common/communication/socket-events";
import { SocketService } from "../socket.service";
import { MessageBoxComponent } from "./message-box.component";

describe("MessageBoxComponent", () => {
  let component: MessageBoxComponent;
  let fixture: ComponentFixture<MessageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageBoxComponent ],
      providers: [
        SocketService,
      ],
      imports: [
        MatListModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should receive the messages and add them", async () => {
    // tslint:disable-next-line: no-any
    (component as any).handleChatEvent({
      title: SocketEvent.USER_CONNECTION,
      body: "BoiChadddd",
    });

    // We are accessing private members
    // tslint:disable-next-line: no-any
    return expect((component as any).messages.length).toBeGreaterThan(0);
  });
});
