import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {IDialogData} from "../dialog-data-interface/IDialogData";

@Component({
  selector: "app-supprimer-form",
  templateUrl: "./supprimer-form.component.html",
  styleUrls: ["./supprimer-form.component.css"],
})

export class SupprimerFormComponent  {

  public constructor( protected dialogRef: MatDialogRef<SupprimerFormComponent>,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private router: Router ) {/*vide*/}

  public exit(message: Object = { status: "cancelled" }): void {
    this.dialogRef.close(message);
  }
  public deleteGame(): void {
    /*call deleteGame from server*/
    this.dialogRef.close();
    this.router.navigate(["/admin/"]);
  }
}
