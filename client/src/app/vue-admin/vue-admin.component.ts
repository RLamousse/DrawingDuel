import { Component } from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {CreateSimpleGame} from "../create-simple-game/create-simple-game";
import {Create3DGameComponent} from "../create3-dgame/create3-dgame.component";

@Component({
  selector: "app-vue-admin",
  templateUrl: "./vue-admin.component.html",
  styleUrls: ["./vue-admin.component.css"],
  template: `<app-game-list [rightButton]="rightButton"
                            [leftButton]="leftButton">
             </app-game-list>`,

})
export class VueAdminComponent {

  public constructor(private dialog: MatDialog ) { }

  public rightButton: string = "reinitialiser";
  public leftButton: string = "creer";

  protected createSimpleGame(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    this.dialog.open(CreateSimpleGame, dialogConfig);

  }

  protected create3DGame(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    this.dialog.open(Create3DGameComponent, dialogConfig);

  }

}
