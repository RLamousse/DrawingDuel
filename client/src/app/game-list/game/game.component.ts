import {Component, Input, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {ComponentNavigationError} from "../../../../../common/errors/component.errors";
import {IRecordTime} from "../../../../../common/model/game/record-time";
import {DeleteGameFormComponent} from "./delete-game-form/delete-game-form.component";
import {GameButtonOptions} from "./game-button-enum";
import {ResetGameFormComponent} from "./reset-game-form/reset-game-form.component";
import {RoomService} from "./room.service";
import {PlayerCountMessage} from "../../../../../common/communication/messages/message";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {

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
  @Input() public isSimpleGame: boolean;

  public ngOnInit(): void {
    this.roomService.fetchRooms(this.gameName, this.handleRoomAvailability);
  }

  protected leftButtonClick(): void {
    if (this.leftButton === GameButtonOptions.PLAY) {
      this.roomService.createRoom(this.gameName, PlayerCountMessage.SOLO);
      this.isSimpleGame ? this.navigatePlayView() : this.navigateFreeView();
    } else if (this.leftButton === GameButtonOptions.DELETE) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, isSimpleGame: this.isSimpleGame};
      this.dialog.open(DeleteGameFormComponent, dialogConfig);
    }
  }

  private handleRoomAvailability(value: boolean): void {
    this.rightButton = value ? GameButtonOptions.JOIN : GameButtonOptions.CREATE;
  }

  protected rightButtonClick(): void {
    if (this.rightButton === GameButtonOptions.JOIN) {
      this.roomService.checkInRoom(this.gameName);
      this.navigateAwait();
    } else if (this.rightButton === GameButtonOptions.REINITIALIZE) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, isSimpleGame: this.isSimpleGame};
      this.dialog.open(ResetGameFormComponent, dialogConfig).afterClosed().subscribe(() => window.location.reload());
    }
  }

  private navigatePlayView(): void {
   this.router.navigate(["/play-view/"], {queryParams: {
      gameName: this.gameName, originalImage: this.originalImage, modifiedImage: this.modifiedImage, isSimpleGame: this.isSimpleGame },
    })
     .catch(() => {
       throw new ComponentNavigationError();
     });
  }

  private navigateFreeView(): void {
    this.router.navigate(["/3d-view/"], {
      queryParams: {
        gameName: this.gameName,
        isSimpleGame: this.isSimpleGame,
      },
    })
      .catch(() => {
        throw new ComponentNavigationError();
      });
  }

  private navigateAwait(): void {
    this.router.navigate(["/await-view/"], {queryParams: {
      gameName: this.gameName, gameType: this.isSimpleGame},
    })
      .catch(() => {
       throw new ComponentNavigationError();
     });
  }
}
