import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IDialogData} from "../../../../../common/dialog-data-interface/IDialogData";

@Component({
  selector: "app-game-deletion-notif",
  templateUrl: "./game-deletion-notif.component.html",
  styleUrls: ["./game-deletion-notif.component.css"],
})
export class GameDeletionNotifComponent {

  public constructor(protected dialogRef: MatDialogRef<GameDeletionNotifComponent>,
                     @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                    ) {/*vide*/ }

  public exit(): void {
    this.dialogRef.close();
  }
}
