import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";
import { SocketService } from "./socket.service";

describe("Socket service", () => {

  let socketSpy: jasmine.SpyObj<SocketService>;
  beforeEach(() => {
    socketSpy = jasmine.createSpyObj<SocketService>(["isSocketConnected", "send", "onMessage", "onEvent"]);
    TestBed.configureTestingModule({
      providers: [{ provide: SocketService, useValue: socketSpy }],
    });
  });

  it("should be created", () => {
    expect(socketSpy).toBeTruthy();
  });

  it("should get a message from an event", async (done) => {
    socketSpy.onEvent.and.callFake((event: SocketEvent): Observable<WebsocketMessage> => {
      return new Observable<WebsocketMessage>((observer) => {
        observer.next({
          title: SocketEvent.DUMMY,
          body: "Thank you Kanye, very cool 👍",
        });
      });
    });
    socketSpy.onEvent(SocketEvent.DUMMY).subscribe((message: WebsocketMessage) => {
      expect(message).toBeDefined();
      done();
    });
  });

  it("should get a message from a message", async (done) => {
    socketSpy.onMessage.and.callFake((): Observable<WebsocketMessage> => {
      return new Observable<WebsocketMessage>((observer) => {
        observer.next({
          title: SocketEvent.DUMMY,
          body: "Thank you Kanye, very cool 👍",
        });
      });
    });
    socketSpy.onMessage().subscribe((message: WebsocketMessage) => {
      expect(message).toBeDefined();
      done();
    });
  });

  it("should not be connected without a server", () => {
    expect(socketSpy.isSocketConnected()).toBeFalsy();
  });

  it("should fail to send without a server connection", () => {
    expect(socketSpy.send(
      SocketEvent.DUMMY,
      {
        title: SocketEvent.DUMMY,
        body: "Thank you Kanye, very cool 👍",
      },
    )).toBeFalsy();
  });
});
