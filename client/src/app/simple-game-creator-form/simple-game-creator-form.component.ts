import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
// import { MatDialogRef } from "@angular/material";
import { Buffer } from "buffer";
import { getDimensionsFromBuffer } from "../../../../common/image/Bitmap/bitmap-utils";

@Component({
  selector: "app-simple-game-creator-form",
  templateUrl: "./simple-game-creator-form.component.html",
  styleUrls: ["./simple-game-creator-form.component.css"],
})
export class SimpleGameCreatorFormComponent implements OnInit {

  private formDoc: FormGroup;
  private readonly MIN_NAME_LENGTH: number = 5;
  private readonly MAX_IMAGE_SIZE: number = 1000000;

  public constructor(private _fb: FormBuilder,
                    //  private dialogRef: MatDialogRef<SimpleGameCreatorFormComponent>,
                     private http: HttpClient) {
    this.fileValidator = this.fileValidator.bind(this);
  }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      originalImage: [
        undefined,
        [Validators.required],
        this.fileValidator,
      ],
      modifiedImage: [
        undefined,
        [Validators.required],
        this.fileValidator,
      ],
      name: [
        undefined,
        [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH)],
      ],
    });
  }

  public onSubmit (): void {
    const fd: FormData = new FormData();
    fd.append("name", this.formDoc.value.name);
    fd.append("originalImage", this.formDoc.value.originalImage.files[0]);
    fd.append("modifiedImage", this.formDoc.value.modifiedImage.files[0]);
    this.http.post("localhost:3000/api/image-diff", fd).subscribe((data) => {
      // tslint:disable-next-line:no-console
      console.log(data);
    });
  }

  public closeDialog (): void {
    // this.dialogRef.close("");
  }

  public exit(): void {
    this.formDoc.reset();
  }

  // TO BE DONE: Create Class with Custom validators
  private async fileValidator(control: FormControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const file: File = control.value.files[0];
      if (file.type !== "image/bmp") {
        return { imageType: "L'image doit être de type bmp" };
      }
      if (file.size > this.MAX_IMAGE_SIZE) {
        return { imageSize: "L'image est trop grande" };
      }
      const dimensionsOk: boolean = await this.checkFile(file);
      if (!dimensionsOk) {
        return {imageDimension: "L'image n'est pas de la bonne dimension"};
      }
    }

    return null;
  }

  public async checkFile(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      const REQUIRED_WIDTH: number = 640;
      const REQUIRED_HEIGHT: number = 480;
      /**
       * This event (ProgressEvent) in particular doesn't seem to know
       * that target.result exists -> use of any
      */
      // tslint:disable-next-line:no-any
      reader.onload = (event: any) => {
        const data: Buffer = new Buffer(event.target.result);
        const dimensions: {width: number, height: number} = getDimensionsFromBuffer(data);
        const imageOk: boolean = dimensions.width === REQUIRED_WIDTH && dimensions.height === REQUIRED_HEIGHT;
        resolve(imageOk);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
