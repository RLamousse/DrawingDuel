import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MatCheckboxChange } from "@angular/material";
import { AVAILABLE_MODIF_TYPES, AVAILABLE_OBJECT_TYPES } from "../Interfaces/selectType";
import { AbstractForm } from "../abstract-form";
import { FormPostService } from "../form-post.service";

@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent extends AbstractForm implements OnInit {

  private readonly MIN_NAME_LENGTH: number = 5;
  protected modTypes = AVAILABLE_MODIF_TYPES;
  protected objectTypes = AVAILABLE_OBJECT_TYPES;
  protected checkboxes: {
    objectTypes: Set<string>,
    modificationTypes: Set<string>,
  } 

  public constructor(_fb: FormBuilder,
                     dialogRef: MatDialogRef<Create3DGameComponent>,
                     formPost: FormPostService) {
    super(_fb, dialogRef, formPost);
    this.checkboxes = {
      objectTypes: new Set(),
      modificationTypes: new Set(),
    };
  }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      name: [
        undefined,
        [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH)],
      ],
    });
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  onChange (e: MatCheckboxChange, selectType: "objectTypes" | "modificationTypes", selectName: string) {
    if(e.checked) {
      this.checkboxes[selectType].add(selectName);
    } else {
      this.checkboxes[selectType].delete(selectName);
    }
  }
}
