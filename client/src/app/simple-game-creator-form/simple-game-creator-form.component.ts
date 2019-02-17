import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { AbstractForm } from "../abstract-form";
import FileValidator from "../file.validator";
import { FormPostService } from "../form-post.service";

@Component({
  selector: "app-simple-game-creator-form",
  templateUrl: "./simple-game-creator-form.component.html",
  styleUrls: ["./simple-game-creator-form.component.css"],
})
export class SimpleGameCreatorFormComponent extends AbstractForm implements OnInit {

  public formDoc: FormGroup;
  private readonly MIN_NAME_LENGTH: number = 5;

  public constructor(_fb: FormBuilder,
                     dialogRef: MatDialogRef<SimpleGameCreatorFormComponent>,
                     formPost: FormPostService) {
    super(_fb, dialogRef, formPost);
  }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      originalImage: [
        undefined,
        [Validators.required, FileValidator.sizeValidator, FileValidator.typeValidator],
        FileValidator.dimensionValidator,
      ],
      modifiedImage: [
        undefined,
        [Validators.required, FileValidator.sizeValidator, FileValidator.typeValidator],
        FileValidator.dimensionValidator,
      ],
      name: [
        undefined,
        [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH)],
      ],
    });
  }

  public onSubmit(): void {
    this.disableButton = true;
    const fd: FormData = new FormData();
    fd.append("gameName", this.formDoc.value.name);
    fd.append("originalImage", this.formDoc.value.originalImage.files[0]);
    fd.append("modifiedImage", this.formDoc.value.modifiedImage.files[0]);
    this.formPost.basicPost("api/game-creator/create-simple-game", fd).subscribe(
      (data) => {
        // alert((data as { message: string }).message);
        this.exit(data);
      },
      (error: Error) => {
        console.error(`${error.name} : ${error.message}`);
        alert(error.message);
        this.disableButton = false;
      });
  }
}
