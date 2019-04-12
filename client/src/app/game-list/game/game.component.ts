import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {LOADING_GIF} from "../../../../../common/communication/routes";
import {ComponentNavigationError} from "../../../../../common/errors/component.errors";
import {GameType, OnlineType} from "../../../../../common/model/game/game";
import {IRecordTime} from "../../../../../common/model/game/record-time";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {RoomService} from "../../room.service";
import {DeleteGameFormComponent} from "./delete-game-form/delete-game-form.component";
import {GameButtonOptions} from "./game-button-enum";
import {ResetGameFormComponent} from "./reset-game-form/reset-game-form.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit, OnDestroy {

  public constructor(private router: Router,
                     private dialog: MatDialog,
                     private roomService: RoomService) {
    this.handleRoomAvailability = this.handleRoomAvailability.bind(this);
  }

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
    this.roomService.subscribeToFetchRooms(this.handleRoomAvailability);
    this.handleRoomAvailability = this.handleRoomAvailability.bind(this);
    this.thumbnail = LOADING_GIF;
  }

  public ngOnDestroy(): void {
    this.roomService.unsubscribe();
  }

  protected leftButtonClick(): void {
    if (this.leftButton === GameButtonOptions.PLAY) {
      this.roomService.createRoom(this.gameName, OnlineType.SOLO);
      this.gameType === GameType.SIMPLE ? this.navigatePlayView() : this.navigateFreeView();
    } else if (this.leftButton === GameButtonOptions.DELETE) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, gameType: this.gameType};
      this.dialog.open(DeleteGameFormComponent, dialogConfig);
    }
  }

  protected rightButtonClick(): void {
    if (this.rightButton === GameButtonOptions.REINITIALIZE) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, gameType: this.gameType};
      this.dialog.open(ResetGameFormComponent, dialogConfig).afterClosed().subscribe(() => window.location.reload());
    } else {
      this.handleGameJoin();
    }
  }

  private handleGameJoin(): void {
    if (this.rightButton === GameButtonOptions.CREATE) {
      this.roomService.createRoom(this.gameName, OnlineType.MULTI);
    } else if (this.rightButton === GameButtonOptions.JOIN) {
      this.roomService.checkInRoom(this.gameName);
    }
    this.navigateAwait();
  }

  private handleRoomAvailability(rooms: IRoomInfo[]): void {
    const availableRoom: IRoomInfo | undefined = rooms.find((x) => x.gameName === this.gameName && x.vacant);
    if (this.rightButton !== GameButtonOptions.REINITIALIZE) {
      this.rightButton = availableRoom ? GameButtonOptions.JOIN : GameButtonOptions.CREATE;
    }
  }

  private navigatePlayView(): void {

   this.router.navigate(["/play-view/"], {
     queryParams: {
       gameName: this.gameName,
       originalImage: this.originalImage,
       modifiedImage: this.modifiedImage,
       gameType: this.gameType,
     },
    })
      .catch(() => {
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
      .catch(() => {
        throw new ComponentNavigationError();
      });
  }

  private navigateAwait(): void {
    this.router.navigate(["/await-view/"], {queryParams: {
      gameName: this.gameName, gameType: this.gameType},
    })
      .catch(() => {
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
