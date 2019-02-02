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
<<<<<<< HEAD
    public userService: UNListService,
=======
    private router: Router,
    private userService: UNListService,
>>>>>>> 81926880c5a48c31c774dbf2849580800b8a927e
  ) { }

  ngOnInit() {}

  public async updateUsername(): Promise<void> {
    if (await this.userService.validateName(this.newUsername)) {
      this.username = this.newUsername;
      UNListService.username = this.username;

<<<<<<< HEAD
      return true;
    } else {
      this.errorMessage = this.userService.message;

      return false;
    }
=======
      this.router.navigate(["/game-list"]);
    }
    this.errorMessage = this.userService.message;
>>>>>>> 81926880c5a48c31c774dbf2849580800b8a927e
  }
}
