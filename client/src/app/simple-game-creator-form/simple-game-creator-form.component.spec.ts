import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from "@angular/material";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { BITMAP_HEADER_24BPP, HEADER_SIZE_BYTES } from "../../../../common/image/bitmap/bitmap-utils";
import FileValidator from "../file.validator";
import { FormPostService } from "../form-post.service";
import { SimpleGameCreatorFormComponent } from "./simple-game-creator-form.component";

describe("SimpleGameCreatorFormComponent", () => {
  let component: SimpleGameCreatorFormComponent;
  let fixture: ComponentFixture<SimpleGameCreatorFormComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [SimpleGameCreatorFormComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MaterialFileInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [FormPostService, {provide: MatDialogRef, useValue: {}}],
    });
    done();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGameCreatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should prevent submit if all fields are missing", async () => {
    expect(component.formDoc.valid).toBeFalsy();
  });

  it("should prevent submit if at least one field is missing", async () => {
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("12345");
    expect(component.formDoc.valid).toBeFalsy();
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

  it("should have an error if no file specified", async () => {
    const originalImage: AbstractControl = component.formDoc.controls["originalImage"];
    expect(originalImage.valid).toBeFalsy();
  });

  it("should have an error if the file isn't a bmp", async () => {
    const originalImage: AbstractControl = component.formDoc.controls["originalImage"];
    originalImage.setValue({
      files: [new File([""], "maxime", {type: "text/html"})],
    });
    expect(originalImage.valid).toBeFalsy();
  });

  it("should have an error if the file is too big for upload", async () => {
    const originalImage: AbstractControl = component.formDoc.controls["originalImage"];
    originalImage.setValue({
      files: [new File(new Array(FileValidator.MAX_IMAGE_SIZE + 1).fill(0), "maxime.bmp", {type: "image/bmp"})],
    });
    expect(originalImage.valid).toBeFalsy();
  });

  it("should have an error if the file isn't the right dimensions", async () => {
    // tslint:disable-next-line:no-any
    const fakeHeader: any[] = new Array(HEADER_SIZE_BYTES);
    fakeHeader.unshift(...BITMAP_HEADER_24BPP);
    const originalImage: AbstractControl = component.formDoc.controls["originalImage"];
    originalImage.setValue({
      files: [new File(fakeHeader, "maxime.bmp", {type: "image/bmp"})],
    });
    expect(originalImage.valid).toBeFalsy();
  });

  it("should let submit if everything ok", async () => {
    const originalImage: AbstractControl = component.formDoc.controls["originalImage"];
    const modifiedImage: AbstractControl = component.formDoc.controls["modifiedImage"];
    originalImage.clearAsyncValidators();
    modifiedImage.clearAsyncValidators();
    originalImage.setValue({
      files: [new File(new Array(FileValidator.MAX_IMAGE_SIZE - 1).fill(0), "maxime.bmp", {type: "image/bmp"})],
    });
    modifiedImage.setValue({
      files: [new File(new Array(FileValidator.MAX_IMAGE_SIZE - 1).fill(0), "maxime.bmp", {type: "image/bmp"})],
    });
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("12345");
    expect(component.formDoc.valid).toBeTruthy();
  });
});
