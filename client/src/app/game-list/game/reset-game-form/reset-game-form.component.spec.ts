import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ResetGameFormComponent } from "./reset-game-form.component";

describe("ReinitialiserFormComponent", () => {
  let component: ResetGameFormComponent;
  let fixture: ComponentFixture<ResetGameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetGameFormComponent ],
      imports: [ MatDialogModule],
      providers: [{ provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
                  {provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}, } ],
    });
    fixture = TestBed.createComponent(ResetGameFormComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
