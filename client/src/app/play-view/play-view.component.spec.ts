import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, } from "@angular/router";
import {CompteurDiffComponent} from "../compteur-diff/compteur-diff.component";
import { PlayViewComponent } from "./play-view.component";

describe("PlayViewComponent", () => {
  let component: PlayViewComponent;
  let fixture: ComponentFixture<PlayViewComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ PlayViewComponent, CompteurDiffComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {queryParams: {
            subscribe: (fn: (queryParams: string ) => void) => fn(
              // pour donner un "parametre" au subscribe
              "play-view?gameName=numbers"
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
