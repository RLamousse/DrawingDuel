import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {SocketService} from "../socket.service";
import {GameDeletionNotifComponent} from "./game-deletion-notif/game-deletion-notif.component";

@Component({
  selector: "app-await-view",
  templateUrl: "./await-view.component.html",
  styleUrls: ["./await-view.component.css"],
})
export class AwaitViewComponent implements OnInit {

  protected gameName: string;
  protected isSimpleGame: boolean;

  public constructor(private activatedRoute: ActivatedRoute, private route: Router,
                     private socket: SocketService, private dialog: MatDialog) {
    this.notifyGameDeletion = this.notifyGameDeletion.bind(this);
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.isSimpleGame = params["gameType"];
    });
    this.socket.onEvent(SocketEvent.DELETE).subscribe(this.notifyGameDeletion);
  }

  private notifyGameDeletion(message: WebsocketMessage<string>): void {
    if (message.body === this.gameName) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, isSimpleGame: this.isSimpleGame};
      this.dialog.open(GameDeletionNotifComponent, dialogConfig);
      this.route.navigate(["/game-list/"])
        .catch(() => {
          throw new ComponentNavigationError();
      });
    }
  }
}
