import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router} from "@angular/router";
import {CompteurDiffComponent} from "../compteur-diff/compteur-diff.component";
import { PlayViewComponent } from "./play-view.component";

describe("PlayViewComponent", () => {
  let component: PlayViewComponent;
  let fixture: ComponentFixture<PlayViewComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ PlayViewComponent, CompteurDiffComponent ],
      providers: [
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }, },
        {
          provide: ActivatedRoute,
          useValue: {queryParams: {
            subscribe: (fn: (queryParams: string ) => void) => fn(
              // tslint:disable-next-line:max-line-length
              "play-view?gameName=numbers&originalImage=https:%2F%2Fi.imgur.com%2Fvc0cKmB.png&modifiedImage=https:%2F%2Fi.imgur.com%2F5lei5Nb.png"
              ,
            ),
          },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
