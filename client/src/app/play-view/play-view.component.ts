import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {GAMES_ROUTE} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {openDialog} from "../dialog-utils";
import {KickDialogComponent} from "../kick-dialog/kick-dialog.component";
import {SocketService} from "../socket.service";

@Component({
             selector: "app-play-view",
             templateUrl: "./play-view.component.html",
             styleUrls: ["./play-view.component.css"],
           })
export class PlayViewComponent implements OnInit {

  // @ts-ignore variable used in html
  private readonly BACK_BUTTON_ROUTE: string = GAMES_ROUTE;
  protected gameName: string;
  protected originalImage: string;
  protected modifiedImage: string;

  public constructor(private route: ActivatedRoute,
                     private socketService: SocketService,
                     private dialog: MatDialog,
                     private router: Router) {
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
    });

    this.socketService.onEvent(SocketEvent.KICK)
      .subscribe(async () => this.onKick());
  }

  protected onKick(): void {
    openDialog(
      this.dialog,
      KickDialogComponent,
      {
        callback: () => {
          this.router.navigate([GAMES_ROUTE])
            .catch(() => {
              throw new ComponentNavigationError();
            });
        },
      });
  }
}
