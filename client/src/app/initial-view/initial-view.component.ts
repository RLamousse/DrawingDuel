import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  public readonly logoPath: string = require("./logo.png");

  public constructor(
    public userService: UNListService,
    private router: Router,
  ) { }

  public ngOnInit(): void {/*void*/}

  public async updateUsername(): Promise<void> {
    if (await this.userService.validateName(this.newUsername)) {
      this.username = this.newUsername;
      UNListService.username = this.username;
      await this.router.navigate(["/game-list"]);
    } else {
      this.errorMessage = this.userService.message;
    }
  }
}
