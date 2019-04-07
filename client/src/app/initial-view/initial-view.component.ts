import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import {BACKGROUND_IMAGE} from "../../../../common/communication/routes";
import { UNListService } from "../username.service";

@Component({
  selector: "app-initial-view",
  templateUrl: "./initial-view.component.html",
  styleUrls: ["./initial-view.component.css"],
})
export class InitialViewComponent {

  @Input() public newUsername: string;
  public username: string = "inconnu";
  public errorMessage: string = "";
  public available: boolean;
  private readonly BACKGROUND_COLOR: string = "#272731";

  public constructor(
    public userService: UNListService,
    private router: Router,
  ) {
    this.handleUsernameAvailability = this.handleUsernameAvailability.bind(this);
  }

  public updateUsername(): void {
    this.userService.checkAvailability(this.newUsername, this.handleUsernameAvailability);
  }

  protected changeBackground(): void {
    if (document.body.style.backgroundImage === "") {
      document.body.style.backgroundImage = BACKGROUND_IMAGE;
    } else {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundColor = this.BACKGROUND_COLOR;
    }
  }

  private async handleUsernameAvailability(answer: boolean): Promise<void> {
    if (answer) {
      this.username = this.newUsername;
      UNListService.username = this.username;
      await this.router.navigate(["/game-list"]);
    } else {
      this.errorMessage = this.userService.message;
    }
  }
}
