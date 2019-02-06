import { FormControl, ValidationErrors } from "@angular/forms";
import { Dimension } from "../../../common/image/Bitmap/IDimension";
import { getDimensionsFromBuffer } from "../../../common/image/Bitmap/bitmap-utils";

export default class FileValidator {
  public static readonly MAX_IMAGE_SIZE: number = 1000000;

  public static async fileValidator(control: FormControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const file: File = control.value.files[0];
      if (file.type !== "image/bmp") {
        return { imageType: "L'image doit être de type bmp" };
      }
      if (file.size > FileValidator.MAX_IMAGE_SIZE) {
        return { imageSize: `L'image est invalide (taille maximale de ${FileValidator.MAX_IMAGE_SIZE})` };
      }
      const dimensionsOk: boolean = await FileValidator.checkFile(file);
      if (!dimensionsOk) {
        return {imageDimension: "L'image n'est pas de la bonne dimension"};
      }
    }

    return null;
  }

  private static async checkFile(file: File): Promise<boolean> {
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
        if (event.target.result) {
          const dimensions: Dimension = getDimensionsFromBuffer(event.target.result);
          resolve(dimensions.width === REQUIRED_WIDTH && dimensions.height === REQUIRED_HEIGHT);
        } else {
          // TO BE DONE: Throw error if not resolved
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}