import { ComponentFixture, TestBed } from "@angular/core/testing";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable } from "rxjs";
import { PlayViewComponent } from "./play-view.component";

describe("PlayViewComponent", () => {
  let component: PlayViewComponent;
  let fixture: ComponentFixture<PlayViewComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ PlayViewComponent ],
      providers: [
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }, },
        {
          provide: ActivatedRoute,
          useValue: {params: {
            subscribe: (fn: (value: Params) => void) => fn({
                tab: 0,
            }),
        }, } , },

      ],
    });
    done();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
