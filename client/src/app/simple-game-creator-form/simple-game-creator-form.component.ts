import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import FileValidator from "../file.validator";
import { FormPostService } from "../form-post.service";

@Component({
  selector: "app-simple-game-creator-form",
  templateUrl: "./simple-game-creator-form.component.html",
  styleUrls: ["./simple-game-creator-form.component.css"],
})
export class SimpleGameCreatorFormComponent implements OnInit {

  public formDoc: FormGroup;
  private readonly MIN_NAME_LENGTH: number = 5;

  public constructor(private _fb: FormBuilder,
                     public dialogRef: MatDialogRef<SimpleGameCreatorFormComponent>,
                     private formPost: FormPostService) {
  }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      originalImage: [
        undefined,
        [Validators.required],
        FileValidator.fileValidator,
      ],
      modifiedImage: [
        undefined,
        [Validators.required],
        FileValidator.fileValidator,
      ],
      name: [
        undefined,
        [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH)],
      ],
    });
  }

  public onSubmit (): void {
    const fd: FormData = new FormData();
    fd.append("gameName", this.formDoc.value.name);
    fd.append("originalImage", this.formDoc.value.originalImage.files[0]);
    fd.append("modifiedImage", this.formDoc.value.modifiedImage.files[0]);
    this.formPost.basicPost(fd).subscribe((data) => {
      alert((data as {message: string}).message);
      this.exit(data);
    });
  }

  public exit(message: Object = {status: "cancelled"}): void {
    this.formDoc.reset();
    this.dialogRef.close(message);
  }
}
