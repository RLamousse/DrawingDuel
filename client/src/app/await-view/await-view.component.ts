import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {GameType} from "../../../../common/model/game/game";
import {SocketService} from "../socket.service";
import {GameDeletionNotifComponent} from "./game-deletion-notif/game-deletion-notif.component";

@Component({
  selector: "app-await-view",
  templateUrl: "./await-view.component.html",
  styleUrls: ["./await-view.component.css"],
})
export class AwaitViewComponent implements OnInit {

  protected gameName: string;
  protected gameType: GameType;
  protected readonly indexString: number = 0;

  public constructor(private activatedRoute: ActivatedRoute, private route: Router,
                     private socket: SocketService, private dialog: MatDialog) {
    this.executeGameDeletionRoutine = this.executeGameDeletionRoutine.bind(this);
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.gameType = params["gameType"];
    });
    this.socket.onEvent(SocketEvent.DELETE).subscribe(this.executeGameDeletionRoutine);
  }

  private executeGameDeletionRoutine(message: WebsocketMessage<[string, boolean]>): void {
    this.notifyGameDeletion(message);
    this.navigateGameList();
  }

  private navigateGameList (): void {
    this.route.navigate(["/game-list/"]) // tslint:disable-next-line:no-any Generic error response
    .catch((reason: any) => {
      throw new ComponentNavigationError();
    });
  }

  private notifyGameDeletion(message: WebsocketMessage<[string, boolean]>): void {
    if (message.body[this.indexString] === this.gameName) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, gameType: this.gameType};
      this.dialog.open(GameDeletionNotifComponent, dialogConfig);
    }
  }
}
