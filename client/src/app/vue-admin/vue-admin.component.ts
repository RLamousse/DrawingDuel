import {Component} from "@angular/core";
import {MatDialog} from "@angular/material";
import {HOME_ROUTE} from "../../../../common/communication/routes";
import {Create3DGameComponent} from "../create3-dgame/create3-dgame.component";
import {openDialog, DialogStatus} from "../dialog-utils";
import {GameButtonOptions} from "../game-list/game/game-button-enum";
import {SimpleGameCreatorFormComponent} from "../simple-game-creator-form/simple-game-creator-form.component";

@Component({
  selector: "app-vue-admin",
  templateUrl: "./vue-admin.component.html",
  styleUrls: ["./vue-admin.component.css"],
})
export class VueAdminComponent {

  // @ts-ignore variable used in html
  private readonly HOME_BUTTON_ROUTE: string = HOME_ROUTE;

  public constructor(private dialog: MatDialog) { }

  protected readonly rightButton: string = GameButtonOptions.REINITIALIZE;
  protected readonly leftButton: string = GameButtonOptions.DELETE;

  protected createSimpleGame(): void {
    openDialog(this.dialog, SimpleGameCreatorFormComponent, {callback: (status: DialogStatus) => {
        if (status && status === DialogStatus.DONE) {
          window.location.reload.bind(window.location)();
        }}, });
  }

  protected create3DGame(): void {
    openDialog(this.dialog, Create3DGameComponent, {callback: (status: DialogStatus) => {
      if (status && status === DialogStatus.DONE) {
        window.location.reload.bind(window.location)();
      }}, });
  }
}
