import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {SocketService} from "../socket.service";

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
    this.gameDeleted = this.gameDeleted.bind(this);
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.isSimpleGame = params["gameType"];
    });
    this.socket.onEvent(SocketEvent.DELETE).subscribe(this.gameDeleted);
  }

  private gameDeleted(message: WebsocketMessage<string>): void {
      this.route.navigate(["/game-list/"]);
    }
  }
}
