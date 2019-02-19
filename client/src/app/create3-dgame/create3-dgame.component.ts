import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatCheckboxChange, MatDialogRef, MatSliderChange } from "@angular/material";
import { FREE_GAME_CREATION_ROUTE } from "../../../../common/communication/routes";
import { ModificationType, ObjectGeometry } from "../FreeGameCreatorInterface/free-game-enum";
import { AVAILABLE_MODIF_TYPES, AVAILABLE_OBJECT_TYPES, SelectType } from "../Interfaces/selectType";
import { AbstractForm } from "../abstract-form";
import { FormPostService } from "../form-post.service";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "../scene-creator/free-game-photo-service/free-game-photo.service";

@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent extends AbstractForm implements OnInit {

  private readonly MIN_NAME_LENGTH: number = 5;

  protected modTypes: SelectType<ModificationType>[] = AVAILABLE_MODIF_TYPES;
  protected objectTypes: SelectType<ObjectGeometry>[] = AVAILABLE_OBJECT_TYPES;
  protected sliderValue: number = 10;

  public checkboxes: {
    objectTypes: Set<ObjectGeometry>,
    modificationTypes: Set<ModificationType>,
    valid(): boolean,
  };
  public constructor(
    _fb: FormBuilder,
    dialogRef: MatDialogRef<Create3DGameComponent>,
    formPost: FormPostService,
    private freeGameCreator: FreeGameCreatorService,
  ) {
    super(_fb, dialogRef, formPost);
    this.checkboxes = {
      objectTypes: new Set<ObjectGeometry>(),
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
    });
  }

  protected onCheckboxChange(e: MatCheckboxChange,
                             selectType: "objectTypes" | "modificationTypes",
                             selectName: ObjectGeometry | ModificationType): void {
    if (e.checked) {
      (this.checkboxes[selectType] as Set<ObjectGeometry | ModificationType>).add(selectName);
    } else {
      (this.checkboxes[selectType] as Set<ObjectGeometry | ModificationType>).delete(selectName);
    }
  }

  public checboxesValid(): boolean {
    return (
      this.checkboxes.objectTypes.size !== 0 &&
      this.checkboxes.modificationTypes.size !== 0
    );
  }

  protected onSliderChange(e: MatSliderChange): void {
    this.sliderValue = e.value ? e.value : 0;
  }

  protected onSubmit(): void {
    this.disableButton = true;
    const objectTypes: ObjectGeometry[] = Array.from(this.checkboxes.objectTypes);
    const modificationTypes: ModificationType[] = Array.from(this.checkboxes.modificationTypes);
    this.createScenes(objectTypes, modificationTypes);
    const fd: FormData = new FormData();
    fd.append("gameName", this.formDoc.value.name);
    fd.append("originalScene", JSON.stringify(this.freeGameCreator.scene));
    fd.append("modifiedScene", JSON.stringify(this.freeGameCreator.modifiedScene));
    this.formPost.basicPost(FREE_GAME_CREATION_ROUTE, fd).subscribe(
      (data) => {
        this.exit(data);
      },
      (error: Error) => {
        console.error(`${error.name} : ${error.message}`);
        alert(error.message);
        this.disableButton = false;
      });
  }

  private createScenes(objects: ObjectGeometry[], modifications: ModificationType[]): void {
    this.freeGameCreator.modificationTypes = modifications;
    this.freeGameCreator.objectTypes = objects;
    this.freeGameCreator.obj3DToCreate = this.sliderValue;
    this.freeGameCreator.createScenes();
<<<<<<< HEAD

    let screenShots: FreeGamePhotoService = new FreeGamePhotoService();
    console.log(this.freeGameCreator.scene);
    screenShots.takePhotos(this.freeGameCreator.scene, this.freeGameCreator.modifiedScene);

=======
>>>>>>> 5243a3fecc96ac75654e3823739d3f7ca4e857ce
  }
}
