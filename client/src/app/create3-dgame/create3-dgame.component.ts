import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {MatCheckboxChange, MatDialogRef, MatSliderChange} from "@angular/material";
import {ICreateFreeGameRequest} from "../../../../common/communication/requests/game-creator.controller.request";
import {FREE_GAME_CREATION_ROUTE} from "../../../../common/communication/routes";
import {
  ModificationType,
  Themes
} from "../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {AbstractForm} from "../abstract-form";
import {DialogStatus} from "../dialog-utils";
import {FormPostService} from "../form-post.service";
import {FreeGamePhotoService} from "../scene-creator/free-game-photo-service/free-game-photo.service";
import {AVAILABLE_MODIF_TYPES, AVAILABLE_THEMES, SelectType} from "./selectType";
@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent extends AbstractForm implements OnInit {

  private readonly MIN_NAME_LENGTH: number = 5;
  protected modTypes: SelectType<ModificationType>[] = AVAILABLE_MODIF_TYPES;
  protected themes: SelectType<Themes>[] = AVAILABLE_THEMES;
  protected sliderValue: number = 50;
  protected submissionPending: boolean = false;

  public checkboxes: {
    modificationTypes: Set<ModificationType>,
    valid(): boolean,
  };
  public constructor(
    _fb: FormBuilder,
    dialogRef: MatDialogRef<Create3DGameComponent>,
    formPost: FormPostService,
    private photoService: FreeGamePhotoService,
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

  public isFormInvalid(): boolean {
    return (
      !this.formDoc.valid ||
      this.disableButton ||
      !this.checboxesValid() ||
      (this.formDoc.value.theme !== "geometry" && this.formDoc.value.theme !== "space")
    );
  }

  public onSubmit(): void {
    this.disableButton = true;
    this.submissionPending = true;
    const modificationTypes: ModificationType[] = Array.from(this.checkboxes.modificationTypes);
    const gameName: string = this.formDoc.value.name;
    const requestData: ICreateFreeGameRequest = {
      gameName : gameName,
      objectQuantity : this.sliderValue,
      theme : this.formDoc.value.theme,
      modificationTypes : modificationTypes,
    };
    this.formPost.submitForm(FREE_GAME_CREATION_ROUTE, requestData).subscribe(
      async () => {
        await this.photoService.takePhoto(gameName)
          .then(() => {
            this.exit(DialogStatus.DONE);
          })
          .catch((reason: Error) => {
            throw reason;
          });
      },
      (error: Error) => {
        console.error(`${error.name} : ${error.message}`);
        alert(error.message);
        this.disableButton = false;
        this.exit();
      });
  }
}
