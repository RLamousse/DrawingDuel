import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { AVAILABLE_MODIF_TYPES } from "../Interfaces/selectType";
import { AbstractForm } from "../abstract-form";
import { FormPostService } from "../form-post.service";

@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent extends AbstractForm implements OnInit {

  private readonly MIN_NAME_LENGTH: number = 5;

  public constructor(_fb: FormBuilder,
                     dialogRef: MatDialogRef<Create3DGameComponent>,
                     formPost: FormPostService) {
    super(_fb, dialogRef, formPost);
  }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      name: [
        undefined,
        [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH)],
      ],
      objectTypes: [
        undefined,
        [Validators.required, ],
      ],
      modifTypes: [
        undefined,
        [Validators.required, ],
      ],
    });
  }
}
