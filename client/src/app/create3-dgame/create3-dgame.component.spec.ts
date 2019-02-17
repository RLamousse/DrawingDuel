import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatDialogRef,
  MatFormFieldModule, MatInputModule, MatSliderModule,
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "hammerjs";
import { FormPostService } from "../form-post.service";
import { Create3DGameComponent } from "./create3-dgame.component";

describe("Create3DGameComponent", () => {
  let component: Create3DGameComponent;
  let fixture: ComponentFixture<Create3DGameComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [Create3DGameComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSliderModule,
        MatCheckboxModule,
      ],
      providers: [FormPostService, { provide: MatDialogRef, useValue: {} }],
    });
    done();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Create3DGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should prevent submit if all fields are missing", async () => {
    expect(component.formDoc.valid && component.checboxesValid()).toBeFalsy();
  });

  it("should prevent submit if at least one field is missing", async () => {
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("12345");
    expect(component.formDoc.valid && component.checboxesValid()).toBeFalsy();
  });

  it("should have an error if name is to short", async () => {
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("1234");
    expect(name.valid).toBeFalsy(`${name.value} wasn't falsy`);
  });

  it("should have an error if no name specified", async () => {
    const name: AbstractControl = component.formDoc.controls["name"];
    expect(name.valid).toBeFalsy(`${name.value} wasn't falsy`);
  });

  it("should have an error if no checkboxes are checked", async () => {
    expect(component.checboxesValid()).toBeFalsy();
  });

  it("should have an error if one set of checkboxes is empty", async () => {
    component.checkboxes.modificationTypes.add("dummy");
    expect(component.checboxesValid()).toBeFalsy();
  });

  it("should have an error if one set of checkboxes is empty", async () => {
    component.checkboxes.modificationTypes.add("dummy");
    component.checkboxes.objectTypes.add("dummy");
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("12345");
    expect(component.formDoc.valid && component.checboxesValid()).toBeTruthy();
  });
});
