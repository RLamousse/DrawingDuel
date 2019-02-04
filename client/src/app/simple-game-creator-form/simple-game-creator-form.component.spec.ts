import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { FormPostService } from "../form-post.service";
// import { FormGroup, FormControl } from "@angular/forms";
import { SimpleGameCreatorFormComponent } from "./simple-game-creator-form.component";

describe("SimpleGameCreatorFormComponent", () => {
  let component: SimpleGameCreatorFormComponent;
  let fixture: ComponentFixture<SimpleGameCreatorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
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
      declarations: [ SimpleGameCreatorFormComponent ],
      providers: [FormPostService],
    })
    .compileComponents();
  }));

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
    /**
     * We know the button exists, we just want to see if it's disabled
     */
    // tslint:disable-next-line:no-non-null-assertion
    expect((document.getElementById("form-submit")! as HTMLButtonElement).disabled).toBeTruthy();
  });

  // it("should prevent submit if at least one field is missing", async () => {
  //   const formGroup: FormGroup = component.getFormGroup();
  //   const fileInput: HTMLInputElement = document.createElement("input");
  //   // tslint:disable-next-line:no-non-null-assertion
  //   fileInput.files = new FileList();
  //   formGroup.setValue({
  //     name: "Maxime",
  //   });
  //   // tslint:disable-next-line:no-non-null-assertion
  //   expect((document.getElementById("form-submit")! as HTMLButtonElement).disabled).toBeTruthy();
  // });

  it("should have an error if name is to short", async () => {
    component.getFormGroup().setValue({name: "1234"}, {emitEvent: true});
    // tslint:disable-next-line:no-any
    expect((component.getFormGroup().controls as any).get("name").hasError("minlength")).toBeTruthy();
  });

  it("should have an error if no name specified", async () => {
    component.getFormGroup().setValue({name: "1234"}, {emitEvent: true});
    component.getFormGroup().setValue({name: ""}, {emitEvent: true});
    // tslint:disable-next-line:no-any
    expect((component.getFormGroup().controls as any).get("name").hasError("required")).toBeTruthy();
  });

  it("should have an error if no file specified", async () => {
    component.getFormGroup().setValue({originalImage: "1234"}, {emitEvent: true});
    // tslint:disable-next-line:no-any
    expect((component.getFormGroup().controls as any).get("originalImage").hasError("required")).toBeTruthy();
  });

  // it("should have an error if the file isn't a bmp", async () => {
  //   component.getFormGroup().setValue({originalImage: "1234"}, {emitEvent: true});
  //   // tslint:disable-next-line:no-any
  //   expect((component.getFormGroup().controls as any).get("originalImage").hasError("imageType")).toBeTruthy();
  // });

  // it("should have an error if the file isn't the right dimensions", async () => {
  //   component.getFormGroup().setValue({originalImage: "1234"}, {emitEvent: true});
  //   // tslint:disable-next-line:no-any
  //   expect((component.getFormGroup().controls as any).get("originalImage").hasError("imageDimensions")).toBeTruthy();
  // });

  // it("should have an error if the file is too big for upload", async () => {
  //   component.getFormGroup().setValue({originalImage: "1234"}, {emitEvent: true});
  //   // tslint:disable-next-line:no-any
  //   expect((component.getFormGroup().controls as any).get("originalImage").hasError("imageSize")).toBeTruthy();
  // });
});
