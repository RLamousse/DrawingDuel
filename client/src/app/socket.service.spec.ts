// tslint:disable: no-floating-promises
import {TestBed} from "@angular/core/testing";
import {Observable} from "rxjs";
import {WebsocketMessage} from "../../../common/communication/messages/message";
import {SocketEvent} from "../../../common/communication/socket-events";
import {SocketService} from "./socket.service";

describe("Socket service", () => {

  let socketSpy: jasmine.SpyObj<SocketService>;
  beforeEach(() => {
    socketSpy = jasmine.createSpyObj<SocketService>(["isSocketConnected", "send", "onMessage", "onEvent"]);
    TestBed.configureTestingModule({
      providers: [SocketService],
    });
  });

  it("should be created", async () => {
    return expect(socketSpy).toBeTruthy();
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

  it("should not be connected without a server", async () => {
    const service: SocketService = TestBed.get(SocketService);

    return expect(service.isSocketConnected()).toBeFalsy();
  });

  it("should fail to send without a server connection", async () => {
    const service: SocketService = TestBed.get(SocketService);
    service.isSocketConnected = () => false;

    return expect(service.send(
      SocketEvent.DUMMY,
      {
        title: SocketEvent.DUMMY,
        body: "Thank you Kanye, very cool 👍",
      },
    )).toBeFalsy();
  });

  it("should succeed to send with a server connection", async () => {
    const service: SocketService = TestBed.get(SocketService);
    service.isSocketConnected = () => true;

    return expect(service.send(
      SocketEvent.DUMMY,
      {
        title: SocketEvent.DUMMY,
        body: "Thank you Kanye, very cool 👍",
      },
    )).toBeTruthy();
  });

  it("should emit the right message", async () => {
    const service: SocketService = TestBed.get(SocketService);
    service.isSocketConnected = () => true;
    let called: boolean = false;
    let e: SocketEvent = SocketEvent.WELCOME;
    let m: WebsocketMessage = {
      body: "",
      title: SocketEvent.WELCOME,
    };
    // We are accessing a private member
    // tslint:disable-next-line: no-any
    (service as any).socket = {
      emit: (event: SocketEvent, message: WebsocketMessage) => {
        called = true;
        e = event;
        m = message;
      },
    };
    service.send(SocketEvent.DUMMY, {title: SocketEvent.DUMMY, body: "test"});
    expect(called).toBeTruthy();
    expect(e).toEqual(SocketEvent.DUMMY);
    expect(m.body).toEqual("test");
  });
});
