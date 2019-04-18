import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
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
        imports: [MatDialogModule],
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
    fixture.detectChanges();
  });

  it("should create", async () => {
    return expect(component).toBeTruthy();
  });
});
