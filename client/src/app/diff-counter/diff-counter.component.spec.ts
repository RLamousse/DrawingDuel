import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {OnlineType} from "../../../../common/model/game/game";
import {SceneDiffValidatorService} from "../scene-creator/scene-diff-validator.service";
import {SocketService} from "../socket.service";
import {DiffCounterComponent} from "./diff-counter.component";

describe("DiffCounterComponent", () => {
  let component: DiffCounterComponent;
  let fixture: ComponentFixture<DiffCounterComponent>;
  const countSubscription: Subject<boolean> = new Subject();

  class MockedSceneDiffValidatorService {
    public get foundDifferenceCount(): Observable<boolean> {
      return countSubscription.asObservable();
    }
  }

  const mockedSceneDiffValidatorService: MockedSceneDiffValidatorService = new MockedSceneDiffValidatorService();

  beforeEach(async(async () => {
    return TestBed.configureTestingModule(
      {
        declarations: [DiffCounterComponent, ],
        imports: [MatDialogModule, NoopAnimationsModule],
        providers: [
          {provide: MatDialogRef, useValue: {}},
          {provide: MAT_DIALOG_DATA, useValue: {}},
          {provide: SceneDiffValidatorService, useValue: mockedSceneDiffValidatorService},
          {
            provide: Router, useClass: class {
              public navigate: jasmine.Spy = jasmine.createSpy("navigate");
            },
          },
          SocketService,
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: {
                subscribe: (fn: (queryParams: object) => void) => fn(
                  {
                    onlineType: OnlineType.SOLO,
                  }),
              },
            },
          },
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffCounterComponent);
    component = fixture.componentInstance;
    component["openCongratulationDialog"] = () => {/**/
    };
    fixture.detectChanges();
  });

  it("should create", async () => {
    return expect(component).toBeTruthy();
  });

  it("should increment right diff counter", async () => {
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    expect(component["diffNumber"]).toBeGreaterThan(0);
    expect(component["advDiffNumber"]).toEqual(0);
    component["countDiff"](false);
    expect(component["advDiffNumber"]).toBeGreaterThan(0);
  });

  it("should declare player is winner if he has bigger diff count", async () => {
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](false);
    expect(component["isWinner"]()).toBeTruthy();
  });

  it("should have only the winner post time", async () => {
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](true);
    component["countDiff"](false);
    let bool: boolean = false;
    component["postTime"] = () => bool = true;
    component["endGame"]();
    expect(bool).toBeTruthy();
  });

  it("should not let looser post time", async () => {
    component["countDiff"](false);
    component["countDiff"](false);
    component["countDiff"](false);
    component["countDiff"](false);
    component["endGame"]();
    // @ts-ignore
    const spy: jasmine.Spy = spyOn(component, "postTime");
    expect(spy).not.toHaveBeenCalled();
  });
});
