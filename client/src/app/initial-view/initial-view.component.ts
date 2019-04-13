import {Component, Input, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import {BACKGROUND_IMAGE} from "../../../../common/communication/routes";
import { UNListService } from "../username.service";

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

  public constructor(
    public userService: UNListService,
    private router: Router,
  ) {
    this.handleUsernameAvailability = this.handleUsernameAvailability.bind(this);
  }

  public ngOnInit(): void {
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
      await this.router.navigate(["/games"]);
    } else {
      this.errorMessage = this.userService.message;
    }
  }
}
