import { Component, Input, OnInit } from "@angular/core";
import { UNListService } from "../username.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-vue",
  templateUrl: "./vue.component.html",
  styleUrls: ["./vue.component.css"],
})
export class VueComponent implements OnInit {

  @Input() public newUsername: string;
  public message: string;
  public username: string = "inconnu";
  public errorMessage: string = "";
  public available: boolean;

  public constructor(
    private router: Router,
    private userService: UNListService,
  ) { }

  ngOnInit() { }

  public async updateUsername(): Promise<void> {
    if (await this.userService.validateName(this.newUsername)) {
      this.username = this.newUsername;
      UNListService.username = this.username;

      this.router.navigate(["/game-list"])
    }
    this.errorMessage = this.userService.message;
  }
}
