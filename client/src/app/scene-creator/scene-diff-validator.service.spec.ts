import {TestBed} from "@angular/core/testing";
import {Observable, Subject} from "rxjs";
import {createWebsocketMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {DEFAULT_OBJECT, IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {getOrigin3D} from "../../../../common/model/point";
import {IFreeGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";
import {SceneDiffValidator} from "./scene-diff-validator.service";

describe("A service to validate 3D differences", () => {

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

  let service: SceneDiffValidator;
  const successSubject: Subject<WebsocketMessage<IFreeGameInteractionResponse>> = new Subject();
  const errorSubject: Subject<WebsocketMessage<string>> = new Subject();
  const mockSocketService: MockSocketService = new MockSocketService();

  let mockSocketServiceSpy: jasmine.Spy;

  beforeEach(() => {
    return TestBed.configureTestingModule(
      {
        providers: [
          SceneDiffValidator,
          {provide: SocketService, useValue: mockSocketService},
        ],
      });
  });

  beforeEach(() => {
    service = TestBed.get(SceneDiffValidator);
    mockSocketServiceSpy = spyOn(mockSocketService, "send");
  });

  it("should create", () => {
    expect(service).toBeDefined();
  });

  it("should validate a difference", async () => {
    // @ts-ignore Spy on private method
    spyOn(service, "interactWithRoom");
    const successMessage: WebsocketMessage<IFreeGameInteractionResponse> = createWebsocketMessage(
      {
        object: DEFAULT_OBJECT,
        initiatedBy: "Quasimodo",
      },
    );
    const promise: Promise<IJson3DObject> = service.validateDiffObject(getOrigin3D());
    successSubject.next(successMessage);
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();

    return promise
      .then((value: IJson3DObject) => {
        expect(service["interactWithRoom"]).toHaveBeenCalled();
        expect(value).toEqual(DEFAULT_OBJECT);
      })
      .catch(() => fail());
  });

  it("should reject with an NoDifferenceAtPointError if the difference was already found", () => {
    // @ts-ignore Spy on private method
    spyOn(service, "interactWithRoom");
    const promise: Promise<IJson3DObject> = service.validateDiffObject(getOrigin3D());
    errorSubject.next(createWebsocketMessage(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();

    return promise
      .then(() => fail())
      .catch((error: Error) => {
        expect(error.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should reject with an NoDifferenceAtPointError if there's no differences", () => {
    // @ts-ignore Spy on private method
    spyOn(service, "interactWithRoom");
    const promise: Promise<IJson3DObject> = service.validateDiffObject(getOrigin3D());
    errorSubject.next(createWebsocketMessage(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();

    return promise
      .then(() => fail())
      .catch((error: Error) => {
        expect(error.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should reject with an AbstractServiceError if there's an unexpected error", () => {
    // @ts-ignore Spy on private method
    spyOn(service, "interactWithRoom");
    const promise: Promise<IJson3DObject> = service.validateDiffObject(getOrigin3D());
    errorSubject.next(createWebsocketMessage("Error"));
    expect(mockSocketServiceSpy.calls.any()).toBeDefined();

    return promise
      .then(() => fail())
      .catch((error: Error) => {
        expect(error.message).toEqual(new AbstractServiceError("Error").message);
      });
  });

  afterEach(() => {
    mockSocketServiceSpy.calls.reset();
  });
});
