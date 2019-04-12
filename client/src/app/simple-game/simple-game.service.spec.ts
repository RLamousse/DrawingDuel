import {TestBed} from "@angular/core/testing";
import {Observable, Subject, Subscription} from "rxjs";
import {getOrigin} from "../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";
import {SimpleGameService} from "./simple-game.service";

const fakeSuccessCallback: (message: ISimpleGameInteractionResponse | string) => void = (message: ISimpleGameInteractionResponse) => {
  //
};

const fakeErrorCallback: (message: string) => void = (message: string) => {
  //
};

describe("SimpleGameService", () => {
  let service: SimpleGameService;

  TestBed.configureTestingModule({
    providers: [SocketService],
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService],
    });

    return TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    service = TestBed.get(SimpleGameService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should update the difference count", async () => {
    const spy: jasmine.Spy = spyOn(service["_differenceCountSubject"], "next");
    service.updateCounter();
    expect(spy).toHaveBeenCalled();
  });

  it("should return subscription to validation success callback and be called", async () => {
    const fake: jasmine.Spy = jasmine.createSpy("fakeSuccessCallback", fakeSuccessCallback);
    const sub: Subscription = service.registerDifferenceSuccessCallback(fake);
    expect(sub).toBeDefined();
  });

  it("should return subscription to validation error callback and be called", async () => {
    const fake: jasmine.Spy = jasmine.createSpy("fakeErrorCallback", fakeErrorCallback);
    const sub: Subscription = service.registerDifferenceErrorCallback(fake);
    expect(sub).toBeDefined();
  });

  it("should reset the Subject", async () => {
    const old: Subject<number> = service["_differenceCountSubject"];
    old.asObservable().subscribe(() => {
      // Dummy subscriber
    });
    service.resetDifferenceCount();
    expect(old).not.toEqual(service["_differenceCountSubject"]);
    old.unsubscribe(); // Cleanup
  });

  it("should send the validation request", async () => {
    const spy: jasmine.Spy = spyOn(service["socket"], "send");
    service.validateDifferenceAtPoint(getOrigin());
    expect(spy).toHaveBeenCalled();
  });

  it("should return a valid observable", async () => {
    const obs: Observable<number> = service.foundDifferencesCount;
    expect(obs).toBeDefined();
  });
});
