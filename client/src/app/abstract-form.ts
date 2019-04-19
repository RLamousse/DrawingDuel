import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {DialogStatus} from "./dialog-utils";
import {FormPostService} from "./form-post.service";

export abstract class AbstractForm {
  public formDoc: FormGroup;
  protected disableButton: boolean = false;

  public constructor(protected _fb: FormBuilder,
                     protected dialogRef: MatDialogRef<AbstractForm>,
                     protected formPost: FormPostService) {
  }

  public exit(message: DialogStatus = DialogStatus.CANCEL): void {
    this.formDoc.reset();
    this.dialogRef.close(message);
  }
}
