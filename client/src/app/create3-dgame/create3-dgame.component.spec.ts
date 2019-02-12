import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material";
import { Create3DGameComponent } from "./create3-dgame.component";

describe("Create3DGameComponent", () => {
  let component: Create3DGameComponent;
  let fixture: ComponentFixture<Create3DGameComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ Create3DGameComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}}, {provide: MatDialogRef, useValue: {}}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Create3DGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
