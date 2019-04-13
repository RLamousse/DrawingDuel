import {Component} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Create3DGameComponent} from "../create3-dgame/create3-dgame.component";
import {GameButtonOptions} from "../game-list/game/game-button-enum";
import {SimpleGameCreatorFormComponent} from "../simple-game-creator-form/simple-game-creator-form.component";

@Component({
  selector: "app-vue-admin",
  templateUrl: "./vue-admin.component.html",
  styleUrls: ["./vue-admin.component.css"],
})
export class VueAdminComponent {

  public constructor(private dialog: MatDialog) { }

  protected readonly rightButton: string = GameButtonOptions.REINITIALIZE;
  protected readonly leftButton: string = GameButtonOptions.DELETE;

  protected createSimpleGame(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(SimpleGameCreatorFormComponent, dialogConfig);
  }

  protected create3DGame(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(Create3DGameComponent, dialogConfig);
  }
}
