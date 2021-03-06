import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

import {KickDialogComponent} from "./kick-dialog.component";

describe("KickDialogComponent", () => {
  let component: KickDialogComponent;
  let fixture: ComponentFixture<KickDialogComponent>;

  beforeEach(async(async () => {
    return TestBed.configureTestingModule(
      {
        declarations: [KickDialogComponent],
        providers: [
          {provide: MatDialogRef, useValue: {}},
          {provide: MAT_DIALOG_DATA, useValue: {}},
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
