import {Component} from "@angular/core";
import {MatDialog} from "@angular/material";
import {Create3DGameComponent} from "../create3-dgame/create3-dgame.component";
import {openDialog} from "../dialog-utils";
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
    openDialog(this.dialog, SimpleGameCreatorFormComponent, {});
  }

  protected create3DGame(): void {
    openDialog(this.dialog, Create3DGameComponent, {});
  }
}
