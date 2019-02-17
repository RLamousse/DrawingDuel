import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatCheckboxChange, MatDialogRef, MatSliderChange } from "@angular/material";
import { AVAILABLE_MODIF_TYPES, AVAILABLE_OBJECT_TYPES, SelectType } from "../Interfaces/selectType";
import { AbstractForm } from "../abstract-form";
import { FormPostService } from "../form-post.service";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";

@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent extends AbstractForm implements OnInit {

  private readonly MIN_NAME_LENGTH: number = 5;

  protected modTypes: SelectType[] = AVAILABLE_MODIF_TYPES;
  protected objectTypes: SelectType[] = AVAILABLE_OBJECT_TYPES;
  protected sliderValue: number = 10;

  public checkboxes: {
    objectTypes: Set<string>,
    modificationTypes: Set<string>,
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
      objectTypes: new Set(),
      modificationTypes: new Set(),
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

  protected onCheckboxChange (e: MatCheckboxChange, selectType: "objectTypes" | "modificationTypes", selectName: string): void {
    if (e.checked) {
      this.checkboxes[selectType].add(selectName);
    } else {
      this.checkboxes[selectType].delete(selectName);
    }
  }

  public checboxesValid (): boolean {
    return (
      this.checkboxes.objectTypes.size !== 0 &&
      this.checkboxes.modificationTypes.size !== 0
    );
  }

  protected onSliderChange (e: MatSliderChange): void {
    this.sliderValue = e.value ? e.value : 0;
  }

  protected onSubmit (): void {
    this.disableButton = true;
    const objectTypes: string[] = Array.from(this.checkboxes.objectTypes);
    const modificationTypes: string[] = Array.from(this.checkboxes.modificationTypes);
    this.createScenes(objectTypes, modificationTypes);
    const fd: FormData = new FormData();
    fd.append("gameName", this.formDoc.value.name);
    fd.append("objectTypes", JSON.stringify(objectTypes));
    fd.append("modificationTypes", JSON.stringify(modificationTypes));
    fd.append("objectQuantity", this.sliderValue.toString());
    this.formPost.basicPost(fd).subscribe(
      (data) => {
        // alert((data as { message: string }).message);
        this.exit(data);
      },
      (error: Error) => {
        console.error(`${error.name} : ${error.message}`);
        alert(error.message);
        this.disableButton = false;
      });
  }

  private createScenes(objects: string[], modifications: string[]): void {
    this.freeGameCreator.modificationTypes = modifications;
    console.log(modifications);
    console.log(objects);
    this.freeGameCreator.objectTypes = objects;
    this.freeGameCreator.obj3DToCreate = this.sliderValue;
    this.freeGameCreator.createScenes();

  }
}
