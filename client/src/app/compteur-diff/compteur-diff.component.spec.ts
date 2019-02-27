import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompteurDiffComponent } from "./compteur-diff.component";

describe("CompteurDiffComponent", () => {
  let component: CompteurDiffComponent;
  let fixture: ComponentFixture<CompteurDiffComponent>;

  beforeEach(async(async () => {
    return TestBed.configureTestingModule({
      declarations: [ CompteurDiffComponent, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteurDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    return expect(component).toBeTruthy();
  });
});
