import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {WebsocketMessage} from "../../../../../../common/communication/messages/message";
import {ADMIN_ROUTE} from "../../../../../../common/communication/routes";
import {SocketEvent} from "../../../../../../common/communication/socket-events";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";
import {ComponentNavigationError} from "../../../../../../common/errors/component.errors";
import {GameType} from "../../../../../../common/model/game/game";
import {GameService} from "../../../game.service";
import {SocketService} from "../../../socket.service";

@Component({
  selector: "app-delete-game-form",
  templateUrl: "./delete-game-form.component.html",
  styleUrls: ["./delete-game-form.component.css"],
})

export class DeleteGameFormComponent  {
  private socketMessage: WebsocketMessage<[string, GameType]>;

  public constructor( protected dialogRef: MatDialogRef<DeleteGameFormComponent>,
                      protected router: Router,
                      protected socket: SocketService,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private gameService: GameService,
                     ) {}

  public exit(message: Object = { status: "cancelled" }): void {
    this.dialogRef.close(message);
  }

  public deleteGame(): void {
    this.sendDeleteMessage();
    this.deleteGameByType(this.data.gameName, this.data.gameType);
    this.dialogRef.close();
    this.router.navigate([ADMIN_ROUTE])
      .catch(() => {
        throw new ComponentNavigationError();
    });
  }

  private sendDeleteMessage(): void {
    this.socketMessage = {
      title: SocketEvent.DELETE,
      body: [this.data.gameName, this.data.gameType],
    };
    this.socket.send(SocketEvent.DELETE, this.socketMessage);
  }

  private deleteGameByType(gameName: string, gameType: GameType ): void {
    gameType === GameType.SIMPLE ? this.gameService.hideSimpleByName(gameName) : this.gameService.hideFreeByName(gameName);
    window.location.reload();
  }
}
