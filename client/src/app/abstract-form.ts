import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { FormPostService } from "./form-post.service";

export class AbstractForm {
  public formDoc: FormGroup;

  public constructor(protected _fb: FormBuilder,
                     protected dialogRef: MatDialogRef<AbstractForm>,
                     protected formPost: FormPostService) {
  }

  public exit(message: Object = { status: "cancelled" }): void {
    this.formDoc.reset();
    this.dialogRef.close(message);
  }
}
