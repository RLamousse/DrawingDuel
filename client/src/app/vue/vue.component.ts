import { Component, Input, OnInit } from "@angular/core";
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
  ) { }

  ngOnInit() { }

  public async updateUsername(): Promise<boolean> {
    if (await this.userService.validateName(this.newUsername)) {
      this.username = this.newUsername;
      UNListService.username = this.username;

      return true;
    } else {
      this.errorMessage = this.userService.message;

      return false;
    }
  }

}
