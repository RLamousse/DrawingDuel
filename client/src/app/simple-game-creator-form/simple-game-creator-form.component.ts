import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { FileInput } from 'ngx-material-file-input';

@Component({
  selector: "app-simple-game-creator-form",
  templateUrl: "./simple-game-creator-form.component.html",
  styleUrls: ["./simple-game-creator-form.component.css"],
})
export class SimpleGameCreatorFormComponent implements OnInit {

  private formDoc: FormGroup;
  // private maxSize: number = 100;

  public constructor(private _fb: FormBuilder) { }

  public ngOnInit(): void {
    this.formDoc = this._fb.group({
      originalImage: [
        undefined,
        [Validators.required],
      ],
      modifiedImage: [
        undefined,
        [Validators.required],
      ],
    });
  }

  public checkFileDimension(fileName: string): boolean {
    this.formDoc.get(fileName);

    return false;
  }

  public getFormDoc (): FormGroup {
    return this.formDoc;
  }
}
