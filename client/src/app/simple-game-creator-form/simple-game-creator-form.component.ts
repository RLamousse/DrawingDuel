import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Buffer } from "buffer";
import { getDimensionsFromBuffer } from "../../../../common/image/Bitmap/bitmap-utils";

@Component({
  selector: "app-simple-game-creator-form",
  templateUrl: "./simple-game-creator-form.component.html",
  styleUrls: ["./simple-game-creator-form.component.css"],
})
export class SimpleGameCreatorFormComponent implements OnInit {

  private formDoc: FormGroup;
  private readonly MIN_LENGTH: number = 5;
  private readonly MAX_SIZE: number = 1000000;

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
        [Validators.minLength(this.MIN_LENGTH)],
      ],
    });
  }

  public exit(): void {
    this.formDoc.reset();
  }

  private async fileValidator(control: FormControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const file: File = control.value.files[0];
      // tslint:disable-next-line:no-console
      console.log(file);
      if (file.type !== "image/bmp") {
        return { image: "L'image doit être de type bmp" };
      }
      if (file.size > this.MAX_SIZE) {
        return { image: "L'image est trop grande" };
      }
      const dimensionsOk: boolean = await this.checkFile(file);
      if (!dimensionsOk) {
        return {image: "L'image n'est pas de la bonne dimension"};
      }

      return null;
    }

    return null;
  }

  public async checkFile(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const reader: FileReader = new FileReader();

      // tslint:disable-next-line:no-any
      reader.onload = (event: any) => {
        const data: Buffer = new Buffer(event.target.result);
        const dimensions: {width: number, height: number} = getDimensionsFromBuffer(data);
        const imageOk: boolean = dimensions === {width: 640, height: 480};
        resolve(imageOk);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
