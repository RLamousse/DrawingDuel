// Just so ts lint will leave my code without waves under every expect it meets
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatListModule } from "@angular/material";
import {createWebsocketMessage} from "../../../../common/communication/messages/message";
import { SocketService } from "../socket.service";
import { MessageBoxComponent } from "./message-box.component";

describe("MessageBoxComponent", () => {
  let component: MessageBoxComponent;
  let fixture: ComponentFixture<MessageBoxComponent>;

  beforeEach(async(async () => {
    return TestBed.configureTestingModule({
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
    // Accessing private members
    // tslint:disable-next-line: no-any
    (component as any).handleChatEvent(createWebsocketMessage("BoiChadddd"));

    // We are accessing private members
    // tslint:disable-next-line: no-any
    return expect((component as any).messages.length).toBeGreaterThan(0);
  });
});
