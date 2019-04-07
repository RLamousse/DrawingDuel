import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatDialogRef,
  MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule,
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "hammerjs";
import { Observable } from "rxjs";
import { ModificationType } from "../../.././../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import { FormPostService } from "../form-post.service";
import { Create3DGameComponent } from "./create3-dgame.component";

// tslint:disable-next-line:typedef
const fakeFormPost = {
  submitForm: (whichBranch: string, body: Object): Observable<Object> => {
    return new Observable((observer) => {
      observer.next("Test");
    });
  },
};

describe("Create3DGameComponent", () => {
  let component: Create3DGameComponent;
  let fixture: ComponentFixture<Create3DGameComponent>;

  const setupValidForm: Function = () => {
    const theme: AbstractControl = component.formDoc.controls["theme"];
    theme.setValue("geometry");
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("12345");
    component.checkboxes.modificationTypes.add(ModificationType.add);
  };

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [Create3DGameComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSliderModule,
        MatCheckboxModule,
        MatSelectModule,
      ],
      providers: [
        { provide: FormPostService, useValue: fakeFormPost },
        {
          provide: MatDialogRef, useValue: {
            close: (message: Object = { status: "cancelled" }) => {
              //
            },
          },
        },
      ],
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

  it("should have an error if no theme selected", async () => {
    const theme: AbstractControl = component.formDoc.controls["theme"];
    expect(theme.valid).toBeFalsy();
  });

  it("should be ok to submit", async () => {
    const theme: AbstractControl = component.formDoc.controls["theme"];
    theme.setValue("geometry");
    const name: AbstractControl = component.formDoc.controls["name"];
    name.setValue("12345");
    component.checkboxes.modificationTypes.add(ModificationType.add);
    expect(component.checboxesValid()).toBeTruthy();
    expect(component.formDoc.valid).toBeTruthy();
  });

  it("should not throw with error from the request", async (done) => {
    setupValidForm();
    fakeFormPost.submitForm = (whichBranch: string, body: Object): Observable<Object> => {
      return new Observable((observer) => {
        observer.error({
          message: "ERREUR",
          name: "Erreur Test",
        } as Error);
      });
    };

    expect(() => component.onSubmit()).not.toThrow();
    done();
  });

  it("should not throw with success from the request", async (done) => {
    setupValidForm();
    fakeFormPost.submitForm = (whichBranch: string, body: Object): Observable<Object> => {
      return new Observable((observer) => {
        observer.next("Coucou, tout marche");
      });
    };

    expect(() => component.onSubmit()).not.toThrow();
    done();
  });
});
