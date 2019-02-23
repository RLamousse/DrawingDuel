import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatCheckboxChange, MatDialogRef, MatSliderChange } from "@angular/material";
import { FREE_GAME_CREATION_ROUTE } from "../../../../common/communication/routes";
import {
  ModificationType, Themes
} from "../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import { AVAILABLE_MODIF_TYPES, AVAILABLE_THEMES, SelectType } from "../Interfaces/selectType";
import { AbstractForm } from "../abstract-form";
import { FormPostService } from "../form-post.service";
@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent extends AbstractForm implements OnInit {

  private readonly MIN_NAME_LENGTH: number = 5;

  protected modTypes: SelectType<ModificationType>[] = AVAILABLE_MODIF_TYPES;
  protected themes: SelectType<Themes>[] = AVAILABLE_THEMES;
  protected sliderValue: number = 10;

  public checkboxes: {
    modificationTypes: Set<ModificationType>,
    valid(): boolean,
  };
  public constructor(
    _fb: FormBuilder,
    dialogRef: MatDialogRef<Create3DGameComponent>,
    formPost: FormPostService,
  ) {
    super(_fb, dialogRef, formPost);
    this.checkboxes = {
      modificationTypes: new Set<ModificationType>(),
      valid: this.checboxesValid,
    };
  }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      name: [
        undefined,
        [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH)],
      ],
      theme: [
        undefined,
        [Validators.required, ],
      ],
    });
  }

  protected onCheckboxChange(e: MatCheckboxChange,
                             selectName: ModificationType): void {
    if (e.checked) {
      this.checkboxes.modificationTypes.add(selectName);
    } else {
      this.checkboxes.modificationTypes.delete(selectName);
    }
  }

  public checboxesValid(): boolean {
    return (
      this.checkboxes.modificationTypes.size !== 0
    );
  }

  protected onSliderChange(e: MatSliderChange): void {
    this.sliderValue = e.value ? e.value : 0;
  }

  protected isFormInvalid(): boolean {
    return (
      !this.formDoc.valid ||
      this.disableButton ||
      !this.checboxesValid() ||
      this.formDoc.value.theme !== "geometry"
    );
  }

  protected onSubmit(): void {
    this.disableButton = true;
    const modificationTypes: ModificationType[] = Array.from(this.checkboxes.modificationTypes);
    const fd: FormData = new FormData();
    fd.append("gameName", this.formDoc.value.name);
    fd.append("objectQuantity", this.sliderValue.toString());
    fd.append("objectTypes", this.formDoc.value.theme);
    fd.append("modificationTypes", JSON.stringify(modificationTypes));
    this.formPost.submitForm(FREE_GAME_CREATION_ROUTE, fd).subscribe(
      (data) => {
        this.exit(data);
      },
      (error: Error) => {
        console.error(`${error.name} : ${error.message}`);
        alert(error.message);
        this.disableButton = false;
      });
  }
}
