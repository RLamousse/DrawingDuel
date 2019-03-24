import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ReinitialiserFormComponent } from "./reinitialiser-form.component";

describe("ReinitialiserFormComponent", () => {
  let component: ReinitialiserFormComponent;
  let fixture: ComponentFixture<ReinitialiserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReinitialiserFormComponent ],
      imports: [ MatDialogModule],
      providers: [{ provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
                  {provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}, } ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinitialiserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
