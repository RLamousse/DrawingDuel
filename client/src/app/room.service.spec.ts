import { TestBed } from "@angular/core/testing";

import {SocketService} from "./socket.service";
import { RoomService } from "./room.service";

describe("RoomService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SocketService,
    ],
  }));

  it("should be created", () => {
    const service: RoomService = TestBed.get(RoomService);
    expect(service).toBeTruthy();
  });
});
