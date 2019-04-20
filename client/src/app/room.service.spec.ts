import {TestBed} from "@angular/core/testing";

import {Subject, Subscription} from "rxjs";
import {createWebsocketMessage} from "../../../common/communication/messages/message";
import {SocketEvent} from "../../../common/communication/socket-events";
import {OnlineType} from "../../../common/model/game/game";
import {IRoomInfo} from "../../../common/model/rooms/room-info";
import {RoomService} from "./room.service";
import {SocketService} from "./socket.service";

describe("RoomService", () => {

  const rooms: IRoomInfo[] = [{gameName: "max", vacant: true}];
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  beforeEach(() => {
    socketServiceSpy = jasmine.createSpyObj("SocketService", ["onEvent", "send"]);
    socketServiceSpy.onEvent.and.returnValue(new Subject());

    return TestBed.configureTestingModule(
      {
        providers: [
          {provide: SocketService, useValue: socketServiceSpy},
        ],
      });
  });

  it("should be created", () => {
    const service: RoomService = TestBed.get(RoomService);
    expect(service).toBeTruthy();
  });

  it("should add a subscriber to the rooms", () => {
    const service: RoomService = TestBed.get(RoomService);
    let becalled: boolean = false;
    const fakeCallback: (param: IRoomInfo[]) => void = (param: IRoomInfo[]) => {
      becalled = true;
    };
    service.subscribeToFetchRooms(fakeCallback);
    expect(service["roomWatchers"].length).toBeGreaterThan(0);
    expect(becalled).toBeTruthy();
  });

  it("should notify subscribers to the rooms", () => {
    const service: RoomService = TestBed.get(RoomService);
    let becalled: boolean = false;
    const fakeCallback: (param: IRoomInfo[]) => void = (param: IRoomInfo[]) => {
      becalled = true;
    };
    service.subscribeToFetchRooms(fakeCallback);
    service["handleFetchRooms"](createWebsocketMessage<IRoomInfo[]>(rooms));
    expect(service["_rooms"].length).toBeGreaterThan(0);
    expect(becalled).toBeTruthy();
  });

  it("should make the socket call to create the room", () => {
    const service: RoomService = TestBed.get(RoomService);
    // tslint:disable-next-line:no-floating-promises We just want to test the emit and not the response
    service.createRoom("max", OnlineType.MULTI);
    expect(socketServiceSpy.send).toHaveBeenCalled();
    expect(socketServiceSpy.send.calls.mostRecent().args[0]).toEqual(SocketEvent.CREATE);
  });

  it("should make the socket call to check-in the room", () => {
    const service: RoomService = TestBed.get(RoomService);
    // tslint:disable-next-line:no-floating-promises We just want to test the emit and not the response
    service.checkInRoom("max");
    expect(socketServiceSpy.send).toHaveBeenCalled();
    expect(socketServiceSpy.send.calls.mostRecent().args[0]).toEqual(SocketEvent.CHECK_IN);
  });

  it("should make the socket call to check-out the room", () => {
    const service: RoomService = TestBed.get(RoomService);
    service.checkOutRoom();
    expect(socketServiceSpy.send).toHaveBeenCalled();
    expect(socketServiceSpy.send.calls.mostRecent().args[0]).toEqual(SocketEvent.CHECK_OUT);
  });

  it("should make the socket call to signal ready to the room", () => {
    const service: RoomService = TestBed.get(RoomService);
    service.signalReady();
    expect(socketServiceSpy.send).toHaveBeenCalled();
    expect(socketServiceSpy.send.calls.mostRecent().args[0]).toEqual(SocketEvent.READY);
  });

  it("should return a subscription to game start", () => {
    const service: RoomService = TestBed.get(RoomService);
    const fakeCallback: () => void = () => {
      //
    };
    const sub: Subscription = service.subscribeToGameStart(fakeCallback);
    expect(socketServiceSpy.onEvent).toHaveBeenCalled();
    expect(socketServiceSpy.onEvent.calls.mostRecent().args[0]).toEqual(SocketEvent.READY);
    expect(sub.unsubscribe).toBeDefined();
  });

  it("should return a subscription to game start", () => {
    const service: RoomService = TestBed.get(RoomService);
    service.unsubscribe();
    expect(service["roomWatchers"].length).toEqual(0);
  });

  it("should unsubscribe on delete", () => {
    const service: RoomService = TestBed.get(RoomService);
    service.ngOnDestroy();
    expect(service["roomFetchSub"].closed).toBeTruthy();
    expect(service["roomPushSub"].closed).toBeTruthy();
  });
});
