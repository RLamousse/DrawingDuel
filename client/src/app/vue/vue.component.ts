import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UNListService } from "../username.service";

@Component({
  selector: "app-vue",
  templateUrl: "./vue.component.html",
  styleUrls: ["./vue.component.css"],
})
export class VueComponent implements OnInit {

  @Input() public newUsername: string;
  public username: string = "inconnu";
  public errorMessage: string = "";
  public available: boolean;

  public constructor(
    public userService: UNListService,
    private router: Router,
  ) { }

  public ngOnInit() {}

  public async updateUsername(): Promise<void> {
    if (await this.userService.validateName(this.newUsername)) {
      this.username = this.newUsername;
      UNListService.username = this.username;
      this.router.navigate(["/game-list"]);
    } else {
      this.errorMessage = this.userService.message;
    }
  }
}
