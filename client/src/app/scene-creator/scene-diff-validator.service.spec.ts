import {TestBed} from "@angular/core/testing";
import {Observable, Subject} from "rxjs";
import {createWebsocketMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {getOrigin3D} from "../../../../common/model/point";
import {IFreeGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";
import {SceneDiffValidatorService} from "./scene-diff-validator.service";

describe("A service to validate 3D differences", () => {

  const successSubject: Subject<WebsocketMessage<IFreeGameInteractionResponse>> = new Subject();
  const errorSubject: Subject<WebsocketMessage<string>> = new Subject();

  class MockSocketService {
    public onEvent(event: SocketEvent): Observable<WebsocketMessage> {
      if (event === SocketEvent.INTERACT) {
        return successSubject.asObservable();
      } else {
        return errorSubject.asObservable();
      }
    }

    public send(event: SocketEvent, message: WebsocketMessage): boolean {
      return true;
    }
  }

  let service: SceneDiffValidatorService;
  const mockSocketService: MockSocketService = new MockSocketService();
  let mockSocketServiceSpy: jasmine.Spy;

  beforeEach(() => {
    return TestBed.configureTestingModule(
      {
        providers: [
          SceneDiffValidatorService,
          {provide: SocketService, useValue: mockSocketService},
        ],
      });
  });

  beforeEach(() => {
    service = TestBed.get(SceneDiffValidatorService);
    mockSocketServiceSpy = spyOn(mockSocketService, "send");
  });

  it("should create", () => {
    expect(service).toBeDefined();
  });

  it("should send an ineraction message to server", () => {
    service.validateDiffObject(getOrigin3D());
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();
  });

  it("should reject with an NoDifferenceAtPointError if the difference was already found", (done) => {
    service.registerDifferenceErrorCallback((error: Error) => {
      expect(error.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      done();
    });
    errorSubject.next(createWebsocketMessage(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();
  });

  it("should reject with an NoDifferenceAtPointError if there's no differences", (done) => {
    service.registerDifferenceErrorCallback((error: Error) => {
      expect(error.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      done();
    });
    errorSubject.next(createWebsocketMessage(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();
  });

  it("should reject with an AbstractServiceError if there's an unexpected error", (done) => {
    service.registerDifferenceErrorCallback((error: Error) => {
      expect(error.message).toEqual(new AbstractServiceError("Error").message);
      done();
    });
    errorSubject.next(createWebsocketMessage("Error"));
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();
  });

  afterEach(() => {
    mockSocketServiceSpy.calls.reset();
    service["successSubscription"].unsubscribe();
    service["errorSubscription"].unsubscribe();
  });
});
