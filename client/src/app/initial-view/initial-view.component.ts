import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
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
  public readonly logoPath: string = require("./logo.png");

  public constructor(
    public userService: UNListService,
    private router: Router,
  ) {
    this.handleUsernameAvailability = this.handleUsernameAvailability.bind(this);
  }

  public updateUsername(): void {
    this.userService.checkAvailability(this.newUsername, this.handleUsernameAvailability);
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
