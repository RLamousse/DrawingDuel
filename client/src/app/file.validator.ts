import { FormControl, ValidationErrors } from "@angular/forms";
import { Dimension } from "../../../common/image/bitmap/IDimension";
import { getDimensionsFromBuffer } from "../../../common/image/bitmap/bitmap-utils";
import FakeControl from "./Interfaces/fakeControl";

export default class FileValidator {
  public static readonly MAX_IMAGE_SIZE: number = 1000000;

  // To test, we let objects with value.files attribute as params
  public static async dimensionValidator(control: FormControl | FakeControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const file: File = control.value.files[0];
      const dimensionsOk: boolean = await FileValidator.checkFile(file);
      if (!dimensionsOk) {
        return { imageDimension: "L'image n'est pas de la bonne dimension" };
      }
    }

    return null;
  }

  public static typeValidator(control: FormControl | FakeControl): ValidationErrors | null {
    if (control.value) {
      const file: File = control.value.files[0];
      if (file.type !== "image/bmp") {
        return { imageType: "L'image doit être de type bmp" };
      }
    }

    return null;
  }

  public static sizeValidator(control: FormControl | FakeControl): ValidationErrors | null {
    if (control.value) {
      const file: File = control.value.files[0];
      if (file.size > FileValidator.MAX_IMAGE_SIZE) {
        return { imageSize: `L'image est invalide (taille maximale de ${FileValidator.MAX_IMAGE_SIZE})` };
      }
    }

    return null;
  }

  private static async checkFile(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      /**
       * This event (ProgressEvent) in particular doesn't seem to know
       * that target.result exists -> use of any
      */
      // tslint:disable-next-line:no-any
      reader.onload = (event: any) => {
        if (event.target.result) {
          const dimensions: Dimension = getDimensionsFromBuffer(event.target.result);
          resolve(FileValidator.isDimensionOk(dimensions.width, dimensions.height));
        } else {
          // TO BE DONE: Throw error if not resolved
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private static isDimensionOk (width: number, height: number): boolean {
    const REQUIRED_WIDTH: number = 640;
    const REQUIRED_HEIGHT: number = 480;

    return width === REQUIRED_WIDTH && height === REQUIRED_HEIGHT;
  }
}
