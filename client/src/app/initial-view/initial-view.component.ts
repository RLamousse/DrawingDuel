import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ADMIN_ROUTE, BACKGROUND_IMAGE, GAMES_ROUTE} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";

@Component({
  selector: "app-initial-view",
  templateUrl: "./initial-view.component.html",
  styleUrls: ["./initial-view.component.css"],
})
export class InitialViewComponent implements OnInit {

  @Input() public newUsername: string;
  public username: string = "inconnu";
  public errorMessage: string = "";
  public available: boolean;
  private readonly BACKGROUND_COLOR: string = "#272731";
  private readonly BUTTON_ID: string = "#stars";
  private readonly BACKGROUND_CENTERED: string = "center";
  // @ts-ignore variable used in html
  private readonly ADMIN_BUTTON_ROUTE: string = ADMIN_ROUTE;

  public constructor(
    public userService: UNListService,
    private router: Router,
    private socketService: SocketService,
  ) {
    this.handleUsernameAvailability = this.handleUsernameAvailability.bind(this);
  }

  public ngOnInit(): void {
    if (UNListService.username) {
      UNListService.username = "";
      this.socketService.send(SocketEvent.DISCONNECT_USER);
    }
    this.setButtonBackGround();
  }

  public updateUsername(): void {
    this.userService.checkAvailability(this.newUsername, this.handleUsernameAvailability);
  }

  private setButtonBackGround(): void {
    const element: HTMLElement | null = document.getElementById(this.BUTTON_ID);
    if (element !== null) {
      element.style.backgroundColor = this.BACKGROUND_COLOR;
    }
  }

  public changeBackground(): void {
    const element: HTMLElement | null = document.getElementById(this.BUTTON_ID);
    if (document.body.style.backgroundImage === "none") {
      document.body.style.backgroundImage = BACKGROUND_IMAGE;
      if (element !== null) {
        element.style.backgroundImage = "";
        element.style.backgroundColor = this.BACKGROUND_COLOR;
      }
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = this.BACKGROUND_COLOR;
      if (element !== null) {
        element.style.backgroundImage = BACKGROUND_IMAGE;
        element.style.backgroundPosition = this.BACKGROUND_CENTERED;
      }
    }
  }

  private async handleUsernameAvailability(answer: boolean): Promise<void> {
    if (answer) {
      this.username = this.newUsername;
      UNListService.username = this.username;
      await this.router.navigate([GAMES_ROUTE]);
    } else {
      this.errorMessage = this.userService.message;
    }
  }
}
