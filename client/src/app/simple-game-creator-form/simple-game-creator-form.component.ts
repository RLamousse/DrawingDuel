import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import {Dimension} from "../../../../common/image/Bitmap/IDimension";
import {getDimensionsFromBuffer} from "../../../../common/image/Bitmap/bitmap-utils";

@Component({
  selector: "app-simple-game-creator-form",
  templateUrl: "./simple-game-creator-form.component.html",
  styleUrls: ["./simple-game-creator-form.component.css"],
})
export class SimpleGameCreatorFormComponent implements OnInit {

  private formDoc: FormGroup;
  private readonly MIN_NAME_LENGTH: number = 5;
  private readonly MAX_IMAGE_SIZE: number = 1000000;

  public constructor(private _fb: FormBuilder) {
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

  public exit(): void {
    this.formDoc.reset();
  }

  private async fileValidator(control: FormControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const file: File = control.value.files[0];
      if (file.type !== "image/bmp") {
        return { imageType: "L'image doit être de type bmp" };
      }
      if (file.size > this.MAX_IMAGE_SIZE) {
        return { imageSize: `L'image est invalide (taille maximale de ${this.MAX_IMAGE_SIZE})` };
      }
      const dimensionsOk: boolean = await this.checkFile(file);
      if (!dimensionsOk) {
        return {imageDimension: "L'image n'est pas de la bonne dimension"};
      }

      return null;
    }

    return null;
  }

  public async checkFile(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      const REQUIRED_WIDTH: number = 640;
      const REQUIRED_HEIGHT: number = 480;
      // tslint:disable-next-line:no-any
      reader.onload = (event: any) => {
        if (event.target.result) {
          const dimensions: Dimension = getDimensionsFromBuffer(event.target.result);
          resolve(dimensions.width === REQUIRED_WIDTH && dimensions.height === REQUIRED_HEIGHT);
        } else {
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
