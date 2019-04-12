import {Component, Input, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {LOADING_GIF} from "../../../../../common/communication/routes";
import {ComponentNavigationError} from "../../../../../common/errors/component.errors";
import {GameType} from "../../../../../common/model/game/game";
import {IRecordTime} from "../../../../../common/model/game/record-time";
import {openDialog} from "../../dialog-utils";
import {DeleteGameFormComponent} from "./delete-game-form/delete-game-form.component";
import {ResetGameFormComponent} from "./reset-game-form/reset-game-form.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {

  public constructor(private router: Router, private dialog: MatDialog) {}

  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: IRecordTime[];
  @Input() public bestMultiTimes: IRecordTime[];
  @Input() public originalImage: string;
  @Input() public modifiedImage: string;
  @Input() public thumbnail: string;
  @Input() public rightButton: string;
  @Input() public leftButton: string;
  @Input() public gameType: GameType;
  @Input() public simpleGameTag: GameType = GameType.SIMPLE;

  public ngOnInit(): void {
    this.thumbnail = LOADING_GIF;
  }

  protected leftButtonClick(): void {
    if (this.leftButton === "Jouer") {
      this.gameType === GameType.SIMPLE ? this.navigatePlayView() : this.navigateFreeView();
    } else if (this.leftButton === "Supprimer") {
      openDialog(this.dialog, DeleteGameFormComponent, {callback: window.location.reload.bind(window.location),
                                                        data: {gameName: this.gameName, gameType: this.gameType}});
    }
  }

  protected rightButtonClick(): void {
    if (this.rightButton === "Joindre") {
      this.navigateAwait();
    } else if (this.rightButton === "Reinitialiser") {
      openDialog(this.dialog, ResetGameFormComponent, {callback: window.location.reload.bind(window.location),
                                                       data: {gameName: this.gameName, gameType: this.gameType}});
    }
  }

  private navigatePlayView(): void {

   this.router.navigate(["/play-view/"], {queryParams: {
      gameName: this.gameName, originalImage: this.originalImage, modifiedImage: this.modifiedImage, gameType: this.gameType },
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new ComponentNavigationError();
     });
  }

  private navigateFreeView(): void {
    this.router.navigate(["/3d-view/"], {
      queryParams: {
        gameName: this.gameName,
        gameType: this.gameType,
      },
    })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        throw new ComponentNavigationError();
      });
  }

  private navigateAwait(): void {
    this.router.navigate(["/await-view/"], {queryParams: {
      gameName: this.gameName, gameType: this.gameType},
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new ComponentNavigationError();
     });
  }

  protected formatTime(time: number): string {
    const DECIMALSTART: number = -2;
    const DECIMALTOINTEGER: number = 100;
    const SEPARATOR: string = ":";
    let timeString: string = Math.floor(time).toString();
    timeString += SEPARATOR;
    timeString += ("0" + Math.round(time % 1 * DECIMALTOINTEGER).toString()).slice(DECIMALSTART);

    return timeString;
  }

}
