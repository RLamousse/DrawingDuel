import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {WebsocketMessage} from "../../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../../common/communication/socket-events";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";
import {GameService} from "../../../game.service";
import {SocketService} from "../../../socket.service";

@Component({
  selector: "app-supprimer-form",
  templateUrl: "./supprimer-form.component.html",
  styleUrls: ["./supprimer-form.component.css"],
})

export class SupprimerFormComponent  {
  private socketMessage: WebsocketMessage<string>;

  public constructor( protected dialogRef: MatDialogRef<SupprimerFormComponent>,
                      protected router: Router,
                      protected socket: SocketService,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private gameService: GameService,
                     ) {/*vide*/}

  public exit(message: Object = { status: "cancelled" }): void {
    this.dialogRef.close(message);
  }
  public deleteGame(): void {
    this.socketMessage = {
      title: SocketEvent.DELETE,
      body: this.data.gameName,
    };
    this.socket.send(SocketEvent.DELETE, this.socketMessage);
    this.deleteGameByType(this.data.gameName, this.data.isSimpleGame);
    this.dialogRef.close();
    this.router.navigate(["/admin/"]);
  }

  public deleteGameByType(gameName: string, isSimpleGame: boolean ): void {
    isSimpleGame ? this.gameService.deleteSimpleGameByName(gameName) : this.gameService.deleteFreeGameByName(gameName);
  }
}
