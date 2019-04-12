import {Component} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Create3DGameComponent} from "../create3-dgame/create3-dgame.component";
import {SimpleGameCreatorFormComponent} from "../simple-game-creator-form/simple-game-creator-form.component";
import {openDialog} from "../dialog-utils";

@Component({
  selector: "app-vue-admin",
  templateUrl: "./vue-admin.component.html",
  styleUrls: ["./vue-admin.component.css"],
})
export class VueAdminComponent {

  public constructor(private dialog: MatDialog) { }

  protected readonly rightButton: string = "reinitialiser";
  protected readonly leftButton: string = "supprimer";

  protected createSimpleGame(): void {
    openDialog(this.dialog, SimpleGameCreatorFormComponent, false);
  }

  protected create3DGame(): void {
    openDialog(this.dialog, Create3DGameComponent, false);
  }
}
