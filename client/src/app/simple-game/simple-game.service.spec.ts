import {TestBed} from "@angular/core/testing";
import {Observable, Subject, Subscription} from "rxjs";
import {getOrigin} from "../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";
import {SimpleGameService} from "./simple-game.service";

const fakeCallback: (message: ISimpleGameInteractionResponse | string) => void = (message: ISimpleGameInteractionResponse | string) => {
  //
};

const clone = (obj: Object) => {
  if (obj == null || typeof obj !== "object") { return obj; }
  const copy: Object = obj.constructor();
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      // @ts-ignore
      copy[attr] = obj[attr]; }
  }

  return copy;
}

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

  it("should return subscription to validation callback and be called", async () => {
    const fake: jasmine.Spy = jasmine.createSpy("fakeCallback", fakeCallback);
    const sub: Subscription = service.registerDifferenceCallback(fake);
    expect(sub).toBeDefined();
  });

  it("should reset the Subject", async () => {
    const old: Subject<number> = clone(service["_differenceCountSubject"]) as Subject<number>;
    service.resetDifferenceCount();
    expect(old).not.toEqual(service["_differenceCountSubject"]);
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
