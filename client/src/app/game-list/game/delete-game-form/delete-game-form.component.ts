import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {AxiosPromise} from "axios";
import {createWebsocketMessage, WebsocketMessage} from "../../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../../common/communication/socket-events";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";
import {GameType} from "../../../../../../common/model/game/game";
import {DialogStatus} from "../../../dialog-utils";
import {GameService} from "../../../game.service";
import {SocketService} from "../../../socket.service";

@Component({
  selector: "app-delete-game-form",
  templateUrl: "./delete-game-form.component.html",
  styleUrls: ["./delete-game-form.component.css"],
})

export class DeleteGameFormComponent  {
  public constructor( protected dialogRef: MatDialogRef<DeleteGameFormComponent>,
                      protected router: Router,
                      protected socket: SocketService,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private gameService: GameService,
                     ) {}

  public exit(message: DialogStatus = DialogStatus.CANCEL): void {
    this.dialogRef.close(message);
  }

  public deleteGame(): void {
    this.sendDeleteMessage();
    this.deleteGameByType(this.data.gameName, this.data.gameType)
      .then(() => {
        this.dialogRef.close(DialogStatus.DONE);
      })
      .catch((error: Error) => {
        this.dialogRef.close();
        throw error;
    });
  }

  private sendDeleteMessage(): void {
    const socketMessage: WebsocketMessage<[string, GameType]> = createWebsocketMessage<[string, GameType]>(
      [
        this.data.gameName,
        this.data.gameType,
      ],
    );
    this.socket.send(SocketEvent.DELETE, socketMessage);
  }

  private deleteGameByType(gameName: string, gameType: GameType ): AxiosPromise<void> {
    return gameType === GameType.SIMPLE ? this.gameService.hideSimpleByName(gameName) : this.gameService.hideFreeByName(gameName);
  }
}
